# Codemap Index

**Last Updated:** 2026-03-20

## Overview

- [`ARCHITECTURE.md`](ARCHITECTURE.md) — System overview, data flow, component relationships, and navigation guidance.
- [`MODULES.md`](MODULES.md) — Module catalog with exported behaviors and dependency graphs.
- [`FILES.md`](FILES.md) — Directory tree, file purposes, and navigation cues for every major surface.

## Start Here

1. Read `README.md` (or run `install.sh`) for onboarding and configuration instructions.
2. Check `opencode.json`, `versions.json`, and `dcp.jsonc` for plugin, MCP, and context-pruning wiring.
3. Review `AGENTS.md` for repo-wide execution policies.
4. Browse `commands/` for slash commands and their routed agents.
5. Open `agents/` to inspect specialist behaviors that commands invoke.
6. Inspect `plugins/` when you need runtime hooks such as planning reminders or skill enforcement.
7. Explore `skills/` for reusable workflows (planning, agentation, research, writing).
8. Look at `docs/task_plan.md`, `docs/findings.md`, and `docs/progress.md` for persistent planning intelligence.
9. Return to `docs/CODEMAPS/INDEX.md` when you need refreshed navigation after exploring the sections above.

## Primary Entry Points

- `README.md` / `install.sh` — Bootstraps the workspace.
- `opencode.json` — Runtime wiring for plugins, MCPs, skill availability, and agents.
- `AGENTS.md` — Shared policy on tool use, editing, and explorations.
- `commands/update-codemaps.md` — Workflow that triggers these codemaps and keeps them fresh.
- `plugins/planning-with-files.ts` — Runtime hooks that maintain `docs/task_plan.md`, `docs/findings.md`, and `docs/progress.md`.
- `skills/planning-with-files/SKILL.md` — Templates and guidelines powering planning state updates.
- `docs/CODEMAPS/ARCHITECTURE.md`, `MODULES.md`, `FILES.md` — Navigation details for each codemap surface.

## Current Shape

- This repo is an OpenCode configuration workspace where Markdown-driven commands, agents, and skills orchestrate documentation and navigation.
- Runtime code is confined to `plugins/` (TypeScript) and `skills/*/scripts/` helpers.
- Planning state is stored under `docs/`, while `docs/CODEMAPS/` houses the generated navigation maps.
- Themes under `themes/` provide Poimandres-based color definitions for OpenCode’s UI chrome.

## Notes

- Re-run `/update-codemaps` whenever you add directories, commands, or agent surfaces so `docs/CODEMAPS/` mirrors reality.
- `docs/task_plan.md`, `docs/findings.md`, and `docs/progress.md` form the single source of truth for planning sessions.
- `skills/search-first` and `skills/planning-with-files` help ensure research and documentation stay aligned with actual code changes.

## Related Maps

- [`ARCHITECTURE.md`](ARCHITECTURE.md)
- [`MODULES.md`](MODULES.md)
- [`FILES.md`](FILES.md)
