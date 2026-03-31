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
export const PRIMARY_PLANNING_AGENTS = ['orchestrator', 'build', 'cursor'] as const
export const PRIMARY_PLANNING_AGENT_LABEL = 'orchestrator, cursor, or build agent'
export const PLANNING_SKILL_AGENTS = new Set(PRIMARY_PLANNING_AGENTS)
export const PLANNING_FILE_OWNERS = new Set(PRIMARY_PLANNING_AGENTS)
export const PLANNING_FILES = new Set([
  path.join('.plans', 'task_plan.md'),
  path.join('.plans', 'findings.md'),
  path.join('.plans', 'progress.md'),
])

export const TASK_TOOL = 'task'
export const FILE_UPDATE_TOOLS = new Set(['write', 'edit'])
export const PROGRESS_REMINDER = 'Update `.plans/progress.md` with what you just did. If a phase is now complete, update `.plans/task_plan.md` status.'
export const FINDINGS_REMINDER = 'If this result produced durable discoveries, constraints, or reusable context, consolidate them into `.plans/findings.md` before continuing.'
export const PERSIST_RESULT_REMINDER = 'After any meaningful tool result, and especially after any `task` or subagent result, persist the important outcome before continuing when shared planning memory should carry it forward.'
