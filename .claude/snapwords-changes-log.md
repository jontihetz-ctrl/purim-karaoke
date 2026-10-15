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
