# Findings & Decisions

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

## Second Pass — Orchestrator Delegation Tightening (2026-03-31)

- `agents/orchestrator.md` got a follow-up wording pass focused only on delegation quality and post-subagent handling.
- The mandatory delegation package now includes an explicit silent self-check before sending any handoff: define done-state clearly, name exact known files/sections, state required evidence, state what must remain unchanged, and explain what changed on retries.
- The subagent response contract is now stricter about false-positive completion: vague `SUMMARY`, weak `FILES`, weak `VERIFICATION`, or material work hidden in `FOLLOW_UP` must all be treated as incomplete work.
- The verification checklist now also distinguishes review-only work from edit work and requires the orchestrator to either accept/persist the result or redelegate with the exact gap instead of leaving partially trusted results unresolved.
- This pass did not change the response schema shape; it tightened orchestrator interpretation and enforcement, which better matches the OMO lesson that reliability comes from orchestrator distrust + follow-through more than from adding more formatting.

## Starting Point For This Pass

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
- Added a `Planning Persistence After Tool Results` section to `agents/cursor.md` requiring the same progress/task-plan/findings discipline after meaningful tool and subagent outputs.

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
