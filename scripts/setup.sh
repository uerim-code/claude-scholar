#!/usr/bin/env bash
# ============================================================
# Claude Scholar — Codex CLI Installer
# ============================================================
# Usage: bash scripts/setup.sh
# Supports fresh install and incremental merge with existing config.

set -euo pipefail

CODEX_HOME="${CODEX_HOME:-$HOME/.codex}"
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
SRC_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"

# --- State flags ---
SKIP_PROVIDER=false
SKIP_AUTH=false
PERSIST_AUTH=false
PROVIDER_NAME=""
PROVIDER_URL=""
MODEL=""
AUTH_ENV_VAR_NAME="OPENAI_API_KEY"
API_KEY=""

# --- Colors ---
green()  { printf "\033[32m%s\033[0m" "$1"; }
red()    { printf "\033[31m%s\033[0m" "$1"; }
yellow() { printf "\033[33m%s\033[0m" "$1"; }
bold()   { printf "\033[1m%s\033[0m" "$1"; }
info()   { echo -e "\033[1;34m[INFO]\033[0m $*"; }
warn()   { echo -e "\033[1;33m[WARN]\033[0m $*"; }
error()  { echo -e "\033[1;31m[ERROR]\033[0m $*"; exit 1; }

# --- Presets ---
declare -a PRESET_NAMES=("openai" "custom")
declare -a PRESET_LABELS=("OpenAI (official)" "Custom provider")
declare -a PRESET_URLS=("https://api.openai.com/v1" "")
declare -a PRESET_MODELS=("gpt-5.2" "")

# ============================================================
# Helpers
# ============================================================
mask_secret() {
  local value="$1"
  local length=${#value}
  if [ "$length" -le 12 ]; then
    printf '%s' "$value"
    return
  fi
  printf '%s...%s' "${value:0:8}" "${value: -4}"
}

validate_env_var_name() {
  local name="$1"
  [[ "$name" =~ ^[A-Za-z_][A-Za-z0-9_]*$ ]] || error "Invalid env var name: $name"
}

read_auth_entry() {
  local file="$1"
  [ -f "$file" ] || return 0
  node -e '
    const fs = require("fs");
    try {
      const data = JSON.parse(fs.readFileSync(process.argv[1], "utf8"));
      for (const [key, value] of Object.entries(data)) {
        if (typeof value === "string" && value.length > 0) {
          process.stdout.write(`${key}	${value}`);
          break;
        }
      }
    } catch (error) {}
  ' "$file"
}

normalize_env_prefix() {
  local raw="$1"
  printf '%s' "$raw" \
    | tr '[:lower:]-./' '[:upper:]___' \
    | sed 's/[^A-Z0-9_]/_/g; s/__*/_/g; s/^_//; s/_$//'
}

collect_api_key_candidates() {
  local provider="$1"
  local normalized_provider=""
  local -a candidates=()

  if [ -n "$provider" ]; then
    normalized_provider=$(normalize_env_prefix "$provider")
    if [ -n "$normalized_provider" ]; then
      candidates+=("${normalized_provider}_API_KEY")
    fi
  fi

  candidates+=(
    "OPENAI_API_KEY"
    "ANTHROPIC_API_KEY"
    "OPENROUTER_API_KEY"
    "GEMINI_API_KEY"
    "GOOGLE_API_KEY"
    "DEEPSEEK_API_KEY"
    "DASHSCOPE_API_KEY"
    "SILICONFLOW_API_KEY"
    "XAI_API_KEY"
    "GROQ_API_KEY"
    "MISTRAL_API_KEY"
    "COHERE_API_KEY"
    "TOGETHER_API_KEY"
    "FIREWORKS_API_KEY"
    "MOONSHOT_API_KEY"
    "ZHIPU_API_KEY"
  )

  printf '%s\n' "${candidates[@]}" | awk '!seen[$0]++'
}

detect_existing_env_auth() {
  local provider="$1"
  local candidate=""
  local value=""

  while IFS= read -r candidate; do
    [ -n "$candidate" ] || continue
    value="${!candidate:-}"
    if [ -n "$value" ]; then
      AUTH_ENV_VAR_NAME="$candidate"
      API_KEY="$value"
      PERSIST_AUTH=true
      info "No auth.json found; detected $candidate from environment and will persist it for Codex compatibility"
      return 0
    fi
  done < <(collect_api_key_candidates "$provider")

  return 1
}

# ============================================================
# Step 1: Check prerequisites
# ============================================================
check_deps() {
  command -v git >/dev/null || error "Git is required."
  command -v node >/dev/null || error "Node.js is required."
  if ! command -v codex >/dev/null; then
    warn "Codex CLI not found. Install: npm i -g @openai/codex"
  fi
}

# ============================================================
# Step 2: Detect existing configuration
# ============================================================
detect_existing() {
  echo ""
  if [ -f "$CODEX_HOME/config.toml" ]; then
    info "Existing config.toml found at $CODEX_HOME/config.toml"
    local cur_model cur_provider
    cur_model=$(grep '^model ' "$CODEX_HOME/config.toml" 2>/dev/null | head -1 | sed 's/.*= *"//;s/".*//' || true)
    cur_provider=$(grep '^model_provider ' "$CODEX_HOME/config.toml" 2>/dev/null | head -1 | sed 's/.*= *"//;s/".*//' || true)
    PROVIDER_NAME="$cur_provider"
    if [ -n "$cur_model" ]; then
      info "  Current model: $cur_model"
    fi
    if [ -n "$cur_provider" ]; then
      info "  Current provider: $cur_provider"
    fi
    SKIP_PROVIDER=true
    info "Detected existing provider/model configuration; keeping it without prompting"
  fi

  if [ -f "$CODEX_HOME/auth.json" ]; then
    local auth_entry existing_key_name existing_key_value
    auth_entry=$(read_auth_entry "$CODEX_HOME/auth.json")
    if [ -n "$auth_entry" ]; then
      IFS=$'	' read -r existing_key_name existing_key_value <<< "$auth_entry"
      AUTH_ENV_VAR_NAME="$existing_key_name"
      info "Existing auth.json credential found: $AUTH_ENV_VAR_NAME=$(mask_secret "$existing_key_value")"
    else
      info "Existing auth.json found; leaving it untouched"
    fi
    SKIP_AUTH=true
    info "Detected existing authentication configuration; keeping it without prompting"
  elif [ "$SKIP_PROVIDER" = true ]; then
    SKIP_AUTH=true
    if ! detect_existing_env_auth "$PROVIDER_NAME"; then
      info "Existing Codex config detected; installer will not prompt for credentials or overwrite your current auth flow"
    fi
  fi
}

# ============================================================
# Step 3: Choose provider (skipped if existing config kept)
# ============================================================
choose_provider() {
  if [ "$SKIP_PROVIDER" = true ]; then
    return
  fi

  echo ""
  bold "Select API provider:"
  echo ""
  for i in "${!PRESET_LABELS[@]}"; do
    echo "  $((i+1))) ${PRESET_LABELS[$i]}"
  done
  echo ""

  local choice
  read -rp "Enter choice [1-2] (default: 1): " choice
  choice="${choice:-1}"

  local idx=$((choice - 1))
  if [ "$idx" -lt 0 ] || [ "$idx" -ge "${#PRESET_NAMES[@]}" ]; then
    error "Invalid choice: $choice"
  fi

  PROVIDER_NAME="${PRESET_NAMES[$idx]}"
  PROVIDER_URL="${PRESET_URLS[$idx]}"
  MODEL="${PRESET_MODELS[$idx]}"

  if [ "$PROVIDER_NAME" = "custom" ]; then
    read -rp "Provider name: " PROVIDER_NAME
    read -rp "Base URL: " PROVIDER_URL
    read -rp "Model name: " MODEL
  else
    echo ""
    read -rp "Model name (default: $MODEL): " input_model
    MODEL="${input_model:-$MODEL}"
  fi

  info "Provider: $PROVIDER_NAME | URL: $PROVIDER_URL | Model: $MODEL"
}

# ============================================================
# Step 4: Configure API key (skipped if existing auth kept)
# ============================================================
configure_api_key() {
  if [ "$SKIP_AUTH" = true ]; then
    return
  fi

  echo ""
  read -rp "API key env var name (default: $AUTH_ENV_VAR_NAME): " input_env_name
  AUTH_ENV_VAR_NAME="${input_env_name:-$AUTH_ENV_VAR_NAME}"
  validate_env_var_name "$AUTH_ENV_VAR_NAME"

  local env_value="${!AUTH_ENV_VAR_NAME:-}"
  if [ -n "$env_value" ]; then
    API_KEY="$env_value"
    PERSIST_AUTH=true
    info "Detected $AUTH_ENV_VAR_NAME in current environment; will reuse it without prompting for the key again"
    return
  fi

  read -rsp "Enter API key for $AUTH_ENV_VAR_NAME (or press Enter to skip): " API_KEY
  echo ""
  if [ -z "$API_KEY" ]; then
    warn "No API key set. Make sure $AUTH_ENV_VAR_NAME is available in your environment before running Codex."
    SKIP_AUTH=true
    return
  fi

  PERSIST_AUTH=true
}

# ============================================================
# Step 5: Generate or merge config.toml
# ============================================================
generate_config() {
  local template="$SRC_DIR/config.toml"
  local target="$CODEX_HOME/config.toml"

  [ -f "$template" ] || error "Template config.toml not found at $template"

  if [ "$SKIP_PROVIDER" = true ]; then
    merge_scholar_config "$target" "$template"
  else
    if [ -f "$target" ]; then
      cp "$target" "${target}.bak"
      info "Backed up config.toml → config.toml.bak"
    fi
    sed -e "s|__MODEL__|$MODEL|g" \
        -e "s|__PROVIDER_NAME__|$PROVIDER_NAME|g" \
        -e "s|__PROVIDER_URL__|$PROVIDER_URL|g" \
        "$template" > "$target"
    info "Generated config.toml (model=$MODEL, provider=$PROVIDER_NAME)"
  fi
}

# ============================================================
# Merge Scholar-specific sections into existing config
# ============================================================
merge_scholar_config() {
  local target="$1"
  local template="$2"
  local added=0

  cp "$target" "${target}.bak"
  info "Backed up config.toml → config.toml.bak"

  if ! grep -q '^\[features\]' "$target" 2>/dev/null; then
    cat >> "$target" << 'FEATURES'

# ============================================================
# Features (added by Claude Scholar)
# ============================================================
[features]
multi_agent = true
memories = true
skill_approval = true
FEATURES
    added=$((added + 1))
  fi

  if ! grep -q '\[mcp_servers\.zotero\]' "$target" 2>/dev/null; then
    cat >> "$target" << 'MCP'

# ============================================================
# MCP Servers (added by Claude Scholar)
# ============================================================
[mcp_servers.zotero]
command = "zotero-mcp"
args = ["serve"]
enabled = false
[mcp_servers.zotero.env]
ZOTERO_LOCAL = "true"
NO_PROXY = "localhost,127.0.0.1"
MCP
    added=$((added + 1))
  fi

  if ! grep -q '\[agents\.' "$target" 2>/dev/null; then
    sed -n '/^# --- Research Workflow/,$ p' "$template" >> "$target"
    added=$((added + 1))
  fi

  if [ "$added" -gt 0 ]; then
    info "Merged $added Scholar section(s) into existing config.toml"
  else
    info "Config already has all Scholar sections, no changes needed"
  fi
}

# ============================================================
# Step 6: Write auth.json (only when installer captured a key)
# ============================================================
write_auth() {
  if [ "$PERSIST_AUTH" != true ]; then
    return
  fi

  local target="$CODEX_HOME/auth.json"
  if [ -f "$target" ]; then
    cp "$target" "${target}.bak"
  fi

  node -e '
    const fs = require("fs");
    const envName = process.argv[1];
    const apiKey = process.argv[2];
    const target = process.argv[3];
    const payload = {};
    payload[envName] = apiKey;
    if (envName !== "OPENAI_API_KEY") {
      payload.OPENAI_API_KEY = apiKey;
    }
    fs.writeFileSync(target, JSON.stringify(payload, null, 2) + "\n");
  ' "$AUTH_ENV_VAR_NAME" "$API_KEY" "$target"
  chmod 600 "$target"

  if [ "$AUTH_ENV_VAR_NAME" = "OPENAI_API_KEY" ]; then
    info "Wrote auth.json (permissions: 600)"
  else
    info "Wrote auth.json with $AUTH_ENV_VAR_NAME and OPENAI_API_KEY for Codex compatibility (permissions: 600)"
  fi
}

# ============================================================
# Step 7: Copy components to ~/.codex/ (additive merge)
# ============================================================
copy_components() {
  if [ -d "$SRC_DIR/skills" ]; then
    mkdir -p "$CODEX_HOME/skills"
    cp -r "$SRC_DIR/skills/." "$CODEX_HOME/skills/"
    local count
    count=$(ls -d "$CODEX_HOME/skills"/*/ 2>/dev/null | wc -l | tr -d ' ')
    info "Synced skills: $count total"
  fi

  if [ -d "$SRC_DIR/agents" ]; then
    mkdir -p "$CODEX_HOME/agents"
    cp -r "$SRC_DIR/agents/." "$CODEX_HOME/agents/"
    local count
    count=$(ls -d "$CODEX_HOME/agents"/*/ 2>/dev/null | wc -l | tr -d ' ')
    info "Synced agents: $count total"
  fi

  if [ -f "$SRC_DIR/AGENTS.md" ]; then
    if [ -f "$CODEX_HOME/AGENTS.md" ]; then
      cp "$CODEX_HOME/AGENTS.md" "$CODEX_HOME/AGENTS.md.bak"
    fi
    cp "$SRC_DIR/AGENTS.md" "$CODEX_HOME/AGENTS.md"
    info "Synced AGENTS.md"
  fi

  if [ -d "$SRC_DIR/scripts" ]; then
    mkdir -p "$CODEX_HOME/scripts"
    cp -r "$SRC_DIR/scripts/." "$CODEX_HOME/scripts/"
    info "Synced scripts/"
  fi

  if [ -d "$SRC_DIR/utils" ]; then
    mkdir -p "$CODEX_HOME/utils"
    cp -r "$SRC_DIR/utils/." "$CODEX_HOME/utils/"
    info "Synced utils/"
  fi
}

# ============================================================
# Step 8: Optional - Enable Zotero MCP
# ============================================================
configure_mcp() {
  if grep -q 'enabled = true' "$CODEX_HOME/config.toml" 2>/dev/null; then
    info "Zotero MCP already enabled"
    return
  fi

  echo ""
  read -rp "Enable Zotero MCP server? [y/N]: " enable_zotero
  if [ "$enable_zotero" = "y" ] || [ "$enable_zotero" = "Y" ]; then
    sed -i.tmp 's/enabled = false/enabled = true/' "$CODEX_HOME/config.toml"
    rm -f "$CODEX_HOME/config.toml.tmp"
    info "Zotero MCP enabled"
    if ! command -v zotero-mcp >/dev/null 2>&1; then
      warn "zotero-mcp not found. Install: uv tool install git+https://github.com/Galaxy-Dawn/zotero-mcp.git"
    fi
  fi
}

# ============================================================
# Main
# ============================================================
main() {
  echo ""
  echo "╔══════════════════════════════════════╗"
  echo "║   Claude Scholar Installer (Codex)   ║"
  echo "╚══════════════════════════════════════╝"
  echo ""

  check_deps

  info "Source: $SRC_DIR"
  info "Target: $CODEX_HOME"
  mkdir -p "$CODEX_HOME"

  detect_existing
  choose_provider
  configure_api_key
  generate_config
  write_auth
  copy_components
  configure_mcp

  echo ""
  echo "============================================================"
  info "Installation complete!"
  echo ""
  echo "  Config:  $CODEX_HOME/config.toml"
  echo "  Auth:    $CODEX_HOME/auth.json"
  echo "  Skills:  $CODEX_HOME/skills/"
  echo "  Agents:  $CODEX_HOME/agents/"
  echo ""
  echo "  Run $(bold 'codex') to start."
  echo "============================================================"
}

main "$@"
