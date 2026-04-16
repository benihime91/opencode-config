---
name: repo-discovery
description: Semantic and structural repository discovery using semctx as the default local search and indexing CLI.
---

# Repo Discovery

Use this skill when the job is understanding a local repository: structure, symbol locations, call paths, blast radius, exact file targets, and the safest place to make a change.

This skill owns the repo-understanding workflow in this config.

## Canonical Config

Always load `semctx` skill before using this skill.
`semctx` is the default local discovery and indexed-search backend for this install. Its command reference and default model configuration live in `skills/semctx/SKILL.md`. You can use the `semctx` skill to index the repo and use the `repo-discovery` skill to search the indexed repo.

## When To Use It

Use this skill when you need to:

- map the relevant area of a repo before editing
- find where a feature, policy, or workflow lives
- trace a symbol from definition to call sites
- understand blast radius before refactoring or deletion
- confirm whether a prompt, plugin, or config change affects other files
- match external guidance to the actual local codebase

Skip this skill when the task is already limited to one known file and no broader repo understanding is needed.

## Core Sequence

Always start with semctx structure and search commands. Use `grep`, `glob`, and broad raw reads only as fallbacks.

1. Start broad with `semctx --json tree` or `semctx --json skeleton`.
2. Narrow with `semctx --json search-code` using explicit `--target-dir`, `--cache-dir`, and the configured default model.
3. Trace identifiers with `semctx --json search-identifiers` when the question becomes symbol-specific.
4. Confirm exact paths and lines with direct file reads — only after semctx has identified the targets.
5. Inspect blast radius with `semctx --json blast-radius` before editing or deleting existing symbols.
6. Run local static analysis or the project's native checks after edits when applicable.

Use `grep` or `glob` only when semctx returns nothing useful or when you need exact-string matching.

## Broad-To-Narrow Search Strategy

Start with a high-level concept, not a guessed filename.

Good first queries:

- `authentication flow`
- `error handling policy`
- `repo discovery workflow`
- `annotation lifecycle`

Then run 2-3 follow-up searches with different wording. First-pass semantic hits are often incomplete. Example progression:

1. `authentication flow`
2. `login session creation`
3. `where tokens are validated`

If the first search looks plausible but thin, assume there is more and search again.

## Confirmation Rules

Semantic hits are discovery signals, not final evidence. Treat every semctx result as a lead, not proof.

After a semantic search identifies likely files or symbols:

1. inspect the structure or skeleton of the best candidates
2. read the exact files that appear relevant
3. confirm the real lines, exports, and usages before making claims
4. cross-check against at least one additional source (`blast-radius`, `grep`, or a second semantic query) when the finding will drive an edit

Do not report a symbol path, owner file, or call chain until you have confirmed it directly. If a single search result looks conclusive but has no corroboration, assume there is more and search again.

## Blast-Radius Rule

Before deleting, renaming, or rewiring an existing symbol:

1. trace its blast radius
2. inspect the most important callers/importers
3. verify whether the usage is public, indirect, or dynamically referenced

If blast radius is unclear, treat the change as high risk and gather more evidence before editing.

## Tool Surface

Use the semctx CLI directly, always with `--json` for agent-driven calls:

- `semctx --json tree [path] --depth-limit N`
- `semctx --json skeleton <file>`
- `semctx --json --target-dir <dir> --cache-dir <cache> search-code <query> --model <provider/model>`
- `semctx --json --target-dir <dir> --cache-dir <cache> search-identifiers <query> --model <provider/model>`
- `semctx --json blast-radius <symbol> <file>`

Typical progression:

1. `semctx --json tree` or `semctx --json skeleton`
2. `semctx --json search-code` with 2-3 query phrasings
3. `semctx --json search-identifiers` when the question becomes symbol-specific
4. `semctx --json blast-radius` before rewiring an existing symbol
5. project-native static analysis after edits when available

## Practical Defaults

- **semctx first, always.** Every repo-understanding task should begin with semctx structural and semantic commands. Do not start with `grep`, `glob`, or raw file reads.
- Prefer one structural call (`tree`, `skeleton`) before any raw reads.
- Prefer multiple semctx semantic searches with different wording over one overly narrow query.
- Use direct file reads only after semctx has identified likely targets.
- Use `grep` or `glob` only for exact-string confirmation or regex matching after semantic discovery has narrowed the search area.
- Keep the search surface bounded to the relevant directory or feature area once you know it.
- For indexed commands, do not rely on implicit scope. Pass explicit `--target-dir` and `--cache-dir`.

## Anti-Patterns

Avoid these mistakes:

1. **defaulting to `grep`/`glob` instead of semctx** — this is the most common error; always reach for semctx semantic search first
2. searching only once, then assuming the first result is complete
3. reading entire large files before checking structure or skeleton with semctx
4. reporting guessed symbol relationships without direct confirmation
5. editing or deleting a symbol before checking blast radius
6. turning implementation work into open-ended repo archaeology
7. omitting `--json`, `--target-dir`, or `--cache-dir` on indexed semctx calls

## Output Expectations

When you use this skill, your findings should usually answer:

- what files matter
- what symbols matter
- how they connect
- where the safest edit point is
- what else may break if the change is made

If you cannot answer those clearly yet, you probably need one more search pass or a direct read confirmation pass.
