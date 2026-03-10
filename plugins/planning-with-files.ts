/**
 * Planning with Files plugin for OpenCode
 *
 * Implements Manus-style file-based planning. Instructions and templates are
 * loaded from the sibling `planning-with-files/` directory at runtime.
 */

import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const DATA_DIR = path.join(__dirname, 'planning-with-files')

// ─── Load data files once at startup ─────────────────────────────────────────

function loadFile(relPath: string): string {
  try {
    return fs.readFileSync(path.join(DATA_DIR, relPath), 'utf8').trim()
  } catch {
    return ''
  }
}

const INSTRUCTIONS = loadFile('INSTRUCTIONS.md')
const TASK_PLAN_TEMPLATE = loadFile('templates/task_plan.md')
const FINDINGS_TEMPLATE = loadFile('templates/findings.md')
const PROGRESS_TEMPLATE = loadFile('templates/progress.md')

// ─── Constants ────────────────────────────────────────────────────────────────

const WATCHED_TOOLS = new Set(['read', 'write', 'edit', 'bash', 'glob', 'grep'])
const FILE_UPDATE_TOOLS = new Set(['write', 'edit'])
const PLANNING_FILE_NAMES = new Set(['task_plan.md', 'findings.md', 'progress.md', 'todo.md'])

// ─── Per-session state ────────────────────────────────────────────────────────

const sessionState = new Map<string, { explorationCount: number; nudgedToPlan: boolean }>()
const tuiReadyNotified = new Set<string>()

function getState(sessionID: string) {
  if (!sessionState.has(sessionID)) {
    sessionState.set(sessionID, { explorationCount: 0, nudgedToPlan: false })
  }
  return sessionState.get(sessionID)!
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function planningPaths(root: string) {
  return {
    taskPlan: path.join(root, 'docs', 'task_plan.md'),
    findings: path.join(root, 'docs', 'findings.md'),
    progress: path.join(root, 'docs', 'progress.md'),
    todo:     path.join(root, 'docs', 'tasks', 'todo.md'),
  }
}

async function fileExists(p: string): Promise<boolean> {
  try { await fs.promises.access(p); return true } catch { return false }
}

async function readHead(p: string, lines = 30): Promise<string> {
  try {
    const content = await fs.promises.readFile(p, 'utf8')
    return content.split('\n').slice(0, lines).join('\n').trim()
  } catch { return '' }
}

function isPlanningFile(filePath?: string): boolean {
  return filePath ? PLANNING_FILE_NAMES.has(path.basename(filePath)) : false
}

function isVerificationCommand(command?: string): boolean {
  return /\b(test|lint|typecheck|build|check|pytest|vitest|jest|cargo\s+test|go\s+test|tsc)\b/i.test(command ?? '')
}

function append(output: { output: string }, msg: string): void {
  output.output = output.output ? `${output.output}\n\n${msg}` : msg
}

async function showToast(client: any, title: string, message: string): Promise<void> {
  try {
    await client?.tui?.showToast?.({
      body: {
        title,
        message,
        variant: 'info',
        duration: 2500,
      },
    })
  } catch {
    // Best-effort UI signal only.
  }
}

// ─── System prompt builder ────────────────────────────────────────────────────

async function buildSystemPrompt(root: string): Promise<string> {
  const p = planningPaths(root)

  const [taskPlanExists, findingsExists, progressExists, todoExists] = await Promise.all([
    fileExists(p.taskPlan),
    fileExists(p.findings),
    fileExists(p.progress),
    fileExists(p.todo),
  ])

  const [planHead, findingsHead, progressHead] = await Promise.all([
    taskPlanExists ? readHead(p.taskPlan, 30) : '',
    findingsExists ? readHead(p.findings, 20) : '',
    progressExists ? readHead(p.progress, 20) : '',
  ])

  const parts: string[] = ['<planning-with-files>']

  if (INSTRUCTIONS) parts.push(INSTRUCTIONS, '')

  parts.push(
    `**Planning file status:** docs/task_plan.md=${taskPlanExists ? 'present' : 'missing'}, ` +
    `docs/findings.md=${findingsExists ? 'present' : 'missing'}, ` +
    `docs/progress.md=${progressExists ? 'present' : 'missing'}, ` +
    `docs/tasks/todo.md=${todoExists ? 'present' : 'missing'}`,
  )

  if (planHead || findingsHead || progressHead) {
    parts.push('', '---', '## Current Planning Files')
    if (planHead) {
      parts.push('', '### docs/task_plan.md (first 30 lines)', '```md', planHead, '```')
    }
    if (findingsHead) {
      parts.push('', '### docs/findings.md (first 20 lines)', '```md', findingsHead, '```')
    }
    if (progressHead) {
      parts.push('', '### docs/progress.md (first 20 lines)', '```md', progressHead, '```')
    }
  }

  if (!taskPlanExists || !findingsExists || !progressExists) {
    parts.push('', '---', '## Templates', '', 'Use these only to create missing planning files:')
    if (!taskPlanExists && TASK_PLAN_TEMPLATE) {
      parts.push('', '### docs/task_plan.md', '```md', TASK_PLAN_TEMPLATE, '```')
    }
    if (!findingsExists && FINDINGS_TEMPLATE) {
      parts.push('', '### docs/findings.md', '```md', FINDINGS_TEMPLATE, '```')
    }
    if (!progressExists && PROGRESS_TEMPLATE) {
      parts.push('', '### docs/progress.md', '```md', PROGRESS_TEMPLATE, '```')
    }
  }

  parts.push('</planning-with-files>')
  return parts.join('\n')
}

// ─── Plugin ───────────────────────────────────────────────────────────────────

export const PlanningWithFilesPlugin = async ({
  directory,
  worktree,
  client,
}: {
  directory: string
  worktree?: string
  client: any
}) => {
  const root = worktree || directory

  return {
    'experimental.chat.system.transform': async (input, output) => {
      const sessionKey = input.sessionID || root
      if (!tuiReadyNotified.has(sessionKey)) {
        tuiReadyNotified.add(sessionKey)
        await showToast(
          client,
          'Planning with Files',
          'Plugin active. Using docs/task_plan.md, docs/findings.md, docs/progress.md.',
        )
      }
      ;(output.system ||= []).push(await buildSystemPrompt(root))
    },

    'tool.execute.before': async (input) => {
      const tool = input.tool.toLowerCase()
      if (!WATCHED_TOOLS.has(tool)) return

      const { taskPlan } = planningPaths(root)
      if (!await fileExists(taskPlan) && ['read', 'glob', 'grep', 'bash'].includes(tool)) {
        getState(input.sessionID).explorationCount++
      }
    },

    'tool.execute.after': async (input, output) => {
      const tool = input.tool.toLowerCase()
      if (!WATCHED_TOOLS.has(tool)) return

      const { taskPlan } = planningPaths(root)
      const hasTaskPlan = await fileExists(taskPlan)
      const state = getState(input.sessionID)

      // Nudge to create planning files after 2 exploration calls with no plan
      if (!hasTaskPlan && !state.nudgedToPlan && state.explorationCount >= 2) {
        append(output,
          '[planning-with-files] Before ANY complex task:\n' +
          '1. Create docs/task_plan.md\n' +
          '2. Create docs/findings.md\n' +
          '3. Create docs/progress.md\n\n' +
          'Use the templates in the system prompt as reference.'
        )
        await showToast(
          client,
          'Planning with Files',
          'Planning files missing. Create docs/task_plan.md, docs/findings.md, docs/progress.md.',
        )
        state.nudgedToPlan = true
        return
      }

      // Remind to update plan after any non-planning file edit
      if (FILE_UPDATE_TOOLS.has(tool) && !isPlanningFile(input.args?.filePath)) {
        append(output, '[planning-with-files] File updated. If this completes a phase, update docs/task_plan.md status.')
      }

      // Remind to log verification results
      if (tool === 'bash' && isVerificationCommand(input.args?.command)) {
        append(output, '[planning-with-files] Record verification results and any failures in docs/progress.md.')
      }
    },

    'experimental.session.compacting': async (_input, output) => {
      const { taskPlan } = planningPaths(root)
      const planHead = await readHead(taskPlan, 20)
      ;(output.context ||= []).push(
        'Planning-with-files continuity:\n' +
        '- Preserve current phase, completed phases, open questions, and next steps.\n' +
        '- Source of truth: docs/task_plan.md, docs/findings.md, docs/progress.md, docs/tasks/todo.md\n' +
        (planHead ? `- Current plan:\n${planHead}` : '- No docs/task_plan.md found.')
      )
    },
  }
}
