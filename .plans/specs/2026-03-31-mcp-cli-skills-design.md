# MCP-to-CLI + Skills Migration Design

## Goal

Port this OpenCode config away from MCP-driven workflow assumptions and toward a CLI + skills model.

The new stable contract should be:

`agents -> skills -> repo-owned CLI workflows -> mcporter/direct CLIs`

`mcporter` is an implementation detail where useful, not the user-facing architecture.

## Scope

This pass targets full MCP removal from the repo's active workflow.

In scope:

- remove `.mcp` as an active repo contract
- replace MCP-family prompt guidance with skill-directed CLI workflows
- introduce a small CLI-first capability layer owned by this repo
- update permissions/governance so they no longer depend on discovered MCP families
- update installer and docs to describe the CLI + skills model

Out of scope:

- inventing many new agent roles
- preserving MCP-family names as the long-term public interface
- one-skill-per-raw-tool explosion
- unrelated refactors outside the migration surfaces

## Research Summary

### Current repo coupling

The repo is MCP-coupled in four places:

1. `opencode.json` configures MCP families directly.
2. `plugins/agent-permissions.*` discovers MCP families from `opencode.json` and enforces access by MCP prefix.
3. prompts and docs (`CONTEXTPLUS.md`, `agents/explorer.md`, `agents/librarian.md`, `agents/cursor.md`, agentation skills, `README.md`) instruct direct MCP-backed tool use.
4. `install.sh` and docs still assume MCP-oriented bootstrap and dependency setup.

### mcporter fit

`mcporter` is strong at:

- calling MCP tools from CLI
- importing MCP server definitions from existing configs
- generating standalone CLIs
- acting as a bridge during migration

`mcporter` is not the desired public abstraction for this repo. If the repo exposes raw `mcporter call` patterns everywhere, the migration only renames the old dependency. The correct use here is to hide `mcporter` behind repo-owned command conventions and skill instructions.

## Architecture Decision

### Chosen model

Use a hybrid skill model:

- family-level skills by default
- narrower workflow-specific skills only where the workflow is materially different

Skills become the stable user and agent interface. Each skill teaches:

- when the capability should be used
- which repo-owned CLI workflow to invoke
- exact command patterns
- safety checks and constraints
- workflow-specific heuristics

### Why this model

This design:

- keeps prompts small and durable
- prevents low-level command syntax from leaking into every prompt
- avoids one-skill-per-tool sprawl
- keeps `mcporter` replaceable later
- shifts governance toward skill allowlists instead of transport-specific tool families

## Capability Map

### 1. `repo-discovery`

Purpose: semantic and structural repo exploration.

Absorbs the current Context+ workflow assumptions. Agents load this skill when they need codebase discovery, symbol tracing, blast-radius checks, or structural understanding.

### 2. `docs-research`

Purpose: official docs lookup, external API research, code examples, and targeted URL extraction.

Absorbs the current external research flow now split across docs and research tooling.

### 3. `annotation-sync`

Purpose: annotation event collection, sync, acknowledgement, and resolution workflows.

This stays narrower because it has a distinct event-loop interaction model.

### 4. `self-driving-review`

Purpose: autonomous page critique via browser automation and annotation workflow.

This remains specialized because it is a complete visible-review flow, not just a generic capability.

### 5. `agentation-setup`

Purpose: install and configure the toolbar in target apps.

This stays separate from runtime annotation handling because setup and runtime review are different jobs.

## Runtime Shape

### Public interface

Prompts and docs tell agents to load the right skill.

Examples:

- repo understanding -> `repo-discovery`
- external docs/API lookup -> `docs-research`
- annotation lifecycle -> `annotation-sync`
- autonomous UI critique -> `self-driving-review`

### Execution interface

The repo provides stable CLI workflows for each capability surface. These may be:

- thin wrapper scripts
- documented command conventions
- generated CLIs where appropriate

The exact implementation may call:

- `mcporter`
- direct CLIs
- a mix of both

The important rule is that prompts and top-level docs rely on repo-owned workflows, not raw MCP family names.

### Governance interface

The primary control surface becomes:

- which skills an agent may load
- which shell/CLI workflows those approved skills instruct

The repo should stop deriving authority from discovered `.mcp` families.

## Migration Plan Shape

Implementation should proceed in this order:

1. create the new skill surfaces
2. add the CLI workflow layer those skills rely on
3. rewrite prompts/docs to route through skills
4. remove `.mcp` from `opencode.json`
5. simplify or replace MCP-family enforcement in the permissions plugin
6. update installer/bootstrap and README guidance
7. verify the new workflow locally

## File-Level Impact

Likely edit set:

- `opencode.json`
- `agent-permissions.jsonc`
- `plugins/agent-permissions.ts`
- `plugins/agent-permissions/filesystem.ts`
- `plugins/agent-permissions/tooling.ts`
- `install.sh`
- `README.md`
- `CONTEXTPLUS.md`
- `agents/explorer.md`
- `agents/librarian.md`
- `agents/cursor.md`
- `skills/agentation/SKILL.md`
- `skills/agentation-self-driving/SKILL.md`
- new skill files for repo discovery, docs research, and annotation sync
- optional CLI wrapper/config files introduced by the implementation plan

## Risks

### Skill sprawl

Risk: too many tiny skills make the system harder to use.

Mitigation: broad skills by default, narrow skills only for truly distinct workflows.

### Abstraction leak

Risk: prompts drift into raw `mcporter` command details.

Mitigation: prompts route to skills; skills own the command details.

### Governance regression

Risk: removing MCP-family enforcement weakens capability boundaries.

Mitigation: preserve strong skill allowlists and cleanly remove MCP-specific logic instead of partially keeping it.

### Cosmetic migration

Risk: `.mcp` remains the hidden canonical source and the port is only superficial.

Mitigation: make the skill + CLI layer the real contract and remove `.mcp` from active repo workflow.

## Validation Criteria

The migration is complete when:

- prompts no longer instruct direct MCP-family tool usage
- `opencode.json` no longer depends on `.mcp`
- permissions logic no longer discovers or enforces MCP families
- new skills clearly document capability-specific CLI workflows
- installer/docs describe the CLI + skills setup accurately
- the changed repo loads cleanly in local verification

## Final Recommendation

Adopt the hybrid skill model and make skills the durable interface. Hide `mcporter` behind repo-owned CLI workflows. Rewrite prompts, permissions, installer, and docs around that contract. This is the smallest design that fully removes MCPs from the repo's active workflow without replacing them with another low-level public dependency.
