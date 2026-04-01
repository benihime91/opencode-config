# Design: OMX-Inspired Workflow Tightening for OpenCode

## Goal

Improve OpenCode's workflow discipline by borrowing the highest-value patterns from `oh-my-codex` without importing its heavier runtime model.

This pass is intentionally limited to:

- `rules/agent-workflow.md`
- `agents/zeus.md`
- `skills/brainstorming/SKILL.md`

This pass explicitly excludes:

- `README.md`
- tmux/team-runtime ideas
- a new `.omx`-style state system
- full autonomous execution modes
- commit-guidance additions outside the three target files

## Why This Pass

The deep dive showed that `oh-my-codex` is strongest in workflow scaffolding, not in runtime architecture. The best near-term gains for OpenCode are:

1. better intake before heavy work
2. more structured planning output
3. stricter evidence-first completion rules

OpenCode already has strong foundations: Zeus-led orchestration, specialist delegation, planning-file memory, explicit workflow rules, and skill-based permissions. This design sharpens those existing strengths instead of replacing them.

## Constraints

- Preserve Zeus/Hermes ownership of planning and spec memory.
- Do not create a second durable-state system.
- Keep the new behavior lightweight and usable on normal tasks.
- Do not turn brainstorming into a mandatory long interview loop.
- Do not weaken the existing local-only planning and verification model.

## Non-Goals

- Building a new runtime coordination system
- Adding tmux worker orchestration
- Porting `oh-my-codex` autonomy language wholesale
- Introducing quantitative formulas that feel ritual-heavy
- Refactoring unrelated prompt or rule surfaces

## Design Overview

The change has three parts:

1. add repo-wide workflow rules for intake, evidence, and continuity
2. tighten Zeus's orchestration contract around readiness, delegation, and verification
3. add a lightweight readiness rubric plus more structured design output to `brainstorming`

## Principles

- Borrow structure, not machinery.
- Tighten the highest-leverage workflow surfaces first.
- Keep ownership centralized where OpenCode already centralizes it.
- Require evidence for completion claims.
- Use light process that scales up when ambiguity is high and stays small when work is clear.

## Decision Drivers

1. High value with low blast radius
2. Fit with existing Zeus-led orchestration
3. Better first-pass clarity on ambiguous work
4. Better completion trust without introducing heavy runtime complexity

## Viable Options

### Option A — Minimal prompt/rule tightening

Update only the three approved files with lightweight intake, structured planning output, and stricter evidence rules.

**Pros**

- low blast radius
- aligns with current architecture
- fast to implement and validate

**Cons**

- does not add richer state or automation on its own

### Option B — Heavier formalization inside the same files

Add scoring formulas, stricter gates, and stronger process language.

**Pros**

- more consistency
- closer to `oh-my-codex`

**Cons**

- higher risk of ceremony
- worse fit for simple tasks

### Option C — Add a new supporting skill or rule surface

Keep existing files lighter and move the new structure into a separate surface.

**Pros**

- cleaner separation

**Cons**

- more moving parts
- not necessary for this scope

## Recommendation

Choose **Option A**.

It captures the best parts of the `oh-my-codex` workflow improvements while preserving OpenCode's current shape.

## File-Level Design

### 1. `rules/agent-workflow.md`

Add three cross-cutting rules.

#### Rule: Pre-Execution Intake

Before heavy planning or execution, the active agent should capture:

- intended outcome
- known context
- unknowns or blockers
- non-goals
- decision boundaries
- readiness assessment

This rule should be lightweight and should not force extra ceremony for already-clear tasks.

#### Rule: Evidence-First Completion

Completion requires concrete verification evidence. A task is not done when the evidence is missing, weak, or inconsistent with the claimed result.

This should reinforce existing review-before-trust behavior with clearer outcome language.

#### Rule: Stage-to-Stage Continuity

When work passes between stages or agents, the handoff must preserve:

- assumptions
- required outputs
- evidence expectations
- residual risk or open questions

This makes the workflow more continuous and reduces dropped context between intake, planning, execution, and verification.

### 2. `agents/zeus.md`

Tighten Zeus in three places.

#### Intake Snapshot

After intent classification and before heavy planning or delegation, Zeus should create a short intake snapshot covering:

- intended outcome
- known facts
- unknowns or blockers
- non-goals
- decision boundaries
- readiness assessment

This is a short internal checkpoint, not a separate planning system.

#### Stronger Delegation Contract

Extend Zeus handoff expectations so delegation packages and returned work make these items explicit:

- assumed inputs
- expected outputs
- exact evidence required
- residual risks or open questions

This should build on the existing six-section package, not replace it.

#### Harder Verification Language

Zeus should explicitly treat the following as incomplete:

- no evidence
- vague summary without support
- claimed completion with material unresolved follow-up

This sharpens the existing verification stance without changing Zeus's role.

### 3. `skills/brainstorming/SKILL.md`

Add a light readiness layer and more structured design output.

#### Readiness Pass

Before proposing approaches, the skill should check:

- intent clarity
- scope clarity
- known constraints
- success criteria
- non-goals
- decision boundaries

If these are sufficiently clear, the process moves forward. If not, the skill keeps asking one question at a time.

This is not a weighted scoring formula. The goal is clarity, not ritual.

#### Structured Design Output

When presenting approaches and design, the skill should include:

- Principles
- Decision Drivers
- Viable Options
- Recommendation

This borrows the best planning structure from `RALPLAN-DR` while staying concise.

## Data and Control Flow

1. User request arrives.
2. Zeus classifies intent.
3. For non-trivial work, Zeus performs a short intake snapshot.
4. If the work needs clarification, `brainstorming` runs a lightweight readiness pass.
5. `brainstorming` presents structured options and a recommendation.
6. Zeus writes or approves planning artifacts as it already does.
7. Zeus delegates execution with stronger continuity and evidence expectations.
8. Zeus verifies completion using the stricter evidence-first rule.

## Error Handling

- If readiness is low, do not force design prematurely; continue clarification.
- If a subagent reports completion without adequate evidence, keep the task open.
- If handoff continuity is weak, request a corrected handoff or redelegate with tighter constraints.

## Testing and Validation

Validation for this pass is workflow-oriented, not product-oriented.

Success looks like:

- ambiguous tasks become clearer earlier
- planning output becomes more structured and comparable
- subagent completion claims require better evidence
- fewer tasks are treated as done on vague summaries alone

Recommended verification after implementation:

- read all three edited files directly
- confirm the new intake/readiness/evidence language is present and internally consistent
- confirm the new rules do not contradict local-only planning ownership
- if possible, spot-check the workflow on one ambiguous task scenario

## Risks

- Too much process could make simple tasks slower.
- Readiness language could accidentally become rigid if written too heavily.
- Zeus guidance could duplicate rule content if phrased carelessly.

## Risk Mitigation

- Keep the intake snapshot short.
- Keep readiness language qualitative and lightweight.
- Add structure only where it improves decisions or verification.
- Reuse existing concepts rather than inventing a new system.

## Acceptance Criteria

This design is satisfied when:

1. `rules/agent-workflow.md` includes repo-wide guidance for pre-execution intake, evidence-first completion, and stage-to-stage continuity.
2. `agents/zeus.md` includes a short intake snapshot concept, stronger delegation expectations, and harder verification language.
3. `skills/brainstorming/SKILL.md` includes a lightweight readiness pass and more structured design output.
4. None of the three files introduce a second planning-memory system or a tmux-style runtime model.
5. The new language remains lightweight enough for OpenCode's existing operating style.

## ADR

### Decision

Adopt a minimal OMX-inspired workflow-tightening pass across the three highest-leverage orchestration surfaces.

### Status

Proposed

### Consequences

- OpenCode gains sharper intake, planning, and verification behavior.
- The repo avoids premature runtime complexity.
- Future deeper workflow changes can build on a cleaner foundation if they are still needed later.
