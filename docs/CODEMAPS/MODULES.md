# Module Codemap

**Last Updated:** 2026-03-20
**Entry Points:** `README.md`, `install.sh`, `opencode.json`, `versions.json`, `dcp.jsonc`, `AGENTS.md`, `commands/*.md`, `agents/*.md`, `plugins/*.ts`, `skills/*/SKILL.md`, `docs/task_plan.md`, `docs/CODEMAPS/INDEX.md`

## Root Configuration

### Runtime Configuration

**Purpose**: Defines how OpenCode boots this workspace—what plugins load, which MCPs are reachable, and what policies govern agents.

**Location**: `./`

**Key Files**:

- `README.md` - Installation instructions, prerequisites, and navigation tips for contributors.
- `install.sh` - Clones the repo, links configuration into `~/.config/opencode`, and installs runtime dependencies.
- `opencode.json` - Declares plugins, MCPs, LSP servers, and orchestrator permissions.
- `versions.json` - Pins versions for plugin, MCP, and tooling dependencies referenced from `opencode.json`.
- `dcp.jsonc` - Describes the dynamic context pruning schema used by the `@tarquinen/opencode-dcp` plugin.
- `AGENTS.md` - Repository-wide policy on tools, editing expectations, and flow control.
- `CONTEXTPLUS.md` - Guidance for using semantic navigation helpers such as Context+.

**Dependencies**:

- OpenCode configuration schema (`https://opencode.ai/config.json`).
- Local runtime (`git`, `gh`, `bun`/`npm`).
- JSON/Markdown support for documentation files.

**Exports**:

- `opencode.json#plugin` - Plugin list consumed by the orchestrator.
- `opencode.json#agent` - Agent declarations for dispatcher routing.
- `opencode.json#mcp` - MCP registry (exa, context7, browsers, annotation tooling).
- `versions.json` - Version pins referenced by `install.sh` and `opencode.json`.
- `AGENTS.md` - Policy instructions consumed by every agent.

**Usage Example**:

```json
{
  "$schema": "https://opencode.ai/config.json",
  "plugins": ["@franlol/opencode-md-table-formatter"]
}
```

---

## Executable Modules

### Planning Plugin

**Purpose**: Watches chat lifecycle events and writes planning reminders plus completion hints to the planning docs.

**Location**: `plugins/`

**Key Files**:

- `plugins/planning-with-files.ts` - Plugin factory that registers hooks for planning phases.
- `skills/planning-with-files/scripts/check-complete.sh` - Shell helper invoked by the plugin to annotate completion status.

**Dependencies**:

- Node built-ins: `fs`, `path`, `url`.
- `bun` runtime for shell execution and script launches.
- Planning docs under `docs/` and templates from `skills/planning-with-files/templates/`.

**Exports**:

- `PlanningWithFilesPlugin` - Async plugin factory for the OpenCode runtime.
- `append()` - Helper for writing to planning documents.
- `planHead()` - Reads the most recent plan section from `docs/task_plan.md`.

**Usage Example**:

```ts
import { PlanningWithFilesPlugin } from "./plugins/planning-with-files";
```

### Using Skills Plugin

**Purpose**: Injects the skill-enforcement system prompt so every response starts by checking skill obligations.

**Location**: `plugins/`

**Key Files**:

- `plugins/using-skills.ts` - Plugin that prepends `SKILL_PROMPT` to every session and wires the enforcement trigger.

**Dependencies**:

- `@opencode-ai/plugin` runtime interface.
- OpenCode session metadata.

**Exports**:

- `UsingSkillsPlugin` - Plugin factory.
- `SKILL_PROMPT` - The enforced instruction.

**Usage Example**:

```ts
import { UsingSkillsPlugin } from "./plugins/using-skills";
```

---

## Agent Modules

### Agent Pack

**Purpose**: Houses the instruction sets that commands wire to specific behaviors and workflows.

**Location**: `agents/`

**Key Files**:

- `orchestrator.md` - Delegates tasks and enforces policy.
- `planner.md` - Builds multi-phase implementation plans and assesses risk.
- `designer.md`, `fixer.md`, `librarian.md`, `oracle.md`, `explorer.md` - Specialist behaviors for UI, fixes, research, technical advice, and discovery.
- `doc-updater.md` - Updates documentation artifacts and codemaps.
- `refactor-cleaner.md` - Removes duplication and dead code.

**Dependencies**:

- `AGENTS.md` for global rules.
- Frontmatter-defined agent names in `commands/*.md`.
- Skills referenced within each agent script.

**Exports**:

- `orchestrator`, `planner`, `designer`, `explorer`, `fixer`, `librarian`, `oracle`, `doc-updater`, `refactor-cleaner` (Markdown content consumed by the orchestrator).

**Usage Example**:

```yaml
agent: planner
```

---

## Command Modules

### Slash Command Pack

**Purpose**: Defines repository-specific slash commands, tool constraints, and the agent each workflow uses.

**Location**: `commands/`

**Key Files**:

- `plan.md`, `checkpoint.md`, `code-review.md`, `refactor-clean.md`, `rollback.md` - Planning, checkpointing, clean-up, git rollback flows.
- `update-docs.md`, `update-codemaps.md`, `learn.md`, `skill-create.md` - Documentation-related workflows routed to `doc-updater`.
- `commit-push.md`, `commit-push-pr.md` - Git-only commit and push stories.

**Dependencies**:

- Agent names declared in each command's frontmatter.
- Git status and context interpolations within command bodies.
- Allowed-tool and step constraints for git and documentation workflows.

**Exports**:

- `/plan`, `/checkpoint`, `/code-review`, `/refactor-clean`, `/rollback`, `/update-docs`, `/update-codemaps`, `/learn`, `/skill-create`, `/commit-push`, `/commit-push-pr`.

**Usage Example**:

```md
/update-codemaps
```

---

## Skill Modules

### Skill Pack

**Purpose**: Packages reusable workflows (Agentation, planning, research, writing) that agents can load on demand.

**Location**: `skills/`

**Key Files**:

- `skills/agentation/SKILL.md` and `skills/agentation-self-driving/SKILL.md` + references for Agentation tooling.
- `skills/article-writing/SKILL.md` - Long-form writing workflows.
- `skills/planning-with-files/` - Planning methodology, templates, completion scripts, references, and examples.
- `skills/search-first/SKILL.md` - Research-before-you-code workflow.

**Dependencies**:

- Skill loader and skill enforcement plugin.
- External MCPs, e.g., `exa` for research-first tasks.
- Planning docs under `docs/` for templates used by `planning-with-files`.

**Exports**:

- `agentation`, `agentation-self-driving`, `article-writing`, `planning-with-files`, `search-first` (skill labels and Markdown instructions).

**Usage Example**:

```md
Use the `planning-with-files` skill before starting a complex task.
```

---

## Theme Modules

### Theme Pack

**Purpose**: Provides Poimandres-inspired color theme definitions for OpenCode’s UI.

**Location**: `themes/`

**Key Files**:

- `themes/poimandres.json` - Base dark Poimandres palette.
- `themes/poimandres-accessible.json` - Higher contrast variant.
- `themes/poimandres-turquoise-expanded.json` - Turquoise-accented variant.

**Dependencies**:

- OpenCode theme loader and JSON schema validation.

**Exports**:

- `poimandres`, `poimandres-accessible`, `poimandres-turquoise-expanded`.

**Usage Example**:

Theme selection occurs through OpenCode’s UI or config files.

---

## Documentation Modules

### Planning State Docs

**Purpose**: Stores persistent planning output, findings, and verification history for multi-phase tasks.

**Location**: `docs/`

**Key Files**:

- `docs/task_plan.md` - Active implementation plan.
- `docs/findings.md` - Repository-specific learnings and corrections.
- `docs/progress.md` - Verification log for tests and validation steps.

**Dependencies**:

- `plugins/planning-with-files.ts` for hook registration.
- `skills/planning-with-files` for templates and completion checks.
- Planning-focused commands such as `/plan`, `/checkpoint`, and `/commit-push`.

**Exports**:

- `docs/task_plan.md`, `docs/findings.md`, `docs/progress.md` as persistent planning artifacts.

**Usage Example**:

```bash
cat docs/task_plan.md
```

### Codemap Docs

**Purpose**: Provides architecture, module, file, and navigation overviews derived from the actual code layout.

**Location**: `docs/CODEMAPS/`

**Key Files**:

- `docs/CODEMAPS/INDEX.md` - Codemap index and entry pointers.
- `docs/CODEMAPS/ARCHITECTURE.md` - System overview, relationships, and data flow.
- `docs/CODEMAPS/MODULES.md` - Module inventory, dependencies, and APIs.
- `docs/CODEMAPS/FILES.md` - Directory tree, file purposes, and navigation guidance.

**Dependencies**:

- `commands/update-codemaps.md` and `agents/doc-updater.md` for regeneration.
- `skills/planning-with-files` and planning docs for context.

**Exports**:

- Codemap index, architecture summary, module catalog, and file map.

**Usage Example**:

```bash
less docs/CODEMAPS/ARCHITECTURE.md
```

---

## Dependency Graph

```text
README.md --> install.sh
install.sh --> opencode.json + AGENTS.md + versions.json + dcp.jsonc + commands/ + agents/ + plugins/ + skills/ + docs/ + themes/


commands/*.md --> agents/*.md
commands/update-codemaps.md --> agents/doc-updater.md --> docs/CODEMAPS/{INDEX,ARCHITECTURE,MODULES,FILES}.md
commands/update-docs.md --> agents/doc-updater.md --> docs/{task_plan,findings,progress}.md
commands/plan.md --> agents/planner.md --> docs/task_plan.md
commands/checkpoint.md --> docs/progress.md
commands/rollback.md --> git operations

plugins/planning-with-files.ts --> docs/{task_plan,findings,progress}.md
plugins/planning-with-files.ts --> skills/planning-with-files/scripts/check-complete.sh
plugins/using-skills.ts --> session system prompts

skills/search-first/SKILL.md --> exa + context7 research flow
```

## Related Maps

- [`INDEX.md`](INDEX.md)
- [`ARCHITECTURE.md`](ARCHITECTURE.md)
- [`FILES.md`](FILES.md)
