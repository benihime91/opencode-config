/**
 * Agent Permissions — tool helpers
 *
 * Identifies requested skills and MCP-backed tool families.
 */

type MutableArgs = Record<string, unknown>

export function summarize(items: string[]): string {
  return items.length > 0 ? items.join(', ') : 'none'
}

export function detectMcp(toolName: string, availableMcps: string[]): string | undefined {
  return availableMcps.find(
    (mcp) => toolName === mcp || toolName.startsWith(`${mcp}_`),
  )
}

export function requestedSkillName(args: unknown): string | undefined {
  if (!args || typeof args !== 'object') return undefined

  const record = args as MutableArgs
  for (const key of ['name', 'skill', 'skillName']) {
    if (typeof record[key] === 'string') return record[key] as string
  }

  return undefined
}
