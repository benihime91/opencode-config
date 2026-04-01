# Implementation Plan: Subagent Artifact Context Propagation

## Scope

Tighten the existing planning-memory system so the active spec and active implementation plan are stored in `.plans/task_plan.md`, surfaced through planning prompts, and passed explicitly in Zeus/Hermes-led execution flows.

## Files

- Modify: `.plans/task_plan.md`
- Modify: `.plans/findings.md`
- Modify: `.plans/progress.md`
- Modify: `skills/planning-with-files/templates/task_plan.md`
- Modify: `plugins/planning-with-files/messages.ts`
- Modify: `agents/zeus.md`
- Modify: `agents/hermes.md`
- Modify: `agents/hephaestus.md`
- Modify: `skills/brainstorming/SKILL.md`
- Modify: `skills/writing-plans/SKILL.md`

## Tasks

### Task 1: Make task plans carry canonical artifact refs
- Add an `Active Artifacts` section near the top of `skills/planning-with-files/templates/task_plan.md`.
- Ensure the section contains active task name, active spec path, active plan path, and last updated.
- Update the live `.plans/task_plan.md` to use the new structure for this task.

### Task 2: Tighten orchestration and execution guidance
- Update `agents/zeus.md` so delegation packages must pass exact spec/plan paths in `MUST DO` and `CONTEXT` when those artifacts exist.
- Update `agents/hermes.md` so shared planning memory explicitly includes keeping canonical artifact refs current.
- Update `agents/hephaestus.md` so handoff-provided spec/plan paths are read before execution.

### Task 3: Align planning prompts and authoring skills
- Update `plugins/planning-with-files/messages.ts` so runtime planning prompts tell sessions to treat `Active Artifacts` in the task plan as canonical refs.
- Update `skills/brainstorming/SKILL.md` so writing a spec also means recording its path in `.plans/task_plan.md`.
- Update `skills/writing-plans/SKILL.md` so saving an implementation plan also means recording its path in `.plans/task_plan.md`.

### Task 4: Verification and planning-memory closeout
- Re-read every changed file directly.
- Confirm the artifact convention is consistent across template, prompts, and agent rules.
- Record the implementation result and any watch items in `.plans/findings.md` and `.plans/progress.md`.

## Verification

- Direct read-back of all edited files.
- Grep for `Active Artifacts`, `active_spec_path`, `active_plan_path`, and explicit Zeus handoff wording requiring spec/plan reads.
- Confirm the fix does not introduce heuristic artifact discovery or a second planning state system.
