#!/bin/bash
set -euo pipefail

# Only run in remote (web) sessions
if [ "${CLAUDE_CODE_REMOTE:-}" != "true" ]; then
  exit 0
fi

# VPS credentials come from the environment (Claude Code environment settings:
# VPS_BRIDGE_URL, VPS_BRIDGE_SECRET). A local, untracked .claude/vps.env is
# used only as a fallback — never commit it.
VPS_ENV="$CLAUDE_PROJECT_DIR/.claude/vps.env"
if [ -z "${VPS_BRIDGE_SECRET:-}" ] && [ -f "$VPS_ENV" ]; then
  # shellcheck disable=SC1090
  source "$VPS_ENV"
  {
    echo "export VPS_HOST=$VPS_HOST"
    echo "export VPS_BRIDGE_URL=$VPS_BRIDGE_URL"
    echo "export VPS_BRIDGE_SECRET=$VPS_BRIDGE_SECRET"
  } >> "$CLAUDE_ENV_FILE"
fi

# Verify VPS bridge is reachable
if [ -z "${VPS_BRIDGE_URL:-}" ] || [ -z "${VPS_BRIDGE_SECRET:-}" ]; then
  echo "WARNING: VPS bridge not configured — set VPS_BRIDGE_URL and VPS_BRIDGE_SECRET in the Claude Code environment settings" >&2
  exit 0
fi
VPS_CHECK=$(curl -s --max-time 5 -X POST "$VPS_BRIDGE_URL" \
  -H "X-Secret: $VPS_BRIDGE_SECRET" \
  -H "Content-Type: application/json" \
  -d '{"cmd": "echo VPS_OK"}' 2>/dev/null || echo "UNREACHABLE")

if echo "$VPS_CHECK" | grep -q "VPS_OK"; then
  echo "VPS bridge: connected (${VPS_BRIDGE_URL})"
else
  echo "WARNING: VPS bridge unreachable at ${VPS_BRIDGE_URL}" >&2
fi
