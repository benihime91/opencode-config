# Findings & Decisions

## Current Task (2026-04-07, agent rename pass)

- The user approved a repo-wide rename from Greek-god agent names to film/anime operator names and explicitly required that all references be updated in the same pass.
- Approved mapping:
  - `trinity` ← `aphrodite`
  - `l` ← `apollo`
  - `spike` ← `artemis`
  - `motoko` ← `athena`
  - `lelouch` ← `cronus`
  - `cobb` ← `daedalus`
  - `roy` ← `hephaestus`
  - `neo` ← `hermes`
  - `alfred` ← `hestia`
  - `ripley` ← `themis`
  - `morpheus` ← `zeus`
- Approved muted premium colors:
  - `trinity` `#40364D`
  - `l` `#2E3A4F`
  - `spike` `#5C6A4E`
  - `motoko` `#3E5F67`
  - `lelouch` `#5A426F`
  - `cobb` `#5E5A57`
  - `roy` `#6A3F3F`
  - `neo` `#3F5A4B`
  - `alfred` `#6A7153`
  - `ripley` `#7A6854`
  - `morpheus` `#4B3B63`
- Grounded rename surface so far:
  - The rename targets were grounded across `agents/`, `README.md`, `agent-permissions.jsonc`, `opencode.json`, `plugins/planning-with-files/constants.ts`, command frontmatter, and the active planning files.
  - Planning memory and older plan files contain many Greek-name references that may need consistency cleanup or selective preservation.
- Implementation status:
  - All 11 agent files have now been renamed on disk to the approved lower-case names.
  - Active config/docs surfaces have been updated to the renamed roster, including permissions keys, command routing, planning-plugin constants, README tables, orchestrator workflow text, and primary-agent colors.
  - Verification re-reads confirmed the new names in `agents/morpheus.md`, `agents/alfred.md`, `agents/ripley.md`, `README.md`, `agent-permissions.jsonc`, `opencode.json`, and `plugins/planning-with-files/constants.ts`.
  - Exact-match grep over active non-historical surfaces (`agents/*.md`, `README.md`, `agent-permissions.jsonc`, `opencode.json`, `plugins/**/*.ts`, `commands/*.md`) returned no remaining Greek-agent names.
  - Remaining Greek-name matches are now limited to historical planning memory plus the active rename mapping notes that intentionally document the before→after conversion.
- Discovery note:
  - Native Context+ was unavailable during this pass (`Not connected`), so repo grounding switched to direct reads plus exact-match search fallback.

## Current Task (2026-04-07, rules and skills spa day)

- Current repo inventory from direct reads and inventory scripts:
  - 5 rule files: `agent-workflow.md`, `agent-writing.md`, `browser-automation.md`, `modular-code-enforcement.md`, `python-coding-style.md`.
  - 31 skills currently installed in `skills/`.
- High-signal current rule structure:
  - `agent-workflow.md` is the main cross-cutting operating policy layer.
  - `agent-writing.md` governs prose and interface text.
  - `browser-automation.md` is already narrowly scoped and skill-aligned.
  - `modular-code-enforcement.md` and `python-coding-style.md` govern code architecture and Python style.
- High-signal current overlap pattern from direct reads:
  - `agent-workflow.md` and several workflow skills both describe planning, readiness, verification, escalation, and evidence expectations.
  - `repo-discovery/SKILL.md` strongly restates discovery-order rules that are partly general and partly workflow-specific.
  - `planning-with-files/SKILL.md` carries both durable workflow instructions and some broad behavioral rules.
  - `brainstorming/SKILL.md` mixes requirement workflow, planning gate policy, and some cross-cutting implementation constraints.
- User preference updates captured through direct questioning:
  - Optimize for contradiction reduction first.
  - Keep principles in rules and detailed workflow steps in skills.
  - If conflicts remain, specific guidance should beat general guidance.
  - This pass may be a deep rewrite rather than only targeted cleanup.
- Design implication:
  - The strongest likely direction is a clearer hierarchy where rules define durable cross-cutting policy and skills focus on trigger conditions, workflow steps, and bounded task-specific constraints.
- Additional scoped requirement from the user:
  - `skills/exa-search/SKILL.md` must also be updated to reflect the newer `skills/mcporter/SKILL.md` guidance.
- Direct-read grounding for that requirement:
  - `skills/exa-search/SKILL.md` still describes Exa as an MCP-first workflow, includes `~/.claude.json`, and documents old Exa MCP tool names (`web_search_exa`, `get_code_context_exa`).
  - `skills/mcporter/SKILL.md` now treats `mcporter` as a skill-driven CLI workflow, requires explicit `--config ~/.config/opencode/mcporter.json`, prefers JSON output, and includes updated warm-up / race-condition guidance for `bunx mcporter` usage.
  - This makes `exa-search` a confirmed contradiction hotspot in the current pass, not just a nice-to-have cleanup.
- Live schema confirmation during implementation startup:
  - `bunx mcporter --help` confirms the repo should still pass `--config ~/.config/opencode/mcporter.json`, and that `list`, `call`, `auth`, `config`, `daemon`, `generate-cli`, `inspect-cli`, and `emit-ts` are the current first-class command families.
  - `bunx mcporter list exa --schema --config ~/.config/opencode/mcporter.json` confirms the live Exa tool surface is currently:
    - `web_search_exa(query, numResults?)`
    - `web_search_advanced_exa(query, numResults?, type?, category?, includeDomains?, ...)`
    - `get_code_context_exa(query, numResults?)`
    - `crawling_exa(urls, maxCharacters?)`
    - deprecated `company_research_exa(companyName, numResults?)`
    - deprecated `people_search_exa(query, numResults?)`
  - Important mismatch to fix in `skills/exa-search/SKILL.md`: it currently teaches `get_code_context_exa(..., tokensNum: ...)`, but the live schema now uses `numResults`, not `tokensNum`.
  - Another cleanup target: `skills/exa-search/SKILL.md` frontmatter currently contains an extra `origin: ECC` field, while the current skill-writing convention allows only `name` and `description`.
- First consolidation wave now on disk:
  - `rules/agent-workflow.md` now explicitly defines the rule-vs-skill boundary and keeps the cross-cutting policy layer there.
  - `skills/brainstorming/SKILL.md`, `skills/planning-with-files/SKILL.md`, and `skills/repo-discovery/SKILL.md` are now shorter and more workflow-shaped.
  - `skills/mcporter/SKILL.md` is now the clearer canonical home for generic mcporter CLI guidance.
  - `skills/annotation-sync/SKILL.md`, `skills/docs-research/SKILL.md`, `skills/deep-research/SKILL.md`, and `skills/exa-search/SKILL.md` now inherit generic mcporter rules instead of restating them.
  - `skills/exa-search/SKILL.md` no longer teaches `~/.claude.json`, old setup language, or `origin: ECC`, and now reflects the live shared-config workflow.
- Read-back verification after the first rewrite found one remaining contradiction cluster:
  - `skills/docs-research/SKILL.md` and `skills/deep-research/SKILL.md` still had stale Exa examples that no longer matched the live schema.
- Follow-up fix now on disk:
  - `skills/docs-research/SKILL.md` now uses `exa.get_code_context_exa(..., numResults: 5)`, simplified `exa.web_search_exa(..., numResults: 5)`, and simplified `exa.crawling_exa(..., maxCharacters: 6000)`.
  - `skills/deep-research/SKILL.md` now uses `exa.web_search_exa(..., numResults: 8)` and `exa.crawling_exa(..., maxCharacters: 8000)` without unsupported extra arguments.
- Current verified state:
  - The mcporter-linked research skills now agree on the shared config path and on Exa example argument shapes.
  - The main remaining work is final contradiction review and closeout, not another design rewrite.
- Final verification pass:
  - Direct read-back was completed for every file changed in this pass: `rules/agent-workflow.md`, `skills/brainstorming/SKILL.md`, `skills/planning-with-files/SKILL.md`, `skills/repo-discovery/SKILL.md`, `skills/mcporter/SKILL.md`, `skills/docs-research/SKILL.md`, `skills/deep-research/SKILL.md`, `skills/annotation-sync/SKILL.md`, and `skills/exa-search/SKILL.md`.
  - Exact-pattern verification found no remaining stale Exa example shapes in skill files:
    - no `tokensNum` usage in Exa examples
    - no `exa.web_search_exa(... type: ...)`
    - no `exa.crawling_exa(... subpages|maxAgeHours|subpageTarget ...)`
  - The only `~/.claude.json` hit inside `skills/` is now the intentional negative rule in `skills/exa-search/SKILL.md` telling agents not to teach that setup.
  - Remaining `origin: ECC` matches are limited to unrelated skills outside the approved scope of this pass (`agent-harness-construction`, `frontend-design`, `frontend-patterns`, `frontend-slides`, `manim-video`).
- Preference-alignment verdict:
  - Contradiction reduction came first: the highest-signal overlaps were handled before any broader cleanup.
  - Rules now more clearly own durable principles, while the edited skills now more clearly own trigger conditions and workflows.
  - The new rule-vs-skill boundary in `rules/agent-workflow.md` explicitly encodes the user's preferred precedence model: specific guidance narrows the general rule within scope.
- Residual risk / deferral:
  - Some unrelated skills still carry older frontmatter conventions (`origin: ECC`), but they were not part of the user's approved contradiction cluster for this pass.
  - If the user wants a second cleanup wave, frontmatter normalization across the remaining out-of-scope skills is now an obvious follow-up target.
- User-directed follow-up scope change:
  - The user explicitly asked to remove the remaining `origin: ECC` markers, update the rest where needed, and also consolidate `agent-permissions.jsonc` with the updated skill surface.
  - This reopens the task as a bounded second cleanup wave rather than a brand-new project.
- Grounded second-wave cleanup surface:
  - Remaining `origin: ECC` matches are exactly five skills:
    - `skills/agent-harness-construction/SKILL.md`
    - `skills/frontend-design/SKILL.md`
    - `skills/frontend-patterns/SKILL.md`
    - `skills/frontend-slides/SKILL.md`
    - `skills/manim-video/SKILL.md`
  - Description-pattern grep did not surface a second obvious repo-wide frontmatter issue beyond those five, but direct reads show their descriptions still use the older style instead of the current trigger-first `Use when ...` convention.
  - `agent-permissions.jsonc` currently has at least one concrete inconsistency: duplicate `agent-browser` in `aphrodite`.
  - The permissions file may also need alignment against the current specialist roster and the updated skills introduced in this repo pass.
- Recommended second-wave shape:
  - Remove `origin: ECC` from those five skills.
  - Normalize each of their `description` fields to the current trigger-first style.
  - Make only small body-level wording cleanups where clearly needed to match current skill conventions.
  - Consolidate `agent-permissions.jsonc` to remove obvious duplication and align allowed skills with the current skill/agent model, without redesigning the whole permission system.
- Approved second-wave design:
  - The user approved the bounded wider cleanup rather than a frontmatter-only pass or a deep second rewrite.
  - That approval kept the scope limited to the five stale skills plus `agent-permissions.jsonc`.
- Second-wave implementation now on disk:
  - Removed `origin: ECC` from:
    - `skills/agent-harness-construction/SKILL.md`
    - `skills/frontend-design/SKILL.md`
    - `skills/frontend-patterns/SKILL.md`
    - `skills/frontend-slides/SKILL.md`
    - `skills/manim-video/SKILL.md`
  - Rewrote each of those five `description` fields into the current trigger-first `Use when ...` form.
  - Kept the cleanup intentionally shallow in the large `skills/frontend-patterns/SKILL.md` file; only frontmatter normalization was done there.
  - Renamed `skills/frontend-slides/SKILL.md` section heading `## Related ECC Skills` to `## Related Skills`.
  - Replaced stale ECC/video-stack wording in `skills/manim-video/SKILL.md` with neutral workflow wording:
    - tool requirements now describe `manim`, `ffmpeg`, optional external video editing, and optional compositing in generic terms
    - workflow step 7 now says to hand off to a broader video workflow only if it adds value
  - Consolidated `agent-permissions.jsonc` without redesigning the model:
    - added `agent-harness-construction` to `daedalus`
    - aligned `aphrodite` with the frontend/design skill cluster by adding `frontend-design`, `frontend-patterns`, `frontend-slides`, and `liquid-glass-design`
    - removed the duplicate `agent-browser` entry from `aphrodite`
- Second-wave verification result:
  - Grep for `^origin:\s*ECC$` across `skills/**/SKILL.md` returned no matches.
  - Grep for old-style description lines (`^description:` not starting with `Use when`) returned no matches.
  - Direct read-back confirmed the changed descriptions and body cleanups in all five targeted skills.
  - Direct read-back of `agent-permissions.jsonc` confirmed:
    - `daedalus` includes `agent-harness-construction`
    - `aphrodite` includes the updated frontend/design skills
    - the duplicate `agent-browser` entry is gone
  - Final stale-phrase verification found no remaining `Related ECC Skills`, `wider ECC video stack`, or nonexistent companion-skill references. The plain English phrase `video-editing` remains in `skills/manim-video/SKILL.md`, but only as generic workflow wording rather than a repo skill reference.
- Residual note after the second wave:
  - `skills/manim-video/SKILL.md` now intentionally uses generic workflow wording instead of referencing nonexistent repo-specific companion skills.
  - The permissions cleanup was a bounded alignment pass, not a broader permission-model redesign.

## Current Task (2026-04-01, subagent artifact context propagation)

- The user suspects Zeus and Hermes are not logging the actual spec/plan files anywhere durable enough for crash recovery and subagent context propagation.
- Grounded workflow findings from direct reads:
  - `agents/zeus.md` required the planning trio in handoffs, but did not require exact approved spec/plan paths when those artifacts existed.
  - `agents/hermes.md` treated the planning trio as shared memory, but did not define a canonical artifact index for active spec/plan files.
  - `plugins/planning-with-files/messages.ts` injected the task-plan head and recent progress, but did not explicitly tell sessions to treat any spec/plan refs in the plan as canonical task artifacts.
  - `skills/planning-with-files/templates/task_plan.md` had no dedicated place to register the active task, spec, or implementation plan.
  - `agents/hephaestus.md` read the planning trio first, but did not explicitly require reading handoff-provided spec/plan files before execution.
- Design decision:
  - Use `.plans/task_plan.md` as the canonical artifact index rather than adding a second planning state system.
  - Surface that index through the task-plan template, planning plugin messaging, Zeus/Hermes workflow wording, and Hephaestus startup rules.
- Implementation result:
  - `.plans/task_plan.md` now carries an `Active Artifacts` section with active task, active spec path, active plan path, and last updated.
  - `skills/planning-with-files/templates/task_plan.md` now includes the same `Active Artifacts` section for future tasks.
  - `plugins/planning-with-files/messages.ts` now tells planning-memory sessions to treat `Active Artifacts` in `.plans/task_plan.md` as the canonical spec and implementation-plan refs.
  - `agents/zeus.md` now requires delegation packages to pass exact spec/plan paths in `CONTEXT` and `MUST DO` when `.plans/task_plan.md` lists them.
  - `agents/hermes.md` now treats `.plans/task_plan.md` as the canonical artifact index and requires immediate updates when the active spec/plan changes.
  - `agents/hephaestus.md` now reads handoff-provided or task-plan-listed spec/plan files before execution and treats them as authoritative task artifacts.
  - `skills/brainstorming/SKILL.md` now says written specs must be registered in `Active Artifacts`.
  - `skills/writing-plans/SKILL.md` now says written implementation plans must be registered in `Active Artifacts`.
- Verification result:
  - Direct read-back confirmed the new artifact-index section in both the live task plan and the task-plan template.
  - Direct read-back confirmed plugin messaging now surfaces the canonical-artifact convention.
  - Direct read-back confirmed Zeus, Hermes, and Hephaestus all reference explicit spec/plan propagation rather than relying on the planning trio alone.
  - The fix does not introduce heuristic artifact discovery or a second planning state system.

## Current Task (2026-04-01, ContextPlus MCP revert)

- The user wants the recent Context+ conversion through the `mcporter`-backed skill workflow reverted back to the default MCP path because the mcporter route is not working properly.
- Direct current-state grounding confirms:
  - `opencode.json` currently has no `.mcp` / MCP server declarations.
  - `mcporter.json` currently defines the `contextplus` server.
  - `skills/repo-discovery/SKILL.md` currently treats Context+ via `mcporter` as the required primary repo-discovery path.
- This is a user correction/redirection relative to the recent migration work: I previously moved Context+ behind the CLI skill + `mcporter` flow, and the user is now asking to restore the default MCP route for this capability.
- The user confirmed the revert should be Context+-only and explicitly asked that the native MCP settings be restored in `opencode.json` after checking official OpenCode docs first.
- Official-doc confirmation from OpenCode:
  - The `mcp` key in `opencode.json` is the native place to configure MCP servers: https://opencode.ai/docs/config/
  - Local MCP servers use the shape `{ type: "local", command: [...], enabled, environment?, timeout? }`: https://opencode.ai/docs/mcp-servers/
  - The docs also confirm that MCP config belongs in native OpenCode config, not in an auxiliary CLI config, when the goal is a default MCP server path: https://opencode.ai/docs/mcp-servers/
- Implementation result for the Context+-only revert:
  - `opencode.json` now restores a native `mcp.contextplus` entry with `type: "local"`, `command: ["bunx", "contextplus"]`, `enabled: true`, a 90s timeout, and the Context+ environment values.
  - `mcporter.json` no longer carries a `contextplus` server entry.
  - `skills/repo-discovery/SKILL.md` now describes Context+ as the native MCP-backed discovery path and no longer teaches routing Context+ through `mcporter`.
- Verification result:
  - Direct read-back confirmed the `mcp.contextplus` block exists in `opencode.json`.
  - Direct read-back confirmed `mcporter.json` still contains the other CLI-backed servers (`firecrawl`, `agentation`, `context7`, `exa`) while excluding `contextplus`.
  - Direct read-back confirmed the repo-discovery skill now points to native `contextplus_*` MCP tools.
  - `node -e` JSON parsing succeeded for both `opencode.json` and `mcporter.json`.
  - Runtime smoke check succeeded after the revert:
    - `opencode mcp list` reported `contextplus` as `connected` with command `bunx contextplus`.
    - `opencode mcp debug contextplus` confirmed it is a local server rather than an OAuth remote server.
    - A minimal `contextplus_get_context_tree` call returned the repo tree successfully, confirming the native Context+ path is serving tool calls.
  - Native function smoke-check status so far:
    - Working read-only structural tools: `contextplus_get_context_tree`, `contextplus_get_file_skeleton`, `contextplus_get_blast_radius`, `contextplus_get_feature_hub`, `contextplus_list_restore_points`.
    - `contextplus_run_static_analysis` executes but currently reports tool-level issues on this repo surface (`eslint` option mismatch and `py_compile` invoked without filenames), so it is not cleanly usable from this smoke check.
    - Embedding-backed tools are failing consistently: `contextplus_semantic_code_search`, `contextplus_semantic_identifier_search`, and `contextplus_semantic_navigate`.
    - The semantic failure mode is consistent with Context+ using its default embed model name `nomic-embed-text` instead of the configured `nomic-embed-text-v2-moe:latest`; repeated calls returned `model "nomic-embed-text" not found, try pulling it first` and one navigation call also reported `Ollama not available for embeddings: fetch failed`.
    - Local Ollama itself is available and already has `nomic-embed-text-v2-moe:latest` installed, which points to a Context+/env wiring mismatch rather than Ollama being absent.
- Misalignment record:
  - **What I did:** Converted Context+ into a `mcporter`-driven skill workflow and removed its default MCP config path.
  - **What the user instructed instead:** Move Context+ back to the default MCP path because the `mcporter` implementation is unreliable.
  - **Why my approach was incorrect or misaligned:** I optimized for architectural consistency around CLI-backed skills, but the live reliability of Context+ matters more than preserving that architecture for this capability.
  - **Early detection signal I missed:** The Context+ path is infrastructure-critical for repo discovery; reliability risk should have been treated as a stronger reason to preserve or quickly retain a default MCP fallback.
  - **Preventative rule or checklist update:** For core workflow infrastructure migrations, keep or explicitly design a rollback/fallback path for the most critical capability families before making the new route exclusive.
  - **Repo-specific nuance discovered:** Context+ is both a runtime capability and a prompt/routing assumption across repo-discovery surfaces, so reverting it likely touches config plus skill/prompt wording, not just one file.
- Additional correction after runtime testing:
  - **What I did:** Interpreted the semantic-tool failures as an Ollama/default-model issue and tested against the old Ollama assumptions.
  - **What the user instructed instead:** The native config is intentionally using the newer Gemini/OpenAI-compatible embedding provider path described in the upstream Context+ README.
  - **Why my approach was incorrect or misaligned:** I did not ground the active `opencode.json` provider settings or the current upstream README before diagnosing the semantic-path failure.
  - **Early detection signal I missed:** The live `opencode.json` already contained `CONTEXTPLUS_EMBED_PROVIDER=openai` plus Gemini-compatible environment variables, which contradicted the Ollama diagnosis immediately.
  - **Preventative rule or checklist update:** Before diagnosing Context+ runtime failures, first read the live MCP env block and match it against the current upstream README/config docs instead of assuming the default provider.
  - **Repo-specific nuance discovered:** The current repo is now using Context+'s OpenAI-compatible provider mode through Gemini (`CONTEXTPLUS_OPENAI_BASE_URL=https://generativelanguage.googleapis.com/v1beta/openai`), not the older Ollama path.
- Upstream README confirmation and retest result:
  - The current upstream README documents native OpenAI-compatible provider support, including Gemini via `CONTEXTPLUS_EMBED_PROVIDER=openai`, `CONTEXTPLUS_OPENAI_API_KEY`, `CONTEXTPLUS_OPENAI_BASE_URL=https://generativelanguage.googleapis.com/v1beta/openai`, and the documented Gemini embed model `text-embedding-004`: https://raw.githubusercontent.com/ForLoopCodes/contextplus/refs/heads/main/README.md
  - Despite the live repo config using that provider family, a clean retest of the native embedding-backed tools still fails with the old Ollama default model path:
    - `contextplus_semantic_code_search` → `model "nomic-embed-text" not found, try pulling it first`
    - `contextplus_semantic_identifier_search` → same
    - `contextplus_semantic_navigate` → same default-model failure
  - This means the currently running native Context+ path is still behaving as though it is using the default Ollama embed configuration, not the Gemini/OpenAI-compatible env block shown in the current `opencode.json`.
  - Most likely causes, in order, are:
    1. the currently running MCP server/tool session has not reloaded after the config change,
    2. the packaged `contextplus` version being executed by `bunx` does not yet honor the newer provider env documented on the upstream main-branch README,
    3. the current Gemini-specific model/env names differ from what the installed package expects.
- Released-package proof point:
  - Running `bunx contextplus init opencode` generated `/private/tmp/opencode.json` using only the older Ollama-style environment block:
    - `OLLAMA_EMBED_MODEL: "nomic-embed-text"`
    - `OLLAMA_CHAT_MODEL: "gemma2:27b"`
    - `OLLAMA_API_KEY`
    - `CONTEXTPLUS_EMBED_BATCH_SIZE`
    - `CONTEXTPLUS_EMBED_TRACKER`
  - The generated config contains no `CONTEXTPLUS_EMBED_PROVIDER` or `CONTEXTPLUS_OPENAI_*` fields.
  - This is direct evidence that the currently published CLI/package path reached through `bunx contextplus` is still Ollama-oriented and does not match the Gemini/OpenAI-compatible README on the main branch.
- Model-prefix rename result:
  - Replaced `google/gemini-3.1-pro-preview-customtools` with `google-vertex/gemini-3.1-pro-preview-customtools` in exactly three agent files: `agents/aphrodite.md`, `agents/athena.md`, and `agents/hestia.md`.
  - A repo grep after the edit showed only the `google-vertex/` form for those three agent declarations.
- Latest-release confirmation:
  - `npm view contextplus version dist-tags time --json` confirms the latest npm release is still `1.0.8` with `dist-tags.latest = 1.0.8`.
  - Re-running `bunx contextplus init opencode` still resolves the currently published release and reproduces the Ollama-only generated config, so there is no newer npm release available yet to fix this by simple upgrade.
- Post-config-update retest:
  - The live `opencode.json` now points the native MCP command at `bunx contextplus@latest`.
  - Structural access still works: `contextplus_get_context_tree` returned the repo tree successfully.
  - Semantic features still fail exactly the same way:
    - `contextplus_semantic_code_search` → `model "nomic-embed-text" not found, try pulling it first`
    - `contextplus_semantic_identifier_search` → same
    - `contextplus_semantic_navigate` → `Ollama not available for embeddings: model "nomic-embed-text" not found`
  - This confirms that changing the MCP command to `contextplus@latest` did not fix Gemini/OpenAI-provider semantic support, because `@latest` still resolves to the same published Ollama-oriented release.
- NPX retest:
  - The live `opencode.json` now points the native MCP command at `npx -y contextplus@latest`.
  - Semantic tools still fail identically:
    - `contextplus_semantic_code_search` → `model "nomic-embed-text" not found, try pulling it first`
    - `contextplus_semantic_identifier_search` → same
    - `contextplus_semantic_navigate` → `Ollama not available for embeddings: model "nomic-embed-text" not found`
  - This rules out a `bunx` vs `npx` package-runner difference as the cause of the Gemini failure in the current native setup.
- GitHub-source pin plan:
  - npm package-spec docs confirm `npx` can execute a GitHub repo pinned to a specific ref using a spec like `github:user/repo#commit`: https://docs.npmjs.com/cli/v11/using-npm/package-spec
  - Current upstream `contextplus` HEAD resolves to commit `a3c0bcc24826a1ca85d6cb636c168c47c6a9bac9` from `https://github.com/ForLoopCodes/contextplus.git`.
  - The native MCP command is now being switched to pin against that exact GitHub commit for the next semantic retest.
- GitHub source execution nuance:
  - The pinned commit's `package.json` reports `version: 1.0.9` and a `bin` entry of `contextplus -> ./build/index.js`.
  - The same `package.json` does not define a `prepare` script, while the README's source instructions explicitly require `npm install` then `npm run build`.
  - A direct `npx -y github:ForLoopCodes/contextplus#a3c0bcc24826a1ca85d6cb636c168c47c6a9bac9 init opencode` test failed with `sh: contextplus: command not found`, which is consistent with trying to execute an unbuilt git checkout.
  - Conclusion: to run the latest GitHub commit reliably, the repo needs to be cloned and built locally, then the MCP command should point at the built `build/index.js` entrypoint rather than trying to execute the raw git ref through `npx`.
- Ollama retest after the user's latest config change:
  - The live `opencode.json` has been switched back to an Ollama-style environment block, but it currently sets `OLLAMA_EMBED_MODEL` to the literal string `${OLLAMA_EMBED_MODEL:-nomic-embed-text-v2-moe:latest}`.
  - Structural access still works: `contextplus_get_context_tree` returned the repo tree successfully.
  - Embedding-backed tools still fail, but the failure mode changed from `model not found` to `invalid model name`:
    - `contextplus_semantic_code_search` → `invalid model name`
    - `contextplus_semantic_identifier_search` → `invalid model name`
    - `contextplus_semantic_navigate` → `Ollama not available for embeddings: invalid model name`
  - The `semantic_navigate` error text echoes the exact unresolved placeholder form `model ${OLLAMA_EMBED_MODEL:-nomic-embed-text-v2-moe:latest}`, which strongly suggests native OpenCode MCP config is passing that string literally rather than shell-expanding it.
  - Most likely root cause now: the MCP `environment` block in `opencode.json` does not support shell-style `${VAR:-default}` interpolation for this field, so Context+ receives an invalid literal model name instead of `nomic-embed-text-v2-moe:latest`.
- Final Ollama retest after replacing the placeholder with a literal model name:
  - The live `opencode.json` now sets `OLLAMA_EMBED_MODEL` to the literal value `nomic-embed-text-v2-moe:latest`.
  - Structural access still works: `contextplus_get_context_tree` returned the repo tree successfully.
  - Embedding-backed tools now work again under the native MCP path:
    - `contextplus_semantic_code_search` returned ranked matches, headed by `skills/repo-discovery/SKILL.md`.
    - `contextplus_semantic_identifier_search` returned ranked identifier matches in `plugins/planning-with-files/session-cache.ts`.
    - `contextplus_semantic_navigate` returned a 17-file semantic cluster instead of failing.
  - Conclusion: the Ollama-backed semantic path is now working; the blocker was the shell-style placeholder syntax in `opencode.json`, not Ollama availability or the installed model.

## Current Task (2026-04-01, oh-my-codex deep dive)

- The user wants a deep dive on local `oh-my-codex/` to identify skills, workflows, prompts, and implementation patterns worth borrowing to improve the current OpenCode setup.
- The comparison should focus on transferable workflow architecture, skill design, prompt surfaces, planning/state management, delegation/verification patterns, and other repo-level operating improvements rather than feature-by-feature product behavior.
- `oh-my-codex/` appears materially richer in explicit workflow scaffolding than our current setup: direct evidence points to 36 skills, 33 role prompts, 14 mission templates, and a durable `.omx/` state model backed by tmux/team coordination.
- Highest-signal `oh-my-codex` files from the first exploration pass are:
  - `oh-my-codex/AGENTS.md` — top-level autonomy contract, keyword-to-skill routing table, team/state model, and execution rules
  - `oh-my-codex/skills/ralph/SKILL.md` — persistence loop, architect verification, deslop/visual gates, explicit completion checklist
  - `oh-my-codex/skills/autopilot/SKILL.md` — autonomous multi-stage execution pipeline with pre-context intake and repeated QA/validation
  - `oh-my-codex/skills/deep-interview/SKILL.md` — quantitative ambiguity scoring, readiness gates, challenge modes, and explicit handoff contracts
  - `oh-my-codex/skills/ralplan/SKILL.md` — structured deliberation using principles/drivers/options plus architect→critic review and ADR output
  - `oh-my-codex/skills/team/SKILL.md` — durable tmux-based multi-worker coordination and shared state
  - `oh-my-codex/prompts/executor.md`, `prompts/architect.md`, and `prompts/planner.md` — strong evidence-backed execution, review, and planning contracts
- High-value patterns surfaced from `oh-my-codex` exploration:
  - Strong explicit autonomy and persistence contract
  - Keyword-triggered skill routing at the top-level agent surface
  - Pre-context intake gates before heavy execution/planning workflows
  - Quantitative ambiguity/readiness scoring before planning/execution
  - Structured consensus planning (`RALPLAN-DR`) rather than generic planning prose
  - Durable state beyond planning notes (`.omx/state`, `.omx/interviews`, `.omx/specs`, `.omx/plans`)
  - Explicit execution bridge contracts between interview/planning/execution/team modes
  - A more opinionated commit protocol (`Lore`) with intent + decision metadata
- Current OpenCode grounding from the comparison pass:
  - Stronger current surfaces are `agents/zeus.md`, `agents/hermes.md`, `agent-permissions.jsonc`, `plugins/planning-with-files.ts`, `rules/agent-workflow.md`, `README.md`, and core skills including `brainstorming`, `planning-with-files`, `repo-discovery`, `writing-plans`, `executing-plans`, `deep-research`, and `dispatching-parallel-agents`.
  - OpenCode is already strong on specialist delegation, skill-based permissions, CLI-first capability routing, and explicit workflow rules.
  - OpenCode appears comparatively weaker in explicit pre-execution intake, structured ambiguity scoring, durable task/state orchestration beyond `.plans/`, automated verification loops, and cross-agent coordination primitives.
- Early comparison axes to use in the next phase:
  - orchestration model
  - planning and durable state
  - skill routing and capability discovery
  - verification / quality gates
  - error recovery / persistence discipline
  - agent specialization and handoff contracts
- Second-pass architecture ranking via `@daedalus` sharpened the recommendation set:
  - Best borrow set: a lightweight pre-execution intake gate, quantitative ambiguity/readiness scoring, structured consensus planning, and stronger evidence-first verification/persistence loops around the existing Zeus-led orchestration.
  - Highest-value direct-adoption candidates are prompt/rule/workflow patterns rather than new runtime machinery.
  - Biggest non-fit is `oh-my-codex`'s tmux-heavy autonomous team runtime and distributed state model; OpenCode should preserve Zeus/Hermes ownership of planning/spec memory.
- Ranked transferable patterns from the architecture pass:
  1. Pre-context intake gate — high value, low effort, low blast radius, directly adoptable.
  2. Quantitative ambiguity/readiness scoring — high value, medium effort, low blast radius, adapt into Zeus/brainstorming.
  3. Structured consensus planning (`Principles / Decision Drivers / Viable Options / ADR`) — high value, medium effort, medium blast radius, adapt into Zeus-owned planning.
  4. Stronger verification loop / explicit “no evidence = not done” language — high value, low effort, low blast radius, directly adoptable.
  5. Explicit execution-bridge contracts between interview → plan → execute — medium-high value, medium effort, medium blast radius, adapt into existing handoff package.
  6. Richer durable state beyond freeform notes — medium value, medium effort, medium blast radius, adapt carefully into `.plans/` rather than creating a second state universe.
  7. Keyword-triggered workflow routing — medium value, low effort, medium blast radius, adopt lightly as routing hints.
  8. Lore commit protocol — medium value, low effort, low blast radius, directly adoptable as an optional convention.
  9. Ralph-style persistent autonomous retry loops — medium value, medium-high effort, high blast radius, partial adaptation only.
  10. Tmux team runtime — low-medium value here, high effort, high blast radius, defer as a current non-fit.
- Direct-adoption candidates for OpenCode:
  - Intake snapshot fields before heavy planning/execution.
  - Stronger evidence-first completion language in orchestrator/rules.
  - Optional Lore-style commit metadata guidance.
  - Advisory keyword-triggered skill-routing hints at the top-level orchestration surface.
- Adaptation-required candidates:
  - Ambiguity scoring should become a light rubric inside Zeus/`brainstorming`, not a universal mandatory interview ritual.
  - RALPLAN-DR should become a structured planning/ADR format inside Zeus-owned specs/plans.
  - Execution bridges should become stricter expectations inside the current six-section delegation package.
  - Durable state improvements should extend `.plans/` or adjacent Zeus-owned artifacts, not create a parallel `.omx`-style runtime.
  - Ralph-style persistence should inform retry/verification policy without importing full autonomous mode.
- Recommended sequence from the architecture pass:
  1. Add a lightweight intake snapshot + readiness rubric to Zeus and/or `brainstorming`.
  2. Add RALPLAN-style structured planning output to Zeus-owned planning artifacts.
  3. Tighten verification/persistence wording in rules and completion contracts.
  4. Pilot optional Lore commit metadata.
  5. Re-evaluate later whether richer durable state is still needed beyond `.plans/`.
- The first implementation pass for the borrow-set is now on disk in the approved three-file scope only:
  - `rules/agent-workflow.md` now includes repo-wide rules for `Pre-Execution Intake`, `Stage-To-Stage Continuity`, and `Evidence-First Completion`, with headings renumbered sequentially.
  - `agents/zeus.md` now includes an `Intake Snapshot` checkpoint after intent classification, tighter delegation-package expectations around assumed inputs / expected outputs / evidence / residual risk, and harder verification/completion language (`no evidence means not done`, vague summaries are not completion, material unresolved follow-up keeps the task open).
  - `skills/brainstorming/SKILL.md` now includes a lightweight readiness pass, structured design-output guidance (`Principles`, `Decision Drivers`, `Viable Options`, `Recommendation`), and anti-ceremony guardrails that keep the process proportional for simple work.
- Review outcome:
  - `@themis` approved the overall scope alignment and found no drift into `.omx`-style state, tmux/team-runtime ideas, autonomy expansion, or planning-ownership transfer.
  - The first review flagged one issue: `skills/brainstorming/SKILL.md` still felt too ceremonial. A follow-up correction softened that wording, made written spec / commit language conditional, and re-established the readiness pass as the authority on whether more clarification is needed.
- Final verification result:
  - Zeus directly re-read all three edited files after implementation.
  - The resulting state matches the approved scope: stronger intake, continuity, and evidence discipline without introducing heavier runtime machinery.

## Current Task (2026-04-01, planning workflow alignment)

- The next approved follow-up is a bounded pass covering both the planning plugin and the planning-file templates together.
- Exact in-scope files are:
  - `plugins/planning-with-files.ts`
  - `skills/planning-with-files/templates/task_plan.md`
  - `skills/planning-with-files/templates/findings.md`
  - `skills/planning-with-files/templates/progress.md`
- Approved goals for this pass:
  - align plugin nudges with the newer intake / continuity / evidence-first workflow
  - make the templates produce artifacts that match those nudges
  - improve consistency without adding a second planning system or heavy ceremony
- Explicit non-goals the user approved:
  - no `.omx`-style state model
  - no tmux/team runtime ideas
  - no new persistent planning runtime beyond the current `.plans/` ownership model
  - no plugin-owned planning decisions
- Current plugin behavior from direct read of `plugins/planning-with-files.ts`:
  - planning owners (`zeus` / `hermes`) get stronger planning context injection and status reminders
  - subagents get read-only planning nudges
  - `tool.execute.before` caches the plan head for the allowed tool set and blocks non-owners from editing the planning trio
  - `tool.execute.after` appends the cached plan head and emits reminder blocks for task results and write/edit actions
  - the plugin currently focuses on plan-head injection, simple reminders, and status output rather than a richer intake/result shape
- Current template behavior from direct reads:
  - `task_plan.md` is phase-oriented but still generic; it lacks an explicit intake snapshot and does not strongly capture evidence/open-risk criteria at phase close
  - `findings.md` stores requirements, findings, decisions, issues, resources, and visual/browser notes, but it does not yet shape findings around source / confidence / relevance / decision impact
  - `progress.md` captures phases, tests, errors, and reboot status, but it does not yet standardize each execution step around action / result / verification / next step
- Approved design direction from the user conversation:
  - plugin should nudge a lightweight intake snapshot for complex work: intended outcome, known facts, unknowns/blockers, non-goals, decision boundaries, readiness
  - plugin should also nudge stronger phase-close hygiene: what changed, what was verified, and what remains open
  - template changes should mirror that shape so runtime nudges and durable artifacts stay aligned
  - wording should stay advisory where appropriate and preserve Zeus/Hermes-only planning ownership
- Validation requirements for this pass:
  - direct read-back of `plugins/planning-with-files.ts`
  - direct read-back of all three planning templates
  - confirm the pass remains ownership-safe and does not introduce a second planning system
- Implementation result for this pass:
  - `plugins/planning-with-files.ts` now nudges a lightweight intake snapshot for complex work (`intended outcome`, `known facts`, `unknowns or blockers`, `non-goals`, `decision boundaries`, `readiness`) and stronger closeout continuity (`what changed`, `what was verified`, `what remains open`) for both planning owners and read-only sessions in an ownership-safe way.
  - `skills/planning-with-files/templates/task_plan.md` now includes a dedicated `## Intake` section after `## Goal` and stronger phase-close guidance around evidence, open questions, and open risks.
  - `skills/planning-with-files/templates/findings.md` now prompts for source, confidence, relevance, and decision impact without turning the file into a rigid schema.
  - `skills/planning-with-files/templates/progress.md` now uses a clearer action / result / verification / next-step update structure plus a short handoff block for resumability.
- Verification and review outcome:
  - Zeus directly re-read all four edited files and confirmed the new intake/evidence-first shape is on disk.
  - `@themis` reviewed the result against `.plans/specs/2026-04-01-planning-workflow-alignment-design.md` and `.plans/2026-04-01-planning-workflow-alignment-plan.md` and found no critical or important deviations.
  - No drift was introduced toward `.omx`-style state, tmux/team coordination, plugin-owned planning decisions, or a second planning system.
  - One watch item from review: the plugin may become slightly repetitive because closeout reminders can appear both after tool flows and after appended status output, but this is acceptable for now and can be trimmed later if prompt noise becomes noticeable.

## Current Task (2026-04-01, planning reminder noise reduction)

- The user chose the follow-up option to reduce reminder repetition rather than commit or diff review.
- Scope is intentionally narrow: `plugins/planning-with-files.ts` only.
- Approved non-goals:
  - no template changes
  - no `.plans/` changes as part of implementation behavior
  - no ownership-model changes
  - no new state, persistence, or planning machinery
- Grounded current behavior from direct read of `plugins/planning-with-files.ts`:
  - `ownerCloseoutReminderBlock()` is appended in `experimental.chat.system.transform` for planning-skill sessions
  - `ownerCloseoutReminderBlock()` or `readOnlyContinuityReminderBlock()` is appended again after eligible `TASK_TOOL` and `REMINDER_TOOLS` flows in `tool.execute.after`
  - `maybeAppendStatus()` appends `statusOutputBlock(status)` and then appends `ownerCloseoutReminderBlock()` again
  - this creates the review-noted possibility that the same closeout guidance appears twice in one overall flow
- Approved design direction:
  - keep the broad prompt-noise pass bounded to this plugin only
  - preserve intake reminder, task-result reminder concepts, status output, self-loop breaker, and Zeus/Hermes-only planning ownership
  - use a small local dedupe guard so only one closeout/continuity reminder appears per eligible tool flow
  - reduce noise without changing the underlying planning workflow model
- Validation requirements:
  - direct read-back of `plugins/planning-with-files.ts`
  - confirm one continuity/closeout reminder per eligible tool flow
  - confirm task-result and status behavior still exist
  - confirm no template or planning-memory files are part of the implementation change
- Implementation result:
  - `plugins/planning-with-files.ts` now uses a flow-local `hasFlowReminder` guard in `tool.execute.after`.
  - Reminder append sites for eligible task/write-edit flows now route through a local helper so owner closeout or read-only continuity text is emitted at most once per eligible flow.
  - `maybeAppendStatus()` still appends `statusOutputBlock(status)` for owners, but now skips re-appending `ownerCloseoutReminderBlock()` when that same flow already emitted a closeout reminder earlier.
  - Intake reminders, task-result reminders, status output, the planning-file self-loop breaker, and Zeus/Hermes-only planning-file edit protection all remain intact.
- Verification and review outcome:
  - Zeus directly re-read `plugins/planning-with-files.ts` and confirmed the dedupe path is on disk: `hasFlowReminder`, `appendFlowReminder()`, guarded reminder append sites, and status-path skip when already reminded in the same flow.
  - `@themis` reviewed the result against `.plans/specs/2026-04-01-planning-reminder-noise-reduction-design.md` and `.plans/2026-04-01-planning-reminder-noise-reduction-plan.md` and found no critical or important deviations.
  - The pass stayed plugin-only as approved; no template or `.plans` file was changed as part of the implementation surface.
  - One environment-level limitation remains: a targeted TypeScript check still runs into pre-existing repo/environment issues and does not isolate this plugin edit cleanly.

## Current Follow-Up (2026-03-31, README agent docs refresh)

- The user wants `README.md` updated so it properly documents the custom agents/subagents and includes a Mermaid diagram for the current Zeus orchestrator workflow.
- The relevant grounding for this pass is concentrated in `README.md` plus the current agent definitions in `agents/zeus.md`, `agents/hermes.md`, `agents/artemis.md`, `agents/hephaestus.md`, `agents/athena.md`, `agents/apollo.md`, `agents/aphrodite.md`, `agents/hestia.md`, `agents/themis.md`, and `agents/cronus.md`.
- Current repo reality is: `hermes` and `zeus` are the two primary agents, while the rest of the custom roster are hidden specialist subagents with clear role boundaries.
- The Zeus workflow that should be diagrammed is phase-driven: intent classification, optional exploration/research delegation, Zeus-owned design/planning when needed, wave-based specialist execution, Zeus verification, optional Apollo escalation / Themis review, then completion.

## Current Task (2026-03-31, MCP-to-CLI port)

- The user wants the current OpenCode workflow moved away from MCPs toward a CLI + skills model and explicitly pointed to `https://github.com/steipete/mcporter` as the enabling reference.
- Because this is both a research task and a behavior-change task, the correct sequence is: inspect current MCP usage, research `mcporter`, present migration options, get approval, then port.
- Early local scan shows MCPs are not isolated to `opencode.json`; they are also embedded in capability policy (`agent-permissions.jsonc`, `plugins/agent-permissions.ts`), install/bootstrap messaging (`install.sh`, `README.md`), and skill guidance.
- Current configured MCP families in `opencode.json`: `agentation`, `context7`, `exa`, and `contextplus`.
- The permissions plugin derives allowed MCP families from `opencode.json` and blocks tool usage by MCP family prefix, so a real port likely requires a new capability/governance model for CLI-backed equivalents rather than a simple config deletion.
- Initial design question to resolve: should this pass fully remove MCP config from the repo now, or port the subset that has a clean CLI + skills replacement first and leave any non-portable pieces explicit?
- Migration scope is now explicit: the user wants full MCP removal in this pass, not a staged first wave.
- Additional blast-radius scan confirms the highest-value prompt/documentation surfaces for the port are `CONTEXTPLUS.md`, `README.md`, `agents/explorer.md`, `agents/librarian.md`, `agents/cursor.md`, `skills/agentation/SKILL.md`, and `skills/agentation-self-driving/SKILL.md`.
- The semantic scan reinforces that MCP coupling is concentrated in prompt/docs expectations, not only config. That means the clean design should pair CLI entrypoints with prompt rewrites instead of trying to preserve MCP-shaped behavior behind the scenes.
- A repo grep using a pipe-separated include filter returned no results because the include pattern was malformed, so direct file reads and semantic hits remain the reliable path for the remaining design pass.
- `CONTEXTPLUS.md` is fully MCP-shaped today: the title, environment description, runtime cache notes, and tool reference all assume a live `contextplus_*` tool family and even mandate a write path that only exists in that tooling.
- `agents/explorer.md` and `agents/librarian.md` currently encode MCP-backed discovery as their primary contract: explorer says `contextplus_*` is primary local tooling, while librarian prefers `context7_*` and `exa_*` plus optional local `contextplus_*` for repo matching.
- `agents/cursor.md` also hardcodes the same MCP-backed assumption at the primary-agent level by directly instructing use of `contextplus` and Exa tool families.
- `skills/agentation/SKILL.md` is mixed: the toolbar install portion is still valid, but the last step explicitly recommends MCP setup and names MCP-only tools. `skills/agentation-self-driving/SKILL.md` is mostly already CLI-oriented because it drives `agent-browser`, but its two-session section still assumes a live annotation MCP connection and `agentation_watch_annotations` loop.
- `plugins/agent-permissions/filesystem.ts` and `plugins/agent-permissions/tooling.ts` confirm the current governance model is literally keyed on discovered MCP family names from `opencode.json`, so full removal needs either deletion of MCP enforcement or replacement with a CLI-capability policy that no longer inspects `.mcp`.

## Emerging CLI-First Design Direction (2026-03-31)

- The cleanest end state appears to be: keep skills as the behavior-routing layer, introduce explicit CLI entrypoints/config for external capabilities, remove `.mcp` from `opencode.json`, and rewrite prompts so they describe when to use each CLI-backed pathway rather than naming MCP tool families.
- `mcporter` fits best as a migration/runtime bridge, not as a hidden way to preserve `.mcp` forever. The repo should likely own a new CLI-oriented config surface and optionally use `mcporter` under the hood to generate or run wrappers for servers that still originate from MCP ecosystems.
- The biggest architectural choice now is whether to standardize on: (1) direct `mcporter call/list` commands, (2) generated dedicated wrapper CLIs per capability family, or (3) a thin local command layer that normalizes both direct CLIs and mcporter-backed wrappers behind stable repo-owned command names.
- Current evidence favors option 3 because it gives the repo stable, human-readable commands for prompts/skills, keeps `mcporter` replaceable, and avoids forcing agents to remember raw server/tool tuples everywhere.

## User Design Direction Update (2026-03-31)

- The user proposed a stronger skill-centric model: convert each current MCP capability family into a corresponding skill, and put the `mcporter` calling instructions plus family-specific operating guidance inside that skill.
- This aligns well with the repo's desired end state. Skills can become the stable discovery/behavior layer, while `mcporter` becomes an implementation detail described inside each skill rather than a top-level workflow concept.
- Best refinement: do not make one skill per raw MCP tool. Make one skill per capability surface or workflow family (for example semantic repo discovery, external docs research, web/browser annotation sync) so the skills stay usable and do not explode into dozens of tiny wrappers.
- Under that model, agent prompts should mainly say: load the appropriate skill for that job. The skill itself can define the exact CLI commands, arguments, safety rules, and any family-specific heuristics.
- This likely improves the permissions story too: the repo can govern allowed skills, while shell/CLI execution remains the mechanism used inside the approved skill workflow.
- The user chose a hybrid granularity: family-level skills by default, plus narrower workflow-specific skills where the behavior is materially different.
- This supports keeping broad skills for repo discovery and external research while allowing more specialized skills for cases like annotation-sync or self-driving design review.
- The user approved the core architecture direction: skills as the stable interface, CLI/`mcporter` hidden behind skill instructions, and hybrid skill granularity.
- The user also approved the proposed capability map: broad skills for repo discovery and docs research, plus narrower skills for annotation-sync, self-driving review, and Agentation setup.
- The user approved the runtime direction too: skills as the public interface, stable repo-owned CLI workflows underneath, `mcporter` as an implementation detail, and permission/governance moving away from MCP-family discovery.
- The written implementation plan lives at `.plans/2026-03-31-mcp-cli-skills-plan.md` and follows the approved sequence: move server definitions to `config/mcporter.json`, remove MCP-family permission logic, add the new skills, rewrite prompts/docs, update annotation-related skills, then rework bootstrap and verification.
- Execution review surfaced one operational blocker before implementation: the repo is currently on `main`, and the execution skill explicitly says not to start implementation on `main/master` without explicit user consent.
- The plan also includes commit steps because of the generic planning template, but repo policy still forbids creating commits unless the user explicitly asks. Implementation can proceed without commits once branch consent is clarified.
- `git status` also shows a pre-existing deletion of `scratch.sh`; that file should be treated as unrelated local state unless later evidence shows it is part of this migration.
- The user explicitly approved proceeding on `main`, so branch choice is no longer a blocker.
- During implementation I chose the simplest correct variant of the approved design: keep `mcporter` command recipes inside skills rather than adding a separate wrapper-script layer in this pass. This still satisfies the user-approved skill-centric architecture and avoids unnecessary new moving parts.
- The first implementation wave is now on disk: server definitions moved into `config/mcporter.json`, `.mcp` was removed from `opencode.json`, the permissions config/plugin were simplified to skill-only governance, and the debug command now reports skills plus CLI-config presence instead of MCP-family discovery.
- The second implementation wave is also on disk: new `repo-discovery`, `docs-research`, and `annotation-sync` skills now document concrete `mcporter` command patterns; `CONTEXTPLUS.md`, `agents/explorer.md`, `agents/librarian.md`, and `agents/cursor.md` were rewritten around skill routing; Agentation setup/self-driving docs now point to the new skill split; and installer/readme guidance now describe `config/mcporter.json` plus CLI workflow bootstrap.
- To keep the migration small, existing public skill names `agentation` and `agentation-self-driving` were preserved rather than renamed to `agentation-setup` and `self-driving-review`.
- Verification uncovered additional prompt/reference leftovers in `agents/orchestrator.md`, `agents/fixer.md`, `agents/oracle.md`, `agents/refactor-cleaner.md`, `agents/code-reviewer.md`, and `skills/agentation-self-driving/references/two-session-workflow.md`. Those were rewritten to the repo-discovery / docs-research / annotation-sync language so the active prompt surface is now aligned with the new model.
- Final verification results for the port: targeted grep over active repo surfaces found no remaining `.mcp`, `contextplus_*`, `context7_*`, `exa_*`, or annotation MCP-command instruction remnants outside planning/history files; `bash -n install.sh` passed; and the refactored permissions modules still import cleanly via Bun.
- `git status --short` confirms the new deliverables are present as untracked additions (`config/mcporter.json`, the three new skill directories, and the design/plan artifacts). The deletion of `scratch.sh` remains pre-existing unrelated workspace state and was not touched by this migration.
- Follow-up cleanup is now approved: delete `CONTEXTPLUS.md`, make `skills/repo-discovery/SKILL.md` the single source of repo-discovery guidance, and remove agent references to `@~/.config/opencode/CONTEXTPLUS.md`.
- The user also approved flattening the CLI config path from `config/mcporter.json` to repo-root `mcporter.json`; README, installer, debug docs, skill examples, and any annotation/reference docs should all point to `~/.config/opencode/mcporter.json` after this pass.
- Fresh grep confirms the remaining active follow-up surface is concentrated in agent prompts (`explorer`, `librarian`, `doc-updater`, `fixer`, `oracle`, `refactor-cleaner`, `code-reviewer`, `orchestrator`, `cursor`), `README.md`, `commands/agent-permissions-debug.md`, the three new skills, `skills/agentation-self-driving/references/two-session-workflow.md`, and the soon-to-be-deleted `CONTEXTPLUS.md` file itself.
- The follow-up cleanup is now on disk: `mcporter.json` lives at repo root, `config/mcporter.json` is gone, `CONTEXTPLUS.md` has been deleted, and the remaining agent/docs surfaces now point directly to `repo-discovery` instead of an external repo-discovery markdown file.
- `skills/repo-discovery/SKILL.md` is now the single authoritative repo-discovery guide. It covers when to use the skill, broad-to-narrow semantic search strategy, required confirmation after semantic hits, blast-radius rules, practical defaults, anti-patterns, and concrete `mcporter` command patterns.
- Installer/manual-install/docs surfaces were flattened to match the new root config path: `install.sh` now symlinks `mcporter.json` as a top-level file, `README.md` documents `~/.config/opencode/mcporter.json`, and the permission-debug command now reports whether root `mcporter.json` exists.
- Verification after the cleanup pass succeeded: `bash -n install.sh` passed, the permissions plugin modules still import cleanly via Bun, active agent surfaces contain no remaining `@~/.config/opencode/CONTEXTPLUS.md` references, and `config/mcporter.json` / `CONTEXTPLUS.md` hits now remain only in planning/history artifacts plus cache data.

## Current Follow-Up (2026-03-31, mcporter skill)

- The user now wants a dedicated `mcporter` skill added with the provided quick-start/reference content and wants that skill enabled for all agents.
- Current repo state already uses `mcporter` as the execution detail inside capability skills like `repo-discovery`, `docs-research`, and `annotation-sync`.
- The main design choice is whether the new `mcporter` skill should be a universal meta-skill/reference that complements those capability skills, or whether agent prompts should start preferring `mcporter` directly in places where domain skills are currently the stable interface.
- Existing agent permissions already grant wildcard skill access to broad agents (`orchestrator`, `cursor`, `build`, `general`, `plan`), while narrower agents use explicit allowlists. Enabling `mcporter` for all agents therefore means touching `agent-permissions.jsonc` for all constrained agents.
- The user chose the peer-skill model: `mcporter` should be first-class and directly usable alongside the capability skills, not just a fallback and not a replacement for them.
- The new `skills/mcporter/SKILL.md` is now on disk. It covers quick start, direct tool calls, auth/config commands, daemon control, and codegen, while explicitly telling agents when to prefer domain skills instead.
- `agent-permissions.jsonc` now enables `mcporter` for every constrained agent, so all agents can load it either through wildcard access or explicit allowlisting.
- The new skill resolves the config-path nuance explicitly: upstream may default to `./config/mcporter.json`, but this repo should prefer `--config ~/.config/opencode/mcporter.json`.

## Current Follow-Up (2026-03-31, installer symlink repair)

- The user now wants `install.sh` updated to fix broken symlinks, add any newly required symlinks, and continue installing `mcporter`.
- Current installer state confirms `mcporter@latest` is already included in `install_cli_workflow_deps()`, so the install requirement is satisfied in principle but should be preserved explicitly during the edit.
- The active symlink bug is real: `opencode.json` loads instructions from `~/.config/opencode/rules/*.md`, but `install.sh` does not currently link the repo's `rules/` directory into `~/.config/opencode`.
- There is also a likely missing top-level config symlink for `tui.json`; the file exists at repo root and belongs with the other top-level config surfaces, but `install.sh` does not currently link it.
- The smallest correct fix is likely to update the installer manifest and README manual-install examples together, not redesign the installer.
- The installer repair is now on disk: `install.sh` links `tui.json` as a top-level file, links `rules/` as a runtime directory, and still installs `mcporter@latest` through `install_cli_workflow_deps()`.
- `README.md` manual install and inventory sections were aligned with the installer so the documented symlink set now includes both `tui.json` and `rules/`.
- Verification for the installer follow-up succeeded: `bash -n install.sh` passed, the README now contains the new `tui.json` and `rules/` manual-install lines, and no additional installer redesign was required.

## Current Follow-Up (2026-03-31, agent mythology rename)

- The user now wants every agent in `agents/` reviewed and renamed to role-fitting Greek/Roman mythology names, with all live references updated consistently.
- The active `agents/` surface is: `code-reviewer`, `cursor`, `designer`, `doc-updater`, `explorer`, `fixer`, `librarian`, `oracle`, `orchestrator`, and `refactor-cleaner`.
- This is a behavior and naming-surface change, not a trivial file rename. It likely affects filenames, agent-loading references, prompt prose, and any docs or config that refer to the current agent names.
- The user chose an all-Roman naming style.
- A later follow-up asked for Greek-name alternatives and explicitly requested Exa-backed research for stronger mythology-role matching.
- Exa search is currently rate-limited in this environment; further Exa-backed naming research will require configuring a personal Exa API key in the MCP URL.
- The user then explicitly redirected the research to the provided `websearch` tool instead of Exa.
- A first `websearch` attempt failed because this environment's search tool only accepts `type: auto | fast`, not `deep`; retry with a valid enum.
- Retrying with a valid `websearch` shape still hit the same Exa-backed free-tier rate limit, so live web-backed mythology lookup is currently blocked until an Exa API key is configured.
- Early role reads confirm the current roster maps cleanly to mythology-style roles: orchestration controller, repo navigator, implementation specialist, external research specialist, strategic advisor, design specialist, documentation specialist, review specialist, cleanup/refactor specialist, and the primary pair-programming agent.
- A repo grep using a pipe-separated `include` pattern returned no hits because the include filter format was invalid for this search; direct reads plus a corrected reference sweep should be treated as the reliable path for the remaining blast-radius pass.
- The user approved the Greek set for implementation. The chosen mapping is: `orchestrator→zeus`, `cursor→hermes`, `explorer→artemis`, `fixer→hephaestus`, `librarian→athena`, `oracle→apollo`, `designer→aphrodite`, `doc-updater→hestia`, `code-reviewer→themis`, `refactor-cleaner→cronus`.
- The first rename wave is now on disk: all ten agent files were renamed, their frontmatter `name` fields were updated, command frontmatter references were updated, `agent-permissions.jsonc` agent keys were updated, `opencode.json` agent color entries were renamed to `zeus` and `hermes`, and the planning plugin's primary-agent constants/messages were updated to the new names.
- A second cleanup wave removed remaining live `orchestrator` phrasing from the renamed agent prompts where it still referred to the agent identity rather than the generic orchestration role (for example `orchestrator-specified` and `orchestrator-owned` became `Zeus-specified` / `Zeus-owned`).
- `planner`, `build`, `general`, and `plan` were intentionally left unchanged because the user asked to rename the agents present in `agents/`, and those names are config-only identities outside the active agent file roster.
- Verification for the rename pass succeeded on the active runtime surface: all files in `agents/` now use the Greek names, command/config/plugin references now point to the Greek identities, and no stale old agent-name references remain in active command/config/plugin/README surfaces. Remaining grep hits in `agents/` are only generic role words like `orchestrator` in descriptions or normal English `cursor` usage, not stale agent identifiers.

## Current Follow-Up (2026-03-31, deep-research skill)

- The user now wants a first-class `deep-research` skill added to this repo, but adapted to the local CLI-first workflow rather than raw MCP usage.
- The provided draft assumes raw Firecrawl and Exa MCP tools. In this repo, the correct equivalent is to route through `mcporter` config and commands, with built-in `websearch` / `webfetch` as fallback when the CLI-backed providers are unavailable.
- The user specifically called out Zeus, Apollo, Athena, and Hermes as the most important agents for this skill.
- Current relevant repo state:
  - `skills/mcporter/SKILL.md` already exists as a general peer skill for direct `mcporter` usage.
  - `skills/docs-research/SKILL.md` currently covers official docs, API examples, and targeted external research through Context7 + Exa via `mcporter`.
  - `mcporter.json` currently defines `agentation`, `context7`, `exa`, and `contextplus`, but not `firecrawl`.
  - `opencode.json` already allows built-in `websearch`, so fallback research via native search/fetch is feasible in this harness.
- The Firecrawl self-host doc indicates the simplest local bootstrap path is Docker-based: create a repo-local `.env`, set `PORT`, `HOST`, `USE_DB_AUTHENTICATION=false`, and a non-default `BULL_AUTH_KEY`, then run `docker compose build` and `docker compose up`, with the API defaulting to `http://localhost:3002`.
- The design choice that still needs approval is whether Firecrawl should be handled in this pass as:
  1. skill-only + fallback-ready, no installer bootstrap yet,
  2. full skill + `mcporter.json` + installer-managed self-host bootstrap, or
  3. staged support where the skill lands now and installer bootstrap follows after the workflow proves useful.
- The user approved the full bootstrap variant with one refinement: bootstrap Firecrawl automatically by default when Docker + `docker compose` are available, but do not try to install Docker. If Docker is missing, skip Firecrawl bootstrap or allow the installer option to disable it explicitly.
- New implementation is now on disk:
  - `skills/deep-research/SKILL.md` defines a CLI-first multi-source research workflow using Firecrawl via `mcporter`, Exa via `mcporter`, and fallback to built-in `websearch` / `webfetch`.
  - `mcporter.json` now includes a `firecrawl` server entry using `firecrawl-mcp` with `FIRECRAWL_API_URL` defaulting to `http://localhost:3002`.
  - `agent-permissions.jsonc` now explicitly allows `deep-research` for Athena and Apollo; Zeus and Hermes already inherit it through wildcard skill access.
  - Zeus, Apollo, Athena, and Hermes prompts now mention `deep-research` where broad external synthesis is appropriate.
  - `skills/docs-research/SKILL.md` now routes broader multi-source work to `deep-research`, and `skills/mcporter/SKILL.md` recognizes `deep-research` as a peer workflow.
  - `install.sh` now installs `firecrawl-mcp@latest`, can clone Firecrawl into `OPENCODE_FIRECRAWL_DIR` (default `$HOME/firecrawl`), creates a minimal `.env` if missing, and runs `docker compose build` plus `docker compose up -d` by default when Docker is available.
  - Firecrawl bootstrap is configurable with `OPENCODE_INSTALL_FIRECRAWL=0` and `OPENCODE_FIRECRAWL_DIR`; missing Docker now causes a warning and a safe skip rather than a hard failure.
  - `README.md` now documents the new skill, the default Firecrawl bootstrap behavior, the opt-out/install variables, and the manual Docker-based Firecrawl setup.
- Research grounding used for the implementation:
  - Firecrawl self-host docs show the local service defaults to `http://localhost:3002` via Docker Compose with a minimal `.env` (`PORT`, `HOST`, `USE_DB_AUTHENTICATION=false`, `BULL_AUTH_KEY`).
  - Firecrawl MCP server docs confirm `firecrawl-mcp` supports self-hosted usage via `FIRECRAWL_API_URL`, so the repo can stay CLI-first while targeting the local Firecrawl instance.

## Current Follow-Up (2026-03-31, local Firecrawl bootstrap test)

- The active Firecrawl `mcporter` config lives at `~/.config/opencode/mcporter.json` in the `mcpServers.firecrawl` entry.
- That config currently points `FIRECRAWL_API_URL` at `http://localhost:3002` by default and runs Firecrawl through `bunx firecrawl-mcp`.
- The installer already contains a dedicated Firecrawl bootstrap path in `install.sh`: it installs `firecrawl-mcp@latest`, defaults the local checkout to `$HOME/firecrawl`, creates a minimal `.env`, and starts Docker Compose when Docker is available.
- Current environment check confirms Docker and `docker compose` are installed and available locally, so a real local Firecrawl bootstrap test should be possible from this machine.
- A direct `bunx mcporter list firecrawl --config ~/.config/opencode/mcporter.json --output json` call already succeeds, confirming the Firecrawl MCP server definition is valid and exposes Firecrawl tools through `mcporter`.
- There was no pre-existing local checkout at `$HOME/firecrawl`, so the local test bootstrap now uses a fresh clone there.
- The local Firecrawl checkout now has a minimal `.env` with `PORT=3002`, `HOST=0.0.0.0`, `USE_DB_AUTHENTICATION=false`, and a local `BULL_AUTH_KEY`, matching the intended self-host shape in this repo.
- The user redirected the setup approach again: instead of generating the default Firecrawl `.env` only in `$HOME/firecrawl`, they want the default env stored in this repo itself and then loaded/copied during bootstrap so new-machine setup is easier and more reproducible.
- Smallest correct next design likely introduces a repo-owned Firecrawl env template (for example under a focused path like `firecrawl/` or similar), updates `install.sh` to copy it into `$HOME/firecrawl/.env` when missing, and documents which values remain machine-specific overrides.
- That repo-owned bootstrap shape is now on disk: `firecrawl/.env.default` is the committed default, `install.sh` copies it into `$HOME/firecrawl/.env` when missing, and `README.md` now documents that template-driven bootstrap path for both installer and manual setup.
- Verification after the change succeeded: `bash -n install.sh` passed, the repo template file exists at `firecrawl/.env.default`, README references were updated, and the current local `$HOME/firecrawl/.env` matches the repo-owned template.
- The local Firecrawl stack is currently up through Docker Compose, with the main API exposed on `http://localhost:3002` and the supporting containers (`redis`, `rabbitmq`, `playwright-service`, `nuq-postgres`) running.
- The user now wants more than a minimal template: they want the full Firecrawl env stored in-repo so the project can control more self-host settings intentionally.
- Local grounding for that request: upstream Firecrawl already ships a full self-host env example at `~/firecrawl/apps/api/.env.example` with required runtime settings plus many optional knobs (Redis, Playwright, concurrency, Supabase, proxy, logging, x402, webhook, and provider keys).
- This means the main design choice is not whether a full template is possible, but how much of that upstream example should be committed as-is versus curated for this repo's default local setup.
- The user added a new preference before implementation: for AI-related Firecrawl settings, prefer local Ollama-backed wiring because Context+ already assumes Ollama is installed in this environment.
- The user also added a final acceptance criterion: once the fuller Firecrawl env/bootstrap changes are done, run a real smoke test by calling Firecrawl through `mcporter` from this OpenCode workflow and confirm whether it works.
- The smallest correct next pass is now a curated full Firecrawl template rather than a verbatim upstream dump: keep Docker-local URLs and sane defaults, add the important tuning knobs and optional placeholders, bias AI-related settings toward local Ollama where Firecrawl supports them, then verify with a real `mcporter` call.
- Additional grounding confirms Firecrawl supports local-Ollama-aware AI wiring directly: upstream Docker Compose and config surfaces include `OPENAI_BASE_URL`, `OPENAI_API_KEY`, and `OLLAMA_BASE_URL`, and the API code prefers Ollama when `OLLAMA_BASE_URL` is set.
- The current repo surfaces that need updating for this pass are `firecrawl/.env.default`, `install.sh` fallback env creation, and `README.md` bootstrap/setup text. The final verification should include an actual `bunx mcporter call firecrawl... --config ~/.config/opencode/mcporter.json --output json` run against the live local service.
- The curated fuller Firecrawl template is now on disk. It keeps the required Docker-local URLs, adds the main concurrency/logging knobs, includes optional integration placeholders, and sets `OLLAMA_BASE_URL=http://host.docker.internal:11434/api` as the default AI path.
- `install.sh` fallback env generation now mirrors the fuller repo template closely enough that bootstrap still produces a useful `.env` even if the repo template is missing.
- `README.md` now explains that the repo-owned Firecrawl template is fuller and Ollama-first rather than only a minimal bootstrap stub.
- Smoke test succeeded through the real OpenCode CLI workflow: `bunx mcporter call 'firecrawl.firecrawl_scrape(url: "https://example.com", formats: ["markdown"], onlyMainContent: true)' --config ~/.config/opencode/mcporter.json --output json` returned a 200 response plus scraped markdown content, which confirms the local Firecrawl service and `mcporter` wiring are functioning end to end.
- The repo-owned `firecrawl/.env.default` has already been updated by the user to a fuller upstream-shaped template. It now includes commented Ollama settings (`OLLAMA_BASE_URL`, `MODEL_NAME`, `MODEL_EMBEDDING_NAME`) instead of the earlier minimal bootstrap shape.
- The live local runtime env at `~/firecrawl/.env` is still the older 4-line minimal file, so honoring the user's latest instruction means any next edit should touch only the Ollama-related lines and should avoid reformatting or rewriting unrelated env content.
- Upstream Firecrawl docs still show the Ollama example as `OLLAMA_BASE_URL=http://localhost:11434/api`, `MODEL_NAME=deepseek-r1:7b`, and `MODEL_EMBEDDING_NAME=nomic-embed-text`.
- Upstream Firecrawl code/config confirms three important facts for the next pass: `OLLAMA_BASE_URL` is the provider switch, `MODEL_NAME` and `MODEL_EMBEDDING_NAME` are real supported envs, and the API prefers Ollama when `OLLAMA_BASE_URL` is set.
- A live GitHub issue from 2025 (`firecrawl/firecrawl#1467`) shows at least one self-hosted Ollama user running `MODEL_NAME=deepseek-r1:8b` with `MODEL_EMBEDDING_NAME=nomic-embed-text`, but it also shows self-hosted extract issues unrelated to connectivity, so the safest default should favor compatibility over largest-possible reasoning models.
- This suggests the best next design is a minimal-delta patch: fix Linux Ollama base URL behavior at runtime/bootstrap time, then set conservative Firecrawl Ollama defaults on the env lines only, likely keeping `nomic-embed-text` for embeddings and preferring a smaller broadly-available chat model over an aggressive reasoning-heavy default.

## User Correction (2026-03-31, Firecrawl localhost vs Ollama routing)

- What I did
  - I introduced Linux-specific runtime logic around `OLLAMA_BASE_URL` and was implicitly treating the networking problem as if Firecrawl service reachability itself needed extra handling.
- What the user instructed instead
  - The user pointed out that Firecrawl itself is already reachable locally via `http://localhost:3002`, so the setup should stay simpler and avoid unnecessary networking shenanigans.
- Why my approach was incorrect or misaligned
  - I blurred two separate paths: host-to-Firecrawl API access (`localhost:3002`, already fine) and Firecrawl-container-to-Ollama access (the only path that may need special handling).
- Early detection signal I missed
  - The successful local curl shape to `/v1/crawl` was already a strong signal that Firecrawl port exposure was not the real problem surface.
- Preventative rule or checklist update
  - When debugging local networking, separate `host -> service` reachability from `container -> dependency` reachability before changing installer/runtime logic.
  - Prefer the smallest fix that targets only the failing hop.
- Repo-specific nuance discovered
  - In this repo, Firecrawl API access from the host is already solved by Docker port mapping on `localhost:3002`; only Ollama reachability from inside Firecrawl containers may need platform-aware handling.
- The user explicitly wants to move beyond `deepseek` if there is a better modern Ollama default, but still wants the patch constrained to Ollama-related env changes only.
- Current repo state matters here: `firecrawl/.env.default` is already a fuller upstream-shaped template with the Ollama lines commented, while the live `~/firecrawl/.env` is still minimal. A safe update path is therefore to (a) symlink `~/firecrawl/.env` to the repo-owned env file and (b) touch only the Ollama lines plus Linux runtime host handling.
- Additional research confirms Firecrawl upstream still documents `MODEL_NAME=deepseek-r1:7b` and `MODEL_EMBEDDING_NAME=nomic-embed-text` as the official Ollama example, but this appears to be an example/default rather than a strong recommendation backed by compatibility data.
- Firecrawl source confirms only three Ollama-specific knobs matter for this pass: `OLLAMA_BASE_URL`, `MODEL_NAME`, and `MODEL_EMBEDDING_NAME`.
- Web research found real self-hosted Ollama users running `deepseek-r1:8b` with Firecrawl, but also multiple Firecrawl extraction issues around local Ollama/self-hosted extract flows. That pushes the recommendation toward a compatibility-first general model rather than a reasoning-heavy model as the default.
- For embeddings, `nomic-embed-text` remains the strongest low-risk default because it is the upstream example, is widely used in Ollama, and Firecrawl already references it directly in docs.
- For the main Ollama generation model, the next design should compare at least three options: keep upstream `deepseek-r1`, switch to a stronger general-purpose modern model, or leave the value commented/documented and only set a recommendation. The smallest correct design is likely a modern general-purpose Ollama model with broad availability, with the repo template and installer runtime both choosing the Linux-safe base URL automatically.
- Live `mcporter list firecrawl` verification shows the deep-research skill currently documents some wrong Firecrawl usage patterns. The actual stable Firecrawl tools exposed here are `firecrawl_search`, `firecrawl_scrape`, `firecrawl_map`, `firecrawl_crawl`, `firecrawl_check_crawl_status`, `firecrawl_extract`, and `firecrawl_agent`.
- The biggest Firecrawl mismatch in `skills/deep-research/SKILL.md` is the search `sources` shape: the live tool expects `sources` as an array of objects like `[{"type":"web"}]`, not an array of strings like `["web", "news"]`.
- The live `firecrawl_crawl` tool is asynchronous and returns an operation id; correct workflow requires `firecrawl_check_crawl_status` for progress/results instead of treating crawl like an immediate read.
- Live `mcporter list exa` verification confirms the active Exa tool set is `web_search_exa`, `web_search_advanced_exa`, `crawling_exa`, `company_research_exa`, `people_search_exa`, and `get_code_context_exa`.
- The Exa command examples in `skills/deep-research/SKILL.md` need tightening to the actual schema too: `web_search_exa` only accepts `type: auto|fast`, while `web_search_advanced_exa` supports `type: auto|fast|neural` plus richer filter fields; `crawling_exa.subpageTarget` is a single string, not an array.
- The repo-owned `firecrawl/.env.default` on disk has been reverted/updated by the user to the upstream-style commented template, so the Ollama patch should only touch the commented Ollama lines and keep the rest of the file exactly as-is.
- `README.md` currently still claims the repo template contains Ollama-first active defaults, but the actual file now has commented Ollama examples. README must be aligned to the current template shape while documenting the symlink-based workflow the user wants.
- The installer needs one additional operational change: `~/firecrawl/.env` should become a symlink to the repo-owned env file so the user's edit point is `~/.config/opencode/firecrawl/.env.default` and Docker Compose reads that same file directly.
- The chosen Ollama default for this pass is now `qwen3:8b` for the main generation model and `nomic-embed-text` for embeddings.
- Rationale for the default pair:
  - Firecrawl upstream still documents `deepseek-r1:7b` + `nomic-embed-text`, but that is an example rather than a demonstrated best-practice recommendation.
  - `qwen3` is explicitly presented by Ollama as the latest Qwen generation with strong agent/tool capability and broad general-purpose performance, making it a better modern non-DeepSeek default for Firecrawl extraction than a reasoning-heavy R1 example.
  - `nomic-embed-text` remains a strong low-risk embedding default with very broad Ollama usage and direct recommendation/usage in both Firecrawl docs and Ollama docs.
- The repo-owned env file now activates the Ollama lines directly (`OLLAMA_BASE_URL`, `MODEL_NAME`, `MODEL_EMBEDDING_NAME`) instead of leaving them commented, while preserving all non-Ollama env content untouched.
- `install.sh` now computes a runtime-safe Ollama base URL: macOS/Docker Desktop keeps `http://host.docker.internal:11434/api`, while Linux prefers the Docker bridge gateway from `docker network inspect bridge` and falls back to `http://172.17.0.1:11434/api`.
- `install.sh` now applies only the Ollama-related env mutations (`OLLAMA_BASE_URL`, `MODEL_NAME`, `MODEL_EMBEDDING_NAME`) and then symlinks `~/firecrawl/.env` back to the repo-owned `firecrawl/.env.default` file.
- The current live Firecrawl instance has already been switched to that model: `~/firecrawl/.env` is now a symlink to `/Users/ayushmanburagohain/.config/opencode/firecrawl/.env.default`.
- `skills/deep-research/SKILL.md` has been corrected against the real `mcporter list` output:
  - Firecrawl search now uses `sources: [{"type": "web"}]`
  - Firecrawl map is documented as a first-class step before agent use
  - Firecrawl crawl is documented as async with `firecrawl_check_crawl_status`
  - Firecrawl extract is documented using the real `firecrawl_extract` tool
  - Exa crawl now uses the real `subpageTarget` string shape
  - the old `mcpporter` typo is fixed to `mcporter`
- Runtime verification passed after the patch:
  - `bash -n install.sh` passed
  - `firecrawl/.env.default` now contains active Ollama lines with `qwen3:8b` and `nomic-embed-text`
  - corrected Firecrawl search through `mcporter` succeeded
  - corrected Exa search through `mcporter` succeeded

## Current Follow-Up (2026-03-31, Firecrawl skill + localhost simplification)

- The user now wants three things together: simplify Firecrawl guidance around `localhost:3002`, add a dedicated `firecrawl` skill for direct operational use, and diagnose the live `firecrawl_agent` failure surfaced from a real `mcporter` call.
- The user has explicitly clarified the desired skill split: add a dedicated in-depth `firecrawl` skill as a peer workflow and have `deep-research` refer to it rather than trying to inline all direct Firecrawl operational guidance.
- The user's live failing command is:
  - `bunx mcporter call 'firecrawl.firecrawl_agent(prompt: "Find the top AI code editors in 2026 and summarize pricing, strengths, and market positioning")' --config ~/.config/opencode/mcporter.json --output json`
  - current result: `Tool 'firecrawl_agent' execution failed ... Error ID: 9f761aef1cd6444da12c1178080a4fb7`
- Best current interpretation: host-to-Firecrawl access is already fine on `localhost:3002`; the next pass should not add more Firecrawl API networking complexity unless direct evidence shows it is needed.
- The next design should likely do three focused things:
  1. keep Firecrawl host guidance simple (`localhost:3002` for the Firecrawl API)
  2. add a dedicated `skills/firecrawl/SKILL.md` for search/scrape/map/extract/crawl/agent operations and troubleshooting
  3. make `deep-research` point to `firecrawl` for direct Firecrawl tactics while reserving `deep-research` for synthesis and citations
- Because `firecrawl_agent` is already failing in real usage, the new Firecrawl skill should likely recommend lower-level Firecrawl tools (`search`, `scrape`, `map`, `extract`) as the default stable path and treat `firecrawl_agent` as optional/experimental with explicit fallback guidance.
- The approved Firecrawl follow-up is now on disk:
  - `skills/firecrawl/SKILL.md` exists as the direct-operation Firecrawl skill.
  - It treats `localhost:3002` as the normal host-side Firecrawl API path.
  - It explicitly documents `firecrawl_agent` as optional/beta and points agents toward `search`, `scrape`, `map`, `extract`, and async `crawl` as the stable default path.
- `skills/deep-research/SKILL.md` now refers agents to skill:`firecrawl` for direct Firecrawl operation instead of trying to inline every Firecrawl tactic in the research skill itself.
- `agent-permissions.jsonc` now explicitly allows `firecrawl` for Athena, Apollo, and Hestia; Zeus and Hermes already inherit it through wildcard access.
- `README.md` now keeps Firecrawl guidance simple: host access is `localhost:3002`, while any platform-aware logic only applies to Ollama-related env lines, not to reaching Firecrawl itself.
- Verification for this pass succeeded:
  - `bash -n install.sh` still passes.
  - the new `skills/firecrawl/SKILL.md` is present and concise.
  - grep confirms `firecrawl` permission entries for Athena, Apollo, and Hestia.
  - README now explicitly keeps Firecrawl host access on `localhost:3002`.

## Current Follow-Up (2026-03-31, planning-with-files load vs nudge split)

- The user now wants `plugins/planning-with-files` narrowed so only Zeus and Hermes get the full planning skill/system load.
- For the rest of the custom agents, the plugin should only inject planning nudges/reminders rather than the full planning-skill load behavior.
- The relevant code surface is concentrated in:
  - `plugins/planning-with-files/constants.ts`
  - `plugins/planning-with-files/messages.ts`
  - `plugins/planning-with-files.ts`
- Current behavior already distinguishes primary planning-file owners from everyone else, but it does not yet expose an explicit policy split between “full load” agents and “nudge-only custom agents” as a first-class config/constant.
- Current repo-grounded starting point:
  - full-load set effectively maps to `PLANNING_SKILL_AGENTS = {zeus, hermes}`
  - owner/update set maps to `PLANNING_FILE_OWNERS = {zeus, hermes}`
  - every non-owner known agent currently gets the generic read-only system block, not a clearly named custom-agent-only nudge lane
- The next design should likely introduce two explicit lists/sets:
  1. agents that get the main planning skill load
  2. custom agents that get nudge-only behavior
- The user also explicitly wants those lists surfaced clearly so they can decide/adjust them.
- Final approved split:
  - full load: `zeus`, `hermes`
  - nudge only: `artemis`, `athena`, `apollo`, `aphrodite`, `hephaestus`, `planner`, `themis`, `hestia`, `cronus`
  - no planning injection from this plugin for non-custom/system agents like `build`, `general`, and `plan`
- The approved split is now on disk:
  - `constants.ts` exposes explicit full-load and nudge-only agent lists/sets
  - `session-cache.ts` now distinguishes planning-skill sessions from planning-nudge sessions
  - `planning-with-files.ts` now injects the full planning load only for Zeus/Hermes, injects nudge-only behavior only for the approved custom-agent list, and does nothing for the remaining agents
  - only Zeus/Hermes receive the active plan/progress context block; nudge-only custom agents now get reminders without the full planning-context load
  - `messages.ts` now labels the read-only path as a nudge-only planning session for the custom-agent lane

## Current Task (2026-03-31, packaging pass)

- The user now wants the current local OpenCode config packaged so it can be configured and bootstrapped cleanly.
- The task explicitly includes updating `install.sh` and creating a GitHub repo for the packaged config.
- This is a behavior/design change, so implementation must wait until the packaging/bootstrap design is presented and approved.

## Early Packaging Findings (2026-03-31)

- The working directory is still `~/.config/opencode`, and it is still not a git repository.
- The repo already has publication-relevant surfaces: `install.sh`, `README.md`, `package.json`, `opencode.json`, agent prompts, plugins, and skills.
- There is already a `commands/update-codemaps.md` file present again in the tree, so any packaging pass should verify whether older deferred contradictions are still live instead of assuming previous cleanup state still matches disk.
- The first design questions likely concern package source strategy (local path vs GitHub), which parts should become configurable, and the target GitHub repo name/visibility.
- `install.sh` is already a full bootstrap installer, but it is hard-coded around a single personal GitHub slug (`benihime91/opencode-config`) and a fixed clone directory (`~/opencode-config`).
- The README is also still written as a personal config repo: same hard-coded repo slug, same fixed clone path, and no documented configuration model beyond copying/symlinking the whole repo.
- `package.json` is minimal and currently only declares `@opencode-ai/plugin`, which suggests packaging work is mostly repo/bootstrap/documentation shape rather than publishing an npm package.
- `install.sh` dynamically discovers plugin packages from `opencode.json` and local MCP packages from `.mcp.*.command`, so the best packaging change is likely to make the repo source/bootstrap variables configurable without replacing that dynamic discovery logic.
- The installer currently symlinks a fixed set of roots (`opencode.json`, `agent-permissions.jsonc`, `dcp.jsonc`, plus `agents/`, `commands/`, `plugins/`, `skills/`, `themes/`) into `~/.config/opencode`; packaging work should preserve that manifest-like behavior and only make the source repo/path overridable.
- The installer file is 496 lines, which exceeds the repo's 200-LOC smell threshold; a careful packaging pass should avoid piling more unrelated logic into it and may need a targeted simplification or extraction if the new configurability increases complexity materially.

## Packaging Design Constraints (2026-03-31)

- The repository is not yet a git repo, so GitHub publication will require initializing git locally before a remote can be created.
- Context+ semantic search returned generic fetch failures during this pass, so file reads/context tree remain the reliable discovery path for this task.
- Because the user explicitly asked for both bootstrap changes and GitHub publication, the design needs to cover installer behavior, repo metadata/readme posture, and repository naming/visibility.

## User Packaging Preference Captured (2026-03-31)

- GitHub target chosen for this pass: public repo named `opencode-config`.

## Approved Packaging Design (2026-03-31)

- The approved approach is a repo-driven bootstrap flow with overridable defaults for repo slug or URL, clone dir, and config dir.
- The current symlink manifest, plugin discovery, MCP pre-cache behavior, and dependency installation flow should stay intact.
- The repo should be published as a reusable public GitHub repository named `opencode-config` rather than reworked into a package registry artifact.
- Design and implementation artifacts were written to:
  - `.plans/specs/2026-03-31-opencode-config-packaging-design.md`
  - `.plans/2026-03-31-opencode-config-packaging-plan.md`

## Implementation Findings — Packaging Edits (2026-03-31)

- `install.sh` now uses configurable defaults via `OPENCODE_CONFIG_REPO_SLUG`, `OPENCODE_CONFIG_REPO_URL`, `OPENCODE_CONFIG_CLONE_DIR`, and `OPENCODE_CONFIG_DIR`.
- The installer origin check was generalized by normalizing repo references instead of matching only one hard-coded GitHub slug, so alternate GitHub URL formats and explicit repo URLs can still be verified safely.
- The installer still preserves the existing symlink manifest, dependency installation flow, plugin discovery, and local MCP package discovery.
- `README.md` now presents the repo as reusable rather than personal and documents override variables for forks and custom clone paths.
- GitHub CLI is authenticated as `benihime91`, and the target public repository `https://github.com/benihime91/opencode-config` already exists.
- The local config directory has now been initialized as a git repository on `main` and connected to `origin` at `git@github.com:benihime91/opencode-config.git`.
- Local `main` was anchored to the existing remote history at `origin/main`, which exposed a larger unpublished config delta than the packaging-only edits; the published commit therefore includes both the new packaging/bootstrap work and prior local agent/workflow changes.
- Published commit: `80fb08a` (`chore: tighten agent workflow and bootstrap packaging`).

## Current Task (2026-03-31)

- Give the local OpenCode config a new "spa day" by consolidating rules and skills, removing contradictions, and explicitly asking the user for updated preferences first.
- Perform a thorough deep-dive on `tmp/oh-my-openagent` and `tmp/oh-my-opencode-slim`.
- Use that comparison to shape recommendations for making the local agent harness and orchestrator workflow feel similar while preserving local constraints.

## Current Requirements (2026-03-31)

- Treat the current `~/.config/opencode` directory as the local harness under review.
- Ask the user for updated preferences instead of silently assuming policy choices during consolidation.
- Study both reference repos deeply enough to compare orchestrator roles, delegation contracts, worker specializations, planning memory, verification style, and repo-level operating model.
- Produce synthesis and recommendations first; do not implement repo changes unless the user asks for them.

## Updated Direction (2026-03-31)

- The user now wants implementation-oriented cleanup around `plugins/planning-with-files.ts` in addition to recommendations.
- Desired behavior: `agents/orchestrator.md`, `agents/cursor.md`, and the default build agent should always follow the planning-with-files workflow.
- Shared planning memory goal: `.plans/task_plan.md`, `.plans/findings.md`, and `.plans/progress.md` should act as the durable cross-turn/cross-agent memory.
- Ownership goal from the user: only the orchestrator should decide what gets written into the planning trio and only the orchestrator should update those files.
- Subagents should be directed by orchestrator to load planning memory from `.plans`, not author it.
- The user also wants the subagent response contract improved to reduce missed details by the orchestrator, inspired by how OMO handles delegated work.

## Correction Log (2026-03-31)

- What I did: I initially stayed in synthesis mode and described recommendations without yet pivoting the active task toward concrete planning-plugin and response-contract changes.
- What the user instructed instead: Make `plugins/planning-with-files.ts` more elegant, center `.plans` as shared memory, make orchestrator the sole planning-file author, and improve subagent responses in a more OMO-like way.
- Why my approach was incorrect or misaligned: The user had moved from high-level strategy into a concrete behavior-change request, so staying only at recommendation level was too passive.
- Early detection signal I missed: The user explicitly named a target plugin file and described precise workflow invariants around ownership and persistence.
- Preventative rule or checklist update: When the user names exact local files plus desired workflow behavior, switch from broad synthesis into concrete implementation design immediately and ask only the minimum clarifying question needed.
- Repo-specific nuance discovered: The intended end state is stricter than the current plugin policy — `cursor` and `build` should follow planning workflow, but planning-trio authorship should likely collapse to orchestrator-only.

## Implementation Results — Planning Workflow Tightening (2026-03-31)

- `plugins/planning-with-files.ts` was refactored into smaller focused modules under `plugins/planning-with-files/` (`constants.ts`, `messages.ts`, `files.ts`) so the main plugin file now acts as orchestration glue instead of a mixed blob.
- Shared primary planning writers are now explicitly `orchestrator`, `cursor`, and `build`, matching the user’s final ownership choice while still treating the planning trio as one shared memory system.
- The planning plugin now injects stronger workflow guidance for those three primary agents: always use planning-with-files for complex work, treat `.plans/task_plan.md`, `.plans/findings.md`, and `.plans/progress.md` as shared memory, and persist meaningful progress/findings back into that memory.
- Non-primary sessions now get clearer read-only reminders that hand durable findings back into the shared planning memory rather than treating it as private agent state.
- `agents/orchestrator.md` was tightened in a more OMO-like way: when session history matters, subagents must be told to read the planning trio; after subagent/tool results, the orchestrator must normalize weak responses, update planning memory, read touched files, and redelegate if claims are unsupported.
- `agents/cursor.md` now follows the same shared-memory model: it treats the planning trio as persistent shared memory and persists meaningful findings/progress there during complex work.
- `agents/build.md` was updated so the default build agent also follows the planning-with-files workflow and writes back to the shared planning trio during multi-step execution.
- The strongest OMO lesson confirmed during implementation is that missed-detail reduction comes more from orchestrator verification + persistence discipline than from inventing a more ornate worker response schema.

## Verification Notes (2026-03-31)

- `contextplus_run_static_analysis` failed with a generic fetch error in this environment, so validation fell back to direct import checks.
- `bun --eval` successfully imported:
  - `plugins/planning-with-files.ts`
  - `plugins/planning-with-files/constants.ts`
  - `plugins/planning-with-files/messages.ts`
  - `plugins/planning-with-files/files.ts`
  - `agents/orchestrator.md`
  - `agents/cursor.md`
- This confirmed the refactor and prompt-file updates remain loadable in the local harness.

## Orchestrator Design-Chain Ownership Update (2026-03-31)

- The user clarified the desired boundary for `agents/orchestrator.md`: subagents may be used freely to gather information or evidence during requirement understanding, but the orchestrator itself must synthesize that material into the canonical design, spec, and implementation plan.
- The non-delegable chain is now: requirement synthesis after information gathering, design presentation/approval handling, spec writing or revision, spec self-review plus user review gate, and `writing-plans` invocation plus final plan authorship.
- Delegated design or planning output should be treated only as supporting input, not as authoritative spec/plan output.
- If the orchestrator accidentally delegates canonical design/spec/plan work, that delegation should be treated as invalid and the orchestrator must redo the authoritative work locally.
- A follow-up wording pass aligned the prompt more closely with the `brainstorming` skill vocabulary: requirement understanding, design approval loop, user spec review gate, and final implementation-plan authorship.
- The phase label now mirrors that workflow more literally: `Phase 1.5 — Brainstorming To Writing-Plans`.

## Second Pass — Orchestrator Delegation Tightening (2026-03-31)

- `agents/orchestrator.md` got a follow-up wording pass focused only on delegation quality and post-subagent handling.
- The mandatory delegation package now includes an explicit silent self-check before sending any handoff: define done-state clearly, name exact known files/sections, state required evidence, state what must remain unchanged, and explain what changed on retries.
- The subagent response contract is now stricter about false-positive completion: vague `SUMMARY`, weak `FILES`, weak `VERIFICATION`, or material work hidden in `FOLLOW_UP` must all be treated as incomplete work.
- The verification checklist now also distinguishes review-only work from edit work and requires the orchestrator to either accept/persist the result or redelegate with the exact gap instead of leaving partially trusted results unresolved.
- This pass did not change the response schema shape; it tightened orchestrator interpretation and enforcement, which better matches the OMO lesson that reliability comes from orchestrator distrust + follow-through more than from adding more formatting.

## Starting Point For This Pass

## Current Task (2026-03-31, rules distillation)

- The user asked for a `/rules-distill` style pass: scan installed skills, cross-read them against the current rules, extract only cross-cutting principles that appear in 2+ skills, and present verdicted rule candidates for approval.
- The workflow constraint is explicit: do not modify rule files automatically. Inventory first, then LLM judgment, then present approve/modify/skip options.
- This pass should prefer deterministic collection from the provided `rules-distill` scripts and only use judgment for clustering, matching, and verdicting.
- Inventory results: `scan-skills.sh` found 23 installed skills and `scan-rules.sh` found 2 rule files with 23 indexed headings total.
- Current rule coverage is narrow and code-focused: `python-coding-style.md` plus `modular-code-enforcement.md`. There is no general workflow/rules file yet for broader agent-operating principles, so any accepted cross-cutting process principle may need a new file rather than a small append.

- Prior spa-day work already removed several stale contradictions, but the planning trio still contains older findings that should be reused instead of rediscovered.
- The local config directory is still not a git repo, so planning files remain the reliable session memory.
- The user's new request combines two linked tracks: preference-driven local consolidation and external workflow benchmarking.

## Preference Signal Captured (2026-03-31)

- Highest-priority preference for this pass: make the local harness feel more like the oh-my-openagent / oh-my-opencode-slim workflow where practical.
- This means contradiction cleanup should bias toward architectural coherence with the reference orchestrator/worker model, while still respecting local `.plans` and Context+ constraints.
- Preferred target style inside that OMO-like direction: sharpen the current local roles rather than adding many new agent layers.
- This biases recommendations toward prompt/plugin consolidation, clearer role boundaries, and stronger operating contracts instead of expanding the roster toward full Prometheus/Atlas/Metis/Momus-style layering.
- Final ownership choice for this pass: keep shared primary writes. Orchestrator, cursor, and build should all follow the planning workflow and may all update the planning trio.

## Early Structural Findings (2026-03-31)

- Local harness: lightweight prompt/config repo with agent markdown prompts, command markdown files, custom plugins, and skill definitions. Most leverage points are policy/prompt/plugin changes rather than product-code subsystems.
- `oh-my-openagent`: full plugin platform with a large multi-layer architecture — agent factories, feature modules, 48 hooks, background-task systems, builtin skill/tool loaders, and an explicit separation between planning (Prometheus/Metis/Momus), orchestration (Atlas/Sisyphus), and execution (Hephaestus/Sisyphus-Junior + specialists).
- `oh-my-opencode-slim`: smaller but still code-centric plugin that keeps agent prompts as TypeScript constants and adds two especially relevant systems for comparison: `background/` task orchestration and `council/` multi-model synthesis.
- The local harness is closer in spirit to a prompt-governance layer on top of OpenCode; the reference repos are full runtime plugins. Similarity should therefore target workflow, contracts, and verification posture more than raw feature parity.
- The most directly reusable comparison areas appear to be: orchestrator prompt structure, subagent input/output contract shape, persistent planning memory, subagent depth/permission control, and verification discipline.

## Deep-Dive Findings — Prompt / Runtime Comparison (2026-03-31)

- Local `agents/orchestrator.md` is already the closest existing local analogue to slim's `ORCHESTRATOR_PROMPT`: both are orchestration-first, list specialist roles explicitly, and bias toward delegation over direct implementation.
- The local orchestrator is stricter than slim in one important way: it already requires a 6-section delegation package and a normalized subagent response contract, which is closer to OMO's trust-but-verify discipline than to slim's lighter prose workflow.
- Slim's orchestrator adds two workflow ideas the local prompt does not yet surface as clearly: explicit path selection across quality/speed/cost/reliability and a stronger "STOP, review specialists before acting" checkpoint before self-execution.
- OMO's `Sisyphus` goes further than both: it enforces an intent gate, turn-local reset, aggressive parallel retrieval/delegation, stronger anti-duplication rules, and a more explicit distinction between exploratory turns vs implementation turns.
- Local `agents/fixer.md` is already materially closer to OMO `Hephaestus` than to slim `Fixer`: it reads planning memory first, has a requirement-understanding gate, insists on multi-step todo discipline, and carries a stronger verification contract.
- The remaining gap between local `fixer` and OMO `Hephaestus` is mostly around tone and recovery posture rather than capability: OMO encodes a much harder "do not ask, keep going, act on implied work" stance and a more forceful explore-first ambiguity protocol before any user question.
- Slim `Fixer` is intentionally lighter-weight and more disposable: it assumes complete context is handed in, allows grep/glob-only self-retrieval when needed, and reports through a lightweight XML-ish summary instead of a normalized evidence contract.
- Resulting comparison: local `fixer` already targets deep-worker behavior, while local orchestrator still has the highest leverage for becoming more OMO-like in day-to-day feel.

## Deep-Dive Findings — Runtime Governance / Session Model (2026-03-31)

- `plugins/planning-with-files.ts` is a major local differentiator: unlike slim/OMO, planning memory is enforced by runtime reminders, ownership checks, and automatic prompt injection from `.plans/task_plan.md` plus recent progress.
- The planning plugin currently treats `orchestrator`, `cursor`, and `build` as planning-file owners, and injects a read-only planning reminder for other agents. This means the local harness already has a practical equivalent of OMO's persistent plan/notepad memory, but implemented as repo-local markdown plus plugin enforcement rather than custom background infrastructure.
- `plugins/agent-permissions.ts` gives the local harness capability governance that neither prompt file alone can guarantee: it records the active agent per session, injects allowed skill/MCP policy into system prompts, and hard-blocks disallowed `skill` or MCP-backed tool use at execution time.
- Slim's `background/background-manager.ts` shows the runtime shape behind its delegation model: isolated sessions per background task, explicit per-agent delegation rules, default leaf-node restrictions, concurrency-limited start queues, parent/child session tracking, and depth control.
- Slim's `src/config/constants.ts` is especially relevant because it codifies `SUBAGENT_DELEGATION_RULES`: orchestrator may spawn all orchestratable agents; fixer/explorer/librarian/oracle/designer/council are leaf nodes. This is the clearest compact analogue for how the local harness should think about role boundaries.
- Slim's `council/council-manager.ts` adds a separate high-confidence decision lane: parallel councillors + master synthesis + graceful degradation. That is conceptually similar to local `oracle` escalation, but with a stronger explicit consensus workflow.
- OMO pushes the same governance themes at a larger scale: more agent tiers, more specialized planning/review roles, and stronger prompt-level delegation discipline, but the core pattern is still explicit role boundaries + persistent working memory + verification before trust.
- Practical implication for the local harness: the repo does not need to copy background-task or council infrastructure to feel more OMO-like; it mainly needs cleaner role definitions, sharper orchestrator decision gates, and possibly a more explicit policy record for which agents are leaf nodes vs escalation paths.

## Planning Plugin / Ownership Findings (2026-03-31)

- `plugins/planning-with-files/constants.ts` currently hard-codes `PLANNING_SKILL_AGENTS = {orchestrator, build, cursor}` and `PLANNING_FILE_OWNERS = {orchestrator, build, cursor}`.
- `plugins/planning-with-files.ts` therefore treats orchestrator, cursor, and build identically for planning-file authorship, reminder wording, and status injection.
- `agents/orchestrator.md` currently says both orchestrator and cursor directly manage the planning trio, which no longer cleanly matches the stronger orchestrator-as-memory-owner direction the user is considering.
- `plugins/planning-with-files/messages.ts` still encodes the older shared-ownership wording in read-only reminder text: non-owners are told to hand results back so the orchestrator, cursor, or build agent can update the planning trio.
- The planning plugin itself is compact but not yet elegant because ownership, reminder policy, and workflow semantics are spread across `planning-with-files.ts`, `constants.ts`, `messages.ts`, and `agents/orchestrator.md` with partially duplicated assumptions.
- The user resolved the ownership ambiguity in favor of shared primary writes, so the cleanup target is not orchestrator-only authorship anymore; the real goal is elegant shared-memory discipline with a clearly privileged primary trio (`orchestrator`, `cursor`, `build`) and read-only subagents.

## Implementation Constraint Discovered (2026-03-31)

- `plugins/planning-with-files.ts` is currently 211 lines long, so it already violates the repo's modular-code 200-LOC hard-limit rule.
- Any meaningful change to this plugin should therefore include a small refactor that splits responsibilities before or while tightening behavior.

## OMO Comparison — Delegated Result Handling (2026-03-31)

- OMO `Sisyphus` does not appear to rely on a rigid worker XML output block like slim's fixer. The stronger pattern is elsewhere: exhaustive 6-section delegation prompts, session continuity, and a mandatory verification loop that requires reading every touched file after delegated work.
- In other words, OMO reduces missed details less by fancy response formatting alone and more by making the orchestrator distrust summaries and re-ground itself in files + tool outputs every time.
- The local harness already has a normalized `STATUS / SUMMARY / FILES / VERIFICATION / FOLLOW_UP` response contract, but misses can still happen if the orchestrator prompt and planning plugin do not reinforce: persist durable outcomes immediately, read touched files, and treat vague or incomplete subagent reports as incomplete work.
- Best local adaptation: keep the normalized response contract, but tighten the fields and orchestrator follow-through rather than trying to mimic slim's lighter XML summaries.

## Emerging Similarity Targets (2026-03-31)

- The most portable OMO/slim pattern is not "more agents" by itself; it is a clearer three-part operating model: persistent planning memory, an orchestration layer that classifies/dispatches/verifies, and bounded workers with explicit escalation limits.
- The local harness already has the memory piece (`.plans` + planning plugin) and most of the worker boundary piece (`fixer`, permissions, planning ownership). The remaining gap is making the orchestrator's decision loop feel more explicitly layered and decisive.
- The local runtime-governance plugins are strong enough that local similarity work should prefer prompt/policy consolidation over new infrastructure. Adding plugin-scale runtime systems just to mimic OMO/slim would likely overshoot the repo's purpose.

## Current Task

Audit the local OpenCode config in this directory for remaining contradictions across rules, skills, commands, permissions, and planning workflows, then consolidate based on the user's updated preferences.

## Current Requirements

- Work only against the current OpenCode config directory.
- Reuse prior spa-day findings instead of rediscovering settled decisions.
- Surface contradictions clearly and ask for updated preferences where direct cleanup would otherwise guess policy.
- After preferences are clear, remove contradictions and consolidate rules/skills without drifting into unrelated refactors.

## Current Contradiction Scan (2026-03-27)

- `README.md` still tells manual installers to symlink `AGENTS.md`, but no top-level `AGENTS.md` exists in this config directory.
- `commands/update-codemaps.md` still assumes codemaps live in `docs/CODEMAPS/`, which is currently absent.
- `skills/writing-plans/SKILL.md` still says durable plans live under `plans/...` instead of `.plans/...`.
- `skills/planning-with-files/SKILL.md` still starts session catch-up with `git diff --stat`, which conflicts with this config directory's non-git setup.
- `agents/doc-updater.md` and `agents/refactor-cleaner.md` still lack the `mode:` frontmatter used by the other agent prompt files.
- `agent-permissions.jsonc` still gives `orchestrator` wildcard skill access (`"*"`) rather than the more explicit `brainstorming`-only allow pattern used elsewhere.
- Several commands still assume a git repo exists here (`code-review`, `commit-push`, `commit-push-pr`, `update-docs`, `rollback`, `checkpoint`, `skill-create`), but prior notes say git-workflow changes were intentionally deferred.

## Preference Decisions Needed Now

- `AGENTS.md`: create the missing file, remove its references, or leave the contradiction deferred.
- `docs/CODEMAPS/`: create the missing directory/docs, retarget codemap workflows elsewhere, or leave the contradiction deferred.
- Orchestrator skill permissions: keep wildcard skill access intentionally, or tighten it to explicit `brainstorming` allow.

## User Preferences Confirmed In This Pass (2026-03-27)

- Remove `AGENTS.md` references rather than creating the file.
- Retire the codemap workflow entirely rather than creating or relocating `docs/CODEMAPS/`.
- Keep orchestrator wildcard skill access intentionally.

## Spa-Day Consolidation Results (2026-03-27)

- Removed the stale `AGENTS.md` references from `README.md` and `install.sh`.
- Retired the codemap workflow by deleting `commands/update-codemaps.md`, removing the related `.gitignore` exceptions, and stripping codemap-specific wording from `agents/orchestrator.md` and `agents/doc-updater.md`.
- Added `mode: subagent` frontmatter to `agents/doc-updater.md` and `agents/refactor-cleaner.md`.
- Corrected `skills/writing-plans/SKILL.md` so durable plans are written under `.plans/YYYY-MM-DD-HHMM-<task-key>.md`.
- Kept orchestrator wildcard skill access unchanged, per the user's explicit preference.

## Remaining Deferred Contradictions

- `skills/planning-with-files/SKILL.md` still starts session catch-up with `git diff --stat`, which remains inconsistent with this non-git config directory; this was intentionally left deferred because the user did not want git-workflow cleanup in this pass.

## Research Requirements

- Compare the external repo's agent architecture, delegation patterns, and worker roles against the local harness.
- Reuse relevant local findings from prior prompt-cleanup sessions instead of starting from zero.
- Produce strategic recommendations, not code edits, unless the user later asks for implementation.
- Answer the specific hypothesis about `fixer` versus Hephaestus directly.

## Working Hypotheses

- The biggest leverage is likely in `fixer`, because the user explicitly called out Hephaestus.
- The local harness already adopted some OMO-style orchestration patterns, so the best improvements may now be behavioral tightening rather than wholesale copying.
- The right answer may be “partly yes” for `fixer`: stronger autonomy and execution focus, but not full Hephaestus parity if that breaks local orchestrator boundaries.

## External Research Findings — oh-my-openagent (2026-03-27)

- OMO's `Hephaestus` prompt is materially more aggressive than the local `fixer` on autonomy. It explicitly says "Do NOT Ask — Just Do", forbids permission-seeking, requires implied work to be executed in the same turn, and pushes a full `EXPLORE → PLAN → DECIDE → EXECUTE → VERIFY` loop.
- OMO's `Hephaestus` also contains a stronger self-recovery posture: when blocked it should try different approaches, decompose the problem, challenge assumptions, and only ask the user as a last resort.
- OMO's `Sisyphus` prompt is stricter than the local orchestrator about not trusting delegated work. It says delegation never substitutes for verification and instructs the orchestrator to read every touched file itself after a subagent finishes.
- OMO's architecture is richer than the local harness: beyond orchestrator + worker, it includes role specializations like `sisyphus-junior`, `prometheus`, `atlas`, `momus`, `metis`, `oracle`, `explore`, and `librarian`, plus prompt-builder infrastructure and tests around delegation trust/tool restrictions.
- OMO relies on task/todo systems and background subagent patterns that should not be copied literally into this harness, because the local harness uses the `.plans/` trio and explicit Context+ workflows instead.
- OMO keeps an `AGENTS.md` under `src/agents/AGENTS.md`, which helps make the agent roster and specialization model explicit. The local harness still has missing top-level `AGENTS.md` references.

## Local Comparison Findings — Agent Strategy

- Local `fixer` is already substantially Hephaestus-like on execution focus: it reads `.plans/task_plan.md` first, starts immediately, stays autonomous within scope, uses strict todo discipline for multi-step work, and verifies locally before returning.
- The biggest remaining gap is not basic autonomy but _recovery and continuation behavior_: local `fixer` tells itself to keep going, but it does not yet encode the stronger anti-permission rules or the explicit multi-approach failure protocol found in OMO's `Hephaestus`.
- The local orchestrator already mirrors OMO's delegation package structure well, but it is softer than OMO's `Sisyphus` on mandatory post-delegation file-level verification.
- The local harness intentionally keeps research separated from implementation (`librarian`/`oracle` vs `fixer`), which is a good boundary and should remain; making `fixer` fully Hephaestus-like on research/delegation would blur that separation.
- The local harness has strong runtime governance via `plugins/planning-with-files.ts` and `plugins/agent-permissions.ts`; this is a real strength versus prompt-only systems and should be preserved as a differentiator.

## Emerging Recommendation

- `fixer` should become more Hephaestus-like in _behavioral discipline_ (stronger default action bias, clearer "do the implied work" rule, and explicit failure-recovery iterations), but not in _scope expansion_ (no external research, no subagent spawning, no abandonment of `.plans/` as the execution backbone).
- The second highest-leverage improvement is tightening orchestrator verification to be closer to Sisyphus: verify changed files and evidence directly rather than mostly trusting normalized subagent reports.
- A third improvement is role-sharpening: keep `fixer` as the deep worker, but introduce or clarify a "junior fixer / batch executor / maintenance worker" style role only if repetitive low-risk implementation work starts overloading the main `fixer`.

## Patch Plan Request (2026-03-27)

- The user approved the role framing and asked for a concrete patch plan specifically for:
  - `agents/fixer.md`
  - `agents/orchestrator.md`
- The immediate deliverable is a plan only, not prompt edits yet.
- The plan should preserve these boundaries:
  - `fixer` = deep local executor
  - `orchestrator` = strict delegator + verifier
  - `librarian` / `oracle` / `explorer` remain the research/strategy lane
- The plan should emphasize:
  - stronger `fixer` continuation, implied-work, and multi-approach recovery behavior
  - stronger orchestrator-side verification of subagent outputs and touched files
  - no adoption of OMO patterns that would bypass `.plans`, permission plugins, or local role boundaries

## Implementation Authorization (2026-03-27)

- The user has now approved execution of `.plans/2026-03-27-0400-fixer-orchestrator-patch-plan.md`.
- This implementation should modify only:
  - `agents/fixer.md`
  - `agents/orchestrator.md`
- The still-deferred brainstorming-skill question is separate and should not be mixed into this prompt implementation pass unless asked again afterward.

## Prompt Implementation Results (2026-03-27)

- `agents/fixer.md` now frames `fixer` as a deep local execution specialist rather than a fast implementation specialist.
- `fixer` now explicitly prefers safe obvious action over permission-seeking, completes implied local correctness work, tries a materially different local approach before escalating, and uses a two-step recovery ladder before returning `blocked` or `needs_input`.
- `fixer` verification now emphasizes strongest relevant local checks, explicit fallback reporting when checks cannot run, and evidence strong enough for orchestrator verification.
- `agents/orchestrator.md` now explicitly says subagent completion claims are not trusted without direct verification and that the orchestrator must verify delivered work against the request.
- The delegation-package rules in `agents/orchestrator.md` now require more concrete `TASK`, `EXPECTED OUTCOME`, `MUST DO`, `MUST NOT DO`, and `CONTEXT` content, especially when exact files/sections and read-back targets are known.
- Orchestrator verification now requires reading every file listed in `FILES`, checking claims against touched-file contents, and treating missing or vague evidence as incomplete work.
- No `lsp_diagnostics` language was reintroduced, and the implementation-only / no-delegation / no-external-research boundary for `fixer` remained intact.

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
- Updated `agents/orchestrator.md` to use a stronger OMO-inspired orchestration flow plus a mandatory 6-section delegation package and a normalized subagent response contract.
- Updated `agents/fixer.md` to be execution-first, read `.plans/task_plan.md` first, use strict todo discipline, and report through the shared response contract without `lsp_diagnostics` references.
- Standardized orchestrator-used subagents (`explorer`, `librarian`, `oracle`, `designer`, `planner`, `code-reviewer`, `doc-updater`, `refactor-cleaner`) around one shared input contract and one shared output contract.

## Agent Prompt Standardization Follow-up (2026-03-27)

- The user wants `agents/orchestrator.md` to more closely mirror oh-my-openagent's main orchestrator, especially the task-delegation format it sends to subagents.
- The user wants `agents/fixer.md` to blend Hephaestus and Sisyphus-Junior: autonomous, execution-first, focused, and verification-aware.
- The user wants the orchestrator-used subagents to share one standardized input contract and one standardized output shape similar to OMO.
- `fixer.md` should explicitly read `.plans/task_plan.md` first because that is where the active todos live.
- Do not reference `lsp_diagnostics` in these prompts because this repo does not have that capability.

## Correction Log

- What I did: I initially drafted policy language using external agent personas as reference points and did not yet encode the new requirement-understanding rule into the local prompt files.
- What the user instructed instead: Update `agents/fixer.md` and `agents/cursor.md`, keep `agents/orchestrator.md` as-is, make the instructions self-contained, and avoid direct references to external agent names.
- Why my approach was incorrect or misaligned: Referencing outside agent names makes the local prompts depend on external context instead of clearly stating the required behavior in plain language.
- Early detection signal I missed: The user explicitly asked for exact local policy text and then explicitly said not to reference the external agent set directly.
- Preventative rule or checklist update: When adapting behavior from another system, rewrite it into self-contained local instructions and verify the target file list before editing.
- Repo-specific nuance discovered: `cursor` should explicitly require `brainstorming` for requirement understanding, while `orchestrator` remains the existing controller prompt for this pass.


- What I did: I sent a vague `REQUIRED TOOLS` section to a subagent ("Use repository exploration tools only") instead of specifying the exact repo-understanding workflow and highest-signal Context+ tools.
- What the user instructed instead: The orchestrator should send the exact tools needed for context understanding, explicitly note Context+ MCP usage, and use `@CONTEXTPLUS.md` because it is the best repo-understanding guidance.
- Why my approach was incorrect or misaligned: It left too much discretion to the subagent, weakened orchestration quality, and ignored the repo's preferred structural-discovery workflow.
- Early detection signal I missed: The repo already has a dedicated `CONTEXTPLUS.md` playbook with mandatory tool ordering (`get_context_tree`, `get_file_skeleton`, semantic searches, blast radius, static analysis).
- Preventative rule or checklist update: In every orchestrator handoff, `REQUIRED TOOLS` must name the exact MCP/tools and intended sequence when repo understanding matters; default to a Context+ workflow rather than generic "explore the repo" wording.
- Repo-specific nuance discovered: This repo treats Context+ as the primary code-understanding system, and agent prompts should reference concrete Context+ usage rather than generic discovery guidance.

- What I did: I initially treated the planning trio as rooted directly under `docs/`, then under an intermediate docs subdirectory.
- What the user instructed instead: Keep all planning memory and durable plan artifacts under `.plans/`, and remove old redirect stubs.
- Why my approach was incorrect or misaligned: It optimized for visible docs organization rather than the user's preferred hidden working-memory directory.
- Early detection signal I missed: The user framed the planning files as internal plan docs/progress reports rather than user-facing documentation.
- Preventative rule or checklist update: When relocating persistent planning state, confirm early whether it belongs in a visible docs tree or a hidden working-memory directory.
- Repo-specific nuance discovered: This repo wants all active planning memory and planner-generated durable artifacts under `.plans/`, with no compatibility stubs left behind.

- What I did: I previously added `lsp_diagnostics`-based verification language and made the fixer read the broader planning trio conditionally.
- What the user instructed instead: Remove `lsp_diagnostics` references and tell the fixer to look at `.plans/task_plan.md` first because that file contains the todos.
- Why my approach was incorrect or misaligned: I borrowed OMO verification language too literally instead of adapting to the tools and workflow that exist in this repo.
- Early detection signal I missed: The current repo's agent/tool inventory did not include `lsp_diagnostics`, and the user explicitly treats `.plans/task_plan.md` as the active todo source.
- Preventative rule or checklist update: When adapting patterns from another system, translate them to local capabilities before writing prompts; never mention non-existent tools or checks.
- Repo-specific nuance discovered: In this repo, `fixer` should prioritize `.plans/task_plan.md` as the first planning-memory file to read for execution context.

- What I did: I referenced OMO agent names directly inside `agents/fixer.md` ("Hephaestus bias" / "Sisyphus-Junior bias") and left in imported exploration/external-research guidance that fixer should not have.
- What the user instructed instead: Write the desired behaviors directly in the local prompt itself and copy only the relevant behavior, not the foreign agent names.
- Why my approach was incorrect or misaligned: The local fixer agent has no built-in knowledge of OMO internals, so those labels add ambiguity instead of useful instruction.
- Early detection signal I missed: The prompt relied on shorthand names rather than self-contained behavioral instructions, and it contradicted its own "no external research" rule.
- Preventative rule or checklist update: When adapting another system's prompt, inline the intended behavior in plain language and remove all references that require outside context to interpret.
- Repo-specific nuance discovered: Local agent prompts should be fully self-contained and should not depend on named concepts from external prompt systems.

## Spa Day Follow-up — Unresolved Contradictions (2026-03-27)

- `agent-permissions.jsonc` has no entries for `planner`, `code-reviewer`, `doc-updater`, or `refactor-cleaner`, even though the orchestrator prompt actively delegates to them and their prompt files exist.
- `agents/cursor.md` tells the primary agent to update `.plans/findings.md`, which conflicts with the current rule that the orchestrator exclusively owns the planning trio.
- The allowed orchestrator exception for editing "brainstorming/spec documents" is still undefined; there is no agreed file pattern or directory for those docs.
- `agents/planner.md` still presents an ambiguity between plan-writing responsibilities and `edit: false` in frontmatter.
- `agents/doc-updater.md` is missing a `mode:` field while the other agent prompts define one.
- `agents/cursor.md` still uses `@~/.config/opencode/CONTEXTPLUS.md` syntax instead of the backtick-quoted path style used elsewhere.
- `skills/planning-with-files/SKILL.md` begins its session catch-up workflow with `git diff --stat`, but this config directory is not a git repo.
- Multiple commands still assume git is available (`code-review`, `commit-push`, `commit-push-pr`, `update-docs`, and likely parts of `skill-create`), which is inconsistent with this repo's current non-git setup.
- `README.md` and planning notes still reference a top-level `AGENTS.md`, but that file is absent.
- `commands/update-codemaps.md` and prior notes assume `docs/CODEMAPS/` exists, but the directory is absent.
- `plugins/planning-with-files.ts` still treats `cursor` as a planning-skill/planning-file owner, but `cursor` is not integrated into the current orchestrator delegation/permissions flow.
- `commands/skill-create.md` currently routes to `doc-updater`, which may not match the actual ownership of skill-creation work.

## Preference Questions To Resolve

- Whether the missing delegated agents should be added to `agent-permissions.jsonc`, and with what MCP access.
- Whether `cursor` should keep any planning-file ownership or `.plans/findings.md` write access.
- How to define or remove the "brainstorming/spec documents" exception.
- Whether planner should stay `edit: false` or explicitly allow edits to its durable plan artifacts.
- Whether git-dependent workflows should fail clearly, degrade gracefully, or be removed from this non-git config repo.
- Whether `AGENTS.md` should be created or all references removed.
- Whether `docs/CODEMAPS/` should be created, relocated, or retired for this repo.
- Whether `/skill-create` should route to `orchestrator`, stay on `doc-updater`, or move elsewhere.

## Spa Day Follow-up — Approved Preferences (2026-03-27)

- Add `planner`, `code-reviewer`, `doc-updater`, and `refactor-cleaner` to `agent-permissions.jsonc`.
- Allow `cursor` to share `.plans` ownership with the orchestrator (user chose orchestrator + cursor rather than orchestrator-only).
- Remove the undefined "brainstorming/spec documents" exception instead of defining it.
- Allow planner edits to planner-owned durable plan artifacts.
- Leave the git-dependent workflow questions unchanged for now.
- Leave the missing `AGENTS.md` question unchanged for now.
- Leave the missing `docs/CODEMAPS/` question unchanged for now.
- Route `/skill-create` to `fixer`.

## Spa Day Follow-up — Applied Cleanup (2026-03-27)

- Added `planner`, `code-reviewer`, `doc-updater`, and `refactor-cleaner` to `agent-permissions.jsonc`.
- Changed shared `.plans` ownership language so `cursor` is explicitly allowed alongside the orchestrator where policy text needed alignment.
- Removed the undefined `brainstorming/spec documents` exception from orchestrator policy text.
- Updated `planner.md` so planner artifact work may use edits (`edit: true`) while still limiting scope to `.plans/YYYY-MM-DD-HHMM-<task-key>.md` artifacts.
- Routed `/skill-create` to `fixer`.
- Aligned `plugins/planning-with-files.ts` ownership/reminder text with orchestrator + cursor + build ownership.

## Deferred By User Choice

- Do not change the git-dependent workflow assumptions yet.
- Do not create or remove `AGENTS.md` yet.
- Do not create, relocate, or retire `docs/CODEMAPS/` yet.

## Context+ Prompt-Bloat Follow-up (2026-03-27)

- The user wants to reduce duplicated Context+ workflow text across agent prompts.
- Preferred direction: `cursor` should always auto-load `@~/.config/opencode/CONTEXTPLUS.md`; other agents should load/read `@~/.config/opencode/CONTEXTPLUS.md` only when semantic repo understanding is needed, ideally driven by orchestrator handoff requirements rather than large embedded workflow sections.
- `@../path` is not equivalent to markdown links such as `[](../path)` in this setup. Keep `@...` only where actual auto-load behavior is desired; use plain path references or explicit read/load instructions elsewhere.
- Add a color entry for `cursor` in `opencode.json`.
- Give `planner` `contextplus` MCP access.
- Do not make planner always load `article-writing`; it is the wrong default for structured planning artifacts and would add unnecessary context.

## Context+ Prompt-Bloat Follow-up — Applied Cleanup (2026-03-27)

- Added `contextplus` MCP access for `planner` in `agent-permissions.jsonc`.
- Added `cursor` color `#8B5CF6` in `opencode.json`.
- Kept `cursor` on explicit always-load `@~/.config/opencode/CONTEXTPLUS.md` behavior.
- Reduced duplicated embedded Context+ workflow blocks across the subagent prompt files and shifted them to lazy-load guidance tied to semantic repo-understanding needs.
- Preserved the orchestrator's exact Context+ handoff sequence so it can still specify the required tool order when delegating.

## Cursor Permissions Follow-up (2026-03-27)

- The user wants `cursor` to have explicit broad access for skills and MCPs.
- `agent-permissions.jsonc` controls skills/MCP access only; raw tool availability is governed elsewhere by the runtime/prompt environment.
- Added an explicit `cursor` entry with `skills: ["*"]` and `mcps: ["*"]`.

## Orchestrator Handoff Follow-up (2026-03-27)

- Ignore the requested planner-always-load change for now.
- The user wants the orchestrator's delegated tasks to be less vague, especially in `TASK`, `EXPECTED OUTCOME`, and `CONTEXT`.
- The user wants orchestrator-managed subagents to read `.plans/task_plan.md`, `.plans/findings.md`, and `.plans/progress.md` when delegated work depends on current session context.
- Preferred direction: the orchestrator should send that planning-file read requirement directly in its handoff package instead of relying on subagents to guess when context is needed.

## Orchestrator Handoff Follow-up — Applied Cleanup (2026-03-27)

- Tightened `agents/orchestrator.md` so delegation packages must contain concrete `TASK`, `EXPECTED OUTCOME`, and `CONTEXT` content rather than generic placeholders.
- Made the planning-trio read sentence operationally mandatory in orchestrator handoffs whenever delegated work depends on session state, prior findings, or multi-step task history.
- Updated orchestrator-managed subagent prompts so they explicitly honor the planning-trio read requirement when it appears in `MUST DO`.
- Left `agents/planner.md` unchanged per the user's latest instruction to ignore planner changes.

## Skill Install Follow-up (2026-03-27)

- The user now wants both remote superpowers skills vendored locally:
  - `brainstorming` should be preinstalled and always loaded by `orchestrator`.
  - `writing-plans` should be preinstalled and always loaded by `planner`.
- The user also wants these two skills blocked for orchestrator-managed subagents via `agent-permissions.jsonc`.
- Current state before cleanup:
  - Neither `skills/brainstorming/` nor `skills/writing-plans/` exists locally.
  - `agent-permissions.jsonc` currently gives `orchestrator` wildcard skill access and gives all orchestrator-managed subagents empty `skills: []`, which already denies all skills by default.
  - `agents/orchestrator.md` and `agents/planner.md` do not yet instruct always-loading these new skills.
- Imported upstream skill intent:
  - `brainstorming` is a strong pre-implementation design gate and expects a subsequent `writing-plans` transition.
  - `writing-plans` is a plan-authoring workflow, but its upstream file paths and git/worktree assumptions do not match this repo and will need local adaptation if embedded directly.

## Skill Install Follow-up — Applied Cleanup (2026-03-27)

- Added local `skills/brainstorming/SKILL.md` with repo-specific guidance for clarification, design gating, and orchestration handoff instead of upstream `docs/superpowers/*` conventions.
- Added local `skills/writing-plans/SKILL.md` with repo-specific guidance for durable `.plans/YYYY-MM-DD-HHMM-<task-key>.md` artifacts and without upstream git/worktree assumptions.
- Updated `agents/orchestrator.md` to always auto-load `@../skills/brainstorming/SKILL.md`.
- Updated `agents/planner.md` to always auto-load `@../skills/writing-plans/SKILL.md`.
- Updated `agent-permissions.jsonc` so `orchestrator` explicitly allows `brainstorming`, `planner` explicitly allows `writing-plans`, and the orchestrator-managed implementation/research/review subagents explicitly block both skills.

## Planning Hook Follow-up (2026-03-30)

- The user observed a real continuity gap: `explorer` can return useful context to `orchestrator`, but if `orchestrator` moves directly into planning without persisting the result, later steps reference context that no longer exists in shared memory.
- The user wants the planning plugin to be more aggressive, including reminders after every tool call rather than only after writes/edits.
- The preferred reminder text is exact and should be reused: `Update progress.md with what you just did. If a phase is now complete, update task_plan.md status.`
- The right implementation point is `plugins/planning-with-files.ts`, because that plugin already mirrors runtime hook behavior and can vary reminders by tool and session ownership.
- Even with aggressive reminders, `.plans/findings.md` should still be used for durable discoveries, especially after subagent/task results or discovery-heavy calls.

## Planning Hook Follow-up — Applied Cleanup (2026-03-30)

- Split `plugins/planning-with-files.ts` into focused helper modules under `plugins/planning-with-files/` so the main plugin stays under the repo's file-size and single-responsibility limits.
- The planning plugin now queues the current task-plan head before every tool call instead of only a limited watched subset.
- The planning plugin now appends a post-tool reminder after every tool call, not just `write` and `edit`.
- The owner-facing reminder uses the exact requested text: `Update .plans/progress.md with what you just did. If a phase is now complete, update task_plan.md status.`
- `task` calls get an additional findings-consolidation reminder so subagent discoveries are more likely to be persisted before the next orchestration step.
- The plugin now shows a toast with the same progress/task-plan reminder after any tool call that receives planning output.

## Agent Planning Persistence Follow-up (2026-03-30)

- The user approved extending the same continuity rule into both `agents/orchestrator.md` and `agents/cursor.md`.
- `agents/orchestrator.md` should explicitly require planning-memory persistence after meaningful tool results and after every subagent response, before the next phase or wave begins.
- `agents/cursor.md` should explicitly require the same persistence discipline after meaningful tool results, especially `task`/subagent results, so shared planning memory stays ahead of multi-step work.
- In this repo, the planning plugin reminder is not enough on its own; the agent prompts also need to operationalize the rule so the behavior is enforced even when the reminder text is easy to ignore.

## Agent Planning Persistence Follow-up — Applied Cleanup (2026-03-30)

- Added a `Mandatory Planning Persistence` section to `agents/orchestrator.md` requiring updates to `.plans/progress.md`, `.plans/findings.md`, and `.plans/task_plan.md` after meaningful tool/subagent results and before the next wave or synthesis.
- Strengthened the orchestrator's planning ownership section so it explicitly says not to advance while important context remains only in transient chat history.

## Agent Permissions Wildcard Discovery Note (2026-03-31)

- `plugins/agent-permissions.ts` resolves `"*"` by enumerating the local `skills/` directory and configured MCP families from `opencode.json`; it does not treat `"*"` as an unconstrained pass-through for unknown external names.
- The skill gate checks `policy.skills.includes(skillName)`, so a requested skill must exist in the discovered skill set after wildcard expansion.
- In this workspace, `skills/` contains 16 local skills and does not include `miyagi-trace`, so `orchestrator` with `skills: ["*"]` still rejects `miyagi-trace`.
- More specifically, the plugin's `SKILLS_DIR` is hard-coded to `path.join(__dirname, '..', 'skills')`, so wildcard expansion currently sees only the config-repo/global skill folder and not per-project `skills/` directories from the active workspace.
- Updated the agent-permissions implementation to merge skill discovery from both the config repo's `skills/` directory and the active workspace root's `skills/` directory via the plugin's `directory`/`worktree` inputs.
- Refactored `plugins/agent-permissions.ts` into focused helper modules under `plugins/agent-permissions/` so the main plugin file stays under the 200-LOC architecture limit.
- Added `commands/agent-permissions-debug.md` as an on-demand diagnostic command for inspecting global skills, project skills, merged skills, and MCP families in the current workspace.
- Expanded `plugins/agent-permissions/filesystem.ts` with `readDiscoveredSkills()` so diagnostics and future checks can distinguish global vs project skill discovery while the plugin still consumes the merged set.
- Ran the diagnostic against `miyagi-trace`; the current workspace still does not contain that skill in either global or project `skills/`, so wildcard permission alone cannot allow it yet.
- Added a `Planning Persistence After Tool Results` section to `agents/cursor.md` requiring the same progress/task-plan/findings discipline after meaningful tool and subagent outputs.

## Orchestrator Context+ Handoff Tightening (2026-03-31)

- The user observed that `agents/orchestrator.md` was still too easy to interpret as "subagents can figure out Context+ usage themselves" when repo understanding was needed.
- The approved fix was the smallest prompt-only change: tighten the existing delegation-package rule instead of adding a separate broad policy section.
- `agents/orchestrator.md` now states that when a subagent must understand repo structure, architecture, symbol usage, blast radius, or prompt/runtime workflow, the delegation package must explicitly name the Context+ workflow in `REQUIRED TOOLS`.
- The prompt now also says not to rely on `CONTEXT` alone to imply Context+ usage, and to explicitly say when a task does not need repo-understanding work instead of silently omitting that guidance.

## Orchestrator Explorer Priority Tightening (2026-03-31)

- The user reported that `@explorer` still did not feel operationally central in `agents/orchestrator.md`, despite being important to the local workflow.
- The chosen policy is a mix of "default first" and "mandatory when needed": use `@explorer` as the default repo-understanding lane, and require it before implementation delegation whenever exact files, architecture, symbol paths, or change surface are not already concrete.
- `agents/orchestrator.md` now says direct `@fixer` delegation is appropriate only when the exact files, scope, and approach are already concrete.
- The prompt now also says `@explorer` handoffs should carry explicit Context+ workflow by default for repo-facing work, not merely when the orchestrator happens to remember to add it.
- A follow-up wording pass aligned `@librarian` with that policy: explorer is now the repo-grounding lane, librarian is the external-docs lane, and they should run together only when both kinds of grounding are needed.

## Planning Hook Robustness Follow-up (2026-03-30)

- The user shared an OpenCode hook example showing `task`-argument caching and `subagent_type` inspection.
- That pattern is useful here because planning continuity depends heavily on delegated `task` results, especially from read-only subagents such as `explorer`, `librarian`, and `oracle`.
- The main repo rule remains unchanged: only `orchestrator`, `build`, and `cursor` should run planning-with-files ownership behavior; the rest should remain read-only consumers of `.plans/*` context.

## Planning Hook Robustness Follow-up — Applied Cleanup (2026-03-30)

- Updated `plugins/planning-with-files.ts` to cache delegated `task` subagent types by `callID` during `tool.execute.before`.
- The planning plugin now uses that cached `subagent_type` during `tool.execute.after` to emit more specific reminders for delegated subagent results.
- Owner sessions now get a stronger reminder when a delegated subagent returns: persist the durable outcome before starting the next wave or delegation.
- Read-only sessions still do not gain planning ownership; they only receive handoff-style reminders.
- The plugin continues to gate planning-file writes to `orchestrator`, `build`, and `cursor`.

## Correction Log

- What I did: I initially recommended a more selective reminder strategy instead of matching the user's preference for reminders after every tool call.
- What the user instructed instead: Apply the reminder after any tool call, and make the plugin show the exact prompt text plus a toast.
- Why my approach was incorrect or misaligned: I optimized for reducing noise, but the user explicitly prefers aggressive bookkeeping to avoid losing cross-agent context.
- Early detection signal I missed: The user's concrete hook example and repeated concern about missing `explorer` context clearly showed they valued consistency over minimal prompts.
- Preventative rule or checklist update: When the user explicitly prefers stronger process enforcement, implement that enforcement directly rather than softening it for ergonomics.
- Repo-specific nuance discovered: In this repo, aggressive planning reminders are a desired feature, not a nuisance, because they act as the continuity bridge across orchestrated tool and subagent calls.
