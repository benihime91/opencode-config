# Progress Log

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
