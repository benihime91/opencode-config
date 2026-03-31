/**
 * Planning with Files — plugin
 *
 * Mirrors planning-skill hook behavior at runtime and keeps planning-memory reminders active.
 */

import type { Plugin } from '@opencode-ai/plugin'
import {
  FILE_UPDATE_TOOLS,
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
  ): Promise<boolean> {
    if (!cache.isPlanningFileOwner(sessionID)) return false

    const status = await planningStatus(root)
    if (!status) return false

    if (!cache.shouldAppendStatus(sessionID, status)) return false

    append(mutableOutput, statusOutputBlock(status))
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

      const [head, progress] = await Promise.all([
        planHead(root),
        recentProgress(root),
      ])
      if (head || progress) {
        output.system.push(promptContextBlock(head, progress))
      }

      if (cache.isPlanningSkillSession(input.sessionID)) {
        output.system.push(primarySystemBlock())
        await toast('Planning', 'Hint added')
        return
      }

      output.system.push(readOnlySystemBlock())
    },

    'tool.execute.before': async (
      input: { tool: string; sessionID: string; callID: string },
      output: { args: unknown },
    ) => {
      if (!cache.hasKnownAgent(input.sessionID)) return

      const tool = input.tool.toLowerCase()
      if (
        FILE_UPDATE_TOOLS.has(tool) &&
        !cache.isPlanningFileOwner(input.sessionID) &&
        touchesPlanningFile(root, output.args)
      ) {
        throw new Error(
          'Only the orchestrator, cursor, or build agent may create or update `.plans/task_plan.md`, `.plans/findings.md`, or `.plans/progress.md`.',
        )
      }

      if (tool === 'task') {
        const subagentType = requestedSubagentType(output.args)
        cache.rememberPendingTaskAgent(input.callID, subagentType)
      }

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
      let changed = false
      const delegatedAgent = cache.takePendingTaskAgent(input.callID)

      const head = cache.takePendingPlan(input.callID)
      if (head) {
        append(mutableOutput, planOutputBlock(head))
        changed = true
      }

      const reminder = tool === 'task'
        ? cache.isPlanningFileOwner(input.sessionID)
          ? ownerTaskReminderBlock(delegatedAgent)
          : readOnlyTaskReminderBlock(delegatedAgent)
        : cache.isPlanningFileOwner(input.sessionID)
          ? ownerReminderBlock(tool)
          : readOnlyReminderBlock(tool)

      append(mutableOutput, reminder)
      changed = true

      if (await maybeAppendStatus(input.sessionID, mutableOutput)) {
        changed = true
      }

      if (changed) {
        await toast(
          'Planning',
          'Update `.plans/progress.md` with what you just did. If a phase is now complete, update `.plans/task_plan.md` status.',
        )
      }
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
