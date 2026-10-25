// ── SCENES (Vayera) ─────────────────────────────────────────────────────────
// Content rules: Hashem only as light (and the malach's call only as light). The three malachim appear as travelers, as Rashi says.
// Women (Sarah, Lot's wife and daughters) are dressed modestly. Sedom is seen only from far away, no people in it. Lot's wife: her figure fades into a pillar of salt.
// The akeidah: no knife and no binding are shown; Yitzchak sits calmly on the mizbe'ach, then the light comes and the ram is found.
Person avraham() { Person P = avram(); P.beard = vec3(0.9, 0.88, 0.84); P.beardLen = 0.9; return P; }
Person sarah() { Person P = sarai(); P.blink = blinkAt(0.53); return P; }
Person yitzchakP() { Person P = defaultPerson(); P.robe = vec3(0.86, 0.55, 0.2); P.trim = vec3(0.95, 0.9, 0.75); P.beard = vec3(0.3, 0.18, 0.08); P.beardLen = 0.3;
  P.wrap = vec3(0.97, 0.95, 0.9); P.skin = vec3(0.93, 0.74, 0.6); P.blink = blinkAt(0.37); return P; }
Person traveler(int i) { Person P = defaultPerson(); float fi = float(i);
  P.robe = mix(vec3(0.93, 0.9, 0.82), vec3(0.78, 0.7, 0.55), fract(fi * 0.37)); P.trim = mix(vec3(0.5, 0.65, 0.85), vec3(0.85, 0.75, 0.45), fract(fi * 0.61));
  P.wrap = vec3(0.98, 0.97, 0.94); P.beard = mix(vec3(0.15, 0.1, 0.06), vec3(0.4, 0.28, 0.15), fract(fi * 0.53)); P.beardLen = 0.4; P.skin = mix(vec3(0.85, 0.64, 0.48), vec3(0.7, 0.5, 0.36), fract(fi * 0.71));
  P.blink = blinkAt(0.2 + fi * 0.21); return P; }
// a swaddled baby (center c, size s)
void baby(inout vec3 col, vec2 p, vec2 c, float s, float ang) {
  vec2 q = rot(ang) * (p - c) / s; PX = 1.5 / (uRes.y * s); if (dot(q, q) > 2.0) return;
  ink(col, sdE2(q - vec2(-0.2, 0.0), vec2(0.62, 0.32)), vec3(0.97, 0.95, 0.9), q);
  col = mix(col, vec3(0.55, 0.72, 0.95), smoothstep(PX, -PX, max(sdE2(q - vec2(-0.2, 0.0), vec2(0.62, 0.32)) + 0.02, abs(q.x + 0.25) - 0.06)));
  ink(col, length(q - vec2(0.42, 0.04)) - 0.26, vec3(0.97, 0.78, 0.66), q);
  for (int e = 0; e < 2; e++) { vec2 ec = vec2(0.36 + float(e) * 0.13, 0.1); col = mix(col, vec3(0.25, 0.15, 0.1), smoothstep(PX * 2.0, 0.0, abs(length(q - ec - vec2(0.0, 0.03)) - 0.04) - 0.008) * step(q.y, ec.y + 0.02)); }
  col = mix(col, vec3(1.0, 0.55, 0.5), smoothstep(0.07, 0.0, length(q - vec2(0.55, -0.02))) * 0.5);
  col = mix(col, vec3(0.6, 0.25, 0.2), smoothstep(PX * 2.0, 0.0, abs(length(q - vec2(0.45, -0.02)) - 0.05) - 0.008) * step(q.y, -0.03)); }
// a ram: a woolly sheep body with big curled horns
void drawRam(inout vec3 col, vec2 p, vec2 pos, float h, float facing, float ph) {
  drawAnimal(col, p, pos, h, 4, ph, facing);
  vec2 q = (p - pos) / h; q.x *= facing; PX = 1.5 / (uRes.y * h);
  vec2 hc = vec2(0.26, 0.5); vec2 d = q - hc; float r = length(d); float a = atan(d.y, d.x);
  float spiral = abs(r - (0.07 + 0.05 * (a + PI) / (2.0 * PI)) ) - 0.03; spiral = max(spiral, r - 0.15);
  ink(col, spiral, vec3(0.82, 0.72, 0.55) * (0.85 + 0.15 * step(0.5, fract(a * 4.0))), q); }
// a tangled thorn bush
void thornBush(inout vec3 col, vec2 p, vec2 pos, float s, float shake) {
  vec2 q = (p - pos) / s; q.x += shake * 0.03 * sin(uT * 18.0) * q.y; PX = 1.5 / (uRes.y * s); if (abs(q.x) > 1.0 || q.y < -0.05 || q.y > 1.0) return;
  float b = 1e5; for (int i = 0; i < 6; i++) { float fi = float(i); b = min(b, length(q - vec2(-0.55 + fi * 0.22, 0.3 + 0.18 * sin(fi * 2.3))) - 0.25 - 0.05 * hash1(fi)); }
  b = max(b, -q.y); b += 0.04 * (fbm(q * 9.0) - 0.5);
  ink(col, b, vec3(0.3, 0.42, 0.2) * (0.8 + 0.3 * noise(q * 25.0)), q);
  for (int i = 0; i < 7; i++) { float fi = float(i); vec2 a = vec2(-0.6 + fi * 0.2, 0.05); vec2 c = a + vec2(0.25 * sin(fi * 3.1), 0.55 + 0.2 * hash1(fi));
    col = mix(col, vec3(0.35, 0.24, 0.15), smoothstep(PX, -PX, sdSeg2(q, a, c, 0.018, 0.006))); } }
// a clay tabun oven with a glowing mouth and smoke
void oven(inout vec3 col, vec2 p, vec2 pos, float s) {
  vec2 q = (p - pos) / s; PX = 1.5 / (uRes.y * s);
  vec2 sq = q - vec2(0.05 * sin(q.y * 3.0 + uT), 0.9); float smoke = smoothstep(0.4, 0.0, length(sq * vec2(2.5 / (1.0 + q.y), 0.6)) - 0.25 * fbm(q * 3.0 - vec2(0.0, uT * 0.5))) * step(0.5, q.y) * smoothstep(3.0, 0.8, q.y);
  col = mix(col, vec3(0.9, 0.88, 0.86), smoothstep(0.2, 0.6, smoke) * 0.5);
  if (abs(q.x) > 0.8 || q.y < -0.05 || q.y > 0.9) return;
  ink(col, max(sdE2(q, vec2(0.6, 0.7)), -q.y), vec3(0.75, 0.5, 0.35) * (0.9 + 0.1 * noise(q * 20.0)), q);
  float mouth = max(sdE2(q - vec2(0.15, 0.0), vec2(0.22, 0.26)), -q.y); col = mix(col, vec3(1.0, 0.5, 0.15) * (1.2 + 0.3 * sin(uT * 9.0)), smoothstep(PX, -PX, mouth));
  col += vec3(1.0, 0.55, 0.2) * 0.25 * exp(-length(q - vec2(0.15, 0.1)) * 3.0); }
// a string of little bunting flags from a to b
void bunting(inout vec3 col, vec2 p, vec2 a, vec2 b, float sag) {
  if (p.x < a.x || p.x > b.x) return; float t = (p.x - a.x) / (b.x - a.x); float y = mix(a.y, b.y, t) - sag * 4.0 * t * (1.0 - t);
  col = mix(col, vec3(0.4, 0.3, 0.2), smoothstep(0.0025, 0.0, abs(p.y - y)));
  float sp = 0.045; float i = floor((p.x - a.x) / sp); float lx = (p.x - a.x) - (i + 0.5) * sp; float ly = y - p.y;
  float tri = max(abs(lx) - (sp * 0.4) * (1.0 - ly / 0.05), max(-ly, ly - 0.05)); vec3 fc = 0.6 + 0.4 * cos(6.28 * (hash1(i * 3.3) + vec3(0.0, 0.33, 0.67)));
  col = mix(col, fc * (0.9 + 0.1 * sin(uT * 3.0 + i)), smoothstep(0.002, -0.002, tri)); }
// musical notes floating up (a happy crowd)
void notes(inout vec3 col, vec2 p, float t, vec2 c, vec2 range, float amt) {
  if (amt <= 0.0) return;
  for (int i = 0; i < 6; i++) { float fi = float(i); float life = fract(t * 0.25 + fi * 0.17); vec2 np = c + vec2(range.x * (hash1(fi * 2.1) - 0.5) + 0.03 * sin(t * 2.0 + fi), range.y * life);
    vec2 q = (p - np) / 0.03; float head = sdE2(rot(0.4) * q, vec2(0.42, 0.3)); float stem = sdBox2(q - vec2(0.36, 0.75), vec2(0.06, 0.75)); float flag = sdSeg2(q, vec2(0.36, 1.5), vec2(0.8, 1.0), 0.08, 0.05);
    vec3 nc = 0.6 + 0.4 * cos(6.28 * (fi * 0.23 + vec3(0.0, 0.33, 0.67)));
    col = mix(col, nc, smoothstep(0.06, -0.06, min(head, min(stem, flag))) * sin(life * PI) * amt); } }
// glowing streaks of fire and sulfur falling over an area (x0..x1)
vec3 fireRain(vec2 p, float t, float x0, float x1, float amt) {
  if (amt <= 0.0 || p.x < x0 - 0.1 || p.x > x1 + 0.1) return vec3(0.0); vec3 acc = vec3(0.0);
  for (int L = 0; L < 2; L++) { float sc = 14.0 + float(L) * 9.0; vec2 g = vec2(p.x * sc + p.y * 3.0, p.y * sc * 0.25 + t * (2.5 + float(L))); vec2 id = floor(g); float h = hash(id + float(L) * 7.0);
    if (h > 0.35) continue; vec2 f = fract(g) - vec2(0.5, 0.5); float streak = smoothstep(0.08, 0.0, abs(f.x)) * smoothstep(0.5, -0.4, f.y) * step(-0.45, f.y);
    acc += mix(vec3(1.0, 0.45, 0.1), vec3(1.0, 0.85, 0.4), h * 2.5) * streak * (1.2 - 0.4 * float(L)); }
  return acc * amt * smoothstep(x0 - 0.1, x0 + 0.05, p.x) * smoothstep(x1 + 0.1, x1 - 0.05, p.x); }
// a thought bubble (center c, radius r), its little trail going down to `from`
float bubbleMask(vec2 p, vec2 c, vec2 r, vec2 from) { float b = sdE2(p - c, r);
  for (int i = 0; i < 3; i++) { vec2 bc = mix(from, c - vec2(0.0, r.y), 0.25 + float(i) * 0.25); b = min(b, length(p - bc) - (0.008 + 0.007 * float(i))); } return b; }
// a little pot of glowing embers carried by hand
void firePot(inout vec3 col, vec2 p, vec2 hand) { PX = 1.5 / uRes.y; vec2 c = hand + vec2(0.0, -0.035);
  ink(col, max(sdE2(p - c, vec2(0.03, 0.025)), p.y - c.y - 0.01), vec3(0.55, 0.35, 0.22), (p - c) * 9.0);
  col += flame((p - c - vec2(0.0, 0.008)) / 0.035, uT, 5.0) * 1.2; col += vec3(1.0, 0.55, 0.2) * 0.3 * exp(-length(p - c - vec2(0.0, 0.02)) * 18.0); }
// a bundle of firewood (logs tied together), centred at c
void woodBundle(inout vec3 col, vec2 p, vec2 c, float s) { PX = 1.5 / uRes.y;
  for (int i = 0; i < 3; i++) { vec2 o = c + vec2(0.0, (float(i) - 1.0) * s * 0.28); ink(col, sdCap2(p, o - vec2(s, 0.0), o + vec2(s, 0.0), s * 0.15), vec3(0.6, 0.4, 0.22) * (0.9 + 0.1 * float(i)), (p - o) * 9.0);
    col = mix(col, vec3(0.85, 0.7, 0.45), smoothstep(PX, -PX, length(p - o - vec2(s, 0.0)) - s * 0.1)); }
  col = mix(col, vec3(0.45, 0.3, 0.18), smoothstep(PX, -PX, max(abs(p.x - c.x) - s * 0.06, abs(p.y - c.y) - s * 0.45))); }
// a little lizard scurrying across the sand
void lizard(inout vec3 col, vec2 p, vec2 pos, float s, float facing) {
  vec2 q = (p - pos) / s; q.x *= facing; PX = 1.5 / (uRes.y * s); if (abs(q.x) > 1.6 || abs(q.y) > 0.5) return;
  float wig = 0.08 * sin(uT * 20.0 + q.x * 4.0);
  float body = min(sdE2(q - vec2(0.0, wig * 0.3), vec2(0.45, 0.12)), min(sdE2(q - vec2(0.5, 0.03), vec2(0.18, 0.1)), sdSeg2(q, vec2(-0.4, 0.0), vec2(-1.4, 0.05 + wig), 0.08, 0.02)));
  for (int i = 0; i < 2; i++) { float x = -0.2 + float(i) * 0.4; float ph = sin(uT * 20.0 + float(i) * 3.0) * 0.12; body = min(body, min(sdSeg2(q, vec2(x, 0.0), vec2(x + ph, -0.25), 0.04, 0.03), sdSeg2(q, vec2(x, 0.0), vec2(x - ph, 0.25), 0.04, 0.03))); }
  ink(col, body, vec3(0.45, 0.62, 0.3), q); col = mix(col, vec3(0.05), smoothstep(PX, -PX, length(q - vec2(0.58, 0.07)) - 0.03)); }
// sunbaked ground
vec3 hotGround(vec2 p) { return mix(vec3(0.92, 0.74, 0.46), vec3(0.8, 0.6, 0.36), fbm(p * vec2(3.0, 12.0))) * (0.92 + 0.1 * noise(p * 120.0)); }

// Avraham's tent, open on all four sides so guests could come in from any direction (Rashi): a striped goat-hair roof on four poles,
// every wall rolled up, a rug and cushions inside; seen at an angle so the open front and side (and the open back beyond) all show
float sdQuad(vec2 q, vec2 a, vec2 b, vec2 c, vec2 d) {   // convex, counter-clockwise
  vec2 v[4]; v[0] = a; v[1] = b; v[2] = c; v[3] = d; float m = -1e5;
  for (int i = 0; i < 4; i++) { vec2 e = v[(i + 1) % 4] - v[i]; vec2 n = normalize(vec2(e.y, -e.x)); m = max(m, dot(q - v[i], n)); }
  return m; }
void openTent(inout vec3 col, vec2 p, vec2 pos, float s, vec3 cloth, float glow) {
  vec2 q = (p - pos) / s; PX = 1.5 / (uRes.y * s); if (q.x < -1.15 || q.x > 1.2 || q.y < -0.1 || q.y > 1.45) return;
  vec2 FL = vec2(-0.95, 0.0), FR = vec2(0.35, 0.0), BR = vec2(0.95, 0.16), BL = vec2(-0.35, 0.16); float H = 0.9;
  col *= 1.0 - 0.25 * smoothstep(0.02, -0.06, sdQuad(q, FL - vec2(0.1, 0.03), FR + vec2(0.1, -0.03), BR + vec2(0.1, 0.0), BL - vec2(0.1, 0.0)));
  // the rug and cushions inside, a warm light under the roof
  float rug = sdQuad(q, FL + vec2(0.08, 0.02), FR + vec2(-0.04, 0.02), BR + vec2(-0.08, -0.01), BL + vec2(0.06, -0.01));
  vec3 rc = vec3(0.7, 0.18, 0.2) * (0.85 + 0.15 * step(0.5, fract(q.x * 6.0 + q.y * 3.0))); rc = mix(rc, vec3(0.95, 0.75, 0.3), smoothstep(0.012, 0.0, abs(rug + 0.025)));
  col = mix(col, rc * LIGHT_TINT, smoothstep(PX, -PX, rug));
  for (int i = 0; i < 3; i++) { vec2 cc = mix(BL, BR, 0.2 + float(i) * 0.3) + vec2(0.0, 0.035); ink(col, sdE2(q - cc, vec2(0.1, 0.05)), (0.55 + 0.4 * cos(6.28 * (float(i) * 0.3 + vec3(0.0, 0.33, 0.67)))), q); }
  col += vec3(1.0, 0.75, 0.4) * glow * 0.18 * exp(-length((q - vec2(0.0, 0.35)) * vec2(0.8, 1.2)) * 2.0);
  // the back poles (seen through the open front and side)
  for (int i = 0; i < 2; i++) { vec2 b = i == 0 ? BL : BR; ink(col, sdBox2(q - b - vec2(0.0, H * 0.5), vec2(0.018, H * 0.5)), vec3(0.4, 0.27, 0.16), q); }
  // the roof: a front slope and a side slope up to the ridge, striped, with a scalloped fringe and the rolled-up walls along the edges
  vec2 RF = vec2(-0.62, 1.24), RB = vec2(0.66, 1.32); vec2 tFL = FL + vec2(0.0, H), tFR = FR + vec2(0.0, H), tBR = BR + vec2(0.0, H);
  float front = sdQuad(q, tFL, tFR, RB, RF); float side = sdQuad(q, tFR, tBR, RB, RB + vec2(-0.001, 0.0));
  float stripes = 0.85 + 0.15 * step(0.5, fract(q.x * 7.0 - q.y * 2.0));
  ink(col, side, cloth * 0.78 * stripes, q); ink(col, front, cloth * stripes, q);
  for (int e = 0; e < 2; e++) { vec2 a = e == 0 ? tFL : tFR, b = e == 0 ? tFR : tBR; vec2 ab = b - a; float h = SAT(dot(q - a, ab) / dot(ab, ab)); vec2 c = a + ab * h;
    float roll = length(q - c - vec2(0.0, -0.04)) - 0.045; ink(col, roll, cloth * 0.7 * (0.9 + 0.1 * sin(h * 60.0)), q);                 // the rolled-up wall
    float sc = length(vec2(fract(h * (e == 0 ? 12.0 : 6.0)) - 0.5, (q.y - c.y + 0.1) * 6.0)) - 0.42; col = mix(col, vec3(0.95, 0.78, 0.3) * LIGHT_TINT, smoothstep(0.05, -0.05, max(sc, max(q.y - c.y + 0.075, c.y - 0.12 - q.y)))); }
  // the front poles with ropes and pegs
  for (int i = 0; i < 2; i++) { vec2 b = i == 0 ? FL : FR; ink(col, sdBox2(q - b - vec2(0.0, H * 0.5), vec2(0.024, H * 0.5)), vec3(0.48, 0.32, 0.18), q);
    ink(col, sdCap2(q, b + vec2(0.0, H), b + vec2(i == 0 ? -0.18 : 0.22, -0.02), 0.008), vec3(0.6, 0.5, 0.35), q); }
  ink(col, sdCap2(q, tBR, BR + vec2(0.2, -0.0), 0.008), vec3(0.6, 0.5, 0.35), q); }

// 33 — the hottest day: Avraham sits at his tent door by the oaks of Mamre, three days after his bris; Hashem visits (light); the road stays empty
vec3 sceneVisit(vec2 p, float lt) {
  float k = SAT(lt / max(uDur, 1.0)); float visit = at(k, LS(1), 0.06); float hot = at(k, LS(2), 0.08);
  CAM = vec2(mix(0.3, -0.02, smoothstep(0.0, 0.55, k)), -0.1); CAMZ = mix(1.0, 0.88, smoothstep(0.0, 1.0, k));
  vec2 ps = lay(p, 0.05); vec2 sun = vec2(0.5, 0.34);
  vec3 col = skyGrad(ps, vec3(1.0, 0.86, 0.55), vec3(0.98, 0.82, 0.55), vec3(0.45, 0.62, 0.95));
  col = mix(col, col * vec3(1.08, 0.95, 0.8), hot);
  col += vec3(1.0, 0.85, 0.45) * exp(-length(ps - sun) * (2.6 - 0.6 * hot)) * (0.7 + 0.4 * hot); col = mix(col, vec3(1.0, 0.98, 0.9) * 1.8, smoothstep(0.08, 0.072, length(ps - sun)));
  col += sunRays(p, sun - CAM * 0.05, vec3(1.0, 0.85, 0.5), 0.18 + 0.2 * hot);
  // heat shimmer on everything near the ground
  vec2 hp = p + vec2(0.0035 * sin(p.y * 90.0 + uT * 7.0) * smoothstep(0.1, -0.2, p.y) * (0.6 + hot), 0.0);
  vec3 hz = vec3(1.0, 0.86, 0.66);
  mountains(col, lay(hp, 0.18), -0.02, 0.1, 1.4, 201.0, vec3(0.72, 0.56, 0.48), hz, 0.4, sun.x);
  vec2 pm = lay(hp, 0.45);
  dunes(col, pm, -0.1, 0.03, 4.0, 5.0, vec3(0.98, 0.8, 0.52), hz, 0.3, sun.x);
  treeRow(col, pm, -0.11, 0.06, 0.16, 203.0, vec3(0.42, 0.5, 0.25), hz, 0.3, sun.x, 0.45);
  palm(col, pm, vec2(0.62, -0.11), 0.15, 0.06, vec3(0.5, 0.33, 0.2), vec3(0.35, 0.5, 0.22), 0.25, hz, sun.x);
  vec2 pg = lay(hp, 1.0);
  if (pg.y < -0.18 + 0.01 * sin(pg.x * 4.0)) col = hotGround(pg);
  // the empty road winding in from the horizon
  { vec2 a = vec2(1.3, -0.18), b = vec2(0.35, -0.5); vec2 pa = pg - a, ba = b - a; float h = SAT(dot(pa, ba) / dot(ba, ba)); float dd = length(pa - ba * h) - mix(0.01, 0.07, h);
    if (dd < 0.0 && pg.y < -0.18) col = mix(col, vec3(0.96, 0.84, 0.62) * (0.95 + 0.05 * noise(pg * 80.0)), smoothstep(0.0, -0.01, dd)); }
  // the great oak of Mamre and its shade
  col *= 1.0 - 0.3 * smoothstep(0.35, 0.0, length((pg - vec2(-0.62, -0.26)) * vec2(0.8, 3.0)));
  oak(col, pg, vec2(-0.72, -0.24), 0.5, vec3(0.32, 0.5, 0.2), sun.x);
  LIGHT_TINT = mix(vec3(1.0, 0.95, 0.85), vec3(1.0, 0.88, 0.72), hot); RIM = 1.0; RIM_COL = vec3(1.0, 0.85, 0.55);
  openTent(col, pg, vec2(-0.42, -0.27), 0.38, vec3(0.55, 0.38, 0.3), 0.15);
  // Hashem's visit: warm light coming down on Avraham, sparkles, gentle rings
  vec2 apos = vec2(-0.02, -0.31);
  float bw = 0.05 + 0.05 * SAT(0.6 - pg.y); col += vec3(1.0, 0.95, 0.8) * smoothstep(bw, 0.0, abs(pg.x - apos.x)) * smoothstep(-0.45, 0.5, pg.y) * visit * (0.6 - 0.2 * hot);
  col += godRays(p, vec2(apos.x - CAM.x, 0.7), vec3(1.0, 0.92, 0.72), 0.45) * visit;
  col += sparkles(pg, uT, 0.3, 0.012, vec3(1.0, 0.92, 0.65)) * visit * smoothstep(0.3, 0.0, abs(pg.x - apos.x));
  float rr = fract(uT * 0.4); col += vec3(1.0, 0.85, 0.5) * smoothstep(0.01, 0.0, abs(length((pg - apos) * vec2(1.0, 4.0)) - rr * 0.45)) * (1.0 - rr) * visit * 0.6;
  // Avraham sits at the door, looking out for guests (left and right), shading his eyes in the heat
  Person A = avraham(); A.facing = 1.0; A.sit = 1.0; A.armF = vec2(0.6, 0.6); A.armB = vec2(-0.2, 0.3); A.look = 0.3;
  if (visit > 0.5) { A.look = 0.0; A.brow = 0.4; A.armF = vec2(1.1, 0.5); }
  if (hot > 0.5) { A.look = sin(uT * 1.3); A.armF = vec2(2.1, 1.7); A.brow = 0.3; }
  drawPerson(col, pg, apos, 0.42, A);
  lizard(col, pg, vec2(0.9 - fract(uT * 0.06) * 2.0, -0.42), 0.025, -1.0);
  fgGrass(col, lay(p, 1.5), uT, -0.7, vec3(0.62, 0.55, 0.3), 0.15);
  col += lensFlare(p, sun - CAM * 0.05, vec3(1.0, 0.8, 0.5)) * 0.6;
  return col;
}

// 34 — the three guests: travelers appear on the road; Avraham runs to them; water for their feet; a feast under the oak while Sarah bakes
vec3 sceneGuests(vec2 p, float lt) {
  float k = SAT(lt / max(uDur, 1.0)); float l1 = LS(1), l2 = LS(2);
  float appear = at(k, 0.06, 0.08); float run = smoothstep(0.16, l1, k); float feast = at(k, l2, 0.08);
  CAM = vec2(mix(mix(-0.35, 0.3, smoothstep(0.08, l1, k)), -0.35, smoothstep(l2 - 0.02, l2 + 0.12, k)), -0.1); CAMZ = 1.0;
  vec2 ps = lay(p, 0.05); vec2 sun = vec2(0.4, 0.36);
  vec3 col = skyGrad(ps, vec3(1.0, 0.9, 0.65), vec3(0.6, 0.78, 0.98), vec3(0.25, 0.48, 0.92));
  col += vec3(1.0, 0.9, 0.6) * exp(-length(ps - sun) * 2.2) * 0.8; col = mix(col, vec3(1.0, 0.98, 0.9) * 1.7, smoothstep(0.065, 0.058, length(ps - sun)));
  puffClouds(col, lay(p, 0.1), uT, 0.36, 0.5, 0.01, vec3(1.0), vec3(0.8, 0.82, 0.92), 211.0);
  vec3 hz = vec3(0.95, 0.88, 0.8);
  mountains(col, lay(p, 0.18), -0.02, 0.1, 1.4, 211.0, vec3(0.7, 0.6, 0.55), hz, 0.45, sun.x);
  vec2 pm = lay(p, 0.45); treeRow(col, pm, -0.11, 0.07, 0.13, 213.0, vec3(0.36, 0.52, 0.22), hz, 0.25, sun.x, 0.55);
  if (pm.y < -0.11) col = mix(hotGround(pm), grass(pm, vec3(0.45, 0.58, 0.25), vec3(0.62, 0.68, 0.3)), 0.4);
  flock(col, lay(p, 0.3), lt, vec2(-1.1, 0.24), vec2(0.09, 0.01), 5.0, 0.011, vec3(0.25, 0.18, 0.2));
  vec2 pg = lay(p, 1.0);
  if (pg.y < -0.18 + 0.01 * sin(pg.x * 4.0)) col = mix(hotGround(pg), grass(pg, vec3(0.45, 0.58, 0.24), vec3(0.62, 0.68, 0.3)), 0.45);
  { vec2 a = vec2(1.5, -0.18), b = vec2(0.5, -0.5); vec2 pa = pg - a, ba = b - a; float h = SAT(dot(pa, ba) / dot(ba, ba)); float dd = length(pa - ba * h) - mix(0.01, 0.08, h);
    if (dd < 0.0 && pg.y < -0.18) col = mix(col, vec3(0.96, 0.84, 0.62), smoothstep(0.0, -0.01, dd)); }
  col *= 1.0 - 0.3 * smoothstep(0.4, 0.0, length((pg - vec2(-0.25, -0.3)) * vec2(0.7, 3.0)));
  oak(col, pg, vec2(-0.3, -0.24), 0.52, vec3(0.32, 0.52, 0.2), sun.x);
  LIGHT_TINT = vec3(1.0, 0.96, 0.88); RIM = 0.9; RIM_COL = vec3(1.0, 0.85, 0.55);
  openTent(col, pg, vec2(-0.8, -0.27), 0.34, vec3(0.55, 0.38, 0.3), 0.15);
  // Sarah at the oven, baking (third line)
  oven(col, pg, vec2(-1.12, -0.3), 0.1);
  Person S = sarah(); S.facing = -1.0; S.armF = vec2(1.3 + 0.25 * sin(uT * 4.0) * feast, 0.6); S.armB = vec2(0.9, 0.7); S.look = -0.4; drawPerson(col, pg, vec2(-0.98, -0.32), 0.38, S);
  // the feast under the oak: a patterned cloth with bread, butter, milk and a platter
  PX = 1.5 / uRes.y;
  if (feast > 0.0) { vec2 cl = vec2(-0.32, -0.41); float cloth = sdBox2((pg - cl) * vec2(1.0, 2.2), vec2(0.22, 0.05));
    col = mix(col, vec3(0.75, 0.25, 0.25) * (0.85 + 0.15 * step(0.5, fract((pg.x - cl.x) * 25.0))) * LIGHT_TINT, smoothstep(0.003, -0.003, cloth) * feast);
    for (int i = 0; i < 3; i++) ink(col, sdE2(pg - cl - vec2(-0.15 + float(i) * 0.05, 0.012), vec2(0.022, 0.013)), vec3(0.88, 0.62, 0.3), pg * 9.0);
    ink(col, sdE2(pg - cl - vec2(0.03, 0.012), vec2(0.025, 0.014)), vec3(0.97, 0.95, 0.9), pg * 9.0); ink(col, sdE2(pg - cl - vec2(0.09, 0.012), vec2(0.022, 0.012)), vec3(0.98, 0.9, 0.55), pg * 9.0);
    ink(col, sdE2(pg - cl - vec2(0.16, 0.01), vec2(0.04, 0.012)), vec3(0.85, 0.85, 0.88), pg * 9.0); ink(col, sdE2(pg - cl - vec2(0.16, 0.022), vec2(0.03, 0.012)), vec3(0.72, 0.42, 0.28), pg * 9.0); }
  // the three travelers: on the road at first, then sitting at the feast
  for (int i = 0; i < 3; i++) { Person T = traveler(i); vec2 tp;
    if (feast < 0.5) { T.facing = -1.0; T.armF = vec2(0.3, 0.4); T.tool = 4; tp = vec2(0.62 + float(i) * 0.17, -0.33 - 0.01 * float(i % 2));
      float a = SAT(appear * 1.5 - float(i) * 0.25); if (a <= 0.0) continue; col += sparkles(pg, uT, 0.4, 0.012, vec3(1.0, 0.95, 0.8)) * (1.0 - a) * smoothstep(0.15, 0.0, length(pg - tp - vec2(0.0, 0.2)));
      if (a < 0.98) { vec3 c0 = col; drawPerson(col, pg, tp, 0.4, T); col = mix(c0, col, a); continue; }
      if (k > l1) { T.armF = vec2(0.8, 0.5); T.tool = 0; T.talk = 0.0; } }
    else { T.facing = 1.0; T.sit = 1.0; T.armF = vec2(0.9, 0.9); T.talk = 0.3 * step(0.5, fract(uT * 0.4 + float(i) * 0.33)); tp = vec2(-0.64 + float(i) * 0.15, -0.31 - 0.006 * float(i)); }
    drawPerson(col, pg, tp, 0.4, T); }
  col += sparkles(pg, uT, 0.12, 0.01, vec3(1.0, 0.95, 0.8)) * smoothstep(0.5, 0.0, length(pg - vec2(feast > 0.5 ? -0.38 : 0.7, -0.15))) * appear * 0.6;
  // Avraham: sitting, then springs up and runs to them; bows them in; brings water; then serves the feast himself
  Person A = avraham(); A.facing = 1.0; vec2 apos;
  if (k < 0.16) { A.sit = 1.0; A.armF = vec2(0.7, 0.6); A.brow = appear; apos = vec2(-0.6, -0.31); }
  else if (feast < 0.5) { float r = run; apos = vec2(mix(-0.6, 0.36, r), -0.33); A.walk = (r < 0.99) ? uT * 12.0 : 0.0; A.armF = r < 0.99 ? vec2(1.8, 0.4) : vec2(1.6 + 0.2 * sin(uT * 2.0), -0.1); A.armB = r < 0.99 ? vec2(-1.2, 0.5) : vec2(-1.4, -0.1); A.talk = r > 0.99 ? 0.7 : 0.0; A.look = 0.5;
    if (k > l1) { PX = 1.5 / uRes.y; vec2 bc = apos + vec2(0.12, 0.005); ink(col, max(sdE2(pg - bc, vec2(0.05, 0.022)), pg.y - bc.y - 0.012), vec3(0.6, 0.42, 0.28), pg * 9.0); col = mix(col, vec3(0.45, 0.7, 0.9), smoothstep(0.002, -0.002, sdE2(pg - bc - vec2(0.0, 0.01), vec2(0.04, 0.007)))); } }
  else { A.facing = -1.0; A.armF = vec2(1.4, 1.1); A.look = -0.3; A.talk = 0.4; apos = vec2(0.02, -0.34 + 0.01 * abs(sin(uT * 6.0))); }
  drawPerson(col, pg, apos, 0.42, A);
  if (feast > 0.5) { vec2 h = handPos(apos, 0.42, A); PX = 1.5 / uRes.y; ink(col, sdE2(pg - h - vec2(0.0, 0.012), vec2(0.06, 0.012)), vec3(0.85, 0.75, 0.45), pg * 9.0);
    ink(col, sdE2(pg - h - vec2(-0.015, 0.03), vec2(0.03, 0.017)), vec3(0.72, 0.42, 0.28), pg * 9.0); ink(col, sdE2(pg - h - vec2(0.03, 0.028), vec2(0.016, 0.012)), vec3(0.88, 0.62, 0.3), pg * 9.0); }
  butterflies(col, pg, uT, vec2(-0.3, -0.12), vec2(0.4, 0.08), 3.0, 0.013);
  fgGrass(col, lay(p, 1.5), uT, -0.7, vec3(0.45, 0.5, 0.22), 0.5);
  return col;
}

// 35 — Sarah laughs: the guests under the oak; Sarah at the tent door; a golden promise; a dream bubble with a baby
vec3 sceneLaugh(vec2 p, float lt) {
  float k = SAT(lt / max(uDur, 1.0)); float l1 = LS(1), l2 = LS(2); float promise = at(k, l1, 0.06); float laugh = at(k, l2, 0.06); float tooHard = at(k, l2 + 0.18, 0.08);
  CAM = vec2(mix(-0.1, 0.22, promise), -0.1 + 0.03 * laugh); CAMZ = mix(1.0, 0.82, laugh);
  vec2 ps = lay(p, 0.05); vec2 sun = vec2(-0.5, 0.36);
  vec3 col = skyGrad(ps, vec3(1.0, 0.9, 0.7), vec3(0.6, 0.78, 0.98), vec3(0.25, 0.48, 0.92));
  col += vec3(1.0, 0.9, 0.6) * exp(-length(ps - sun) * 2.2) * 0.7;
  puffClouds(col, lay(p, 0.1), uT, 0.35, 0.55, 0.012, vec3(1.0), vec3(0.8, 0.82, 0.93), 221.0);
  vec3 hz = vec3(0.92, 0.9, 0.88);
  mountains(col, lay(p, 0.18), -0.02, 0.1, 1.4, 221.0, vec3(0.65, 0.6, 0.58), hz, 0.45, sun.x);
  vec2 pm = lay(p, 0.45); treeRow(col, pm, -0.11, 0.07, 0.12, 223.0, vec3(0.36, 0.52, 0.22), hz, 0.25, sun.x, 0.6);
  if (pm.y < -0.11) col = mix(grass(pm, vec3(0.42, 0.58, 0.25), vec3(0.6, 0.7, 0.3)), hz, 0.15);
  vec2 pg = lay(p, 1.0);
  if (pg.y < -0.18) col = grass(pg, vec3(0.45, 0.6, 0.24), vec3(0.62, 0.7, 0.3));
  col *= 1.0 - 0.3 * smoothstep(0.4, 0.0, length((pg - vec2(-0.55, -0.3)) * vec2(0.7, 3.0)));
  oak(col, pg, vec2(-0.6, -0.24), 0.52, vec3(0.32, 0.52, 0.2), sun.x);
  LIGHT_TINT = vec3(1.0, 0.96, 0.9); RIM = 0.9; RIM_COL = vec3(1.0, 0.9, 0.65);
  vec2 tc = vec2(0.5, -0.27); openTent(col, pg, tc, 0.38, vec3(0.55, 0.38, 0.3), 0.35);
  for (int i = 0; i < 3; i++) { Person T = traveler(i); T.facing = 1.0; T.sit = 1.0; T.armF = vec2(0.9, 0.9); T.look = 0.5; if (i == 1) T.talk = (1.0 - promise) * 0.5 + promise * (1.0 - laugh) * 0.7; drawPerson(col, pg, vec2(-0.78 + float(i) * 0.13, -0.32), 0.4, T); }
  Person A = avraham(); A.facing = 1.0; A.armF = k < l1 ? vec2(1.5, 0.0) : vec2(0.6, 0.4); A.talk = k < l1 && k > 0.15 ? 0.6 : 0.0; A.look = 0.6; A.brow = promise * 0.6;
  drawPerson(col, pg, vec2(0.0, -0.33), 0.42, A);
  // Sarah at the tent door: listening, then laughing to herself
  vec2 spos = tc + vec2(0.04, -0.03 + 0.012 * abs(sin(uT * 9.0)) * laugh * (1.0 - tooHard));
  Person S = sarah(); S.facing = -1.0; S.look = -0.5; S.armF = vec2(0.5, 0.5); if (laugh > 0.5) { S.armF = vec2(2.0, 2.1); S.talk = 0.8 * (1.0 - tooHard); }
  drawPerson(col, pg, spos, 0.4, S);
  // the promise: a golden glow and sparkles around the tent
  col += vec3(1.0, 0.85, 0.5) * promise * 0.25 * exp(-length(pg - tc - vec2(0.0, 0.2)) * 3.5);
  col += sparkles(pg, uT, 0.35, 0.013, vec3(1.0, 0.9, 0.6)) * promise * smoothstep(0.45, 0.1, length(pg - tc - vec2(0.0, 0.2)));
  // the dream bubble above Sarah: a baby in a cradle
  float bub = laugh * (1.0 - smoothstep(0.92, 0.99, k));
  if (bub > 0.0) { vec2 bc = spos + vec2(-0.26, 0.5); vec2 br = vec2(0.15, 0.1) * bub; float bm = bubbleMask(pg, bc, br, spos + vec2(-0.03, 0.42));
    col = mix(col, vec3(0.3, 0.3, 0.4), smoothstep(0.006, 0.0, bm) * 0.8); col = mix(col, vec3(1.0, 0.99, 0.96), smoothstep(0.0, -0.006, bm));
    if (sdE2(pg - bc, br) < 0.0) { PX = 1.5 / uRes.y; vec2 cr = bc + vec2(0.0, -0.05) * bub; ink(col, max(sdE2(pg - cr, vec2(0.11, 0.05) * bub), pg.y - cr.y), vec3(0.7, 0.5, 0.3), (pg - cr) * 9.0);
      baby(col, pg, cr + vec2(0.0, 0.025) * bub, 0.08 * bub, 0.0); col += vec3(1.0, 0.85, 0.5) * twinkle(pg, bc + vec2(0.1, 0.06) * bub, 0.04) * (0.6 + 0.4 * sin(uT * 3.0)); } }
  col += vec3(1.0, 0.95, 0.8) * tooHard * 0.35 * smoothstep(0.12, 0.0, abs(pg.x - tc.x) - 0.03 * (0.6 - pg.y)) * smoothstep(-0.3, 0.6, pg.y);
  butterflies(col, pg, uT, vec2(0.2, -0.15), vec2(0.4, 0.08), 3.0, 0.013);
  fgGrass(col, lay(p, 1.5), uT, -0.7, vec3(0.4, 0.52, 0.2), 0.6);
  return col;
}

// 36 — Avraham prays for Sedom: a hilltop at dusk above the valley; dark clouds over Sedom and Amorah; Avraham in the light, praying (the overlay counts 50 … 10)
vec3 scenePrayer(vec2 p, float lt) {
  float k = SAT(lt / max(uDur, 1.0)); float l1 = LS(1); float pray = at(k, l1, 0.06);
  CAM = vec2(mix(0.35, -0.05, smoothstep(0.0, l1 + 0.05, k)), -0.1); CAMZ = mix(1.0, 0.9, smoothstep(l1, 1.0, k));
  vec2 ps = lay(p, 0.05); float dusk = smoothstep(0.0, 1.0, k);
  vec3 col = mix(skyGrad(ps, vec3(1.0, 0.6, 0.38), vec3(0.85, 0.5, 0.58), vec3(0.28, 0.25, 0.55)), skyGrad(ps, vec3(0.6, 0.35, 0.45), vec3(0.3, 0.22, 0.42), vec3(0.06, 0.06, 0.18)), dusk * 0.8);
  col += stars(ps, uT) * smoothstep(0.4, 1.0, k) * smoothstep(0.0, 0.3, ps.y);
  vec2 sun = vec2(-0.75, -0.06 - 0.08 * k); col += vec3(1.0, 0.6, 0.3) * exp(-length(ps - sun) * 3.0) * 0.7 * (1.0 - dusk * 0.6);
  vec3 hz = mix(vec3(0.9, 0.55, 0.5), vec3(0.4, 0.28, 0.4), dusk);
  mountains(col, lay(p, 0.15), 0.02, 0.1, 1.3, 231.0, mix(vec3(0.5, 0.36, 0.45), vec3(0.22, 0.16, 0.28), dusk), hz, 0.4, -0.7);
  // the valley far below with the two wicked cities, a heavy dark cloud and a red glow over them
  vec2 pv = lay(p, 0.4);
  if (pv.y < -0.06) col = mix(mix(vec3(0.42, 0.45, 0.28), vec3(0.28, 0.25, 0.3), dusk), hz, 0.35 * smoothstep(-0.3, -0.06, pv.y));
  for (int c = 0; c < 2; c++) { vec2 cc = vec2(0.45 + float(c) * 0.42, -0.1);
    for (int i = 0; i < 7; i++) { float x = cc.x - 0.1 + float(i) * 0.032; float hh = cc.y + 0.02 + 0.03 * hash1(float(i) * 9.0 + float(c)); if (abs(pv.x - x) < 0.014 && pv.y < hh && pv.y > cc.y - 0.03) col = mix(vec3(0.38, 0.25, 0.3), hz, 0.25); }
    col += vec3(1.0, 0.35, 0.2) * 0.12 * exp(-length((pv - cc) * vec2(1.0, 2.0)) * 8.0);
    vec2 cq = pv - cc - vec2(0.0, 0.17); float cl = 1e5; for (int b = 0; b < 5; b++) { float fb = float(b); cl = min(cl, length((cq - vec2(-0.12 + fb * 0.06, 0.02 * sin(fb * 2.0 + float(c)))) * vec2(1.0, 1.2)) - 0.055 - 0.02 * hash1(fb + float(c) * 5.0)); } cl = max(cl, -cq.y - 0.03) + 0.03 * (fbm(cq * 9.0 + vec2(uT * 0.08, 0.0)) - 0.5); float lit = SAT(0.5 + cq.y * 8.0 - 0.6 * fbm(cq * 12.0));
    col = mix(col, mix(vec3(0.16, 0.1, 0.18), vec3(0.42, 0.3, 0.42), lit), smoothstep(0.02, -0.02, cl) * 0.9); col += vec3(1.0, 0.4, 0.25) * 0.15 * smoothstep(0.0, -0.05, cl) * smoothstep(0.02, -0.06, cq.y); }
  // the hilltop where Avraham stands
  vec2 pg = lay(p, 1.0); float hill = -0.2 + 0.07 * exp(-pow((pg.x + 0.2) * 1.6, 2.0)) - 0.15 * smoothstep(0.2, 0.9, pg.x);
  if (pg.y < hill) col = mix(vec3(0.62, 0.5, 0.38), vec3(0.38, 0.32, 0.36), dusk) * (0.9 + 0.1 * noise(pg * 40.0));
  LIGHT_TINT = mix(vec3(1.0, 0.82, 0.7), vec3(0.75, 0.68, 0.85), dusk); RIM = 1.2; RIM_COL = vec3(1.0, 0.8, 0.55);
  vec2 apos = vec2(-0.2, -0.26);
  col += vec3(1.0, 0.92, 0.75) * (0.25 + 0.35 * pray) * smoothstep(0.1, 0.0, abs(pg.x - apos.x) - 0.03 * (0.6 - pg.y)) * smoothstep(-0.3, 0.6, pg.y);
  col += godRays(p, apos - CAM + vec2(0.0, 0.95), vec3(1.0, 0.9, 0.7), 0.35 + 0.3 * pray);
  col += sparkles(pg, uT, 0.25, 0.012, vec3(1.0, 0.9, 0.65)) * pray * smoothstep(0.25, 0.0, abs(pg.x - apos.x));
  Person A = avraham(); A.facing = 1.0; A.look = 0.4; A.armF = vec2(1.5, 0.3); A.armB = vec2(-0.3, 0.3);
  if (pray > 0.5) { A.armF = vec2(2.6 + 0.1 * sin(uT * 2.0), 0.15); A.armB = vec2(-2.5 - 0.1 * sin(uT * 2.0), -0.15); A.talk = 0.6; A.look = 0.0; }
  drawPerson(col, pg, apos, 0.44, A);
  col += fireflies(pg, uT, 0.1, vec3(1.0, 0.9, 0.5)) * dusk * step(pg.y, hill);
  fgGrass(col, lay(p, 1.5), uT, -0.7, mix(vec3(0.42, 0.42, 0.25), vec3(0.18, 0.16, 0.2), dusk), 0.2);
  return col;
}

// 37 — Sedom: Lot welcomes two travelers at the city gate; at dawn the malachim lead his family out; fire falls on the cities far behind; Lot's wife looks back
vec3 sceneSedom(vec2 p, float lt) {
  float k = SAT(lt / max(uDur, 1.0)); float l1 = LS(1), l2 = LS(2); float flee = at(k, l1, 0.04); float fire = at(k, l2, 0.06);
  float runT = max(0.0, lt - l1 * uDur);
  CAM = vec2(mix(0.15, -0.1 - runT * 0.05, flee), -0.1); CAMZ = mix(0.92, 1.0, flee);
  vec2 ps = lay(p, 0.05);
  vec3 eve = skyGrad(ps, vec3(0.95, 0.55, 0.4), vec3(0.55, 0.35, 0.5), vec3(0.15, 0.13, 0.32)); vec3 dawn = skyGrad(ps, vec3(1.0, 0.75, 0.55), vec3(0.75, 0.65, 0.75), vec3(0.35, 0.42, 0.72));
  vec3 red = skyGrad(ps, vec3(1.0, 0.45, 0.2), vec3(0.6, 0.18, 0.15), vec3(0.18, 0.06, 0.08));
  vec3 col = mix(mix(eve, dawn, flee), red, fire);
  col += stars(ps, uT) * (1.0 - flee) * smoothstep(0.1, 0.4, ps.y);
  vec3 hz = mix(mix(vec3(0.75, 0.48, 0.5), vec3(0.95, 0.75, 0.68), flee), vec3(0.85, 0.35, 0.22), fire);
  mountains(col, lay(p, 0.15), -0.02, 0.1, 1.4, 241.0, mix(vec3(0.42, 0.3, 0.38), vec3(0.35, 0.15, 0.15), fire), hz, 0.35, 0.6);
  // the city of Sedom: walls, a gate, flat roofs; far away to the right once they flee
  vec2 pc = lay(p, mix(0.9, 0.35, flee)); vec2 cg = vec2(0.45, -0.18);
  if (pc.x > cg.x - 0.55 && pc.x < cg.x + 0.6 && pc.y > cg.y - 0.02 && pc.y < cg.y + 0.2 + 0.08 * hash1(floor(pc.x * 20.0))) { float bx = floor(pc.x * 20.0);
    vec3 wc = mix(vec3(0.7, 0.55, 0.48), vec3(0.45, 0.2, 0.15), fire) * (0.85 + 0.15 * hash1(bx)); col = wc;
    if (fract(pc.x * 20.0) > 0.35 && fract(pc.x * 20.0) < 0.6 && fract(pc.y * 30.0) > 0.5 && pc.y > cg.y + 0.06) col = mix(vec3(1.0, 0.75, 0.4) * (1.0 - flee * 0.7), vec3(1.0, 0.45, 0.15) * 1.3, fire); }
  if (pc.x > cg.x - 0.6 && pc.x < cg.x + 0.65 && pc.y < cg.y + 0.11 && pc.y > cg.y - 0.02) col = mix(vec3(0.78, 0.62, 0.5), vec3(0.5, 0.22, 0.16), fire) * (0.9 + 0.1 * step(0.5, fract(pc.x * 50.0 + step(0.5, fract(pc.y * 40.0)) * 0.5)));
  if (abs(pc.x - cg.x) < 0.06 && pc.y < cg.y + 0.09 && pc.y > cg.y - 0.02) col = mix(vec3(0.3, 0.2, 0.16), vec3(1.0, 0.5, 0.2), fire * 0.5);
  if (fire > 0.0) { col += fireRain(pc, uT, cg.x - 0.6, cg.x + 0.65, fire) * step(cg.y - 0.03, pc.y);
    col += vec3(1.0, 0.45, 0.15) * fire * 0.5 * exp(-length((pc - cg - vec2(0.0, 0.08)) * vec2(0.7, 1.6)) * 3.0);
    vec2 sq = pc - cg - vec2(0.1 * sin(pc.y * 4.0 + uT * 0.5), 0.35); float smoke = smoothstep(0.5, 0.1, length(sq * vec2(0.9, 0.6)) + 0.2 * fbm(pc * 4.0 - vec2(0.0, uT * 0.3)));
    col = mix(col, vec3(0.2, 0.12, 0.12), smoke * fire * 0.7 * step(cg.y + 0.1, pc.y)); }
  vec2 pg = lay(p, 1.0);
  if (pg.y < -0.2) col = mix(mix(vec3(0.5, 0.42, 0.36), vec3(0.85, 0.7, 0.55), flee), vec3(0.6, 0.35, 0.25), fire) * (0.9 + 0.1 * noise(pg * 40.0));
  LIGHT_TINT = mix(mix(vec3(0.95, 0.75, 0.68), vec3(1.0, 0.9, 0.8), flee), vec3(1.0, 0.65, 0.45), fire); RIM = 1.0; RIM_COL = mix(vec3(1.0, 0.75, 0.5), vec3(1.0, 0.45, 0.2), fire);
  if (flee < 0.5) {   // evening at the gate: Lot welcomes the two travelers
    Person L = lotP(); L.facing = 1.0; L.armF = vec2(1.6, 0.0); L.armB = vec2(-1.3, 0.0); L.talk = 0.6; L.look = 0.5; drawPerson(col, pg, vec2(0.2, -0.33), 0.42, L);
    for (int i = 0; i < 2; i++) { Person T = traveler(i + 1); T.facing = -1.0; T.armF = vec2(0.4, 0.4); T.tool = 4; drawPerson(col, pg, vec2(0.48 + float(i) * 0.16, -0.335), 0.41, T); }
    col += sparkles(pg, uT, 0.1, 0.01, vec3(1.0, 0.95, 0.8)) * smoothstep(0.3, 0.0, length(pg - vec2(0.56, -0.15))); }
  else {              // fleeing: the malachim lead Lot and his family to the hills; Lot's wife looks back
    float ws = 11.0; vec2 base = vec2(-0.1 - runT * 0.05, -0.34);
    for (int i = 0; i < 2; i++) { Person T = traveler(i + 1); T.facing = -1.0; T.walk = uT * ws + float(i); T.armF = vec2(1.7, 0.2); T.armB = vec2(-1.0, 0.4); drawPerson(col, pg, base + vec2(-0.72 + float(i) * 0.17, 0.008 * float(i)), 0.41, T); }
    for (int i = 0; i < 2; i++) { Person D = womanP(float(i) * 3.0 + 11.0); D.facing = -1.0; D.walk = uT * ws + float(i) * 2.0; D.armF = vec2(1.0, 0.4); drawPerson(col, pg, base + vec2(-0.36 + float(i) * 0.16, 0.004 + 0.01 * abs(sin(uT * ws + float(i)))), 0.36, D); }
    Person L = lotP(); L.facing = -1.0; L.walk = uT * ws; L.armF = vec2(1.5, 0.3); L.armB = vec2(-1.0, 0.4); L.brow = 0.5; drawPerson(col, pg, base + vec2(0.0, 0.0), 0.41, L);
    // Lot's wife: running at the back; she stops and turns to look; she becomes a pillar of salt
    vec2 wpos = vec2(-0.1 - min(runT, (l2 + 0.12 - l1) * uDur) * 0.05 + 0.3, -0.34); float salt = at(k, l2 + 0.2, 0.1);
    if (salt < 1.0) { Person W = womanP(21.0); W.robe = vec3(0.55, 0.35, 0.5); bool turned = k > l2 + 0.12; W.facing = turned ? 1.0 : -1.0; W.walk = turned ? 0.0 : uT * ws + 1.5; W.armF = vec2(0.8, 0.4); W.look = turned ? 0.8 : -0.5; W.brow = turned ? 0.7 : 0.0;
      vec3 c0 = col; drawPerson(col, pg, wpos, 0.37, W); col = mix(col, c0, salt); }
    if (salt > 0.0) { PX = 1.5 / uRes.y; float pil = sdSeg2(pg, wpos, wpos + vec2(0.0, 0.33), 0.075, 0.045); pil = smin(pil, length(pg - wpos - vec2(0.0, 0.34)) - 0.05, 0.03);
      vec3 c0 = col; ink(col, pil, vec3(0.95, 0.96, 0.98) * (0.9 + 0.1 * noise(pg * 200.0)), (pg - wpos) * 9.0); col = mix(c0, col, salt);
      col += sparkles(pg, uT, 0.5, 0.008, vec3(1.0)) * salt * smoothstep(0.02, -0.02, pil); } }
  fgGrass(col, lay(p, 1.5), uT, -0.7, mix(vec3(0.35, 0.32, 0.25), vec3(0.4, 0.25, 0.18), fire), 0.0);
  return col;
}

// 38 — Yitzchak is born: a joyful tent with bunting, Sarah holding baby Yitzchak, the neighbours come laughing and singing; the bris; the great feast
vec3 sceneBirth(vec2 p, float lt) {
  float k = SAT(lt / max(uDur, 1.0)); float l1 = LS(1), l2 = LS(2); float crowd = at(k, l1, 0.08); float party = at(k, l2, 0.08);
  CAM = vec2(mix(0.0, 0.3, party), -0.1); CAMZ = mix(0.9, 1.0, crowd);
  vec2 ps = lay(p, 0.05); vec2 sun = vec2(-0.55, 0.36);
  vec3 col = skyGrad(ps, vec3(1.0, 0.92, 0.75), vec3(0.58, 0.8, 0.99), vec3(0.22, 0.5, 0.95));
  col += vec3(1.0, 0.92, 0.65) * exp(-length(ps - sun) * 2.2) * 0.7; col = mix(col, vec3(1.0, 0.98, 0.9) * 1.6, smoothstep(0.055, 0.048, length(ps - sun)));
  puffClouds(col, lay(p, 0.1), uT, 0.36, 0.55, 0.012, vec3(1.0), vec3(0.8, 0.84, 0.95), 251.0); puffClouds(col, lay(p, 0.16), uT, 0.2, 0.38, 0.018, vec3(1.0), vec3(0.82, 0.85, 0.95), 257.0);
  vec3 hz = vec3(0.88, 0.92, 0.97);
  mountains(col, lay(p, 0.18), -0.02, 0.1, 1.4, 251.0, vec3(0.6, 0.62, 0.62), hz, 0.42, sun.x);
  vec2 pm = lay(p, 0.45); treeRow(col, pm, -0.11, 0.07, 0.12, 253.0, vec3(0.32, 0.55, 0.22), hz, 0.22, sun.x, 0.7);
  if (pm.y < -0.11) col = mix(grass(pm, vec3(0.38, 0.6, 0.24), vec3(0.55, 0.72, 0.3)), hz, 0.15);
  flock(col, lay(p, 0.3), lt, vec2(-1.0, 0.18), vec2(0.12, 0.02), 7.0, 0.011, vec3(0.3, 0.2, 0.25));
  vec2 pg = lay(p, 1.0);
  if (pg.y < -0.18) col = grass(pg, vec3(0.42, 0.62, 0.22), vec3(0.6, 0.74, 0.3));
  oak(col, pg, vec2(-0.95, -0.24), 0.48, vec3(0.3, 0.55, 0.2), sun.x);
  LIGHT_TINT = vec3(1.0, 0.97, 0.9); RIM = 0.9; RIM_COL = vec3(1.0, 0.9, 0.65);
  vec2 tc = vec2(-0.5, -0.27); openTent(col, pg, tc, 0.34, vec3(0.55, 0.38, 0.3), 0.25);
  bunting(col, pg, vec2(-0.95, 0.1), vec2(-0.45, -0.06), 0.03); bunting(col, pg, vec2(-0.45, -0.06), vec2(0.4, 0.06), 0.06); bunting(col, pg, vec2(0.4, 0.06), vec2(1.1, 0.0), 0.05);
  for (int i = 0; i < 16; i++) { float fi = float(i); flower(col, pg, vec2(-1.0 + fi * 0.14 + 0.05 * hash1(fi), -0.45 - 0.05 * hash1(fi * 3.0)), 0.055, 0.65 + 0.35 * cos(6.28 * (hash1(fi * 5.0) + vec3(0.0, 0.33, 0.67)))); }
  // the feast table (third line), to the right
  PX = 1.5 / uRes.y; vec2 tb = vec2(0.55, -0.34);
  if (party > 0.0) { ink(col, sdBox2(pg - tb, vec2(0.32, 0.012)), vec3(0.97, 0.95, 0.9), pg * 9.0); ink(col, sdBox2(pg - tb - vec2(0.0, -0.035), vec2(0.31, 0.03)), vec3(0.95, 0.93, 0.88), pg * 9.0);
    for (int i = 0; i < 9; i++) { vec2 fp = tb + vec2(-0.27 + float(i) * 0.067, 0.03); vec3 fc = 0.6 + 0.4 * cos(6.28 * (float(i) * 0.19 + vec3(0.1, 0.4, 0.7)));
      if (i % 3 == 0) ink(col, sdE2(pg - fp, vec2(0.026, 0.017)), vec3(0.88, 0.62, 0.3), pg * 9.0); else if (i % 3 == 1) ink(col, sdE2(pg - fp - vec2(0.0, -0.008), vec2(0.028, 0.01)), fc, pg * 9.0); else ink(col, sdTrap(pg - fp - vec2(0.0, -0.018), 0.0, 0.035, 0.009, 0.015, 0.0), vec3(0.9, 0.75, 0.35), pg * 9.0); }
    for (int i = 0; i < 5; i++) { Person G = townsperson(float(i) + 120.0); if (i % 2 == 1) G = womanP(float(i) + 120.0); G.facing = i < 2 ? 1.0 : -1.0; G.sit = 1.0; G.armF = vec2(0.9 + 0.5 * sin(uT * 3.0 + float(i)), 0.8); G.talk = 0.5 * step(0.5, fract(uT * 0.5 + float(i) * 0.3));
      drawPerson(col, pg, tb + vec2(-0.3 + float(i) * 0.15, 0.05), 0.3, G); } }
  // the neighbours arrive laughing, children jumping, music in the air
  if (crowd > 0.0) { for (int i = 0; i < 6; i++) { float fi = float(i); vec2 gp = vec2(1.05 - (1.0 - crowd) * 0.6 - fi * 0.11 + 0.0, -0.33);
      if (party > 0.5) gp.x -= 0.65; if (party > 0.5 && i > 3) continue;
      if (i % 3 == 2) { Person K = kidP(fi + 10.0); K.facing = -1.0; K.armF = vec2(2.5, 0.2); K.armB = vec2(-2.3, 0.2); drawPerson(col, pg, gp + vec2(0.0, 0.04 * abs(sin(uT * 7.0 + fi))), 0.22, K); }
      else if (i % 3 == 1) { Person W = womanP(fi + 14.0); W.facing = -1.0; W.armF = vec2(2.0 + 0.3 * sin(uT * 5.0 + fi), 0.3); W.talk = 0.6; drawPerson(col, pg, gp, 0.36, W); }
      else { Person M = townsperson(fi + 50.0); M.facing = -1.0; M.armF = vec2(2.2 + 0.3 * sin(uT * 5.0 + fi), 0.3); M.armB = vec2(-1.5, 0.3); M.talk = 0.7; drawPerson(col, pg, gp + vec2(0.0, 0.01 * abs(sin(uT * 6.0 + fi))), 0.38, M); } } }
  notes(col, pg, uT, vec2(0.4, -0.05), vec2(0.9, 0.5), crowd);
  // Sarah with baby Yitzchak, Avraham beside her with arms raised in joy (at the feast, little Yitzchak stands beside them)
  vec2 spos = tc + vec2(0.32, -0.07); Person S = sarah(); S.facing = 1.0; S.armF = vec2(1.0, 1.4); S.armB = vec2(0.6, 1.2); S.look = 0.0; S.talk = 0.3 * crowd;
  drawPerson(col, pg, spos, 0.4, S);
  if (party < 0.5) baby(col, pg, spos + vec2(0.05, 0.22), 0.06, 0.25);
  else { Person Y = kidP(2.0); Y.robe = vec3(0.86, 0.55, 0.2); Y.wrap = vec3(0.97, 0.95, 0.9); Y.facing = 1.0; Y.armF = vec2(2.4, 0.2); drawPerson(col, pg, spos + vec2(0.13, -0.005 + 0.03 * abs(sin(uT * 6.0))), 0.22, Y); }
  col += sparkles(pg, uT, 0.35, 0.013, vec3(1.0, 0.9, 0.6)) * smoothstep(0.3, 0.05, length(pg - spos - vec2(0.05, 0.25)));
  Person A = avraham(); A.facing = 1.0; A.armF = vec2(2.5 + 0.15 * sin(uT * 4.0), 0.2); A.armB = vec2(-2.4 - 0.15 * sin(uT * 4.0), -0.2); A.talk = 0.7; A.look = 0.2;
  drawPerson(col, pg, spos + vec2(0.3, 0.005 + 0.02 * abs(sin(uT * 4.0))), 0.43, A);
  petals(col, p, uT, 0.6 + 0.4 * crowd);
  butterflies(col, pg, uT, vec2(0.0, -0.15), vec2(0.8, 0.12), 4.0, 0.014);
  fgGrass(col, lay(p, 1.5), uT, -0.7, vec3(0.38, 0.55, 0.2), 1.0);
  return col;
}

// 39 — the journey to Har HaMoriah: dawn, the donkey saddled; three days and nights fly past; a cloud of glory on the mountain; father and son walk on together
vec3 sceneMoriah(vec2 p, float lt) {
  float k = SAT(lt / max(uDur, 1.0)); float l1 = LS(1), l2 = LS(2), l3 = LS(3); float word = at(k, l1, 0.05) * (1.0 - at(k, l2, 0.05));
  float days = SAT((k - l2) / max(l3 - l2, 0.01)); float trip = at(k, l2, 0.03); float climb = at(k, l3, 0.05);
  float walkD = trip > 0.0 ? (lt - l2 * uDur) : 0.0; walkD = min(walkD, (l3 - l2) * uDur);
  CAM = vec2(walkD * 0.06 + climb * 0.2 * smoothstep(l3, 1.0, k), -0.1 + 0.08 * climb * smoothstep(l3, 1.0, k)); CAMZ = 1.0;
  // the sky: dawn at first; during the trip three days and nights go by; then a clear golden morning
  float ang = days * 3.0 * 2.0 * PI - PI * 0.5; float dayAmt = trip > 0.0 && days < 1.0 ? SAT(sin(ang + PI * 0.5) * 0.8 + 0.5) : 1.0; if (trip <= 0.0) dayAmt = 0.6 + 0.4 * k / max(l2, 0.01);
  vec2 ps = lay(p, 0.05);
  vec3 dayS = skyGrad(ps, vec3(1.0, 0.85, 0.62), vec3(0.6, 0.78, 0.98), vec3(0.25, 0.48, 0.92)); vec3 nightS = skyGrad(ps, vec3(0.15, 0.14, 0.32), vec3(0.06, 0.07, 0.2), vec3(0.02, 0.02, 0.08));
  vec3 dawnS = skyGrad(ps, vec3(1.0, 0.65, 0.42), vec3(0.85, 0.6, 0.68), vec3(0.28, 0.32, 0.62));
  vec3 col = trip > 0.0 && days < 1.0 ? mix(nightS, dayS, dayAmt) : (trip > 0.0 ? dayS : mix(dawnS, dayS, SAT(k / max(l2, 0.01)) * 0.6));
  col += stars(ps, uT) * (1.0 - dayAmt) * smoothstep(0.0, 0.3, ps.y);
  vec2 sun = trip > 0.0 && days < 1.0 ? vec2(cos(ang + PI * 0.5) * -0.8, -0.15 + 0.5 * sin(ang + PI * 0.5)) : vec2(-0.7, 0.0 + 0.15 * k);
  col += vec3(1.0, 0.85, 0.55) * exp(-length(ps - sun) * 2.5) * 0.8 * SAT(dayAmt + 0.2); col = mix(col, vec3(1.0, 0.95, 0.85) * 1.6, smoothstep(0.055, 0.048, length(ps - sun)) * step(-0.1, sun.y));
  puffClouds(col, lay(p, 0.1), uT * (1.0 + 30.0 * trip * (1.0 - days)), 0.35, 0.5, 0.01, mix(vec3(0.4, 0.4, 0.55), vec3(1.0), dayAmt), mix(vec3(0.2, 0.2, 0.32), vec3(0.8, 0.82, 0.92), dayAmt), 261.0);
  vec3 hz = mix(vec3(0.2, 0.2, 0.32), vec3(0.88, 0.88, 0.92), dayAmt);
  mountains(col, lay(p, 0.18), -0.02, 0.1, 1.4, 261.0, mix(vec3(0.12, 0.12, 0.2), vec3(0.6, 0.58, 0.6), dayAmt), hz, 0.4, sun.x);
  // Har HaMoriah with a glowing cloud resting on its peak
  vec2 pm = lay(p, 0.35); vec2 mt = vec2(0.95, -0.1); float mh = mt.y + 0.38 - abs(pm.x - mt.x) * 0.9 + 0.02 * noise(vec2(pm.x * 20.0, 3.0));
  float seeMt = smoothstep(0.6, 1.0, days) + climb;
  if (pm.y < mh && pm.y > -0.2) col = mix(col, mix(vec3(0.5, 0.48, 0.42), vec3(0.62, 0.6, 0.5), step(mt.x, pm.x)) * mix(0.35, 1.0, dayAmt), SAT(seeMt * 2.0));
  { vec2 cq = pm - vec2(mt.x, mh * 0.0 + mt.y + 0.4); float cl = length(cq * vec2(1.0, 2.2)) - 0.12 - 0.03 * fbm(cq * 10.0 + uT * 0.2); float on = SAT(seeMt);
    col = mix(col, vec3(1.0, 0.97, 0.88), smoothstep(0.03, -0.02, cl) * on * 0.9); col += vec3(1.0, 0.9, 0.6) * on * 0.35 * exp(-length(cq * vec2(1.0, 1.8)) * 5.0);
    col += sparkles(pm, uT, 0.3, 0.01, vec3(1.0, 0.95, 0.75)) * on * smoothstep(0.25, 0.0, length(cq * vec2(1.0, 1.8))); }
  vec2 pg = lay(p, 1.0); float slope = -0.2 + 0.12 * smoothstep(0.6, 1.6, pg.x);
  if (pg.y < slope) col = mix(hotGround(pg), grass(pg, vec3(0.42, 0.55, 0.22), vec3(0.58, 0.66, 0.28)), 0.4) * mix(0.35, 1.0, dayAmt);
  LIGHT_TINT = mix(vec3(0.55, 0.55, 0.8), vec3(1.0, 0.95, 0.88), dayAmt); RIM = 0.9; RIM_COL = vec3(1.0, 0.85, 0.6);
  // Hashem's words (second line): a beam of light on Avraham at his tent
  if (trip <= 0.0) { openTent(col, pg, vec2(-0.72, -0.27), 0.34, vec3(0.55, 0.38, 0.3), 0.4);
    vec2 ap = vec2(-0.15, -0.33); col += vec3(1.0, 0.95, 0.8) * word * 0.5 * smoothstep(0.1, 0.0, abs(pg.x - ap.x) - 0.03 * (0.6 - pg.y)) * smoothstep(-0.3, 0.6, pg.y);
    col += sparkles(pg, uT, 0.3, 0.012, vec3(1.0, 0.92, 0.65)) * word * smoothstep(0.25, 0.0, abs(pg.x - ap.x));
    drawDonkey(col, pg, vec2(0.35, -0.335), 0.18, 0.0, -1.0, vec3(0.6, 0.4, 0.25)); woodBundle(col, pg, vec2(0.33, -0.21), 0.05);
    for (int i = 0; i < 2; i++) { Person N = townsperson(float(i) * 7.0 + 140.0); N.facing = -1.0; N.armF = vec2(0.8, 0.6); drawPerson(col, pg, vec2(0.62 + float(i) * 0.15, -0.33), 0.37, N); }
    Person Y = yitzchakP(); Y.facing = 1.0; Y.armF = vec2(0.5, 0.4); Y.look = 0.3; drawPerson(col, pg, vec2(0.1, -0.335), 0.42, Y);
    Person A = avraham(); A.facing = 1.0; A.look = word > 0.5 ? 0.0 : 0.4; A.brow = word * 0.5; A.armF = word > 0.5 ? vec2(1.2, 0.4) : vec2(0.5, 0.4); drawPerson(col, pg, ap, 0.43, A); }
  else if (climb < 0.5) {   // the three days: everyone walks, the world flies past
    vec2 base = vec2(CAM.x, 0.0); float wph = uT * 6.0;
    for (int i = 0; i < 2; i++) { Person N = townsperson(float(i) * 7.0 + 140.0); N.facing = 1.0; N.walk = wph + float(i); N.tool = 4; N.armF = vec2(0.5, 0.4); drawPerson(col, pg, base + vec2(-0.75 + float(i) * 0.14, -0.33), 0.37, N); }
    drawDonkey(col, pg, base + vec2(-0.4, -0.34), 0.18, wph, 1.0, vec3(0.6, 0.4, 0.25)); woodBundle(col, pg, base + vec2(-0.42, -0.215), 0.05);
    Person Y = yitzchakP(); Y.facing = 1.0; Y.walk = wph + 1.0; Y.armF = vec2(0.4, 0.4); drawPerson(col, pg, base + vec2(-0.1, -0.335), 0.42, Y);
    Person A = avraham(); A.facing = 1.0; A.walk = wph; A.tool = 4; A.armF = vec2(0.6, 0.4); A.look = 0.4; A.brow = smoothstep(0.6, 1.0, days) * 0.6; drawPerson(col, pg, base + vec2(0.12, -0.34), 0.43, A); }
  else {                    // the last part: father and son walk up together, Yitzchak with the wood, Avraham with the fire
    float up = smoothstep(l3, 1.0, k); vec2 base = vec2(0.85 + up * 0.35, -0.34 + up * 0.06);
    drawDonkey(col, pg, vec2(0.45, -0.34), 0.18, 0.0, 1.0, vec3(0.6, 0.4, 0.25));
    for (int i = 0; i < 2; i++) { Person N = townsperson(float(i) * 7.0 + 140.0); N.facing = 1.0; N.armF = vec2(0.6, 0.4); N.look = 0.5; drawPerson(col, pg, vec2(0.22 + float(i) * 0.12, -0.335), 0.37, N); }
    Person Y = yitzchakP(); Y.facing = 1.0; Y.walk = uT * 5.0 + 1.0; Y.armF = vec2(0.9, 1.2); Y.look = -0.4; Y.talk = k < l3 + 0.12 ? 0.6 : 0.0;
    vec2 yp = base + vec2(-0.2, -0.01); drawPerson(col, pg, yp, 0.42, Y); woodBundle(col, pg, yp + vec2(-0.06, 0.25), 0.06);
    Person A = avraham(); A.facing = 1.0; A.walk = uT * 5.0; A.armF = vec2(0.9, 0.5); A.look = -0.4; A.talk = (k > l3 + 0.12 && k < l3 + 0.22) ? 0.6 : 0.0;
    drawPerson(col, pg, base, 0.43, A); firePot(col, pg, handPos(base, 0.43, A)); }
  fgGrass(col, lay(p, 1.5), uT, -0.7, mix(vec3(0.12, 0.13, 0.2), vec3(0.45, 0.48, 0.22), dayAmt), 0.3);
  return col;
}

// 40 — the akeidah: the mountaintop above the clouds; the mizbe'ach; Yitzchak sits on it calmly; a burst of light (the malach's call); the ram caught in the bush
vec3 sceneAkeidah(vec2 p, float lt) {
  float k = SAT(lt / max(uDur, 1.0)); float l1 = LS(1), l2 = LS(2); float call = at(k, l1, 0.03); float ram = at(k, l2, 0.06);
  CAM = vec2(mix(0.1, -0.05, call) - 0.2 * ram, -0.1); CAMZ = mix(1.0, 0.9, smoothstep(0.0, l1, k)) + 0.08 * call;
  vec2 ps = lay(p, 0.05);
  vec3 col = skyGrad(ps, vec3(1.0, 0.88, 0.7), vec3(0.7, 0.82, 0.98), vec3(0.32, 0.5, 0.92));
  col = mix(col, vec3(1.0, 0.97, 0.9), call * 0.35 * smoothstep(-0.2, 0.5, ps.y));
  col += godRays(p, vec2(0.1, 0.75) - CAM * 0.05, vec3(1.0, 0.95, 0.8), 0.3 + 1.0 * call);
  vec2 src = vec2(0.1, 0.62) - CAM * 0.05; col += vec3(1.0, 0.95, 0.85) * call * (0.6 * exp(-length(p - src) * 2.5) + 0.25 * sin(SAT((k - l1) * 10.0) * PI) );
  // a sea of clouds below the summit
  vec2 pc = lay(p, 0.25); float sea = -0.12 + 0.025 * sin(pc.x * 7.0 + uT * 0.2) + 0.02 * fbm(vec2(pc.x * 5.0, uT * 0.05));
  if (pc.y < sea) col = mix(vec3(1.0, 0.98, 0.95), vec3(0.85, 0.85, 0.92), SAT((sea - pc.y) * 6.0)) * (0.95 + 0.08 * fbm(pc * 6.0));
  puffClouds(col, lay(p, 0.12), uT, 0.32, 0.55, 0.008, vec3(1.0), vec3(0.85, 0.86, 0.95), 271.0);
  vec2 pg = lay(p, 1.0); float top = -0.2 + 0.04 * exp(-pg.x * pg.x * 3.0) - 0.25 * smoothstep(0.5, 1.2, abs(pg.x));
  if (pg.y < top) col = mix(vec3(0.62, 0.55, 0.45), vec3(0.5, 0.6, 0.35), smoothstep(-0.3, -0.2, pg.y) * 0.5) * (0.9 + 0.1 * noise(pg * 40.0));
  LIGHT_TINT = mix(vec3(1.0, 0.96, 0.9), vec3(1.0, 0.98, 0.95), call); RIM = 1.0 + call; RIM_COL = vec3(1.0, 0.95, 0.8);
  // the ram in the thorn bush (third line)
  if (ram > 0.0) { vec2 bp = vec2(-0.6, -0.33); thornBush(col, pg, bp + vec2(0.07, 0.0), 0.22, 1.0); drawRam(col, pg, bp + vec2(0.0, -0.01), 0.24, 1.0, 0.0);
    PX = 1.5 / uRes.y; for (int i = 0; i < 3; i++) { vec2 a = bp + vec2(0.02 + float(i) * 0.04, 0.12); col = mix(col, vec3(0.35, 0.24, 0.15), smoothstep(PX, -PX, sdSeg2(pg, a, a + vec2(0.04, 0.05), 0.004, 0.002))); }
    col += sparkles(pg, uT, 0.3, 0.01, vec3(1.0, 0.95, 0.8)) * ram * smoothstep(0.2, 0.0, length(pg - bp - vec2(0.0, 0.08))); }
  // the mizbe'ach: stones with wood on top
  vec2 m = vec2(0.12, -0.33); PX = 1.5 / uRes.y;
  for (int r = 0; r < 3; r++) for (int c = 0; c < 5 - r; c++) { vec2 sc = m + vec2((float(c) - (4.0 - float(r)) * 0.5) * 0.06, 0.015 + float(r) * 0.04); ink(col, sdBox2(pg - sc, vec2(0.028, 0.018)) - 0.004, vec3(0.72, 0.68, 0.62) * (0.9 + 0.1 * hash1(float(r * 5 + c))), (pg - sc) * 9.0); }
  vec2 wt = m + vec2(0.0, 0.135); for (int i = 0; i < 3; i++) ink(col, sdCap2(pg, wt + vec2(-0.12, float(i) * 0.016), wt + vec2(0.12, float(i) * 0.016), 0.009), vec3(0.6, 0.4, 0.22), (pg - wt) * 9.0);
  // Yitzchak sits calmly on the mizbe'ach; after the call he stands and they hug
  Person Y = yitzchakP(); Y.facing = -1.0; Y.blink = call > 0.5 ? Y.blink : 0.1; Y.armF = vec2(0.5, 0.9); Y.armB = vec2(0.3, 0.8);
  Person A = avraham(); A.facing = 1.0; A.look = 0.0; A.armF = vec2(2.6, 0.1); A.armB = vec2(-0.3, 0.3); A.brow = 0.3;
  vec2 apos = vec2(-0.2, -0.335);
  if (ram < 0.5) { Y.sit = 1.0; drawPerson(col, pg, wt + vec2(0.0, 0.03), 0.38, Y);
    if (call > 0.5) { A.armF = vec2(1.2, 0.6); A.armB = vec2(-1.8, 0.0); A.brow = 0.9; A.look = 0.2; Y.blink = 1.0; }
    drawPerson(col, pg, apos, 0.43, A); }
  else { Y.facing = -1.0; Y.blink = blinkAt(0.37); Y.armF = vec2(1.3, 1.0); Y.armB = vec2(-0.6, 0.4); Y.talk = 0.0; drawPerson(col, pg, vec2(0.02, -0.335), 0.42, Y);
    A.facing = 1.0; A.armF = vec2(1.3, 1.0); A.armB = vec2(-0.3, 0.3); A.look = -0.6; A.brow = 0.0; drawPerson(col, pg, vec2(-0.13, -0.34), 0.43, A); }
  col += sparkles(pg, uT, 0.35, 0.013, vec3(1.0, 0.92, 0.7)) * call * smoothstep(0.5, 0.1, length(pg - vec2(0.0, -0.1)));
  float rr = SAT((k - l1) * 5.0); col += vec3(1.0, 0.9, 0.6) * smoothstep(0.02, 0.0, abs(length(pg - vec2(0.0, -0.05)) - rr * 0.9)) * (1.0 - rr) * call;
  fgGrass(col, lay(p, 1.5), uT, -0.7, vec3(0.45, 0.5, 0.25), 0.4);
  return col;
}

// 41 — the blessing: night over the seashore — stars beyond counting above, sand sparkling below; then dawn spreads over a world full of families
vec3 sceneBlessing(vec2 p, float lt) {
  float k = SAT(lt / max(uDur, 1.0)); float l1 = LS(1), l2 = LS(2); float more = smoothstep(0.05, 0.4, k); float world = at(k, l1, 0.1); float tease = at(k, l2, 0.1);
  CAM = vec2(0.0, -0.1 + 0.25 * tease); CAMZ = mix(1.05, 0.95, k);
  vec2 ps = lay(p, 0.3);
  vec3 nite = skyGrad(ps, vec3(0.18, 0.14, 0.34), vec3(0.07, 0.08, 0.24), vec3(0.02, 0.025, 0.09)); vec3 dawn = skyGrad(ps, vec3(1.0, 0.72, 0.45), vec3(0.95, 0.62, 0.62), vec3(0.35, 0.38, 0.75));
  vec3 col = mix(nite, dawn, world);
  float band = exp(-pow((ps.y - 0.25 - ps.x * 0.3) * 4.0, 2.0)); col += mix(vec3(0.45, 0.4, 0.9), vec3(0.95, 0.5, 0.75), fbm(ps * 2.0)) * band * pow(fbm(ps * vec2(3.0, 6.0)), 2.0) * 0.8 * (1.0 - world);
  col += (stars(ps, uT) * 1.5 + stars(ps * 1.7 + 3.0, uT) * (0.8 + 1.5 * more) + stars(ps * 2.9 + 7.0, uT) * more * 1.8 + shootingStar(ps, uT, 2.8, 31.0)) * (1.0 - world * 0.85);
  vec2 sun = vec2(0.3, -0.12 + 0.18 * world); col += vec3(1.0, 0.75, 0.42) * exp(-length(ps - sun) * 2.2) * world; col += godRays(p, sun - CAM * 0.3, vec3(1.0, 0.82, 0.55), 0.6) * world;
  // the sea, then the sand
  vec2 pg = lay(p, 1.0); float shore = -0.25 + 0.015 * sin(pg.x * 6.0 + uT * 0.8);
  if (pg.y < -0.1 && pg.y > shore) { col = water(pg, uT, mix(vec3(0.05, 0.08, 0.2), vec3(0.2, 0.4, 0.6), world), mix(vec3(0.1, 0.15, 0.3), vec3(0.55, 0.7, 0.8), world), mix(vec3(0.12, 0.12, 0.3), vec3(1.0, 0.75, 0.55), world), -0.1, shore);
    col += mix(vec3(0.8, 0.85, 1.0) * 0.3, vec3(1.0, 0.9, 0.7) * 0.5, world) * smoothstep(0.01, 0.0, abs(pg.y - shore - 0.012 - 0.008 * sin(pg.x * 20.0 - uT * 2.0))); }
  if (pg.y <= shore) { col = mix(vec3(0.3, 0.27, 0.35), vec3(0.98, 0.85, 0.62), world * 0.85 + 0.15) * (0.92 + 0.08 * noise(pg * vec2(60.0, 200.0)));
    vec2 sg = pg * vec2(160.0, 260.0); vec2 sid = floor(sg); float sh = hash(sid); col += vec3(1.0, 0.95, 0.85) * step(0.97, sh) * smoothstep(0.35, 0.0, length(fract(sg) - 0.5)) * (0.5 + 0.5 * sin(uT * 4.0 + sh * 60.0)) * (0.4 + 1.2 * more); }
  LIGHT_TINT = mix(vec3(0.62, 0.64, 0.95), vec3(1.0, 0.9, 0.78), world); RIM = 1.2; RIM_COL = mix(vec3(0.7, 0.78, 1.0), vec3(1.0, 0.8, 0.5), world);
  // families all along the shore at dawn (the children of Avraham)
  if (world > 0.0) for (int i = 0; i < 8; i++) { float fi = float(i); float a = SAT(world * 2.0 - fi * 0.1); if (a <= 0.0) continue; vec2 fp = vec2(0.1 + fi * 0.11, -0.3 - 0.01 * float(i % 2));
    vec3 c0 = col; if (i % 3 == 2) { Person K = kidP(fi + 60.0); K.facing = -1.0; K.armF = vec2(2.3, 0.2); drawPerson(col, pg, fp + vec2(0.0, 0.02 * abs(sin(uT * 6.0 + fi))), 0.17, K); }
    else if (i % 3 == 1) { Person W = womanP(fi + 60.0); W.facing = -1.0; W.armF = vec2(1.5, 0.4); drawPerson(col, pg, fp, 0.27, W); }
    else { Person M = townsperson(fi + 160.0); M.facing = -1.0; M.armF = vec2(1.8, 0.3); drawPerson(col, pg, fp, 0.28, M); } col = mix(c0, col, a); }
  Person Y = yitzchakP(); Y.facing = 1.0; Y.look = 0.3; Y.armF = vec2(2.3 + 0.1 * sin(uT * 2.0), 0.2); drawPerson(col, pg, vec2(-0.55, -0.33), 0.4, Y);
  Person A = avraham(); A.facing = 1.0; A.look = 0.2; A.armF = vec2(2.6, 0.15); A.armB = vec2(-2.4, -0.2); if (world > 0.5) { A.armF = vec2(1.6, 0.2); A.armB = vec2(-0.3, 0.3); }
  drawPerson(col, pg, vec2(-0.35, -0.335), 0.43, A);
  col += sparkles(pg, uT, 0.2, 0.012, vec3(1.0, 0.9, 0.65)) * world;
  petals(col, p, uT, tease * 0.5);
  fgGrass(col, lay(p, 1.5), uT, -0.72, mix(vec3(0.12, 0.13, 0.2), vec3(0.6, 0.55, 0.3), world), 0.0);
  return col;
}
