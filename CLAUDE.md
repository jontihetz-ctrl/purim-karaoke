# Purim Karaoke

## VPS Access

All commands on the VPS run via the claude-bridge HTTP API (no SSH needed).
Config is in `.claude/vps.env`.

```bash
source .claude/vps.env
curl -s -X POST $VPS_BRIDGE_URL \
  -H "X-Secret: $VPS_BRIDGE_SECRET" \
  -H "Content-Type: application/json" \
  -d '{"cmd": "YOUR_COMMAND_HERE"}'
```

Or use this helper function at the start of any session:

```bash
vps() {
  source /home/user/purim-karaoke/.claude/vps.env
  curl -s -X POST "$VPS_BRIDGE_URL" \
    -H "X-Secret: $VPS_BRIDGE_SECRET" \
    -H "Content-Type: application/json" \
    -d "{\"cmd\": \"$1\"}" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d['stdout'],end=''); print(d['stderr'],end='')"
}
```

The bridge is a systemd service (`claude-bridge`) running on the VPS on port 80.
It survives reboots. No reconnection needed.

## VPS Details

- Host: 159.223.187.231 (DigitalOcean, NYC)
- OS: Ubuntu 24.04, 1 vCPU / 1GB RAM
- Running: openclaw (Node.js gateway, port 18789), claude-bridge (port 80)
