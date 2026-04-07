# Task Plan: Agent Rename Pass

## Goal

Rename the custom agent roster from Greek-god names to the approved film/anime operator names, update all repo references, and preserve the existing role topology.

## Active Artifacts

- **Active task:** Agent rename pass
- **Active spec path:** none
- **Active plan path:** `.plans/2026-04-07-agent-rename-plan.md`
- **Last updated:** 2026-04-07

## Intake

- **Intended outcome:** Replace all Greek-god agent names with the approved film/anime names across the repo in one coordinated pass.
- **Known context:** The approved mapping is trinity←aphrodite, l←apollo, spike←artemis, motoko←athena, lelouch←cronus, cobb←daedalus, roy←hephaestus, neo←hermes, alfred←hestia, ripley←themis, morpheus←zeus. The user also approved muted premium colors for each name.
- **Unknowns / blockers:** Full blast radius of stale Greek-name mentions in planning memory and other repo text still needs exact confirmation.
- **Non-goals:** Do not redesign agent roles, permissions semantics, or workflows beyond the naming swap.
- **Decision boundaries:** Keep the rename repo-wide and consistent, preserve role intent, and update color keys where primary-agent names changed.
- **Readiness:** user approved; ready for implementation.

## Current Phase

Phase 3 — verify and close out

## Phases

### Phase 1: Grounding rename blast radius
- [x] Re-run catch-up through `git diff --stat` and the planning trio
- [x] Confirm the approved rename mapping and colors
- [x] Locate current agent files and primary repo references
- [x] Confirm remaining rename targets across prompts, docs, config, and planning files
- **Status:** complete

### Phase 2: Apply coordinated rename
- [x] Rename all 11 agent files in `agents/`
- [x] Update in-file `name` fields and internal mentions
- [x] Update config, docs, commands, and planning references
- [x] Update primary-agent color keys in `opencode.json`
- **Status:** complete

### Phase 3: Verify and close out
- [x] Re-read the changed core files directly
- [x] Run exact-match sweeps for stale Greek-agent names on active surfaces
- [x] Update planning memory with verified outcomes and residual notes
- **Status:** complete

## Key Questions

1. Which files outside the main agent/config/docs surface still carry active Greek-agent references?
2. Are any old-name mentions intentionally historical and worth preserving in planning memory, or should they all be updated for consistency?

## Decisions Made

| Decision | Rationale |
| -------- | --------- |
| Use the approved film/anime roster | User approved the exact mapping |
| Apply the rename repo-wide in one coordinated pass | User explicitly asked to update all references |
| Preserve role intent while swapping names | Avoid behavior drift during a naming change |
| Use the approved muted premium colors | User approved the exact palette |
| Treat historical planning references outside the active rename files as historical record, not stale active surface | Keeps the live repo consistent without rewriting unrelated archived session history |

## Errors Encountered

| Error | Attempt | Resolution |
| ----- | ------- | ---------- |
