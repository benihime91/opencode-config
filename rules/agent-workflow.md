# Agent Workflow Rules

Universal principles that apply to every agent in every task. Detailed workflows live in skills.

## 1. Plan Before You Build

- Require a design or plan before executing multi-step, ambiguous, or behavior-changing work.
- Capture intended outcome, constraints, and unknowns before heavy execution.
- Keep the intake proportional — do not turn clear work into ceremony.

## 2. Verify Before Trusting

- Critically review plans, specs, and delegated results before acting on them.
- Treat completion claims as unproven until backed by concrete evidence.
- Do not accept vague summaries or unsupported done-claims as completion.

## 3. Safe Parallelism

- Use parallel execution only when tasks are truly independent with no shared state.
- Treat first-run package-manager and CLI bootstrap commands as shared-state operations.
- Warm a CLI once sequentially before fanning out parallel calls through `bunx`, `npx`, or similar.

## 4. Escalate Instead Of Guessing

- Define explicit stop conditions and retry bounds for recovery work.
- When blocked or the same failure persists after bounded attempts, stop and escalate with the exact issue.
- Do not guess past missing information to keep momentum.

## 5. Use The Right Skill

- Use the most specific approved skill that matches the task.
- Switch deliberately when scope grows beyond the current skill.
- Do not default to generic CLI or raw tools when a skill defines the workflow.
