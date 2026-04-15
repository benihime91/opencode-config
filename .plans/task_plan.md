# Task Plan: Install policy baseline (post spa day)

## Goal

Keep this OpenCode config internally consistent: minimal always-on rules, strict skill usage within `agent-permissions.jsonc`, `.plans/` reserved for heavyweight work, and docs aligned with the live repo.

## Active Artifacts

- **Active task:** Policy baseline — rules, skills, plugins, README (2026-04-15)
- **Active spec path:** none
- **Active plan path:** none (implementation tracked in repo + session)
- **Last updated:** 2026-04-15

## Intake

- **Intended outcome:** Single coherent hierarchy (rules → principles; skills → workflows; plugins enforce planning + permissions); no stale planning memory presented as current truth.
- **Known context:** Custom roster `shikamaru`, `urahara`, `hinata`, `gojo`, `kenma`, `oikawa`, `nanami`. Three rules; 31 skills; 10 slash commands. `opencode.json` disables built-ins `general` and `explore`.
- **Unknowns / blockers:** none for baseline doc pass.
- **Non-goals:** Redesign agent personalities or replace MCP providers.
- **Decision boundaries:** Personal-first install; `.plans/` only when long-running / multi-session / high-risk unless user opts in.
- **Readiness:** complete for this baseline pass.

## Current Phase

**Closed** — baseline recorded 2026-04-15

## Phases

### Phase 1: Always-on core + permissions copy

- [x] Soften `rules/agent-workflow.md` §8 (durable planning scope)
- [x] Shorten `plugins/using-skills.ts` (strict + permission-aware)
- [x] Fix `plugins/agent-permissions.ts` capability wording

### Phase 2: Planning scope + skills

- [x] Narrow `planning-with-files` skill + plugin copy + pre-tool noise (`constants.ts`)
- [x] Qualify `brainstorming` disk paths when `.plans/` active
- [x] Reconcile `writing-plans` / `executing-plans` execution handoff

### Phase 3: Live docs

- [x] README counts, skill permissions list, MCP embed model, commands table
- [x] `commands/agent-permissions-debug.md` accuracy
- [x] `agent-permissions.jsonc` clarifying comments

### Phase 4: Historical surfaces

- [x] Replace planning trio narrative with current baseline; add `HISTORICAL.md`
- [x] Refresh `skills/rules-distill/results.json`

## Key Questions

None open.

## Decisions Made

| Decision | Rationale |
| -------- | --------- |
| `.plans/` for heavyweight workstreams only | User preference; reduces ceremony |
| Keep strict skill invocation | User preference; paired with per-agent allowlists |
| Archive note for dated `.plans/*` | Old files remain as history without masquerading as current policy |

## Errors Encountered

| Error | Attempt | Resolution |
| ----- | ------- | ---------- |
| — | — | — |
