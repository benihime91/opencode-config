/**
 * Using Skills — plugin
 *
 * Injects a short bootstrap prompt into the first user message: check allowed
 * skills, then load relevant skills before acting.
 */

import type { Plugin } from '@opencode-ai/plugin'

const BOOTSTRAP_SENTINEL = 'EXTREMELY_IMPORTANT'

const SKILL_PROMPT = `${BOOTSTRAP_SENTINEL}: ## Skills (required)

Use OpenCode's native \`skill\` tool to list and load skills.

**If you were dispatched as a subagent to execute one specific bounded task**, you may skip broad skill discovery; still load a skill when the task explicitly names one or when loading is trivial.

**Otherwise:**

1. Respect **agent capability policy** in this session (allowed vs blocked skills). Do not attempt to load a skill that is not allowed for this agent.
2. If any allowed skill might apply—even roughly—**invoke \`skill\` to load it** before other tools or substantive answers. If the loaded skill is a poor fit, you do not have to follow it.
3. Prefer the **most specific** allowed skill for the task. If scope shifts, switch skills deliberately.
4. **User instructions override** skills and defaults when they conflict.

**Order when several skills apply:** process/orientation skills first (e.g. brainstorming), then domain execution skills.

**Rigid vs flexible:** follow rigid skills exactly; adapt flexible skills to context as the skill describes.`

const getBootstrapContent = () => SKILL_PROMPT

export const UsingSkillsPlugin: Plugin = async () => {
  return {
    // Inject bootstrap into the first user message of each session.
    // Using a user message instead of a system message avoids:
    //   1. Token bloat from system messages repeated every turn (#750)
    //   2. Multiple system messages breaking Qwen and other models (#894)
    //
    // The hook fires on every agent step (not just every turn) because
    // opencode's prompt.ts reloads messages from DB each step. Fresh message
    // arrays may need injection again, so getBootstrapContent() must not do
    // repeated disk work.
    'experimental.chat.messages.transform': async (_input, output) => {
      const bootstrap = getBootstrapContent()
      if (!bootstrap || !output.messages.length) return

      const firstUser = output.messages.find((message) => message.info.role === 'user')
      if (!firstUser || !firstUser.parts.length) return

      // Guard: skip if first user message already contains bootstrap.
      // This prevents double injection when OpenCode passes an already
      // transformed in-memory message array through the hook again.
      if (
        firstUser.parts.some(
          (part) => part.type === 'text' && part.text.includes(BOOTSTRAP_SENTINEL),
        )
      ) {
        return
      }

      const ref = firstUser.parts[0]
      firstUser.parts.unshift({ ...ref, type: 'text', text: bootstrap })
    },
  }
}
