> **HISTORICAL:** Dated plan; agent filenames have since changed. See [`HISTORICAL.md`](./HISTORICAL.md).

# Fixer and Orchestrator Prompt Tightening Implementation Plan

**Goal:** Update `agents/fixer.md` and `agents/orchestrator.md` so `fixer` behaves as a tougher deep local executor and `orchestrator` behaves as a stricter delegator plus verifier without changing repo role boundaries.

**Architecture:** Keep the current two-agent split but sharpen each prompt at its existing control points instead of rewriting from scratch. `fixer` gets stronger action, continuation, implied-work, and recovery rules; `orchestrator` gets stronger handoff specificity, distrust-by-default verification, and explicit read-back of touched files/evidence before signoff.

**Tech Stack:** Markdown agent prompts, local `.plans/` workflow, Context+ MCP guidance, OpenCode subagent handoff contract

---

## File Map

- Modify: `agents/fixer.md:3-103`
  - Tighten identity/description, startup protocol, execution rules, hard constraints, verification standard, self-check, and output expectations.
- Modify: `agents/orchestrator.md:9-238`
  - Tighten identity, phase flow, delegation package rules, failure recovery, verification requirements, completion gate, and `@fixer` role description.
- Read-only context: `.plans/task_plan.md`, `.plans/findings.md`, `.plans/progress.md`, `CONTEXTPLUS.md`

## Non-Goals

- Do not expand `fixer` into research, architecture, or delegation work.
- Do not weaken the rule that `orchestrator` avoids direct implementation edits.
- Do not reintroduce `lsp_diagnostics` or any non-existent tool.
- Do not change `.plans` ownership rules or the specialist split between `fixer`, `librarian`, `oracle`, and `explorer`.
- Do not rewrite unrelated agent sections for style only.

## Task 1: Tighten `agents/fixer.md` into a deep local executor

**Files:**

- Modify: `agents/fixer.md:3-103`

- [ ] **Step 1: Update frontmatter description and opening identity to match the approved role**

Edit these areas:

- `agents/fixer.md:3`
- `agents/fixer.md:10-18`

Patch intent:

- Replace “Fast implementation specialist” framing with wording closer to “Deep local execution specialist” or equivalent.
- Keep `fixer` as implementation-only, but make the opening bullets explicitly say:
  - execute end-to-end within scope
  - prefer action over permission-seeking
  - finish obvious implied work required for a complete result
  - keep iterating until verification is complete or a real blocker is reached

Rules to add:

- “Do the work, do not ask for permission when the next step is obvious and safe.”
- “If the request implies adjacent local work required for correctness, include it in the same pass.”

Rules to remove or soften:

- Any remaining “fast” wording that could imply shallow execution over thorough completion.

- [ ] **Step 2: Rewrite the startup and execution rules around action bias plus local completion**

Edit these areas:

- `agents/fixer.md:20-47`

Patch intent:

- Keep `.plans/task_plan.md` first.
- Keep optional reads of `.plans/findings.md` and `.plans/progress.md` when needed or when explicitly required by handoff.
- Strengthen the “start implementation immediately” rule into a “read required context, then begin work without preamble” rule.
- Expand execution rules so `fixer` must resolve obvious follow-on local work instead of stopping at the first successful patch.

Rules to add:

- “Do not stop at the first narrow diff if surrounding local breakage, failing checks, or incomplete wiring is still within scope.”
- “When blocked, try a materially different local approach before escalating.”
- “Challenge bad assumptions in the task only when the evidence is local and concrete; otherwise stay inside scope.”

Rules to preserve:

- explicit user instructions override inferred patterns
- local-only repo discovery
- no open-ended research

- [ ] **Step 3: Add an explicit failure-recovery ladder and tougher hard constraints**

Edit these areas:

- `agents/fixer.md:49-75`

Patch intent:

- Keep strict todo discipline.
- Add an explicit recovery loop so failed validation or blocked implementation produces another concrete local attempt before the agent asks for help.
- Make “implementation only / no delegation / no external research” even more explicit.

Rules to add:

- “If the first fix fails, diagnose once, change approach, and try again.”
- “If the second local approach fails, reduce the problem, isolate the blocker, and only then return `blocked` or `needs_input`.”
- “Do not hand the user a half-finished result when the next repair step is local and obvious.”

Rules to preserve:

- no subagent spawning
- no external research tools
- local discovery before asking user

- [ ] **Step 4: Strengthen verification and end-of-turn checks so completion requires evidence**

Edit these areas:

- `agents/fixer.md:66-103`

Patch intent:

- Keep the current validation categories, but require the agent to run the strongest relevant local checks available.
- Make the self-check explicitly verify that implied work was completed, not just the initial requested diff.
- Tighten the output contract so verification lines report concrete commands/checks, not only pass/fail labels.

Rules to add:

- “Run targeted verification that matches the touched behavior, not just a generic command.”
- “If verification cannot run, say exactly what was unavailable and what was checked instead.”
- “Report enough evidence that the orchestrator can verify your claims quickly.”

Output contract adjustments:

- Keep the same normalized five-section structure.
- Change `SUMMARY` guidance to concise bullets/sentences that include task completion plus any recovery performed.
- Change `FILES` guidance to include every touched file, not just primary files.
- Change `VERIFICATION` guidance to include command names or read-based checks performed.

## Task 2: Tighten `agents/orchestrator.md` into a strict delegator plus verifier

**Files:**

- Modify: `agents/orchestrator.md:9-238`

- [ ] **Step 1: Strengthen the identity and operating-flow framing around delegation plus distrustful verification**

Edit these areas:

- `agents/orchestrator.md:9-17`
- `agents/orchestrator.md:33-49`

Patch intent:

- Keep the existing “delegate to specialists” bias.
- Add explicit wording that delegated completion never substitutes for orchestrator verification.
- Make the intent gate stricter about choosing delegation first and asking clarifying questions only when truly blocking.

Rules to add:

- “Do not trust subagent completion claims without direct verification.”
- “Your job is not only to route work; it is to verify that the delivered work actually matches the request.”

- [ ] **Step 2: Tighten delegation-package requirements so subagents receive less room for interpretation**

Edit these areas:

- `agents/orchestrator.md:62-119`

Patch intent:

- Keep the six-section package.
- Add explicit requirements that `TASK`, `EXPECTED OUTCOME`, `MUST DO`, and `CONTEXT` contain target files, exact sections, concrete acceptance criteria, repo constraints, and verification expectations when known.
- Preserve the existing Context+ workflow requirement.

Rules to add:

- “Name exact files and sections whenever they are already known.”
- “If verifying prompt/docs work, require exact read-back targets in `REQUIRED TOOLS` or `MUST DO`.”
- “State non-goals explicitly so subagents do not widen scope.”
- “When a prior attempt failed, the next handoff must say what changed.”

Rules to remove or tighten:

- Any wording that lets the orchestrator send generic handoffs once concrete context is already available.

- [ ] **Step 3: Expand failure recovery so the orchestrator corrects the handoff, not just retries it**

Edit these areas:

- `agents/orchestrator.md:123-129`

Patch intent:

- Keep the current retry ladder shape.
- Add a requirement that each retry include a sharper acceptance bar, missing context, or corrected assumptions.
- Make oracle escalation a last strategic step, not a substitute for basic verifier work.

Rules to add:

- “After a failed subtask, inspect the failure evidence before re-delegating.”
- “Do not resend the same vague package and call it a retry.”

- [ ] **Step 4: Replace soft verification language with mandatory touched-file and evidence review**

Edit these areas:

- `agents/orchestrator.md:132-159`

Patch intent:

- Keep the normalized response contract.
- Add a post-subagent verification checklist that requires the orchestrator to read every touched file before signoff, compare reported work against those file contents, and confirm that verification evidence matches the claimed changes.
- Upgrade “spot-check unclear claim” into “directly inspect touched files and only accept unresolved uncertainty when explicitly disclosed to the user.”

Rules to add:

- “Read every file listed in `FILES` before reporting completion.”
- “If a subagent omitted a touched file or made a claim unsupported by the diff/read-back, treat the task as incomplete.”
- “Verify that commands/checks named in `VERIFICATION` actually support the claimed result.”
- “Request a corrected subagent response when evidence is missing, mismatched, or too vague.”

Rules to tighten:

- Change completion gate from “any unclear claim has been spot-checked” to a stronger file-and-evidence verification rule.

- [ ] **Step 5: Sharpen the `@fixer` role entry and completion policy to preserve the specialist split**

Edit these areas:

- `agents/orchestrator.md:194-199`
- `agents/orchestrator.md:217-238`

Patch intent:

- Update the `@fixer` description to say it is the deep local executor for clear implementation work.
- Keep skip guidance that pushes research/strategy to `@librarian`, `@oracle`, and `@explorer`.
- Preserve the orchestrator’s prohibition on direct implementation edits and shared `.plans` ownership policy.

Rules to add:

- “Use `@fixer` for concrete local execution, not for research or orchestration.”
- “Do not mark the user request complete until orchestrator verification has passed.”

## Task 3: Verification pass for the prompt-only patch

**Files:**

- Modify: `agents/fixer.md`
- Modify: `agents/orchestrator.md`

- [ ] **Step 1: Re-read both prompts fully after editing**

Run/read:

- `read agents/fixer.md`
- `read agents/orchestrator.md`

Expected result:

- Both files still preserve frontmatter and section structure.
- No accidental changes to unrelated agent policy.

- [ ] **Step 2: Confirm the required role split survived**

Run:

- `rg -n "implementation only|No delegation|external research|@fixer|@librarian|@oracle|@explorer|verify|Read every file listed in FILES|Do not trust subagent completion claims" agents/fixer.md agents/orchestrator.md`

Expected result:

- `fixer` still forbids delegation and external research.
- `orchestrator` explicitly delegates implementation and explicitly verifies touched files/evidence.

- [ ] **Step 3: Confirm banned/local-constraint regressions did not reappear**

Run:

- `rg -n "lsp_diagnostics|websearch|webfetch|context7|delegate to @fixer for research|directly edit implementation files" agents/fixer.md agents/orchestrator.md`

Expected result:

- No `lsp_diagnostics` reference.
- No wording that turns `fixer` into a research/delegation agent.
- No wording that allows orchestrator direct implementation edits.

- [ ] **Step 4: Validate the new verification bar is concrete, not aspirational**

Run/read:

- `rg -n "Read every file listed in FILES|do not trust subagent|verification evidence|supported by the diff|touched file" agents/orchestrator.md`
- `rg -n "implied work|different local approach|half-finished|strongest relevant local checks|Report enough evidence" agents/fixer.md`

Expected result:

- `fixer` contains explicit continuation/recovery language.
- `orchestrator` contains explicit touched-file/evidence verification language.

## Risks and watchpoints

- Over-tightening `fixer` could accidentally make it perform research or architecture selection; preserve the implementation-only constraints while increasing autonomy.
- Over-tightening `orchestrator` could bloat the prompt with duplicate subagent instructions; keep new verifier rules targeted to handoff quality and read-back obligations.
- Verification wording must remain feasible in this repo’s non-git environment; require `read`-based verification, not git-diff-only workflows.
- Rewording output contracts must preserve the existing normalized response shape so current orchestration remains compatible.

## Sequencing summary

1. Edit `agents/fixer.md` first so the execution worker contract is explicit.
2. Edit `agents/orchestrator.md` second so delegation and verification requirements reflect the stronger fixer contract.
3. Re-read both prompts and run the grep verification checks above.
4. Only then report completion, with any residual wording tradeoffs called out explicitly.
