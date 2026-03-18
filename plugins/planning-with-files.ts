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
import type { Plugin } from '@opencode-ai/plugin'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const SKILL_DIR = path.join(__dirname, '..', 'skills', 'planning-with-files')
const CHECK_COMPLETE = path.join(SKILL_DIR, 'scripts', 'check-complete.sh')
const PLANNING_AGENTS = new Set(['orchestrator', 'build'])

const WATCHED_TOOLS = new Set(['read', 'write', 'edit', 'bash', 'glob', 'grep'])
const FILE_UPDATE_TOOLS = new Set(['write', 'edit'])

type MutableToolResult = {
  output?: string
}

function append(output: MutableToolResult, msg: string): void {
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

export const PlanningWithFilesPlugin: Plugin = async ({
  client,
  directory,
  worktree,
}) => {
  const root = worktree ?? directory
  const sessionAgentCache = new Map<string, boolean>()
  const lastPlanningStatus = new Map<string, string>()
  const pendingPlanByCallID = new Map<string, string>()

  async function toast(title: string, message: string): Promise<void> {
    try {
      await client.tui.showToast({
        body: {
          message: `${title}: ${message}`,
          variant: 'info',
        },
      })
    } catch {
      return
    }
  }

  function isPlanningSession(sessionID?: string): boolean {
    if (!sessionID) return false
    return sessionAgentCache.get(sessionID) === true
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
    'chat.message': async (input: { sessionID: string; agent?: string }) => {
      if (!input.agent) return

      const shouldPlan = PLANNING_AGENTS.has(input.agent)
      sessionAgentCache.set(input.sessionID, shouldPlan)

      if (!shouldPlan) {
        lastPlanningStatus.delete(input.sessionID)
      }
    },

    // Nudge agent to load the skill before complex tasks
    'experimental.chat.system.transform': async (
      input: { sessionID?: string; model: unknown },
      output: { system: string[] },
    ) => {
      if (!isPlanningSession(input.sessionID)) return

      output.system.push(
        "Use OpenCode's native `skill` tool to load `planning-with-files` before starting any complex, multi-step task.",
      )
      await toast('Planning', 'Hint added')
    },

    // PreToolUse equivalent — show head of task_plan.md before every watched tool
    'tool.execute.before': async (
      input: { tool: string; sessionID: string; callID: string },
      _output: { args: unknown },
    ) => {
      if (!isPlanningSession(input.sessionID)) return

      const tool = input.tool.toLowerCase()
      if (!WATCHED_TOOLS.has(tool)) return

      const head = await planHead(root)
      if (head) {
        pendingPlanByCallID.set(input.callID, head)
        await toast('Planning', `Plan queued: ${tool}`)
      }
    },

    // PostToolUse equivalent — remind to update plan after file writes/edits
    'tool.execute.after': async (
      input: { tool: string; sessionID: string; callID: string; args: unknown },
      output: { title: string; output: string; metadata: unknown },
    ) => {
      if (!isPlanningSession(input.sessionID)) return

      const tool = input.tool.toLowerCase()
      const mutableOutput = output as MutableToolResult
      let changed = false

      const head = pendingPlanByCallID.get(input.callID)
      if (head) {
        pendingPlanByCallID.delete(input.callID)
        append(mutableOutput, planOutputBlock(head))
        changed = true
      }

      if (FILE_UPDATE_TOOLS.has(tool)) {
        append(mutableOutput, updateReminderBlock())
        changed = true

        const status = await planningStatus(root)
        if (status) {
          const lastStatus = lastPlanningStatus.get(input.sessionID)
          if (lastStatus !== status) {
            lastPlanningStatus.set(input.sessionID, status)
            append(mutableOutput, statusOutputBlock(status))
            changed = true
          }
        }
      }

      if (changed) {
        await toast('Planning', `Output added: ${tool}`)
      }
    },
  }
}
