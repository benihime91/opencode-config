---
name: brainstorming
description: Use when a task needs requirement discovery, scope shaping, behavior decisions, design approval, or construction planning before implementation. Also covers multi-session blueprint planning for complex multi-PR projects.
---

# Brainstorming Ideas Into Designs

Turn a loose request into an approved design. Start with project context, ask one question at a time, present options, and stop at design approval.

<HARD-GATE>
Do not take implementation action until you have presented a design and the user has approved it.
This gate applies to design decisions and multi-step planning. It does NOT block agents from proceeding autonomously on micro-steps within an already-approved plan or on work where the user provided a precise, implementation-ready spec.
</HARD-GATE>

## When To Use

- feature requests
- behavior changes
- refactors with unclear desired outcomes
- multi-step work with open design choices
- any request where success criteria are not yet concrete
- multi-session or multi-PR projects that need a construction blueprint
- coordinating parallel workstreams across sub-agents

Skip this skill only when the task is already implementation-ready and the desired outcome is precise.

## Core Flow

1. Explore the current project context.
2. Ask one clarifying question at a time.
3. Run a lightweight readiness pass.
4. Present 2-3 viable options with a recommendation.
5. Present the design and get approval.
6. If needed and you are using file-based planning (`planning-with-files`), write the design to `.plans/specs/YYYY-MM-DD-<topic>-design.md`. Otherwise keep the approved design in the conversation or paths the user prefers.
7. When `.plans/` is active for this task, register any written spec in `.plans/task_plan.md` under `Active Artifacts`.
8. If the workflow needs an implementation plan, hand off to `writing-plans` after approval.

## Readiness Pass

- Confirm these are clear enough before presenting options:
  - intended outcome
  - scope
  - known constraints
  - success criteria
  - non-goals
  - decision boundaries
- If they are not clear enough, keep clarifying one question at a time.
- Keep the process proportional. Simple work still needs a short design, not a ceremony.

## Design Shape

Present options in this structure:

- **Principles**
- **Decision Drivers**
- **Viable Options**
- **Recommendation**

Use sections only as large as the task needs.

## Question Rules

- Use the native `question` tool.
- Ask one question per message.
- Prefer multiple choice when it keeps the user moving.
- If the task is too large for one spec, decompose it before going deeper.

## Written Spec

- Write a spec only when the task or workflow needs one.
- When using `planning-with-files`, save it to `.plans/specs/YYYY-MM-DD-<topic>-design.md` unless the user wants another path.
- Re-read it once for placeholders, contradictions, ambiguity, and scope drift.
- Ask the user to review the written spec before moving into implementation planning.

## Large-Scale Blueprint Mode

When the task spans multiple PRs, multiple sessions, or needs parallel workstreams, extend the core flow with blueprint planning:

### When To Activate Blueprint Mode

- Breaking a large feature into multiple PRs with dependency ordering
- Planning a refactor or migration that spans multiple sessions
- Coordinating parallel workstreams across sub-agents
- Any task where context loss between sessions would cause rework

### Blueprint Pipeline

After the core design is approved, run these additional phases:

1. **Decompose** — Break the approved design into one-PR-sized steps (3-12 typical). Assign dependency edges, parallel/serial ordering, and model tier per step.
2. **Cold-Start Briefs** — Write a self-contained context brief for each step so a fresh agent can execute it without reading prior steps. Include task list, verification commands, and exit criteria.
3. **Dependency Graph** — Identify steps that can run in parallel (no shared files or output dependencies) vs. steps that must be serial.
4. **Adversarial Review** — Review the plan against a checklist: completeness, dependency correctness, missing verification, and anti-patterns (circular deps, shared mutable state across steps, missing rollback).
5. **Register** — Save the blueprint to `.plans/YYYY-MM-DD-<topic>-blueprint.md` and register it in `.plans/task_plan.md` under `Active Artifacts`.

### Plan Mutation Protocol

Steps can be split, inserted, skipped, reordered, or abandoned after initial approval. Each mutation must note the reason and update the dependency graph.

## Output Contract

- End at design approval (standard mode) or blueprint registration (blueprint mode).
- Do not delegate spec writing.
- Do not move into implementation before approval.
- Use `writing-plans` next only when a written implementation plan is required.

## Process Flow

```dot
digraph brainstorming {
    "Explore project context" [shape=box];
    "Ask clarifying questions" [shape=box];
    "Readiness pass" [shape=box];
    "Propose 2-3 approaches" [shape=box];
    "Present design sections" [shape=box];
    "User approves design?" [shape=diamond];
    "Write design doc" [shape=box];
    "Spec self-review\n(fix inline)" [shape=box];
    "User reviews spec?" [shape=diamond];
    "Invoke writing-plans skill" [shape=doublecircle];

    "Explore project context" -> "Ask clarifying questions";
    "Ask clarifying questions" -> "Readiness pass";
    "Readiness pass" -> "Ask clarifying questions" [label="not ready"];
    "Readiness pass" -> "Propose 2-3 approaches" [label="ready"];
    "Propose 2-3 approaches" -> "Present design sections";
    "Present design sections" -> "User approves design?";
    "User approves design?" -> "Present design sections" [label="no, revise"];
    "User approves design?" -> "Write design doc" [label="yes"];
    "Write design doc" -> "Spec self-review\n(fix inline)";
    "Spec self-review\n(fix inline)" -> "User reviews spec?";
    "User reviews spec?" -> "Write design doc" [label="changes requested"];
    "User reviews spec?" -> "Invoke writing-plans skill" [label="approved"];
}
```
