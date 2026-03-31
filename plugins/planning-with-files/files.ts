/**
 * Planning with Files — file helpers
 *
 * Reads planning files, checks ownership targets, and computes status.
 */

import fs from 'fs'
import path from 'path'
import { CHECK_COMPLETE, PLANNING_FILES } from './constants'

export async function planHead(root: string): Promise<string> {
  try {
    const content = await fs.promises.readFile(path.join(root, '.plans', 'task_plan.md'), 'utf8')
    return content.split('\n').slice(0, 30).join('\n').trim()
  } catch {
    return ''
  }
}

export async function recentProgress(root: string): Promise<string> {
  try {
    const content = await fs.promises.readFile(path.join(root, '.plans', 'progress.md'), 'utf8')
    return content.split('\n').slice(-20).join('\n').trim()
  } catch {
    return ''
  }
}

export function collectPathStrings(value: unknown, results = new Set<string>()): Set<string> {
  if (typeof value === 'string') {
    results.add(value)
    return results
  }

  if (Array.isArray(value)) {
    for (const item of value) collectPathStrings(item, results)
    return results
  }

  if (!value || typeof value !== 'object') return results

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

export function normalizeRelative(root: string, target: string): string {
  return path.relative(root, path.resolve(root, target))
}

export function touchesPlanningFile(root: string, args: unknown): boolean {
  for (const filePath of collectPathStrings(args)) {
    if (PLANNING_FILES.has(normalizeRelative(root, filePath))) return true
  }

  return false
}

export function requestedSubagentType(args: unknown): string | undefined {
  if (!args || typeof args !== 'object') return undefined

  const candidate = (args as Record<string, unknown>).subagent_type
  return typeof candidate === 'string' ? candidate : undefined
}

export async function planningStatus(rootDir: string): Promise<string> {
  try {
    const { $ } = await import('bun')
    const plansDir = path.join(rootDir, '.plans')
    const result = await $`sh ${CHECK_COMPLETE} ${path.join(plansDir, 'task_plan.md')}`.cwd(plansDir).text()
    return result.trim()
  } catch {
    return ''
  }
}
