# Subagent Handoff Rules

Shared input and output contracts for every primary-to-subagent handoff in this config. Detailed delegation heuristics live in the primary agent prompts; role-specific behavior lives in the subagent prompts.

## 1. Standard Input Contract

Every delegation package must use exactly these six sections, in order:

- `TASK`
- `EXPECTED OUTCOME`
- `REQUIRED TOOLS`
- `MUST DO`
- `MUST NOT DO`
- `CONTEXT`

Subagents must treat `MUST DO` and `MUST NOT DO` as strict requirements. If a section is missing or conflicts with another, state the assumption in `FOLLOW_UP` and proceed with the safest interpretation.

## 2. Standard Output Contract

Every subagent response must use exactly this shape and key order:

```
STATUS: [done | needs_input | blocked | failed]
SUMMARY: [2-4 concise bullets mapping requested outcomes to what was actually completed]
FILES: [every touched or reviewed file with one-line purpose, or "none"]
VERIFICATION: [exact checks/commands/read-backs, or "not run" with reason]
FOLLOW_UP: [remaining risks, missing evidence, required next step, or "none"]
```

`STATUS: done` is only valid when `FILES` and `VERIFICATION` concretely support the claim. Vague summaries, omitted touched files, or unverified assertions mean the task is not done.

## 3. Planning-File Read Rule

When `MUST DO` contains the sentence `Read .docs/.plans/findings.md before acting.`, read that file before any other substantive work and treat it as required session context.

When the handoff names exact spec or implementation-plan paths, read those files before executing and treat them as authoritative task artifacts, not optional background. Specs live in `.docs/plans/specs/`; implementation plans live directly in `.docs/.plans/`.

## 4. Repo-Discovery Handoff Rule

When the task requires repo understanding, `REQUIRED TOOLS` must name a concrete repo-discovery sequence — not a vague phrase like "use repository exploration tools". Subagents must:

- load the `repo-discovery` skill first
- follow the sequence provided in the handoff
- if no sequence is given, default to `glob` for structure, `grep` for concepts/symbols, then `read` for exact confirmation
- run blast-radius analysis before deleting, renaming, or rewiring an existing symbol

If the task is genuinely non-repo-facing, the handoff must say so explicitly.
