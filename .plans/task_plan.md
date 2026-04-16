# Task Plan: Replace Context+ with semctx

## Goal

Replace Context+ with semctx as the default local search and indexing workflow, set the requested Ollama model, update install/docs/permissions surfaces, and verify the CLI works locally.

## Active Artifacts

- **Active task:** Semctx migration — install, docs, verification (2026-04-16)
- **Active spec path:** none
- **Active plan path:** none (implementation tracked in repo + session)
- **Last updated:** 2026-04-16

## Intake

- **Intended outcome:** semctx replaces Context+ everywhere that defines local repo discovery defaults; install flow installs semctx; docs mention the requested default model; local CLI verification proves the setup works.
- **Known context:** semctx upstream install is `uv tool install git+https://github.com/benihime91/semctx.git`; requested default model is `ollama/leoipulsar/harrier-0.6b:latest`; local machine already has `uv`, `ollama`, and that Ollama model available.
- **Unknowns / blockers:** whether the requested model works end-to-end for semctx indexed search under local Ollama.
- **Non-goals:** rewriting historical `.plans/*.md` archives or redesigning unrelated agent behavior.
- **Decision boundaries:** semctx becomes the default local search/indexing backend; keep historical references only in archival `.plans/*` and git metadata.
- **Readiness:** in progress.

## Current Phase

**Phase 4** — final review complete

## Phases

### Phase 1: Replace live Context+ surfaces

- [x] Remove `contextplus` from `opencode.json`
- [x] Install semctx via `install.sh` and add uv prerequisite handling
- [x] Replace repo-discovery workflow and add `skills/semctx/SKILL.md`
- [x] Update agent permissions and live agent references

### Phase 2: Docs and planning memory

- [x] Update README install/discovery/skill-permission docs
- [x] Refresh `.plans/task_plan.md`, `.plans/findings.md`, and `.plans/progress.md`

### Phase 3: Runtime verification

- [x] Run semctx install/health checks locally
- [x] Run a real semctx command path using the requested model

### Phase 4: Final review

- [x] Confirm remaining `contextplus` mentions are historical only
- [x] Summarize any runtime caveats from verification

## Key Questions

None open.

## Decisions Made

| Decision | Rationale |
| -------- | --------- |
| semctx replaces Context+ for live repo discovery | User explicitly requested semctx as the default for all search and indexing ops |
| Default semctx model is `ollama/leoipulsar/harrier-0.6b:latest` | User explicitly requested that model |
| Historical `.plans/*` references stay untouched unless needed | They are archival context, not live config surfaces |
| `.semctx/` should stay ignored | semctx verification created local cache artifacts that should not be committed |

## Errors Encountered

| Error | Attempt | Resolution |
| ----- | ------- | ---------- |
| Large multi-file patch failed on first attempt | 1 | Re-read exact file state and switched to smaller targeted patches |
| `search-code` returned `full_rebuild_required` right after `index init` | 1 | Ran `semctx index refresh --full` and re-ran searches successfully |
