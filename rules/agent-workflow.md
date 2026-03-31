# Agent Workflow Rules

These rules govern how agents should scope, plan, verify, and route work in this repo.

## 1. Design And Plan Gates

- Require an explicit design or written implementation plan before executing multi-step, ambiguous, or behavior-changing work.
- Do not begin implementation from a loose request alone when the change needs real sequencing or design choices.
- Clarify requirements, choose an approach, record the design or plan, and only then execute.

See skills: `brainstorming`, `blueprint`, `writing-plans`, `executing-plans`

## 2. Bounded Work Units And Cold-Start Handoffs

- Break complex work into bounded units that can be explained briefly and executed independently.
- For each unit, define exact scope, affected files or surfaces, constraints, verification, and exit criteria.
- Write handoffs so a fresh agent can execute safely without prior session context.
- Do not leave structure, intent, or ownership implicit.

See skills: `blueprint`, `writing-plans`, `dispatching-parallel-agents`

## 3. Review Before Trust

- Critically review plans, specs, and delegated results before acting on them.
- Check for placeholders, contradictions, missing coverage, weak verification, and dependency mistakes.
- Do not proceed on summaries alone when the underlying artifact or file needs confirmation.

See skills: `brainstorming`, `writing-plans`, `executing-plans`, `dispatching-parallel-agents`

## 4. Durable Planning Memory

- Store durable task state in `.plans/` instead of relying on chat history alone.
- Update planning memory when phases change, important discoveries happen, errors occur, or work resumes after a gap.
- Do not keep important progress only in transient conversation context.

See skills: `planning-with-files`, `blueprint`, `brainstorming`, `writing-plans`

## 5. Safe Parallelism

- Use parallel agents or parallel execution only when tasks are truly independent and can proceed without shared state or overlapping change surfaces.
- If dependencies, ownership, or root cause are unclear, investigate or sequence the work first.
- Treat first-run package-manager and CLI bootstrap commands as shared-state operations unless proven otherwise. Do not parallelize commands that may race on the same cache, install, lock, or link state.
- Warm a CLI once sequentially before fanning out parallel calls when the tool is launched through `bunx`, `npx`, or a similar installer-backed wrapper.

See skills: `blueprint`, `dispatching-parallel-agents`

## 6. Escalate Instead Of Guessing

- When instructions are unclear, a blocker prevents safe progress, or verification keeps failing, stop and escalate with the exact issue and attempted remedies.
- Do not repeat the same failed action or guess past missing information.

See skills: `planning-with-files`, `executing-plans`

## 7. Skill Selection And Stable Interface

- Use the most specific approved skill that matches the task.
- If the task grows beyond that skill's scope, switch deliberately to the better-fit skill instead of stretching the current one.
- Do not default to generic CLI or raw tool usage when a domain-specific skill already defines the workflow.
- Present approved skills as the primary workflow interface rather than raw provider families.

See skills: `repo-discovery`, `docs-research`, `deep-research`, `mcporter`, `annotation-sync`

## 8. Canonical CLI Config

- When a workflow depends on repo-owned CLI configuration, pass the canonical config path explicitly.
- Do not rely on upstream defaults, implicit working-directory config discovery, or personal machine state.
- If a task intentionally uses a non-default config, say so explicitly.

See skills: `repo-discovery`, `docs-research`, `deep-research`, `mcporter`, `annotation-sync`

## 9. Evidence Confirmation

- Treat search hits, semantic matches, snippets, and summaries as leads, not proof.
- Before making a factual claim, read the relevant underlying file, document, or source directly.
- If evidence remains partial, label the claim as tentative and continue gathering support.
- Do not present guessed ownership, symbol paths, call chains, or research conclusions as confirmed without direct verification.

See skills: `repo-discovery`, `deep-research`
