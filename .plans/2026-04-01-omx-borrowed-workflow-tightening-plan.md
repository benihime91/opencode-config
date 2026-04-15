> **HISTORICAL:** Dated plan; may reference old agent names (e.g. Zeus). See [`HISTORICAL.md`](./HISTORICAL.md).

# Implementation Plan: OMX-Inspired Workflow Tightening

## Scope

Implement the approved workflow-tightening pass in these files only:

- `rules/agent-workflow.md`
- `agents/zeus.md`
- `skills/brainstorming/SKILL.md`

Do not edit `README.md`. Do not add new rule files, new skills, new planning-memory systems, tmux/runtime coordination, or commit-guidance surfaces.

## File Structure

- `rules/agent-workflow.md` — repo-wide workflow rules; add pre-execution intake, evidence-first completion, and stage-to-stage continuity without contradicting existing rule numbering or flow.
- `agents/zeus.md` — Zeus orchestration contract; add intake snapshot language, stronger delegation expectations, and stricter verification wording while preserving local-only planning ownership.
- `skills/brainstorming/SKILL.md` — requirement/design skill; add a lightweight readiness pass and structured design output while keeping the skill light for simple work.

## Task 1: Update `rules/agent-workflow.md`

**Files:**

- Modify: `rules/agent-workflow.md`

- [ ] **Step 1: Re-read the current rules file and preserve its structure**

Read `rules/agent-workflow.md` and keep the current style:

- short rule title
- 3-5 concrete bullets
- one `See skills:` line

Do not reorder unrelated rules unless the new rules need a clear placement.

- [ ] **Step 2: Add a pre-execution intake rule near the planning/front-end workflow rules**

Insert a new rule section after `## 1. Design And Plan Gates` with content in this shape:

```md
## 2. Pre-Execution Intake

- Before heavy planning or execution, capture the intended outcome, known context, unknowns, non-goals, decision boundaries, and readiness.
- Keep the intake lightweight. Do not turn clear, low-risk work into a ceremony.
- Use the intake to decide whether to clarify, plan, or execute.
- If readiness is low, keep resolving ambiguity before escalating into heavy planning or delegation.

See skills: `brainstorming`, `planning-with-files`, `writing-plans`
```

Adjust numbering on later rules after insertion.

- [ ] **Step 3: Add an evidence-first completion rule near verification-oriented rules**

Insert a new rule section after the current review/trust area with content in this shape:

```md
## N. Evidence-First Completion

- Treat completion claims as unproven until they are backed by concrete evidence.
- If evidence is missing, weak, or inconsistent with the claimed result, the task is still open.
- Do not accept vague summaries, unsupported “done” claims, or materially unresolved follow-up as completion.
- Match the claimed outcome to the actual verification evidence before reporting success.

See skills: `executing-plans`, `dispatching-parallel-agents`, `brainstorming`
```

Use the final correct rule number after the file is renumbered.

- [ ] **Step 4: Add a stage-to-stage continuity rule near handoff/parallelism rules**

Insert a new rule section after bounded handoffs or just before safe parallelism with content in this shape:

```md
## N. Stage-To-Stage Continuity

- Preserve assumptions, required outputs, evidence expectations, and residual risks when work moves between stages or agents.
- Do not make downstream stages infer missing context from vague summaries.
- Keep handoffs specific enough that the next stage can continue without reconstructing intent.
- If a handoff is missing critical continuity, stop and repair the handoff before proceeding.

See skills: `writing-plans`, `dispatching-parallel-agents`, `planning-with-files`
```

Use the final correct rule number after renumbering.

- [ ] **Step 5: Re-number and smooth the file**

Update all later headings so the numbering stays sequential. Preserve the existing tone and keep each new section concise.

- [ ] **Step 6: Verify the rules file directly**

Read the final `rules/agent-workflow.md` and confirm:

- all headings are numbered sequentially
- the three new rules are present
- none of the new language introduces a second planning-memory system
- none of the new language implies tmux/team-runtime machinery

## Task 2: Update `agents/zeus.md`

**Files:**

- Modify: `agents/zeus.md`

- [ ] **Step 1: Re-read the Zeus prompt around intent, planning, delegation, and verification**

Focus on these areas before editing:

- `## Phase 0 — Intent Gate`
- `## Phase 1.5 — Brainstorming To Writing-Plans`
- `### Mandatory Delegation Package (6 sections)`
- `## Phase 4 — Verification`
- `## Phase 5 — Completion`

- [ ] **Step 2: Add an intake snapshot requirement after intent classification**

Add language in `## Phase 0 — Intent Gate` or immediately after it that requires Zeus to capture a short intake snapshot before heavy planning or delegation. Use content in this shape:

```md
### Intake Snapshot

Before heavy planning or delegation, capture:

- intended outcome
- known facts
- unknowns or blockers
- non-goals
- decision boundaries
- readiness assessment

Keep this short. It is a checkpoint, not a second planning system.
```

Make sure this language fits Zeus's existing local-only ownership model.

- [ ] **Step 3: Tighten the delegation-package quality bar**

Add explicit expectations under the delegation-package section that handoffs must make these items clear when relevant:

- assumed inputs
- expected outputs
- exact evidence required
- residual risks or open questions

Use wording that builds on the existing six-section package instead of creating a seventh section.

- [ ] **Step 4: Strengthen the verification rules**

Add or tighten wording in `## Phase 4 — Verification` and `## Phase 5 — Completion` so Zeus explicitly treats these as incomplete:

- no evidence
- vague summary without support
- `STATUS: done` paired with material unresolved follow-up

Use language in this shape:

```md
No evidence means not done.
Vague summaries are not completion.
Material unresolved follow-up keeps the task open.
```

Blend this into the existing checklist and completion criteria rather than leaving it as a floating slogan.

- [ ] **Step 5: Verify Zeus for consistency**

Read the final `agents/zeus.md` and confirm:

- the intake snapshot is present
- the delegation package now requires continuity/evidence clarity
- the verification section is stricter without contradicting the local-only planning boundary
- the file still reads like one coherent orchestration prompt

## Task 3: Update `skills/brainstorming/SKILL.md`

**Files:**

- Modify: `skills/brainstorming/SKILL.md`

- [ ] **Step 1: Re-read the current process sections**

Focus on these areas before editing:

- checklist
- “Understanding the idea”
- “Exploring approaches”
- “Presenting the design”
- “Key Principles”

- [ ] **Step 2: Add a lightweight readiness pass before approach selection**

Insert guidance between clarification and approach proposal with content in this shape:

```md
### Readiness Pass

Before proposing approaches, check:

- intent clarity
- scope clarity
- known constraints
- success criteria
- non-goals
- decision boundaries

If these are clear enough, proceed. If not, keep clarifying one question at a time.
Keep this lightweight. The goal is clarity, not ritual.
```

- [ ] **Step 3: Add structured design-output guidance**

Update the approach/design guidance so the presented design includes:

- Principles
- Decision Drivers
- Viable Options
- Recommendation

Use wording that preserves the existing conversational style while making the output shape more deliberate.

- [ ] **Step 4: Keep the anti-ceremony guardrails explicit**

Add a short reminder that:

- the readiness pass must stay light
- simple work should not be forced through a long interview loop
- the skill should still ask one question at a time

- [ ] **Step 5: Verify the skill text directly**

Read the final `skills/brainstorming/SKILL.md` and confirm:

- the readiness pass is present
- the structured output guidance is present
- the skill still forbids implementation before design approval
- the new language stays lightweight and does not drift into heavy scoring formulas

## Task 4: Cross-File Verification

**Files:**

- Read: `rules/agent-workflow.md`
- Read: `agents/zeus.md`
- Read: `skills/brainstorming/SKILL.md`

- [ ] **Step 1: Read all three edited files together**

Check the final wording across all three files in one pass.

- [ ] **Step 2: Confirm concept alignment**

Verify these mappings hold:

- repo-wide rule: pre-execution intake ↔ Zeus intake snapshot ↔ brainstorming readiness pass
- repo-wide rule: evidence-first completion ↔ Zeus verification/completion language
- repo-wide rule: stage-to-stage continuity ↔ Zeus delegation expectations

- [ ] **Step 3: Confirm non-goals stayed intact**

Verify none of the edits:

- add `README.md` changes
- introduce `.omx`-style state
- imply tmux/team-runtime orchestration
- move planning/spec ownership away from Zeus/Hermes

- [ ] **Step 4: Spot-check for tone and duplication**

Trim any repeated wording if the same sentence appears too many times across all three files. Keep the concepts aligned, but let each file do its own job.

## Task 5: Final Plan-State Update

**Files:**

- Modify: `.plans/progress.md`
- Modify: `.plans/task_plan.md`

- [ ] **Step 1: Update progress log after implementation**

Add a short summary of:

- the three files edited
- the new intake/readiness/evidence/continuity concepts added
- the verification checks performed

- [ ] **Step 2: Mark the active task complete if verification passes**

Update `.plans/task_plan.md` only after the cross-file verification is done and the borrowed-workflow report plus follow-up implementation work are complete.

## Self-Review

- Spec coverage check: the plan covers all accepted design requirements across the three target files and preserves the explicit non-goals.
- Placeholder scan: no `TBD`, `TODO`, or “update as needed” placeholders remain.
- Naming consistency check: this plan uses `pre-execution intake`, `intake snapshot`, `readiness pass`, `evidence-first completion`, and `stage-to-stage continuity` consistently.

## Notes For Execution

- Do not create commits unless the user explicitly asks.
- Keep edits small and local.
- Re-read files after editing before claiming completion.
- If one file starts to imply a broader system, trim it back to the approved scope.
