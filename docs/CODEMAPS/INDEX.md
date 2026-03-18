# Codemap Index

**Last Updated:** 2026-03-18

## Overview

- [`ARCHITECTURE.md`](ARCHITECTURE.md) - Runtime model, component relationships, integration points, and data flow.
- [`MODULES.md`](MODULES.md) - Module inventory for config, agents, commands, plugin code, skills, themes, and docs.
- [`FILES.md`](FILES.md) - Navigable directory tree with file purposes and starting points.

## Start Here

1. Open `opencode.json` for runtime wiring: plugins, MCP servers, and LSP configuration.
2. Open `AGENTS.md` for repo-wide execution rules.
3. Open `commands/` for user-facing entrypoints.
4. Open `agents/` for role-specific instruction sets.
5. Open `plugins/` for executable source modules (planning-with-files.ts, using-skills.ts).
6. Open `skills/` for reusable workflows and capability packs.
7. Open `themes/` for color theme definitions.

## Primary Entry Points

- `opencode.json` - Main OpenCode runtime configuration.
- `AGENTS.md` - Global behavior and tool-use rules.
- `plugins/planning-with-files.ts` - Plugin factory that adds planning reminders and status reporting.
- `plugins/using-skills.ts` - Plugin that enforces skill invocation before responses.
- `commands/update-codemaps.md` - Workflow definition for refreshing these codemaps.
- `README.md` - Install, setup, and repo overview.

## Current Shape

- This repo is an OpenCode configuration workspace, not a conventional application service.
- Most modules are Markdown instruction surfaces under `agents/`, `commands/`, and `skills/`.
- Runtime code is minimal: two TypeScript source files in `plugins/`.
- Planning state lives in `docs/task_plan.md`, `docs/findings.md`, and `docs/progress.md`.
- `docs/CODEMAPS/` is the documentation layer for repo navigation.

## Notes

- `agent/` exists but is currently empty and not part of the active runtime surface.
- `versions.json` tracks pinned versions for plugin, MCP, and tool bootstrap references.
- `bun.lock` is a package manager artifact; it supports installation but does not define architecture.
