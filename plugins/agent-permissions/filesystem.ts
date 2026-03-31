/**
 * Agent Permissions — filesystem helpers
 *
 * Reads config, discovers skills, and resolves wildcard policies.
 */

import fs from 'fs'
import path from 'path'

export type CapabilityPolicy = {
  skills?: string[]
}

export type PermissionsConfig = {
  defaults?: CapabilityPolicy
  agents?: Record<string, CapabilityPolicy>
}

export type ResolvedPolicy = {
  skills: string[]
}

export type DiscoveredSkills = {
  globalSkills: string[]
  projectSkills: string[]
  mergedSkills: string[]
}

export function stripJsonComments(content: string): string {
  return content
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/(^|[^:\\])\/\/.*$/gm, '$1')
    .replace(/,\s*([}\]])/g, '$1')
}

function normalizeList(items: string[] | undefined): string[] {
  return (items ?? []).map((item) => item.trim()).filter(Boolean)
}

function resolveList(items: string[] | undefined, allAvailable: string[]): string[] {
  const rules = normalizeList(items)
  if (rules.length === 0) return []

  const allow = rules.filter((item) => !item.startsWith('!'))
  const deny = new Set(rules.filter((item) => item.startsWith('!')).map((item) => item.slice(1)))

  if (deny.has('*')) return []
  if (allow.includes('*')) {
    return allAvailable.filter((item) => !deny.has(item))
  }

  return allow.filter((item) => !deny.has(item))
}

async function readFirstExisting(paths: string[]): Promise<string | undefined> {
  for (const filePath of paths) {
    try {
      return await fs.promises.readFile(filePath, 'utf8')
    } catch {
      continue
    }
  }

  return undefined
}

async function readSkillDirectoryNames(dirPath: string): Promise<string[]> {
  try {
    const entries = await fs.promises.readdir(dirPath, { withFileTypes: true })
    return entries.filter((entry) => entry.isDirectory()).map((entry) => entry.name)
  } catch {
    return []
  }
}

export async function readPermissionsConfig(configCandidates: string[]): Promise<PermissionsConfig> {
  const content = await readFirstExisting(configCandidates)
  if (!content) return {}

  try {
    return JSON.parse(stripJsonComments(content)) as PermissionsConfig
  } catch {
    return {}
  }
}

export async function readAvailableSkills(root: string, configRoot: string): Promise<string[]> {
  const discovered = await readDiscoveredSkills(root, configRoot)
  return discovered.mergedSkills
}

export async function readDiscoveredSkills(root: string, configRoot: string): Promise<DiscoveredSkills> {
  const skillDirs = [
    path.join(configRoot, 'skills'),
    path.join(root, 'skills'),
  ]

  const [globalSkills, projectSkills] = await Promise.all(skillDirs.map(readSkillDirectoryNames))
  return {
    globalSkills: globalSkills.sort(),
    projectSkills: projectSkills.sort(),
    mergedSkills: [...new Set([...globalSkills, ...projectSkills])].sort(),
  }
}

export async function resolvePolicy(args: {
  agentName: string
  root: string
  configRoot: string
  configCandidates: string[]
}): Promise<ResolvedPolicy> {
  const [config, availableSkills] = await Promise.all([
    readPermissionsConfig(args.configCandidates),
    readAvailableSkills(args.root, args.configRoot),
  ])

  const agentPolicy = config.agents?.[args.agentName]
  const fallback = config.defaults ?? {}

  return {
    skills: resolveList(agentPolicy?.skills ?? fallback.skills, availableSkills),
  }
}
