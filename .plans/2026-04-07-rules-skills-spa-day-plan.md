# Implementation Plan: Rules And Skills Spa Day

## Goal

Reduce contradictions across the repo's rules and skills by making rules the stable home for cross-cutting principles and skills the stable home for task-shaped workflows.

## File Map

### Core rule surfaces

- Modify: `rules/agent-workflow.md`
  - Keep only durable cross-cutting workflow principles.
  - Make precedence explicit: rules are defaults; skills may narrow behavior within their scope.
- Modify: `rules/agent-writing.md`
  - Keep principle-focused writing guidance.
  - Trim any workflow-style wording if found during the pass.

### Workflow skills likely to shrink and sharpen

- Modify: `skills/brainstorming/SKILL.md`
  - Keep trigger conditions, question cadence, readiness flow, option framing, and approval gate.
  - Remove duplicated repo-wide policy that already lives in rules.
- Modify: `skills/planning-with-files/SKILL.md`
  - Keep durable planning-memory workflow and `.plans/` ownership.
  - Remove or soften broad behavior claims already covered by rules.
- Modify: `skills/repo-discovery/SKILL.md`
  - Keep repo-understanding workflow, Context+ sequencing, confirmation, and blast-radius behavior.
  - Avoid restating generic evidence policy beyond what this workflow needs.

### mcporter-linked research skill cluster

- Modify: `skills/mcporter/SKILL.md`
  - Keep generic direct-CLI guidance canonical.
  - Tighten wording where downstream skills should inherit rather than restate.
- Modify: `skills/docs-research/SKILL.md`
  - Keep official-doc and targeted-lookup workflow.
  - Align wording and command style with current mcporter guidance.
- Modify: `skills/deep-research/SKILL.md`
  - Keep broad multi-source research workflow and fallback hierarchy.
  - Align wording and command style with current mcporter guidance.
- Modify: `skills/annotation-sync/SKILL.md`
  - Keep annotation lifecycle workflow.
  - Align command examples and config wording with current mcporter guidance.
- Modify: `skills/exa-search/SKILL.md`
  - Rewrite away from MCP-first framing.
  - Remove stale `~/.claude.json` setup instructions.
  - Align Exa usage with the current `mcporter` workflow and repo config path.

## Execution Tasks

### Task 1: Rewrite the canonical boundary in the rule layer

**Files:**

- Modify: `rules/agent-workflow.md`
- Modify: `rules/agent-writing.md`

- [ ] Step 1: Re-read both rule files and list any lines that still act like workflow playbooks instead of stable principles.
- [ ] Step 2: Rewrite `rules/agent-workflow.md` so it stays principle-first, explicitly states the rule-vs-skill precedence model, and removes duplicated operational detail better owned by skills.
- [ ] Step 3: Trim `rules/agent-writing.md` only if needed so it remains principle-first and does not duplicate workflow-specific writing guidance.
- [ ] Step 4: Re-read both edited rule files directly and confirm they still read as durable repo policy rather than step-by-step procedures.

### Task 2: Rewrite the core workflow skills around their real jobs

**Files:**

- Modify: `skills/brainstorming/SKILL.md`
- Modify: `skills/planning-with-files/SKILL.md`
- Modify: `skills/repo-discovery/SKILL.md`

- [ ] Step 1: Re-read each skill and mark which sections are true workflow instructions versus duplicated cross-cutting policy.
- [ ] Step 2: Rewrite `skills/brainstorming/SKILL.md` so it stays focused on requirement discovery, readiness, options, design approval, and handoff into planning.
- [ ] Step 3: Rewrite `skills/planning-with-files/SKILL.md` so it stays focused on `.plans/` workflow, persistence timing, and planning-memory hygiene.
- [ ] Step 4: Rewrite `skills/repo-discovery/SKILL.md` so it stays focused on repo discovery sequence, semantic search breadth, direct confirmation, and blast-radius checks.
- [ ] Step 5: Re-read all three skills directly and confirm each one is narrower than before, with fewer repo-wide behavioral claims.

### Task 3: Consolidate the mcporter-linked research skill cluster

**Files:**

- Modify: `skills/mcporter/SKILL.md`
- Modify: `skills/docs-research/SKILL.md`
- Modify: `skills/deep-research/SKILL.md`
- Modify: `skills/annotation-sync/SKILL.md`
- Modify: `skills/exa-search/SKILL.md`

- [ ] Step 1: Re-read the five skills together and assign canonical ownership:
  - `mcporter` owns generic direct CLI guidance.
  - `docs-research` owns targeted docs workflow.
  - `deep-research` owns broad cited synthesis workflow.
  - `annotation-sync` owns annotation lifecycle workflow.
  - `exa-search` owns when Exa is the right search surface and how to use it inside the repo's current CLI model.
- [ ] Step 2: Rewrite `skills/mcporter/SKILL.md` only where needed so downstream skills can point at it instead of re-explaining the same generic CLI rules.
- [ ] Step 3: Rewrite `skills/docs-research/SKILL.md`, `skills/deep-research/SKILL.md`, and `skills/annotation-sync/SKILL.md` so they inherit generic mcporter conventions without duplicating them unnecessarily.
- [ ] Step 4: Rewrite `skills/exa-search/SKILL.md` from scratch if needed so it matches current repo reality, uses the shared config path, prefers the current CLI model, and drops stale MCP/server-install instructions.
- [ ] Step 5: Re-read all five skills directly and confirm the command style, config path, and ownership boundaries are consistent.

### Task 4: Verify contradiction reduction and update planning memory

**Files:**

- Re-read: `rules/agent-workflow.md`
- Re-read: `rules/agent-writing.md`
- Re-read: `skills/brainstorming/SKILL.md`
- Re-read: `skills/planning-with-files/SKILL.md`
- Re-read: `skills/repo-discovery/SKILL.md`
- Re-read: `skills/mcporter/SKILL.md`
- Re-read: `skills/docs-research/SKILL.md`
- Re-read: `skills/deep-research/SKILL.md`
- Re-read: `skills/annotation-sync/SKILL.md`
- Re-read: `skills/exa-search/SKILL.md`
- Update: `.plans/task_plan.md`
- Update: `.plans/findings.md`
- Update: `.plans/progress.md`

- [ ] Step 1: Re-read every changed file directly after editing.
- [ ] Step 2: Check the key contradiction clusters explicitly:
  - rule principles vs skill workflows
  - evidence policy vs workflow-specific confirmation steps
  - generic mcporter guidance vs downstream research/annotation skill guidance
  - stale Exa setup language vs the current repo CLI model
- [ ] Step 3: Update `.plans/findings.md` with the final canonical homes and any intentional overlap that remains.
- [ ] Step 4: Update `.plans/progress.md` with what changed, what was verified, and what remains open.
- [ ] Step 5: Update `.plans/task_plan.md` so the current phase, active plan path, and phase statuses reflect the finished implementation state.

## Verification Standard

- Directly re-read every changed file.
- Treat contradiction reduction as incomplete unless the rewritten files show clear ownership boundaries in plain text.
- If a workflow skill still contains repo-wide policy that already lives in rules, either remove it or make it obviously task-scoped.
- If `exa-search` still mentions `~/.claude.json` or MCP-first setup after the pass, the task is not complete.
