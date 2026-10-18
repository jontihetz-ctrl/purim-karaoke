# Claude Session Guide

> **IMPORTANT — READ FIRST:** This project has a VPS (159.223.187.231) accessed via an HTTP bridge — NOT SSH. No SSH keys needed. Run all VPS commands via the curl pattern below. The session-start hook auto-exports `$VPS_BRIDGE_URL` and `$VPS_BRIDGE_SECRET` into your environment. Verify connection before any task.

## Session Start Checklist

At the start of every session, **always do this first**:
1. Verify VPS connection by running `echo VPS_OK` through the bridge (see VPS Access below)
2. If `$VPS_BRIDGE_URL` is already in the environment (set by the session-start hook), use it directly — no need to `source vps.env`
3. Confirm connection before proceeding with any task

## VPS Access

All commands on the VPS run via the claude-bridge HTTP API (no SSH needed).
Credentials are in `.claude/vps.env`.

```bash
source /home/user/purim-karaoke/.claude/vps.env
curl -s -X POST "$VPS_BRIDGE_URL" \
  -H "X-Secret: $VPS_BRIDGE_SECRET" \
  -H "Content-Type: application/json" \
  -d '{"cmd": "YOUR_COMMAND_HERE"}' | python3 -c "import sys,json; d=json.load(sys.stdin); print(d['stdout'],end=''); print(d['stderr'],end='')"
```

Helper function (paste at start of any session):

```bash
vps() {
  source /home/user/purim-karaoke/.claude/vps.env
  curl -s -X POST "$VPS_BRIDGE_URL" \
    -H "X-Secret: $VPS_BRIDGE_SECRET" \
    -H "Content-Type: application/json" \
    -d "{\"cmd\": \"$1\"}" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d['stdout'],end=''); print(d['stderr'],end='')"
}
```

## VPS Details

- Host: 159.223.187.231 (DigitalOcean, NYC)
- OS: Ubuntu 24.04, 1 vCPU / 1GB RAM
- Bridge: systemd service `claude-bridge` on port 80 — always on, survives reboots

## Tokens (stored on VPS, not here)

- **Vercel token**: `/root/.vercel/auth.json` on the VPS
- **GitHub token**: stored on VPS
- **ImprovMX API key** (email forwarding for @snapwords.net — hello@, jonti@, support@, billing@ → jontihetz@gmail.com): `/root/.improvmx/credentials` on the VPS (`. /root/.improvmx/credentials` then `curl -u "api:$IMPROVMX_API_KEY" https://api.improvmx.com/v3/domains/snapwords.net/logs`). Logs only keep ~1 day on the current plan.
- To deploy snapwords: see **"SnapWords — always sync with GitHub first"** below. Never run `vercel --prod` on a folder that isn't up to date with `origin/main`.

---

## Projects on the VPS

### SnapWords — https://snapwords.net
**What it is:** A vocabulary games app for teachers. Teachers create word-pair lessons, share one link, students play 4 games (matching, memory, word fighter, crossword) with no login needed. Students earn creatures that join a shared class "world" (aquarium, dino land, city, candy kingdom).

**Codebase:** `/root/.openclaw/workspace-main/projects/snapwords`
- Next.js 14, TypeScript, Supabase (Postgres), Vercel deployment
- Git remote: `https://github.com/jontihetz-ctrl/snapwords`
- Supabase URL: `https://zgncmjtppqulyqxntrrf.supabase.co`

**Key files:**
- `src/app/page.tsx` — landing page
- `src/lib/billing.ts` — beta end date (`BETA_END_DATE`), free/unlimited during beta
- `src/components/billing/UsageBanner.tsx` — in-app beta banner (`BETA_END` date + display text)
- `src/lib/worlds/registry.ts` — world types (fish_tank, city_builder, dino_land, candy_kingdom)
- `src/lib/creatures/registry.ts` — fish tank creature unlock system
- `src/components/world/ContributionFlow.tsx` — student flow after completing a game
- `src/components/world/scenes/` — animated world scenes (FishTankWorld, CityWorld, DinoLand, CandyKingdom)
- `src/components/world/renderers/` — SVG renderers for each item type
- `src/components/world/customizers/` — UI for students to customise their item

**Beta status:** The free beta **ended 31 August 2026** (`BETA_END_DATE` in `src/lib/billing.ts`). Beta sign-ups are grandfathered (`profiles.is_grandfathered`) with permanent free unlimited access — /terms and /refund-policy promise this, so never remove it. New teachers get the free plan (limits in `TIER_LIMITS`); paid plans Teacher $5/mo, School $20/mo via Paddle. Public pricing/game-count copy comes from `src/lib/siteFacts.ts`.

**SnapWords — always sync with GitHub first (READ BEFORE ANY CHANGE OR DEPLOY):**
Production normally deploys automatically from GitHub `main`; other sessions push there too. On 2026-10-15 the VPS folder was a month behind GitHub, and running `vercel --prod` from it rolled production back by a month until it was caught and reverted. Before editing or deploying:
1. `cd /root/.openclaw/workspace-main/projects/snapwords && HOME=/root git fetch origin && HOME=/root git status -sb` — if it says `behind`, run `git pull --rebase origin main` first (stash local edits if needed).
2. Make changes, then commit and `git push origin main`. The push triggers the Vercel production deploy — prefer this over `vercel --prod`.
3. Only use the manual `vercel --prod` command below if the folder is exactly at `origin/main` plus your pushed commits.
4. Don't run `tsc`/`next build` from several agents at once — the VPS has 1GB RAM.
5. `.env.local` is not tracked by git (it holds live keys) — never `git add` it.

**Manual deploy (only after step 1):**
```bash
source /home/user/purim-karaoke/.claude/vps.env
curl -s -X POST "$VPS_BRIDGE_URL" -H "X-Secret: $VPS_BRIDGE_SECRET" \
  -H "Content-Type: application/json" \
  -d '{"cmd": "TOKEN=$(cat /root/.vercel/auth.json | python3 -c \"import sys,json; print(json.load(sys.stdin)[\\\"token\\\"])\") && cd /root/.openclaw/workspace-main/projects/snapwords && vercel --prod --yes --token $TOKEN 2>&1 | tail -10"}' \
  | python3 -c "import sys,json; d=json.load(sys.stdin); print(d['stdout'])"
```

**World unlock system (creature/item types per world):**
- 🐠 Fish Tank: fish(1) → crab(2) → octopus(3) → turtle(4) → jellyfish(5) → shark(6)
- 🏙️ City Builder: tower(1) → park(2) → hot air balloon(3) → monument(4)
- 🦕 Dino Land: t-rex+longneck(1) → triceratops+stegosaurus(2) → raptor+ankylosaurus(3) → pterodactyl+blob(4)
- 🍭 Candy Kingdom: castle(1) → lollipop(2) → gingerbread(3) → ice cream(4)

---

### Purim Karaoke — this repo
A karaoke queue app for a Purim event. Node.js/Express + Socket.io. Runs locally during the event.
