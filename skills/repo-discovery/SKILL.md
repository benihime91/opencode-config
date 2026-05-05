---
name: repo-discovery
description: Local repository discovery using native file search, content search, and direct reads.
---

# Repo Discovery

Use this skill when the job is understanding a local repository: structure, symbol locations, call paths, blast radius, exact file targets, and the safest place to make a change.

This skill owns the repo-understanding workflow in this config.

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

Start with file-pattern discovery and exact content search. Use direct reads only after narrowing likely targets.

1. Start broad with `glob` patterns that map the relevant directories and file types.
2. Narrow with `grep` searches using 2-3 different terms for the concept, symbol, or workflow.
3. Trace identifiers by searching definitions, exports, imports, and call sites when the question becomes symbol-specific.
4. Confirm exact paths and lines with direct file reads.
5. Before deleting, renaming, or rewiring existing behavior, search for all references and inspect the most important callers/importers.
6. Run local static analysis or the project's native checks after edits when applicable.

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

Search hits are discovery signals, not final evidence. Treat every result as a lead, not proof.

After search identifies likely files or symbols:

1. inspect the structure or skeleton of the best candidates
2. read the exact files that appear relevant
3. confirm the real lines, exports, and usages before making claims
4. cross-check against at least one additional source (`grep`, `glob`, or another read) when the finding will drive an edit

Do not report a symbol path, owner file, or call chain until you have confirmed it directly. If a single search result looks conclusive but has no corroboration, assume there is more and search again.

## Blast-Radius Rule

Before deleting, renaming, or rewiring an existing symbol:

1. search for definitions, imports, exports, and references
2. inspect the most important callers/importers
3. verify whether the usage is public, indirect, or dynamically referenced

If blast radius is unclear, treat the change as high risk and gather more evidence before editing.

## Tool Surface

Use native repository tools first:

- `glob` for file patterns and directory coverage
- `grep` for exact strings, regexes, definitions, imports, exports, and call sites
- `read` for direct confirmation once likely files are known

Typical progression:

1. `glob` broad file patterns for the relevant area
2. `grep` with 2-3 query phrasings
3. `grep` for definitions/imports/exports/call sites when the question becomes symbol-specific
4. direct `read` confirmation of likely files
5. project-native static analysis after edits when available

## Practical Defaults

- Prefer `glob` before raw reads when the relevant files are not known.
- Prefer multiple `grep` searches with different wording over one overly narrow query.
- Use direct file reads only after search has identified likely targets.
- Use `grep` for exact-string confirmation and regex matching.
- Keep the search surface bounded to the relevant directory or feature area once you know it.

## Anti-Patterns

Avoid these mistakes:

1. searching only once, then assuming the first result is complete
2. reading entire large files before narrowing likely targets
3. reporting guessed symbol relationships without direct confirmation
4. editing or deleting a symbol before checking references
5. turning implementation work into open-ended repo archaeology

## Output Expectations

When you use this skill, your findings should usually answer:

- what files matter
- what symbols matter
- how they connect
- where the safest edit point is
- what else may break if the change is made

If you cannot answer those clearly yet, you probably need one more search pass or a direct read confirmation pass.
