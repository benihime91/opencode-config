---
name: semctx
description: >-
 Semantic codebase discovery, indexed search, and impact analysis CLI. Use when
 exploring unfamiliar repositories, finding code by meaning, locating symbol
 definitions or usages, tracing blast radius before refactors, or when the
 user mentions semctx, code search, codebase indexing, or symbol tracing.
---

# semctx — Semantic Code Context CLI

`semctx` is the default local discovery, indexing, and semantic-search CLI for this install.

Always use `--json` when calling semctx programmatically. For indexed search flows, also pass explicit `--target-dir`, `--cache-dir`, and `--model` so scope, artifacts, and embedding configuration stay deterministic.

## Running

```bash
semctx <command> [options]
```

## Global Options

| Flag | Default | Purpose |
| ------------------- | ---------------------- | ----------------------------------- |
| `--json` | off | Emit JSON instead of human text |
| `--target-dir PATH` | cwd | Content scope for index/search |
| `--cache-dir PATH` | `./.semctx` | Index DB + embedding cache location |

## Default model configuration

```md
## semctx default model configuration

- Default model: `ollama/leoipulsar/harrier-0.6b:latest`
- Default cache-dir: `.semctx`
- Notes for agents: `Use this default model for index init, index refresh, search-code, and search-identifiers unless the user explicitly overrides it.`

### Provider-specific requirements

- `ollama/leoipulsar/harrier-0.6b:latest`
  - Install and run Ollama locally.
  - Pull `leoipulsar/harrier-0.6b:latest` before using indexed semctx commands.
  - Keep the Ollama service running in the same runtime where semctx is called.
```

## Agent Rule

Agents should treat `ollama/leoipulsar/harrier-0.6b:latest` as the standard embedding configuration for `index init`, `index refresh`, `search-code`, and `search-identifiers`. Only pass a different `--model provider/model` when the user explicitly asks for an override.

## Commands

### 1. `tree`

```bash
semctx --json tree [TARGET_PATH] [--depth-limit N] [--include-symbols/--no-symbols] [--max-tokens N]
```

Use to orient in a repo before broad reads.

### 2. `skeleton`

```bash
semctx --json skeleton FILE_PATH
```

Use to inspect a file's API surface without reading full bodies.

### 3. `index`

```bash
semctx --json --target-dir <dir> --cache-dir <cache> index init --model "ollama/leoipulsar/harrier-0.6b:latest"
semctx --json --target-dir <dir> --cache-dir <cache> index status --model "ollama/leoipulsar/harrier-0.6b:latest"
semctx --json --target-dir <dir> --cache-dir <cache> index refresh --model "ollama/leoipulsar/harrier-0.6b:latest"
semctx --json --cache-dir <cache> index clear
```

Use to build, inspect, refresh, or clear the local index.

### 4. `search-code`

```bash
semctx --json --target-dir <dir> --cache-dir <cache> search-code QUERY --top-k N --model "ollama/leoipulsar/harrier-0.6b:latest"
```

Use for semantic code and document search.

### 5. `search-identifiers`

```bash
semctx --json --target-dir <dir> --cache-dir <cache> search-identifiers QUERY --top-k N --model "ollama/leoipulsar/harrier-0.6b:latest"
```

Use when looking for declarations rather than usage patterns.

### 6. `blast-radius`

```bash
semctx --json blast-radius SYMBOL_NAME FILE_CONTEXT [--depth-limit N]
```

Use before renaming or refactoring an existing symbol.

## Workflows

### Explore an unfamiliar repo

```bash
semctx --json tree . --depth-limit 3
semctx --json skeleton skills/repo-discovery/SKILL.md
```

### Find and understand code

```bash
semctx --json --target-dir "skills" --cache-dir ".semctx" search-code "repo discovery workflow" --top-k 5 --model "ollama/leoipulsar/harrier-0.6b:latest"
```

### Find a specific symbol

```bash
semctx --json --target-dir "plugins" --cache-dir ".semctx" search-identifiers "read permissions config" --top-k 3 --model "ollama/leoipulsar/harrier-0.6b:latest"
```

### Assess refactoring impact

```bash
semctx --json blast-radius "readPermissionsConfig" "plugins/agent-permissions/filesystem.ts"
```

## Error handling

- `index_not_found` — run `semctx index init`
- `full_rebuild_required` — run `semctx index refresh --full`
- Non-zero exit code accompanies semctx errors

## Key behaviors

- Search commands can auto-init or auto-refresh the index when safe.
- `.gitignore` and `.ignore` influence what gets indexed.
- `--target-dir` defines content scope; `--cache-dir` only controls artifact location.
- Embedding/search reliability depends on the configured Ollama model being available and compatible with Ollama's embedding path.
