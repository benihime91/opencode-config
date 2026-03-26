---
description: Create implementation plan with risk assessment
agent: planner
subtask: true
---

# Plan Command

Create a detailed implementation plan for: $ARGUMENTS

## Your Task

1. **Restate Requirements** - Clarify what needs to be built
2. **Identify Risks** - Surface potential issues, blockers, and dependencies
3. **Create Step Plan** - Break down implementation into phases
4. **Write Durable Plan Artifact** - Save the finalized plan to `.plans/YYYY-MM-DD-HHMM-<task-key>.md`
5. **Respect Ownership** - Do not edit `.plans/task_plan.md`, `.plans/findings.md`, or `.plans/progress.md`

## Output Format

### Requirements Restatement

[Clear, concise restatement of what will be built]

### Implementation Phases

[Phase 1: Description]

- Step 1.1
- Step 1.2
  ...

[Phase 2: Description]

- Step 2.1
- Step 2.2
  ...

### Dependencies

[List external dependencies, APIs, services needed]

### Risks

- HIGH: [Critical risks that could block implementation]
- MEDIUM: [Moderate risks to address]
- LOW: [Minor concerns]

### Estimated Complexity

[HIGH/MEDIUM/LOW with time estimates]

### Plan Artifact

- Path created: `.plans/YYYY-MM-DD-HHMM-<task-key>.md`
- Includes: requirements, phases, dependencies, risks, and complexity
- Ownership note: planning trio (`task_plan.md`, `findings.md`, `progress.md`) unchanged by planner

---

**CRITICAL**: This command is planning-only. Do not write or modify implementation code.
