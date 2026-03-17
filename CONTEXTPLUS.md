# Context+ MCP - Agent Instructions

## Purpose

You are equipped with the Context+ MCP server. It gives you structural awareness of the entire codebase without reading every file. Follow this workflow strictly to conserve context and maximize accuracy.

## Environment Variables

| Variable                                | Default            | Description                                                   |
| --------------------------------------- | ------------------ | ------------------------------------------------------------- |
| `OLLAMA_EMBED_MODEL`                    | `nomic-embed-text` | Embedding model name                                          |
| `OLLAMA_API_KEY`                        | (empty)            | Cloud auth (auto-detected by SDK)                             |
| `OLLAMA_CHAT_MODEL`                     | `llama3.2`         | Chat model for cluster labeling                               |
| `CONTEXTPLUS_EMBED_BATCH_SIZE`          | `8`                | Embedding batch per GPU call (hard-capped to 5-10)            |
| `CONTEXTPLUS_EMBED_TRACKER`             | `true`             | Enable realtime embedding updates for changed files/functions |
| `CONTEXTPLUS_EMBED_TRACKER_MAX_FILES`   | `8`                | Max changed files per tracker tick (hard-capped to 5-10)      |
| `CONTEXTPLUS_EMBED_TRACKER_DEBOUNCE_MS` | `700`              | Debounce before applying tracker refresh                      |

Runtime cache: `.mcp_data/` is created at MCP startup and stores reusable embedding vectors for files, identifiers, and call sites. A realtime tracker watches file updates and refreshes changed function/file embeddings incrementally.

## Fast Execute Mode (Mandatory)

Default to execution-first behavior. Use minimal tokens, minimal narration, and maximum tool leverage.

1. Skip long planning prose. Start with lightweight scoping: `get_context_tree` and `get_file_skeleton`.
2. Run independent discovery operations in parallel whenever possible (for example, multiple searches/reads).
3. Prefer structural tools over full-file reads to conserve context.
4. Before modifying or deleting symbols, run `get_blast_radius`.
5. Write changes through `propose_commit` only.
6. Run `run_static_analysis` once after edits, or once per changed module for larger refactors.

### Execution Rules

1. Think less, execute sooner: make the smallest safe change that can be validated quickly.
2. Do not serialize 10 independent commands; batch parallelizable reads/searches.
3. If a command fails, avoid blind retry loops. Diagnose once, pivot strategy, continue.
4. Cap retry attempts for the same failing operation to 1-2 unless new evidence appears.
5. Keep outputs concise: short status updates, no verbose reasoning dumps.

### Token-Efficiency Rules

1. Treat 100 effective tokens as better than 1000 vague tokens.
2. Use high-signal tool calls first (`get_file_skeleton`, `get_context_tree`, `get_blast_radius`).
3. Read full file bodies only when signatures/structure are insufficient.
4. Avoid repeated scans of unchanged areas.
5. Prefer direct edits + deterministic validation over extended speculative analysis.

## Tool Reference

| Tool                         | When to Use                                                                        |
| ---------------------------- | ---------------------------------------------------------------------------------- |
| `get_context_tree`           | Start of every task. Map files + symbols with line ranges.                         |
| `semantic_navigate`          | Browse codebase by meaning, not directory structure.                               |
| `get_file_skeleton`          | MUST run before full reads. Get signatures + line ranges first.                    |
| `semantic_code_search`       | Find relevant files by concept with symbol definition lines.                       |
| `semantic_identifier_search` | Find closest functions/classes/variables and ranked call chains with line numbers. |
| `get_blast_radius`           | Before deleting or modifying any symbol.                                           |
| `run_static_analysis`        | After writing code. Catch dead code deterministically.                             |
| `propose_commit`             | The ONLY way to save files. Validates before writing.                              |
| `list_restore_points`        | See undo history.                                                                  |
| `undo_change`                | Revert a bad AI change without touching git.                                       |
| `get_feature_hub`            | Browse feature graph hubs. Find orphaned files.                                    |
| `upsert_memory_node`         | Create/update memory nodes (concept, file, symbol, note) with auto-embedding.      |
| `create_relation`            | Create typed edges between memory nodes (depends_on, implements, etc).             |
| `search_memory_graph`        | Semantic search + graph traversal across 1st/2nd-degree neighbors.                 |
| `prune_stale_links`          | Remove decayed edges (e^(-λt)) and orphan nodes periodically.                      |
| `add_interlinked_context`    | Bulk-add nodes with auto-similarity linking (cosine ≥ 0.72).                       |
| `retrieve_with_traversal`    | Start from a node, walk outward, return scored neighbors by decay and depth.       |

## Anti-Patterns to Avoid

1. Reading entire files without checking the skeleton first.
2. Deleting functions without checking blast radius.
3. Creating small helper functions that are only used once.
4. Writing inline comments anywhere in the code.
5. Wrapping simple logic in 10 layers of abstraction or nesting.
6. Leaving unused imports or variables after a refactor.
7. Creating more than 10 files in a single directory.
8. Writing files longer than 1000 lines.
9. Running independent commands sequentially when they can be parallelized.
10. Repeating failed terminal commands without changing inputs or approach.

## Priority Reminder

Execute ASAP with the least tokens possible.
Use structural/context tools strategically, then patch and validate.
Avoid over-planning unless the task is ambiguous or high-risk.
