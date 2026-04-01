# Planning Reminder Noise Reduction Plan

## Scope

Reduce avoidable reminder repetition in `plugins/planning-with-files.ts` only. Preserve the planning workflow, ownership rules, self-loop breaker, and current intake/task/status reminder concepts.

## File Structure

- Modify: `plugins/planning-with-files.ts`
  - Keep the existing reminder model.
  - Add a small local dedupe mechanism for closeout/continuity reminders within a single eligible tool flow.
  - Preserve Zeus/Hermes-only planning-file ownership and soft-failure behavior.

## Task 1: Add local reminder dedupe

**Files:**
- Modify: `plugins/planning-with-files.ts`

- [ ] **Step 1: Identify the duplicate reminder path**

Read the owner and read-only reminder flow in `tool.execute.after` and `maybeAppendStatus()`.

Expected confirmation:
- owner closeout reminder can be appended in `tool.execute.after`
- owner closeout reminder can be appended again in `maybeAppendStatus()`
- read-only continuity reminder is emitted from `tool.execute.after` paths only

- [ ] **Step 2: Add a per-flow dedupe guard**

Implement a small local boolean-style guard in `tool.execute.after` so the current call flow knows whether it already appended a closeout/continuity reminder before status is appended.

Requirements:
- no new persistent cache
- no new files
- no change to tool eligibility
- no change to ownership enforcement

- [ ] **Step 3: Route reminder appends through the dedupe guard**

Update the reminder append sites so:
- task-result flows still emit their task reminder
- write/edit flows still emit their standard reminder
- closeout/continuity guidance is appended at most once per eligible tool flow
- status output still appears when available

- [ ] **Step 4: Preserve behavior boundaries**

Re-check that the following remain unchanged:
- planning-file self-loop breaker
- Zeus/Hermes-only planning-file edit protection
- soft failure when planning status is unavailable
- no reminders for non-eligible tools

## Task 2: Verify the bounded pass

**Files:**
- Read: `plugins/planning-with-files.ts`

- [ ] **Step 1: Read back the final file**

Confirm the final file contains:
- a clear local dedupe mechanism
- unchanged intake reminder behavior
- unchanged status output behavior
- unchanged ownership protection text

- [ ] **Step 2: Check scope discipline**

Confirm no template files or additional runtime/state surfaces were edited for this implementation pass.

- [ ] **Step 3: Record completion in planning memory**

After implementation and verification:
- mark the active task-plan phase complete
- record the dedupe result and verification in `.plans/findings.md`
- log the execution and verification steps in `.plans/progress.md`

## Verification Checklist

- `plugins/planning-with-files.ts` is the only implementation file changed
- only one closeout/continuity reminder can be appended per eligible tool flow
- task-result reminders still exist
- status output still exists
- Zeus/Hermes ownership protections still exist
- no template or second planning-system drift

## Self-Review

- Spec coverage: the plan covers the bounded plugin-only scope, local dedupe approach, behavior-preservation requirement, and direct read-back validation.
- Placeholder scan: no `TBD`, `TODO`, or deferred implementation placeholders remain.
- Consistency: the plan consistently describes a local dedupe guard rather than a redesign of the reminder model.

## Execution Notes

- This is a single-file implementation pass. Sequence the work rather than parallelizing it.
- If the cleanest implementation requires broader structural change, stop and reassess instead of widening scope.
- Do not commit unless the user explicitly asks.
