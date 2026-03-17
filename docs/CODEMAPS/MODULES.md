# Module Codemap

**Last Updated:** 2026-03-17
**Entry Points:** `opencode.json`, `AGENTS.md`, `commands/*.md`, `agents/*.md`, `plugins/planning-with-files.ts`, `skills/*/SKILL.md`

## Root Configuration

### Runtime Configuration

**Purpose**: Defines how OpenCode loads this workspace and which external runtimes it can use.

**Location**: `./`

**Key Files**:

- `opencode.json` - Main runtime config for plugins, MCP servers, orchestrator permissions, and LSP.
- `AGENTS.md` - Global execution policy for every task in the repo.
- `README.md` - Human-facing install and setup guide.
- `package.json` - Declares the `@opencode-ai/plugin` dependency.
- `versions.json` - Version registry for plugin, MCP, and tool bootstrap references.
- `dcp.jsonc` - Schema reference for dynamic context pruning configuration.
- `CONTEXTPLUS.md` - Operating guide for semantic repo navigation.
- `install.sh` - Bootstrap installer and symlink setup.

**Dependencies**:

- OpenCode config schema
- Local executables referenced in `opencode.json`
- GitHub CLI, git, bun or npm for installation

**Exports**:

- `opencode.json#plugin` - Plugin package list
- `opencode.json#agent.orchestrator.permission.task` - Subagent delegation rules
- `opencode.json#mcp` - MCP server registry
- `opencode.json#lsp` - LSP server registry

**Usage Example**:

```json
{
  "$schema": "https://opencode.ai/config.json"
}
```

---

## Executable Module

### Planning Plugin

**Purpose**: Adds file-backed planning reminders and completion status checks to OpenCode sessions.

**Location**: `plugins/`

**Key Files**:

- `plugins/planning-with-files.ts` - Plugin factory and hook registration.
- `skills/planning-with-files/scripts/check-complete.sh` - Completion checker invoked by the plugin.

**Dependencies**:

- Node built-ins: `fs`, `path`, `url`
- `bun` runtime import for shell execution
- Planning files under `docs/`
- Session message metadata from the OpenCode client

**Exports**:

- `PlanningWithFilesPlugin` - Async plugin factory
- `append()` - Shared output helper
- `planHead()` - Reads the top of `docs/task_plan.md`

**Usage Example**:

```typescript
import { PlanningWithFilesPlugin } from "./plugins/planning-with-files"
```

---

## Agent Modules

### Agent Pack

**Purpose**: Supplies the instruction sets that commands and the runtime route work to.

**Location**: `agents/`

**Key Files**:

- `agents/orchestrator.md` - Primary coordinator and delegation policy.
- `agents/designer.md` - UI and visual design specialist.
- `agents/explorer.md` - Codebase discovery specialist.
- `agents/fixer.md` - Fast implementation specialist.
- `agents/librarian.md` - External docs and library research specialist.
- `agents/oracle.md` - High-stakes technical advisor.
- `agents/doc-updater.md` - Documentation and codemap specialist.
- `agents/refactor-cleaner.md` - Dead-code and duplication cleanup specialist.
- `agents/security-reviewer.md` - Security review specialist.

**Dependencies**:

- OpenCode agent loader
- `AGENTS.md` repo-wide rules
- Command frontmatter agent names

**Exports**:

- `orchestrator`
- `designer`
- `explorer`
- `fixer`
- `librarian`
- `oracle`
- `doc-updater`
- `refactor-cleaner`
- `security-reviewer`

**Usage Example**:

```yaml
agent: doc-updater
```

---

## Command Modules

### Slash Command Pack

**Purpose**: Defines repo-local command workflows, tool restrictions, and expected output shape.

**Location**: `commands/`

**Key Files**:

- `plan.md` - Planning workflow routed to `orchestrator`.
- `checkpoint.md` - Progress checkpoint workflow routed to `doc-updater`.
- `code-review.md` - Review workflow routed to `oracle`.
- `refactor-clean.md` - Cleanup workflow routed to `refactor-cleaner`.
- `update-docs.md` - Documentation sync workflow routed to `doc-updater`.
- `update-codemaps.md` - Codemap refresh workflow routed to `doc-updater`.
- `learn.md` - Session learning capture routed to `doc-updater`.
- `skill-create.md` - Skill generation from git history routed to `doc-updater`.
- `commit-push.md` - Git-only commit and push workflow.
- `commit-push-pr.md` - Git-only commit, push, and PR workflow.

**Dependencies**:

- Agent names declared in command frontmatter
- Git context interpolation in command bodies
- Allowed-tool constraints for git workflows

**Exports**:

- `/plan`
- `/checkpoint`
- `/code-review`
- `/refactor-clean`
- `/update-docs`
- `/update-codemaps`
- `/learn`
- `/skill-create`
- `/commit-push`
- `/commit-push-pr`

**Usage Example**:

```md
/update-codemaps
```

---

## Skill Modules

### Skill Pack

**Purpose**: Ships reusable workflows that agents can load for specialized tasks.

**Location**: `skills/`

**Key Files**:

- `skills/agentation/SKILL.md` - Add Agentation toolbar to a Next.js app.
- `skills/agentation-self-driving/SKILL.md` - Autonomous visual critique workflow.
- `skills/agentation-self-driving/references/two-session-workflow.md` - Setup notes for the self-driving workflow.
- `skills/article-writing/SKILL.md` - Long-form writing workflow.
- `skills/planning-with-files/SKILL.md` - Persistent planning methodology.
- `skills/planning-with-files/templates/*.md` - Planning document templates.
- `skills/planning-with-files/examples.md` - Example planning usage.
- `skills/planning-with-files/reference.md` - Planning method reference.
- `skills/search-first/SKILL.md` - Research-first workflow before implementation.

**Dependencies**:

- Skill loader in OpenCode
- External MCPs or browser tooling referenced by individual skills
- `docs/task_plan.md`, `docs/findings.md`, and `docs/progress.md` for `planning-with-files`

**Exports**:

- `agentation`
- `agentation-self-driving`
- `article-writing`
- `planning-with-files`
- `search-first`

**Usage Example**:

```md
Use the `planning-with-files` skill before starting a complex task.
```

---

## Documentation Modules

### Planning and Codemap Docs

**Purpose**: Stores persistent task memory and generated navigation docs.

**Location**: `docs/`

**Key Files**:

- `docs/task_plan.md` - Current multi-phase task plan.
- `docs/findings.md` - Discoveries, corrections, and repo-specific rules.
- `docs/progress.md` - Session log and validation notes.
- `docs/CODEMAPS/INDEX.md` - Codemap overview.
- `docs/CODEMAPS/ARCHITECTURE.md` - System overview and relationships.
- `docs/CODEMAPS/MODULES.md` - Module inventory.
- `docs/CODEMAPS/FILES.md` - Directory and file navigation guide.

**Dependencies**:

- Documentation workflows in `commands/`
- Planning plugin reminders and checks

**Exports**:

- Persistent planning state
- Repo navigation documentation

---

## Dependency Graph

```text
README.md -> install.sh
install.sh -> opencode.json + AGENTS.md + dcp.jsonc + agents/ + commands/ + plugins/ + skills/

opencode.json -> plugin packages + MCP servers + LSP servers

commands/*.md -> agents/*.md
commands/update-codemaps.md -> agents/doc-updater.md -> docs/CODEMAPS/*.md
commands/plan.md -> agents/orchestrator.md -> specialist agents

plugins/planning-with-files.ts -> docs/task_plan.md
plugins/planning-with-files.ts -> skills/planning-with-files/scripts/check-complete.sh

skills/planning-with-files/SKILL.md -> docs/task_plan.md + docs/findings.md + docs/progress.md
skills/agentation-self-driving/SKILL.md -> references/two-session-workflow.md
```

## Related Maps

- [`INDEX.md`](INDEX.md)
- [`ARCHITECTURE.md`](ARCHITECTURE.md)
- [`FILES.md`](FILES.md)
