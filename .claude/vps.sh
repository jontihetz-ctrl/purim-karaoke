#!/bin/bash
# Usage: source .claude/vps.sh
# Then: vps "your command here"

set -a
source "$(dirname "${BASH_SOURCE[0]}")/vps.env"
set +a

vps() {
  curl -s -X POST "$VPS_BRIDGE_URL" \
    -H "X-Secret: $VPS_BRIDGE_SECRET" \
    -H "Content-Type: application/json" \
    -d "$(python3 -c "import json,sys; print(json.dumps({'cmd':sys.argv[1],'cwd':sys.argv[2] if len(sys.argv)>2 else '/root'}))" "$1" "${2:-/root}")" \
  | python3 -c "
import sys, json
d = json.load(sys.stdin)
if d['stdout']: print(d['stdout'], end='')
if d['stderr']: print(d['stderr'], end='', file=sys.stderr)
sys.exit(d['rc'])
"
}

export -f vps
echo "VPS bridge ready. Use: vps \"command\""
