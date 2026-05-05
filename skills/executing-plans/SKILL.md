---
name: executing-plans
description: Use when you have an approved implementation plan to execute with review checkpoints
---

# Executing Plans

Load the approved implementation plan, review it critically, execute each task, verify the result, and report evidence.

**Announce at start:** "I'm using the executing-plans skill to implement this plan."

## Plan Location

Implementation plans live directly in `.docs/.plans/<timestamp>-<unique-name>-plan.md`.

## Process

### 1. Load And Review

1. Read `.docs/.plans/findings.md` when present.
2. Read the named plan file.
3. Review for blockers, unsafe assumptions, missing files, unclear steps, and verification gaps.
4. If the plan has critical gaps, stop and ask before editing.
5. If the plan is executable, create a todo list and proceed.

### 2. Execute Tasks

For each task:

1. Mark the task `in_progress`.
2. Follow the plan steps in order.
3. Read every target file before editing it.
4. Run the verification specified by the plan.
5. Mark the task `completed` only after verification passes or a blocker is documented.

### 3. Complete Development

After all tasks complete:

1. Run the strongest relevant final checks available.
2. Inspect the diff for unrelated changes.
3. Report touched files, verification commands, remaining risks, and any checks not run.

## Stop And Ask

Stop instead of guessing when:

- the plan is missing information required to start safely;
- a required dependency, file, credential, or command is unavailable;
- verification fails twice for the same issue;
- the plan conflicts with explicit user instructions;
- the current branch is `main` or `master` and implementation would be risky without explicit consent.

## Constraints

- Do not commit unless the user explicitly asks.
- Do not skip verification unless blocked; explain the blocker.
- Do not broaden scope beyond the approved plan.
- Do not continue through unclear or unsafe plan steps.
