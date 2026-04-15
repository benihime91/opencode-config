# Agent Workflow Rules

These rules govern how agents should scope, plan, verify, and route work in this repo.

## 1. Rules-vs-Skills Boundary

- Rules define durable cross-cutting policy.
- Skills define when a workflow applies, how to run it, and any task-shaped constraints inside that workflow.
- When both apply, start with the rule, then let the more specific skill narrow behavior within its scope.
- Do not duplicate step-by-step workflow playbooks in rules when a skill already owns them.

See skills: `brainstorming`, `planning-with-files`, `repo-discovery`, `docs-research`, `deep-research`

## 2. Design And Plan Gates

- Require an explicit design or written implementation plan before executing multi-step, ambiguous, or behavior-changing work.
- Do not begin implementation from a loose request alone when the change needs real sequencing or design choices.
- Clarify requirements, choose an approach, record the design or plan, and only then execute.

See skills: `brainstorming`, `writing-plans`, `executing-plans`

## 3. Pre-Execution Intake

- Before heavy planning or execution, capture the intended outcome, known context, unknowns, non-goals, decision boundaries, and readiness.
- Keep the intake lightweight. Do not turn clear, low-risk work into a ceremony.
- Use the intake to decide whether to clarify, plan, or execute.
- If readiness is low, keep resolving ambiguity before escalating into heavy planning or delegation.

See skills: `brainstorming`, `planning-with-files`, `writing-plans`

## 4. Bounded Work Units And Cold-Start Handoffs

- Break complex work into bounded units that can be explained briefly and executed independently.
- For each unit, define exact scope, affected files or surfaces, constraints, verification, and exit criteria.
- Write handoffs so a fresh agent can execute safely without prior session context.
- Do not leave structure, intent, or ownership implicit.

See skills: `brainstorming`, `writing-plans`, `dispatching-parallel-agents`

## 5. Stage-To-Stage Continuity

- Preserve assumptions, required outputs, evidence expectations, and residual risks when work moves between stages or agents.
- Do not make downstream stages infer missing context from vague summaries.
- Keep handoffs specific enough that the next stage can continue without reconstructing intent.
- If a handoff is missing critical continuity, stop and repair the handoff before proceeding.

See skills: `writing-plans`, `dispatching-parallel-agents`, `planning-with-files`

## 6. Review Before Trust

- Critically review plans, specs, and delegated results before acting on them.
- Check for placeholders, contradictions, missing coverage, weak verification, and dependency mistakes.
- Do not proceed on summaries alone when the underlying artifact or file needs confirmation.

See skills: `brainstorming`, `writing-plans`, `executing-plans`, `dispatching-parallel-agents`

## 7. Evidence-First Completion

- Treat completion claims as unproven until they are backed by concrete evidence.
- If evidence is missing, weak, or inconsistent with the claimed result, the task is still open.
- Do not accept vague summaries, unsupported done claims, or materially unresolved follow-up as completion.
- Match the claimed outcome to the actual verification evidence before reporting success.

See skills: `executing-plans`, `dispatching-parallel-agents`, `brainstorming`

## 8. Durable Planning Memory

- Use `.plans/` only for work that is long-running, multi-session, high-risk, or otherwise needs disk-backed continuity. Ordinary tasks can stay in chat plus normal repo artifacts.
- When you do adopt `.plans/`, store durable task state there instead of relying on chat history alone for that workstream.
- Update planning memory when phases change, important discoveries happen, errors occur, or work resumes after a gap.
- Re-read the active plan and shared planning files before resuming after a gap and before major decisions **for that workstream**.
- When `.plans/` exists for an active task, treat it as the source of truth for that task; do not rely on stale chat context alone for the same workstream.
- Do not keep important progress only in transient conversation context when you have committed to disk-backed planning for that task.

See skills: `planning-with-files`, `brainstorming`, `writing-plans`

## 9. Safe Parallelism

- Use parallel agents or parallel execution only when tasks are truly independent and can proceed without shared state or overlapping change surfaces.
- If dependencies, ownership, or root cause are unclear, investigate or sequence the work first.
- Treat first-run package-manager and CLI bootstrap commands as shared-state operations unless proven otherwise. Do not parallelize commands that may race on the same cache, install, lock, or link state.
- Warm a CLI once sequentially before fanning out parallel calls when the tool is launched through `bunx`, `npx`, or a similar installer-backed wrapper.

See skills: `brainstorming`, `dispatching-parallel-agents`

## 10. Escalate Instead Of Guessing

- Define explicit stop conditions and retry bounds for recovery work.
- When instructions are unclear, a blocker prevents safe progress, or the same class of failure persists after bounded attempts, stop and escalate with the exact issue and attempted remedies.
- Do not repeat the same failed action; either change the approach deliberately or stop and ask for guidance.
- Do not guess past missing information just to keep momentum.

See skills: `planning-with-files`, `executing-plans`

## 11. Skill Selection And Stable Interface

- Use the most specific approved skill that matches the task.
- If the task grows beyond that skill's scope, switch deliberately to the better-fit skill instead of stretching the current one.
- Do not default to generic CLI or raw tool usage when a domain-specific skill already defines the workflow.
- Present approved skills as the primary workflow interface rather than raw provider families.

See skills: `repo-discovery`, `docs-research`, `deep-research`, `annotation-sync`

## 12. MCP Tool Verification

- When using MCP tools, verify tool availability and argument shapes before relying on cached examples.
- If a tool call fails, check whether the MCP server is enabled and the tool schema matches your call.
- Do not assume MCP tool argument shapes are stable across versions without verification.

See skills: `docs-research`, `deep-research`, `firecrawl`, `annotation-sync`

## 13. Evidence Confirmation

- Treat search hits, semantic matches, snippets, and summaries as leads, not proof.
- Before making a factual claim, read the relevant underlying file, document, or source directly.
- If evidence remains partial, label the claim as tentative and continue gathering support.
- Do not present guessed ownership, symbol paths, call chains, or research conclusions as confirmed without direct verification.

See skills: `repo-discovery`, `deep-research`

## 14. Source Hierarchy For Research

- Prefer official, primary, or highest-authority sources first when researching APIs, libraries, products, companies, or market facts.
- Use lower-authority sources as supporting context, not the default basis for conclusions.
- When higher-authority sources are unavailable, say so explicitly and lower confidence accordingly.

See skills: `docs-research`, `deep-research`, `article-writing`

## 15. Fallback And Failure Classification

- When a provider-specific path fails, use the documented fallback or recovery path before escalating if an equivalent route still exists.
- Distinguish likely failure classes first: schema mismatch, feature gating, provider availability, auth/config, or environment/runtime issues.
- Do not redesign the workflow or report a hard blocker until the narrower fallback or recovery path has been tried or ruled out.

See skills: `deep-research`, `firecrawl`