/**
 * Planning with Files — constants
 *
 * Shared constants for planning hook behavior and ownership rules.
 */

import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const SKILL_DIR = path.join(__dirname, '..', '..', 'skills', 'planning-with-files')

export const CHECK_COMPLETE = path.join(SKILL_DIR, 'scripts', 'check-complete.sh')
export const PRIMARY_PLANNING_AGENTS = ['shikamaru', 'urahara'] as const
export const PRIMARY_PLANNING_AGENT_LABEL = 'Shikamaru, Urahara'
export const NUDGE_ONLY_PLANNING_AGENTS = [
  'hinata',
  'kenma',
  'gojo',
  'oikawa',
  'nanami',
  'planner',
] as const
export const NUDGE_ONLY_PLANNING_AGENT_LABEL = 'Hinata, Kenma, Gojo, Oikawa, Nanami, Planner'
export const PLANNING_SKILL_AGENTS = new Set(PRIMARY_PLANNING_AGENTS)
export const PLANNING_NUDGE_AGENTS = new Set(NUDGE_ONLY_PLANNING_AGENTS)
export const PLANNING_FILE_OWNERS = new Set(PRIMARY_PLANNING_AGENTS)
export const PLANNING_FILES = new Set([
  path.join('.plans', 'task_plan.md'),
  path.join('.plans', 'findings.md'),
  path.join('.plans', 'progress.md'),
])

export const TASK_TOOL = 'task'
export const FILE_UPDATE_TOOLS = new Set(['write', 'edit'])

/** Tools that trigger plan-head injection before execution (state-changing / high-impact only; avoids noise on read-only discovery). */
export const PRE_TOOL_USE_TOOLS = new Set(['write', 'edit', 'bash'])

/** Tools that trigger the PostToolUse reminder — matches the original skill's PostToolUse matcher. */
export const REMINDER_TOOLS = new Set(['write', 'edit'])

/** Simple one-liner matching the original skill's PostToolUse output. */
export const PROGRESS_REMINDER = 'Update `.plans/progress.md` with what you just did. If a phase is now complete, update `.plans/task_plan.md` status.'
