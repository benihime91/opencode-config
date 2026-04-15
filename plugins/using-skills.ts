/**
 * Using Skills — plugin
 *
 * Injects a short system prompt: check allowed skills, then load relevant
 * skills before acting. Applies to every session unconditionally.
 */

import type { Plugin } from '@opencode-ai/plugin'

const SKILL_PROMPT = `## Skills (required)

Use OpenCode's native \`skill\` tool to list and load skills.

**If you were dispatched as a subagent to execute one specific bounded task**, you may skip broad skill discovery; still load a skill when the task explicitly names one or when loading is trivial.

**Otherwise:**

1. Respect **agent capability policy** in this session (allowed vs blocked skills). Do not attempt to load a skill that is not allowed for this agent.
2. If any allowed skill might apply—even roughly—**invoke \`skill\` to load it** before other tools or substantive answers. If the loaded skill is a poor fit, you do not have to follow it.
3. Prefer the **most specific** allowed skill for the task. If scope shifts, switch skills deliberately.
4. **User instructions override** skills and defaults when they conflict.

**Order when several skills apply:** process/orientation skills first (e.g. brainstorming), then domain execution skills.

**Rigid vs flexible:** follow rigid skills exactly; adapt flexible skills to context as the skill describes.`

export const UsingSkillsPlugin: Plugin = async () => {
  return {
    'experimental.chat.system.transform': async (_input, output) => {
      output.system.unshift(SKILL_PROMPT)
    },
  }
}
