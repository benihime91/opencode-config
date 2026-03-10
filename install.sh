#!/usr/bin/env bash
set -euo pipefail

# ─────────────────────────────────────────────
# OpenCode Config Bootstrap Installer
# Usage: curl -fsSL https://raw.githubusercontent.com/ayushmanburagohain/opencode-config/main/install.sh | bash
# ─────────────────────────────────────────────

REPO_SLUG="ayushmanburagohain/opencode-config"
REPO_URL="https://github.com/$REPO_SLUG.git"
CLONE_DIR="$HOME/opencode-config"
CONFIG_DIR="${XDG_CONFIG_HOME:-$HOME/.config}/opencode"
BACKUP_DIR="$HOME/.config/opencode.bak.$(date +%Y%m%d_%H%M%S)"

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

info()    { echo -e "${GREEN}[opencode-config]${NC} $*"; }
warn()    { echo -e "${YELLOW}[opencode-config]${NC} $*"; }
error()   { echo -e "${RED}[opencode-config]${NC} $*" >&2; exit 1; }

# ── Dependency checks ────────────────────────

check_command() {
  command -v "$1" &>/dev/null
}

install_homebrew() {
  if ! check_command brew; then
    warn "Homebrew not found. Installing..."
    /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
  fi
}

ensure_git() {
  if check_command git; then return; fi
  warn "git not found. Installing..."
  if [[ "$OSTYPE" == darwin* ]]; then
    install_homebrew && brew install git
  elif check_command apt-get; then
    sudo apt-get update -y && sudo apt-get install -y git
  elif check_command dnf; then
    sudo dnf install -y git
  elif check_command pacman; then
    sudo pacman -S --noconfirm git
  else
    error "Cannot install git automatically. Please install it manually and re-run."
  fi
}

ensure_bun_or_node() {
  if check_command bun; then
    PACKAGE_MANAGER="bun"
    return
  fi
  if check_command node && check_command npm; then
    PACKAGE_MANAGER="npm"
    return
  fi
  warn "bun not found. Installing via official installer..."
  curl -fsSL https://bun.sh/install | bash
  export PATH="$HOME/.bun/bin:$PATH"
  if check_command bun; then
    PACKAGE_MANAGER="bun"
  else
    error "bun install failed. Please install bun (https://bun.sh) or Node.js and re-run."
  fi
}

# jq is used to parse opencode.json for dynamic MCP/plugin discovery
ensure_jq() {
  if check_command jq; then return; fi
  warn "jq not found. Installing..."
  if [[ "$OSTYPE" == darwin* ]]; then
    install_homebrew && brew install jq
  elif check_command apt-get; then
    sudo apt-get update -y && sudo apt-get install -y jq
  elif check_command dnf; then
    sudo dnf install -y jq
  elif check_command pacman; then
    sudo pacman -S --noconfirm jq
  else
    warn "Cannot auto-install jq. MCP and plugin detection will fall back to hardcoded values."
  fi
}

# auggie (augment-context-engine MCP) requires Node.js 22+
# Uses nvm for a consistent, sudo-free install on macOS and Linux.
ensure_node22() {
  # Source nvm if present but not yet loaded
  local nvm_dir="${NVM_DIR:-$HOME/.nvm}"
  if [[ -s "$nvm_dir/nvm.sh" ]]; then
    # shellcheck source=/dev/null
    source "$nvm_dir/nvm.sh"
  fi

  local node_major=0
  if check_command node; then
    node_major=$(node -e 'process.stdout.write(process.version.split(".")[0].replace("v",""))' 2>/dev/null || echo "0")
  fi

  if [[ "$node_major" -ge 22 ]]; then
    info "Node.js $(node --version) satisfies >=22 requirement"
    return
  fi

  warn "Node.js 22+ required by auggie (found: $(node --version 2>/dev/null || echo 'none'))."

  # Install nvm if not already present
  if ! check_command nvm; then
    info "Installing nvm..."
    curl -fsSL https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash
    # Source nvm for this session
    export NVM_DIR="$HOME/.nvm"
    # shellcheck source=/dev/null
    source "$NVM_DIR/nvm.sh"
  fi

  info "Installing Node.js 22 via nvm..."
  nvm install 22
  nvm use 22
  nvm alias default 22

  if check_command node; then
    node_major=$(node -e 'process.stdout.write(process.version.split(".")[0].replace("v",""))' 2>/dev/null || echo "0")
    if [[ "$node_major" -ge 22 ]]; then
      info "Node.js $(node --version) active via nvm"
    else
      warn "Node.js $(node --version) is still < 22. auggie may not work correctly."
    fi
  fi
}

ensure_opencode() {
  if check_command opencode; then
    info "opencode already installed: $(opencode --version 2>/dev/null || echo 'version unknown')"
    return
  fi
  warn "opencode not found. Installing..."

  # Arch Linux — use pacman (preferred on Arch)
  if check_command pacman && [[ "$OSTYPE" != darwin* ]]; then
    sudo pacman -S --noconfirm opencode 2>/dev/null && return || true
  fi

  # macOS with Homebrew — use the official tap (more up-to-date than the community formula)
  if [[ "$OSTYPE" == darwin* ]] && check_command brew; then
    brew install anomalyco/tap/opencode && return
  fi

  # npm / bun global install — cross-platform, already ensured above
  if [[ "${PACKAGE_MANAGER:-}" == "bun" ]]; then
    bun install -g opencode-ai && return
  elif check_command npm; then
    npm install -g opencode-ai && return
  fi

  # Official install script — works on macOS and Linux (final fallback)
  curl -fsSL https://opencode.ai/install | bash

  if ! check_command opencode; then
    warn "opencode installer ran but 'opencode' not in PATH yet. You may need to restart your shell."
  fi
}

# ── GitHub auth ──────────────────────────────

setup_gh_auth() {
  if ! gh auth status &>/dev/null; then
    info "gh: not authenticated — launching login..."
    gh auth login
  else
    info "gh: already authenticated"
  fi
  # Wire gh as the git credential helper so git never prompts for a password
  gh auth setup-git
}

# ── Clone repo ───────────────────────────────

clone_repo() {
  if [[ -d "$CLONE_DIR/.git" ]]; then
    info "Repo already cloned at $CLONE_DIR — pulling latest..."
    git -C "$CLONE_DIR" pull --ff-only
  else
    info "Cloning opencode-config to $CLONE_DIR..."
    gh repo clone "$REPO_SLUG" "$CLONE_DIR"
  fi
}

# ── Backup existing config ───────────────────

backup_existing() {
  if [[ -d "$CONFIG_DIR" ]] && [[ ! -L "$CONFIG_DIR" ]]; then
    # Only back up if it's a real directory with non-symlink content
    if [[ -f "$CONFIG_DIR/opencode.json" ]] && [[ ! -L "$CONFIG_DIR/opencode.json" ]]; then
      warn "Existing config found. Backing up to $BACKUP_DIR..."
      cp -r "$CONFIG_DIR" "$BACKUP_DIR"
      info "Backup saved to $BACKUP_DIR"
    fi
  fi
}

# ── Symlink config ───────────────────────────

symlink_config() {
  mkdir -p "$CONFIG_DIR"

  # Files to symlink
  local files=(
    "opencode.json"
    "AGENTS.md"
    "dcp.jsonc"
  )

  # Directories to symlink
  local dirs=(
    "agents"
    "commands"
    "plugins"
    "skills"
  )

  for f in "${files[@]}"; do
    local src="$CLONE_DIR/$f"
    local dst="$CONFIG_DIR/$f"
    if [[ -f "$src" ]]; then
      [[ -e "$dst" ]] && rm -f "$dst"
      ln -sf "$src" "$dst"
      info "Linked $f"
    else
      warn "Source file not found, skipping: $f"
    fi
  done

  for d in "${dirs[@]}"; do
    local src="$CLONE_DIR/$d"
    local dst="$CONFIG_DIR/$d"
    if [[ -d "$src" ]]; then
      [[ -e "$dst" ]] && rm -rf "$dst"
      ln -sfn "$src" "$dst"
      info "Linked $d/"
    else
      warn "Source dir not found, skipping: $d/"
    fi
  done
}

# ── Install repo npm dependencies ────────────

install_deps() {
  info "Installing repo dependencies in $CLONE_DIR..."
  if [[ "$PACKAGE_MANAGER" == "bun" ]]; then
    bun install --cwd "$CLONE_DIR"
  else
    npm install --prefix "$CLONE_DIR"
  fi
  # Create node_modules symlink in config dir so plugins can resolve
  local nm_src="$CLONE_DIR/node_modules"
  local nm_dst="$CONFIG_DIR/node_modules"
  if [[ -d "$nm_src" ]]; then
    [[ -e "$nm_dst" ]] && rm -rf "$nm_dst"
    ln -sfn "$nm_src" "$nm_dst"
    info "Linked node_modules/"
  fi
}

# ── Install OpenCode plugins ─────────────────
# Reads .plugin[] from opencode.json and installs each package globally.
# Falls back to hardcoded list if jq is unavailable.

install_opencode_plugins() {
  local config="$CLONE_DIR/opencode.json"
  [[ -f "$config" ]] || { warn "opencode.json not found, skipping plugin install"; return; }

  info "Installing OpenCode plugins..."

  local pkgs=()
  if check_command jq; then
    while IFS= read -r pkg; do
      [[ -n "$pkg" ]] && pkgs+=("$pkg")
    done < <(jq -r '.plugin[]?' "$config" 2>/dev/null)
  else
    # Hardcoded fallback — mirrors current opencode.json
    pkgs=(
      "@franlol/opencode-md-table-formatter@0.0.3"
      "@tarquinen/opencode-dcp@latest"
    )
  fi

  for pkg in "${pkgs[@]}"; do
    info "  plugin: $pkg"
    if [[ "$PACKAGE_MANAGER" == "bun" ]]; then
      bun install -g "$pkg" || warn "Failed to install plugin $pkg"
    else
      npm install -g "$pkg" || warn "Failed to install plugin $pkg"
    fi
  done
}

# ── Pre-cache npx-based MCP servers ──────────
# Reads local npx MCP commands from opencode.json and pre-installs them
# globally so first launch doesn't stall on download.
# Falls back to hardcoded list if jq is unavailable.

install_mcp_deps() {
  local config="$CLONE_DIR/opencode.json"
  [[ -f "$config" ]] || { warn "opencode.json not found, skipping MCP pre-cache"; return; }

  info "Pre-caching npx-based MCP servers..."

  local pkgs=()
  if check_command jq; then
    # Extract the package name (argv[2]) from every local MCP whose command[0] == "npx"
    while IFS= read -r pkg; do
      [[ -n "$pkg" ]] && pkgs+=("$pkg")
    done < <(jq -r '
      .mcp
      | to_entries[]
      | select(.value.type == "local")
      | select(.value.command[0] == "npx")
      | .value.command[2]
    ' "$config" 2>/dev/null)
  else
    # Hardcoded fallback — mirrors current opencode.json
    pkgs=(
      "agentation-mcp"
      "chrome-devtools-mcp@latest"
      "@upstash/context7-mcp"
    )
  fi

  for pkg in "${pkgs[@]}"; do
    info "  mcp: $pkg"
    if [[ "$PACKAGE_MANAGER" == "bun" ]]; then
      bun install -g "$pkg" 2>/dev/null || warn "Could not pre-cache $pkg (will auto-download on first use)"
    else
      npm install -g "$pkg" 2>/dev/null || warn "Could not pre-cache $pkg (will auto-download on first use)"
    fi
  done
}

# ── Install auggie (augment-context-engine) ──
# auggie provides the MCP server for semantic codebase search.
# Package: @augmentcode/auggie  Requires: Node.js 22+
# After install, run: auggie login

ensure_auggie() {
  if check_command auggie; then
    info "auggie already installed: $(auggie --version 2>/dev/null || echo 'version unknown')"
    return
  fi

  info "Installing auggie (Augment Code CLI / context-engine MCP)..."

  # auggie is a Node.js binary — always use npm/node even when bun is the package manager
  local npm_cmd
  if check_command npm; then
    npm_cmd="npm"
  elif check_command bun; then
    npm_cmd="bun"
  else
    warn "No npm/bun found. Cannot install auggie."
    return
  fi

  if [[ "$npm_cmd" == "bun" ]]; then
    bun install -g @augmentcode/auggie || warn "auggie install failed"
  else
    npm install -g @augmentcode/auggie || warn "auggie install failed"
  fi

  if check_command auggie; then
    info "auggie installed. Run 'auggie login' to authenticate."
  else
    warn "auggie install may have failed. The augment-context-engine MCP will be unavailable."
    warn "Manual install: npm install -g @augmentcode/auggie && auggie login"
  fi
}

# ── Main ─────────────────────────────────────

main() {
  echo ""
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo "  OpenCode Config Bootstrap"
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo ""

  ensure_git
  ensure_bun_or_node
  ensure_jq
  setup_gh_auth
  clone_repo
  backup_existing
  symlink_config
  install_deps
  install_opencode_plugins
  install_mcp_deps
  ensure_node22
  ensure_auggie
  ensure_opencode

  echo ""
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  info "Installation complete!"
  echo ""
  echo "  ── Next steps ──────────────────────────────────"
  echo ""
  echo "  1. Reload your shell"
  echo "     source ~/.zshrc   (zsh)"
  echo "     source ~/.bashrc  (bash)"
  echo "     ↳ Required if nvm or bun were freshly installed"
  echo ""
  echo "  2. Authenticate with your LLM provider"
  echo "     opencode auth"
  echo "     ↳ Or set env vars: ANTHROPIC_API_KEY, OPENAI_API_KEY, etc."
  echo ""
  echo "  3. Authenticate auggie  (semantic codebase search MCP)"
  echo "     auggie login"
  echo "     ↳ Opens a browser OAuth flow — required once"
  echo ""
  echo "  4. Set optional MCP API keys"
  echo "     export EXA_API_KEY=<your-key>   # exa web search MCP"
  echo "     ↳ Get a key at https://exa.ai"
  echo "     ↳ Add to ~/.zshrc / ~/.bashrc to persist"
  echo ""
  echo "  5. Launch opencode"
  echo "     opencode"
  echo ""
  echo "  ── Keeping up to date ──────────────────────────"
  echo ""
  echo "  Pull latest config + reinstall deps:"
  echo "    cd ~/opencode-config && git pull && bash install.sh"
  echo ""
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo ""
}

main "$@"
