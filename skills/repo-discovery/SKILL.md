---
name: repo-discovery
description: Semantic and structural repository discovery through CLI-backed mcporter workflows.
---

# Repo Discovery

Use this skill when the job is understanding a local repository: structure, symbol locations, call paths, blast radius, exact file targets, and the safest place to make a change.

This skill is the single source of truth for repo-understanding workflow in this config. Do not send agents to a separate repo-discovery playbook. Load this skill and follow it.

## Canonical Config

Use the shared mcporter config at:

```bash
~/.config/opencode/mcporter.json
```

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

1. Start broad with structure.
2. Narrow with semantic search.
3. Trace identifiers when the question becomes symbol-specific.
4. Confirm exact paths and lines with direct file reads.
5. Inspect blast radius before editing or deleting existing symbols.
6. Run static analysis after edits when available.

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

Inspect available Context+ tools when needed:

```bash
bunx mcporter list contextplus --config ~/.config/opencode/mcporter.json
```

Start with structure:

```bash
bunx mcporter call 'contextplus.get_context_tree(target_path: ".", depth_limit: 2, include_symbols: true, max_tokens: 20000)' --config ~/.config/opencode/mcporter.json

bunx mcporter call 'contextplus.get_file_skeleton(file_path: "agents/orchestrator.md")' --config ~/.config/opencode/mcporter.json
```

Search by concept:

```bash
bunx mcporter call 'contextplus.semantic_code_search(query: "repo discovery workflow", top_k: 8, semantic_weight: 0.72, keyword_weight: 0.28, min_semantic_score: 0.2, min_keyword_score: 0.1, min_combined_score: 0.2, require_keyword_match: false, require_semantic_match: true)' --config ~/.config/opencode/mcporter.json

bunx mcporter call 'contextplus.semantic_code_search(query: "annotation lifecycle", top_k: 8, semantic_weight: 0.72, keyword_weight: 0.28, min_semantic_score: 0.2, min_keyword_score: 0.1, min_combined_score: 0.2, require_keyword_match: false, require_semantic_match: true)' --config ~/.config/opencode/mcporter.json
```

Search by symbol intent:

```bash
bunx mcporter call 'contextplus.semantic_identifier_search(query: "session management", top_k: 5, top_calls_per_identifier: 10, include_kinds: ["function", "method", "class"], semantic_weight: 0.78, keyword_weight: 0.22)' --config ~/.config/opencode/mcporter.json
```

Check impact before edits:

```bash
bunx mcporter call 'contextplus.get_blast_radius(symbol_name: "SessionManager", file_context: "src/session.ts")' --config ~/.config/opencode/mcporter.json

bunx mcporter call 'contextplus.run_static_analysis(target_path: "plugins")' --config ~/.config/opencode/mcporter.json
```

## Practical Defaults

- Prefer one structural call before many raw reads.
- Prefer multiple semantic searches with different wording over one overly narrow query.
- Use direct file reads only after likely targets are identified.
- Use `grep` or `glob` only for exact confirmation after semantic discovery, not as the first resort for non-trivial repo questions.
- Keep the search surface bounded to the relevant directory or feature area once you know it.

## Anti-Patterns

Avoid these mistakes:

1. searching only once, then assuming the first result is complete
2. reading entire large files before checking structure or skeleton
3. reporting guessed symbol relationships without direct confirmation
4. editing or deleting a symbol before checking blast radius
5. turning implementation work into open-ended repo archaeology
6. describing this as an MCP workflow instead of a skill-driven CLI workflow

## Output Expectations

When you use this skill, your findings should usually answer:

- what files matter
- what symbols matter
- how they connect
- where the safest edit point is
- what else may break if the change is made

If you cannot answer those clearly yet, you probably need one more search pass or a direct read confirmation pass.
