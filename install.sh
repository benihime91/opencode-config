#!/usr/bin/env bash
set -euo pipefail

# ─────────────────────────────────────────────
# OpenCode Config Bootstrap Installer
# Usage: curl -fsSL https://raw.githubusercontent.com/benihime91/opencode-config/refs/heads/main/install.sh | bash
# ─────────────────────────────────────────────

REPO_SLUG="benihime91/opencode-config"
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

# ── Preflight ────────────────────────────────
# Fail fast on hard requirements before mutating anything.

preflight() {
  check_command gh   || error "gh CLI is required but not found. Install: https://cli.github.com"
  check_command curl || error "curl is required but not found."
  [[ -n "${HOME:-}" ]]  || error "\$HOME is not set."
}

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

# jq is used to parse opencode.json and versions.json for dynamic discovery.
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

# auggie (augment-context-engine MCP) requires Node.js 22+.
# Uses nvm for a consistent, sudo-free install on macOS and Linux.
ensure_node22() {
  local nvm_dir="${NVM_DIR:-$HOME/.nvm}"
  # Source nvm if present but not yet loaded in this shell session.
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

  # nvm is a shell function, not a binary — check_command nvm always fails.
  # Use a file existence check instead.
  if [[ ! -s "${NVM_DIR:-$HOME/.nvm}/nvm.sh" ]]; then
    info "Installing nvm..."
    curl -fsSL https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash
    export NVM_DIR="$HOME/.nvm"
    # shellcheck source=/dev/null
    source "$NVM_DIR/nvm.sh"
  fi

  info "Installing Node.js 22 via nvm..."
  nvm install 22 || { warn "nvm Node 22 install failed. auggie may not work."; return; }
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

  # Prefer brew if available (macOS and Linux).
  if check_command brew; then
    brew install anomalyco/tap/opencode && return
  fi

  # Fallback: official install script.
  curl -fsSL https://opencode.ai/install | bash

  if ! check_command opencode; then
    warn "opencode installer ran but 'opencode' not in PATH yet. You may need to restart your shell."
  fi
}

# ── GitHub auth ──────────────────────────────

setup_gh_auth() {
  if ! gh auth status &>/dev/null; then
    # Interactive login is impossible in a piped/non-interactive shell.
    if [[ ! -t 0 ]]; then
      error "Not authenticated with GitHub. Run 'gh auth login' in your terminal first, then re-run the installer."
    fi
    info "gh: not authenticated — launching login..."
    gh auth login
  else
    info "gh: already authenticated"
  fi

  # Only configure the credential helper if it isn't already pointing at gh.
  if ! git config --global credential.helper 2>/dev/null | grep -q "gh"; then
    gh auth setup-git
    info "gh: git credential helper configured"
  fi
}

# ── Clone repo ───────────────────────────────

clone_repo() {
  if [[ -d "$CLONE_DIR/.git" ]]; then
    info "Repo already at $CLONE_DIR — skipping clone."
    info "To update: git -C \"$CLONE_DIR\" pull"
    return
  fi
  info "Cloning opencode-config to $CLONE_DIR..."
  gh repo clone "$REPO_SLUG" "$CLONE_DIR"
}

# ── Backup existing config ───────────────────

backup_existing() {
  if [[ -d "$CONFIG_DIR" ]] && [[ ! -L "$CONFIG_DIR" ]]; then
    # Only back up if it's a real directory with non-symlink content.
    if [[ -f "$CONFIG_DIR/opencode.json" ]] && [[ ! -L "$CONFIG_DIR/opencode.json" ]]; then
      warn "Existing config found. Backing up to $BACKUP_DIR..."
      cp -r "$CONFIG_DIR" "$BACKUP_DIR"
      info "Backup saved to $BACKUP_DIR"
    fi
  fi

  # Prune backups: keep only the 3 most recent to avoid disk accumulation.
  local old_backups
  old_backups=$(ls -dt "$HOME/.config/opencode.bak."* 2>/dev/null | tail -n +4) || true
  if [[ -n "$old_backups" ]]; then
    echo "$old_backups" | xargs rm -rf
    info "Pruned old backups (keeping last 3)"
  fi
}

# ── Symlink config ───────────────────────────

symlink_config() {
  mkdir -p "$CONFIG_DIR"

  local files=(
    "opencode.json"
    "AGENTS.md"
    "dcp.jsonc"
  )

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
      # Skip if the symlink already points to the correct source.
      if [[ -L "$dst" ]] && [[ "$(readlink "$dst")" == "$src" ]]; then
        continue
      fi
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
      # Skip if the symlink already points to the correct source.
      if [[ -L "$dst" ]] && [[ "$(readlink "$dst")" == "$src" ]]; then
        continue
      fi
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

  # Symlink node_modules into config dir so plugins can resolve — idempotent.
  local nm_src="$CLONE_DIR/node_modules"
  local nm_dst="$CONFIG_DIR/node_modules"
  if [[ -d "$nm_src" ]]; then
    if [[ -L "$nm_dst" ]] && [[ "$(readlink "$nm_dst")" == "$nm_src" ]]; then
      return
    fi
    [[ -e "$nm_dst" ]] && rm -rf "$nm_dst"
    ln -sfn "$nm_src" "$nm_dst"
    info "Linked node_modules/"
  fi
}

# ── Install OpenCode plugins ─────────────────
# Reads from versions.json (preferred) → opencode.json .plugin[] → hardcoded fallback.

install_opencode_plugins() {
  local versions="$CLONE_DIR/versions.json"
  local config="$CLONE_DIR/opencode.json"
  local pkgs=()

  if [[ -f "$versions" ]] && check_command jq; then
    # versions.json: { "plugins": { "pkg-name": "version" } }
    while IFS= read -r entry; do
      [[ -n "$entry" ]] && pkgs+=("$entry")
    done < <(jq -r '.plugins | to_entries[] | "\(.key)@\(.value)"' "$versions" 2>/dev/null)
  elif [[ -f "$config" ]] && check_command jq; then
    while IFS= read -r pkg; do
      [[ -n "$pkg" ]] && pkgs+=("$pkg")
    done < <(jq -r '.plugin[]?' "$config" 2>/dev/null)
  else
    pkgs=(
      "@franlol/opencode-md-table-formatter@0.0.3"
      "@tarquinen/opencode-dcp@latest"
    )
  fi

  info "Installing OpenCode plugins..."
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
# Reads from versions.json (preferred) → opencode.json (pattern match) → hardcoded fallback.

install_mcp_deps() {
  local versions="$CLONE_DIR/versions.json"
  local config="$CLONE_DIR/opencode.json"
  local pkgs=()

  if [[ -f "$versions" ]] && check_command jq; then
    # versions.json: { "mcp": { "pkg-name": "version" } }
    while IFS= read -r entry; do
      [[ -n "$entry" ]] && pkgs+=("$entry")
    done < <(jq -r '.mcp | to_entries[] | "\(.key)@\(.value)"' "$versions" 2>/dev/null)
  elif [[ -f "$config" ]] && check_command jq; then
    # Extract package name via pattern match — not positional index, which breaks
    # if extra flags are added before the package name in the command array.
    while IFS= read -r pkg; do
      [[ -n "$pkg" ]] && pkgs+=("$pkg")
    done < <(jq -r '
      .mcp
      | to_entries[]
      | select(.value.type == "local")
      | select(.value.command[0] == "npx")
      | .value.command
      | map(select(test("^[@a-zA-Z]")))
      | last
    ' "$config" 2>/dev/null)
  else
    pkgs=(
      "agentation-mcp@latest"
      "chrome-devtools-mcp@latest"
      "@upstash/context7-mcp@latest"
    )
  fi

  info "Pre-caching npx-based MCP servers..."
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

  # auggie is a Node.js binary — always use npm even when bun is the package manager.
  if check_command npm; then
    npm install -g @augmentcode/auggie || warn "auggie install failed"
  elif check_command bun; then
    bun install -g @augmentcode/auggie || warn "auggie install failed"
  else
    warn "No npm/bun found. Cannot install auggie."
    return
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

  preflight
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
