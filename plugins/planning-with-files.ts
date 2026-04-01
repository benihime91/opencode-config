/**
 * Planning with Files — plugin
 *
 * Mirrors the original skill's hook behavior at runtime:
 *   - PreToolUse  (Write|Edit|Bash|Read|Glob|Grep) → inject plan head
 *   - PostToolUse (Write|Edit only)                 → simple one-liner reminder
 *   - Task results                                  → slightly stronger reminder
 *   - Planning-file writes                          → NO reminder (self-loop breaker)
 */

import type { Plugin } from '@opencode-ai/plugin'
import {
  FILE_UPDATE_TOOLS,
  PRE_TOOL_USE_TOOLS,
  REMINDER_TOOLS,
  TASK_TOOL,
} from './planning-with-files/constants'
import {
  planHead,
  planningStatus,
  recentProgress,
  requestedSubagentType,
  touchesPlanningFile,
} from './planning-with-files/files'
import {
  append,
  ownerReminderBlock,
  ownerTaskReminderBlock,
  planOutputBlock,
  primarySystemBlock,
  promptContextBlock,
  readOnlyReminderBlock,
  readOnlySystemBlock,
  readOnlyTaskReminderBlock,
  statusOutputBlock,
  type MutableToolResult,
} from './planning-with-files/messages'
import { PlanningSessionCache } from './planning-with-files/session-cache'

type SessionEvent = {
  type?: string
  sessionID?: string
  session_id?: string
}

function ownerIntakeReminderBlock(): string {
  return [
    '[planning-with-files]',
    'For complex work, keep the intake snapshot lightweight: intended outcome, known facts, unknowns or blockers, non-goals, decision boundaries, and readiness.',
  ].join('\n')
}

function ownerCloseoutReminderBlock(): string {
  return [
    '[planning-with-files]',
    'When you persist progress or close a phase, note what changed, what was verified, and what remains open.',
  ].join('\n')
}

function readOnlyContinuityReminderBlock(): string {
  return [
    '[planning-with-files]',
    'Keep notes ownership-safe: hand back the intended outcome, known facts, blockers, non-goals, decision boundaries, readiness, plus what changed, what was verified, and what remains open.',
  ].join('\n')
}

export const PlanningWithFilesPlugin: Plugin = async ({
  client,
  directory,
  worktree,
}) => {
  const root = worktree ?? directory
  const cache = new PlanningSessionCache()

  async function toast(title: string, message: string): Promise<void> {
    try {
      await client.tui.showToast({
        body: { message: `${title}: ${message}`, variant: 'info' },
      })
    } catch {
      return
    }
  }

  async function maybeAppendStatus(
    sessionID: string,
    mutableOutput: MutableToolResult,
    hasFlowReminder: boolean,
  ): Promise<boolean> {
    if (!cache.isPlanningFileOwner(sessionID)) return false

    const status = await planningStatus(root)
    if (!status) return false

    if (!cache.shouldAppendStatus(sessionID, status)) return false

    append(mutableOutput, statusOutputBlock(status))
    if (!hasFlowReminder) {
      append(mutableOutput, ownerCloseoutReminderBlock())
    }
    return true
  }

  return {
    'chat.message': async (input: { sessionID: string; agent?: string }) => {
      cache.registerSession(input.sessionID, input.agent)
    },

    'experimental.chat.system.transform': async (
      input: { sessionID?: string; model: unknown },
      output: { system: string[] },
    ) => {
      if (!cache.hasKnownAgent(input.sessionID)) return

      const isPlanningSkill = cache.isPlanningSkillSession(input.sessionID)
      const isPlanningNudge = cache.isPlanningNudgeSession(input.sessionID)

      if (!isPlanningSkill && !isPlanningNudge) return

      if (isPlanningSkill) {
        const [head, progress] = await Promise.all([
          planHead(root, 50),
          recentProgress(root),
        ])
        if (head || progress) {
          output.system.push(promptContextBlock(head, progress))
        }

        output.system.push(primarySystemBlock())
        output.system.push(ownerIntakeReminderBlock())
        output.system.push(ownerCloseoutReminderBlock())
        await toast('Planning', 'Hint added')
        return
      }

      output.system.push(readOnlySystemBlock())
      output.system.push(readOnlyContinuityReminderBlock())
    },

    'tool.execute.before': async (
      input: { tool: string; sessionID: string; callID: string },
      output: { args: unknown },
    ) => {
      if (!cache.hasKnownAgent(input.sessionID)) return

      const tool = input.tool.toLowerCase()
      const isPlanningOwner = cache.isPlanningFileOwner(input.sessionID)
      const isPlanningNudge = cache.isPlanningNudgeSession(input.sessionID)

      if (!isPlanningOwner && !isPlanningNudge) return

      if (
        FILE_UPDATE_TOOLS.has(tool) &&
        !isPlanningOwner &&
        touchesPlanningFile(root, output.args)
      ) {
        throw new Error(
          'Only Zeus or Hermes may create or update `.plans/task_plan.md`, `.plans/findings.md`, or `.plans/progress.md`.',
        )
      }

      if (tool === TASK_TOOL) {
        const subagentType = requestedSubagentType(output.args)
        cache.rememberPendingTaskAgent(input.callID, subagentType)
      }

      // Only cache plan head for the original PreToolUse matcher: Write|Edit|Bash|Read|Glob|Grep + Task
      if (!PRE_TOOL_USE_TOOLS.has(tool) && tool !== TASK_TOOL) return

      const head = await planHead(root)
      if (!head) return

      cache.rememberPendingPlan(input.callID, head)
      await toast('Planning', `Plan queued: ${tool}`)
    },

    'tool.execute.after': async (
      input: { tool: string; sessionID: string; callID: string; args: unknown },
      output: { title: string; output: string; metadata: unknown },
    ) => {
      if (!cache.hasKnownAgent(input.sessionID)) return

      const tool = input.tool.toLowerCase()
      const mutableOutput = output as MutableToolResult
      const isPlanningOwner = cache.isPlanningFileOwner(input.sessionID)
      const isPlanningNudge = cache.isPlanningNudgeSession(input.sessionID)

      if (!isPlanningOwner && !isPlanningNudge) return

      // Inject plan head from PreToolUse cache (always, when available)
      const head = cache.takePendingPlan(input.callID)
      if (head) {
        append(mutableOutput, planOutputBlock(head))
      }

      const delegatedAgent = cache.takePendingTaskAgent(input.callID)
      let hasFlowReminder = false

      function appendFlowReminder(): void {
        if (hasFlowReminder) return

        append(
          mutableOutput,
          isPlanningOwner
            ? ownerCloseoutReminderBlock()
            : readOnlyContinuityReminderBlock(),
        )
        hasFlowReminder = true
      }

      // === Reminder logic: match original skill's PostToolUse behavior ===
      //
      // Original skill: PostToolUse fires ONLY for Write|Edit, with a simple one-liner.
      // Task tool: slightly stronger reminder (persist subagent outcomes).
      // Planning-file writes: NO reminder (self-loop breaker).
      // Everything else: NO reminder.

      if (tool === TASK_TOOL) {
        // Task/subagent results always get a reminder — these are the most important to persist
        const reminder = isPlanningOwner
          ? ownerTaskReminderBlock(delegatedAgent)
          : readOnlyTaskReminderBlock(delegatedAgent)
        append(mutableOutput, reminder)
        appendFlowReminder()
      } else if (REMINDER_TOOLS.has(tool)) {
        // Write|Edit that targets a planning file → skip reminder (self-loop breaker)
        if (touchesPlanningFile(root, input.args)) {
          // No reminder — the model just updated planning files, don't ask it to do so again
        } else {
          // Write|Edit to non-planning files → simple one-liner (matches original PostToolUse)
          const reminder = isPlanningOwner
            ? ownerReminderBlock()
            : readOnlyReminderBlock()
          append(mutableOutput, reminder)
          appendFlowReminder()
        }
      }
      // All other tools (read, grep, glob, bash, etc.) → no reminder

      await maybeAppendStatus(input.sessionID, mutableOutput, hasFlowReminder)
    },

    event: async (input: { event: SessionEvent }) => {
      if (input.event.type !== 'session.idle') return

      const sessionID = input.event.sessionID ?? input.event.session_id
      if (!cache.isPlanningFileOwner(sessionID)) return

      const status = await planningStatus(root)
      if (status) {
        await toast('Planning', status)
      }
    },
  }
}
