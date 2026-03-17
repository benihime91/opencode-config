/**
 * Planning with Files — plugin
 *
 * The full Manus-style planning methodology lives in the
 * `planning-with-files` skill (skills/planning-with-files/SKILL.md).
 *
 * This plugin mirrors the hooks that SKILL.md declares (unsupported by
 * OpenCode's skill runner) so the same behaviour is active at runtime:
 *
 *   PreToolUse  (Write|Edit|Bash|Read|Glob|Grep)  → show head of docs/task_plan.md
 *   PostToolUse (Write|Edit)                       → remind to update docs/task_plan.md
 *   Stop                                           → run scripts/check-complete.sh (against docs/task_plan.md)
 */

import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'

type SessionMessageItem = {
  info: {
    agent?: string
  }
}

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const SKILL_DIR = path.join(__dirname, '..', 'skills', 'planning-with-files')
const CHECK_COMPLETE = path.join(SKILL_DIR, 'scripts', 'check-complete.sh')
const PLANNING_AGENTS = new Set(['orchestrator', 'build'])

const WATCHED_TOOLS = new Set(['read', 'write', 'edit', 'bash', 'glob', 'grep'])
const FILE_UPDATE_TOOLS = new Set(['write', 'edit'])

function append(output: { output?: string }, msg: string): void {
  output.output = output.output ? `${output.output}\n\n${msg}` : msg
}

function planOutputBlock(head: string): string {
  return ['Planning with Files', 'Current plan:', '```', head, '```'].join('\n')
}

function updateReminderBlock(): string {
  return ['Planning with Files', 'Reminder: If this completed a phase, update `docs/task_plan.md`.'].join('\n')
}

function statusOutputBlock(status: string): string {
  return ['Planning with Files', 'Status:', '```', status, '```'].join('\n')
}

async function planHead(root: string): Promise<string> {
  try {
    const content = await fs.promises.readFile(path.join(root, 'docs', 'task_plan.md'), 'utf8')
    return content.split('\n').slice(0, 30).join('\n').trim()
  } catch {
    return ''
  }
}

export const PlanningWithFilesPlugin = async ({
  client,
  directory,
  worktree,
}: {
  client: {
    session: {
      messages: (input: { path: { id: string } }) => Promise<{ data?: SessionMessageItem[] }>
    }
  }
  directory: string
  worktree?: string
}) => {
  const root = worktree ?? directory
  const sessionAgentCache = new Map<string, string>()
  const lastPlanningStatus = new Map<string, string>()

  async function resolveSessionAgent(sessionID?: string): Promise<string | undefined> {
    if (!sessionID) return undefined

    const cached = sessionAgentCache.get(sessionID)
    if (cached) return cached

    try {
      const result = await client.session.messages({ path: { id: sessionID } })
      const messages = result.data ?? []

      for (let i = messages.length - 1; i >= 0; i -= 1) {
        const agent = messages[i]?.info?.agent
        if (agent) {
          sessionAgentCache.set(sessionID, agent)
          return agent
        }
      }
    } catch {
      return undefined
    }

    return undefined
  }

  async function shouldApplyPlanning(sessionID?: string): Promise<boolean> {
    const agent = await resolveSessionAgent(sessionID)
    return agent ? PLANNING_AGENTS.has(agent) : false
  }

  async function planningStatus(rootDir: string): Promise<string> {
    try {
      const { $ } = await import('bun')
      const docsDir = path.join(rootDir, 'docs')
      const result = await $`sh ${CHECK_COMPLETE} ${path.join(docsDir, 'task_plan.md')}`.cwd(docsDir).text()
      return result.trim()
    } catch {
      return ''
    }
  }

  return {
    // Nudge agent to load the skill before complex tasks
    'experimental.chat.system.transform': async (
      input: { sessionID?: string },
      output: { system?: string[] },
    ) => {
      if (!(await shouldApplyPlanning(input.sessionID))) return

      ;(output.system ??= []).push(
        "Use OpenCode's native `skill` tool to load `planning-with-files` before starting any complex, multi-step task.",
      )
    },

    // PreToolUse equivalent — show head of task_plan.md before every watched tool
    'tool.execute.before': async (
      input: { tool: string; sessionID: string },
      output: { output?: string },
    ) => {
      if (!(await shouldApplyPlanning(input.sessionID))) return

      const tool = input.tool.toLowerCase()
      if (!WATCHED_TOOLS.has(tool)) return

      const head = await planHead(root)
      if (head) {
        append(output, planOutputBlock(head))
      }
    },

    // PostToolUse equivalent — remind to update plan after file writes/edits
    'tool.execute.after': async (
      input: { tool: string; sessionID: string },
      output: { output?: string },
    ) => {
      if (!(await shouldApplyPlanning(input.sessionID))) return

      const tool = input.tool.toLowerCase()
      if (!FILE_UPDATE_TOOLS.has(tool)) return

      append(output, updateReminderBlock())

      const status = await planningStatus(root)
      if (!status) return

      const lastStatus = lastPlanningStatus.get(input.sessionID)
      if (lastStatus === status) return

      lastPlanningStatus.set(input.sessionID, status)
      append(output, statusOutputBlock(status))
    },

    event: async ({ event }: { event: { type: string; properties: Record<string, unknown> } }) => {
      if (event.type === 'message.updated') {
        const info = event.properties.info as { sessionID?: string; agent?: string } | undefined
        if (info?.sessionID && info.agent) {
          sessionAgentCache.set(info.sessionID, info.agent)
        }

        return
      }

      return
    },
  }
}
