/**
 * Using Skills — plugin
 *
 * Injects a system prompt that ensures the agent always checks for and
 * invokes relevant skills before responding.  This is a high-priority
 * prompt injection — it applies to every session unconditionally.
 */

import type { Plugin } from '@opencode-ai/plugin'

const SKILL_PROMPT = `Use OpenCode's native \`skill\` tool to list and load skills. When starting any conversation - establishes how to find and use skills, requiring Skill tool invocation before ANY response including clarifying questions. If you were dispatched as a subagent to execute a specific task, skip this skill. If you think there is even a 1% chance a skill might apply to what you are doing, you ABSOLUTELY MUST invoke the skill.
IF A SKILL APPLIES TO YOUR TASK, YOU DO NOT HAVE A CHOICE. YOU MUST USE IT. This is not negotiable. This is not optional. You cannot rationalize your way out of this. Invoke relevant or requested skills BEFORE any response or action. Even a 1% chance a skill might apply means that you should invoke the skill to check. If an invoked skill turns out to be wrong for the situation, you don't need to use it. Instructions say WHAT, not HOW. "Add X" or "Fix Y" doesn't mean skip workflows.`

export const UsingSkillsPlugin: Plugin = async () => {
  return {
    'experimental.chat.system.transform': async (
      _input: { sessionID?: string; model: unknown },
      output: { system: string[] },
    ) => {
      // Prepend so it appears before other plugin prompts
      output.system.unshift(SKILL_PROMPT)
    },
  }
}
