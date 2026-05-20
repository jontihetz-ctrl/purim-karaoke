#!/bin/bash
set -euo pipefail

# Only run in remote (web) sessions
if [ "${CLAUDE_CODE_REMOTE:-}" != "true" ]; then
  exit 0
fi

# Export VPS credentials into the session environment
VPS_ENV="$CLAUDE_PROJECT_DIR/.claude/vps.env"
if [ -f "$VPS_ENV" ]; then
  # shellcheck disable=SC1090
  source "$VPS_ENV"
  {
    echo "export VPS_HOST=$VPS_HOST"
    echo "export VPS_BRIDGE_URL=$VPS_BRIDGE_URL"
    echo "export VPS_BRIDGE_SECRET=$VPS_BRIDGE_SECRET"
  } >> "$CLAUDE_ENV_FILE"
fi

# Verify VPS bridge is reachable
VPS_CHECK=$(curl -s --max-time 5 -X POST "$VPS_BRIDGE_URL" \
  -H "X-Secret: $VPS_BRIDGE_SECRET" \
  -H "Content-Type: application/json" \
  -d '{"cmd": "echo VPS_OK"}' 2>/dev/null || echo "UNREACHABLE")

if echo "$VPS_CHECK" | grep -q "VPS_OK"; then
  echo "VPS bridge: connected (${VPS_BRIDGE_URL})"
else
  echo "WARNING: VPS bridge unreachable at ${VPS_BRIDGE_URL}" >&2
fi
