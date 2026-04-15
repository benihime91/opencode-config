# Historical planning artifacts

Markdown files in this directory dated **before 2026-04-15** (including `specs/` and dated `*-plan.md` files) may describe **superseded** agent names, permissions keys, or workflows (e.g. Greek-god roster, `mcporter`-centric flows, old rule counts).

**Current source of truth** for this install:

- `[README.md](../README.md)` — roster, commands, MCP table, skill inventory
- `[opencode.json](../opencode.json)` — MCP servers, disabled built-ins, LSP
- `[agent-permissions.jsonc](../agent-permissions.jsonc)` — per-agent skill allowlists
- `[rules/](../rules/)` — three always-on instruction files (`agent-workflow.md`, `agent-writing.md`, `browser-automation.md`)

Use this folder for **disk-backed continuity** when a task is long-running, multi-session, or high-risk; do not treat every dated file here as active policy.