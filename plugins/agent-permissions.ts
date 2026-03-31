/**
 * Agent Permissions — plugin
 *
 * Enforces per-agent skill and MCP policies from the sibling
 * `agent-permissions.jsonc` file.
 */

import path from 'path'
import { fileURLToPath } from 'url'
import type { Plugin } from '@opencode-ai/plugin'
import {
  readAvailableMcps,
  resolvePolicy,
} from './agent-permissions/filesystem'
import {
  detectMcp,
  requestedSkillName,
  summarize,
} from './agent-permissions/tooling'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const CONFIG_ROOT = path.join(__dirname, '..')
const CONFIG_CANDIDATES = [
  path.join(CONFIG_ROOT, 'agent-permissions.jsonc'),
  path.join(CONFIG_ROOT, 'agent-permissions.json'),
  path.join(__dirname, 'agent-permissions.jsonc'),
  path.join(__dirname, 'agent-permissions.json'),
]
const OPCODE_CONFIG = path.join(CONFIG_ROOT, 'opencode.json')

export const AgentPermissionsPlugin: Plugin = async ({ directory, worktree }) => {
  const root = worktree ?? directory ?? CONFIG_ROOT
  const sessionAgents = new Map<string, string>()

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

      const policy = await resolvePolicy({
        agentName,
        root,
        configRoot: CONFIG_ROOT,
        configCandidates: CONFIG_CANDIDATES,
        opencodeConfigPath: OPCODE_CONFIG,
      })
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
        resolvePolicy({
          agentName,
          root,
          configRoot: CONFIG_ROOT,
          configCandidates: CONFIG_CANDIDATES,
          opencodeConfigPath: OPCODE_CONFIG,
        }),
        readAvailableMcps(OPCODE_CONFIG),
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
