# Architecture Codemap

**Last Updated:** 2026-03-18
**Entry Points:** `README.md`, `AGENTS.md`, `opencode.json`, `plugins/planning-with-files.ts`, `plugins/using-skills.ts`, `commands/*.md`, `agents/*.md`, `skills/*/SKILL.md`

## System Overview

This repository packages an OpenCode setup: global agent rules, slash-command workflows, specialist agents, reusable skills, runtime plugins, theme definitions, and install/bootstrap assets.

## Architecture

```text
install.sh / README.md
        |
        v
  local ~/.config/opencode
        |
        v
   opencode.json ------------------------------+
        |                                      |
        |                                      +--> plugin packages
        |                                      +--> MCP servers
        |                                      `--> LSP servers
        |
        +--> AGENTS.md ------------------------> repo-wide execution policy
        |
        +--> commands/*.md --------------------> user-facing workflows
        |         |
        |         +--> agents/*.md -----------> targeted agent behavior
        |         |
        |         `--> allowed-tools / agent routing metadata
        |
        +--> skills/*/SKILL.md ----------------> reusable task playbooks
        |
        +--> themes/*.json --------------------> color theme definitions
        |
        +--> plugins/planning-with-files.ts --> lifecycle hooks
        |         |
        |         +--> docs/task_plan.md
        |         +--> docs/findings.md
        |         +--> docs/progress.md
        |         `--> skills/planning-with-files/scripts/check-complete.sh
        |
        `--> plugins/using-skills.ts ---------> skill enforcement prompts
```

## Key Components

| Component | Purpose | Depends On | Feeds Into |
| --------- | ------- | ---------- | ---------- |
| `README.md` | Install and setup entrypoint for humans | `install.sh`, repo layout | Initial adoption |
| `install.sh` | Clones repo, links config files, installs runtime prerequisites | `gh`, `git`, `bun` or `npm`, optional `jq` | Local OpenCode config |
| `opencode.json` | Declares plugin packages, MCP servers, LSP settings, and orchestrator permissions | OpenCode config schema, installed tools | Runtime boot |
| `AGENTS.md` | Global tool-use, editing, and exploration policy | OpenCode agent runtime | Every task |
| `commands/` | Slash-command definitions with agent routing and workflow instructions | Frontmatter metadata, runtime git/tool context | Task entrypoints |
| `agents/` | Specialized instruction packs for orchestrator and subagents | OpenCode agent loader | Command execution |
| `skills/` | Reusable capability packs loaded on demand | Skill loader, external MCPs or browser tooling | Complex task workflows |
| `themes/` | Color theme JSON files for OpenCode UI customization | Theme loader | Visual appearance |
| `plugins/planning-with-files.ts` | Registers planning-related chat/tool hooks | `@opencode-ai/plugin`, Node built-ins, planning docs, check script | Session reminders and status |
| `plugins/using-skills.ts` | Injects skill enforcement prompt into system messages | `@opencode-ai/plugin` | All chat sessions |
| `docs/` | Persistent planning memory plus codemap docs | Plugin behavior and doc workflows | Later sessions and repo navigation |

## Data Flow

1. A user installs the repo with `install.sh` or the manual steps from `README.md`.
2. OpenCode reads `opencode.json` and `AGENTS.md` from the linked config directory.
3. A slash command in `commands/` is invoked or an agent runs directly.
4. Command frontmatter selects an agent, constrains tools, or defines the required workflow.
5. Agent instructions in `agents/` guide how the task is executed.
6. Skills under `skills/` are loaded when a task needs an opinionated workflow.
7. The planning plugin watches chat/tool lifecycle events and reads or updates planning context from `docs/`.
8. The using-skills plugin ensures skill invocation is checked before responses.

## Component Relationships

```text
commands/update-codemaps.md --> agents/doc-updater.md --> docs/CODEMAPS/*.md
commands/update-docs.md -----> agents/doc-updater.md --> docs/*.md
commands/plan.md ------------> agents/planner.md ------> implementation plans
commands/rollback.md --------> (git operations)

agents/orchestrator.md ------> explorer | librarian | oracle | designer | fixer | planner

plugins/planning-with-files.ts --> docs/task_plan.md
plugins/planning-with-files.ts --> skills/planning-with-files/scripts/check-complete.sh
plugins/using-skills.ts ----------> session system prompts

skills/agentation-self-driving/SKILL.md --> skills/agentation-self-driving/references/two-session-workflow.md
skills/search-first/SKILL.md -----------> exa + context7 research flow
```

## External Integrations

| Integration | Source | Purpose |
| ----------- | ------ | ------- |
| `@franlol/opencode-md-table-formatter` | `opencode.json`, `versions.json` | Markdown table formatting plugin |
| `@tarquinen/opencode-dcp` | `opencode.json`, `versions.json` | Dynamic context pruning plugin |
| `agentation-mcp` | `opencode.json`, `versions.json` | Annotation session tooling |
| `chrome-devtools-mcp` | `opencode.json`, `versions.json` | Browser automation and inspection |
| `@upstash/context7-mcp` | `opencode.json`, `versions.json` | Library docs lookup |
| `exa` remote MCP | `opencode.json` | Web and code search |
| `contextplus` | `opencode.json` | Semantic repo navigation |
| `ty` LSP via `uvx` | `opencode.json` | Python language server |

## Navigation Guide

- Start at `README.md` for setup intent.
- Start at `opencode.json` for runtime wiring.
- Start at `AGENTS.md` for repo-wide operating rules.
- Start at `commands/` when you want entrypoints.
- Start at `agents/` when you want role behavior.
- Start at `plugins/` when you want executable logic.
- Start at `skills/` when you want reusable workflows.
- Start at `themes/` when you want UI customization.

## Related Maps

- [`INDEX.md`](INDEX.md)
- [`MODULES.md`](MODULES.md)
- [`FILES.md`](FILES.md)
