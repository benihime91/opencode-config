# Task Plan: Rules And Skills Spa Day

## Goal

Consolidate repo rules and skills, remove contradictions, and align the guidance system to the user's updated preferences.

## Active Artifacts

- **Active task:** Rules and skills spa day
- **Active spec path:** none
- **Active plan path:** `.plans/2026-04-07-rules-skills-spa-day-plan.md`
- **Last updated:** 2026-04-07

## Intake

- **Intended outcome:** Produce a cleaner, less contradictory rules/skills system with clearer separation between principles and workflows.
- **Known context:** The repo currently has 5 rule files and 31 skills. The user wants contradiction reduction first, prefers rules to hold principles while skills hold workflows, wants specific guidance to beat general guidance when conflicts remain, and wants this pass to be a deep rewrite rather than a narrow cleanup.
- **Unknowns / blockers:** Which contradiction clusters should be in scope for this pass versus deferred, and what final structure the user will approve after design review.
- **Non-goals:** Do not implement changes before design approval. Do not keep duplicate guidance just because it already exists.
- **Decision boundaries:** Preserve strong guidance where it still adds value, but reorganize aggressively when it reduces contradiction and overlap.
- **Readiness:** design approved; ready for implementation.

## Current Phase

Phase 4 — follow-up skill and permissions cleanup

## Phases

### Phase 1: Grounding and design
- [x] Re-run catch-up through `git diff --stat` and the planning trio
- [x] Inventory current rules and skills
- [x] Ask the user for updated consolidation preferences
- [x] Present consolidation approaches and recommended design
- [x] Get user approval before implementation
- [x] Write the implementation plan and register it in `Active Artifacts`
- **Status:** complete

### Phase 2: Consolidate rules and skills
- [x] Identify contradiction clusters and decide canonical homes
- [x] Rewrite rules and skills to match the approved structure
- [x] Remove or reduce duplicated guidance
- [x] Preserve clear precedence between general rules and specific skills
- [x] Align `skills/exa-search/SKILL.md` with the current `mcporter` guidance
- **Status:** complete

### Phase 3: Verify and close out
- [x] Re-read every changed file directly
- [x] Confirm contradictions were removed or intentionally resolved
- [x] Confirm updated guidance matches the user's preferences
- [x] Update planning memory with the final structure and residual risks
- **Status:** complete

### Phase 4: Follow-up skill and permissions cleanup
- [x] Ground the remaining stale-skill surface
- [x] Ground the current `agent-permissions.jsonc` state
- [x] Present the bounded follow-up design
- [x] Get user approval before implementation
- [x] Normalize the remaining stale skill frontmatter and descriptions
- [x] Consolidate `agent-permissions.jsonc` with the updated skills
- [x] Re-verify the follow-up changes directly
- [x] Update planning memory with the second-wave results
- **Status:** complete

## Key Questions

1. Which contradiction clusters should be handled in this pass?
2. What should be the canonical boundary between rules and skills after consolidation?

## Decisions Made

| Decision | Rationale |
| -------- | --------- |
| Optimize for contradiction reduction first | User preference |
| Keep principles in rules and workflows in skills by default | User preference |
| Let specific guidance beat general guidance when conflicts remain | User preference |
| Allow a deep rewrite instead of a narrow cleanup | User preference |

## Errors Encountered

| Error | Attempt | Resolution |
| ----- | ------- | ---------- |
