# Findings & decisions (current)

**As of 2026-04-16** — this file is the **live** planning-memory summary for the active semctx migration. Older dated plans under `.plans/` remain historical context only (see [`HISTORICAL.md`](./HISTORICAL.md)).

## Install snapshot

| Item | Value |
| ---- | ----- |
| Always-on rules | 2: `agent-workflow.md`, `agent-writing.md` (via `opencode.json` `instructions`) |
| Skills | 30 under `skills/*/SKILL.md` |
| Slash commands | 10 under `commands/*.md` |
| Custom agents | `shikamaru`, `urahara`, `hinata`, `gojo`, `kenma`, `oikawa`, `nanami` |
| Built-ins disabled in `opencode.json` | `explore`, `general` |
| Native MCP/services | `firecrawl`, `agentation`, `context7`, `exa` (remote) + semctx CLI via skill/install flow |
| Default local discovery model | `ollama/leoipulsar/harrier-0.6b:latest` for semctx indexed commands |
| Skill defaults | `agent-permissions.jsonc` defaults `![*]` style deny-by-default allowlists per subagent; primaries keep `*` |

## Decisions for semctx migration

1. **semctx is the live default** for local repo discovery, indexing, semantic search, and blast-radius analysis.
2. **Context+ references should remain only in archival surfaces** such as old `.plans/*` files and git history.
3. **Use the user's requested model by default:** `ollama/leoipulsar/harrier-0.6b:latest`.
4. **Indexed semctx commands should stay explicit** about `--json`, `--target-dir`, `--cache-dir`, and `--model`.

## Research findings for this task

- semctx upstream install command is `uv tool install git+https://github.com/benihime91/semctx.git`.
- semctx indexed commands (`index`, `search-code`, `search-identifiers`) depend on embeddings and take explicit provider/model configuration.
- Upstream semctx skill guidance recommends `--json` for agent use and explicit `--target-dir` plus `--cache-dir` for deterministic scope.
- External research suggests the requested Harrier model is embedding-oriented, but local runtime verification is still required because semctx uses Ollama's embedding path and compatibility must be proven empirically.

## Runtime verification findings

- `uv tool install --force git+https://github.com/benihime91/semctx.git` succeeded locally and installed the `semctx` executable.
- `semctx --help` succeeded and showed the expected command surface: `tree`, `skeleton`, `search-code`, `search-identifiers`, `blast-radius`, and `index`.
- `semctx --json tree . --depth-limit 1` succeeded locally.
- `semctx --json --target-dir "." --cache-dir ".semctx" index init --model "ollama/leoipulsar/harrier-0.6b:latest"` succeeded locally and wrote an index under `.semctx/index.db`.
- First `search-code` attempt returned `full_rebuild_required`; running `semctx index refresh --full --model "ollama/leoipulsar/harrier-0.6b:latest"` resolved it.
- After the full refresh, both `search-code` and `search-identifiers` succeeded with the requested Ollama model.
- semctx created `.semctx/` cache artifacts and the repo now ignores that path via `.gitignore`.

## Live repo surfaces updated so far

- `opencode.json` — removed native `contextplus` MCP entry.
- `install.sh` — added `uv` prerequisite handling, semctx install step, and post-install semctx guidance.
- `skills/repo-discovery/SKILL.md` — rewritten around semctx CLI workflow.
- `skills/semctx/SKILL.md` — added new semctx skill with local default model guidance.
- `agents/shikamaru.md`, `agents/nanami.md` — replaced live Context+ wording with semctx wording.
- `agent-permissions.jsonc` — added `semctx` to relevant subagent allowlists.
- `README.md` — updated install, skill counts, permission counts, and discovery/service docs.

## Remaining work

- None open for the requested migration.

## 2026-04-17 — Skill model override (intentional drift)

- **What I did:** Updated `skills/repo-discovery/SKILL.md` and `skills/semctx/SKILL.md` to always call indexed semctx commands with `--model vertex_ai/gemini-embedding-2-preview`. Reviewer flagged this as drift from the verified default (`ollama/leoipulsar/harrier-0.6b:latest`) still documented in `README.md`, `install.sh`, and entries above in this file.
- **User decision:** Keep skills on Vertex, leave install/docs/findings on Ollama. The drift is intentional — agents should prefer Vertex embeddings per skill guidance, while the install flow and historical verification record remain Ollama-based.
- **Implication for future reviewers:** Do not "fix" the mismatch by reverting the skill model back to Ollama or by rewriting install.sh/README to Vertex without an explicit user request. Treat `vertex_ai/gemini-embedding-2-preview` as the current agent-runtime default and `ollama/leoipulsar/harrier-0.6b:latest` as the documented install-flow reference only.
- **Early detection signal missed:** After editing skill model defaults, I should have checked install/docs surfaces for consistency before declaring the change done. Added that to the review reflex for future skill/config edits.
