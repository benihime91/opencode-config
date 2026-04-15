---
description: Inspect resolved agent-permissions skill discovery for the active workspace
agent: build
---

# Agent Permissions Debug Command

Inspect the current workspace's merged skill directories and how `agent-permissions.jsonc` resolves allowed skills per agent.

## Your Task

1. Determine the active workspace root.
2. Read `plugins/agent-permissions/filesystem.ts` and `agent-permissions.jsonc` to understand the current resolution behavior.
3. Use Bash to run a `bun --eval` snippet that imports the shared helper and prints:
   - workspace root
   - global skills
   - project skills
   - merged skills
4. If `$ARGUMENTS` is non-empty, treat it as a target skill name and also print whether that skill exists in each set.
5. Summarize the result concisely.

## Output Format

### Discovery

- Workspace root: `...`
- Global skills: `...`
- Project skills: `...`
- Merged skills: `...`

### Target Skill

- Skill: `...`
- In global skills: yes/no
- In project skills: yes/no
- In merged skills: yes/no

### Interpretation

- One short paragraph explaining whether wildcard `"*"` would allow the target skill in the current workspace.
