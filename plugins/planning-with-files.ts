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

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const SKILL_DIR = path.join(__dirname, '..', 'skills', 'planning-with-files')
const CHECK_COMPLETE = path.join(SKILL_DIR, 'scripts', 'check-complete.sh')

const WATCHED_TOOLS = new Set(['read', 'write', 'edit', 'bash', 'glob', 'grep'])
const FILE_UPDATE_TOOLS = new Set(['write', 'edit'])

function append(output: { output?: string }, msg: string): void {
  output.output = output.output ? `${output.output}\n\n${msg}` : msg
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
  directory,
  worktree,
}: {
  directory: string
  worktree?: string
}) => {
  const root = worktree ?? directory

  return {
    // Nudge agent to load the skill before complex tasks
    'experimental.chat.system.transform': async (_input: any, output: { system?: string[] }) => {
      ;(output.system ??= []).push(
        "Use OpenCode's native `skill` tool to load `planning-with-files` before starting any complex, multi-step task.",
      )
    },

    // PreToolUse equivalent — show head of task_plan.md before every watched tool
    'tool.execute.before': async (input: { tool: string }, output: { output?: string }) => {
      const tool = input.tool.toLowerCase()
      if (!WATCHED_TOOLS.has(tool)) return

      const head = await planHead(root)
      if (head) {
        append(output, `[planning-with-files] Current plan:\n\`\`\`\n${head}\n\`\`\``)
      }
    },

    // PostToolUse equivalent — remind to update plan after file writes/edits
    'tool.execute.after': async (input: { tool: string }, output: { output?: string }) => {
      const tool = input.tool.toLowerCase()
      if (!FILE_UPDATE_TOOLS.has(tool)) return

      append(output, '[planning-with-files] File updated. If this completes a phase, update docs/task_plan.md status.')
    },

    // Stop equivalent — run check-complete.sh when session goes idle
    'session.idle': async () => {
      try {
        const { $ } = await import('bun')
        const docsDir = path.join(root, 'docs')
        const result = await $`sh ${CHECK_COMPLETE} ${path.join(docsDir, 'task_plan.md')}`.cwd(docsDir).text()
        if (result.trim()) {
          process.stderr.write(result + '\n')
        }
      } catch {
        // Best-effort — check-complete.sh is informational only
      }
    },
  }
}
