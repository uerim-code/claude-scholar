#!/usr/bin/env bash
set -euo pipefail

OPENCODE_DIR="$HOME/.opencode"
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
SRC_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
COMPONENTS=(skills commands plugins scripts utils AGENTS.md)
BACKUP_ROOT="$OPENCODE_DIR/.claude-scholar-backups"
BACKUP_STAMP="$(date +%Y%m%d-%H%M%S)"
BACKUP_DIR="$BACKUP_ROOT/$BACKUP_STAMP"
BACKUP_READY=0
BACKUP_COUNT=0
UPDATED_COUNT=0
SKIPPED_COUNT=0

info()  { echo -e "\033[1;34m[INFO]\033[0m $*"; }
warn()  { echo -e "\033[1;33m[WARN]\033[0m $*"; }
error() { echo -e "\033[1;31m[ERROR]\033[0m $*"; exit 1; }

check_deps() {
  command -v git  >/dev/null || error "Git is required. Install it first."
  command -v node >/dev/null || error "Node.js is required for safe opencode.jsonc merging. Install it first."
}

ensure_backup_dir() {
  if [ "$BACKUP_READY" -eq 0 ]; then
    mkdir -p "$BACKUP_DIR"
    BACKUP_READY=1
    info "Backup directory: $BACKUP_DIR"
  fi
}

backup_path() {
  local target="$1"
  [ -e "$target" ] || return 0

  ensure_backup_dir

  local rel="${target#$OPENCODE_DIR/}"
  if [ "$rel" = "$target" ]; then
    rel="$(basename "$target")"
  fi

  mkdir -p "$BACKUP_DIR/$(dirname "$rel")"
  if [ -d "$target" ]; then
    cp -R "$target" "$BACKUP_DIR/$rel"
  else
    cp -p "$target" "$BACKUP_DIR/$rel"
  fi
  BACKUP_COUNT=$((BACKUP_COUNT + 1))
}

copy_file_safely() {
  local src_file="$1"
  local target_file="$2"

  mkdir -p "$(dirname "$target_file")"

  if [ -f "$target_file" ] && [ ! -L "$target_file" ] && cmp -s "$src_file" "$target_file"; then
    SKIPPED_COUNT=$((SKIPPED_COUNT + 1))
    return 0
  fi

  if [ -e "$target_file" ]; then
    backup_path "$target_file"
    if [ -d "$target_file" ] || [ -L "$target_file" ]; then
      rm -rf "$target_file"
    fi
  fi

  cp -p "$src_file" "$target_file"
  UPDATED_COUNT=$((UPDATED_COUNT + 1))
}

copy_dir_safely() {
  local src_dir="$1"
  local target_dir="$2"

  if [ -L "$target_dir" ] || { [ -e "$target_dir" ] && [ ! -d "$target_dir" ]; }; then
    backup_path "$target_dir"
    rm -rf "$target_dir"
  fi
  mkdir -p "$target_dir"

  while IFS= read -r -d '' src_file; do
    local rel="${src_file#$src_dir/}"
    local target_file="$target_dir/$rel"
    copy_file_safely "$src_file" "$target_file"
  done < <(find "$src_dir" -type f -print0)
}

copy_components() {
  local src="$1"
  for comp in "${COMPONENTS[@]}"; do
    if [ -e "$src/$comp" ]; then
      if [ -d "$src/$comp" ]; then
        copy_dir_safely "$src/$comp" "$OPENCODE_DIR/$comp"
      else
        copy_file_safely "$src/$comp" "$OPENCODE_DIR/$comp"
      fi
    fi
  done
  info "Updated components: ${COMPONENTS[*]}"
}

merge_opencode_config() {
  local template="$1/opencode.jsonc"
  local target="$OPENCODE_DIR/opencode.jsonc"

  [ -f "$template" ] || return 0

  if [ ! -f "$target" ]; then
    cp "$template" "$target"
    info "Installed opencode.jsonc from template."
    return 0
  fi

  backup_path "$target"
  cp "$target" "${target}.bak"
  info "Backed up opencode.jsonc → opencode.jsonc.bak"

  OPENCODE_TARGET="$target" OPENCODE_TEMPLATE="$template" OPENCODE_HOME="$OPENCODE_DIR" node <<'NODE'
const fs = require('fs');
const path = require('path');
const { pathToFileURL } = require('url');
const targetPath = process.env.OPENCODE_TARGET;
const templatePath = process.env.OPENCODE_TEMPLATE;
const opencodeHome = process.env.OPENCODE_HOME;
const existing = JSON.parse(fs.readFileSync(targetPath, 'utf8'));
const template = JSON.parse(fs.readFileSync(templatePath, 'utf8'));

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function mergeMissing(existingValue, templateValue) {
  if (existingValue === undefined) return clone(templateValue);
  if (templateValue === null || Array.isArray(templateValue) || typeof templateValue !== 'object') {
    return existingValue;
  }

  const output = { ...existingValue };
  for (const [key, value] of Object.entries(templateValue)) {
    if (!(key in output)) {
      output[key] = clone(value);
      continue;
    }
    if (
      output[key] && value && !Array.isArray(output[key]) && !Array.isArray(value) &&
      typeof output[key] === 'object' && typeof value === 'object'
    ) {
      output[key] = mergeMissing(output[key], value);
    }
  }
  return output;
}

const merged = { ...existing };
if (template.$schema && !merged.$schema) merged.$schema = template.$schema;

merged.agent = { ...(existing.agent || {}) };
for (const [key, value] of Object.entries(template.agent || {})) {
  merged.agent[key] = clone(value);
}

merged.permission = mergeMissing(existing.permission || {}, template.permission || {});
for (const [key, value] of Object.entries(template.permission || {})) {
  if (value && typeof value === 'object' && !Array.isArray(value)) {
    merged.permission[key] = { ...(merged.permission[key] || {}), ...clone(value) };
  } else {
    merged.permission[key] = clone(value);
  }
}

merged.mcp = existing.mcp || {};
for (const [key, value] of Object.entries(template.mcp || {})) {
  merged.mcp[key] = mergeMissing(merged.mcp[key], value);
}

const plugin = Array.isArray(existing.plugin) ? clone(existing.plugin) : [];
const seen = new Set(plugin.map((item) => JSON.stringify(item)));
for (const item of template.plugin || []) {
  const sig = JSON.stringify(item);
  if (!seen.has(sig)) {
    plugin.push(clone(item));
    seen.add(sig);
  }
}

const repoManagedPlugins = [
  "session-summary.ts",
  "session-start.ts",
  "security-guard.ts",
  "skill-eval.ts",
  "stop-summary.ts",
]
  .map((name) => path.join(opencodeHome, "plugins", name))
  .filter((pluginPath) => fs.existsSync(pluginPath))
  .map((pluginPath) => pathToFileURL(pluginPath).href);

for (const item of repoManagedPlugins) {
  const sig = JSON.stringify(item);
  if (!seen.has(sig)) {
    plugin.push(item);
    seen.add(sig);
  }
}
merged.plugin = plugin;

fs.writeFileSync(targetPath, JSON.stringify(merged, null, 2) + '\n');
NODE

  info "Merged repo-managed agent/mcp/permission/plugin entries into opencode.jsonc while preserving existing provider/model/auth settings."
}

main() {
  echo ""
  echo "╔══════════════════════════════════════╗"
  echo "║  Claude Scholar Installer (OpenCode) ║"
  echo "╚══════════════════════════════════════╝"
  echo ""

  check_deps
  mkdir -p "$OPENCODE_DIR"
  info "Installing from: $SRC_DIR"
  copy_components "$SRC_DIR"
  merge_opencode_config "$SRC_DIR"
  info "Updated files: $UPDATED_COUNT | Unchanged files skipped: $SKIPPED_COUNT | Backups created: $BACKUP_COUNT"
  if [ "$BACKUP_READY" -eq 1 ]; then
    info "Recover previous files from: $BACKUP_DIR"
  fi

  echo ""
  info "Done! Restart OpenCode CLI to activate."
  echo ""
}

main "$@"
