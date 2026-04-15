> **HISTORICAL:** Dated design spec. See [`HISTORICAL.md`](../HISTORICAL.md).

# Planning Reminder Noise Reduction Design

## Goal

Reduce avoidable reminder repetition in `plugins/planning-with-files.ts` without changing the planning workflow, ownership model, or template surfaces.

## Scope

In scope:
- `plugins/planning-with-files.ts`

Out of scope:
- `skills/planning-with-files/templates/task_plan.md`
- `skills/planning-with-files/templates/findings.md`
- `skills/planning-with-files/templates/progress.md`
- `.plans/task_plan.md`, `.plans/findings.md`, `.plans/progress.md` as implementation targets
- ownership changes for Zeus/Hermes
- any new state, queue, registry, or `.omx`-style runtime behavior

## Problem

The current plugin now carries the right intake and closeout guidance, but it can repeat the same closeout/continuity reminder in one overall tool flow. The strongest example is the owner path where a tool result can receive a closeout reminder in `tool.execute.after` and then receive the same guidance again when status output is appended.

The goal is to reduce that repetition without weakening the planning nudges or changing when status, task-result, or ownership protections apply.

## Principles

1. Keep the pass bounded to the plugin.
2. Preserve planning concepts; only reduce repetition.
3. Prefer local dedupe over broader workflow redesign.
4. Preserve Zeus/Hermes-only planning-file ownership.
5. Do not introduce new persistence or tracking systems.

## Options Considered

### Option A — Local dedupe by flow source (recommended)

Keep the current reminder concepts, but avoid appending the same closeout/continuity reminder twice in the same eligible tool flow.

Why this wins:
- lowest blast radius
- no policy change
- directly targets the noise source

### Option B — Merge reminder blocks into one combined message

Collapse reminder variants into a new single summary block per flow.

Why not now:
- larger wording change
- more risk of losing useful distinctions between owner, read-only, and task-result paths

### Option C — Reduce reminder frequency globally

Show closeout reminders only on selected events.

Why not now:
- changes behavior rather than noise only
- higher risk of under-nudging planning hygiene

## Recommended Design

Use a small local dedupe guard inside `plugins/planning-with-files.ts`.

Desired behavior:
- keep `ownerIntakeReminderBlock()` unchanged
- keep task-result reminders unchanged except where the same closeout text would be appended twice in one flow
- keep status output unchanged
- ensure only one closeout/continuity reminder is appended per eligible tool flow

Practical shape:
- track whether the current `tool.execute.after` flow already appended a closeout/continuity reminder
- when `maybeAppendStatus()` runs after that, skip appending the duplicate closeout reminder if it already appeared in the same flow
- keep the read-only path aligned so it also emits at most one continuity-style reminder per eligible flow

## File-Level Design

### `plugins/planning-with-files.ts`

Add a small per-call-flow dedupe mechanism near the post-tool reminder logic.

Requirements:
- no new file imports unless strictly necessary
- no persistent cache for this feature
- no change to `touchesPlanningFile()` protections
- no change to which tools are eligible for reminders

Expected outcome:
- status can still be appended
- task and write/edit reminder behavior still exists
- duplicate closeout wording no longer appears in the same eligible flow

## Error Handling

- Preserve current soft-failure behavior when planning status is unavailable.
- Preserve current self-loop breaker for planning-file writes.
- If the dedupe guard cannot be applied cleanly without larger structural change, stop at the plan stage rather than widening scope.

## Validation

Direct checks after implementation:
- read back `plugins/planning-with-files.ts`
- confirm there is a clear single-flow dedupe mechanism
- confirm one closeout/continuity reminder per eligible tool flow
- confirm task-result and status behavior still exist
- confirm ownership enforcement still references Zeus/Hermes-only planning-file edits
- confirm no template files changed for this pass

## Risks And Mitigations

- Risk: remove too much reminder guidance
  - Mitigation: preserve all reminder concepts and only dedupe repeated closeout text
- Risk: accidentally alter ownership-safe behavior
  - Mitigation: leave all planning-file edit checks untouched
- Risk: broaden into a full reminder redesign
  - Mitigation: keep scope limited to duplicate suppression in the existing structure

## Acceptance Criteria

- `plugins/planning-with-files.ts` is the only implementation file changed in this pass
- the plugin emits less reminder noise without losing intake, task-result, or status guidance
- no template or `.plans/` artifact is changed as part of runtime behavior
- no ownership or planning-model drift is introduced

## ADR

### ADR-1: Prefer local dedupe over reminder redesign

Context:
The plugin now has useful planning nudges, but one review note called out possible repetition.

Decision:
Add a small local dedupe guard in the existing plugin flow rather than redesigning reminder structure.

Consequences:
- quieter output
- minimal blast radius
- preserves the newer planning guidance already approved
