# Architecture Codemap

**Last Updated:** 2026-03-20
**Entry Points:** `README.md`, `install.sh`, `opencode.json`, `versions.json`, `dcp.jsonc`, `AGENTS.md`, `commands/*.md`, `agents/*.md`, `plugins/*.ts`, `skills/*/SKILL.md`, `docs/task_plan.md`, `docs/CODEMAPS/INDEX.md`

## System Overview

This repository is an OpenCode configuration workspace: it wires entry-point commands, specialist agents, runtime plugins, and reusable skills alongside planning memory and navigation documentation. The orchestrator (via `opencode.json` and `AGENTS.md`) loads these components, routes slash commands, and surfaces codemaps from `docs/CODEMAPS/` while the planning plugin keeps `docs/` state fresh.

## Architecture

```text
README.md / install.sh
        |
        v
    repo root configuration
        |
        +--> opencode.json ------------> plugin registry + MCP/LSP wiring
        |           |
        |           `--> plugins/*.ts --> planning reminders + skill enforcement
        |
        +--> versions.json ----------> pinned plugin/MCP/tool revisions
        |
        +--> AGENTS.md --------------> agent loader and policy enforcement
        |
        +--> commands/*.md ----------> agents/*.md --------+
        |         |                                    |
        |         `--> docs/CODEMAPS/*.md <-----------+
        |
        +--> skills/* ----------------> codemap templates + helper instructions
        |
        `--> docs/ -------------------> planning memory + navigation docs
```

## Key Components

| Component | Purpose | Depends On | Feeds Into |
| --------- | ------- | ---------- | ---------- |
| `README.md` / `install.sh` | Onboarding, bootstrap, and symlink setup for the workspace | `git`, `gh`, `bun`/`npm`, contributor shell | Local `~/.config/opencode` configuration |
| `opencode.json` | Declares plugins, MCPs, LSPs, skills, and orchestrator capabilities | OpenCode config schema | Plugin loader, command router |
| `versions.json` | Locks plugin/MCP/tool versions for reproducible installs | External registries | `install.sh`, `opencode.json` |
| `dcp.jsonc` | Declares dynamic context pruning schema | Dynamic context pruning plugin | Plugin validation and context control |
| `AGENTS.md` | Global policy for tooling, editing, and exploration | Orchestrator runtime | Every agent session |
| `commands/` | Slash commands with routing metadata, tool guards, and expected outputs | `agents/`, git context, `AGENTS.md` | Specialist agents and docs |
| `agents/` | Role-specific instruction packs consumed by commands | `commands/`, `skills/`, `docs/` | Task implementation and doc updates |
| `plugins/planning-with-files.ts` | Writes planning reminders and completion hints to docs | `docs/task_plan.md`, `docs/findings.md`, Node `fs` | `docs/` artifacts and CLI prompts |
| `plugins/using-skills.ts` | Injects the skill-enforcement prompt into every session | `@opencode-ai/plugin` runtime | All chat sessions |
| `skills/` | Reusable workflow playbooks for agents | MCPs, `docs/`, `plugins/` | Planning docs, codemap regeneration |
| `docs/CODEMAPS/` | Architecture, module, file, and navigation documentation | `commands/update-codemaps.md`, `agents/doc-updater.md`, `skills/planning-with-files` | Contributor navigation |
| `docs/` | Persistent planning state, findings, and verification logs | Planning plugin, doc-updater commands | Future sessions and audits |
| `themes/` | Poimandres-based color palettes for UI theming | OpenCode theme loader | Visual identity references |

## Data Flow

1. A contributor follows `README.md` or `install.sh` to clone, link, and install the workspace; `opencode.json`, `versions.json`, and `AGENTS.md` land in `~/.config/opencode`.
2. The orchestrator reads `opencode.json` to load plugins, MCPs, skill availability, and `AGENTS.md` for policy, then exposes slash commands defined under `commands/`.
3. A slash command targets an agent via frontmatter; the agent loads Markdown instructions, optionally pulls in skills (e.g., `skills/planning-with-files`), and emits documentation or code changes.
4. `plugins/planning-with-files.ts` reacts to planning and checkpoint commands, refreshing `docs/task_plan.md`, `docs/findings.md`, and `docs/progress.md` as the session proceeds.
5. `agents/doc-updater.md` orchestrates `commands/update-docs.md` and `commands/update-codemaps.md`, which regenerate the codemap set in `docs/CODEMAPS/`.
6. `plugins/using-skills.ts` ensures every response first passes the enforced skill-check prompt before being returned.

## Component Relationships

```text
commands/update-codemaps.md --> agents/doc-updater.md --> docs/CODEMAPS/{ARCHITECTURE,MODULES,FILES,INDEX}.md
commands/update-docs.md --> agents/doc-updater.md --> docs/{task_plan,findings,progress}.md
commands/plan.md --> agents/planner.md --> docs/task_plan.md
commands/checkpoint.md --> docs/progress.md
commands/rollback.md --> git operations
commands/learn.md --> doc-updater + docs/progress.md

agents/orchestrator.md --> explorer | librarian | oracle | designer | fixer | planner | doc-updater

plugins/planning-with-files.ts --> docs/task_plan.md + docs/findings.md + docs/progress.md
plugins/planning-with-files.ts --> skills/planning-with-files/scripts/check-complete.sh
plugins/using-skills.ts --> session system prompts

skills/planning-with-files/SKILL.md --> docs/{task_plan,findings,progress}.md
skills/search-first/SKILL.md --> exa + context7 research flow
```

## External Integrations

| Integration | Source | Purpose |
| ----------- | ------ | ------- |
| `@opencode-ai/plugin` | `package.json`, `opencode.json` | Plugin runtime framework and TypeScript types |
| `agentation-mcp` | `versions.json`, `opencode.json` | Annotation tooling referenced by Agentation skills |
| `chrome-devtools-mcp` | `opencode.json` | Browser automation and inspection support |
| `@upstash/context7-mcp` | `opencode.json` | Context7 documentation lookup |
| `exa` remote MCP | `opencode.json` | Web and code search for research-first workflows |
| `contextplus` | `opencode.json` | Semantic repo navigation |
| `ty` LSP via `uvx` | `opencode.json` | Python language intelligence |
| `bun` / `node` | `plugins/*.ts`, `install.sh` | Runtime for plugin modules |
| `@franlol/opencode-md-table-formatter` | `opencode.json`, `versions.json` | Markdown table rendering helpers |
| `@tarquinen/opencode-dcp` | `opencode.json`, `versions.json` | Dynamic context pruning orchestration |

## Navigation Guide

- Start at `README.md` / `install.sh` to bootstrap and link your local `~/.config/opencode` directory.
- Open `opencode.json`, `versions.json`, and `dcp.jsonc` for plugin, MCP, and pruning wiring.
- Read `AGENTS.md` for repo-wide execution, editing, and tooling rules.
- Browse `commands/` for slash-command entrypoints and agent routing metadata.
- Inspect `agents/` for role-specific instruction packs like `doc-updater`, `planner`, `refactor-cleaner`, and others.
- Refer to `plugins/` when you need runtime hooks (planning reminders, skill enforcement).
- Explore `skills/` for reusable workflows that agents can load on demand.
- Check `docs/task_plan.md`, `docs/findings.md`, and `docs/progress.md` for persistent planning state.
- Head to `docs/CODEMAPS/INDEX.md` for high-level navigation before diving into the architecture, module, or file maps.
- Review `themes/` for UI color palettes.

## Related Maps

- [`INDEX.md`](INDEX.md)
- [`MODULES.md`](MODULES.md)
- [`FILES.md`](FILES.md)
