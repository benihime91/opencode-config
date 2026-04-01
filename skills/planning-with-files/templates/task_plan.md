# Task Plan: [Brief Description]

<!--
  WHAT: This is your roadmap for the entire task. Think of it as your "working memory on disk."
  WHY: After 50+ tool calls, your original goals can get forgotten. This file keeps them fresh.
  WHEN: Create this FIRST, before starting any work. Update after each phase completes.
-->

## Goal

<!--
  WHAT: One clear sentence describing what you're trying to achieve.
  WHY: This is your north star. Re-reading this keeps you focused on the end state.
  EXAMPLE: "Create a Python CLI todo app with add, list, and delete functionality."
-->

[One sentence describing the end state]

## Intake

<!--
  WHAT: Capture the minimum framing needed before heavy planning or execution.
  WHY: A light intake keeps the task grounded without turning this file into a second planning system.
  WHEN: Fill this out near the start, then update it only when the task meaningfully changes.
-->

- **Intended outcome:** [What should be true when this task is done?]
- **Known context:** [Facts, existing repo state, approved direction, or constraints already confirmed]
- **Unknowns / blockers:** [Open questions, missing evidence, or risks that could stop progress]
- **Non-goals:** [What this task should not expand into]
- **Decision boundaries:** [What you can decide locally vs what needs approval or stronger evidence]
- **Readiness:** [ready | needs_clarification | blocked — and one short reason]

## Current Phase

<!--
  WHAT: Which phase you're currently working on (e.g., "Phase 1", "Phase 3").
  WHY: Quick reference for where you are in the task. Update this as you progress.
-->

Phase 1

## Phases

<!--
  WHAT: Break your task into 3-7 logical phases. Each phase should be completable.
  WHY: Breaking work into phases prevents overwhelm and makes progress visible.
  WHEN: Update status after completing each phase: pending → in_progress → complete
-->

### Phase 1: Requirements & Discovery

<!--
  WHAT: Understand what needs to be done and gather initial information.
  WHY: Starting without understanding leads to wasted effort. This phase prevents that.
-->

- [ ] Understand user intent
- [ ] Identify constraints and requirements
- [ ] Document findings in findings.md
- [ ] Note open questions or blockers before moving on
- **Status:** in_progress
<!--
  STATUS VALUES:
  - pending: Not started yet
  - in_progress: Currently working on this
  - complete: Finished this phase

  PHASE CLOSE:
  - Mark a phase complete only when the important findings, decisions, and open risks are recorded clearly enough for a future reader to continue.
 -->

### Phase 2: Planning & Structure

<!--
  WHAT: Decide how you'll approach the problem and what structure you'll use.
  WHY: Good planning prevents rework. Document decisions so you remember why you chose them.
-->

- [ ] Define technical approach
- [ ] Create project structure if needed
- [ ] Document decisions with rationale
- [ ] Record decision boundaries or unresolved tradeoffs
- **Status:** pending

### Phase 3: Implementation

<!--
  WHAT: Actually build/create/write the solution.
  WHY: This is where the work happens. Break into smaller sub-tasks if needed.
-->

- [ ] Execute the plan step by step
- [ ] Write code to files before executing
- [ ] Test incrementally
- [ ] Record meaningful changes and remaining open work in progress.md
- **Status:** pending

### Phase 4: Testing & Verification

<!--
  WHAT: Verify everything works and meets requirements.
  WHY: Catching issues early saves time. Document test results in progress.md.
-->

- [ ] Verify all requirements met
- [ ] Document test results in progress.md
- [ ] Fix any issues found
- [ ] Capture what evidence supports completion and what risks remain open
- **Status:** pending

### Phase 5: Delivery

<!--
  WHAT: Final review and handoff to user.
  WHY: Ensures nothing is forgotten and deliverables are complete.
-->

- [ ] Review all output files
- [ ] Ensure deliverables are complete
- [ ] Check that completion claims match the available evidence
- [ ] Note any open risks, follow-up, or limits explicitly
- [ ] Deliver to user
- **Status:** pending

## Key Questions

<!--
  WHAT: Important questions you need to answer during the task.
  WHY: These guide your research and decision-making. Answer them as you go.
  EXAMPLE:
    1. Should tasks persist between sessions? (Yes - need file storage)
    2. What format for storing tasks? (JSON file)
-->

1. [Question to answer]
2. [Question to answer]

## Decisions Made

<!--
  WHAT: Technical and design decisions you've made, with the reasoning behind them.
  WHY: You'll forget why you made choices. This table helps you remember and justify decisions.
  WHEN: Update whenever you make a significant choice (technology, approach, structure).
  EXAMPLE:
    | Use JSON for storage | Simple, human-readable, built-in Python support |
-->

| Decision | Rationale |
| -------- | --------- |
|          |           |

## Errors Encountered

<!--
  WHAT: Every error you encounter, what attempt number it was, and how you resolved it.
  WHY: Logging errors prevents repeating the same mistakes. This is critical for learning.
  WHEN: Add immediately when an error occurs, even if you fix it quickly.
  EXAMPLE:
    | FileNotFoundError | 1 | Check if file exists, create empty list if not |
    | JSONDecodeError | 2 | Handle empty file case explicitly |
-->

| Error | Attempt | Resolution |
| ----- | ------- | ---------- |
|       | 1       |            |

## Notes

<!--
  REMINDERS:
  - Update phase status as you progress: pending → in_progress → complete
  - Re-read this plan before major decisions (attention manipulation)
  - Log ALL errors - they help avoid repetition
  - Never repeat a failed action - mutate your approach instead
  - Use findings.md for reusable facts and decisions; use progress.md for actions, verification, and next steps
  - Completion claims should point to evidence and any open risks, not just status changes
 -->

- Update phase status as you progress: pending → in_progress → complete
- Re-read this plan before major decisions (attention manipulation)
- Log ALL errors - they help avoid repetition
- Use findings.md for reusable facts and decisions; use progress.md for actions, verification, and next steps
- Completion claims should point to evidence and any open risks, not just status changes
