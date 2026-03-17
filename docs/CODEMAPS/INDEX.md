# Codemap Index

**Last Updated:** 2026-03-17

## Overview

- [`ARCHITECTURE.md`](ARCHITECTURE.md) - Runtime model, component relationships, integration points, and data flow.
- [`MODULES.md`](MODULES.md) - Module inventory for config, agents, commands, plugin code, skills, and docs.
- [`FILES.md`](FILES.md) - Navigable directory tree with file purposes and starting points.

## Start Here

1. Open `opencode.json` for runtime wiring: plugins, MCP servers, and LSP configuration.
2. Open `AGENTS.md` for repo-wide execution rules.
3. Open `commands/` for user-facing entrypoints.
4. Open `agents/` for role-specific instruction sets.
5. Open `plugins/planning-with-files.ts` for the only executable source module in the repo.
6. Open `skills/` for reusable workflows and capability packs.

## Primary Entry Points

- `opencode.json` - Main OpenCode runtime configuration.
- `AGENTS.md` - Global behavior and tool-use rules.
- `plugins/planning-with-files.ts` - Plugin factory that adds planning reminders and status reporting.
- `commands/update-codemaps.md` - Workflow definition for refreshing these codemaps.
- `README.md` - Install, setup, and repo overview.

## Current Shape

- This repo is an OpenCode configuration workspace, not a conventional application service.
- Most modules are Markdown instruction surfaces under `agents/`, `commands/`, and `skills/`.
- Runtime code is intentionally minimal: `plugins/planning-with-files.ts` is the only TypeScript source file.
- Planning state lives in `docs/task_plan.md`, `docs/findings.md`, and `docs/progress.md`.
- `docs/CODEMAPS/` is the documentation layer for repo navigation.

## Notes

- `agent/` exists but is currently empty and not part of the active runtime surface.
- `versions.json` tracks pinned versions for plugin, MCP, and tool bootstrap references.
- `bun.lock` is a package manager artifact; it supports installation but does not define architecture.
