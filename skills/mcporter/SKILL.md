---
name: mcporter
description: Use when working directly with mcporter for ad hoc MCP server inspection, tool calls, auth, config management, daemon control, or CLI/codegen tasks.
---

# mcporter

Use this skill when the job is direct `mcporter` usage rather than a narrower domain workflow.

In this repo, `mcporter` is a peer skill to `repo-discovery`, `docs-research`, `deep-research`, and `annotation-sync`.

- Use `repo-discovery` when the task is understanding a local codebase.
- Use `docs-research` when the task is external docs or API research.
- Use `deep-research` when the task is broad external research with synthesis and citations.
- Use `annotation-sync` when the task is working an annotation queue.
- Use this skill when the task is generic `mcporter` operation, ad hoc tool calling, auth/config management, daemon control, or CLI/codegen work.

## Repo Default Config

Upstream `mcporter` commonly defaults to `./config/mcporter.json`.

In this repo, prefer the shared config explicitly:

```bash
~/.config/opencode/mcporter.json
```

Use `--config ~/.config/opencode/mcporter.json` unless the task explicitly needs a different file.

## Quick Start

```bash
bunx mcporter list --config ~/.config/opencode/mcporter.json
bunx mcporter list <server> --schema --config ~/.config/opencode/mcporter.json
bunx mcporter call <server.tool> key=value --config ~/.config/opencode/mcporter.json
```

Prefer `--output json` for machine-readable results.

## Call Tools

Selector style:

```bash
bunx mcporter call linear.list_issues team=ENG limit:5 --config ~/.config/opencode/mcporter.json --output json
```

Function syntax:

```bash
bunx mcporter call 'linear.create_issue(title: "Bug")' --config ~/.config/opencode/mcporter.json --output json
```

Full URL:

```bash
bunx mcporter call https://api.example.com/mcp.fetch url:https://example.com --config ~/.config/opencode/mcporter.json --output json
```

Stdio server:

```bash
bunx mcporter call --stdio 'bun run ./server.ts' scrape url=https://example.com --output json
```

JSON payload:

```bash
bunx mcporter call <server.tool> --args '{"limit":5}' --config ~/.config/opencode/mcporter.json --output json
```

## Auth And Config

OAuth:

```bash
bunx mcporter auth <server-or-url> --config ~/.config/opencode/mcporter.json
bunx mcporter auth <server-or-url> --reset --config ~/.config/opencode/mcporter.json
```

Config management:

```bash
bunx mcporter config list
bunx mcporter config get <key>
bunx mcporter config add <key> <value>
bunx mcporter config remove <key>
bunx mcporter config import <path>
bunx mcporter config login <provider>
bunx mcporter config logout <provider>
```

## Daemon

```bash
bunx mcporter daemon start
bunx mcporter daemon status
bunx mcporter daemon stop
bunx mcporter daemon restart
```

Use the daemon when the underlying server is stateful or repeated calls are expensive to reinitialize.

## Codegen

Generate CLI:

```bash
bunx mcporter generate-cli --server <name>
bunx mcporter generate-cli --command <url>
```

Inspect generated CLI:

```bash
bunx mcporter inspect-cli <path>
bunx mcporter inspect-cli <path> --json
```

Emit TypeScript:

```bash
bunx mcporter emit-ts <server> --mode client
bunx mcporter emit-ts <server> --mode types
```

## When To Prefer This Skill

Prefer this skill when you need to:

- inspect available servers or tool schemas quickly
- make an ad hoc tool call that does not warrant a domain-specific skill
- troubleshoot auth or config issues
- manage the daemon lifecycle
- generate a standalone CLI or TypeScript client/types from a server

## Rules

- Prefer `--output json` when another tool or agent will consume the result.
- Pass `--config ~/.config/opencode/mcporter.json` unless the task explicitly needs another config.
- Do not start with parallel first-run `bunx mcporter ...` calls. Warm `mcporter` once sequentially first, then parallelize independent calls if needed.
- Use capability skills when the task already has a better domain-shaped interface.
- Do not describe this repo as MCP-first. In this repo, `mcporter` is part of a skill-driven CLI workflow.

## Troubleshooting

- If a call times out (default 60s), pass `--timeout <ms>` to extend it. Servers backed by local models (e.g. `contextplus` with Ollama embeddings) routinely need 90s+. Use `--timeout 90000` for `contextplus` calls.
- If `bunx mcporter ...` fails with `could not determine executable to run for package mcporter` or `Failed to link ... EEXIST`, suspect a transient Bun install/link race before assuming the command or config is wrong.
- This is most likely when multiple first-run `bunx mcporter ...` commands start in parallel and compete on Bun's package resolution or link state.
- Recovery path:
  1. Run one sequential warm-up command such as `bunx mcporter --help` or `bunx mcporter list --config ~/.config/opencode/mcporter.json`.
  2. Retry the intended `mcporter` command after the warm-up succeeds.
  3. Only parallelize later calls when they are truly independent.
