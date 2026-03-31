# Implementation Plan: MCP-to-CLI + Skills Migration

## Goal

Replace the repo's MCP-shaped workflow with a skill-directed CLI workflow, using `mcporter` only as an implementation detail where useful.

## File Structure

- Create: `skills/repo-discovery/SKILL.md`
  - Purpose: teach semantic and structural repo discovery through the new CLI workflow.
- Create: `skills/docs-research/SKILL.md`
  - Purpose: teach external docs/code research through the new CLI workflow.
- Create: `skills/annotation-sync/SKILL.md`
  - Purpose: teach annotation collection, acknowledgement, and resolution flow through CLI commands.
- Create: `config/mcporter.json`
  - Purpose: hold the repo-owned mcporter server definitions after `.mcp` removal.
- Modify: `opencode.json`
  - Purpose: remove active `.mcp` config and keep only non-MCP OpenCode config.
- Modify: `agent-permissions.jsonc`
  - Purpose: remove MCP-family policy and keep skill-centric policy only.
- Modify: `plugins/agent-permissions.ts`
  - Purpose: stop enforcing MCP-family restrictions and keep skill governance clean.
- Modify: `plugins/agent-permissions/filesystem.ts`
  - Purpose: remove MCP discovery and policy resolution tied to `opencode.json`.
- Modify: `plugins/agent-permissions/tooling.ts`
  - Purpose: remove MCP-tool-family detection helpers that no longer apply.
- Modify: `CONTEXTPLUS.md`
  - Purpose: rewrite Context+ guidance into repo-discovery CLI guidance.
- Modify: `agents/explorer.md`
  - Purpose: route repo-understanding work to `repo-discovery`.
- Modify: `agents/librarian.md`
  - Purpose: route external research work to `docs-research`, with local repo checks routed through `repo-discovery`.
- Modify: `agents/cursor.md`
  - Purpose: replace direct MCP-family instructions with skill-directed routing.
- Modify: `skills/agentation/SKILL.md`
  - Purpose: remove MCP-centric setup guidance and point runtime annotation work to the new skills.
- Modify: `skills/agentation-self-driving/SKILL.md`
  - Purpose: keep browser flow, but replace MCP-connected annotation assumptions with CLI/skill-driven sync guidance.
- Modify: `README.md`
  - Purpose: document the CLI + skills architecture instead of MCP servers.
- Modify: `install.sh`
  - Purpose: install/bootstrap the CLI-first workflow and stop pre-caching `.mcp` dependencies from `opencode.json`.

## Task 1: Add mcporter-owned config surface

**Files:**

- Create: `config/mcporter.json`
- Modify: `opencode.json`

- [ ] **Step 1: Create `config/mcporter.json` with the migrated server definitions**

```json
{
  "mcpServers": {
    "agentation": {
      "command": "bunx",
      "args": ["agentation-mcp", "server"]
    },
    "context7": {
      "command": "bunx",
      "args": ["@upstash/context7-mcp"]
    },
    "exa": {
      "url": "https://mcp.exa.ai/mcp?tools=web_search_exa,web_search_advanced_exa,get_code_context_exa,crawling_exa,company_research_exa,people_search_exa"
    },
    "contextplus": {
      "command": "bunx",
      "args": ["contextplus"],
      "env": {
        "OLLAMA_EMBED_MODEL": "${OLLAMA_EMBED_MODEL}",
        "OLLAMA_CHAT_MODEL": "${OLLAMA_CHAT_MODEL}",
        "OLLAMA_API_KEY": "${OLLAMA_API_KEY}",
        "CONTEXTPLUS_EMBED_BATCH_SIZE": "${CONTEXTPLUS_EMBED_BATCH_SIZE}",
        "CONTEXTPLUS_EMBED_TRACKER": "${CONTEXTPLUS_EMBED_TRACKER}"
      }
    }
  }
}
```

- [ ] **Step 2: Remove `.mcp` from `opencode.json` and keep the rest intact**

```json
{
  "$schema": "https://opencode.ai/config.json",
  "permissions": {
    "question": "allow",
    "websearch": "allow",
    "lsp": "allow"
  },
  "plugin": [
    "@franlol/opencode-md-table-formatter@0.0.3",
    "@tarquinen/opencode-dcp@latest"
  ]
}
```

- [ ] **Step 3: Verify the new canonical config split is on disk**

Run: review both files and confirm `config/mcporter.json` now owns the server definitions while `opencode.json` does not contain `.mcp`.

- [ ] **Step 4: Commit**

```bash
git add config/mcporter.json opencode.json
git commit -m "refactor: move MCP server config behind mcporter"
```

## Task 2: Remove MCP-family policy from permissions

**Files:**

- Modify: `agent-permissions.jsonc`
- Modify: `plugins/agent-permissions.ts`
- Modify: `plugins/agent-permissions/filesystem.ts`
- Modify: `plugins/agent-permissions/tooling.ts`

- [ ] **Step 1: Remove `mcps` policy entries from `agent-permissions.jsonc`**

```jsonc
{
  "defaults": {
    "skills": ["!*"]
  },
  "agents": {
    "orchestrator": { "skills": ["*"] },
    "cursor": { "skills": ["*"] },
    "build": { "skills": ["*"] },
    "general": { "skills": ["*"] },
    "plan": { "skills": ["*"] },
    "explorer": { "skills": ["repo-discovery"] },
    "librarian": { "skills": ["repo-discovery", "docs-research"] },
    "oracle": { "skills": ["repo-discovery", "docs-research"] },
    "designer": { "skills": ["agentation-setup", "self-driving-review", "annotation-sync"] },
    "fixer": { "skills": ["repo-discovery"] },
    "planner": { "skills": ["repo-discovery"] },
    "code-reviewer": { "skills": ["repo-discovery"] },
    "doc-updater": { "skills": ["repo-discovery", "docs-research"] },
    "refactor-cleaner": { "skills": ["repo-discovery"] }
  }
}
```

- [ ] **Step 2: Simplify `plugins/agent-permissions/filesystem.ts` to resolve skills only**

```ts
export type CapabilityPolicy = {
  skills?: string[]
}

export type ResolvedPolicy = {
  skills: string[]
}

export async function resolvePolicy(args: {
  agentName: string
  root: string
  configRoot: string
  configCandidates: string[]
}): Promise<ResolvedPolicy> {
  const [config, availableSkills] = await Promise.all([
    readPermissionsConfig(args.configCandidates),
    readAvailableSkills(args.root, args.configRoot),
  ])

  const agentPolicy = config.agents?.[args.agentName]
  const fallback = config.defaults ?? {}

  return {
    skills: resolveList(agentPolicy?.skills ?? fallback.skills, availableSkills),
  }
}
```

- [ ] **Step 3: Remove MCP detection from `plugins/agent-permissions/tooling.ts`**

```ts
type MutableArgs = Record<string, unknown>

export function summarize(items: string[]): string {
  return items.length > 0 ? items.join(', ') : 'none'
}

export function requestedSkillName(args: unknown): string | undefined {
  if (!args || typeof args !== 'object') return undefined

  const record = args as MutableArgs
  for (const key of ['name', 'skill', 'skillName']) {
    if (typeof record[key] === 'string') return record[key] as string
  }

  return undefined
}
```

- [ ] **Step 4: Update `plugins/agent-permissions.ts` to stop reading or enforcing MCP policy**

```ts
const policy = await resolvePolicy({
  agentName,
  root,
  configRoot,
  configCandidates,
})

const reminder = [
  `Agent capability policy for ${agentName}:`,
  `- Allowed skills: ${summarize(policy.skills)}`,
  '- MCP-backed tool families are not part of this repo workflow.',
  '- Use approved skills to access CLI-backed workflows.',
].join('\n')
```

- [ ] **Step 5: Verify the permissions plugin still loads**

Run:

```bash
bun --eval "await import('./plugins/agent-permissions.ts'); await import('./plugins/agent-permissions/filesystem.ts'); await import('./plugins/agent-permissions/tooling.ts'); console.log('ok')"
```

Expected: `ok`

- [ ] **Step 6: Commit**

```bash
git add agent-permissions.jsonc plugins/agent-permissions.ts plugins/agent-permissions/filesystem.ts plugins/agent-permissions/tooling.ts
git commit -m "refactor: remove MCP-family permission enforcement"
```

## Task 3: Add the new skill surfaces

**Files:**

- Create: `skills/repo-discovery/SKILL.md`
- Create: `skills/docs-research/SKILL.md`
- Create: `skills/annotation-sync/SKILL.md`

- [ ] **Step 1: Write `skills/repo-discovery/SKILL.md`**

```md
---
name: repo-discovery
description: Semantic and structural repository discovery through CLI-backed workflows.
---

# Repo Discovery

Use this skill when the job is understanding a local repository: structure, symbol locations, blast radius, call paths, and targeted file inspection.

## Workflow

1. Start with structural discovery.
2. Use the repo-owned CLI commands that wrap `mcporter` or direct tooling.
3. Search broadly first, then confirm exact files and lines.
4. Before recommending symbol rewrites or removals, run the blast-radius workflow.

## Command Pattern

Use the repo discovery commands documented by this repo, for example:

```bash
bin/repo-discovery tree
bin/repo-discovery search "authentication flow"
bin/repo-discovery symbols "SessionManager"
bin/repo-discovery blast-radius "SessionManager" --file src/session.ts
```
```

- [ ] **Step 2: Write `skills/docs-research/SKILL.md`**

```md
---
name: docs-research
description: Official docs, API examples, and targeted external research through CLI-backed workflows.
---

# Docs Research

Use this skill for official docs lookup, API examples, version-sensitive research, and known-URL extraction.

## Workflow

1. Prefer official docs first.
2. Use repo-owned docs-research commands.
3. Include source URLs in summaries.
4. If local repo context matters, pair this skill with `repo-discovery`.

## Command Pattern

```bash
bin/docs-research code "Next.js partial prerendering"
bin/docs-research web "latest Exa API auth docs"
bin/docs-research crawl https://github.com/steipete/mcporter
```
```

- [ ] **Step 3: Write `skills/annotation-sync/SKILL.md`**

```md
---
name: annotation-sync
description: Annotation collection, acknowledgement, and resolution through CLI-backed workflows.
---

# Annotation Sync

Use this skill when the job is consuming, acknowledging, replying to, or resolving annotations.

## Workflow

1. List active annotation sessions.
2. Fetch pending annotations.
3. Acknowledge before acting.
4. Resolve only after the requested change is complete.

## Command Pattern

```bash
bin/annotation-sync sessions
bin/annotation-sync pending --session <id>
bin/annotation-sync acknowledge <annotation-id>
bin/annotation-sync resolve <annotation-id> --summary "Adjusted CTA spacing and hierarchy"
```
```

- [ ] **Step 4: Verify all new skills follow existing repo style**

Run: read each skill and confirm it names the capability, the workflow, and the CLI command pattern without exposing MCP-family instructions.

- [ ] **Step 5: Commit**

```bash
git add skills/repo-discovery/SKILL.md skills/docs-research/SKILL.md skills/annotation-sync/SKILL.md
git commit -m "feat: add CLI-first capability skills"
```

## Task 4: Rewrite prompts and docs around skills

**Files:**

- Modify: `CONTEXTPLUS.md`
- Modify: `agents/explorer.md`
- Modify: `agents/librarian.md`
- Modify: `agents/cursor.md`
- Modify: `README.md`

- [ ] **Step 1: Rewrite `CONTEXTPLUS.md` into CLI-oriented repo-discovery guidance**

```md
# Repo Discovery - Agent Instructions

## Purpose

You are equipped with the repo-discovery workflow. It gives you structural awareness of the codebase through CLI-backed commands and focused file reads.

## Fast Execute Mode

1. Start with the repo-discovery tree command.
2. Run independent discovery operations in parallel when possible.
3. Prefer structural discovery before broad file reads.
4. Before modifying or deleting symbols, run the blast-radius workflow.
```

- [ ] **Step 2: Update `agents/explorer.md` to route repo work through `repo-discovery`**

```md
# Tooling (local, read-only)

- `repo-discovery` skill for structural and semantic repo discovery (primary).
- `grep` for regex/content confirmation.
- `glob` for path discovery.
- `read` to inspect referenced files and confirm exact details.
```

- [ ] **Step 3: Update `agents/librarian.md` to route research through `docs-research` and `repo-discovery`**

```md
# Tooling

- `docs-research` skill for official library/framework docs and external API research.
- `repo-discovery` skill when local repo context must be matched to external guidance.
- `read` / `grep` / `glob` for exact local confirmation when needed.
```

- [ ] **Step 4: Update `agents/cursor.md` to replace direct MCP-family instructions with skill routing**

```md
## Repo and external discovery

- Use the `repo-discovery` skill for semantic repository understanding.
- Use the `docs-research` skill for external docs, API examples, and targeted web research.
- Do not rely on MCP-family tool names as part of the workflow contract.
```

- [ ] **Step 5: Update `README.md` so the repo is described as skills + CLI workflows, not MCP servers**

```md
# opencode-config

Reusable OpenCode config for agents, commands, skills, plugins, and CLI-backed capability workflows.

## What's Included

- CLI-first capability workflows for repo discovery, docs research, and annotation handling
- Skills that teach agents when and how to use those workflows
- Agent prompts that route work through skills instead of raw tool families
```

- [ ] **Step 6: Verify the rewritten prompts/docs no longer instruct direct MCP-family usage**

Run: search the edited files for `contextplus_`, `context7_`, `exa_`, and MCP-specific instruction language. Confirm remaining references are either historical or intentionally replaced.

- [ ] **Step 7: Commit**

```bash
git add CONTEXTPLUS.md agents/explorer.md agents/librarian.md agents/cursor.md README.md
git commit -m "refactor: route discovery and research through skills"
```

## Task 5: Update annotation-related skills

**Files:**

- Modify: `skills/agentation/SKILL.md`
- Modify: `skills/agentation-self-driving/SKILL.md`

- [ ] **Step 1: Remove MCP-centric setup guidance from `skills/agentation/SKILL.md`**

```md
6. **Recommend runtime skills instead of MCP setup**
   - For annotation event handling, load the `annotation-sync` skill.
   - For autonomous visual critique, load the `self-driving-review` skill.
   - Do not describe MCP setup as part of the normal repo workflow.
```

- [ ] **Step 2: Rewrite the two-session section in `skills/agentation-self-driving/SKILL.md`**

```md
## Two-Session Workflow (Full Self-Driving)

With the toolbar installed, use two skills:

- **Session 1**: `self-driving-review` drives the page in the visible browser and creates annotations.
- **Session 2**: `annotation-sync` consumes pending annotations through the CLI workflow and applies code changes.

The user watches Session 1 critique the page while Session 2 resolves the requested changes in the codebase.
```

- [ ] **Step 3: Verify these skills still describe the browser flow clearly without MCP assumptions**

Run: read both skills and confirm setup, review, and sync responsibilities are clearly separated.

- [ ] **Step 4: Commit**

```bash
git add skills/agentation/SKILL.md skills/agentation-self-driving/SKILL.md
git commit -m "refactor: split agentation setup from annotation sync"
```

## Task 6: Update installer/bootstrap for the CLI-first model

**Files:**

- Modify: `install.sh`
- Modify: `README.md`

- [ ] **Step 1: Replace `.mcp`-driven dependency bootstrap in `install.sh` with explicit CLI-first setup**

```bash
install_cli_workflow_deps() {
  local pkgs=(
    "mcporter@latest"
    "agentation-mcp@latest"
    "@upstash/context7-mcp@latest"
    "contextplus@latest"
  )

  log_info "Installing CLI workflow dependencies..."
  for pkg in "${pkgs[@]}"; do
    bunx --yes "$pkg" --help >/dev/null 2>&1 || true
  done
}
```

- [ ] **Step 2: Update `main()` to call the new installer function**

```bash
install_opencode_plugins
install_cli_workflow_deps
setup_config
```

- [ ] **Step 3: Update README install/setup text to reference the CLI-first workflow and `config/mcporter.json`**

```md
The repo ships a CLI-first capability layer. Server definitions live in `config/mcporter.json`, while agent workflows are routed through skills.
```

- [ ] **Step 4: Verify installer syntax**

Run:

```bash
bash -n install.sh
```

Expected: no output

- [ ] **Step 5: Commit**

```bash
git add install.sh README.md
git commit -m "chore: bootstrap CLI-first capability workflow"
```

## Task 7: Final verification and cleanup

**Files:**

- Modify: `.plans/task_plan.md`
- Modify: `.plans/findings.md`
- Modify: `.plans/progress.md`

- [ ] **Step 1: Run final load verification for changed plugin surfaces**

Run:

```bash
bun --eval "await import('./plugins/agent-permissions.ts'); await import('./plugins/agent-permissions/filesystem.ts'); await import('./plugins/agent-permissions/tooling.ts'); console.log('ok')"
```

Expected: `ok`

- [ ] **Step 2: Run final targeted search for stale MCP workflow instructions**

Run: inspect the edited prompts, docs, and skills for stale MCP-family guidance. Leave only references that are explicitly historical or implementation-detail notes.

- [ ] **Step 3: Update planning memory with the completed migration summary**

```md
- `.mcp` removed from active repo workflow.
- skills now form the stable interface for repo discovery, docs research, and annotation sync.
- permissions no longer derive policy from discovered MCP families.
```

- [ ] **Step 4: Commit**

```bash
git add .plans/task_plan.md .plans/findings.md .plans/progress.md
git commit -m "chore: record CLI-first migration completion"
```

## Self-Review

- Spec coverage: the plan covers config migration, permission redesign, new skill surfaces, prompt/doc rewrites, installer changes, annotation workflow updates, and final verification.
- Placeholder scan: no `TODO`, `TBD`, or deferred implementation placeholders remain.
- Consistency check: the plan consistently uses the approved capability names `repo-discovery`, `docs-research`, `annotation-sync`, `self-driving-review`, and `agentation-setup`.
