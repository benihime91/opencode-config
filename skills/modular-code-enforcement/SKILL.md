---
name: modular-code-enforcement
description: Zero-tolerance modular code architecture policy for TypeScript and Python. Use when writing, reviewing, or refactoring any .ts, .tsx, or .py file. Enforces single-responsibility per file, bans catch-all utils/helpers blobs, keeps entry-points clean, and flags files over 200 LOC as code smells requiring immediate extraction.
---

# Modular Code Architecture — Zero Tolerance Policy

This rule is NON-NEGOTIABLE. Violations BLOCK all further work until resolved.

This policy applies equally to **TypeScript and Python**.

- TypeScript scope: `.ts`, `.tsx`, `index.ts`, `index.tsx`
- Python scope: `.py`, `__init__.py`

For Python, `__init__.py` files should be treated as package markers and kept **empty** unless the user explicitly approves a documented exception.

## Rule 1: Entry-point files are ENTRY POINTS, NOT dumping grounds

`index.ts` and `index.tsx` files MUST ONLY contain:

- Re-exports (`export { ... } from "./module"`)
- Factory function calls that compose modules
- Top-level wiring/registration (hook registration, plugin setup)

`__init__.py` files MUST remain empty. They are package boundary markers, not aggregation layers.

These entry-point files MUST NEVER contain:

- Business logic implementation
- Helper/utility functions
- Type definitions beyond simple re-exports
- Multiple unrelated responsibilities mixed together

**If you find mixed logic in an entry-point file**: Extract each responsibility into its own dedicated file BEFORE making any other changes. This is not optional.

**If you find imports, exports, helper code, constants, or business logic in `__init__.py`**: Move that code into a purpose-named module and leave `__init__.py` empty.

## Rule 2: No Catch-All Files — utils/service/common/helpers blobs are CODE SMELLS

A single `utils.ts`, `helpers.ts`, `service.ts`, `common.ts`, `utils.py`, `helpers.py`, `service.py`, or `common.py` is a **gravity well** — every unrelated function gets tossed in, and it grows into an untestable, unreviewable blob.

**These file names are BANNED as top-level catch-alls.** Instead:

| Anti-Pattern                                           | Refactor To                                                                 |
| ------------------------------------------------------ | --------------------------------------------------------------------------- |
| `utils.ts` / `utils.py` with `formatDate()`, `slugify()`, `retry()` | `date-formatter.ts`, `slugify.ts`, `retry.ts` / `date_formatter.py`, `slugify.py`, `retry.py` |
| `service.ts` / `service.py` handling auth + billing + notifications   | `auth-service.ts`, `billing-service.ts`, `notification-service.ts` / `auth_service.py`, `billing_service.py`, `notification_service.py` |
| `helpers.ts` / `helpers.py` with 15 unrelated exports                 | One file per logical domain                                                 |

**Design for reusability from the start.** Each module should be:

- **Independently importable** — no consumer should need to pull in unrelated code
- **Self-contained** — its dependencies are explicit, not buried in a shared grab-bag
- **Nameable by purpose** — the filename alone tells you what it does

If you catch yourself typing `utils.ts`, `utils.py`, `service.ts`, or `service.py`, STOP and name the file after what it actually does.

## Rule 3: Single Responsibility Principle — ABSOLUTE

Every `.ts`, `.tsx`, and `.py` file MUST have exactly ONE clear, nameable responsibility.

**Self-test**: If you cannot describe the file's purpose in ONE short phrase (e.g., "parses YAML frontmatter", "matches rules against file paths"), the file does too much. Split it.

| Signal                                    | Action                                                 |
| ----------------------------------------- | ------------------------------------------------------ |
| File has 2+ unrelated exported/public functions  | **SPLIT NOW** — each into its own module        |
| File mixes I/O with pure logic            | **SPLIT NOW** — separate side effects from computation |
| File has both types/schemas and implementation | **SPLIT NOW** — `types.ts` + implementation / `types.py` (or `schemas.py`) + implementation |
| You need to scroll to understand the file | **SPLIT NOW** — it's too large                         |

## Rule 4: 200 LOC Hard Limit — CODE SMELL DETECTOR

Any `.ts`, `.tsx`, or `.py` file exceeding **200 lines of code** (excluding prompt strings, template literals containing prompts, docstring-heavy prompt content, and `.md` content) is an **immediate code smell**.

**When you detect a file > 200 LOC**:

1. **STOP** current work
2. **Identify** the multiple responsibilities hiding in the file
3. **Extract** each responsibility into a focused module
4. **Verify** each resulting file is < 200 LOC and has a single purpose
5. **Resume** original work

Prompt-heavy files (agent definitions, skill definitions) where the bulk of content is template literal prompt text or long prompt/docstring content are EXEMPT from the LOC count — but their non-prompt logic must still be < 200 LOC.

### How to Count LOC

**Count these** (= actual logic):

- Import statements
- Variable/constant declarations
- Function/class/interface/type definitions
- Control flow (`if`, `for`, `while`, `switch`, `try/catch`)
- Expressions, assignments, return statements
- Closing braces `}` that belong to logic blocks

**Exclude these** (= not logic):

- Blank lines
- Comment-only lines (`//`, `/* */`, `/** */`)
- Lines inside template literals that are prompt/instruction text (e.g., the string body of `` const prompt = `...` ``)
- Lines inside multi-line strings used as documentation/prompt content
- Lines inside Python docstrings used purely as prompt/instruction/documentation content

**Quick method**: Read the file → subtract blank lines, comment-only lines, and prompt string content → remaining count = LOC.

**Example**:

```typescript
// 1  import { foo } from "./foo";          ← COUNT
// 2                                         ← SKIP (blank)
// 3  // Helper for bar                      ← SKIP (comment)
// 4  export function bar(x: number) {       ← COUNT
// 5    const prompt = `                     ← COUNT (declaration)
// 6      You are an assistant.              ← SKIP (prompt text)
// 7      Follow these rules:                ← SKIP (prompt text)
// 8    `;                                   ← COUNT (closing)
// 9    return process(prompt, x);           ← COUNT
// 10 }                                      ← COUNT
```

→ LOC = **5** (lines 1, 4, 5, 9, 10). Not 10.

When in doubt, **round up** — err on the side of splitting.

## How to Apply

When reading, writing, or editing ANY `.ts`, `.tsx`, or `.py` file:

1. **Check the file you're touching** — does it violate any rule above?
2. **If YES** — refactor FIRST, then proceed with your task
3. **If creating a new file** — ensure it has exactly one responsibility and stays under 200 LOC
4. **If adding code to an existing file** — verify the addition doesn't push the file past 200 LOC or add a second responsibility. If it does, extract into a new module.
