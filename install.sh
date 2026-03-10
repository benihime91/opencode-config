#!/usr/bin/env bash
set -euo pipefail

# ─────────────────────────────────────────────
# OpenCode Config Bootstrap Installer
# Usage: curl -fsSL https://raw.githubusercontent.com/ayushmanburagohain/opencode-config/main/install.sh | bash
# ─────────────────────────────────────────────

REPO_URL="https://github.com/ayushmanburagohain/opencode-config.git"
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

ensure_opencode() {
  if check_command opencode; then
    info "opencode already installed: $(opencode --version 2>/dev/null || echo 'version unknown')"
    return
  fi
  warn "opencode not found. Installing..."
  if [[ "$OSTYPE" == darwin* ]] && check_command brew; then
    brew install opencode
  else
    curl -fsSL https://opencode.ai/install | bash
  fi
  if ! check_command opencode; then
    warn "opencode installer ran but 'opencode' not in PATH yet. You may need to restart your shell."
  fi
}

# ── Clone repo ───────────────────────────────

clone_repo() {
  if [[ -d "$CLONE_DIR/.git" ]]; then
    info "Repo already cloned at $CLONE_DIR — pulling latest..."
    git -C "$CLONE_DIR" pull --ff-only
  else
    info "Cloning opencode-config to $CLONE_DIR..."
    git clone "$REPO_URL" "$CLONE_DIR"
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

# ── Install plugin dependencies ──────────────

install_deps() {
  info "Installing plugin dependencies in $CLONE_DIR..."
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

# ── Main ─────────────────────────────────────

main() {
  echo ""
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo "  OpenCode Config Bootstrap"
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo ""

  ensure_git
  ensure_bun_or_node
  clone_repo
  backup_existing
  symlink_config
  install_deps
  ensure_opencode

  echo ""
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  info "Installation complete!"
  echo ""
  echo "  Next steps:"
  echo "  1. Set your API keys:  opencode auth"
  echo "  2. Launch opencode:    opencode"
  echo ""
  echo "  To update on this machine:"
  echo "  cd ~/opencode-config && git pull"
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo ""
}

main "$@"
