/**
 * Planning with Files — plugin
 *
 * Hooks into the OpenCode plugin API (v1.4.x) to enforce planning workflows:
 *   - chat.message                          → register agent roles per session
 *   - experimental.chat.system.transform    → inject plan context into system prompt
 *   - tool.execute.before                   → pre-tool plan head injection + ownership guard
 *   - tool.execute.after                    → post-tool reminders (Write|Edit, Task results)
 *   - experimental.session.compacting       → preserve planning state across compaction
 *   - event (session.idle)                  → toast planning status
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

function ownerIntakeReminderBlock(): string {
  return [
    '[planning-with-files]',
    'For long-running, multi-session, or high-risk work, keep the intake snapshot lightweight: intended outcome, known facts, unknowns or blockers, non-goals, decision boundaries, and readiness.',
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
    'chat.message': async (input) => {
      cache.registerSession(input.sessionID, input.agent)
    },

    'experimental.chat.system.transform': async (input, output) => {
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

    'tool.execute.before': async (input, output) => {
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
          'Only Shikamaru or Urahara may create or update `.plans/task_plan.md`, `.plans/findings.md`, or `.plans/progress.md`.',
        )
      }

      if (tool === TASK_TOOL) {
        const subagentType = requestedSubagentType(output.args)
        cache.rememberPendingTaskAgent(input.callID, subagentType)
      }

      if (!PRE_TOOL_USE_TOOLS.has(tool) && tool !== TASK_TOOL) return

      const head = await planHead(root)
      if (!head) return

      cache.rememberPendingPlan(input.callID, head)
      await toast('Planning', `Plan queued: ${tool}`)
    },

    'tool.execute.after': async (input, output) => {
      if (!cache.hasKnownAgent(input.sessionID)) return

      const tool = input.tool.toLowerCase()
      const mutableOutput = output as MutableToolResult
      const isPlanningOwner = cache.isPlanningFileOwner(input.sessionID)
      const isPlanningNudge = cache.isPlanningNudgeSession(input.sessionID)

      if (!isPlanningOwner && !isPlanningNudge) return

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

      if (tool === TASK_TOOL) {
        const reminder = isPlanningOwner
          ? ownerTaskReminderBlock(delegatedAgent)
          : readOnlyTaskReminderBlock(delegatedAgent)
        append(mutableOutput, reminder)
        appendFlowReminder()
      } else if (REMINDER_TOOLS.has(tool)) {
        if (touchesPlanningFile(root, input.args)) {
          // Self-loop breaker: skip reminder when the model just wrote to planning files
        } else {
          const reminder = isPlanningOwner
            ? ownerReminderBlock()
            : readOnlyReminderBlock()
          append(mutableOutput, reminder)
          appendFlowReminder()
        }
      }

      await maybeAppendStatus(input.sessionID, mutableOutput, hasFlowReminder)
    },

    'experimental.session.compacting': async (_input, output) => {
      const [head, progress] = await Promise.all([
        planHead(root, 50),
        recentProgress(root),
      ])
      if (!head && !progress) return

      const sections: string[] = [
        '## Planning with Files — Active State',
        '',
        'Preserve the following planning context across compaction:',
      ]
      if (head) {
        sections.push('', '### Current Plan (`.plans/task_plan.md`)', '```', head, '```')
      }
      if (progress) {
        sections.push('', '### Recent Progress (`.plans/progress.md`)', '```', progress, '```')
      }
      sections.push(
        '',
        'After compaction, read `.plans/task_plan.md` and `.plans/progress.md` for full context. Continue from the current phase.',
      )
      output.context.push(sections.join('\n'))
    },

    event: async (input) => {
      const event = input.event as { type?: string; sessionID?: string; session_id?: string }
      if (event.type !== 'session.idle') return

      const sessionID = event.sessionID ?? event.session_id
      if (!cache.isPlanningFileOwner(sessionID)) return

      const status = await planningStatus(root)
      if (status) {
        await toast('Planning', status)
      }
    },
  }
}
