/**
 * Agent Permissions — plugin
 *
 * Enforces per-agent skill and MCP policies from the sibling
 * `agent-permissions.jsonc` file.
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import type { Plugin } from '@opencode-ai/plugin'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const CONFIG_CANDIDATES = [
  path.join(__dirname, '..', 'agent-permissions.jsonc'),
  path.join(__dirname, '..', 'agent-permissions.json'),
  path.join(__dirname, 'agent-permissions.jsonc'),
  path.join(__dirname, 'agent-permissions.json'),
]
const SKILLS_DIR = path.join(__dirname, '..', 'skills')
const OPCODE_CONFIG = path.join(__dirname, '..', 'opencode.json')

type CapabilityPolicy = {
  skills?: string[]
  mcps?: string[]
}

type PermissionsConfig = {
  defaults?: CapabilityPolicy
  agents?: Record<string, CapabilityPolicy>
}

type ResolvedPolicy = {
  skills: string[]
  mcps: string[]
}

type MutableArgs = Record<string, unknown>

function stripJsonComments(content: string): string {
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

function summarize(items: string[]): string {
  return items.length > 0 ? items.join(', ') : 'none'
}

function detectMcp(toolName: string, availableMcps: string[]): string | undefined {
  return availableMcps.find(
    (mcp) => toolName === mcp || toolName.startsWith(`${mcp}_`),
  )
}

function requestedSkillName(args: unknown): string | undefined {
  if (!args || typeof args !== 'object') return undefined
  const record = args as MutableArgs
  for (const key of ['name', 'skill', 'skillName']) {
    if (typeof record[key] === 'string') return record[key] as string
  }
  return undefined
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

async function readAvailableSkills(): Promise<string[]> {
  try {
    const entries = await fs.promises.readdir(SKILLS_DIR, { withFileTypes: true })
    return entries
      .filter((entry) => entry.isDirectory())
      .map((entry) => entry.name)
      .sort()
  } catch {
    return []
  }
}

async function readAvailableMcps(): Promise<string[]> {
  try {
    const content = await fs.promises.readFile(OPCODE_CONFIG, 'utf8')
    const parsed = JSON.parse(stripJsonComments(content)) as {
      mcp?: Record<string, unknown>
    }
    return Object.keys(parsed.mcp ?? {}).sort()
  } catch {
    return []
  }
}

async function readPermissionsConfig(): Promise<PermissionsConfig> {
  const content = await readFirstExisting(CONFIG_CANDIDATES)
  if (!content) return {}

  try {
    return JSON.parse(stripJsonComments(content)) as PermissionsConfig
  } catch {
    return {}
  }
}

export const AgentPermissionsPlugin: Plugin = async () => {
  const sessionAgents = new Map<string, string>()

  async function resolvePolicy(agentName: string): Promise<ResolvedPolicy> {
    const [config, availableSkills, availableMcps] = await Promise.all([
      readPermissionsConfig(),
      readAvailableSkills(),
      readAvailableMcps(),
    ])

    const agentPolicy = config.agents?.[agentName]
    const fallback = config.defaults ?? {}

    return {
      skills: resolveList(agentPolicy?.skills ?? fallback.skills, availableSkills),
      mcps: resolveList(agentPolicy?.mcps ?? fallback.mcps, availableMcps),
    }
  }

  return {
    'chat.message': async (input: { sessionID: string; agent?: string }) => {
      if (!input.agent) return
      sessionAgents.set(input.sessionID, input.agent)
    },

    'experimental.chat.system.transform': async (
      input: { sessionID?: string; model: unknown },
      output: { system: string[] },
    ) => {
      const agentName = input.sessionID ? sessionAgents.get(input.sessionID) : undefined
      if (!agentName) return

      const policy = await resolvePolicy(agentName)
      output.system.push(
        [
          `Agent capability policy for ${agentName}:`,
          `- Allowed skills: ${summarize(policy.skills)}`,
          `- Allowed MCP families: ${summarize(policy.mcps)}`,
          '- Do not use blocked skills or blocked MCP-backed tools.',
        ].join('\n'),
      )
    },

    'tool.execute.before': async (
      input: { tool: string; sessionID: string; callID: string },
      output: { args: unknown },
    ) => {
      const agentName = sessionAgents.get(input.sessionID)
      if (!agentName) return

      const [policy, availableMcps] = await Promise.all([
        resolvePolicy(agentName),
        readAvailableMcps(),
      ])

      if (input.tool === 'skill') {
        const skillName = requestedSkillName(output.args)
        if (skillName && !policy.skills.includes(skillName)) {
          throw new Error(
            `Skill '${skillName}' is not allowed for agent '${agentName}'.`,
          )
        }
      }

      const mcpName = detectMcp(input.tool, availableMcps)
      if (mcpName && !policy.mcps.includes(mcpName)) {
        throw new Error(
          `MCP '${mcpName}' is not allowed for agent '${agentName}'.`,
        )
      }
    },
  }
}
