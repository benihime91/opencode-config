# Task Plan: ContextPlus MCP Revert

## Goal

Move the Context+ repo-discovery path back from the current mcporter-based skill workflow to the default MCP-based path because the mcporter route is not working reliably.

## Intake

- **Intended outcome:** Restore a working default-MCP path for Context+ while keeping the rest of the repo stable.
- **Known facts:** `opencode.json` no longer declares any MCP servers; `mcporter.json` currently carries the `contextplus` server; `skills/repo-discovery/SKILL.md` currently makes Context+ via `mcporter` the primary discovery workflow.
- **Unknowns / blockers:** None at design level. The user confirmed a Context+-only revert and asked that the native `opencode.json` MCP settings be restored based on official docs before implementation.
- **Non-goals:** Do not assume the whole CLI migration should be undone.
- **Decision boundaries:** Keep the change as small as possible while restoring a reliable Context+ path.
- **Readiness:** ready — scope and implementation direction are now clear.

## Current Phase

Phase 3 — verification and closeout in progress

## Phases

### Phase 1: Design and scope
- [x] Ground the current Context+ configuration and skill surface in direct reads
- [x] Confirm whether the revert is Context+-only or a broader docs/prompt rollback
- [x] Present the smallest safe revert design and get approval
- **Status:** complete

### Phase 2: Implement the approved revert
- [x] Update the active config/prompt surfaces for the approved scope
- [x] Keep non-Context+ CLI skill workflows intact unless explicitly in scope
- **Status:** complete

### Phase 3: Verify and close out
- [x] Re-read every changed file directly
- [x] Confirm the default MCP path is restored for Context+
- [x] Confirm unrelated mcporter-based workflows remain intact
- **Status:** complete
