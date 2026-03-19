# File Codemap

**Last Updated:** 2026-03-20
**Entry Points:** `README.md`, `install.sh`, `opencode.json`, `AGENTS.md`, `commands/*.md`, `docs/CODEMAPS/INDEX.md`

## Directory Structure

```text
.
|- AGENTS.md
|- CONTEXTPLUS.md
|- README.md
|- install.sh
|- opencode.json
|- versions.json
|- dcp.jsonc
|- package.json
|- bun.lock
|- commands/
|  |- plan.md
|  |- checkpoint.md
|  |- code-review.md
|  |- refactor-clean.md
|  |- rollback.md
|  |- update-docs.md
|  |- update-codemaps.md
|  |- learn.md
|  |- skill-create.md
|  |- commit-push.md
|  `- commit-push-pr.md
|- agents/
|  |- orchestrator.md
|  |- planner.md
|  |- designer.md
|  |- fixer.md
|  |- librarian.md
|  |- oracle.md
|  |- explorer.md
|  |- doc-updater.md
|  `- refactor-cleaner.md
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
|- themes/
|  |- poimandres.json
|  |- poimandres-accessible.json
|  `- poimandres-turquoise-expanded.json
`- docs/
   |- CODEMAPS/
   |  |- INDEX.md
   |  |- ARCHITECTURE.md
   |  |- MODULES.md
   |  `- FILES.md
   |- task_plan.md
   |- findings.md
   `- progress.md
```

## Key File Purposes

| Path | Purpose |
| ---- | ------- |
| `README.md` | Onboarding, installation overview, and repo orientation. |
| `install.sh` | Bootstraps the repo into `~/.config/opencode`, links configs, and installs dependencies. |
| `opencode.json` | Runtime configuration for plugins, MCPs, LSPs, skills, and orchestrator permissions. |
| `versions.json` | Version registry for plugins, MCPs, and tools referenced by `opencode.json`. |
| `AGENTS.md` | Global rules for tooling, editing, and workflow boundaries. |
| `CONTEXTPLUS.md` | Documentation on semantic navigation helpers like Context+ within this repo. |
| `commands/plan.md` | Planning workflow routed to `agents/planner`. |
| `commands/update-codemaps.md` | Codemap refresh workflow routed to `agents/doc-updater`. |
| `commands/skill-create.md` | Skill generation helper routed to `doc-updater`. |
| `agents/doc-updater.md` | Documentation and codemap maintenance specialist. |
| `plugins/planning-with-files.ts` | Adds planning reminders and completion checks to every session. |
| `plugins/using-skills.ts` | Enforces skill invocation via a system prompt. |
| `skills/planning-with-files/SKILL.md` | Planning methodology, templates, and references used by the planning plugin. |
| `skills/planning-with-files/scripts/check-complete.sh` | Validates the completion status of planning phases. |
| `skills/search-first/SKILL.md` | Research-before-code workflow referencing `exa` + Context7. |
| `docs/task_plan.md` | Active multi-phase plan for the current session. |
| `docs/findings.md` | Repository-specific discoveries, corrections, and process updates. |
| `docs/progress.md` | Verification and testing log for the session. |
| `docs/CODEMAPS/INDEX.md` | Top-level navigation hub for codemaps. |
| `docs/CODEMAPS/ARCHITECTURE.md` | High-level system overview, data flow, and navigation guide. |
| `docs/CODEMAPS/MODULES.md` | Module inventory, dependencies, and exported behaviors. |
| `docs/CODEMAPS/FILES.md` | Directory tree, file purposes, and quick navigation reference. |
| `themes/poimandres.json` | Base Poimandres color theme definition. |

## Directory Purposes

| Directory | Purpose |
| --------- | ------- |
| `commands/` | Slash-command workflows that gate agent selection, tool restrictions, and output expectations. |
| `agents/` | Markdown instructions for orchestrator-specialist routing (planner, doc-updater, fixer, etc.). |
| `plugins/` | TypeScript plugins (`planning-with-files`, `using-skills`) that hook into the OpenCode runtime. |
| `skills/` | Reusable skills (planning, agentation, article writing, research) that agents can load. |
| `themes/` | JSON theme definitions for Poimandres-inspired UI skins. |
| `docs/` | Persistent memory: planning output, findings, progress, and generated codemaps. |
| `docs/CODEMAPS/` | Navigation docs (architecture, modules, files, index) derived from actual structure. |
| `skills/planning-with-files/templates/` | Templates (`task_plan`, `findings`, `progress`) that the planning skill and plugin copy/update. |

## Navigation Guide

- Need onboarding? Read `README.md` and run `install.sh`.
- Want runtime wiring? Inspect `opencode.json`, `versions.json`, and `dcp.jsonc`.
- Need policy? Read `AGENTS.md`.
- Looking for entrypoints? Browse `commands/` and run `/plan` or `/update-codemaps` as needed.
- Want specialist behavior? Open `agents/` for planners, designers, doc-updaters, and more.
- Care about runtime logic? Inspect `plugins/planning-with-files.ts` and `plugins/using-skills.ts`.
- Need reusable playbooks? Check `skills/` and their `SKILL.md` guides.
- Curious about codemaps? Start at `docs/CODEMAPS/INDEX.md`, then follow links to `ARCHITECTURE.md`, `MODULES.md`, and `FILES.md`.
- Want live planning state? Read `docs/task_plan.md`, `docs/findings.md`, and `docs/progress.md`.
- Need color palettes? Browse `themes/`.

## Notes

- The repository surface is mostly Markdown instructions; the only runtime code lives in `plugins/*.ts`.
- `docs/CODEMAPS/` is the canonical navigation layer updated by `/update-codemaps` and `agents/doc-updater`.
- `docs/task_plan.md`, `docs/findings.md`, and `docs/progress.md` capture the active planning cycle watched by the planning plugin.
- `bun.lock` and `package.json` keep dependencies reproducible for plugin compilation.

## Related Maps

- [`INDEX.md`](INDEX.md)
- [`ARCHITECTURE.md`](ARCHITECTURE.md)
- [`MODULES.md`](MODULES.md)
