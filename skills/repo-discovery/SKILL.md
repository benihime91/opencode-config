---
name: repo-discovery
description: Semantic and structural repository discovery using native Context+ MCP tools.
---

# Repo Discovery

Use this skill when the job is understanding a local repository: structure, symbol locations, call paths, blast radius, exact file targets, and the safest place to make a change.

This skill is the single source of truth for repo-understanding workflow in this config. Do not send agents to a separate repo-discovery playbook. Load this skill and follow it.

## Canonical Config

Context+ is configured natively in `~/.config/opencode/opencode.json` under the `mcp` key.

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

**Always start with Context+ tools.** Native Context+ MCP tools are the primary discovery mechanism. `grep`, `glob`, and raw file reads are fallback-only tools — use them after Context+ results are insufficient, not as a default starting point.

1. Start broad with Context+ structure (`get_context_tree`, `get_file_skeleton`).
2. Narrow with Context+ semantic search (`semantic_code_search`, `semantic_identifier_search`).
3. Trace identifiers with Context+ when the question becomes symbol-specific.
4. Confirm exact paths and lines with direct file reads — only after Context+ has identified the targets.
5. Inspect blast radius with Context+ (`get_blast_radius`) before editing or deleting existing symbols.
6. Run static analysis with Context+ (`run_static_analysis`) after edits when available.

**Fallback rule**: Use `grep` or `glob` only when Context+ semantic search returns no useful results for a specific query, or when you need exact-string matching that semantic search cannot provide (e.g., a precise regex). Do not default to `grep`/`glob` out of habit.

Do not jump straight into broad file-body reads unless the task is truly tiny and the target file is already known.

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

## Required Confirmation Rule

Semantic hits are discovery signals, not final evidence.

After a semantic search identifies likely files or symbols:

1. inspect the structure or skeleton of the best candidates
2. read the exact files that appear relevant
3. confirm the real lines, exports, and usages before making claims

Do not report a symbol path, owner file, or call chain until you have confirmed it directly.

## Blast-Radius Rule

Before deleting, renaming, or rewiring an existing symbol:

1. trace its blast radius
2. inspect the most important callers/importers
3. verify whether the usage is public, indirect, or dynamically referenced

If blast radius is unclear, treat the change as high risk and gather more evidence before editing.

## Command Patterns

Use the native Context+ MCP tools directly:

- `contextplus_get_context_tree`
- `contextplus_get_file_skeleton`
- `contextplus_semantic_code_search`
- `contextplus_semantic_identifier_search`
- `contextplus_get_blast_radius`
- `contextplus_run_static_analysis`

Typical progression:

1. `contextplus_get_context_tree` or `contextplus_get_file_skeleton`
2. `contextplus_semantic_code_search` with 2-3 query phrasings
3. `contextplus_semantic_identifier_search` when the question becomes symbol-specific
4. `contextplus_get_blast_radius` before rewiring an existing symbol
5. `contextplus_run_static_analysis` after edits when available

## Practical Defaults

- **Context+ first, always.** Every repo-understanding task should begin with Context+ structural and semantic tools. Do not start with `grep`, `glob`, or raw file reads.
- Prefer one structural call (`get_context_tree`, `get_file_skeleton`) before any raw reads.
- Prefer multiple Context+ semantic searches with different wording over one overly narrow query.
- Use direct file reads only after Context+ has identified likely targets.
- Use `grep` or `glob` only for exact-string confirmation or regex matching after semantic discovery has narrowed the search area.
- Keep the search surface bounded to the relevant directory or feature area once you know it.

## Anti-Patterns

Avoid these mistakes:

1. **defaulting to `grep`/`glob` instead of Context+** — this is the most common error; always reach for Context+ semantic tools first
2. searching only once, then assuming the first result is complete
3. reading entire large files before checking structure or skeleton with Context+
4. reporting guessed symbol relationships without direct confirmation
5. editing or deleting a symbol before checking blast radius
6. turning implementation work into open-ended repo archaeology
7. routing Context+ through `mcporter` instead of the native MCP path for this repo

## Output Expectations

When you use this skill, your findings should usually answer:

- what files matter
- what symbols matter
- how they connect
- where the safest edit point is
- what else may break if the change is made

If you cannot answer those clearly yet, you probably need one more search pass or a direct read confirmation pass.
