# Task Plan: Subagent Artifact Context Propagation

## Goal

Make Zeus, Hermes, and the planning workflow persist canonical spec and implementation-plan paths so subagents can recover the active task context after delegation, resume, or crash recovery.

## Active Artifacts

- **Active task:** Subagent artifact context propagation
- **Active spec path:** none
- **Active plan path:** `.plans/2026-04-01-subagent-artifact-context-propagation-plan.md`
- **Last updated:** 2026-04-01

## Intake

- **Intended outcome:** Approved specs and implementation plans should be discoverable from shared planning memory, passed explicitly in Zeus handoffs, and visible enough in runtime planning context that subagents do not have to guess the current canonical artifact.
- **Known context:** Zeus currently requires the planning trio in handoffs, but not the exact spec/plan files; Hermes treats the planning trio as shared memory but does not maintain canonical artifact refs; the planning plugin injects the task-plan head and recent progress, but there is no dedicated artifact registry.
- **Unknowns / blockers:** None at design level; the main implementation choice is whether plugin changes need explicit artifact parsing or whether surfacing the artifact section near the top of `task_plan.md` is sufficient.
- **Non-goals:** Do not introduce a second planning system, `.omx`-style state, or automatic artifact guessing from "latest file" heuristics.
- **Decision boundaries:** Keep the fix small, make `task_plan.md` the canonical artifact index, and only add explicit runtime or handoff rules where they materially improve crash recovery.
- **Readiness:** ready — the failure mode is grounded and the scoped design is approved.

## Current Phase

Phase 3 — verification and closeout in progress

## Phases

### Phase 1: Grounding and design
- [x] Confirm where Zeus, Hermes, and the planning plugin currently pass planning context
- [x] Identify the gap around canonical spec and implementation-plan paths
- [x] Present a small fix plan and get approval
- **Status:** complete

### Phase 2: Implement canonical artifact propagation
- [x] Add an `Active Artifacts` section to the planning task template and current task plan
- [x] Update Zeus and Hermes guidance so canonical spec/plan paths are recorded and passed explicitly when they exist
- [x] Update Hephaestus startup rules so handoff-provided spec/plan paths are read before execution
- [x] Update planning-related skills and plugin messaging so written artifacts get registered and surfaced consistently
- **Status:** complete

### Phase 3: Verify and close out
- [x] Re-read every changed file directly
- [x] Confirm the task plan now acts as the canonical artifact index
- [x] Confirm Zeus/Hermes/Hephaestus wording aligns on artifact propagation
- [x] Confirm planning plugin messaging surfaces the artifact convention clearly without adding a second state system
- **Status:** complete

## Key Questions

1. Is task-plan-head injection alone enough once `Active Artifacts` lives near the top of `.plans/task_plan.md`?
2. Which workflow surfaces must update artifact refs directly when specs or plans are written?

## Decisions Made

| Decision | Rationale |
| -------- | --------- |
| Use `.plans/task_plan.md` as the canonical artifact index | It already sits in the planning memory lane, is auto-injected by the plugin, and avoids creating a second state system |
| Do not auto-discover the "latest" spec or plan file | Crash recovery should rely on explicit canonical refs, not heuristics |

## Errors Encountered

| Error | Attempt | Resolution |
| ----- | ------- | ---------- |
