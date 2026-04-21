#!/usr/bin/env bash
set -euo pipefail

# ─────────────────────────────────────────────
# OpenCode Config Bootstrap Installer
# Usage:
#   curl -fsSL https://raw.githubusercontent.com/benihime91/opencode-config/refs/heads/main/install.sh | bash
#   OPENCODE_CONFIG_CLONE_DIR="$HOME/src/opencode-config" \
#     curl -fsSL https://raw.githubusercontent.com/benihime91/opencode-config/refs/heads/main/install.sh | bash
# ─────────────────────────────────────────────

DEFAULT_REPO_SLUG="benihime91/opencode-config"
REPO_SLUG="${OPENCODE_CONFIG_REPO_SLUG:-$DEFAULT_REPO_SLUG}"
REPO_URL="${OPENCODE_CONFIG_REPO_URL:-https://github.com/$REPO_SLUG.git}"
CLONE_DIR="${OPENCODE_CONFIG_CLONE_DIR:-$HOME/opencode-config}"
CONFIG_DIR="${OPENCODE_CONFIG_DIR:-${XDG_CONFIG_HOME:-$HOME/.config}/opencode}"
FIRECRAWL_REPO_URL="${OPENCODE_FIRECRAWL_REPO_URL:-https://github.com/firecrawl/firecrawl.git}"
FIRECRAWL_DIR="${OPENCODE_FIRECRAWL_DIR:-$HOME/firecrawl}"
INSTALL_FIRECRAWL="${OPENCODE_INSTALL_FIRECRAWL:-1}"
SEMCTX_REPO_URL="${OPENCODE_SEMCTX_REPO_URL:-git+https://github.com/benihime91/semctx.git}"
FIRECRAWL_ENV_TEMPLATE_REL="firecrawl/.env.default"
BACKUP_DIR="$HOME/.config/opencode.bak.$(date +%Y%m%d_%H%M%S)"
CONFLICT_BACKUP_DIR="$BACKUP_DIR/conflicts"

PACKAGE_MANAGER=""
OPTIONAL_WARNINGS=()
REQUIRED_WARNINGS=()
BACKUP_DIR_CREATED=0

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

info()    { echo -e "${GREEN}[opencode-config]${NC} $*"; }
warn_optional() {
  local msg="$*"
  OPTIONAL_WARNINGS+=("$msg")
  echo -e "${YELLOW}[opencode-config]${NC} $msg"
}
warn_required() {
  local msg="$*"
  REQUIRED_WARNINGS+=("$msg")
  echo -e "${YELLOW}[opencode-config]${NC} $msg"
}
warn()    { warn_optional "$*"; }
error()   { echo -e "${RED}[opencode-config]${NC} $*" >&2; exit 1; }

# ── Preflight ────────────────────────────────
# Fail fast on hard requirements before mutating anything.

preflight() {
  check_command curl || error "curl is required but not found."
  [[ -n "${HOME:-}" ]]  || error "\$HOME is not set."
  [[ "$HOME" = /* ]] || error "\$HOME must be an absolute path."
  [[ -d "$HOME" ]] || error "\$HOME directory does not exist: $HOME"
}

# ── Dependency checks ────────────────────────

check_command() {
  command -v "$1" &>/dev/null
}

install_homebrew() {
  if ! check_command brew; then
    info "Homebrew not found. Installing..."
    /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
  fi
}

pm_global_install() {
  local pkg="$1"
  if [[ "$PACKAGE_MANAGER" == "bun" ]]; then
    bun install -g "$pkg"
  else
    npm install -g "$pkg"
  fi
}

pm_install_repo_deps() {
  if [[ "$PACKAGE_MANAGER" == "bun" ]]; then
    bun install --cwd "$CLONE_DIR"
  else
    npm install --prefix "$CLONE_DIR"
  fi
}

ensure_backup_dir() {
  if [[ "$BACKUP_DIR_CREATED" -eq 0 ]]; then
    mkdir -p "$BACKUP_DIR"
    BACKUP_DIR_CREATED=1
  fi
}

backup_conflict_path() {
  local path="$1"
  local label="$2"
  local base
  local candidate
  local index=1

  ensure_backup_dir
  mkdir -p "$CONFLICT_BACKUP_DIR"

  base="$(basename "$path")"
  candidate="$CONFLICT_BACKUP_DIR/${label}_${base}"
  while [[ -e "$candidate" || -L "$candidate" ]]; do
    candidate="$CONFLICT_BACKUP_DIR/${label}_${base}.${index}"
    index=$((index + 1))
  done

  mv "$path" "$candidate"
  info "Moved conflicting path '$path' to '$candidate'"
}

verify_symlink_target() {
  local dst="$1"
  local src="$2"
  local actual

  [[ -L "$dst" ]] || error "Expected symlink was not created: $dst"
  actual="$(readlink "$dst" 2>/dev/null || true)"
  [[ "$actual" == "$src" ]] || error "Symlink target mismatch for $dst (expected: $src, actual: ${actual:-none})"
}

normalize_repo_ref() {
  local ref="$1"
  ref="${ref%.git}"
  ref="${ref%/}"
  ref="${ref#git@github.com:}"
  ref="${ref#ssh://git@github.com/}"
  ref="${ref#https://github.com/}"
  ref="${ref#http://github.com/}"
  printf '%s' "$ref"
}

repo_matches_expected_origin() {
  local origin="$1"
  local normalized_origin
  local normalized_slug
  local normalized_url

  normalized_origin="$(normalize_repo_ref "$origin")"
  normalized_slug="$(normalize_repo_ref "$REPO_SLUG")"
  normalized_url="$(normalize_repo_ref "$REPO_URL")"

  [[ "$normalized_origin" == "$normalized_slug" || "$normalized_origin" == "$normalized_url" ]]
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
    info "Using package manager: bun"
    return
  fi
  if check_command node && check_command npm; then
    PACKAGE_MANAGER="npm"
    info "Using package manager: npm"
    return
  fi
  info "bun and node/npm not found. Installing bun via official installer..."
  curl -fsSL https://bun.sh/install | bash
  export PATH="$HOME/.bun/bin:$PATH"
  if check_command bun; then
    PACKAGE_MANAGER="bun"
    info "Using package manager: bun"
  else
    error "bun install failed. Please install bun (https://bun.sh) or Node.js and re-run."
  fi
}

# jq is used to parse opencode.json for dynamic discovery.
ensure_jq() {
  if check_command jq; then return; fi
  info "jq not found. Installing..."
  if [[ "$OSTYPE" == darwin* ]]; then
    install_homebrew && brew install jq
  elif check_command apt-get; then
    sudo apt-get update -y && sudo apt-get install -y jq
  elif check_command dnf; then
    sudo dnf install -y jq
  elif check_command pacman; then
    sudo pacman -S --noconfirm jq
  else
    warn_optional "Cannot auto-install jq. MCP and plugin detection will fall back to hardcoded values."
  fi
}

ensure_uv() {
  if check_command uv; then return; fi
  info "uv not found. Installing..."
  if [[ "$OSTYPE" == darwin* ]]; then
    install_homebrew && brew install uv
  elif check_command apt-get; then
    sudo apt-get update -y && sudo apt-get install -y uv
  elif check_command dnf; then
    sudo dnf install -y uv
  elif check_command pacman; then
    sudo pacman -S --noconfirm uv
  else
    curl -LsSf https://astral.sh/uv/install.sh | sh || error "Could not install uv automatically. Please install uv and re-run."
    export PATH="$HOME/.local/bin:$PATH"
  fi

  check_command uv || error "uv is required for semctx installation but was not found after install."
}


ensure_opencode() {
  if check_command opencode; then
    info "opencode already installed: $(opencode --version 2>/dev/null || echo 'version unknown')"
    return
  fi
  info "opencode not found. Installing..."

  # macOS: use Homebrew tap for the most up-to-date releases.
  if [[ "$OSTYPE" == darwin* ]]; then
    install_homebrew
    brew install anomalyco/tap/opencode && return
  fi

  # All other platforms: install using selected package manager.
  pm_global_install "opencode-ai"

  if ! check_command opencode; then
    warn_required "opencode was installed but may not be in PATH yet. Reload your shell before running 'opencode'."
  fi
}

# ── Clone repo ───────────────────────────────

clone_repo() {
  if [[ -e "$CLONE_DIR" ]]; then
    [[ -d "$CLONE_DIR" ]] || error "Clone path exists but is not a directory: $CLONE_DIR"
    git -C "$CLONE_DIR" rev-parse --is-inside-work-tree >/dev/null 2>&1 || error "Clone path exists but is not a git repo: $CLONE_DIR"

    local origin
    origin="$(git -C "$CLONE_DIR" config --get remote.origin.url || true)"
    repo_matches_expected_origin "$origin" || error "Clone path points to a different repo ($origin). Refusing to continue: $CLONE_DIR"

    info "Repo already at $CLONE_DIR — skipping clone."
    info "To update: git -C \"$CLONE_DIR\" pull"
    return
  fi
  info "Cloning OpenCode config from $REPO_URL to $CLONE_DIR..."
  git clone "$REPO_URL" "$CLONE_DIR"
}

# ── Backup existing config ───────────────────

backup_existing() {
  if [[ -d "$CONFIG_DIR" ]] && [[ ! -L "$CONFIG_DIR" ]]; then
    # Only back up if it's a real directory with non-symlink content.
    if [[ -f "$CONFIG_DIR/opencode.json" ]] && [[ ! -L "$CONFIG_DIR/opencode.json" ]]; then
      ensure_backup_dir
      warn_optional "Existing config found. Backing up to $BACKUP_DIR..."
      cp -r "$CONFIG_DIR" "$BACKUP_DIR"
      info "Backup saved to $BACKUP_DIR"
    fi
  fi

  # Prune backups: keep only the 3 most recent to avoid disk accumulation.
  local backups=()
  local sorted=()
  local i

  shopt -s nullglob
  backups=("$HOME/.config/opencode.bak."*)
  shopt -u nullglob

  if (( ${#backups[@]} > 3 )); then
    IFS=$'\n' sorted=($(printf '%s\n' "${backups[@]}" | sort -r))
    unset IFS
    for (( i=3; i<${#sorted[@]}; i++ )); do
      rm -rf "${sorted[$i]}"
    done
    info "Pruned old backups (keeping last 3)"
  fi
}

# ── Symlink config ───────────────────────────

symlink_config() {
  mkdir -p "$CONFIG_DIR"

  local files=(
    "opencode.json"
    "agent-permissions.jsonc"
    "dcp.jsonc"
    "tui.json"
  )

  # OpenCode discovers custom agents from ~/.config/opencode/agents/.
  # This repo stores the source files in ./agents/, so link that source into
  # the runtime config path directly.
  local dir_links=(
    "agents:agents"
    "commands:commands"
    "config:config"
    "plugins:plugins"
    "rules:rules"
    "skills:skills"
    "themes:themes"
  )

  for f in "${files[@]}"; do
    local src="$CLONE_DIR/$f"
    local dst="$CONFIG_DIR/$f"
    if [[ -f "$src" ]]; then
      # Skip if the symlink already points to the correct source.
      if [[ -L "$dst" ]] && [[ "$(readlink "$dst")" == "$src" ]]; then
        continue
      fi
      if [[ -e "$dst" || -L "$dst" ]]; then
        backup_conflict_path "$dst" "file"
      fi
      ln -sfn "$src" "$dst"
      verify_symlink_target "$dst" "$src"
      info "Linked $f"
    else
      warn_required "Source file not found, skipping: $f"
    fi
  done

  for link in "${dir_links[@]}"; do
    local src_name="${link%%:*}"
    local dst_name="${link##*:}"
    local src="$CLONE_DIR/$src_name"
    local dst="$CONFIG_DIR/$dst_name"
    if [[ -d "$src" ]]; then
      # Skip if the symlink already points to the correct source.
      if [[ -L "$dst" ]] && [[ "$(readlink "$dst")" == "$src" ]]; then
        continue
      fi
      if [[ -e "$dst" || -L "$dst" ]]; then
        backup_conflict_path "$dst" "dir"
      fi
      ln -sfn "$src" "$dst"
      verify_symlink_target "$dst" "$src"
      info "Linked $dst_name/ -> $src_name/"
    else
      warn_required "Source dir not found, skipping: $src_name/"
    fi
  done
}

# ── Install repo npm dependencies ────────────

install_deps() {
  info "Installing repo dependencies in $CLONE_DIR..."
  pm_install_repo_deps

  # Symlink node_modules into config dir so plugins can resolve — idempotent.
  local nm_src="$CLONE_DIR/node_modules"
  local nm_dst="$CONFIG_DIR/node_modules"
  if [[ -d "$nm_src" ]]; then
    if [[ -L "$nm_dst" ]] && [[ "$(readlink "$nm_dst")" == "$nm_src" ]]; then
      return
    fi
    if [[ -e "$nm_dst" || -L "$nm_dst" ]]; then
      backup_conflict_path "$nm_dst" "node_modules"
    fi
    ln -sfn "$nm_src" "$nm_dst"
    verify_symlink_target "$nm_dst" "$nm_src"
    info "Linked node_modules/"
  fi
}

# ── Install OpenCode plugins ─────────────────
# Reads from opencode.json .plugin[] → hardcoded fallback.

install_opencode_plugins() {
  local config="$CLONE_DIR/opencode.json"
  local pkgs=()

  if [[ -f "$config" ]] && check_command jq; then
    while IFS= read -r pkg; do
      [[ -n "$pkg" ]] && pkgs+=("$pkg")
    done < <(jq -r '.plugin[]?' "$config" 2>/dev/null)
  fi

  if (( ${#pkgs[@]} == 0 )); then
    pkgs=(
      "@franlol/opencode-md-table-formatter@0.0.3"
      "@tarquinen/opencode-dcp@latest"
    )
  fi

  info "Installing OpenCode plugins..."
  for pkg in "${pkgs[@]}"; do
    info "  plugin: $pkg"
    pm_global_install "$pkg" || warn_optional "Failed to install plugin $pkg"
  done
}

# ── Install CLI workflow dependencies ────────

install_cli_workflow_deps() {
  local pkgs=(
    "mcporter@latest"
    "mcp-remote@latest"
    "firecrawl-mcp@latest"
    "agentation-mcp@latest"
    "@upstash/context7-mcp@latest"
  )

  info "Installing CLI workflow dependencies..."
  for pkg in "${pkgs[@]}"; do
    info "  cli: $pkg"
    pm_global_install "$pkg" 2>/dev/null || warn_optional "Could not install $pkg (it may auto-download on first use)"
  done

  info "Installing semctx via uv..."
  uv tool install --force "$SEMCTX_REPO_URL" 2>/dev/null || warn_optional "Could not install semctx via uv (install it manually with: uv tool install $SEMCTX_REPO_URL)"
}

symlink_firecrawl_env() {
  local env_file="$FIRECRAWL_DIR/.env"
  local template_file="$CLONE_DIR/$FIRECRAWL_ENV_TEMPLATE_REL"
  local backup_file

  [[ -f "$template_file" ]] || {
    warn_optional "Firecrawl env template missing at $template_file. Create or restore it before installing Firecrawl."
    return
  }

  if [[ -e "$env_file" && ! -L "$env_file" ]]; then
    backup_file="$FIRECRAWL_DIR/.env.pre-opencode-link.$(date +%Y%m%d_%H%M%S)"
    mv "$env_file" "$backup_file"
    info "Backed up existing Firecrawl .env to $backup_file"
  fi

  ln -sfn "$template_file" "$env_file"
  info "Linked Firecrawl .env to repo template at $template_file"
}

update_firecrawl_repo() {
  local status_output
  local filtered_status

  status_output="$(git -C "$FIRECRAWL_DIR" status --porcelain 2>/dev/null || true)"
  filtered_status="$(printf '%s\n' "$status_output" | grep -vE '^(\?\? \.semctx/?|\?\? \.env\.pre-opencode-link\.)' || true)"
  filtered_status="$(printf '%s' "$filtered_status" | tr -d '\r')"

  if [[ -n "$filtered_status" ]]; then
    warn_optional "Firecrawl repo has local changes. Skipping auto-update from origin/main in $FIRECRAWL_DIR"
    return
  fi

  info "Refreshing Firecrawl checkout from origin/main..."
  if ! git -C "$FIRECRAWL_DIR" fetch origin main; then
    warn_optional "Failed to fetch origin/main for Firecrawl. Continuing with existing checkout in $FIRECRAWL_DIR"
    return
  fi

  if git -C "$FIRECRAWL_DIR" show-ref --verify --quiet refs/heads/main; then
    if ! git -C "$FIRECRAWL_DIR" checkout main >/dev/null 2>&1; then
      warn_optional "Failed to switch Firecrawl checkout to main. Continuing with current branch in $FIRECRAWL_DIR"
      return
    fi
  else
    if ! git -C "$FIRECRAWL_DIR" checkout -b main --track origin/main >/dev/null 2>&1; then
      warn_optional "Failed to create Firecrawl main branch from origin/main. Continuing with existing checkout in $FIRECRAWL_DIR"
      return
    fi
  fi

  if ! git -C "$FIRECRAWL_DIR" merge --ff-only origin/main >/dev/null 2>&1; then
    warn_optional "Firecrawl checkout could not fast-forward to origin/main. Resolve local branch divergence in $FIRECRAWL_DIR and re-run install."
    return
  fi

  info "Firecrawl checkout is up to date with origin/main"
}

bootstrap_firecrawl() {
  [[ "$INSTALL_FIRECRAWL" != "0" ]] || {
    info "Skipping Firecrawl bootstrap (OPENCODE_INSTALL_FIRECRAWL=0)."
    return
  }

  if ! check_command docker; then
    warn_optional "Docker not found. Skipping Firecrawl bootstrap. Install Docker and re-run, or set OPENCODE_INSTALL_FIRECRAWL=0 to silence this."
    return
  fi

  if ! docker compose version >/dev/null 2>&1; then
    warn_optional "'docker compose' is unavailable. Skipping Firecrawl bootstrap. Install Docker Compose support and re-run, or set OPENCODE_INSTALL_FIRECRAWL=0 to silence this."
    return
  fi

  if [[ -e "$FIRECRAWL_DIR" ]]; then
    [[ -d "$FIRECRAWL_DIR" ]] || {
      warn_optional "Firecrawl path exists but is not a directory: $FIRECRAWL_DIR"
      return
    }
    if git -C "$FIRECRAWL_DIR" rev-parse --is-inside-work-tree >/dev/null 2>&1; then
      local origin
      origin="$(git -C "$FIRECRAWL_DIR" config --get remote.origin.url || true)"
      if [[ -n "$origin" ]] && ! repo_matches_expected_origin "$origin" && [[ "$(normalize_repo_ref "$origin")" != "$(normalize_repo_ref "$FIRECRAWL_REPO_URL")" ]]; then
        warn_optional "Existing Firecrawl checkout points to a different repo ($origin). Skipping Firecrawl bootstrap in $FIRECRAWL_DIR"
        return
      fi
      info "Firecrawl repo already present at $FIRECRAWL_DIR"
      update_firecrawl_repo
    else
      warn_optional "Firecrawl path exists but is not a git repo: $FIRECRAWL_DIR"
      return
    fi
  else
    info "Cloning Firecrawl to $FIRECRAWL_DIR..."
    git clone "$FIRECRAWL_REPO_URL" "$FIRECRAWL_DIR" || {
      warn_optional "Failed to clone Firecrawl from $FIRECRAWL_REPO_URL"
      return
    }
    update_firecrawl_repo
  fi

  symlink_firecrawl_env

  info "Bootstrapping local Firecrawl with Docker Compose..."
  if ! docker compose -f "$FIRECRAWL_DIR/docker-compose.yaml" build; then
    warn_optional "Firecrawl docker compose build failed. Check $FIRECRAWL_DIR"
    return
  fi

  if ! docker compose -f "$FIRECRAWL_DIR/docker-compose.yaml" up -d; then
    warn_optional "Firecrawl docker compose up failed. Check $FIRECRAWL_DIR"
    return
  fi

  info "Firecrawl is bootstrapped at http://localhost:3002"
}

print_warning_summary() {
  local i
  echo ""
  echo "  ── Warnings ───────────────────────────────────"
  if (( ${#REQUIRED_WARNINGS[@]} == 0 && ${#OPTIONAL_WARNINGS[@]} == 0 )); then
    echo ""
    echo "  None"
    return
  fi

  if (( ${#REQUIRED_WARNINGS[@]} > 0 )); then
    echo ""
    echo "  Required attention:"
    for (( i=0; i<${#REQUIRED_WARNINGS[@]}; i++ )); do
      echo "    - ${REQUIRED_WARNINGS[$i]}"
    done
  fi

  if (( ${#OPTIONAL_WARNINGS[@]} > 0 )); then
    echo ""
    echo "  Optional notes:"
    for (( i=0; i<${#OPTIONAL_WARNINGS[@]}; i++ )); do
      echo "    - ${OPTIONAL_WARNINGS[$i]}"
    done
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
  ensure_uv
  clone_repo
  backup_existing
  symlink_config
  install_deps
  install_opencode_plugins
  install_cli_workflow_deps
  bootstrap_firecrawl
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
  echo "     ↳ Required if bun was freshly installed"
  echo ""
  echo "  2. Authenticate with your LLM provider"
  echo "     opencode auth"
  echo "     ↳ Or set env vars: ANTHROPIC_API_KEY, OPENAI_API_KEY, etc."
  echo ""
  echo "  3. Optional: login to auggie (if installed separately)"
  echo "     auggie login"
  echo ""
  echo "  4. Optional: set CLI workflow API keys"
  echo "     export EXA_API_KEY=<your-key>   # exa-backed docs/web research"
  echo "     export RAPIDAPI_KEY=<your-key>  # trip-planner RapidAPI provider access"
  echo "     ↳ Get a key at https://exa.ai"
  echo "     ↳ Add keys to ~/.zshrc / ~/.bashrc to persist"
  echo ""
  echo "  5. mcporter travel runtime"
  echo "     config path: $CONFIG_DIR/config/mcporter.json"
  echo "     ↳ installer links the repo's config/ directory into your OpenCode config"
  echo "     ↳ trip-planner expects RAPIDAPI_KEY to already be exported in your shell"
  echo ""
  echo "  6. Semctx local discovery defaults"
  echo "     default model: ollama/qwen3-embedding:8b"
  echo "     ↳ Keep Ollama running and make sure that model is pulled locally"
  echo ""
  echo "  7. Firecrawl local research endpoint"
  echo "     default: http://localhost:3002"
  echo "     ↳ edit firecrawl/.env.default before install; installer only symlinks it"
  echo "     ↳ Disable bootstrap with OPENCODE_INSTALL_FIRECRAWL=0"
  echo "     ↳ Override location with OPENCODE_FIRECRAWL_DIR or FIRECRAWL_API_URL"
  echo ""
  echo "  8. Launch opencode"
  echo "     opencode"
  echo ""
  print_warning_summary
  echo ""
  echo "  ── Keeping up to date ──────────────────────────"
  echo ""
  echo "  Pull latest config + reinstall deps:"
  echo "    cd $CLONE_DIR && git pull && bash install.sh"
  echo ""
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo ""
}

main "$@"
