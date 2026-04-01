# Progress Log

<!--
  WHAT: Your session log - a chronological record of what you did, when, and what happened.
  WHY: Answers "What have I done?" in the 5-Question Reboot Test. Helps you resume after breaks.
  WHEN: Update after meaningful work, verification, or errors. More detailed than task_plan.md.
-->

## Session: [DATE]

<!--
  WHAT: The date of this work session.
  WHY: Helps track when work happened, useful for resuming after time gaps.
  EXAMPLE: 2026-01-15
-->

### Current Session

<!--
  WHAT: High-level snapshot of the active session.
  WHY: Gives a fast read on current state before someone scans the detailed updates below.
  WHEN: Update at session start and again if the session focus or status changes.
 -->

- **Status:** in_progress
- **Focus:** [current objective for this session]
- **Phase:** [task_plan.md phase or workstream]
- **Started:** [timestamp]
- **Last updated:** [timestamp]
<!--
  STATUS: Same as task_plan.md (pending, in_progress, complete, blocked)
  FOCUS: The concrete work this session is trying to complete
  PHASE: The matching task-plan phase or sub-phase
  TIMESTAMPS: Use precise times when helpful (e.g., "2026-01-15 10:00")
-->

### Update 1 — [timestamp]

  <!--
    WHAT: A chronological execution update.
    WHY: Standardizes continuity around action, result, verification, and next step.
    WHEN: Add a new update after each meaningful chunk of work, verification pass, or recovery attempt.
  -->

- **Phase:** [phase or workstream]
- **Status:** in_progress
- **Action:** [what you just did]
- **Result:** [what changed, what you learned, or what happened]
- **Verification:** [what you checked, what passed/failed, or "not run" with reason]
- **Next step:** [the next concrete local step]
- **Files touched:**
  <!--
    WHAT: Which files you created, edited, or closely reviewed in this update.
    WHY: Quick blast-radius reference for resume, debugging, and review.
    EXAMPLE:
      - todo.py (edited)
      - .plans/progress.md (updated)
  -->
  -

### Update 2 — [timestamp]

<!--
  Copy this block for additional updates. Keep the log chronological.
-->

- **Phase:** [phase or workstream]
- **Status:** pending
- **Action:**
- **Result:**
- **Verification:**
- **Next step:**
- **Files touched:**
  -

### Phase Close / Session Handoff

<!--
  WHAT: Short closeout when a phase ends, you pause work, or you hand off to another session/agent.
  WHY: Makes remaining open work and evidence easy to spot without rereading every update.
  WHEN: Fill this out before marking a phase complete, blocked, or paused.
-->

- **What changed:** [brief summary of durable changes or confirmed findings]
- **What was verified:** [most important evidence gathered this phase/session]
- **What remains open:** [unfinished work, risk, blocker, or "none"]
- **Resume from:** [the exact next action to take]

## Test Results

<!--
  WHAT: Table of tests or checks you ran, what you expected, what actually happened.
  WHY: Documents evidence, not just activity. Helps catch regressions and weak completion claims.
  WHEN: Update whenever you run a meaningful check.
  EXAMPLE:
    | Add task | python todo.py add "Buy milk" | Task added | Task added successfully | ✓ |
    | List tasks | python todo.py list | Shows all tasks | Shows all tasks | ✓ |
-->

| Test | Input | Expected | Actual | Status |
| ---- | ----- | -------- | ------ | ------ |
|      |       |          |        |        |

## Error Log

<!--
  WHAT: Detailed log of every error encountered, with timestamps and resolution attempts.
  WHY: More detailed than task_plan.md's error table. Helps you learn from mistakes.
  WHEN: Add immediately when an error occurs, even if you fix it quickly.
  EXAMPLE:
    | 2026-01-15 10:35 | FileNotFoundError | 1 | Added file existence check |
    | 2026-01-15 10:37 | JSONDecodeError | 2 | Added empty file handling |
-->
<!-- Keep ALL errors - they help avoid repetition -->

| Timestamp | Error | Attempt | Resolution |
| --------- | ----- | ------- | ---------- |
|           |       | 1       |            |

## 5-Question Reboot Check

<!--
  WHAT: Five questions that verify your context is solid. If you can answer these, you're on track.
  WHY: This is the "reboot test" - if you can answer all 5, you can resume work effectively.
  WHEN: Update periodically, especially when resuming after a break or context reset.

  THE 5 QUESTIONS:
  1. Where am I? → Current phase in task_plan.md
  2. Where am I going? → Remaining phases
  3. What's the goal? → Goal statement in task_plan.md
  4. What have I learned? → See findings.md
  5. What have I done? → See progress.md (this file)
-->
<!-- If you can answer these, context is solid -->

| Question             | Answer           |
| -------------------- | ---------------- |
| Where am I?          | Phase X          |
| Where am I going?    | Remaining phases |
| What's the goal?     | [goal statement] |
| What have I learned? | See findings.md  |
| What have I done?    | See above        |

---

<!--
  REMINDER:
  - Keep updates chronological and easy to skim
  - Record action, result, verification, and next step explicitly
  - Use the handoff block before pausing, switching phases, or marking work complete
  - Include timestamps for errors to track when issues occurred
-->

_Update after meaningful work, verification, or errors_
