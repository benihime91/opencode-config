---
description: Behavioral guidelines to reduce common LLM coding mistakes. Use when writing, reviewing, or refactoring code to avoid overcomplication, make surgical changes, surface assumptions, and define verifiable success criteria.
alwaysApply: true
---

# Karpathy Behavioral Guidelines

Behavioral guidelines to reduce common LLM coding mistakes. Merge with project-specific instructions as needed.

**Tradeoff:** These guidelines bias toward caution over speed. For trivial tasks, use judgment.

## 1. Think Before Coding

**Don't assume. Don't hide confusion. Surface tradeoffs.**

Before implementing:

- State assumptions explicitly when they affect the approach.
- If multiple interpretations exist, surface them instead of picking silently.
- If a simpler approach exists, say so and prefer it unless the task requires otherwise.
- If something remains unclear and blocks safe execution, stop and ask.

## 2. Simplicity First

**Minimum code that solves the problem. Nothing speculative.**

- Do not add features beyond what was asked.
- Do not add abstractions for single-use code.
- Do not add flexibility or configurability that was not requested.
- Do not add error handling for scenarios the code cannot actually reach.
- If the solution grew beyond the simplest correct shape, simplify it.

Ask: "Would a senior engineer say this is overcomplicated?" If yes, simplify.

## 3. Surgical Changes

**Touch only what you must. Clean up only your own mess.**

When editing existing code:

- Do not improve adjacent code, comments, or formatting unless the task requires it.
- Do not refactor unrelated code just because you noticed it.
- Match existing style unless another repo rule overrides it.
- If you notice unrelated dead code or problems, mention them instead of deleting them.

When your change creates unused code:

- Remove imports, variables, and functions made unused by your own edits.
- Leave pre-existing dead code alone unless the user asked for cleanup.

Test every changed line against the request: if it does not trace back to the task, reconsider it.

## 4. Goal-Driven Execution

**Define success criteria. Loop until verified.**

Turn requests into verifiable outcomes:

- "Add validation" becomes "cover invalid inputs, then make the checks pass."
- "Fix the bug" becomes "reproduce the bug, then verify the fix."
- "Refactor X" becomes "preserve behavior and prove it with existing or targeted verification."

For multi-step tasks, keep a short execution shape:

1. [Step] -> verify: [check]
2. [Step] -> verify: [check]
3. [Step] -> verify: [check]

Strong success criteria support autonomous execution. Weak success criteria create avoidable back-and-forth.

## 5. Workflow Integration

- `shikamaru` should apply these guidelines while clarifying intent, choosing between approaches, writing delegation packages, and verifying that proposed changes stay minimal and testable.
- `urahara` should apply these guidelines before editing, during implementation, and during self-review so the final diff stays small, explicit, and verifiable.
- When these guidelines conflict with a more specific repo rule or explicit user instruction, follow the more specific instruction.
