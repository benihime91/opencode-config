# opencode-config

Personal [OpenCode](https://opencode.ai) config for agents, commands, skills, plugins, and MCP servers.

## Install

```bash
curl -fsSL https://raw.githubusercontent.com/benihime91/opencode-config/refs/heads/main/install.sh | bash
```

The installer clones the repo, backs up your existing config, symlinks files into `~/.config/opencode`, and installs dependencies.

## Finish Setup

```bash
source ~/.zshrc   # or ~/.bashrc
opencode auth
auggie login
export EXA_API_KEY=<your-key>   # optional
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

## Update

```bash
cd ~/opencode-config && git pull && bash install.sh
```

Symlinks keep changes live immediately.

## What's Included

- `agents/` - custom agents like `orchestrator`, `explorer`, `fixer`, `librarian`, `designer`, and `oracle`
- `commands/` - slash commands such as `/plan`, `/learn`, `/code-review`, `/commit-push`, and `/update-docs`
- `skills/` - reusable workflows including `planning-with-files`, `search-first`, and `article-writing`
- `plugins/` - local plugins
- MCP servers for browser automation, semantic search, research, annotations, and live docs
