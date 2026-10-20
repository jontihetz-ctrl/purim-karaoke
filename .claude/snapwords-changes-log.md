# SnapWords Changes Log

## Session: 2026-10-15 — Next-Level Redesign

### Security hardening (applied via VPS bridge)
- `next.config.js`: Added security headers (X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy, X-XSS-Protection, X-DNS-Prefetch-Control)
- `src/app/api/lessons/route.ts`: Added in-memory rate limiting (30 req/min per IP) and server-side input validation (title ≤200 chars, ≤200 pairs, each value ≤500 chars)

### Game picker redesign (`src/app/play/[lessonId]/PlayPageClient.tsx`)
- Replaced plain white vertical card list with colorful 2-column gradient tile grid
- Each game has its own gradient: violet (Matching), blue (Memory), red (Word Fighter), emerald (Crossword), amber (Spell It), cyan (Word Finder)
- Added taglines per game ("Pair them up", "Flip and find", etc.)
- Hover scale animation on each tile
- Pronounce It (beta) remains as full-width card below the grid

### Landing page redesign (`src/app/page.tsx`)
- Hero background: generic blue gradient → deep aquarium dark (#071828 → #0C2340)
- Headline: "Vocabulary games your students actually want to play" → "Every game they play builds your class's world"
- Sub-copy now mentions the class world reward mechanic
- Second CTA: "Try a demo game" → "🐠 See a live class world"
- Games grid tiles: plain white cards → colorful gradient tiles per game
- Fish tank section: light sky/blue → dark navy background to match hero
- Final CTA: standard blue gradient → blue-to-violet diagonal
- All copy updated to lead with the world mechanic as the primary value prop

### Deployed
- Production: https://snapwords.net

## Session: 2026-10-15 — End-to-end test + fixes

### Critical fix: students couldn't join classes
- The `classes` and `students` tables stopped being readable by anonymous visitors (database access rules changed outside this session). New students got "Class not found", and class/student names were blank everywhere.
- Fix keeps the tables locked and reads them server-side with the service client, selecting only safe columns: `api/students`, `api/worlds/[worldId]` GET, `api/classes/[classId]` GET (public fallback: id, name, roster), `play/[lessonId]/page.tsx`, `class/[classId]/page.tsx`, `class/[classId]/world/[worldId]/page.tsx`. Student names capped at 40 chars.
- Backups on VPS: `/root/snapwords-rls-fix-backup/`

### Dashboard: swipe between a class's worlds
- Each class card is now a carousel of all its worlds (busiest first). Swipe on touch, arrows + dots on desktop. Other worlds load when first shown.
- Stats under the card (count, newest arrival, medal progress, "+N this week") follow the visible world.
- Backups on VPS: `/root/snapwords-carousel-backup/`

### Reveal screen
- The new creature's name label moved under the scene so it no longer covers the creature.

### Tested
- Full student flow (join → picker → Matching → design → reveal) on all 8 world types, desktop + phone, plus the teacher dashboard. Test creatures and lesson deleted afterwards.

## Session: 2026-10-15 — Site-wide design pass
- New shared pieces: `src/components/ui/TeacherHero.tsx` (navy header band) and `src/lib/gameStyle.ts` (one gradient per game).
- Teacher pages on the navy header: class detail (tabs inside the header), lesson new/view/edit (games shown in their colours), library (search inside the header), account, billing/upgrade.
- Login, reset-password, resend-confirmation, contact: navy background with centred card.
- Student side: every game's top bar uses its game colour (incl. crossword + word finder), restyled name picker and completion screen, navy header on the public class and world pages, fixed the "Residents" heading overlapping the "swam further away" note.
- Dashboard: admin link (🛠) now visible on phones; "+ New lesson" shortened to "+" on phones so it isn't cut off.
- Backup of all source before the pass: `/root/snapwords-design-backup/src-before-design.tgz`; per-file backups in `/root/snapwords-design-backup/{A,B,C,D,E}/`.
- Verified: no new type errors, screenshots of every page, full student flow on desktop + phone, no page errors.

## Session: 2026-10-15 — Incident: stale deploy rolled production back, then merged
- **What happened:** the VPS copy of SnapWords was a month behind GitHub `main` (last synced Sep 9). Every `vercel --prod` from it today (15:51–17:48 UTC) replaced the Oct 12 production build, removing a month of fixes (security/RLS lockdown, billing, email opt-out, game fixes, new characters). The "class not found" bug found earlier today was this regression, not a new bug.
- **Damage window:** ~15:51–18:10 UTC. No scheduled emails ran in that window.
- **Fix:** promoted the Oct 12 build back to production; merged today's redesign onto `origin/main` (20 conflicts resolved, Oct 12 logic kept everywhere, design re-applied); type check clean (0 errors); pushed merge `84d0d384` to `main`, which auto-deployed via GitHub.
- **Also in the merge:** security headers now allow mic/camera on the site's own pages (the earlier version would have broken Pronounce It); `.env.local`, `.next/` and backup files untracked; never-deployed stray endpoints (`admin/debug-users`, `admin-email`, `vacation-email`, `suggest`) and an uncommitted SoundQuest rewrite left out — still recoverable from local branch `redesign-oct15` on the VPS.
- **Prevention:** CLAUDE.md now requires `git fetch`/sync before any SnapWords change, and deploying by pushing to `main`.
- **Verified after merge:** student flow on desktop + phone (designer now opens automatically after a win — Oct 12 behaviour), dashboard carousel, all pages, no errors. VPS copy now equals `origin/main`; temporary backups removed.

## Session: 2026-10-16/17 — Full site review + fixes
Six-reviewer audit (student/teacher/public visuals, security, correctness, quality). Fixed and verified live:
- **DB (SQL run by owner, migration 025):** no anonymous inserts into contributions/worlds; word_attempts RLS on (teachers read own lessons). Contributions now inserted with the service key.
- **Batch 1 (d4ba26be):** sign-up links open sign-up; world page Play→newest lesson, Dashboard only for signed-in, world must match class; new classes get their world again; designed fish = arriving fish; phone overflow; digest escapes names.
- **Next.js 14.2.18 → 14.2.35 (da8a6dd2):** middleware-bypass CVE fixed (probe redirects to login).
- **Round 2 (260bbf8d):** world scenes rebuilt on a shared frame-rate-independent loop (165-creature world: 18→48 fps at 4x CPU throttle, 0 long tasks; 60 fps normal), polling 5s→60s and paused when hidden, reduced-motion; honest pricing/game count via `src/lib/siteFacts.ts`, new OG image, titles, pinch-zoom; teacher fixes (default world, limit panel, usage counts, single share link, worksheet back link, student counts, edit validation); student fixes (no teacher links, game scoring rules, hydration, creature icons, contrast, compact designer); credentials scripts + promo/node_modules + venv untracked (still on VPS); obsolete open endpoint removed; weekly digest pages all users.
- **Pending owner action:** run SQL 026 (`game_sessions.won`) + 027 (`ocr_usage`) — the win-only unlock patch is parked at `/root/won-unlocks.patch` on the VPS; rotate leaked keys (Supabase service role, Resend, Vercel token, Pinterest); outdated beta wording in /terms and /refund-policy.
- **Next:** stop public listing of lessons/vocab/worlds and direct game_session inserts (roster enumeration + unlock cheating) — needs code + SQL batch.

## 2026-10-17 — Final security batch + email
- **8e8efd44:** students/visitors read lessons, word lists and worlds server-side (31 reads, is_public filters kept); Dragon's Lair mood now sees real sessions.
- **SQL run by owner (026–028, recorded in repo by 8704c409):** `game_sessions.won`, `ocr_usage` table, dropped public list policies on lessons / vocabulary_pairs / worlds and anonymous game_session inserts. Verified: anon key lists 0 rows on lessons, vocabulary_pairs, worlds, classes, students, word_attempts; direct session insert refused.
- **8704c409:** only wins unlock creatures (verified a win stores won=true).
- **Email:** hello@snapwords.net forwards via ImprovMX (MX ok) but lands in Gmail spam. Owner TODO: add Namecheap TXT `@` = `v=spf1 include:spf.improvmx.com ~all`; Gmail filter "Never send to Spam" for to:hello@snapwords.net.
- **Still pending (owner):** rotate leaked keys (Supabase service role, Resend, Vercel token, Pinterest); old beta wording in /terms and /refund-policy; owner digest counts Stripe subscribers (billing is Paddle) → always 0.
- **2026-10-18 email fixed:** SPF TXT `v=spf1 include:spf.improvmx.com ~all` added at Namecheap (verified on Google + Cloudflare DNS). Test mail to hello@ via Resend → ImprovMX DELIVERED → landed in Gmail Inbox (Updates tab), not Spam. ImprovMX API key stored at `/root/.improvmx/credentials` on the VPS. Unsubscribed naomikahn7@gmail.com and kerenor01092020@gmail.com (rosullivan@stnessans.ie already opted out); library-promo now honours opt-outs (bf799f72).

## 2026-10-18 — Review round 3 (fa663f6e) + migration 029
- Security: shared Postgres rate limiter (migration 029 run by owner; verified limit trips, anon can't call it), isAdminEmail() in 17 files, timing-safe secret checks (deny when unset), no tokens in auth logs, /lab noindex, conservative CSP, type errors now fail the Vercel build.
- Correctness: creature counts no longer cap at 1000; owner digest uses Paddle; crossword places every word (372/372 test words, was 217).
- Polish: SEO pages fully restyled + real worlds list, navy favicon, paginated contributions tab, library fixes, Dino Land limbs without React re-renders (60fps normal, 24fps at 4x throttle — revisit in Worlds 2.0), contrast, screen-reader support, WordRace hydration.
- Wording: terms/refund say beta ended 31 Aug 2026, keep beta users' lifetime promise; nudge email / OG badge / outreach + promo emails no longer promise free beta.
- Removed deps: puppeteer, @stripe/stripe-js, stripe.
- Verified: all games, picker, class/world pages, demo, creature flow desktop + phone, dashboard, every page sweep — no errors.
- Still owner: rotate leaked keys (+ optional git history scrub).

## 2026-10-18 — Worlds 2.0: Fish Tank (live, 953b72ac)
- Illustrated fish tank: parallax scenery, god-rays, sand caustics, swaying kelp, bubbling treasure chest, plankton, background fish schools, time-of-day palette; creatures keep customizations and gain shading, blinking, eased turns, idle moments. 165-creature tank: 60 fps normal, 50–53 fps at 4x CPU throttle. Approved by owner on the Vercel preview.
- Also: library-promo Resend client made lazy (preview builds have no RESEND_API_KEY) — d6445f52.
- Next time: carry the style to Dino Land (also fix its 24 fps at 4x), City, Candy, Dragon's Lair, critter worlds. Optional: harden the VPS bridge (plain HTTP, root); key rotation checklist emailed to owner.
- **2026-10-19 one-click unsubscribe (caf3385f):** all bulk emails send List-Unsubscribe + one-click headers (Gmail/Outlook "Unsubscribe" button) with a signed per-account link and a footer link; /api/unsubscribe accepts the one-click POST and preserves other metadata. Verified live (valid → 200, bad sig → 400). Unsubscribed Sheila.Fox@southeasttech.edu by request.

## 2026-10-20 — Worlds 2.0 complete (cc012768 + 7f9c926c)
- All worlds now illustrated: Dino Land (golden-hour valley, volcano), City (harbour town, day/night), Candy Kingdom (rainbow, chocolate river), Dragon's Lair (crystal cavern, mood lighting), and the 5 critter worlds (woodland, bug garden, space station, farm, arctic) on a shared scene kit. Approved by owner on preview.
- Perf at 4x CPU throttle: Dino 41.5→48.7, City 38–42→59, Candy 24.5→58.4, critters 45–55→54–60 fps; Dragon's Lair unchanged ~29 fps with 30 dragons (follow-up).
- Verified live: every world type loads with no errors on desktop + phone. Fixed City buildings oversizing in the tall phone frame (7f9c926c).
- Follow-ups: Dragon's Lair perf with many dragons; no Bug Garden exists in any class yet (only harness-tested).

## 2026-10-20 — Games 2.0, faster pages, HTTPS bridge
- **Games 2.0 live (be1035d0):** every game takes on the class world — theme kit in `src/components/games/theme/` (baked still backdrops, per-world tile skins, reward bursts, mascot, combo meter, themed end screen) across Matching, Memory, Crossword, Word Finder, Spell It, Pronounce It, Word Fighter (canvas: world ships/targets/scenery), Word Race, name picker. Crossword celebrates on Check (owner's choice), typing replaces filled squares. Verified live: all game pages load themed, playthroughs desktop + phone.
- **Server region (036be9dc):** `vercel.json` regions → `dub1` (Dublin), next to Supabase eu-west-1. Was iad1 with ~450 ms per DB call. Class page full content: Grade 4 2.2→1.2 s, historya 1.5→0.6 s, My Lessons 1.5→0.4 s (measured from US).
- **Class page (6e96f939):** instant loading skeleton, parallel queries/paging, pre-counted word analytics (identical numbers).
- **Bridge:** secret was publicly readable in this public repo → rotated twice, now HTTPS-only at https://bridge.snapwords.net (Caddy + Let's Encrypt), hardened bridge, vps.env untracked; credentials from Claude Code environment variables.
