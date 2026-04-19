# Progress Log

## Session: 2026-04-19 (firecrawl repair + shikamaru routing fix)

- **Status:** complete
- **Focus:** User reported (1) firecrawl non-functional and (2) shikamaru over-routing to @nanami instead of @oikawa for frontend.
- **Outcome:**
  - **Fix 1 — firecrawl live stack.** Root cause: `~/firecrawl/.env` was a dangling symlink pointing into a non-existent `~/.config/opencode/firecrawl/` directory, so docker compose loaded empty env. Started OrbStack, added the missing `~/.config/opencode/firecrawl` directory symlink to `/Users/ayushmanburagohain/opencode-config/firecrawl`, repointed `~/firecrawl/.env` to the canonical `.env.default`, and brought the stack up (`docker compose up -d`). All 5 containers healthy; `curl http://localhost:3002/` returns the API banner.
  - **Fix 2 — shikamaru routing.** Edited `agents/shikamaru.md`: added an explicit Routing Matrix after Phase 0 mapping task-signals to primary agents (UI/visual → @oikawa mandatory; architecture → @gojo; search → @hinata; external docs → @kenma; backend/non-visual code → @nanami default only when no specialist matches). Expanded @oikawa roster entry with cost tag, trigger keywords, parallelization, and pairing notes. Tightened @nanami entry: removed "primary implementer" framing, scoped to non-visual work, added explicit "NOT the default for UI" note.
  - **Fix 3 — firecrawl extract bug.** `firecrawl_extract` failed with `Unsupported model version v1 for provider ollama.chat` because image upgraded to AI SDK 5 (spec v2) while `ollama-ai-provider@1.2.0` is still v1. Firecrawl's `llmExtract.ts` hardcodes `provider="openai"` anyway. Rerouted through Ollama's OpenAI-compatible `/v1` endpoint: `OPENAI_BASE_URL=http://host.docker.internal:11434/v1`, `OPENAI_API_KEY=ollama`, `MODEL_NAME=granite4:350m` (non-thinking, ~0.6s on CPU), `OLLAMA_BASE_URL=` empty. Pulled `granite4:350m` locally. `docker compose down && up -d` to pick up new env. Verified: `firecrawl_extract(example.com)` returned clean `{title, body}` JSON.
  - **Fix 4 — install.sh alignment.** Updated `install.sh` so fresh installs produce the same corrected env: renamed helper to `default_firecrawl_ollama_openai_base_url` (emits `/v1`, not `/api`); added `FIRECRAWL_DEFAULT_MODEL=granite4:350m` and `FIRECRAWL_DEFAULT_EMBEDDING_MODEL=nomic-embed-text` constants; rewrote `apply_firecrawl_ollama_defaults` to manage 5 keys (sets `OPENAI_BASE_URL`/`OPENAI_API_KEY`/`MODEL_NAME`/`MODEL_EMBEDDING_NAME`, comments out legacy `OLLAMA_BASE_URL`); rewrote `ensure_firecrawl_env` fallback heredoc to interpolate correctly (also fixed pre-existing single-quoted heredoc bug); added next-steps banner lines about `/v1` endpoint and model pull. `bash -n` passes; python rewrite block tested against a seeded old-state env and produced the expected output.
  - **MCP surface verification.** `firecrawl_scrape`, `firecrawl_map`, `firecrawl_search`, `firecrawl_crawl`, `firecrawl_extract` all returned valid responses against the running local stack.
- **Open:** None.

## Session: 2026-04-16 (semctx migration — install, docs, verification)

- **Status:** complete
- **Focus:** Replace live Context+ surfaces with semctx, set the requested default Ollama model, and verify the CLI locally.
- **Outcome so far:**
  - **Phase 1:** Removed native `contextplus` MCP config from `opencode.json`.
  - **Phase 1:** Updated `install.sh` to ensure `uv`, install semctx from GitHub, and print semctx/Ollama post-install guidance.
  - **Phase 1:** Rewrote `skills/repo-discovery/SKILL.md` around semctx and added `skills/semctx/SKILL.md`.
  - **Phase 1:** Updated `agents/shikamaru.md`, `agents/nanami.md`, `agent-permissions.jsonc`, and `README.md` for semctx defaults and permissions.
  - **Planning:** Replaced stale `.plans/task_plan.md` baseline task with the active semctx migration task and refreshed `.plans/findings.md`.
  - **Phase 3:** Installed semctx locally with `uv tool install --force git+https://github.com/benihime91/semctx.git`; confirmed `semctx --help` and `semctx --json tree . --depth-limit 1` worked.
  - **Phase 3:** Verified indexed semctx flow with the requested model using `index init`, `index refresh --full`, `search-code`, and `search-identifiers`.
  - **Phase 4:** Confirmed remaining `contextplus` hits are limited to historical `.plans/*` files and git history.
- **Open:** None. Migration complete.

## Session: 2026-04-16 (spa day consolidation — skill-heavy restructure)

- **Status:** complete
- **Focus:** Consolidate rules and skills per user preferences: skill-heavy hierarchy, merge research skills, strictly heavyweight `.plans/`.
- **Outcome:**
  - **Phase 1:** Slimmed `rules/agent-workflow.md` (15→5 principles), `rules/agent-writing.md` (4→2 principles), deleted `rules/browser-automation.md`
  - **Phase 2:** Created `skills/research/SKILL.md` merging docs-research + deep-research + exa-search. Removed 3 old skill dirs.
  - **Phase 3:** Absorbed removed rule content into 10 skills: writing-plans (cold-start readiness), executing-plans (review checklist + evidence-first completion), dispatching-parallel-agents (cold-start/evidence/continuity), repo-discovery (evidence confirmation strengthened), writing-skills (skill interface design), firecrawl (failure classification table), annotation-sync (MCP provider verification), agent-browser (6 browser automation discipline rules), brainstorming (already covered), planning-with-files (already covered)
  - **Phase 4:** Updated agent-permissions.jsonc (3→1 research skill), all 5 agent files, README.md (counts, permissions, skills table, rules table), firecrawl SKILL.md reference, rules-distill/results.json
- **Open:** None. All 4 phases complete.

## Session: 2026-04-15 (rules and skills spa day — implementation)

- **Status:** complete
- **Focus:** Implement attached plan: slim always-on core, rescope `.plans/` usage, sync README/commands/permissions copy, rewrite stale planning memory + `rules-distill` audit JSON.
- **Outcome:**
  - Updated `rules/agent-workflow.md`, `plugins/using-skills.ts`, `plugins/agent-permissions.ts`
  - Updated planning plugin (`constants.ts`, `messages.ts`, `planning-with-files.ts`) and skills `planning-with-files`, `brainstorming`, `writing-plans`, `executing-plans`
  - Synced `README.md`, `commands/agent-permissions-debug.md`, `agent-permissions.jsonc` comments
  - Reset planning trio to post–spa-day baseline; added `.plans/HISTORICAL.md`
  - Regenerated `skills/rules-distill/results.json`

Prior session logs before this date are superseded by `.plans/HISTORICAL.md` and the current `task_plan.md` above.
