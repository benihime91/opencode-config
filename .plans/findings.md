# Findings & Decisions

## Current Task

Consolidate rules and skills, remove contradictions, and reshape planning so persistent planning state lives under `.plans/` with clean ownership boundaries.

## Approved Preferences

- `build` is the default OpenCode agent; its entry in permissions is intentional.
- MCPs configured in `opencode.json` are expected to be always available, so unconditional MCP guidance is acceptable.
- Remove `search-first` entirely; its value is already covered by `AGENTS.md`, orchestrator delegation, and `contextplus` usage guidance.
- Keep the strict orchestrator rule against direct implementation edits, but allow orchestrator updates to valid planning files and brainstorming/spec documents.
- Keep the current model assignments.
- Remove the positive-framing requirement from `code-reviewer`; feedback should be direct and issue-focused.
- Correct `planner.md` so its description reflects a planning specialist rather than an orchestrator.
- Remove `brainstorming` as a separate skill and move its useful workflow into orchestrator behavior.
- Planner-generated durable plan artifacts and orchestrator planning memory should all live under `.plans/`.
- Planner writes only timestamped task plan artifacts; orchestrator alone updates `task_plan.md`, `findings.md`, and `progress.md`.
- Do not keep redirect stubs for old planning paths after the `.plans/` migration.

## Main Discoveries

- `search-first` is stale and redundant: it references non-existent agent names (`general-purpose`, `architect`) and overlaps with existing orchestrator + `AGENTS.md` guidance.
- `brainstorming` contains useful clarification discipline, but its spec-writing loop and `writing-plans` terminal step do not match this repo's actual workflow.
- Path migrations require a final grep-based verification pass because stale references can remain in codemaps, skill copy, or redirect helpers after first-pass cleanup.
- Planning state under a hidden top-level `.plans/` directory better matches the user's desired separation of working memory from user-facing docs.

## Spa Day 2 — Decisions (2026-03-26)

- Delete stale `skills/brainstorming/` and `skills/search-first/` directories (still on disk from prior session).
- Remove phantom `chrome-devtools` MCP from designer permissions in `agent-permissions.jsonc` (not configured in `opencode.json`).
- Leave trailing syntax artifacts (backticks/semicolons) in `oracle.md`, `explorer.md`, `librarian.md` as-is per user preference.
- Remove `ast_grep_search` reference from `explorer.md` (tool doesn't exist).
- Remove deletion log (`docs/DELETION_LOG.md`) requirement entirely from `refactor-cleaner.md`; use commit messages instead.
- Keep `docs/CODEMAPS/` as the hardcoded codemaps path in `doc-updater.md`.
- Standardize `name:` field in frontmatter across all 10 agents.
- Route `/learn` command to `orchestrator` instead of `doc-updater` (orchestrator owns `.plans/` files).
- Keep `using-skills.ts` aggressive skill-check behavior — agent-permissions controls which skills each agent can access.
- Keep AGENTS.md content duplication with orchestrator prompt (redundancy is intentional).

## Implemented Changes

- Removed the `search-first` and `brainstorming` skills from the repo.
- Removed `search-first` from all per-agent skill permissions.
- Updated `agents/orchestrator.md` so clarification/approach selection lives in the orchestrator, while implementation edits remain delegated.
- Updated `agents/planner.md` so planner writes durable artifacts under `.plans/` and does not touch the planning trio.
- Updated `agents/code-reviewer.md` to be direct and issue-focused without praise framing.
- Migrated prompt, command, plugin, README, and codemap references from legacy planning paths to `.plans/`.
- Removed superseded planning files and old root redirect stubs instead of keeping compatibility layers.

## Correction Log

- What I did: I initially treated the planning trio as rooted directly under `docs/`, then under an intermediate docs subdirectory.
- What the user instructed instead: Keep all planning memory and durable plan artifacts under `.plans/`, and remove old redirect stubs.
- Why my approach was incorrect or misaligned: It optimized for visible docs organization rather than the user's preferred hidden working-memory directory.
- Early detection signal I missed: The user framed the planning files as internal plan docs/progress reports rather than user-facing documentation.
- Preventative rule or checklist update: When relocating persistent planning state, confirm early whether it belongs in a visible docs tree or a hidden working-memory directory.
- Repo-specific nuance discovered: This repo wants all active planning memory and planner-generated durable artifacts under `.plans/`, with no compatibility stubs left behind.
