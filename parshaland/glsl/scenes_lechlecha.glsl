// ── SCENES (Lech Lecha) ─────────────────────────────────────────────────────
// Content rules: Hashem only as light. Women (Sarai/Sarah) are drawn dressed modestly (Person.female). Hagar is not shown. The war is shown without violence (a night chase, the captives freed).
// Every scene moves: a camera (CAM / CAMZ with parallax layers via lay()), living skies, birds, sparkles, and action timed to the narration lines (LS(i)).
Person avram() { Person P = defaultPerson(); P.robe = vec3(0.55, 0.18, 0.22); P.trim = vec3(0.92, 0.82, 0.55); P.beard = vec3(0.72, 0.68, 0.62); P.beardLen = 0.8;
  P.wrap = vec3(0.95, 0.92, 0.85); P.skin = vec3(0.9, 0.7, 0.55); P.blink = blinkAt(0.05); return P; }
Person lotP() { Person P = defaultPerson(); P.robe = vec3(0.3, 0.5, 0.4); P.trim = vec3(0.82, 0.72, 0.45); P.beard = vec3(0.35, 0.22, 0.1); P.beardLen = 0.35;
  P.wrap = vec3(0.75, 0.68, 0.5); P.blink = blinkAt(0.45); return P; }
Person eliezer() { Person P = defaultPerson(); P.robe = vec3(0.45, 0.4, 0.62); P.trim = vec3(0.85, 0.8, 0.65); P.beard = vec3(0.12, 0.08, 0.05); P.beardLen = 0.3;
  P.wrap = vec3(0.88, 0.85, 0.78); P.skin = vec3(0.76, 0.55, 0.4); P.blink = blinkAt(0.71); return P; }
Person malki() { Person P = defaultPerson(); P.robe = vec3(0.95, 0.93, 0.88); P.trim = vec3(0.92, 0.75, 0.3); P.beard = vec3(0.97, 0.97, 0.95); P.beardLen = 1.0;
  P.wrap = vec3(0.98, 0.96, 0.9); P.blink = blinkAt(0.29); return P; }
Person egyptian(float id) { Person P = townsperson(id); P.robe = vec3(0.95, 0.93, 0.86); P.trim = mix(vec3(0.2, 0.45, 0.75), vec3(0.85, 0.65, 0.2), hash1(id)); P.wrap = vec3(0.15, 0.12, 0.2);
  P.skin = vec3(0.72, 0.52, 0.38); P.beardLen = -1.0; return P; }
// where the front hand is, in screen space (matches drawPerson's arm)
vec2 handPos(vec2 pos, float h, Person P) { vec2 el; vec2 hq = armPoint(vec2(0.105, 0.56), P.armF, 0.17, 0.16, el); return pos + vec2(hq.x * P.facing, hq.y) * h; }
void torch(inout vec3 col, vec2 p, vec2 hand) {
  PX = 1.5 / uRes.y; ink(col, sdCap2(p, hand - vec2(0.0, 0.03), hand + vec2(0.0, 0.07), 0.008), vec3(0.45, 0.3, 0.15), p * 9.0);
  vec2 fq = (p - hand - vec2(0.0, 0.085)) / 0.05; col += flame(fq, uT, hand.x * 9.0) * 1.6; col += vec3(1.0, 0.6, 0.25) * 0.5 * exp(-length(p - hand - vec2(0.0, 0.09)) * 9.0); }
// embers rising and trailing behind a moving torch
vec3 embers(vec2 p, vec2 src, float t, float drift) {
  vec3 acc = vec3(0.0);
  for (int i = 0; i < 8; i++) { float fi = float(i); float life = fract(t * 0.9 + fi * 0.137); vec2 e = src + vec2(-drift * life * 0.25 + 0.02 * sin(t * 5.0 + fi * 3.0), life * 0.16);
    acc += vec3(1.0, 0.6, 0.2) * (0.00006 / (dot(p - e, p - e) + 0.00003)) * (1.0 - life); }
  return acc; }
// a crown on top of a person's head (person drawn at pos with height h)
void crown(inout vec3 col, vec2 p, vec2 pos, float h, float facing) {
  vec2 q = (p - pos) / h; q.x *= facing; q -= vec2(0.012, 0.93); PX = 1.5 / (uRes.y * h);
  float band = sdBox2(q, vec2(0.105, 0.025)); float pts = 1e5;
  for (int i = 0; i < 3; i++) { float x = -0.07 + float(i) * 0.07; pts = min(pts, sdTrap(q - vec2(x, 0.02), 0.0, 0.07, 0.03, 0.0, 0.0)); }
  ink(col, min(band, pts) - 0.004, vec3(0.98, 0.78, 0.25), q * 3.0);
  col = mix(col, vec3(0.85, 0.15, 0.2), smoothstep(PX, -PX, length(q - vec2(0.0, 0.0)) - 0.014));
  col += vec3(1.0, 0.9, 0.5) * twinkle(q, vec2(0.0, 0.1), 0.06) * (0.5 + 0.5 * sin(uT * 3.0 + pos.x * 9.0)) * 0.6; }
// a camel (optionally laden with packs), feet at pos, facing +x
void drawCamel(inout vec3 col, vec2 p, vec2 pos, float h, float ph, float facing, bool laden) {
  vec2 q = (p - pos) / h; q.x *= facing; PX = 1.5 / (uRes.y * h); if (abs(q.x) > 0.9 || q.y < -0.05 || q.y > 1.3) return;
  col *= 1.0 - 0.22 * smoothstep(1.0, 0.0, length(vec2(q.x / 0.5, q.y / 0.04)));
  vec3 c = vec3(0.78, 0.6, 0.38); float s1 = sin(ph), s2 = sin(ph + PI); float nod = 0.03 * sin(ph * 2.0);
  leg(col, q, vec2(-0.3, 0.52), 0.52, s2, 0.04, c * 0.8); leg(col, q, vec2(0.22, 0.52), 0.52, s1, 0.04, c * 0.8);
  float body = sdE2(q - vec2(-0.04, 0.62), vec2(0.38, 0.13));
  body = smin(body, sdE2(q - vec2(-0.06, 0.8), vec2(0.17, 0.17)), 0.1);                                   // the hump
  float neck = sdSeg2(q, vec2(0.3, 0.64), vec2(0.5, 1.02 + nod), 0.08, 0.05);
  float head = smin(sdE2(q - vec2(0.6, 1.05 + nod), vec2(0.13, 0.065)), sdE2(q - vec2(0.52, 1.1 + nod), vec2(0.06, 0.05)), 0.04);
  ink(col, min(min(body, neck), head), c, q);
  ink(col, sdE2(q - vec2(0.5, 1.15 + nod), vec2(0.018, 0.028)), c * 0.9, q);                                    // ear
  leg(col, q, vec2(-0.24, 0.52), 0.52, s1, 0.045, c); leg(col, q, vec2(0.28, 0.52), 0.52, s2, 0.045, c);
  eye(col, q, vec2(0.62, 1.07 + nod), 0.016); col = mix(col, vec3(0.2, 0.12, 0.08), smoothstep(PX, -PX, length(q - vec2(0.72, 1.03 + nod)) - 0.01));
  if (laden) { ink(col, max(sdE2(q - vec2(-0.06, 0.82), vec2(0.21, 0.2)), 0.82 - q.y - 0.12) , vec3(0.75, 0.2, 0.22) * (0.85 + 0.15 * step(0.5, fract(q.x * 12.0))), q);   // striped saddle blanket over the hump
    ink(col, sdBox2(q - vec2(-0.3, 0.66), vec2(0.06, 0.06)) - 0.015, vec3(0.3, 0.45, 0.62), q); ink(col, sdBox2(q - vec2(0.17, 0.66), vec2(0.06, 0.06)) - 0.015, vec3(0.85, 0.68, 0.32), q);
    for (int i = 0; i < 3; i++) col = mix(col, vec3(0.95, 0.85, 0.3), smoothstep(PX, -PX, length(q - vec2(-0.2 + float(i) * 0.12, 0.72)) - 0.012));   // tassels
  }
}
vec3 desertGround(vec2 p) { return mix(vec3(0.9, 0.72, 0.48), vec3(0.78, 0.58, 0.36), fbm(p * vec2(3.0, 12.0))) * (0.9 + 0.12 * noise(p * 120.0)); }
// speed 1 until t1, slowing to a stop at t2: the distance walked (in seconds of walking)
float travel(float t, float t1, float t2) { if (t < t1) return t; float d = min(t, t2) - t1; return t1 + d - d * d / (2.0 * max(t2 - t1, 1e-3)); }
// a big shady oak (the oaks of Mamre)
void oak(inout vec3 col, vec2 p, vec2 base, float s, vec3 leaf, float sunX) {
  vec2 q = (p - base) / s; PX = 1.5 / (uRes.y * s); if (abs(q.x) > 1.0 || q.y < -0.05 || q.y > 1.5) return;
  col *= 1.0 - 0.3 * smoothstep(1.0, 0.0, length(vec2(q.x / 0.8, q.y / 0.06)));
  float trunk = min(sdSeg2(q, vec2(0.0, 0.0), vec2(0.03, 0.62), 0.09, 0.06), min(sdSeg2(q, vec2(0.02, 0.45), vec2(-0.3, 0.8), 0.045, 0.02), sdSeg2(q, vec2(0.03, 0.5), vec2(0.32, 0.85), 0.045, 0.02)));
  ink(col, trunk, vec3(0.42, 0.28, 0.17), q);
  float can = 1e5; for (int i = 0; i < 7; i++) { float fi = float(i); vec2 c = vec2(-0.5 + fi * 0.165, 0.95 + 0.18 * sin(fi * 2.1) + 0.08 * (1.0 - abs(fi - 3.0) / 3.0)); can = min(can, length(q - c) - (0.24 + 0.06 * hash1(fi * 3.0))); }
  can += 0.03 * (fbm(q * 8.0 + uT * 0.05) - 0.5);
  vec2 nn = normalize(q - vec2(0.0, 0.95)); float lit = SAT(0.5 + 0.6 * dot(nn, normalize(vec2(sunX - base.x, 0.8))));
  vec3 c = leaf * (0.55 + 0.6 * lit) * (0.82 + 0.3 * noise(q * 22.0)); c = mix(c * 0.65, c, smoothstep(-0.12, 0.0, can + 0.03 * noise(q * 30.0)));
  col = mix(col, leaf * 0.28, smoothstep(PX * 2.0, -PX, can)); col = mix(col, c, smoothstep(0.0, -PX * 2.0, can + 0.006)); }

// 24 — Hashem's call: dawn breaks over Charan; a column of light comes down to Avram; birds rise; he turns to go
vec3 sceneCall(vec2 p, float lt) {
  float k = SAT(lt / max(uDur, 1.0)); float callOn = at(k, LS(0), 0.08); float second = at(k, LS(1), 0.05); float go = at(k, 0.84, 0.05);
  CAM = vec2(mix(-0.45, 0.05, smoothstep(0.0, 0.42, k)) + 0.12 * go, 0.0); CAM.y -= 0.1; CAMZ = mix(1.0, 0.92, smoothstep(0.0, 0.45, k));
  vec2 ps = lay(p, 0.08); vec2 sun = vec2(-0.8, -0.13 + 0.2 * k);
  vec3 col = skyGrad(ps, vec3(1.0, 0.62, 0.4), vec3(0.95, 0.55, 0.62), vec3(0.18, 0.2, 0.52));
  col += stars(ps, uT) * (1.0 - smoothstep(0.0, 0.35, k)) * smoothstep(0.1, 0.4, ps.y);
  col += vec3(1.0, 0.72, 0.42) * exp(-length(ps - sun) * 2.2) * 0.9; col = mix(col, vec3(1.0, 0.95, 0.8) * 1.7, smoothstep(0.064, 0.056, length(ps - sun)));
  puffClouds(col, lay(p, 0.12), uT, 0.36, 0.55, 0.008, vec3(1.0, 0.82, 0.74), vec3(0.72, 0.48, 0.62), 3.0);
  puffClouds(col, lay(p, 0.18), uT, 0.2, 0.38, 0.014, vec3(1.0, 0.78, 0.6), vec3(0.7, 0.45, 0.55), 9.0);
  vec3 hz = vec3(0.95, 0.66, 0.62);
  mountains(col, lay(p, 0.2), -0.03, 0.12, 1.6, 101.0, vec3(0.5, 0.36, 0.55), hz, 0.42, sun.x);
  // Charan on its hill: little houses, windows still lit from the night, palms between
  vec2 pm = lay(p, 0.45); float hillY = -0.1 + 0.06 * exp(-pow((pm.x + 0.55) * 2.2, 2.0));
  if (pm.y < hillY) col = mix(vec3(0.78, 0.56, 0.44), hz, 0.3) * (0.95 + 0.05 * noise(pm * 60.0));
  float lightsOn = 1.0 - smoothstep(0.1, 0.55, k);
  for (int i = 0; i < 13; i++) { float fi = float(i); float x = -1.05 + fi * 0.072 + 0.02 * hash1(fi); float hy = -0.1 + 0.06 * exp(-pow((x + 0.55) * 2.2, 2.0));
    house(col, pm, vec2(x, hy - 0.012 - 0.02 * hash1(fi * 9.0)), vec2(0.026 + 0.01 * hash1(fi * 3.0), 0.035 + 0.03 * hash1(fi * 5.0)), vec3(0.88, 0.7, 0.55), hz, 0.18, lightsOn * step(0.35, hash1(fi * 7.0))); }
  palm(col, pm, vec2(-0.92, -0.1), 0.15, 0.07, vec3(0.45, 0.3, 0.2), vec3(0.3, 0.42, 0.2), 0.2, hz, sun.x);
  palm(col, pm, vec2(-0.3, -0.105), 0.13, -0.06, vec3(0.45, 0.3, 0.2), vec3(0.3, 0.42, 0.2), 0.2, hz, sun.x);
  flock(col, lay(p, 0.3), lt, vec2(-1.3, 0.02), vec2(0.11, 0.018), 7.0, 0.011, vec3(0.25, 0.15, 0.2));
  // Avram's camp: the ground, his tent, a laden camel waiting, sheep and goats grazing
  vec2 pg = lay(p, 1.0);
  if (pg.y < -0.17 + 0.015 * sin(pg.x * 4.0)) col = mix(desertGround(pg), grass(pg, vec3(0.5, 0.55, 0.25), vec3(0.64, 0.64, 0.3)), 0.45) * mix(vec3(1.08, 0.9, 0.8), vec3(1.0), k);
  LIGHT_TINT = mix(vec3(1.0, 0.82, 0.75), vec3(1.0, 0.94, 0.88), k); RIM = 0.9; RIM_COL = vec3(1.0, 0.8, 0.55);
  tent(col, pg, vec2(0.5, -0.3), 0.2, vec3(0.42, 0.28, 0.24), 0.5 * lightsOn);
  for (int i = 0; i < 4; i++) { float fi = float(i); drawAnimal(col, pg, vec2(-0.42 + fi * 0.1, -0.31 - 0.02 * float(i % 2)), 0.075, 4, 0.0, i == 2 ? -1.0 : 1.0); }
  drawGoat(col, pg, vec2(0.22, -0.3), 0.1, 0.0, -1.0, vec3(0.45, 0.32, 0.22)); drawGoat(col, pg, vec2(-0.55, -0.33), 0.09, 0.0, 1.0, vec3(0.92, 0.9, 0.85));
  drawCamel(col, pg, vec2(0.8, -0.34), 0.26, go * uT * 4.0, -1.0, true);
  // the light: a column coming down to Avram, rays, sparkles, rings of light spreading at his feet
  vec2 ax = vec2(0.02, -0.42); float bw = 0.035 + 0.05 * SAT(0.6 - pg.y);
  float beam = smoothstep(bw, 0.0, abs(pg.x - ax.x)) * smoothstep(-0.45, 0.3, pg.y);
  col += vec3(1.0, 0.95, 0.8) * beam * 0.75 * callOn * (0.9 + 0.1 * sin(uT * 3.0));
  col += godRays(p, vec2(ax.x - CAM.x, 0.62), vec3(1.0, 0.92, 0.72), 0.55) * callOn;
  col += sparkles(pg, uT, 0.35, 0.014, vec3(1.0, 0.9, 0.6)) * smoothstep(0.25, 0.0, abs(pg.x - ax.x)) * callOn;
  float rr = fract(uT * 0.45); float ring = abs(length((pg - ax) * vec2(1.0, 4.5)) - rr * 0.5); col += vec3(1.0, 0.85, 0.5) * smoothstep(0.012, 0.0, ring) * (1.0 - rr) * callOn * 0.8;
  butterflies(col, pg, uT, vec2(0.12, -0.2), vec2(0.18, 0.08), 3.0 * callOn + 0.5, 0.013);
  // Avram: looks up into the light, arms open in wonder; at the end he takes his staff and walks to the camel
  Person A = avram(); A.facing = 1.0; A.look = 0.0; A.brow = callOn * (1.0 - go);
  A.armF = mix(vec2(0.3, 0.3), vec2(2.3, 0.35), callOn); A.armB = mix(vec2(-0.1, 0.2), vec2(-2.1, -0.3), callOn);
  if (second > 0.5) { A.armF = vec2(1.4 + 0.2 * sin(uT * 2.0), 0.6); A.talk = 0.0; }
  if (go > 0.5) { A.tool = 4; A.armF = vec2(0.6, 0.4); A.armB = vec2(-0.2, 0.3); A.walk = uT * 5.0; A.brow = 0.0; }
  drawPerson(col, pg, vec2(ax.x + (k - 0.84) * 1.1 * go, ax.y + 0.012 * sin(uT * 1.5) * (1.0 - go)), 0.44, A);
  fgGrass(col, lay(p, 1.5), uT, -0.7, vec3(0.42, 0.47, 0.2), 0.7);
  col += lensFlare(p, sun - CAM * 0.08 * (1.0 / CAMZ), vec3(1.0, 0.75, 0.45)) * 0.7;
  return col;
}

// 25 — the journey: a long caravan crosses the desert into green Canaan; the camera travels with it; the mizbe'ach on the hill at sunset
vec3 sceneJourney(vec2 p, float lt) {
  float k = SAT(lt / max(uDur, 1.0)); float T = uDur; float t1 = 0.68 * T, t2 = 0.8 * T;
  float d = travel(lt, t1, t2); float speed = lt < t1 ? 1.0 : SAT((t2 - lt) / (t2 - t1)); float wph = d * 5.5;
  float people = at(k, LS(1), 0.06); float canaan = smoothstep(LS(2) - 0.05, LS(2) + 0.15, k); float alt = at(k, 0.8, 0.04); float eve = smoothstep(0.45, 1.0, k);
  CAM = vec2(d * 0.07 - 0.2, 0.0); CAM.y -= 0.1; CAMZ = 1.0;
  vec2 ps = lay(p, 0.05); vec2 sun = mix(vec2(0.55, 0.38), vec2(0.62, 0.02), eve);
  vec3 col = mix(skyGrad(ps, vec3(0.98, 0.9, 0.72), vec3(0.55, 0.78, 0.98), vec3(0.22, 0.48, 0.9)), skyGrad(ps, vec3(1.0, 0.62, 0.35), vec3(0.98, 0.6, 0.55), vec3(0.32, 0.3, 0.68)), eve);
  col += mix(vec3(1.0, 0.92, 0.7), vec3(1.0, 0.65, 0.3), eve) * exp(-length(ps - sun) * 2.5) * 0.8; col = mix(col, vec3(1.0, 0.95, 0.82) * 1.6, smoothstep(0.055, 0.048, length(ps - sun)));
  puffClouds(col, lay(p, 0.1), uT, 0.34, 0.55, 0.01, mix(vec3(1.0), vec3(1.0, 0.8, 0.65), eve), mix(vec3(0.75, 0.8, 0.92), vec3(0.75, 0.5, 0.6), eve), 21.0);
  puffClouds(col, lay(p, 0.16), uT, 0.18, 0.36, 0.016, mix(vec3(1.0), vec3(1.0, 0.75, 0.6), eve), mix(vec3(0.78, 0.82, 0.92), vec3(0.72, 0.48, 0.55), eve), 27.0);
  vec3 hz = mix(vec3(0.85, 0.86, 0.92), vec3(1.0, 0.75, 0.62), eve);
  mountains(col, lay(p, 0.18), 0.0, 0.13, 1.3, 111.0, mix(vec3(0.62, 0.55, 0.55), vec3(0.45, 0.55, 0.45), canaan), hz, 0.42, sun.x);
  // middle distance: dunes giving way to green hills, palms at an oasis, then trees and a sparkling river in Canaan
  vec2 pm = lay(p, 0.4);
  dunes(col, pm, -0.08, 0.035, 5.0, 3.0, vec3(0.95, 0.75, 0.5), hz, 0.25 * (1.0 - smoothstep(0.2, 0.6, pm.x)), sun.x);
  float gh = -0.09 + 0.05 * sin(pm.x * 4.0 + 1.0) + 0.02 * noise(vec2(pm.x * 9.0, 1.0)); float green = smoothstep(0.15, 0.6, pm.x);
  if (pm.y < gh && green > 0.0) col = mix(col, mix(grass(pm, vec3(0.35, 0.55, 0.22), vec3(0.5, 0.66, 0.28)), hz, 0.25), green);
  treeRow(col, pm, gh - 0.004, 0.07, 0.11, 113.0, vec3(0.32, 0.5, 0.22), hz, 0.2, sun.x, 0.75 * green);
  for (int i = 0; i < 3; i++) palm(col, pm, vec2(-0.55 + float(i) * 0.09, -0.09), 0.14 + 0.03 * hash1(float(i)), 0.06 - 0.05 * float(i), vec3(0.48, 0.32, 0.2), vec3(0.3, 0.48, 0.2), 0.15, hz, sun.x);
  if (pm.x > 0.55 && pm.y < gh - 0.02 && pm.y > gh - 0.05) col = water(pm, uT, vec3(0.2, 0.45, 0.6), vec3(0.45, 0.7, 0.8), hz, gh - 0.02, gh - 0.05);
  flock(col, lay(p, 0.25), lt, vec2(-1.0, 0.25), vec2(0.1, -0.006), 6.0, 0.01, vec3(0.2, 0.15, 0.18));
  // the road: sand at first, then grass and wildflowers
  vec2 pg = lay(p, 1.0); float gy = -0.2 + 0.02 * sin(pg.x * 3.0);
  if (pg.y < gy) col = mix(desertGround(pg), grass(pg, vec3(0.4, 0.58, 0.22), vec3(0.58, 0.7, 0.3)), smoothstep(0.2, 0.9, pg.x)) * mix(vec3(1.0), vec3(1.1, 0.88, 0.72), eve);
  // the mizbe'ach on the hill, where they stop at sunset
  float camStop = travel(t2, t1, t2) * 0.07 - 0.2; vec2 m = vec2(camStop + 0.68, -0.3);
  { vec2 hq = pg - m; float hill = hq.y + 0.06 - 0.09 * exp(-hq.x * hq.x * 18.0); if (hill < 0.0 && pg.y > gy - 0.05) col = mix(col, grass(pg, vec3(0.42, 0.58, 0.24), vec3(0.6, 0.7, 0.3)) * vec3(1.1, 0.9, 0.75), smoothstep(0.0, -0.005, hill)); }
  PX = 1.5 / uRes.y;
  for (int r = 0; r < 3; r++) for (int c = 0; c < 3 - r; c++) { vec2 sc = m + vec2((float(c) - (2.0 - float(r)) * 0.5) * 0.045, 0.012 + float(r) * 0.03); ink(col, sdBox2(pg - sc, vec2(0.02, 0.013)) - 0.003, vec3(0.7, 0.66, 0.6), (pg - sc) * 9.0); }
  col += flame((pg - m - vec2(0.0, 0.1)) / 0.07, uT, 2.0) * alt * 1.5; col += vec3(1.0, 0.7, 0.35) * 0.45 * alt * exp(-length(pg - m - vec2(0.0, 0.12)) * 7.0);
  col += embers(pg, m + vec2(0.0, 0.14), uT, 0.0) * alt; col += godRays(p, m - CAM + vec2(0.0, 0.9), vec3(1.0, 0.85, 0.6), 0.45) * alt;
  // the caravan (screen-steady while the world rolls past): followers behind, then camels, a donkey, Lot, Sarai, and Avram leading
  LIGHT_TINT = mix(vec3(1.0, 0.96, 0.9), vec3(1.0, 0.82, 0.68), eve); RIM = 0.8; RIM_COL = vec3(1.0, 0.82, 0.55);
  vec2 base = vec2(CAM.x, 0.0) + vec2(0.0, 0.0);
  // back row: the people Avram and Sarai taught, walking in from the left with their goats and children
  for (int i = 0; i < 7; i++) { float fi = float(i); float x = -0.95 + fi * 0.15 - 0.9 * (1.0 - people); float y = -0.27 + 0.006 * float(i % 2);
    if (i % 3 == 1) { Person W = womanP(fi + 30.0); W.facing = 1.0; W.walk = wph + fi; W.armF = vec2(0.3, 0.4); drawPerson(col, pg, base + vec2(x, y), 0.3, W); }
    else if (i % 3 == 2) { Person K = kidP(fi); K.facing = 1.0; K.walk = wph * 1.3 + fi; K.armF = vec2(0.6 + 0.4 * sin(uT * 3.0 + fi), 0.3); drawPerson(col, pg, base + vec2(x, y - 0.002 + 0.01 * abs(sin(wph * 1.3 + fi))), 0.21, K); }
    else { Person F = townsperson(fi + 40.0); F.facing = 1.0; F.walk = wph + fi * 0.7; F.tool = 4; F.armF = vec2(0.5, 0.4); drawPerson(col, pg, base + vec2(x, y), 0.31, F); } }
  for (int i = 0; i < 5; i++) { float fi = float(i); drawAnimal(col, pg, base + vec2(-0.98 + fi * 0.075, -0.35 - 0.012 * float(i % 2)), 0.075, 4, wph * 1.4 + fi, 1.0); }
  drawGoat(col, pg, base + vec2(-0.6, -0.355), 0.085, wph * 1.4, 1.0, vec3(0.4, 0.3, 0.22));
  drawCamel(col, pg, base + vec2(-0.48, -0.33), 0.24, wph * 0.8, 1.0, true); drawDonkey(col, pg, base + vec2(-0.22, -0.345), 0.17, wph, 1.0, vec3(0.3, 0.45, 0.65));
  drawCamel(col, pg, base + vec2(-0.02, -0.335), 0.25, wph * 0.8 + 1.0, 1.0, true);
  Person L = lotP(); L.facing = 1.0; L.walk = wph; L.armF = vec2(0.3, 0.3); drawPerson(col, pg, base + vec2(0.2, -0.355), 0.36, L);
  Person Sr = sarai(); Sr.facing = 1.0; Sr.walk = wph + 0.7; Sr.armF = vec2(0.35, 0.4); Sr.look = 0.5; drawPerson(col, pg, base + vec2(0.36, -0.36), 0.37, Sr);
  Person A = avram(); A.facing = 1.0; A.walk = wph; A.tool = 4; A.armF = vec2(0.6, 0.4); A.look = 0.4;
  vec2 apos = base + vec2(0.55, -0.365);
  if (alt > 0.0) { A.walk = 0.0; A.tool = 0; A.armF = mix(A.armF, vec2(2.5, 0.2), alt); A.armB = mix(A.armB, vec2(-2.4, -0.2), alt); A.look = 0.0; A.talk = 0.4 * alt; apos.x += 0.0; }
  drawPerson(col, pg, apos, 0.4, A);
  col += sparkles(pg, uT, 0.25, 0.012, vec3(1.0, 0.85, 0.5)) * alt * smoothstep(0.35, 0.0, length(pg - apos - vec2(0.0, 0.3)));
  fgGrass(col, lay(p, 1.6), uT, -0.72, mix(vec3(0.6, 0.5, 0.3), vec3(0.38, 0.5, 0.2), smoothstep(-0.2, 1.0, lay(p, 1.6).x)), 0.6 * canaan);
  col += lensFlare(p, sun - CAM * 0.05, vec3(1.0, 0.8, 0.5)) * 0.5 * eve;
  return col;
}

// 26 — Mitzrayim: from the famine's cracked earth down to the splendour of Egypt; Sarai shielded by light in Pharaoh's palace;
//      a storm of plagues on the palace only; then sunshine and a procession of gifts
vec3 sceneMitzrayim(vec2 p, float lt) {
  float k = SAT(lt / max(uDur, 1.0)); float l1 = LS(1), l2 = LS(2);
  float plague = smoothstep(l1 + 0.08, l1 + 0.14, k) * (1.0 - smoothstep(l2 - 0.03, l2 + 0.03, k)); float leave = at(k, l2, 0.06);
  CAM = vec2(mix(-1.05, 0.0, smoothstep(0.02, l1 + 0.02, k)) - 0.15 * leave, 0.0); CAM.y -= 0.1; CAMZ = 1.0 - 0.06 * plague;
  vec2 ps = lay(p, 0.06); vec2 sun = vec2(-0.4, 0.33);
  vec3 col = skyGrad(ps, vec3(1.0, 0.88, 0.6), vec3(0.6, 0.8, 0.98), vec3(0.15, 0.4, 0.88));
  float stormMask = smoothstep(0.75, 0.15, length((ps - vec2(0.45, 0.3)) * vec2(0.9, 1.4))) * plague;
  col = mix(col, skyGrad(ps, vec3(0.4, 0.25, 0.3), vec3(0.22, 0.14, 0.22), vec3(0.06, 0.04, 0.1)), stormMask);
  col += vec3(1.0, 0.9, 0.6) * exp(-length(ps - sun) * 2.5) * 0.7 * (1.0 - stormMask); col = mix(col, vec3(1.0, 0.97, 0.85) * 1.6, smoothstep(0.05, 0.043, length(ps - sun)) * (1.0 - stormMask));
  puffClouds(col, lay(p, 0.1), uT, 0.36, 0.5, 0.01, vec3(1.0), vec3(0.78, 0.82, 0.92), 31.0);
  col = clouds2D(ps, col, vec3(0.42, 0.32, 0.38), vec3(0.12, 0.08, 0.12), 0.75 * stormMask, sun, uT * 4.0);
  float flash = stormMask * step(0.9, fract(uT * 0.8)) * step(0.4, fract(uT * 3.7)); col += vec3(0.85, 0.85, 1.0) * flash * 0.6;
  vec3 hz = vec3(0.98, 0.9, 0.75);
  // famine land on the left: cracked earth, a dry tree, heat shimmer
  vec2 pf = lay(p, 1.0);
  // Egypt: golden pyramids and obelisks, the Nile with sailboats and reeds, palm groves
  vec2 pp = lay(p, 0.25);
  for (int i = 0; i < 3; i++) { vec2 c = vec2(-0.15 + float(i) * 0.24, -0.08); float s = 0.17 + 0.07 * float(i == 1); vec2 q = pp - c;
    if (q.y > 0.0 && abs(q.x) < s - q.y) { vec3 face = vec3(1.0, 0.82, 0.5) * (q.x < 0.0 ? 1.08 : 0.72) * (0.95 + 0.05 * step(0.5, fract(q.y * 60.0))); col = mix(face, col, 0.12 + 0.35 * stormMask);
      if (q.y > s - 0.03) col = mix(col, vec3(1.0, 0.9, 0.5) * 1.3, 0.8); } }                                             // gold caps glinting
  for (int i = 0; i < 2; i++) { vec2 c = vec2(0.72 + float(i) * 0.12, -0.08); vec2 q = pp - c; float ob = max(abs(q.x) - 0.012 * (1.0 - q.y * 2.5), max(-q.y, q.y - 0.2)); if (ob < 0.0) col = vec3(0.92, 0.78, 0.55) * (q.x < 0.0 ? 1.0 : 0.75);
    if (q.y > 0.2 && abs(q.x) < 0.012 - (q.y - 0.2)) col = vec3(1.0, 0.85, 0.4); }
  if (pp.y < -0.08) col = mix(vec3(0.85, 0.75, 0.5), hz, 0.2);
  vec2 pn = lay(p, 0.5);
  if (pn.y < -0.1 && pn.y > -0.2) col = water(pn, uT, vec3(0.12, 0.38, 0.55), vec3(0.3, 0.62, 0.72), vec3(0.6, 0.8, 0.95), -0.1, -0.2) * (1.0 - 0.5 * stormMask);
  sailboat(col, pn, vec2(-0.3 + fract(uT * 0.012) * 1.6, -0.15), 0.12, vec3(0.98, 0.95, 0.88)); sailboat(col, pn, vec2(0.9 - fract(uT * 0.009 + 0.4) * 1.8, -0.18), 0.09, vec3(0.95, 0.85, 0.7));
  for (int i = 0; i < 8; i++) palm(col, pn, vec2(-0.35 + float(i) * 0.19 + 0.05 * hash1(float(i)), -0.105), 0.15 + 0.04 * hash1(float(i) * 2.0), 0.08 * sin(float(i) * 2.0), vec3(0.45, 0.3, 0.18), vec3(0.25, 0.5, 0.2), 0.05, hz, sun.x);
  flock(col, lay(p, 0.3), lt, vec2(-0.9, 0.2), vec2(0.07, 0.01), 5.0, 0.012, vec3(0.95, 0.95, 0.92));                // white ibises over the river
  // ground: the famine on the left, fertile Egypt to the right
  float gy = -0.2 + 0.012 * sin(pf.x * 5.0);
  if (pf.y < gy) { float egypt = smoothstep(-1.05, -0.8, pf.x);
    vec3 dry = vec3(0.82, 0.62, 0.4) * (0.9 + 0.1 * noise(pf * 30.0)); vec2 cr = pf * vec2(14.0, 30.0); vec2 cid = floor(cr); vec2 cf = fract(cr) - 0.5 - 0.3 * (hash2(cid) - 0.5);
    vec2 cw = pf * 11.0 + 0.6 * vec2(fbm(pf * 4.0), fbm(pf * 4.0 + 3.0)); vec2 cv = abs(fract(cw) - 0.5); dry *= 1.0 - 0.3 * smoothstep(0.03, 0.0, min(cv.x, cv.y) - 0.0) * smoothstep(-0.3, -0.45, pf.y + 0.0) - 0.1 * smoothstep(0.03, 0.0, min(cv.x, cv.y));                                                                        // cracks
    vec3 lush = mix(desertGround(pf), grass(pf, vec3(0.4, 0.6, 0.22), vec3(0.6, 0.7, 0.3)), 0.35);
    col = mix(dry, lush, egypt) * (1.0 - 0.4 * stormMask); }
  PX = 1.5 / uRes.y;
  { vec2 tb = vec2(-1.25, -0.2); ink(col, min(min(sdSeg2(pf, tb, tb + vec2(0.02, 0.3), 0.018, 0.008), sdSeg2(pf, tb + vec2(0.015, 0.2), tb + vec2(0.12, 0.3), 0.01, 0.004)), sdSeg2(pf, tb + vec2(0.01, 0.15), tb + vec2(-0.1, 0.24), 0.01, 0.004)), vec3(0.4, 0.28, 0.2), pf * 9.0); }
  if (pf.x < -0.8) col += vec3(1.0, 0.6, 0.3) * 0.04 * sin(pf.y * 80.0 + uT * 6.0) * smoothstep(-0.2, -0.4, pf.y);                          // heat shimmer
  // Pharaoh's palace: painted columns, lintel, banners
  vec2 pc = vec2(0.42, -0.22); LIGHT_TINT = mix(vec3(1.0, 0.96, 0.88), vec3(0.6, 0.5, 0.62), stormMask); RIM = 0.6;
  ink(col, sdBox2(pf - pc - vec2(0.0, 0.33), vec2(0.4, 0.04)), vec3(0.95, 0.88, 0.72), pf * 3.0);
  ink(col, sdBox2(pf - pc - vec2(0.0, 0.37), vec2(0.36, 0.018)), vec3(0.2, 0.42, 0.75), pf * 3.0);
  for (int i = 0; i < 7; i++) { vec2 cc = pc + vec2(-0.33 + float(i) * 0.11, 0.15); float band = fract((pf.y - cc.y) * 9.0);
    vec3 cCol = band < 0.2 ? vec3(0.2, 0.45, 0.75) : (band < 0.3 ? vec3(0.95, 0.75, 0.25) : vec3(0.98, 0.92, 0.78));
    ink(col, sdBox2(pf - cc, vec2(0.022, 0.155)), cCol, (pf - cc) * 9.0); ink(col, sdTrap(pf - cc - vec2(0.0, 0.155), 0.0, 0.03, 0.025, 0.045, 0.0), vec3(0.35, 0.6, 0.35), pf * 9.0); }
  for (int i = 0; i < 2; i++) { vec2 bc = pc + vec2(-0.25 + float(i) * 0.5, 0.25); vec2 bq = pf - bc; float wave_ = 0.01 * sin(bq.y * 30.0 + uT * 4.0);
    if (abs(bq.x + wave_) < 0.03 && bq.y < 0.0 && bq.y > -0.14 + 0.02 * abs(bq.x) * 20.0 * 0.0) col = mix(col, (i == 0 ? vec3(0.85, 0.2, 0.25) : vec3(0.95, 0.75, 0.2)) * LIGHT_TINT, 0.95); }
  ink(col, sdBox2(pf - pc - vec2(0.0, -0.01), vec2(0.44, 0.016)), vec3(0.85, 0.78, 0.62), pf * 3.0);
  if (stormMask > 0.0 && flash > 0.0) { vec2 a = vec2(0.35 + 0.1 * hash1(floor(uT * 0.8)), 0.5); vec2 b = pc + vec2(0.05, 0.4); float bolt = 1e5;   // lightning on the palace roof
    for (int i = 0; i < 4; i++) { vec2 s0 = mix(a, b, float(i) / 4.0) + vec2(0.04 * (hash1(float(i) + floor(uT * 0.8)) - 0.5), 0.0); vec2 s1 = mix(a, b, float(i + 1) / 4.0) + vec2(0.04 * (hash1(float(i + 1) + floor(uT * 0.8)) - 0.5), 0.0); if (i == 3) s1 = b;
      bolt = min(bolt, sdSeg2(pf, s0, s1, 0.004, 0.003)); }
    col += vec3(0.85, 0.9, 1.0) * (smoothstep(0.004, 0.0, bolt) * 2.0 + 0.002 / (bolt * bolt + 0.002) * 0.1); }
  // the family arrives (first line), Sarai shielded in light at the palace (second line), the procession of gifts (third)
  float arrive = smoothstep(0.0, l1, k);
  if (k < l1 + 0.02) { float x = mix(-1.35, -0.55, arrive);
    drawCamel(col, pf, vec2(x - 0.32, -0.34), 0.24, uT * 4.0, 1.0, true);
    Person Sr = sarai(); Sr.facing = 1.0; Sr.walk = uT * 5.0 + 0.8; Sr.armF = vec2(0.3, 0.4); drawPerson(col, pf, vec2(x - 0.12, -0.365), 0.37, Sr);
    Person A = avram(); A.facing = 1.0; A.walk = uT * 5.0; A.tool = 4; A.armF = vec2(0.6, 0.4); drawPerson(col, pf, vec2(x + 0.05, -0.37), 0.4, A); }
  if (k > l1 && k < l2 + 0.02) {
    for (int i = 0; i < 2; i++) { Person G = egyptian(float(i) + 60.0); G.facing = i == 0 ? 1.0 : -1.0; G.armF = vec2(0.5, 0.6); drawPerson(col, pf, pc + vec2(-0.3 + float(i) * 0.6, -0.15), 0.34, G); }
    vec2 spos = pc + vec2(-0.12, -0.16);
    float dome = length((pf - spos - vec2(0.0, 0.18)) * vec2(1.0, 0.85)); float sh = at(k, l1 + 0.06, 0.05);
    col += vec3(1.0, 0.92, 0.7) * sh * (smoothstep(0.24, 0.2, dome) * 0.22 + smoothstep(0.01, 0.0, abs(dome - 0.22)) * 0.7);
    col += sparkles(pf, uT, 0.3, 0.012, vec3(1.0, 0.9, 0.6)) * sh * smoothstep(0.26, 0.15, dome);
    Person Sr = sarai(); Sr.facing = 1.0; Sr.look = 0.5; Sr.armF = vec2(0.4, 0.5); drawPerson(col, pf, spos, 0.36, Sr);
    Person F = townsperson(77.0); F.robe = vec3(0.97, 0.94, 0.86); F.trim = vec3(0.2, 0.45, 0.75); F.wrap = vec3(0.95, 0.78, 0.3); F.beard = vec3(0.1, 0.07, 0.05); F.beardLen = 0.15;
    F.facing = -1.0; F.brow = plague; F.armF = vec2(1.2 + 1.2 * plague + 0.4 * sin(uT * 9.0) * plague, 0.4); F.armB = vec2(1.6 * plague, 0.5 + 0.3 * sin(uT * 7.0)); F.look = -0.5; F.talk = plague * 0.8;
    vec2 fpos = pc + vec2(0.16, -0.165 + 0.02 * abs(sin(uT * 8.0)) * plague); drawPerson(col, pf, fpos, 0.4, F);
    vec2 cq = (pf - fpos) / 0.4; cq.x *= -1.0; ink(col, sdTrap(cq - vec2(0.01, 0.92), 0.0, 0.18, 0.09, 0.05, 0.0) - 0.008, vec3(0.95, 0.9, 0.82), cq * 3.0);   // Pharaoh's tall crown
    col += rainStreaks(p, stormMask * 0.35); }
  if (leave > 0.0) { float x = 0.05 - (k - l2) * 1.6;
    for (int i = 0; i < 4; i++) drawAnimal(col, pf, vec2(x + 0.55 + float(i) * 0.08, -0.37 - 0.01 * float(i % 2)), 0.075, 4, uT * 7.0 + float(i), -1.0);
    drawDonkey(col, pf, vec2(x + 0.42, -0.36), 0.17, uT * 5.0, -1.0, vec3(0.75, 0.25, 0.3));
    vec2 cpos = vec2(x + 0.18, -0.34); drawCamel(col, pf, cpos, 0.25, uT * 4.0, -1.0, true);
    col += sparkles(pf, uT, 0.5, 0.012, vec3(1.0, 0.85, 0.4)) * smoothstep(0.12, 0.0, length((pf - cpos - vec2(0.0, 0.18)) * vec2(0.8, 1.2)));   // gold glinting in the packs
    Person A = avram(); A.facing = -1.0; A.walk = uT * 5.0; A.tool = 4; A.armF = vec2(0.6, 0.4); drawPerson(col, pf, vec2(x - 0.04, -0.37), 0.4, A);
    Person Sr = sarai(); Sr.facing = -1.0; Sr.walk = uT * 5.0 + 0.8; Sr.armF = vec2(0.3, 0.4); drawPerson(col, pf, vec2(x - 0.2, -0.365), 0.37, Sr);
    Person F = townsperson(77.0); F.robe = vec3(0.97, 0.94, 0.86); F.trim = vec3(0.2, 0.45, 0.75); F.wrap = vec3(0.95, 0.78, 0.3); F.beard = vec3(0.1, 0.07, 0.05); F.beardLen = 0.15;
    F.facing = -1.0; F.armF = vec2(2.0 + 0.5 * sin(uT * 4.0), 0.3); F.look = -0.5; vec2 fpos = pc + vec2(0.2, -0.165); drawPerson(col, pf, fpos, 0.4, F);
    vec2 cq = (pf - fpos) / 0.4; cq.x *= -1.0; ink(col, sdTrap(cq - vec2(0.01, 0.92), 0.0, 0.18, 0.09, 0.05, 0.0) - 0.008, vec3(0.95, 0.9, 0.82), cq * 3.0); }
  fgGrass(col, lay(p, 1.5), uT, -0.7, mix(vec3(0.55, 0.45, 0.28), vec3(0.35, 0.5, 0.2), smoothstep(-1.2, -0.6, lay(p, 1.5).x)), 0.4);
  return col;
}

// 27 — Avram and Lot part ways: a hillside crowded with flocks; Lot's shepherds sneak into someone's field; Avram makes peace;
//      the camera swings over the lush Jordan valley, Sedom in the haze under a gloomy cloud, and Lot goes down to it
vec3 sceneParting(vec2 p, float lt) {
  float k = SAT(lt / max(uDur, 1.0)); float l1 = LS(1), l2 = LS(2), l3 = LS(3);
  float f1 = smoothstep(l1 - 0.02, l1 + 0.06, k), f2 = smoothstep(l2 - 0.02, l2 + 0.06, k), f3 = smoothstep(l3 - 0.02, l3 + 0.1, k);
  CAM = vec2(mix(mix(mix(0.0, -0.8, f1), 0.0, f2), 0.75, f3), 0.0); CAM.y -= 0.1; CAMZ = mix(mix(1.0, 0.82, f1), 1.0, f2);
  vec2 ps = lay(p, 0.05); vec2 sun = vec2(-0.3, 0.38);
  vec3 col = skyGrad(ps, vec3(0.98, 0.92, 0.8), vec3(0.55, 0.78, 0.98), vec3(0.2, 0.45, 0.9));
  col += vec3(1.0, 0.92, 0.7) * exp(-length(ps - sun) * 2.5) * 0.6;
  puffClouds(col, lay(p, 0.1), uT, 0.35, 0.55, 0.012, vec3(1.0), vec3(0.76, 0.8, 0.92), 41.0); puffClouds(col, lay(p, 0.16), uT, 0.2, 0.38, 0.018, vec3(1.0), vec3(0.78, 0.82, 0.92), 47.0);
  vec3 hz = vec3(0.82, 0.88, 0.97);
  mountains(col, lay(p, 0.2), 0.0, 0.11, 1.4, 121.0, vec3(0.58, 0.55, 0.6), hz, 0.42, sun.x);
  // the Jordan valley far below on the right: lush green, a winding sparkling river, gardens; Sedom in the haze under a dark cloud
  vec2 pv = lay(p, 0.4);
  float vEdge = -0.05 - 0.06 * smoothstep(0.6, 0.2, pv.x) + 0.012 * sin(pv.x * 17.0); if (pv.x > 0.1 && pv.y < vEdge) { col = mix(col, mix(grass(pv * 1.5, vec3(0.25, 0.6, 0.22), vec3(0.45, 0.75, 0.25)), hz, 0.12 + 0.25 * smoothstep(-0.25, -0.05, pv.y)), smoothstep(0.1, 0.4, pv.x));
    float rx = 0.75 + 0.12 * sin(pv.y * 14.0) + 0.05 * sin(pv.y * 31.0); float rw = 0.008 + 0.06 * SAT(-pv.y - 0.05);
    if (abs(pv.x - rx) < rw) col = water(pv, uT, vec3(0.25, 0.55, 0.75), vec3(0.5, 0.8, 0.9), hz, -0.05, -0.4); }
  treeRow(col, pv, -0.06, 0.04, 0.05, 123.0, vec3(0.25, 0.55, 0.22), hz, 0.25, sun.x, 0.8 * step(0.35, pv.x));
  vec2 sc = vec2(1.12, -0.06);
  for (int i = 0; i < 9; i++) { float x = sc.x - 0.12 + float(i) * 0.03; float hh = sc.y + 0.02 + 0.035 * hash1(float(i) * 9.0); if (abs(pv.x - x) < 0.014 && pv.y < hh && pv.y > sc.y - 0.04) col = mix(vec3(0.5, 0.36, 0.42), hz, 0.25); }
  { vec2 cq = pv - sc - vec2(0.0, 0.17); float cl = length(cq * vec2(1.0, 2.6)) - 0.14 - 0.03 * fbm(cq * 10.0 + uT * 0.2); col = mix(col, vec3(0.32, 0.24, 0.38), smoothstep(0.03, -0.03, cl) * 0.8);
    col = mix(col, col * vec3(0.8, 0.7, 0.9), smoothstep(0.3, 0.0, length((pv - sc) * vec2(1.0, 1.5))) * 0.5); }
  flock(col, lay(p, 0.3), lt, vec2(-1.2, 0.18), vec2(0.09, 0.01), 7.0, 0.011, vec3(0.2, 0.15, 0.2));
  // the hillside: dry pasture on the left with a fenced green field, the meeting hilltop in the middle, a slope down to the valley
  vec2 pg = lay(p, 1.0); float hill = -0.2 + 0.08 * exp(-pow(pg.x * 1.8, 2.0)) - 0.12 * smoothstep(0.45, 1.1, pg.x);
  if (pg.y < hill) col = mix(desertGround(pg), grass(pg, vec3(0.42, 0.55, 0.22), vec3(0.58, 0.66, 0.28)), 0.5);
  vec2 fc = vec2(-0.85, -0.3); bool inField = abs(pg.x - fc.x) < 0.26 && pg.y < hill && pg.y > fc.y - 0.12;
  if (inField) { col = grass(pg, vec3(0.3, 0.62, 0.2), vec3(0.45, 0.75, 0.25)); col *= 0.9 + 0.12 * step(0.5, fract(pg.x * 30.0)); }                 // someone else's field
  PX = 1.5 / uRes.y;
  for (int i = 0; i < 9; i++) { float x = fc.x - 0.26 + float(i) * 0.065; ink(col, sdBox2(pg - vec2(x, fc.y + 0.005), vec2(0.006, 0.04)), vec3(0.55, 0.38, 0.2), pg * 9.0); }
  ink(col, min(sdBox2(pg - vec2(fc.x, fc.y + 0.03), vec2(0.26, 0.004)), sdBox2(pg - vec2(fc.x, fc.y + 0.0), vec2(0.26, 0.004))), vec3(0.6, 0.42, 0.22), pg * 9.0);
  LIGHT_TINT = vec3(1.0, 0.96, 0.9); RIM = 0.5; RIM_COL = vec3(1.0, 0.9, 0.7);
  // flocks everywhere (too many for the land!), bobbing as they graze
  for (int i = 0; i < 9; i++) { float fi = float(i); vec2 sp = vec2(-0.42 + fi * 0.09 + 0.02 * hash1(fi), -0.42 + 0.03 * hash1(fi * 3.0) + 0.006 * abs(sin(uT * 3.0 + fi)));
    if (i % 4 == 3) drawGoat(col, pg, sp, 0.085, 0.0, i % 2 == 0 ? 1.0 : -1.0, vec3(0.42, 0.3, 0.22)); else drawAnimal(col, pg, sp, 0.075, 4, 0.0, i % 3 == 0 ? -1.0 : 1.0); }
  // sheep sneaking into the field, munching
  for (int i = 0; i < 3; i++) { float fi = float(i); drawAnimal(col, pg, fc + vec2(-0.12 + fi * 0.1, -0.06 + 0.004 * sin(uT * 6.0 + fi)), 0.07, 4, 0.0, 1.0); }
  Person S1 = townsperson(11.0); S1.facing = 1.0; S1.tool = 4; S1.armF = vec2(0.5, 0.4); S1.look = 0.5; drawPerson(col, pg, fc + vec2(-0.38, -0.1), 0.3, S1);                 // Lot's shepherd, shrugging
  Person S2 = townsperson(23.0); S2.facing = -1.0; S2.armF = vec2(1.8 + 0.5 * sin(uT * 7.0), 0.3); S2.armB = vec2(-1.2, 0.5); S2.talk = f1 * (1.0 - f2) * 0.9; S2.brow = 0.8; drawPerson(col, pg, fc + vec2(0.36, -0.1), 0.31, S2);   // Avram's shepherd: "that's stealing!"
  // Avram and Lot on the hilltop
  Person A = avram(); A.facing = 1.0; A.tool = 4; A.armF = vec2(f2 > 0.5 && f3 < 0.5 ? 1.5 + 0.3 * sin(uT * 2.0) : 0.6, 0.3); A.talk = (f2 > 0.5 && f3 < 0.5) ? 0.7 : 0.0; A.look = 0.5;
  drawPerson(col, pg, vec2(-0.12, -0.25), 0.42, A);
  float goes = smoothstep(l3 + 0.1, 0.95, k); Person L = lotP(); L.facing = 1.0; L.armF = vec2(f3 > 0.5 ? 1.7 : 0.4, 0.2); L.look = 0.9; L.walk = goes > 0.0 ? uT * 5.0 : 0.0;
  vec2 lpos = vec2(0.12 + goes * 0.65, -0.255 - goes * 0.08); drawPerson(col, pg, lpos, 0.4, L);
  for (int i = 0; i < 4; i++) drawAnimal(col, pg, lpos + vec2(-0.12 - float(i) * 0.08, -0.03 - 0.01 * float(i % 2)), 0.07, 4, goes > 0.0 ? uT * 7.0 + float(i) : 0.0, 1.0);
  col += sparkles(pv, uT, 0.2, 0.01, vec3(1.0, 1.0, 0.85)) * f3 * step(0.35, pv.x) * step(pv.y, -0.06) * 0.6;
  fgGrass(col, lay(p, 1.5), uT, -0.7, vec3(0.42, 0.5, 0.22), 0.6);
  return col;
}

// 28 — the night rescue: the kings' camp with banners and fires; Lot led away; Avram and Eliezer run through the night with torches;
//      the kings' men flee; dawn bursts and the captives cheer
vec3 sceneWar(vec2 p, float lt) {
  float k = SAT(lt / max(uDur, 1.0)); float l1 = LS(1), l2 = LS(2); float night = smoothstep(0.05, l1 + 0.05, k); float dawn = smoothstep(0.82, 0.98, k);
  float scatter = at(k, l2 + 0.06, 0.08); float freed = at(k, l2 + 0.14, 0.06);
  CAM = vec2(mix(0.35, -0.35, smoothstep(l1 - 0.05, l1 + 0.05, k) * (1.0 - smoothstep(l2 - 0.05, l2 + 0.15, k))) + 0.1 * dawn, 0.0); CAM.y -= 0.1; CAMZ = 1.0;
  vec2 ps = lay(p, 0.05);
  vec3 dusk = skyGrad(ps, vec3(1.0, 0.55, 0.35), vec3(0.6, 0.35, 0.55), vec3(0.18, 0.15, 0.4)); vec3 nite = skyGrad(ps, vec3(0.14, 0.14, 0.3), vec3(0.06, 0.07, 0.2), vec3(0.02, 0.02, 0.08));
  vec3 morn = skyGrad(ps, vec3(1.0, 0.7, 0.42), vec3(0.95, 0.62, 0.6), vec3(0.3, 0.38, 0.75));
  vec3 col = mix(mix(dusk, nite, night), morn, dawn);
  col += (stars(ps, uT) * 1.4 + shootingStar(ps, uT, 4.0, 3.0)) * night * (1.0 - dawn);
  vec2 moon = vec2(-0.55, 0.32); float md = length(ps - moon);
  col += vec3(0.75, 0.8, 1.0) * exp(-md * 5.0) * 0.35 * night * (1.0 - dawn); col = mix(col, vec3(0.97, 0.96, 0.88) * (0.9 + 0.1 * noise(ps * 60.0)) * 1.3, smoothstep(0.052, 0.046, md) * night * (1.0 - dawn));
  col = mix(col, col * 0.8, smoothstep(0.02, 0.0, length(ps - moon - vec2(0.015, 0.01)) - 0.01) * night);
  vec2 sunR = vec2(0.6, -0.1 + 0.15 * dawn); col += vec3(1.0, 0.75, 0.4) * exp(-length(ps - sunR) * 2.5) * dawn; col += godRays(p, sunR - CAM * 0.05, vec3(1.0, 0.8, 0.5), 0.5) * dawn;
  vec3 hz = mix(mix(vec3(0.75, 0.45, 0.5), vec3(0.12, 0.12, 0.22), night), vec3(0.95, 0.65, 0.55), dawn);
  mountains(col, lay(p, 0.2), -0.04, 0.1, 1.6, 131.0, mix(mix(vec3(0.4, 0.28, 0.4), vec3(0.08, 0.08, 0.15), night), vec3(0.5, 0.36, 0.42), dawn), hz, 0.3, 0.6);
  vec2 pg = lay(p, 1.0); float lightAmt = mix(mix(0.8, 0.25, night), 0.85, dawn);
  if (pg.y < -0.17) col = desertGround(pg) * lightAmt * mix(vec3(1.0, 0.85, 0.75), vec3(0.6, 0.65, 1.0), night * (1.0 - dawn));
  // the kings' camp on the right: tents with banners and campfires; it scatters when the torches come
  for (int i = 0; i < 5; i++) { vec2 tc = vec2(0.42 + float(i) * 0.16, -0.18); vec2 tq = (pg - tc) / 0.2; float t = max(abs(tq.x) - 0.3 + tq.y * 0.9, max(-tq.y, tq.y - 0.28));
    vec3 tcol = (0.5 + 0.4 * cos(6.28 * (float(i) * 0.23 + vec3(0.0, 0.33, 0.67)))) * lightAmt;
    if (t < 0.0) col = tcol * (0.8 + 0.3 * step(0.0, tq.x));
    vec2 bq = pg - tc - vec2(0.0, 0.056); if (bq.x > 0.0 && bq.x < 0.04 && abs(bq.y - 0.01 * sin(bq.x * 60.0 - uT * 6.0)) < 0.012) col = mix(vec3(0.95, 0.3, 0.25), vec3(0.95, 0.85, 0.3), float(i % 2)) * lightAmt * 1.2;
    if (abs(pg.x - tc.x) < 0.002 && pg.y > tc.y && pg.y < tc.y + 0.075) col = vec3(0.3, 0.2, 0.12);
    vec2 f = tc + vec2(0.06, -0.012); col += vec3(1.0, 0.55, 0.2) * (1.0 - scatter * 0.85) * (0.003 / (dot(pg - f, pg - f) + 0.002)) * 0.15 * (1.0 - dawn); }
  LIGHT_TINT = mix(mix(vec3(1.0, 0.82, 0.72), vec3(0.6, 0.58, 0.82), night), vec3(1.0, 0.88, 0.75), dawn); RIM = 1.0; RIM_COL = vec3(1.0, 0.6, 0.3);
  // first line: the four kings (crowns) march Lot and the captives away to their camp
  if (k < l1 + 0.05) { float m = smoothstep(0.0, l1, k);
    for (int i = 0; i < 4; i++) { Person Kg = townsperson(float(i) * 5.0 + 3.0); Kg.facing = 1.0; Kg.walk = uT * 5.0; Kg.armF = vec2(0.4, 0.5); Kg.look = 0.3; vec2 kp = vec2(0.1 + float(i) * 0.12 + m * 0.3, -0.24 - 0.006 * float(i % 2));
      drawPerson(col, pg, kp, 0.3, Kg); crown(col, pg, kp, 0.3, 1.0); }
    Person L = lotP(); L.facing = 1.0; L.walk = uT * 5.0; L.armF = vec2(0.1, 0.1); L.armB = vec2(-0.1, 0.1); L.look = -0.6; L.brow = 0.6; drawPerson(col, pg, vec2(-0.12 + m * 0.3, -0.35), 0.4, L);
    Person W = womanP(5.0); W.facing = 1.0; W.walk = uT * 5.0 + 1.0; drawPerson(col, pg, vec2(-0.3 + m * 0.3, -0.355), 0.36, W); }
  // second line onward: Avram and Eliezer run with torches; then the kings' men flee and the captives are freed
  if (k > l1 - 0.02) { float run = smoothstep(l1, l2 + 0.12, k);
    float ws = (1.0 - freed) * 9.0; Person A = avram(); A.facing = 1.0; A.walk = uT * ws; A.armF = vec2(2.2, 0.3); A.armB = vec2(-0.8, 0.4); A.look = 0.6; A.brow = 0.3;
    if (freed > 0.5) { A.armF = vec2(2.5, 0.2); A.armB = vec2(-2.3, -0.2); A.walk = 0.0; }
    vec2 apos = vec2(-0.85 + run * 0.95, -0.37 + 0.012 * abs(sin(uT * ws))); drawPerson(col, pg, apos, 0.42, A);
    if (freed < 0.5) { vec2 h = handPos(apos, 0.42, A); torch(col, pg, h); col += embers(pg, h + vec2(0.0, 0.1), uT, 1.0) * (1.0 - dawn); }
    Person E = eliezer(); E.facing = 1.0; E.walk = uT * ws + 1.0; E.armF = vec2(2.2, 0.3); E.armB = vec2(-0.8, 0.4); E.look = 0.6;
    vec2 epos = apos - vec2(0.22, 0.008); drawPerson(col, pg, epos, 0.4, E); if (freed < 0.5) { vec2 h = handPos(epos, 0.4, E); torch(col, pg, h); col += embers(pg, h + vec2(0.0, 0.1), uT + 0.5, 1.0) * (1.0 - dawn); }
    col += vec3(1.0, 0.55, 0.25) * 0.12 * exp(-length(pg - apos - vec2(0.05, 0.4)) * 4.0) * (1.0 - dawn) * night; }
  if (scatter > 0.0) { for (int i = 0; i < 4; i++) { float x = 0.5 + float(i) * 0.12 + scatter * (k - l2 - 0.06) * 3.0; Person S = townsperson(float(i) + 90.0); S.facing = 1.0; S.walk = uT * 11.0; S.armF = vec2(2.4, 0.4); S.armB = vec2(-2.2, 0.5); S.brow = 1.0; S.talk = 0.8;
      vec2 sp = vec2(x, -0.25 + 0.01 * abs(sin(uT * 11.0 + float(i)))); drawPerson(col, pg, sp, 0.24, S); if (i < 2) crown(col, pg, sp, 0.24, 1.0);
      col = mix(col, vec3(0.75, 0.62, 0.48) * lightAmt, 0.5 * smoothstep(0.05, 0.0, length((pg - sp + vec2(0.08, -0.02)) * vec2(1.0, 2.0)) - 0.02 * fbm(pg * 30.0 + uT))); } }   // dust puffs as they run
  if (freed > 0.0) { vec2 lp = vec2(0.42, -0.355); Person L = lotP(); L.facing = -1.0; L.armF = vec2(2.4, 0.3); L.armB = vec2(-2.2, 0.3); L.talk = 0.6; drawPerson(col, pg, lp + vec2(0.0, 0.02 * abs(sin(uT * 6.0))), 0.4, L);
    Person W = womanP(5.0); W.facing = -1.0; W.armF = vec2(2.2, 0.3); W.armB = vec2(-2.0, 0.3); drawPerson(col, pg, lp + vec2(0.2, 0.025 * abs(sin(uT * 6.0 + 1.0))), 0.36, W);
    Person Kd = kidP(4.0); Kd.facing = -1.0; Kd.armF = vec2(2.5, 0.3); Kd.armB = vec2(-2.4, 0.3); drawPerson(col, pg, lp + vec2(0.34, 0.035 * abs(sin(uT * 7.0 + 2.0))), 0.22, Kd);
    col += sparkles(pg, uT, 0.3, 0.012, vec3(1.0, 0.85, 0.5)) * freed * smoothstep(0.4, 0.1, length(pg - lp - vec2(0.15, 0.25))); }
  col += fireflies(lay(p, 1.2), uT, 0.12, vec3(1.0, 0.85, 0.4)) * night * (1.0 - dawn) * step(lay(p, 1.2).y, -0.2);
  fgGrass(col, lay(p, 1.5), uT, -0.7, mix(vec3(0.45, 0.42, 0.25), vec3(0.12, 0.13, 0.18), night * (1.0 - dawn)), 0.3);
  return col;
}

// 29 — Malki-tzedek (Shem), king of Shalem, greets Avram with bread and wine below golden Shalem; the king of Sedom offers treasure and Avram refuses
vec3 sceneMalki(vec2 p, float lt) {
  float k = SAT(lt / max(uDur, 1.0)); float l1 = LS(1); float second = at(k, l1, 0.06); float refuse = at(k, l1 + 0.18, 0.05); float up = at(k, 0.78, 0.05);
  CAM = vec2(mix(-0.25, 0.25, second) + 0.04 * sin(lt * 0.2), 0.0); CAM.y -= 0.1; CAMZ = mix(1.0, 0.92, smoothstep(0.0, 0.4, k) * (1.0 - second) + second * 0.5);
  vec2 ps = lay(p, 0.05); vec2 sun = vec2(0.75, 0.1);
  vec3 col = skyGrad(ps, vec3(1.0, 0.75, 0.45), vec3(0.98, 0.7, 0.65), vec3(0.32, 0.38, 0.78));
  col += vec3(1.0, 0.8, 0.5) * exp(-length(ps - sun) * 2.0) * 0.9; col = mix(col, vec3(1.0, 0.92, 0.75) * 1.6, smoothstep(0.06, 0.053, length(ps - sun))); col += godRays(p, sun - CAM * 0.05, vec3(1.0, 0.8, 0.55), 0.3);
  puffClouds(col, lay(p, 0.1), uT, 0.33, 0.55, 0.008, vec3(1.0, 0.85, 0.7), vec3(0.85, 0.55, 0.62), 51.0);
  vec3 hz = vec3(1.0, 0.8, 0.7);
  mountains(col, lay(p, 0.18), 0.0, 0.1, 1.4, 141.0, vec3(0.62, 0.5, 0.52), hz, 0.42, sun.x);
  // Shalem on its hill: golden walls and towers, a gate, glowing in the sunset
  vec2 pw = lay(p, 0.35); float hill = -0.07 + 0.06 * exp(-pow((pw.x + 0.35) * 1.8, 2.0)); if (pw.y < hill) col = mix(vec3(0.75, 0.58, 0.4), hz, 0.25);
  float wallTop = hill + 0.07; bool inWall = pw.x > -0.8 && pw.x < 0.1 && pw.y < wallTop && pw.y > hill - 0.02;
  if (inWall) { float brick = step(0.5, fract(pw.x * 45.0 + step(0.5, fract(pw.y * 40.0)) * 0.5)); col = vec3(1.0, 0.82, 0.55) * (0.88 + 0.12 * brick) * (0.9 + 0.1 * step(0.5, fract(pw.y * 40.0)));
    if (pw.y > wallTop - 0.012 && fract(pw.x * 30.0) > 0.5) col = mix(vec3(0.75, 0.58, 0.4), hz, 0.25); col = mix(col, hz, 0.15); }
  for (int i = 0; i < 4; i++) { float x = -0.72 + float(i) * 0.26; vec2 tq = pw - vec2(x, wallTop); if (abs(tq.x) < 0.035 && tq.y < 0.06 && tq.y > -0.1) col = vec3(1.0, 0.85, 0.58) * (tq.x < 0.0 ? 1.0 : 0.82);
    if (abs(tq.x) < 0.04 && tq.y >= 0.06 && tq.y < 0.065 + 0.04 - abs(tq.x)) col = vec3(0.85, 0.35, 0.3); if (abs(tq.x) < 0.01 && abs(tq.y - 0.02) < 0.012) col = vec3(1.0, 0.8, 0.4) * 1.4; }
  if (abs(pw.x + 0.35) < 0.035 && pw.y < hill + 0.05 && pw.y > hill - 0.02) col = vec3(0.4, 0.26, 0.18);
  flock(col, lay(p, 0.3), lt, vec2(-1.0, 0.22), vec2(0.08, 0.012), 5.0, 0.013, vec3(0.97, 0.97, 0.95));                // doves
  // vineyards and olive trees on the slopes
  vec2 pv = lay(p, 0.6);
  if (pv.y < -0.14) { col = mix(grass(pv, vec3(0.45, 0.58, 0.24), vec3(0.62, 0.68, 0.3)), hz, 0.1); float row = fract(pv.y * 28.0); float vine = smoothstep(0.3, 0.0, abs(row - 0.5)) * step(-0.3, pv.y);
    col = mix(col, vec3(0.25, 0.48, 0.2), vine * 0.8 * step(0.4, noise(pv * vec2(60.0, 8.0)))); col = mix(col, vec3(0.45, 0.15, 0.45), vine * step(0.85, hash(floor(pv * vec2(120.0, 28.0)))) * 0.9); }
  treeRow(col, pv, -0.14, 0.08, 0.15, 143.0, vec3(0.42, 0.52, 0.32), hz, 0.15, sun.x, 0.55);
  vec2 pg = lay(p, 1.0);
  if (pg.y < -0.22) col = mix(desertGround(pg), grass(pg, vec3(0.45, 0.58, 0.24), vec3(0.6, 0.68, 0.3)), 0.55) * vec3(1.08, 0.94, 0.82);
  LIGHT_TINT = vec3(1.0, 0.9, 0.78); RIM = 1.0; RIM_COL = vec3(1.0, 0.8, 0.5);
  // the table with a white cloth: round loaves, a jug and cups of wine
  vec2 tb = vec2(-0.28, -0.3); PX = 1.5 / uRes.y;
  ink(col, sdBox2(pg - tb, vec2(0.16, 0.012)), vec3(0.97, 0.95, 0.9), pg * 9.0); ink(col, sdBox2(pg - tb - vec2(0.0, -0.035), vec2(0.15, 0.03)), vec3(0.95, 0.93, 0.88), pg * 9.0);
  for (int i = 0; i < 3; i++) ink(col, sdE2(pg - tb - vec2(-0.1 + float(i) * 0.06, 0.03), vec2(0.03, 0.018)), vec3(0.88, 0.62, 0.3), pg * 9.0);
  ink(col, sdE2(pg - tb - vec2(0.09, 0.045), vec2(0.025, 0.035)), vec3(0.6, 0.25, 0.3), pg * 9.0); ink(col, sdTrap(pg - tb - vec2(0.13, 0.012), 0.0, 0.03, 0.008, 0.014, 0.0), vec3(0.9, 0.75, 0.35), pg * 9.0);
  // Malki-tzedek in white with a golden crown, holding a loaf
  Person M = malki(); M.facing = 1.0; M.armF = vec2(1.3, 0.4); M.talk = second > 0.5 ? 0.0 : 0.5; M.look = 0.5;
  vec2 mpos = vec2(-0.5, -0.37); drawPerson(col, pg, mpos, 0.44, M); crown(col, pg, mpos, 0.44, 1.0);
  vec2 mh = handPos(mpos, 0.44, M); ink(col, sdE2(pg - mh - vec2(0.03, 0.01), vec2(0.045, 0.025)), vec3(0.88, 0.62, 0.3), (pg - mh) * 9.0);
  col += sparkles(pg, uT, 0.15, 0.01, vec3(1.0, 0.9, 0.6)) * smoothstep(0.3, 0.1, length(pg - mpos - vec2(0.0, 0.35))) * (1.0 - second);
  // Avram, and behind him Lot and the freed people
  for (int i = 0; i < 3; i++) { Person F = townsperson(float(i) + 70.0); if (i == 1) F = womanP(float(i) + 70.0); F.facing = -1.0; F.armF = vec2(0.3, 0.4); drawPerson(col, pg, vec2(0.18 + float(i) * 0.12, -0.27), 0.28, F); }
  Person L = lotP(); L.facing = -1.0; L.armF = vec2(0.5, 0.4); drawPerson(col, pg, vec2(0.12, -0.355), 0.38, L);
  Person A = avram(); A.facing = second > 0.5 ? 1.0 : -1.0; A.armF = second > 0.5 ? vec2(0.6, 0.3) : vec2(0.9, 0.5); A.look = second > 0.5 ? 0.5 : -0.5; A.talk = second > 0.5 ? 0.0 : 0.2;
  if (refuse > 0.5) { A.armF = vec2(1.6, -0.2); A.talk = 0.7; A.look = 0.5 * sign(sin(uT * 5.0)); }
  if (up > 0.5) { A.armF = vec2(2.8, 0.1); A.look = 0.0; }
  vec2 apos = vec2(-0.08, -0.37); drawPerson(col, pg, apos, 0.44, A);
  // the king of Sedom with chests of treasure, glittering (refused)
  if (second > 0.0) { float sx = 0.55 + 0.3 * (1.0 - second);
    Person S = townsperson(55.0); S.robe = vec3(0.5, 0.15, 0.35); S.trim = vec3(0.95, 0.8, 0.3); S.wrap = vec3(0.95, 0.8, 0.3); S.facing = -1.0; S.armF = vec2(1.3, 0.5); S.talk = 0.6 * (1.0 - refuse); S.look = -0.5; S.brow = refuse;
    vec2 spos = vec2(sx, -0.38); drawPerson(col, pg, spos, 0.42, S); crown(col, pg, spos, 0.42, -1.0);
    for (int c = 0; c < 2; c++) { vec2 ch = vec2(sx - 0.2 - float(c) * 0.17, -0.37 + 0.0 * float(c));
      ink(col, sdBox2(pg - ch - vec2(0.0, 0.035), vec2(0.07, 0.035)) - 0.006, vec3(0.6, 0.35, 0.16), pg * 9.0); ink(col, sdBox2(pg - ch - vec2(0.0, 0.035), vec2(0.075, 0.008)), vec3(0.95, 0.75, 0.3), pg * 9.0);
      ink(col, sdE2(pg - ch - vec2(0.0, 0.08), vec2(0.065, 0.02)), vec3(1.0, 0.82, 0.3), pg * 9.0);                                                                  // heaped gold
      for (int i = 0; i < 4; i++) { vec2 gp = ch + vec2(-0.045 + float(i) * 0.03, 0.09 + 0.01 * sin(float(i) * 2.0)); col = mix(col, i % 2 == 0 ? vec3(0.3, 0.5, 0.95) : vec3(0.9, 0.2, 0.3), smoothstep(0.008, 0.005, length(pg - gp))); }
      col += vec3(1.0, 0.9, 0.5) * (twinkle(pg, ch + vec2(0.03 * sin(uT * 1.3 + float(c) * 2.0), 0.1), 0.035) * (0.6 + 0.4 * sin(uT * 4.0 + float(c)))) * (1.0 - up * 0.6); } }
  // "Hashem is the One who makes me rich": light from above on Avram
  col += vec3(1.0, 0.95, 0.8) * up * 0.4 * smoothstep(0.1, 0.0, abs(pg.x - apos.x) - 0.02 * (0.6 - pg.y)) * smoothstep(-0.4, 0.6, pg.y);
  col += sparkles(pg, uT, 0.3, 0.012, vec3(1.0, 0.92, 0.65)) * up * smoothstep(0.2, 0.0, abs(pg.x - apos.x));
  fgGrass(col, lay(p, 1.5), uT, -0.7, vec3(0.45, 0.48, 0.22), 0.7);
  return col;
}

// 30 — the stars: the camera rises from Avram's glowing tent into a sky that fills with more and more stars, the Milky Way, shooting stars
vec3 sceneStars(vec2 p, float lt) {
  float k = SAT(lt / max(uDur, 1.0)); float more = smoothstep(0.1, 0.6, k); float l1 = LS(1); float wave_ = at(k, l1, 0.08);
  CAM = vec2(0.0, -0.18 + 0.36 * smoothstep(0.05, 0.6, k) - 0.12 * wave_); CAM.y -= 0.1; CAMZ = mix(0.95, 1.12, smoothstep(0.05, 0.6, k));
  vec2 ps = lay(p, 0.35);
  vec3 col = skyGrad(ps, vec3(0.18, 0.13, 0.32), vec3(0.07, 0.08, 0.24), vec3(0.02, 0.025, 0.09));
  float band = exp(-pow((ps.y - 0.22 - ps.x * 0.35) * 4.0, 2.0)); float neb = fbm(ps * vec2(3.0, 6.0) + vec2(ps.y * 2.0, uT * 0.01));
  col += mix(vec3(0.45, 0.4, 0.9), vec3(0.95, 0.5, 0.75), fbm(ps * 2.0 + 4.0)) * band * neb * neb * (0.6 + 0.6 * more);
  col += vec3(0.3, 0.6, 0.9) * pow(fbm(ps * 4.0 + 9.0), 3.0) * band * 0.5 * more;
  col += stars(ps, uT) * 1.5 + stars(ps * 1.6 + 3.0, uT) * (0.6 + 1.6 * more) + stars(ps * 2.7 + 7.0, uT) * more * 1.6 + stars(ps * 4.1 + 11.0, uT) * more * more * 1.4;
  for (int L = 0; L < 3; L++) { float sc = 18.0 + float(L) * 14.0; vec2 g = ps * sc + float(L) * 7.3; vec2 id = floor(g); float h = hash(id);
    if (h > 0.55 - 0.35 * more) { vec2 c0 = (id + 0.5 + 0.35 * (hash2(id) - 0.5)) / sc; float tw = 0.65 + 0.35 * sin(uT * (1.0 + 3.0 * h) + h * 50.0);
      float pulse = 1.0 + 1.2 * wave_ * smoothstep(0.08, 0.0, abs(fract(length(c0 - vec2(0.0, -0.3)) * 1.5 - uT * 0.35) - 0.5));
      float on = smoothstep(0.55 - 0.35 * more, 0.6 - 0.35 * more, h);
      col += vec3(1.0, 0.95, 0.85) * on * tw * pulse * twinkle(ps, c0, 0.035 / sc * 9.0) * (1.0 - 0.3 * float(L)); } }
  col += shootingStar(ps, uT, 2.6, 7.0) + shootingStar(ps, uT + 1.3, 3.7, 19.0) * more;
  vec2 pg = lay(p, 1.0);
  mountains(col, lay(p, 0.6), -0.12, 0.08, 1.5, 151.0, vec3(0.14, 0.13, 0.26), vec3(0.1, 0.1, 0.22), 0.25, 0.6);
  if (pg.y < -0.2) col = mix(vec3(0.12, 0.1, 0.18), vec3(0.22, 0.18, 0.26), fbm(pg * 5.0));
  LIGHT_TINT = vec3(0.62, 0.64, 0.95); RIM = 1.3; RIM_COL = vec3(0.7, 0.78, 1.0);
  tent(col, pg, vec2(-0.48, -0.32), 0.22, vec3(0.5, 0.35, 0.28), 1.0);
  for (int i = 0; i < 3; i++) drawAnimal(col, pg, vec2(0.45 + float(i) * 0.09, -0.36 - 0.01 * float(i % 2)), 0.07, 4, 0.0, -1.0);
  // Avram points up, counting star after star
  Person A = avram(); A.facing = 1.0; A.look = 0.3; A.armF = vec2(2.5 + 0.25 * sin(uT * 2.5), 0.15); A.armB = vec2(-0.3, 0.3); A.brow = 0.5 * more;
  if (wave_ > 0.5) { A.armF = vec2(2.6, 0.2); A.armB = vec2(-2.4, -0.2); A.talk = 0.0; }
  vec2 apos = vec2(0.05, -0.39); drawPerson(col, pg, apos, 0.44, A);
  col += vec3(1.0, 0.85, 0.55) * 0.18 * wave_ * exp(-length(pg - apos - vec2(0.0, 0.25)) * 3.0);
  col += fireflies(pg, uT, 0.15, vec3(0.9, 1.0, 0.5)) * step(pg.y, -0.12);
  fgGrass(col, lay(p, 1.4), uT, -0.7, vec3(0.1, 0.11, 0.17), 0.0);
  return col;
}

// 31 — the new name: under the oaks of Mamre in bright day; light pours down, a ring of light bursts as the ה is added; flowers bloom
vec3 sceneName(vec2 p, float lt) {
  float k = SAT(lt / max(uDur, 1.0)); float l1 = LS(1), l2 = LS(2); float glow = at(k, l1, 0.06); float burst = at(k, 0.5, 0.02); float bloom = smoothstep(0.5, 0.75, k); float cov = at(k, l2, 0.06);
  CAM = vec2(mix(-0.2, 0.05, smoothstep(0.0, 0.35, k)), 0.0); CAM.y -= 0.1; CAMZ = mix(1.0, 0.9, glow) + 0.08 * cov;
  vec2 ps = lay(p, 0.05); vec2 sun = vec2(0.12, 0.62);
  vec3 col = skyGrad(ps, vec3(0.95, 0.94, 0.88), vec3(0.55, 0.78, 0.98), vec3(0.2, 0.45, 0.92));
  puffClouds(col, lay(p, 0.1), uT, 0.34, 0.55, 0.012, vec3(1.0), vec3(0.78, 0.82, 0.95), 61.0); puffClouds(col, lay(p, 0.15), uT, 0.18, 0.38, 0.018, vec3(1.0), vec3(0.8, 0.84, 0.95), 67.0);
  col += godRays(p, sun - CAM * 0.05, vec3(1.0, 0.95, 0.8), 0.35 + 0.6 * glow);
  vec3 hz = vec3(0.85, 0.9, 0.97);
  mountains(col, lay(p, 0.18), -0.02, 0.1, 1.4, 161.0, vec3(0.6, 0.6, 0.62), hz, 0.42, sun.x);
  vec2 pm = lay(p, 0.45); treeRow(col, pm, -0.12, 0.08, 0.12, 163.0, vec3(0.32, 0.52, 0.22), hz, 0.22, sun.x, 0.7);
  if (pm.y < -0.12) col = mix(grass(pm, vec3(0.38, 0.6, 0.24), vec3(0.55, 0.72, 0.3)), hz, 0.15);
  vec2 pg = lay(p, 1.0);
  if (pg.y < -0.2) col = grass(pg, vec3(0.4, 0.6, 0.22), vec3(0.6, 0.72, 0.3));
  oak(col, pg, vec2(-0.92, -0.26), 0.42, vec3(0.3, 0.52, 0.2), sun.x); oak(col, pg, vec2(0.85, -0.25), 0.36, vec3(0.32, 0.55, 0.22), sun.x);
  LIGHT_TINT = vec3(1.0, 0.97, 0.92); RIM = 1.0; RIM_COL = vec3(1.0, 0.95, 0.8);
  tent(col, pg, vec2(-0.48, -0.3), 0.22, vec3(0.55, 0.38, 0.3), 0.3);
  for (int i = 0; i < 16; i++) { float fi = float(i); float x = -0.95 + fi * 0.125 + 0.05 * hash1(fi + 4.0);
    flower(col, pg, vec2(x, -0.44 - 0.06 * hash1(fi * 3.0)), 0.065 * smoothstep(0.0, 0.25, bloom - hash1(fi) * 0.6), 0.65 + 0.35 * cos(6.28 * (hash1(fi * 5.0) + vec3(0.0, 0.33, 0.67)))); }
  // light pouring down onto Avram; at the moment of the ה a ring of light bursts outward
  vec2 apos = vec2(0.12, -0.38);
  float bw = 0.04 + 0.04 * SAT(0.6 - pg.y); col += vec3(1.0, 0.95, 0.8) * smoothstep(bw, 0.0, abs(pg.x - apos.x)) * smoothstep(-0.45, 0.6, pg.y) * (0.3 + 0.5 * glow);
  float rr = SAT((k - 0.5) * 6.0); float ring = abs(length((pg - apos - vec2(0.0, 0.25)) * vec2(1.0, 1.0)) - rr * 0.9);
  col += vec3(1.0, 0.85, 0.5) * smoothstep(0.02, 0.0, ring) * (1.0 - rr) * burst * 1.2;
  col += sparkles(pg, uT, 0.3, 0.014, vec3(1.0, 0.9, 0.6)) * glow * smoothstep(0.45, 0.1, abs(pg.x - apos.x));
  Person A = avram(); A.facing = 1.0; A.look = 0.2; A.armF = vec2(0.5, 0.3); A.armB = vec2(-0.2, 0.3);
  if (glow > 0.5) { A.armF = vec2(2.4, 0.3); A.armB = vec2(-2.4, -0.3); A.brow = 0.5; }
  drawPerson(col, pg, apos + vec2(0.0, 0.015 * abs(sin(uT * 4.0)) * burst * (1.0 - cov)), 0.44, A);
  Person Sr = sarai(); Sr.facing = 1.0; Sr.look = 0.5; Sr.armF = vec2(0.5 + 0.9 * bloom, 0.5); Sr.talk = 0.2 * bloom; drawPerson(col, pg, vec2(-0.22, -0.385), 0.42, Sr);
  // the covenant: a golden halo of light above, sparkles circling
  for (int i = 0; i < 10; i++) { float a = float(i) * 0.628 + uT * 0.6; vec2 sp = apos + vec2(0.0, 0.55) + vec2(cos(a) * 0.32, sin(a) * 0.08); col += vec3(1.0, 0.85, 0.45) * twinkle(pg, sp, 0.03) * cov; }
  butterflies(col, pg, uT, vec2(0.0, -0.22), vec2(0.6, 0.1), 2.0 + 3.0 * bloom, 0.014);
  fgGrass(col, lay(p, 1.5), uT, -0.7, vec3(0.35, 0.52, 0.2), 0.4 + 0.6 * bloom);
  return col;
}

// 32 — the promise of Yitzchak: a golden sunrise meadow bursting with flowers and petals; Avraham rejoices; the camera rises to the glowing sky
vec3 scenePromise(vec2 p, float lt) {
  float k = SAT(lt / max(uDur, 1.0)); float l1 = LS(1), l2 = LS(2); float joy = at(k, l1, 0.05); float tease = at(k, l2, 0.1);
  CAM = vec2(0.0, 0.32 * smoothstep(l2, 1.0, k)); CAM.y -= 0.1; CAMZ = mix(0.95, 1.08, smoothstep(l2, 1.0, k));
  vec2 ps = lay(p, 0.1); vec2 sun = vec2(0.0, 0.08 + 0.06 * k);
  vec3 col = skyGrad(ps, vec3(1.0, 0.75, 0.45), vec3(0.98, 0.66, 0.62), vec3(0.38, 0.4, 0.8));
  col += vec3(1.0, 0.82, 0.5) * exp(-length(ps - sun) * 2.0) * 0.9 + vec3(1.0, 0.97, 0.85) * smoothstep(0.085, 0.078, length(ps - sun)) * 1.2;
  col += godRays(p, sun - CAM * 0.1, vec3(1.0, 0.85, 0.55), 0.5); col += sunRays(p, sun - CAM * 0.1, vec3(1.0, 0.85, 0.55), 0.3);
  puffClouds(col, lay(p, 0.14), uT, 0.34, 0.55, 0.01, vec3(1.0, 0.86, 0.72), vec3(0.88, 0.6, 0.62), 71.0);
  vec3 hz = vec3(1.0, 0.78, 0.65);
  mountains(col, lay(p, 0.2), -0.04, 0.1, 1.4, 171.0, vec3(0.65, 0.48, 0.5), hz, 0.45, sun.x);
  flock(col, lay(p, 0.3), lt, vec2(-1.0, 0.12), vec2(0.13, 0.03), 7.0, 0.012, vec3(0.35, 0.22, 0.25));
  vec2 pg = lay(p, 1.0);
  if (pg.y < -0.16) col = grass(pg, vec3(0.45, 0.58, 0.22), vec3(0.62, 0.68, 0.28)) * vec3(1.1, 0.94, 0.76);
  for (int i = 0; i < 20; i++) { float fi = float(i); float x = -1.0 + fi * 0.105 + 0.04 * hash1(fi + 4.0); float y = -0.3 - 0.18 * hash1(fi * 3.0);
    flower(col, pg, vec2(x, y), (0.05 + 0.03 * step(y, -0.4)) * smoothstep(0.05 + hash1(fi) * 0.35, 0.3 + hash1(fi) * 0.35, k), 0.65 + 0.35 * cos(6.28 * (hash1(fi * 5.0) + vec3(0.0, 0.33, 0.67)))); }
  LIGHT_TINT = vec3(1.0, 0.88, 0.72); RIM = 1.2; RIM_COL = vec3(1.0, 0.8, 0.5);
  tent(col, pg, vec2(-0.55, -0.3), 0.2, vec3(0.55, 0.38, 0.3), 0.3);
  Person Sr = sarai(); Sr.facing = 1.0; Sr.look = 0.4; Sr.armF = vec2(0.9 + 0.8 * joy, 0.5); Sr.armB = vec2(-0.3 - 0.8 * joy, 0.3); drawPerson(col, pg, vec2(-0.32, -0.36), 0.4, Sr);
  // Avraham: listens with wonder, then rejoices, hopping with joy
  Person A = avram(); A.facing = 1.0; A.look = 0.0; A.talk = 0.0; A.armF = vec2(1.0, 0.5); A.armB = vec2(-0.3, 0.3); A.brow = 0.6 * (1.0 - joy);
  float hop = 0.0;
  if (joy > 0.5) { A.armF = vec2(2.6 + 0.15 * sin(uT * 6.0), 0.2); A.armB = vec2(-2.6 - 0.15 * sin(uT * 6.0), -0.2); A.talk = 0.8; hop = 0.035 * abs(sin(uT * 5.0)); }
  vec2 apos = vec2(0.08, -0.37 + hop); drawPerson(col, pg, apos, 0.46, A);
  col += sparkles(pg, uT, 0.25 + 0.3 * joy, 0.014, vec3(1.0, 0.88, 0.55)) * (0.4 + 0.6 * joy) * smoothstep(0.6, 0.1, length(pg - apos - vec2(0.0, 0.3)));
  col += motes(p, uT, 0.02, 0.12, vec3(1.0, 0.85, 0.55) * 0.6, 0.04);
  petals(col, p, uT, joy * (1.0 - 0.5 * tease));
  butterflies(col, pg, uT, vec2(0.1, -0.15), vec2(0.7, 0.12), 3.0 + 3.0 * joy, 0.014);
  fgGrass(col, lay(p, 1.5), uT, -0.7, vec3(0.45, 0.5, 0.2), 1.0);
  col += lensFlare(p, sun - CAM * 0.1, vec3(1.0, 0.8, 0.5)) * 0.5;
  return col;
}
