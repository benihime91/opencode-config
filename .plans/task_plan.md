# Task Plan: config spa day consolidation

## Goal

Consolidate agent rules, skills, and planning conventions so the system has one clear orchestration workflow: the orchestrator handles clarification and owns planning memory, the planner writes durable plan artifacts under `.plans/`, and obsolete or contradictory skill/prompt guidance is removed.

## Active Plan Artifact

- No planner artifact was needed for this consolidation pass; the approved workflow for future tasks is that planner-created artifacts live under `.plans/YYYY-MM-DD-HHMM-<task-key>.md`.

## Current Phase

Phase 3 — complete

## Phases

### Phase 1: Workflow and path consolidation
- [x] Confirm orchestrator edit policy exception for planning files and brainstorming/spec docs
- [x] Confirm `search-first` should be removed entirely
- [x] Confirm `brainstorming` should be removed and its useful workflow moved into orchestrator behavior
- [x] Confirm planner-owned durable plans belong in a dedicated planning directory
- [x] Confirm orchestrator remains sole owner of `task_plan.md`, `findings.md`, and `progress.md`
- **Status:** complete

### Phase 2: Prompt, skill, and config cleanup
- [x] Remove stale `search-first` references and permissions
- [x] Remove or retire `brainstorming` usage and references
- [x] Update planning file path references away from legacy `docs/*.md`
- [x] Update planner/orchestrator responsibilities and descriptions
- [x] Resolve contradictory prompt guidance discovered during review
- **Status:** complete

### Phase 3: `.plans/` migration and verification
- [x] Confirm live planning trio should move into `.plans/`
- [x] Update active references to `.plans/*`
- [x] Remove obsolete redirect stubs and old planning-file copies
- [x] Run targeted validation and summarize follow-up, if any
- **Status:** complete

## Key Rules

- The orchestrator never edits implementation files directly; it may only update valid planning files and brainstorming/spec docs.
- The planner may write only durable plan artifacts under `.plans/`.
- The orchestrator is the single owner of `.plans/task_plan.md`, `.plans/findings.md`, and `.plans/progress.md`.
- Subagents consume planning context but do not update the planning trio.

## Errors Encountered

- An intermediate path migration left stale references inside the `planning-with-files` skill and one codemap file table entry; follow-up cleanup resolved both.
- The user later corrected the chosen planning directory to `.plans/`; this follow-up migration removed compatibility stubs instead of preserving them.

## Remaining Follow-up

- None required for this migration pass.
