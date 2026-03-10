# opencode-config

My personal [OpenCode](https://opencode.ai) configuration — agents, commands, skills, plugins, and MCP servers.

## Install

```bash
curl -fsSL https://raw.githubusercontent.com/benihime91/opencode-config/refs/heads/main/install.sh | bash
```

The installer will:

1. Install `git`, `bun`/`node`, and `jq` if missing
2. Authenticate with GitHub via `gh` (no password prompts)
3. Clone this repo to `~/opencode-config`
4. Back up any existing `~/.config/opencode/` configuration
5. Symlink all config files so edits in the repo are live immediately
6. Install plugin dependencies and pre-cache all npx MCP packages
7. Install `auggie` (`@augmentcode/auggie`) for the semantic codebase search MCP
8. Install `opencode` if missing

### After Install

```bash
# 1. Reload your shell (if nvm or bun were freshly installed)
source ~/.zshrc   # zsh
source ~/.bashrc  # bash

# 2. Authenticate with your LLM provider
opencode auth
# or set env vars: ANTHROPIC_API_KEY, OPENAI_API_KEY, etc.

# 3. Authenticate auggie (one-time browser OAuth)
auggie login

# 4. Set optional MCP API keys
export EXA_API_KEY=<your-key>   # exa web search — add to ~/.zshrc to persist

# 5. Launch
opencode
```

## Manual Install

```bash
gh repo clone benihime91/opencode-config ~/opencode-config
mkdir -p ~/.config/opencode
ln -sf ~/opencode-config/opencode.json ~/.config/opencode/opencode.json
ln -sf ~/opencode-config/AGENTS.md ~/.config/opencode/AGENTS.md
ln -sf ~/opencode-config/dcp.jsonc ~/.config/opencode/dcp.jsonc
ln -sfn ~/opencode-config/agents ~/.config/opencode/agents
ln -sfn ~/opencode-config/commands ~/.config/opencode/commands
ln -sfn ~/opencode-config/plugins ~/.config/opencode/plugins
ln -sfn ~/opencode-config/skills ~/.config/opencode/skills
cd ~/opencode-config && bun install
ln -sfn ~/opencode-config/node_modules ~/.config/opencode/node_modules
```

## Updating

```bash
cd ~/opencode-config && git pull && bash install.sh
```

Changes are live immediately via symlinks.

## What's Included

### Agents

Custom agent definitions in `agents/`:

| Agent | Purpose |
|---|---|
| `architect` | System design and architectural decisions |
| `code-reviewer` | Code quality, security, and maintainability review |
| `doc-updater` | Documentation and codemap updates |
| `explorer` | Fast read-only codebase navigation — "Where is X?", "Find Y" |
| `planner` | Complex feature planning and implementation planning |
| `refactor-cleaner` | Dead code cleanup and consolidation |
| `security-reviewer` | Security vulnerability detection |

### Commands (Slash Commands)

Custom slash commands in `commands/`:

| Command | Purpose |
|---|---|
| `/checkpoint` | Snapshot current session state to planning files |
| `/code-review` | Run a code review on current changes |
| `/commit-push-pr` | Commit, push, and create a PR |
| `/learn` | Research and learn about a topic |
| `/plan` | Create a detailed implementation plan |
| `/refactor-clean` | Identify and remove dead code |
| `/skill-create` | Analyze git history and generate a skill |
| `/update-codemaps` | Update project codemaps |
| `/update-docs` | Update project documentation |

### Skills

| Skill | Purpose |
|---|---|
| `agentation` | Add the Agentation visual feedback toolbar to a Next.js project |
| `agentation-self-driving` | Autonomous design critique mode using the Agentation toolbar |
| `article-writing` | Write long-form content with consistent voice |
| `coding-standards` | Universal coding standards for TS/JS/React/Node |
| `frontend-patterns` | React/Next.js patterns, state management, performance |
| `search-first` | Research-before-coding workflow; invokes the explorer agent |

### Plugins

- **planning-with-files** — Persistent markdown-based task planning ("working memory on disk")
- **opencode-md-table-formatter** — Markdown table formatting
- **opencode-dcp** — DCP integration

### MCP Servers

| Server | Purpose |
|---|---|
| `agentation` | Annotation session management |
| `augment-context-engine` | Semantic codebase search (requires `auggie login`) |
| `chrome-devtools` | Browser automation and DevTools access |
| `context7` | Up-to-date library documentation |
| `exa` | Web search and code context retrieval (requires `EXA_API_KEY`) |

## Structure

```
opencode-config/
├── install.sh              # Bootstrap installer
├── opencode.json           # Main config (MCPs, plugins, LSP)
├── AGENTS.md               # Global agent instructions
├── dcp.jsonc               # DCP config
├── agents/                 # Custom agent definitions
│   ├── architect.md
│   ├── code-reviewer.md
│   ├── doc-updater.md
│   ├── explorer.md
│   ├── planner.md
│   ├── refactor-cleaner.md
│   └── security-reviewer.md
├── commands/               # Custom slash commands
├── plugins/                # Plugin files and assets
│   └── planning-with-files/
└── skills/                 # Skill definitions
    ├── agentation/
    ├── agentation-self-driving/
    ├── article-writing/
    ├── coding-standards/
    ├── frontend-patterns/
    └── search-first/
```
