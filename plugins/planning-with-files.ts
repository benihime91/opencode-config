/**
 * Planning with Files — plugin
 *
 * The full Manus-style planning methodology lives in the
 * `planning-with-files` skill (skills/planning-with-files/SKILL.md).
 *
 * This plugin mirrors the hooks that SKILL.md declares (unsupported by
 * OpenCode's skill runner) so similar behaviour is active at runtime:
 *
 *   User prompt submit                              → inject current plan + recent progress
 *   PreToolUse  (Write|Edit|Bash|Read|Glob|Grep)   → show head of docs/task_plan.md
 *   PostToolUse (Write|Edit)                       → owner reminder or subagent handoff reminder
 *   Planning file ownership                        → only orchestrator/build may write docs/{task_plan,findings,progress}.md
 */

import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'
import type { Plugin } from '@opencode-ai/plugin'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const SKILL_DIR = path.join(__dirname, '..', 'skills', 'planning-with-files')
const CHECK_COMPLETE = path.join(SKILL_DIR, 'scripts', 'check-complete.sh')
const PLANNING_SKILL_AGENTS = new Set(['orchestrator'])
const PLANNING_FILE_OWNERS = new Set(['orchestrator', 'build'])
const PLANNING_FILES = new Set([
  path.join('docs', 'task_plan.md'),
  path.join('docs', 'findings.md'),
  path.join('docs', 'progress.md'),
])

const WATCHED_TOOLS = new Set(['read', 'write', 'edit', 'bash', 'glob', 'grep'])
const FILE_UPDATE_TOOLS = new Set(['write', 'edit'])

type MutableToolResult = {
  output?: string
}

type SessionEvent = {
  type?: string
  sessionID?: string
  session_id?: string
}

function append(output: MutableToolResult, msg: string): void {
  output.output = output.output ? `${output.output}\n\n${msg}` : msg
}

function planOutputBlock(head: string): string {
  return ['Planning with Files', 'Current plan:', '```', head, '```'].join('\n')
}

function promptContextBlock(plan: string, progress: string): string {
  const parts = ['[planning-with-files] ACTIVE PLAN - current state:']

  if (plan) {
    parts.push('```', plan, '```')
  }

  parts.push('=== recent progress ===')

  if (progress) {
    parts.push('```', progress, '```')
  }

  parts.push(
    '[planning-with-files] Read `docs/findings.md` for research context. Continue from the current phase.',
  )

  return parts.join('\n')
}

function updateReminderBlock(): string {
  return [
    'Planning with Files',
    'Reminder: Update `docs/progress.md` with what you just did. If this completed a phase, update `docs/task_plan.md` status.',
  ].join('\n')
}

function readOnlyReminderBlock(): string {
  return [
    'Planning with Files',
    'Reminder: Planning files are orchestrator/build-owned in this session. Hand results back so `docs/progress.md` and `docs/task_plan.md` stay current.',
  ].join('\n')
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

async function recentProgress(root: string): Promise<string> {
  try {
    const content = await fs.promises.readFile(path.join(root, 'docs', 'progress.md'), 'utf8')
    return content.split('\n').slice(-20).join('\n').trim()
  } catch {
    return ''
  }
}

function collectPathStrings(value: unknown, results = new Set<string>()): Set<string> {
  if (typeof value === 'string') {
    results.add(value)
    return results
  }

  if (Array.isArray(value)) {
    for (const item of value) collectPathStrings(item, results)
    return results
  }

  if (!value || typeof value !== 'object') {
    return results
  }

  for (const [key, entry] of Object.entries(value as Record<string, unknown>)) {
    if (/path|file/i.test(key)) {
      collectPathStrings(entry, results)
      continue
    }

    if (Array.isArray(entry) || (entry && typeof entry === 'object')) {
      collectPathStrings(entry, results)
    }
  }

  return results
}

function normalizeRelative(root: string, target: string): string {
  return path.relative(root, path.resolve(root, target))
}

function touchesPlanningFile(root: string, args: unknown): boolean {
  for (const filePath of collectPathStrings(args)) {
    const normalized = normalizeRelative(root, filePath)
    if (PLANNING_FILES.has(normalized)) {
      return true
    }
  }

  return false
}

export const PlanningWithFilesPlugin: Plugin = async ({
  client,
  directory,
  worktree,
}) => {
  const root = worktree ?? directory
  const sessionAgentCache = new Map<string, string>()
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

  function hasKnownAgent(sessionID?: string): boolean {
    if (!sessionID) return false
    return sessionAgentCache.has(sessionID)
  }

  function isPlanningSkillSession(sessionID?: string): boolean {
    if (!sessionID) return false
    const agent = sessionAgentCache.get(sessionID)
    return agent ? PLANNING_SKILL_AGENTS.has(agent) : false
  }

  function isPlanningFileOwner(sessionID?: string): boolean {
    if (!sessionID) return false
    const agent = sessionAgentCache.get(sessionID)
    return agent ? PLANNING_FILE_OWNERS.has(agent) : false
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

      sessionAgentCache.set(input.sessionID, input.agent)

      if (!PLANNING_FILE_OWNERS.has(input.agent)) {
        lastPlanningStatus.delete(input.sessionID)
      }
    },

    // UserPromptSubmit equivalent — seed plan/progress into the next turn.
    'experimental.chat.system.transform': async (
      input: { sessionID?: string; model: unknown },
      output: { system: string[] },
    ) => {
      if (!hasKnownAgent(input.sessionID)) return

      const [head, progress] = await Promise.all([planHead(root), recentProgress(root)])
      if (head || progress) {
        output.system.push(promptContextBlock(head, progress))
      }

      if (isPlanningSkillSession(input.sessionID)) {
        output.system.push(
          "Use OpenCode's native `skill` tool to load `planning-with-files` before starting any complex, multi-step task.",
        )
        await toast('Planning', 'Hint added')
        return
      }

      output.system.push(
        'Do not load `planning-with-files` in this session. Read `docs/task_plan.md`, `docs/findings.md`, and `docs/progress.md` before doing anything. Treat those planning files as read-only unless you are the orchestrator or build agent.',
      )
    },

    // PreToolUse equivalent — show head of task_plan.md before every watched tool
    'tool.execute.before': async (
      input: { tool: string; sessionID: string; callID: string },
      output: { args: unknown },
    ) => {
      if (!hasKnownAgent(input.sessionID)) return

      const tool = input.tool.toLowerCase()

      if ((tool === 'write' || tool === 'edit') && !isPlanningFileOwner(input.sessionID)) {
        if (touchesPlanningFile(root, output.args)) {
          throw new Error(
            'Only the orchestrator or build agent may create or update `docs/task_plan.md`, `docs/findings.md`, or `docs/progress.md`.',
          )
        }
      }

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
      if (!hasKnownAgent(input.sessionID)) return

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
        append(
          mutableOutput,
          isPlanningFileOwner(input.sessionID)
            ? updateReminderBlock()
            : readOnlyReminderBlock(),
        )
        changed = true

        if (isPlanningFileOwner(input.sessionID)) {
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
      }

      if (changed) {
        await toast('Planning', `Output added: ${tool}`)
      }
    },

    // Closest available runtime equivalent to a Stop hook.
    event: async (input: { event: SessionEvent }) => {
      if (input.event.type !== 'session.idle') return

      const sessionID = input.event.sessionID ?? input.event.session_id
      if (!isPlanningFileOwner(sessionID)) return

      const status = await planningStatus(root)
      if (status) {
        await toast('Planning', status)
      }
    },
  }
}
