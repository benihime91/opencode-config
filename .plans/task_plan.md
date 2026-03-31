# Task Plan: port MCP-driven workflow to CLI + skills

## Goal

Deeply research how this local OpenCode config currently depends on MCPs, study how `mcporter` can convert MCP servers into CLI-first workflows, and then port this repo toward a CLI + skills model with the smallest correct design.

## Current Phase

Phase 4 — complete

## Phases

### Phase 1: Context recovery and requirement framing
- [x] Re-read planning memory and repo structure
- [x] Inspect current MCP-related config surfaces (`opencode.json`, permissions, plugins)
- [x] Ask the minimum clarifying question needed to lock migration scope
- **Status:** complete

### Phase 2: Research and design approval
- [x] Research `mcporter` deeply enough to understand viable conversion patterns and constraints
- [x] Map those patterns onto this repo's current MCP usage
- [x] Propose 2-3 migration approaches with recommendation
- [x] Present the design and get user approval before implementation
- **Status:** complete

### Phase 3: Port implementation
- [x] Replace or adapt MCP-dependent config to the approved CLI + skills model
- [x] Update any affected permissions, prompts, commands, installer, and docs surfaces as needed
- [x] Keep module boundaries clean and avoid adding new catch-all logic
- **Status:** complete

### Phase 4: Verification and handoff
- [x] Verify the new workflow locally as far as possible
- [x] Summarize what was ported, what remains MCP-based if anything, and any follow-up steps
- **Status:** complete

## Key Questions

1. Should this pass aim for a full MCP removal from `opencode.json`, or a first wave that ports only the MCPs which have a clean CLI + skills replacement now? → Full MCP removal

## Decisions Made

| Decision | Rationale |
| -------- | --------- |
| Treat this as a workflow behavior change requiring research + design approval before edits | The user asked for a deep-research-backed port away from MCPs toward CLI + skills |
| Target full MCP removal in this pass | The user explicitly chose a full port rather than a partial first wave |
| Follow-up cleanup should remove `CONTEXTPLUS.md`, deepen `skills/repo-discovery/SKILL.md`, and move `config/mcporter.json` to repo root as `mcporter.json` | The user explicitly approved the full-cutover follow-up and asked for the config file to live at repo root |
| New follow-up under design: add a dedicated `mcporter` skill and enable it for all agents | The user explicitly requested a first-class `mcporter` skill plus broad agent access |
| Installer follow-up should add missing symlinks for `rules/` and `tui.json` while preserving `mcporter` installation | The installer already installs `mcporter@latest`; the real gap is stale symlink coverage for active config surfaces |
| New follow-up under design: rename all agents to mythology-themed names and update every live reference | The user explicitly wants role-fit Greek/Roman god names across `agents/` plus all repo references |
| New follow-up under design: add a `deep-research` skill centered on `mcporter`, prioritize Zeus/Apollo/Athena/Hermes usage, and bootstrap Firecrawl from `install.sh` by default when Docker is available | The user explicitly wants a deep research workflow that stays CLI-first, falls back to built-in web tools when CLI providers fail, and should automatically bring up local Firecrawl unless Docker is missing or the installer option disables it |
| Current Firecrawl follow-up should replace the minimal env template with a fuller curated repo-owned template, prefer local Ollama-backed AI settings, and end with a real `mcporter` smoke test against the running Firecrawl service | The user wants fuller in-repo Firecrawl control, explicitly prefers local Ollama for AI features, and now wants an end-to-end validation through `mcporter` |
| New follow-up under design: change `plugins/planning-with-files` so only Zeus and Hermes get the full planning skill load, while the other custom agents only receive planning nudges | The user wants a narrower planning-memory injection policy and explicitly asked for a list of which agents should fully load versus only get nudges |

## Errors Encountered

| Error | Attempt | Resolution |
| ----- | ------- | ---------- |
| None yet | - | - |

## Notes

- Initial repo scan confirms MCP usage is currently first-class in `opencode.json`, `agent-permissions.jsonc`, `plugins/agent-permissions.ts`, `README.md`, and `install.sh`.
- The current harness uses MCP families both as runtime capabilities and as permission categories, so this port likely touches more than just `opencode.json`.
- Recent semantic blast-radius checks show the biggest remaining design surfaces are prompt/docs files (`CONTEXTPLUS.md`, `README.md`, `agents/explorer.md`, `agents/librarian.md`, `agents/cursor.md`, and agentation skills), which supports moving next into design options rather than more raw discovery.
- Current skill surface already exposes capability-specific workflows (`repo-discovery`, `docs-research`, `annotation-sync`) that embed `mcporter` command recipes, so a new generic `mcporter` skill should complement those without making the domain skills redundant or contradictory.
- Current installer symlink coverage is stale relative to repo layout: `opencode.json` actively references `~/.config/opencode/rules/*.md`, but `install.sh` does not link `rules/`; the repo also has top-level `tui.json`, but `install.sh` does not link it either.
- The next open design task is a repo-wide agent renaming pass. This is broader than renaming filenames in `agents/`; it likely touches prompt prose, permissions/docs, and any command or README references that mention current agent names.
- The next open design task is a deep-research workflow addition. It touches skill inventory, agent-permissions, agent prompts/docs that route research work, `mcporter.json`, and `install.sh` for default Firecrawl self-host bootstrap.
