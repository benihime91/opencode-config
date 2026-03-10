---
description: Save verification state and progress checkpoint
agent: doc-updater
subtask: true
---

# Checkpoint Command

Save the current verification state and create a progress checkpoint: $ARGUMENTS

## Your Task

Create a concise snapshot of the current work, including:

1. **Verification status** - Known test, lint, typecheck, and build results
2. **Progress state** - Current phase, completed work, blockers, and active task status
3. **Code changes** - Best-effort summary of what changed
4. **Planning sync** - Update project memory files so the next session can resume cleanly
5. **Next steps** - Recommend the most useful follow-up actions

## Required Workflow (OpenCode + planning-with-files compatible)

1. **Recover current state first**
   - Run `git diff --stat` first when available.
   - If git is unavailable or the workspace is not a repo, continue gracefully with filesystem-based analysis.
   - Read `docs/task_plan.md`, `docs/findings.md`, and `docs/progress.md` if they exist before making conclusions.

2. **Bootstrap missing planning files if needed**
   - If `docs/task_plan.md`, `docs/findings.md`, or `docs/progress.md` is missing, create the missing file in the project `docs/` directory using the installed planning-with-files templates as the format reference.
   - Never recreate or overwrite an existing planning file.
   - For existing files, use targeted edits only: update `docs/task_plan.md` in place, prepend newest-first checkpoint notes in `docs/findings.md`, and keep new `docs/progress.md` checkpoint subsections near the top of the current session block.

3. **Assess the checkpoint state**
   - Identify the current phase and what is complete, in progress, or blocked.
   - Summarize any known verification results from the current session, planning files, or recent commands.
   - If verification has not been run yet, explicitly say so instead of guessing.

4. **Sync project memory with minimal edits**
   - Update `docs/task_plan.md` in place with the latest phase, decisions, and blockers.
   - Prepend a checkpoint-focused update to `docs/findings.md` when there is a durable discovery worth preserving.
   - Add a `### Checkpoint: [Timestamp]` subsection near the top of the current session block in `docs/progress.md`, keeping the newest checkpoint first while preserving the existing session/phase structure.
   - Preserve existing history; never rewrite the full files from scratch when they already exist.

5. **Return a resume-friendly checkpoint summary**
   - Keep it operational and specific.
   - Make the result useful for continuing work immediately.

## Checkpoint Format

### Checkpoint: [Timestamp]

**Current Phase**
- [Phase name or status]

**Verification**
- Tests: [passing/failing/not run/unknown]
- Lint/Typecheck: [passing/failing/not run/unknown]
- Build: [passing/failing/not run/unknown]
- Coverage: [value or `not captured`]

**Changes**
- Git summary: [best-effort `git diff --stat` summary or `git unavailable`]
- Key files touched: [short list]

**Completed Tasks**
- [x] Item
- [ ] Item

**Blocking Issues**
- [Issue or `None currently recorded`]

**Next Steps**
1. [Recommended next action]
2. [Recommended next action]

## Behavior Rules

- Treat planning files as the source of truth for continuity.
- Prefer best-effort reporting over assumptions.
- Do not turn this into a full re-planning exercise unless the current state is missing or contradictory.
- Do not turn this into a `/learn` retrospective; keep the update focused on actionable checkpoint state.
- If the user passes checkpoint-specific context in `$ARGUMENTS`, incorporate it into the summary and file updates.

## Usage with Verification Loop

```text
/plan -> implement -> /checkpoint -> verify -> /checkpoint -> implement
```

Use checkpoints to:

- Save state before risky changes
- Track progress through phases
- Capture verification outcomes in `docs/progress.md`
- Leave a clear resume point for the next session

---

**TIP**: Run `/checkpoint` after each meaningful phase, before refactors, and after verification passes so the planning files stay aligned with the current state.
