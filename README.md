# opencode-config

My personal [OpenCode](https://opencode.ai) configuration — agents, commands, skills, plugins, and MCP servers.

## One-liner Install

```bash
curl -fsSL https://raw.githubusercontent.com/ayushmanburagohain/opencode-config/main/install.sh | bash
```

This will:
1. Install `git`, `bun`, and `opencode` if missing
2. Clone this repo to `~/opencode-config`
3. Back up any existing `~/.config/opencode/` configuration
4. Symlink all config files so edits in the repo are live immediately
5. Install plugin dependencies

## Manual Install

```bash
git clone https://github.com/ayushmanburagohain/opencode-config.git ~/opencode-config
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

On any machine where this is installed:

```bash
cd ~/opencode-config && git pull
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
| `planner` | Complex feature planning and implementation planning |
| `refactor-cleaner` | Dead code cleanup and consolidation |
| `security-reviewer` | Security vulnerability detection |

### Commands (Slash Commands)

Custom slash commands in `commands/`:

| Command | Purpose |
|---|---|
| `/code-review` | Run a code review on current changes |
| `/commit-push-pr` | Commit, push, and create a PR |
| `/learn` | Research and learn about a topic |
| `/plan` | Create a detailed implementation plan |
| `/refactor-clean` | Identify and remove dead code |
| `/skill-create` | Create a new skill |
| `/update-codemaps` | Update project codemaps |
| `/update-docs` | Update project documentation |

### Plugins

- **planning-with-files** — Persistent markdown-based task planning ("working memory on disk")

### Skills

- **agentation** — Add the Agentation visual feedback toolbar to a Next.js project
- **agentation-self-driving** — Autonomous design critique mode using the Agentation toolbar

### MCP Servers

| Server | Purpose |
|---|---|
| `agentation` | Annotation session management |
| `chrome-devtools` | Browser automation and DevTools access |
| `context7` | Up-to-date library documentation |
| `exa` | Web search and code context retrieval |
| `augment-context-engine` | Semantic codebase search |

## After Install

Set your API keys:

```bash
opencode auth
```

Then launch:

```bash
opencode
```

## Structure

```
opencode-config/
├── install.sh          # Bootstrap installer
├── opencode.json       # Main config (MCPs, plugins, LSP)
├── AGENTS.md           # Global agent instructions
├── dcp.jsonc           # DCP config
├── agents/             # Custom agent definitions
├── commands/           # Custom slash commands
├── plugins/            # Plugin files and assets
│   └── planning-with-files/
└── skills/             # Skill definitions
    ├── agentation/
    └── agentation-self-driving/
```
