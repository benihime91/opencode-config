/**
 * Planning with Files — messages
 *
 * Output blocks and reminder text for planning hook injections.
 */

import {
  FINDINGS_REMINDER,
  PERSIST_RESULT_REMINDER,
  PRIMARY_PLANNING_AGENT_LABEL,
  PROGRESS_REMINDER,
  TASK_TOOL,
} from './constants'

export type MutableToolResult = {
  output?: string
}

export function append(output: MutableToolResult, msg: string): void {
  output.output = output.output ? `${output.output}\n\n${msg}` : msg
}

export function planOutputBlock(head: string): string {
  return ['Planning with Files', 'Current plan:', '```', head, '```'].join('\n')
}

export function promptContextBlock(plan: string, progress: string): string {
  const parts = ['[planning-with-files] ACTIVE PLAN - current state:']

  if (plan) parts.push('```', plan, '```')
  parts.push('=== recent progress ===')
  if (progress) parts.push('```', progress, '```')
  parts.push('[planning-with-files] Read `.plans/findings.md` for research context. Continue from the current phase.')

  return parts.join('\n')
}

export function primarySystemBlock(): string {
  return [
    'Planning with Files',
    'This session is a primary planning-memory agent. Always follow the planning-with-files workflow in this repo.',
    'Treat `.plans/task_plan.md`, `.plans/findings.md`, and `.plans/progress.md` as shared memory.',
    PERSIST_RESULT_REMINDER,
    'For complex or multi-step work, load `planning-with-files` before continuing.',
  ].join('\n')
}

export function readOnlySystemBlock(): string {
  return [
    'Planning with Files',
    'Read `.plans/task_plan.md`, `.plans/findings.md`, and `.plans/progress.md` before acting.',
    'Treat those planning files as shared memory and read-only in this session.',
    `Hand durable outcomes back so the ${PRIMARY_PLANNING_AGENT_LABEL} can persist them.`,
  ].join('\n')
}

export function ownerReminderBlock(tool: string): string {
  const lines = [
    'Planning with Files',
    `Reminder: ${PERSIST_RESULT_REMINDER}`,
    `Reminder: ${PROGRESS_REMINDER}`,
    FINDINGS_REMINDER,
  ]

  if (tool === TASK_TOOL) {
    lines.push('This result came from delegated work. Persist the durable outcome before the next wave or decision.')
  }

  return lines.join('\n')
}

export function ownerTaskReminderBlock(subagentType?: string): string {
  const lines = [
    'Planning with Files',
    `Reminder: ${PERSIST_RESULT_REMINDER}`,
    `Reminder: ${PROGRESS_REMINDER}`,
  ]

  if (subagentType) {
    lines.push(
      `You just received results from @${subagentType}. Persist the durable outcome before starting the next wave or delegation.`,
    )
  }

  lines.push(FINDINGS_REMINDER)
  return lines.join('\n')
}

export function readOnlyReminderBlock(tool: string): string {
  const lines = [
    'Planning with Files',
    `Reminder: Hand results back so the ${PRIMARY_PLANNING_AGENT_LABEL} can update the shared planning memory.`,
  ]

  if (tool === TASK_TOOL) {
    lines.push('If this result contains reusable findings, make sure they are consolidated into `.plans/findings.md` before the next step.')
  }

  return lines.join('\n')
}

export function readOnlyTaskReminderBlock(subagentType?: string): string {
  const lines = [
    'Planning with Files',
    `Reminder: Hand results back so the ${PRIMARY_PLANNING_AGENT_LABEL} can update the shared planning memory.`,
  ]

  if (subagentType) {
    lines.push(
      `This came from @${subagentType}. If it produced reusable findings, make sure they are consolidated into .plans/findings.md before the next step.`,
    )
  } else {
    lines.push('If this result contains reusable findings, make sure they are consolidated into `.plans/findings.md` before the next step.')
  }

  return lines.join('\n')
}

export function statusOutputBlock(status: string): string {
  return ['Planning with Files', 'Status:', '```', status, '```'].join('\n')
}
