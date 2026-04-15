# Findings & decisions (current)

**As of 2026-04-15** — this file is the **live** planning-memory summary for this install. Older narrative blocks were removed to avoid contradicting the repo; dated plans under `.plans/` remain as **historical** context (see [`HISTORICAL.md`](./HISTORICAL.md)).

## Install snapshot

| Item | Value |
| ---- | ----- |
| Always-on rules | 3: `agent-workflow.md`, `agent-writing.md`, `browser-automation.md` (via `opencode.json` `instructions`) |
| Skills | 31 under `skills/*/SKILL.md` |
| Slash commands | 10 under `commands/*.md` |
| Custom agents | `shikamaru`, `urahara`, `hinata`, `gojo`, `kenma`, `oikawa`, `nanami` |
| Built-ins disabled in `opencode.json` | `explore`, `general` |
| MCP (native `opencode.json`) | `contextplus`, `firecrawl`, `agentation`, `context7`, `exa` (remote) |
| Context+ embed env | `OLLAMA_EMBED_MODEL` = `nomic-embed-text-v2-moe:latest` (see `opencode.json`) |
| Skill defaults | `agent-permissions.jsonc` defaults `["!*"]` — allowlists per agent; primaries `*` |

## Policy decisions (spa day)

1. **Rules vs skills:** Rules stay short and cross-cutting; skills own workflows and triggers.
2. **`.plans/`:** Use for long-running, multi-session, or high-risk work (or explicit user request), not every multi-step task.
3. **Strict skills:** Agents must consider allowlisted skills early; universal prompt stays short and references capability policy.
4. **No `mcporter` in tree:** Research/skills use native MCP or repo-documented paths; ignore dated docs that reference removed `mcporter.json` / `skills/mcporter`.

## Contradictions resolved in this pass

- README command count and `/checkpoint` drift vs actual `commands/`
- README skill-permissions names (`docs/deep-research`, `exa`) vs real skill ids (`docs-research`, `deep-research`, `exa-search`)
- README MCP embed label vs `opencode.json`
- Bulky `using-skills` injection vs minimal core + OpenCode reality
- `agent-permissions` "CLI-only" wording vs MCP-backed skills
- `planning-with-files` / rules §8 implying default `.plans/` for all work
- `writing-plans` same-session vs `executing-plans` separate-session wording
- Stale `.plans/findings.md` / `progress.md` narratives (old rosters, mcporter) presented as current

## Follow-ups (optional)

- Normalize any remaining `origin:` frontmatter in unrelated skills if desired (not required for this baseline).
- If you add `/checkpoint` again, bump command count in README.
