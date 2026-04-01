# Planning Workflow Alignment Implementation Plan

## Scope

Implement the approved alignment pass across these four files only:

- `plugins/planning-with-files.ts`
- `skills/planning-with-files/templates/task_plan.md`
- `skills/planning-with-files/templates/findings.md`
- `skills/planning-with-files/templates/progress.md`

Keep the pass advisory and ownership-safe. Do not add a second planning system, new runtime state, or `.omx`-style workflow machinery.

## File Structure

- `plugins/planning-with-files.ts` — runtime planning nudges, reminder text, and ownership-safe planning context injection
- `skills/planning-with-files/templates/task_plan.md` — durable task framing with intake, phased execution, and closeout expectations
- `skills/planning-with-files/templates/findings.md` — durable research and decision capture with evidence quality cues
- `skills/planning-with-files/templates/progress.md` — chronological execution log with verification and next-step continuity

## Task 1: Tighten plugin reminder shape

**Files:**

- Modify: `plugins/planning-with-files.ts`

- [ ] **Step 1: Read the current plugin reminder/message flow and identify the exact message-construction call sites that should reflect the new intake and evidence-first shape.**

Read these sections directly in `plugins/planning-with-files.ts`:

- the `experimental.chat.system.transform` handler
- `tool.execute.before`
- `tool.execute.after`
- `maybeAppendStatus`

Expected result: a short note that distinguishes where intake nudges belong, where task-result persistence nudges belong, and where phase/status nudges belong.

- [ ] **Step 2: Update the plugin wording so owner-facing nudges reinforce a lightweight intake snapshot for complex work.**

Implement wording that nudges these fields without turning them into a rigid form:

- intended outcome
- known facts
- unknowns or blockers
- non-goals
- decision boundaries
- readiness

Keep the wording advisory. Do not add new persistence files, queues, registries, or autonomous planner behavior.

- [ ] **Step 3: Update the plugin wording so result/phase-close nudges reinforce evidence-first continuity.**

Implement wording that nudges these closeout items:

- what changed
- what was verified
- what remains open

Preserve the existing owner vs read-only boundary and the self-loop breaker for planning-file writes.

- [ ] **Step 4: Verify the plugin still preserves ownership boundaries and existing soft-failure behavior.**

Read the edited file and confirm:

- only Zeus/Hermes can update the planning trio
- planning-file writes still skip self-loop reminders
- no new runtime state surface was introduced
- the plugin still fails soft when status/plan content is unavailable

Expected result: the plugin language is tighter, but the runtime model is still the same bounded planning-helper model.

## Task 2: Update `task_plan.md` template

**Files:**

- Modify: `skills/planning-with-files/templates/task_plan.md`

- [ ] **Step 1: Add a lightweight intake section near the top of the template.**

Add a small section after `## Goal` and before `## Current Phase` that captures:

- intended outcome
- known context
- unknowns / blockers
- non-goals
- decision boundaries
- readiness

Keep the section simple enough for broad reuse across different task types.

- [ ] **Step 2: Tighten the phase guidance so phase exits ask for evidence and open-risk capture, not only status changes.**

Revise the phase comments/checklists so they encourage:

- explicit evidence for completion
- risks or follow-up still open
- use of `.plans/findings.md` and `.plans/progress.md` as supporting memory

Do not introduce scoring, mandatory extra files, or high-ceremony review gates.

- [ ] **Step 3: Re-read the template for clarity and proportionality.**

Verify directly that:

- the intake section is clear and lightweight
- the template still reads as one planning system
- the wording stays general-purpose rather than repo-task-specific

## Task 3: Update `findings.md` template

**Files:**

- Modify: `skills/planning-with-files/templates/findings.md`

- [ ] **Step 1: Reshape the findings guidance so discoveries are easier to trust and reuse.**

Revise the findings/research sections to encourage recording:

- source
- confidence
- relevance
- decision impact

This can be done through section wording, prompts, or small table/list structures. Keep it flexible rather than database-like.

- [ ] **Step 2: Preserve the existing strong reminder about external and multimodal findings.**

Keep the useful behavior from the current template:

- update after exploration
- capture visual/browser findings as text
- avoid losing evidence when context resets

- [ ] **Step 3: Re-read the template to confirm it still supports both research-heavy and repo-heavy tasks.**

Expected result: the template better exposes evidence quality and decision usefulness without becoming verbose or rigid.

## Task 4: Update `progress.md` template

**Files:**

- Modify: `skills/planning-with-files/templates/progress.md`

- [ ] **Step 1: Tighten the execution log shape around action, result, verification, and next step.**

Revise the session/phase log sections so a typical update naturally records:

- action taken
- result
- verification performed
- next step

Keep the log chronological and easy to skim.

- [ ] **Step 2: Keep the useful test/error/reboot structure, but make it fit the newer evidence-first workflow.**

Adjust wording where needed so:

- verification is explicit
- remaining open work is easy to spot
- the file still supports resuming after a context gap

- [ ] **Step 3: Re-read the template for continuity quality.**

Expected result: a future reader can understand what happened, what was confirmed, and what should happen next without reconstructing the whole session.

## Task 5: Cross-file verification and planning-memory update

**Files:**

- Modify: `.plans/task_plan.md`
- Modify: `.plans/findings.md`
- Modify: `.plans/progress.md`

- [ ] **Step 1: Read all four edited target files together and check concept alignment.**

Confirm all four files use the same broad shape:

- lightweight intake
- evidence-first continuity
- advisory tone where appropriate
- unchanged Zeus/Hermes ownership boundaries

- [ ] **Step 2: Check non-goals explicitly.**

Confirm the final state does **not** add:

- a second planning system
- `.omx`-style state/runtime ideas
- tmux/team coordination
- plugin-owned planning decisions

- [ ] **Step 3: Update planning memory after implementation.**

Record in `.plans/findings.md` what changed in the plugin and each template, then update `.plans/progress.md` with the execution log and verification evidence. Advance `.plans/task_plan.md` so Phase 2 becomes complete and Phase 3 becomes active or complete depending on execution status.

## Verification Checklist

- Direct read-back of `plugins/planning-with-files.ts`
- Direct read-back of `skills/planning-with-files/templates/task_plan.md`
- Direct read-back of `skills/planning-with-files/templates/findings.md`
- Direct read-back of `skills/planning-with-files/templates/progress.md`
- Confirm wording remains advisory where needed
- Confirm Zeus/Hermes-only ownership is unchanged
- Confirm no new runtime/state surface was introduced

## Self-Review

- Spec coverage check: the plan covers plugin nudges, all three templates, cross-file alignment, ownership safety, and non-goals.
- Placeholder scan: no `TBD`, `TODO`, or deferred implementation markers remain.
- Consistency check: the same intake/evidence-first concepts are used across every task.

## Execution Notes

- This is a bounded four-file implementation pass with shared conceptual alignment but overlapping planning goals; execute carefully and verify with direct reads.
- After the plan is executed, use the normal evidence-first verification standard before reporting completion.
