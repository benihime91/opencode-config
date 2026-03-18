# File Codemap

**Last Updated:** 2026-03-18
**Entry Points:** `README.md`, `opencode.json`, `AGENTS.md`, `plugins/planning-with-files.ts`, `plugins/using-skills.ts`

## Directory Structure

```text
.
|- AGENTS.md
|- CONTEXTPLUS.md
|- README.md
|- bun.lock
|- dcp.jsonc
|- install.sh
|- opencode.json
|- package.json
|- versions.json
|- agent/
|- agents/
|  |- designer.md
|  |- doc-updater.md
|  |- explorer.md
|  |- fixer.md
|  |- librarian.md
|  |- oracle.md
|  |- orchestrator.md
|  |- planner.md
|  `- refactor-cleaner.md
|- commands/
|  |- checkpoint.md
|  |- code-review.md
|  |- commit-push-pr.md
|  |- commit-push.md
|  |- learn.md
|  |- plan.md
|  |- refactor-clean.md
|  |- rollback.md
|  |- skill-create.md
|  |- update-codemaps.md
|  `- update-docs.md
|- docs/
|  |- CODEMAPS/
|  |  |- ARCHITECTURE.md
|  |  |- FILES.md
|  |  |- INDEX.md
|  |  `- MODULES.md
|  |- findings.md
|  |- progress.md
|  `- task_plan.md
|- plugins/
|  |- planning-with-files.ts
|  `- using-skills.ts
|- skills/
|  |- agentation/
|  |  `- SKILL.md
|  |- agentation-self-driving/
|  |  |- references/
|  |  |  `- two-session-workflow.md
|  |  `- SKILL.md
|  |- article-writing/
|  |  `- SKILL.md
|  |- planning-with-files/
|  |  |- examples.md
|  |  |- reference.md
|  |  |- scripts/
|  |  |  `- check-complete.sh
|  |  |- templates/
|  |  |  |- findings.md
|  |  |  |- progress.md
|  |  |  `- task_plan.md
|  |  `- SKILL.md
|  `- search-first/
|     `- SKILL.md
`- themes/
   |- poimandres-accessible.json
   |- poimandres-turquoise-expanded.json
   `- poimandres.json
```

## Key File Purposes

| Path | Purpose |
| ---- | ------- |
| `README.md` | Human-facing install, setup, and repo overview. |
| `install.sh` | Bootstrap installer that clones the repo, links config files, and installs prerequisites. |
| `opencode.json` | Runtime configuration for plugins, MCPs, LSP, and orchestrator task permissions. |
| `AGENTS.md` | Global rules for task execution, tool usage, and editing behavior. |
| `CONTEXTPLUS.md` | Repo-specific usage guide for Context+ semantic navigation. |
| `package.json` | JavaScript dependency manifest. |
| `versions.json` | Version registry for plugin, MCP, and tool bootstrap dependencies. |
| `plugins/planning-with-files.ts` | Executable source module; adds planning reminders and completion checks. |
| `plugins/using-skills.ts` | Executable source module; enforces skill invocation before responses. |
| `agents/orchestrator.md` | Primary coordinator agent that delegates to specialists. |
| `agents/planner.md` | Planning specialist for creating implementation plans with risk assessment. |
| `agents/doc-updater.md` | Documentation and codemap maintenance agent. |
| `commands/plan.md` | Workflow definition for creating implementation plans. |
| `commands/rollback.md` | Workflow definition for git rollback and checkpoint restoration. |
| `commands/update-codemaps.md` | Workflow definition for refreshing codemap docs. |
| `commands/update-docs.md` | Workflow definition for documentation sync. |
| `skills/planning-with-files/SKILL.md` | Canonical planning methodology referenced by the plugin and docs. |
| `skills/planning-with-files/scripts/check-complete.sh` | Verifies phase completion status for planning docs. |
| `skills/search-first/SKILL.md` | Research-before-coding workflow. |
| `skills/agentation/SKILL.md` | Agentation toolbar setup workflow. |
| `skills/agentation-self-driving/SKILL.md` | Autonomous browser-based annotation workflow. |
| `themes/poimandres.json` | Dark theme color definition. |
| `themes/poimandres-accessible.json` | High contrast accessible theme variant. |
| `themes/poimandres-turquoise-expanded.json` | Turquoise accent theme variant. |
| `docs/task_plan.md` | Active task plan memory. |
| `docs/findings.md` | Findings, corrections, and learned rules. |
| `docs/progress.md` | Session progress and verification log. |

## Directory Purposes

| Directory | Purpose |
| --------- | ------- |
| `agents/` | Agent definitions and role-specific instructions. |
| `commands/` | Slash-command workflows. |
| `docs/` | Persistent planning memory and generated codemaps. |
| `plugins/` | Runtime plugin code (TypeScript source files). |
| `skills/` | Reusable workflow packages. |
| `themes/` | Color theme definitions for UI customization. |
| `agent/` | Present but currently empty; not part of the active runtime path. |

## Navigation Guide

- Want setup and install flow? Open `README.md` and `install.sh`.
- Want runtime wiring? Open `opencode.json` and `versions.json`.
- Want repo-wide rules? Open `AGENTS.md`.
- Want executable behavior? Open `plugins/planning-with-files.ts` and `plugins/using-skills.ts`.
- Want user entrypoints? Browse `commands/`.
- Want specialist behaviors? Browse `agents/`.
- Want reusable playbooks? Browse `skills/`.
- Want UI themes? Browse `themes/`.
- Want active task memory or generated docs? Browse `docs/`.

## Notes

- The repo surface is mostly Markdown; two TypeScript source files in `plugins/` contain program logic.
- `bun.lock` is kept for dependency reproducibility but is not a primary navigation target.
- `agent/` is intentionally listed so the tree matches the current filesystem exactly.
- `themes/` directory was added for color theme customization support.

## Related Maps

- [`INDEX.md`](INDEX.md)
- [`ARCHITECTURE.md`](ARCHITECTURE.md)
- [`MODULES.md`](MODULES.md)
