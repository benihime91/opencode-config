# Planning Workflow Alignment Design

## Goal

Align the planning plugin and planning-file templates with the newer intake, continuity, and evidence-first workflow so the runtime nudges and durable artifacts reinforce the same behavior.

## Scope

In scope:

- `plugins/planning-with-files.ts`
- `skills/planning-with-files/templates/task_plan.md`
- `skills/planning-with-files/templates/findings.md`
- `skills/planning-with-files/templates/progress.md`

Out of scope:

- new persistent state systems beyond `.plans/`
- `.omx`-style state/runtime machinery
- tmux/team coordination
- plugin-owned planning decisions
- changes to ownership of `.plans/task_plan.md`, `.plans/findings.md`, or `.plans/progress.md`

## Constraints

- Keep the pass lightweight and advisory.
- Preserve Zeus/Hermes ownership of the planning trio.
- Do not turn the plugin into a second planner.
- Keep the templates general-purpose, but align them with the newer intake and evidence-first workflow.

## Design Overview

This pass tightens consistency between two existing layers:

1. the runtime planning nudges in `plugins/planning-with-files.ts`
2. the durable planning artifacts in the three template files

The plugin should nudge a better shape. The templates should give the agent a matching place to write that shape down. The result should be stronger continuity and verification without introducing a richer orchestration runtime.

## Principles

- One planning system, not two.
- Intake should be lightweight and front-loaded.
- Evidence should be explicit before completion claims.
- Ownership boundaries stay unchanged.
- Templates should make good behavior easier, not more ceremonial.

## Options Considered

### Option A — Template-only cleanup

Update only the template files.

Pros:

- lowest implementation risk
- no plugin behavior change

Cons:

- runtime nudges still reinforce the older, thinner shape
- users may continue drifting from the template structure

### Option B — Plugin-only nudge tightening

Update only `plugins/planning-with-files.ts`.

Pros:

- smaller code surface
- stronger runtime guidance immediately

Cons:

- the written templates would still be misaligned with the nudges
- durable artifacts would remain less structured than the reminders

### Option C — Light alignment pass across plugin and templates **(recommended)**

Update the plugin nudges and the three templates together.

Pros:

- strongest consistency across runtime guidance and durable artifacts
- still bounded to four files
- improves planning quality without adding a new system

Cons:

- slightly larger review surface than a one-file pass

## File-Level Design

### 1. `plugins/planning-with-files.ts`

Adjust reminder text and status nudges so they reinforce:

- a lightweight intake snapshot for complex work:
  - intended outcome
  - known facts
  - unknowns or blockers
  - non-goals
  - decision boundaries
  - readiness
- stronger phase-close hygiene:
  - what changed
  - what was verified
  - what remains open

The plugin should remain advisory. It should not generate planning decisions or require a new structured store beyond the existing files.

### 2. `templates/task_plan.md`

Add a small intake section near the top so a new planning file naturally captures:

- intended outcome
- known context
- unknowns / blockers
- non-goals
- decision boundaries
- readiness assessment

Also tighten the phase structure so phase completion encourages explicit evidence and open-risk capture, not only status toggles.

### 3. `templates/findings.md`

Refine findings capture so important discoveries are easier to reuse in later decisions. The template should make room for:

- source
- confidence
- relevance
- decision impact

This should strengthen evidence quality without turning findings into a rigid database.

### 4. `templates/progress.md`

Make progress logging more execution-oriented by encouraging a repeatable shape for key updates:

- action
- result
- verification
- next step

This should improve resumability and make phase-close summaries easier to trust.

## Data and Control Flow

1. Agent starts complex work.
2. Plugin provides planning context and nudges the improved intake/result shape.
3. Agent writes into templates that already match that shape.
4. Later reminders and read-backs see the same structure the plugin encouraged.
5. Zeus/Hermes remain the only owners of the planning trio.

## Error Handling

- If the plugin cannot load planning status or plan head, it should continue failing soft, as it does today.
- The pass should not add any new failure modes around planning ownership.
- Template changes must stay useful even when an agent fills them partially.

## Risks and Mitigations

### Risk: the pass adds ceremony

Mitigation:

- keep intake lightweight
- keep prompts advisory where appropriate
- avoid scoring systems or extra state files in this pass

### Risk: plugin and templates drift again later

Mitigation:

- align both surfaces in the same pass
- phrase both around the same intake and evidence-first concepts

### Risk: accidental move toward a second planning system

Mitigation:

- keep ownership and storage unchanged
- avoid registries, queues, locks, or new runtime state surfaces

## Validation

- Read back `plugins/planning-with-files.ts` after the edit.
- Read back all three planning templates after the edit.
- Confirm wording stays advisory where needed.
- Confirm Zeus/Hermes ownership remains unchanged.
- Confirm the pass does not introduce `.omx`-style state, tmux/runtime coordination, or a second planning system.

## Acceptance Criteria

- Plugin nudges align with the newer intake / continuity / evidence-first workflow.
- The three planning templates give the agent matching places to record that information.
- The pass improves consistency without adding heavy ritual.
- Ownership and planning-memory boundaries remain intact.

## ADR

### Context

The repo now has stronger intake, continuity, and evidence-first guidance in Zeus, brainstorming, and the workflow rules, but the planning plugin and planning templates still reflect an older, thinner shape.

### Decision

Run a bounded alignment pass across the planning plugin and the three planning templates.

### Consequences

- better consistency between runtime nudges and on-disk planning artifacts
- stronger resumability and verification hygiene
- no need for a heavier runtime/state redesign in this pass
