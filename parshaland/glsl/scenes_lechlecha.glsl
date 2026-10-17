// ── SCENES (Lech Lecha) ─────────────────────────────────────────────────────
// Content rules: Hashem only as light. Sarai/Sarah and Hagar are never drawn. The war is shown without violence (a night chase, the captives freed).
Person avram() { Person P = defaultPerson(); P.robe = vec3(0.55, 0.18, 0.22); P.trim = vec3(0.92, 0.82, 0.55); P.beard = vec3(0.72, 0.68, 0.62); P.beardLen = 0.8;
  P.wrap = vec3(0.95, 0.92, 0.85); P.skin = vec3(0.9, 0.7, 0.55); P.blink = blinkAt(0.05); return P; }
Person lotP() { Person P = defaultPerson(); P.robe = vec3(0.3, 0.5, 0.4); P.trim = vec3(0.82, 0.72, 0.45); P.beard = vec3(0.35, 0.22, 0.1); P.beardLen = 0.35;
  P.wrap = vec3(0.75, 0.68, 0.5); P.blink = blinkAt(0.45); return P; }
Person eliezer() { Person P = defaultPerson(); P.robe = vec3(0.45, 0.4, 0.62); P.trim = vec3(0.85, 0.8, 0.65); P.beard = vec3(0.12, 0.08, 0.05); P.beardLen = 0.3;
  P.wrap = vec3(0.88, 0.85, 0.78); P.skin = vec3(0.76, 0.55, 0.4); P.blink = blinkAt(0.71); return P; }
Person malki() { Person P = defaultPerson(); P.robe = vec3(0.95, 0.93, 0.88); P.trim = vec3(0.92, 0.75, 0.3); P.beard = vec3(0.97, 0.97, 0.95); P.beardLen = 1.0;
  P.wrap = vec3(0.98, 0.96, 0.9); P.blink = blinkAt(0.29); return P; }
// where the front hand is, in screen space (matches drawPerson's arm)
vec2 handPos(vec2 pos, float h, Person P) { vec2 el; vec2 hq = armPoint(vec2(0.105, 0.56), P.armF, 0.17, 0.16, el); return pos + vec2(hq.x * P.facing, hq.y) * h; }
void torch(inout vec3 col, vec2 p, vec2 hand) {
  PX = 1.5 / uRes.y; ink(col, sdCap2(p, hand - vec2(0.0, 0.03), hand + vec2(0.0, 0.07), 0.008), vec3(0.45, 0.3, 0.15), p * 9.0);
  vec2 fq = (p - hand - vec2(0.0, 0.085)) / 0.05; col += flame(fq, uT, hand.x * 9.0) * 1.6; col += vec3(1.0, 0.6, 0.25) * 0.5 * exp(-length(p - hand - vec2(0.0, 0.09)) * 9.0); }
// a camel (optionally laden with packs), feet at pos, facing +x
void drawCamel(inout vec3 col, vec2 p, vec2 pos, float h, float ph, float facing, bool laden) {
  vec2 q = (p - pos) / h; q.x *= facing; PX = 1.5 / (uRes.y * h); if (abs(q.x) > 0.9 || q.y < -0.05 || q.y > 1.3) return;
  vec3 c = vec3(0.78, 0.6, 0.38); float s1 = sin(ph), s2 = sin(ph + PI);
  leg(col, q, vec2(-0.3, 0.52), 0.52, s2, 0.04, c * 0.8); leg(col, q, vec2(0.22, 0.52), 0.52, s1, 0.04, c * 0.8);
  float body = sdE2(q - vec2(-0.04, 0.62), vec2(0.38, 0.13));
  body = smin(body, sdE2(q - vec2(-0.06, 0.8), vec2(0.17, 0.17)), 0.1);                                   // the hump
  float neck = sdSeg2(q, vec2(0.3, 0.64), vec2(0.5, 1.02), 0.08, 0.05);
  float head = smin(sdE2(q - vec2(0.6, 1.05), vec2(0.13, 0.065)), sdE2(q - vec2(0.52, 1.1), vec2(0.06, 0.05)), 0.04);
  ink(col, min(min(body, neck), head), c, q);
  ink(col, sdE2(q - vec2(0.5, 1.15), vec2(0.018, 0.028)), c * 0.9, q);                                    // ear
  leg(col, q, vec2(-0.24, 0.52), 0.52, s1, 0.045, c); leg(col, q, vec2(0.28, 0.52), 0.52, s2, 0.045, c);
  eye(col, q, vec2(0.62, 1.07), 0.016); col = mix(col, vec3(0.2, 0.12, 0.08), smoothstep(PX, -PX, length(q - vec2(0.72, 1.03)) - 0.01));
  if (laden) { ink(col, max(sdE2(q - vec2(-0.06, 0.82), vec2(0.21, 0.2)), 0.82 - q.y - 0.12) , vec3(0.75, 0.2, 0.22) * (0.85 + 0.15 * step(0.5, fract(q.x * 12.0))), q);   // striped saddle blanket over the hump
    ink(col, sdBox2(q - vec2(-0.3, 0.66), vec2(0.06, 0.06)) - 0.015, vec3(0.3, 0.45, 0.62), q); ink(col, sdBox2(q - vec2(0.17, 0.66), vec2(0.06, 0.06)) - 0.015, vec3(0.85, 0.68, 0.32), q); }
}
vec3 desertGround(vec2 p) { return mix(vec3(0.86, 0.7, 0.48), vec3(0.74, 0.56, 0.36), fbm(p * vec2(3.0, 12.0))) * (0.9 + 0.12 * noise(p * 120.0)); }

// 24 — Hashem's call: dawn over Charan, a column of light; Avram listens, then turns to go
vec3 sceneCall(vec2 p, float lt) {
  float k = SAT(lt / max(uDur, 1.0)); vec2 sun = vec2(-0.55, 0.05);
  vec3 col = skyGrad(p, vec3(1.0, 0.72, 0.5), vec3(0.75, 0.62, 0.78), vec3(0.28, 0.32, 0.65));
  col += vec3(1.0, 0.8, 0.55) * exp(-length(p - sun) * 3.0) * 0.6; col = clouds2D(p, col, vec3(1.0, 0.85, 0.75), vec3(0.6, 0.5, 0.65), 0.25, sun, uT);
  vec3 hz = vec3(0.9, 0.75, 0.75); mountains(col, p, -0.02, 0.1, 1.6, 101.0, vec3(0.55, 0.45, 0.55), hz, 0.45, sun.x);
  // Charan: a small walled town in the distance
  for (int i = 0; i < 9; i++) { float x = -0.85 + float(i) * 0.06; float hh = -0.08 + 0.04 * hash1(float(i) * 3.0); if (abs(p.x - x) < 0.026 && p.y < hh && p.y > -0.16) col = mix(vec3(0.75, 0.58, 0.48), hz, 0.35) * (0.85 + 0.2 * step(0.0, x - p.x)); }
  if (p.y < -0.16) col = desertGround(p);
  float beam = smoothstep(0.16, 0.0, abs(p.x - 0.15) - 0.03 * (0.6 - p.y)) * smoothstep(-0.5, 0.6, p.y);
  col += vec3(1.0, 0.95, 0.8) * beam * 0.55 * (0.85 + 0.15 * sin(uT * 2.0)); col += motes(p, uT, 0.03, 0.1, vec3(1.0, 0.9, 0.6) * 0.5 * beam, 0.04);
  LIGHT_TINT = vec3(1.0, 0.92, 0.85); RIM = 1.0; RIM_COL = vec3(1.0, 0.95, 0.8);
  // Avram's tent
  vec2 tq = p - vec2(-0.45, -0.28); PX = 1.5 / uRes.y; ink(col, max(abs(tq.x) - 0.22 + tq.y * 0.8, max(-tq.y, tq.y - 0.22)), vec3(0.66, 0.48, 0.32) * (0.9 + 0.1 * sin(tq.x * 70.0)), tq * 3.0);
  Person A = avram(); float go = smoothstep(0.75, 0.85, k); A.facing = go > 0.5 ? 1.0 : -1.0; A.look = 0.0; A.armF = vec2(0.4 + 0.6 * (1.0 - go), 0.3); A.armB = vec2(-0.2, 0.3);
  A.tool = go > 0.5 ? 4 : 0; A.walk = go * uT * 5.0;
  drawPerson(col, p, vec2(0.15 + (k - 0.8) * 0.8 * go, -0.42), 0.46, A);
  return col;
}

// 25 — the journey to Canaan: a caravan of camels and sheep over golden hills; a mizbe'ach on the hilltop
vec3 sceneJourney(vec2 p, float lt) {
  float k = SAT(lt / max(uDur, 1.0)); vec2 sun = vec2(0.6, 0.25);
  vec3 col = skyGrad(p, vec3(1.0, 0.85, 0.62), vec3(0.62, 0.78, 0.95), vec3(0.32, 0.52, 0.88));
  col += vec3(1.0, 0.9, 0.6) * exp(-length(p - sun) * 3.0) * 0.5; col = clouds2D(p, col, vec3(1.0), vec3(0.8, 0.82, 0.9), 0.22, sun, uT);
  vec3 hz = vec3(0.88, 0.84, 0.86); mountains(col, p, 0.0, 0.12, 1.3, 111.0, vec3(0.62, 0.55, 0.52), hz, 0.4, sun.x);
  float hill = -0.1 + 0.08 * exp(-pow((p.x - 0.55) * 2.5, 2.0)) + 0.025 * fbm(vec2(p.x * 3.0, 2.0));
  if (p.y < hill) col = mix(desertGround(p), grass(p, vec3(0.5, 0.58, 0.25), vec3(0.62, 0.66, 0.3)), 0.35);
  treeRow(col, p, -0.1, 0.06, 0.14, 113.0, vec3(0.38, 0.45, 0.2), hz, 0.25, sun.x, 0.4);
  palm(col, p, vec2(-0.8, -0.14), 0.24, 0.1, vec3(0.5, 0.33, 0.2), vec3(0.32, 0.45, 0.18), 0.0, hz, sun.x);
  // the mizbe'ach on the hill, lit at the end
  vec2 m = vec2(0.6, -0.04); PX = 1.5 / uRes.y; float alt = smoothstep(0.7, 0.8, k);
  if (alt > 0.0) { for (int r = 0; r < 3; r++) for (int c = 0; c < 3 - r; c++) { vec2 sc = m + vec2((float(c) - (2.0 - float(r)) * 0.5) * 0.04, float(r) * 0.027); ink(col, sdBox2(p - sc, vec2(0.018, 0.012)) - 0.003, vec3(0.65, 0.62, 0.58), (p - sc) * 9.0); }
    col += flame((p - m - vec2(0.0, 0.1)) / 0.05, uT, 2.0) * alt * 1.4; col += vec3(1.0, 0.7, 0.35) * 0.3 * alt * exp(-length(p - m - vec2(0.0, 0.1)) * 8.0); }
  LIGHT_TINT = vec3(1.0, 0.95, 0.88); RIM = 0.6; RIM_COL = vec3(1.0, 0.85, 0.6);
  float march = fract(lt * 0.035) * 0.25;
  for (int i = 0; i < 6; i++) drawAnimal(col, p, vec2(-0.95 + float(i) * 0.08 + march, -0.34 - 0.015 * float(i % 2)), 0.08, 4, uT * 7.0 + float(i), 1.0);
  drawCamel(col, p, vec2(-0.45 + march, -0.31), 0.24, uT * 4.0, 1.0, true); drawCamel(col, p, vec2(-0.14 + march, -0.3), 0.24, uT * 4.0 + 1.0, 1.0, true);
  Person L = lotP(); L.facing = 1.0; L.walk = uT * 5.0; L.armF = vec2(0.3, 0.3); drawPerson(col, p, vec2(0.08 + march, -0.34), 0.36, L);
  Person A = avram(); A.facing = 1.0; A.walk = uT * 5.0; A.tool = 4; A.armF = vec2(0.6, 0.4); A.look = 0.4; drawPerson(col, p, vec2(0.28 + march, -0.35), 0.4, A);
  return col;
}

// 26 — Mitzrayim: the Nile, palms, the pyramids, Pharaoh's palace; plagues strike the palace; Avram leaves with gifts
vec3 sceneMitzrayim(vec2 p, float lt) {
  float k = SAT(lt / max(uDur, 1.0)); float plague = smoothstep(0.35, 0.42, k) * (1.0 - smoothstep(0.72, 0.8, k)); vec2 sun = vec2(-0.6, 0.3);
  vec3 col = mix(skyGrad(p, vec3(1.0, 0.82, 0.55), vec3(0.95, 0.75, 0.55), vec3(0.45, 0.55, 0.85)), skyGrad(p, vec3(0.35, 0.2, 0.2), vec3(0.22, 0.12, 0.18), vec3(0.08, 0.05, 0.1)), plague);
  col += vec3(1.0, 0.85, 0.5) * exp(-length(p - sun) * 3.0) * 0.6 * (1.0 - plague);
  col = clouds2D(p, col, mix(vec3(1.0, 0.9, 0.75), vec3(0.4, 0.3, 0.3), plague), mix(vec3(0.85, 0.7, 0.6), vec3(0.12, 0.08, 0.1), plague), 0.15 + 0.5 * plague, sun, uT * (1.0 + 4.0 * plague));
  float flash = plague * step(0.93, fract(uT * 0.7)) * step(0.3, fract(uT * 3.1)); col += vec3(0.9, 0.9, 1.0) * flash * 0.5;
  // pyramids
  for (int i = 0; i < 3; i++) { vec2 c = vec2(-0.75 + float(i) * 0.22, -0.12); float s = 0.16 + 0.05 * float(i == 1); vec2 q = p - c;
    if (q.y > 0.0 && abs(q.x) < s - q.y) col = mix(vec3(0.9, 0.75, 0.5) * (q.x < 0.0 ? 1.0 : 0.72), col, 0.25 + 0.4 * plague); }
  // the Nile with palms
  if (p.y < -0.12 && p.y > -0.22) { float d = (-0.12 - p.y) / 0.1; col = mix(vec3(0.3, 0.55, 0.65), vec3(0.18, 0.38, 0.5), d) * (1.0 - 0.5 * plague); col += vec3(1.0) * pow(noise(vec2(p.x * 40.0 + uT, d * 20.0)), 8.0) * 0.4; }
  if (p.y < -0.22) col = desertGround(p) * (1.0 - 0.45 * plague);
  for (int i = 0; i < 4; i++) palm(col, p, vec2(-0.9 + float(i) * 0.16, -0.13), 0.18 + 0.03 * hash1(float(i)), 0.06, vec3(0.45, 0.3, 0.18), vec3(0.3, 0.45, 0.18), 0.1, vec3(0.9, 0.8, 0.65), sun.x);
  // Pharaoh's palace: columns and a lintel
  PX = 1.5 / uRes.y; LIGHT_TINT = mix(vec3(1.0, 0.95, 0.85), vec3(0.55, 0.45, 0.55), plague);
  vec2 pc = vec2(0.45, -0.22);
  ink(col, sdBox2(p - pc - vec2(0.0, 0.29), vec2(0.36, 0.035)), vec3(0.92, 0.84, 0.68), p * 3.0);
  for (int i = 0; i < 6; i++) { vec2 cc = pc + vec2(-0.3 + float(i) * 0.12, 0.13); ink(col, sdBox2(p - cc, vec2(0.022, 0.14)), vec3(0.95, 0.88, 0.72) * (0.92 + 0.08 * sin((p.y - cc.y) * 120.0)), (p - cc) * 9.0);
    ink(col, sdBox2(p - cc - vec2(0.0, 0.15), vec2(0.035, 0.015)), vec3(0.3, 0.55, 0.65), p * 9.0); }
  ink(col, sdBox2(p - pc - vec2(0.0, -0.01), vec2(0.4, 0.015)), vec3(0.85, 0.78, 0.62), p * 3.0);
  // Pharaoh with a tall crown, troubled by the plagues
  Person F = townsperson(77.0); F.robe = vec3(0.95, 0.92, 0.85); F.trim = vec3(0.3, 0.5, 0.75); F.wrap = vec3(0.9, 0.75, 0.3); F.beard = vec3(0.1, 0.07, 0.05); F.beardLen = 0.15;
  F.facing = -1.0; F.brow = plague; F.armF = vec2(1.2 + 1.0 * plague, 0.4); F.armB = vec2(0.8 * plague, 0.5); F.look = -0.5; F.talk = plague * 0.6;
  vec2 fpos = vec2(0.35, -0.4); drawPerson(col, p, fpos, 0.4, F);
  vec2 cq = (p - fpos) / 0.4; cq.x *= -1.0; ink(col, sdTrap(cq - vec2(0.01, 0.92), 0.0, 0.18, 0.09, 0.05, 0.0) - 0.008, vec3(0.92, 0.88, 0.8), cq * 3.0);   // crown
  // Avram leaving with laden camels (at the end)
  float leave = smoothstep(0.78, 0.86, k);
  if (leave > 0.0) { float x = -0.1 - (k - 0.8) * 1.4; drawCamel(col, p, vec2(x, -0.33), 0.22, uT * 4.0, -1.0, true);
    Person A = avram(); A.facing = -1.0; A.walk = uT * 5.0; A.tool = 4; A.armF = vec2(0.6, 0.4); drawPerson(col, p, vec2(x - 0.2, -0.36), 0.38, A); }
  col += rainStreaks(p, plague * 0.3);
  return col;
}

// 27 — Avram and Lot part ways: dry hills on the left, the green valley of Sedom on the right
vec3 sceneParting(vec2 p, float lt) {
  float k = SAT(lt / max(uDur, 1.0)); vec2 sun = vec2(-0.5, 0.3);
  vec3 col = skyGrad(p, vec3(0.95, 0.9, 0.8), vec3(0.6, 0.78, 0.95), vec3(0.3, 0.5, 0.9));
  col = clouds2D(p, col, vec3(1.0), vec3(0.8, 0.82, 0.9), 0.25, sun, uT); vec3 hz = vec3(0.82, 0.86, 0.95);
  mountains(col, p, -0.02, 0.1, 1.5, 121.0, vec3(0.58, 0.55, 0.56), hz, 0.4, sun.x);
  // the valley: green fields and a river, the walled city of Sedom in the haze
  if (p.x > 0.05 && p.y < -0.06) { col = mix(grass(p, vec3(0.3, 0.6, 0.22), vec3(0.45, 0.72, 0.28)), hz, SAT((p.y + 0.06) * -8.0 + 0.6) * 0.0); col = mix(col, hz, 0.25 * smoothstep(-0.3, -0.06, p.y));
    float rx = 0.5 + 0.12 * sin(p.y * 9.0); if (abs(p.x - rx) < 0.015 + 0.05 * SAT(-p.y - 0.06)) col = vec3(0.4, 0.65, 0.85); }
  for (int i = 0; i < 7; i++) { float x = 0.62 + float(i) * 0.035; float hh = -0.06 + 0.03 * hash1(float(i) * 9.0); if (abs(p.x - x) < 0.016 && p.y < hh && p.y > -0.12) col = mix(vec3(0.55, 0.4, 0.38), hz, 0.35); }
  // the hill where they stand
  float hill = -0.2 + 0.1 * exp(-pow((p.x + 0.3) * 1.6, 2.0)); if (p.y < hill) col = desertGround(p);
  if (p.y < hill && p.x > 0.0) col = mix(col, grass(p, vec3(0.42, 0.55, 0.22), vec3(0.55, 0.65, 0.28)), 0.4);
  LIGHT_TINT = vec3(1.0, 0.96, 0.9); RIM = 0.5; RIM_COL = vec3(1.0, 0.9, 0.7);
  for (int i = 0; i < 5; i++) drawAnimal(col, p, vec2(-0.85 + float(i) * 0.08, -0.36 - 0.012 * float(i % 2)), 0.08, 4, 0.0, 1.0);
  for (int i = 0; i < 5; i++) drawAnimal(col, p, vec2(0.25 + float(i) * 0.08, -0.37 - 0.012 * float(i % 2)), 0.08, 4, 0.0, 1.0);
  Person A = avram(); A.facing = 1.0; A.tool = 4; A.armF = vec2(k > 0.45 && k < 0.7 ? 1.4 : 0.6, 0.3); A.talk = (k > 0.45 && k < 0.7) ? 0.7 : 0.0; A.look = 0.5;
  drawPerson(col, p, vec2(-0.35, -0.3), 0.42, A);
  Person L = lotP(); float goes = smoothstep(0.72, 0.85, k); L.facing = 1.0; L.armF = vec2(goes > 0.0 ? 1.6 : 0.4, 0.2); L.look = 0.9; L.walk = goes * uT * 5.0;
  drawPerson(col, p, vec2(-0.12 + goes * (k - 0.72) * 2.0, -0.31), 0.4, L);
  return col;
}

// 28 — the night rescue: torches, the kings' camp scattered, Lot freed as dawn comes
vec3 sceneWar(vec2 p, float lt) {
  float k = SAT(lt / max(uDur, 1.0)); float dawn = smoothstep(0.75, 1.0, k);
  vec3 col = mix(skyGrad(p, vec3(0.12, 0.12, 0.25), vec3(0.06, 0.07, 0.18), vec3(0.02, 0.02, 0.07)), skyGrad(p, vec3(1.0, 0.65, 0.45), vec3(0.55, 0.45, 0.62), vec3(0.2, 0.25, 0.5)), dawn);
  col += stars(p, uT) * (1.0 - dawn) * 1.3;
  vec3 hz = mix(vec3(0.12, 0.12, 0.22), vec3(0.6, 0.45, 0.5), dawn); mountains(col, p, -0.04, 0.1, 1.6, 131.0, mix(vec3(0.08, 0.08, 0.15), vec3(0.4, 0.32, 0.4), dawn), hz, 0.3, 0.6);
  if (p.y < -0.16) col = desertGround(p) * mix(0.25, 0.8, dawn);
  // the kings' camp: tents and campfires in the distance on the right; it scatters
  float scatter = smoothstep(0.45, 0.6, k);
  for (int i = 0; i < 5; i++) { vec2 tq = (p - vec2(0.35 + float(i) * 0.12, -0.17)) / 0.18; float t = max(abs(tq.x) - 0.28 + tq.y * 0.9, max(-tq.y, tq.y - 0.26)); if (t < 0.0) col = mix(vec3(0.3, 0.22, 0.2), vec3(0.6, 0.45, 0.35), dawn) * (0.8 + 0.3 * step(0.0, tq.x));
    vec2 f = vec2(0.41 + float(i) * 0.12, -0.18); col += vec3(1.0, 0.55, 0.2) * (1.0 - scatter * 0.8) * (0.003 / (dot(p - f, p - f) + 0.002)) * 0.12 * (1.0 - dawn); }
  for (int i = 0; i < 4; i++) { float x = 0.5 + float(i) * 0.1 + scatter * (k - 0.45) * 2.2; if (scatter > 0.0) { Person S = townsperson(float(i) + 90.0); S.facing = 1.0; S.walk = uT * 9.0; S.armF = vec2(1.2, 0.8); S.armB = vec2(-1.0, 0.5); S.brow = 1.0;
      drawPerson(col, p, vec2(x, -0.26), 0.22, S); } }   // the kings' men run off into the night
  LIGHT_TINT = mix(vec3(0.6, 0.55, 0.75), vec3(1.0, 0.85, 0.7), max(dawn, 0.4)); RIM = 1.0; RIM_COL = vec3(1.0, 0.6, 0.3);
  float run = smoothstep(0.0, 0.5, k);
  Person A = avram(); A.facing = 1.0; A.walk = (1.0 - dawn) * uT * 8.0; A.armF = vec2(2.2, 0.3); A.armB = vec2(-0.8, 0.4); A.look = 0.6; A.brow = 0.3;
  vec2 apos = vec2(-0.7 + run * 0.65, -0.36); drawPerson(col, p, apos, 0.42, A); torch(col, p, handPos(apos, 0.42, A));
  Person E = eliezer(); E.facing = 1.0; E.walk = (1.0 - dawn) * uT * 8.0 + 1.0; E.armF = vec2(2.2, 0.3); E.armB = vec2(-0.8, 0.4); E.look = 0.6;
  vec2 epos = apos - vec2(0.2, 0.01); drawPerson(col, p, epos, 0.4, E); torch(col, p, handPos(epos, 0.4, E));
  // Lot, freed, joins them at dawn
  float freed = smoothstep(0.72, 0.8, k); if (freed > 0.0) { Person L = lotP(); L.facing = -1.0; L.armF = vec2(1.8, 0.3); L.armB = vec2(-1.6, 0.3); L.talk = 0.6; drawPerson(col, p, vec2(0.25, -0.35), 0.4, L); }
  return col;
}

// 29 — Malki-tzedek (Shem) greets Avram with bread and wine outside Shalem; the king of Sedom offers riches, Avram refuses
vec3 sceneMalki(vec2 p, float lt) {
  float k = SAT(lt / max(uDur, 1.0)); vec2 sun = vec2(0.6, 0.15);
  vec3 col = skyGrad(p, vec3(1.0, 0.8, 0.55), vec3(0.8, 0.75, 0.78), vec3(0.35, 0.45, 0.8));
  col += vec3(1.0, 0.85, 0.55) * exp(-length(p - sun) * 3.0) * 0.6; col = clouds2D(p, col, vec3(1.0, 0.9, 0.8), vec3(0.75, 0.62, 0.65), 0.2, sun, uT);
  vec3 hz = vec3(0.92, 0.82, 0.8); mountains(col, p, 0.0, 0.1, 1.4, 141.0, vec3(0.6, 0.52, 0.52), hz, 0.4, sun.x);
  // the walls and gate of Shalem on the hills
  float wallY = -0.02 + 0.03 * sin(p.x * 3.0); if (p.x > -0.9 && p.x < 0.1 && p.y < wallY && p.y > -0.13) { col = vec3(0.86, 0.76, 0.6) * (0.85 + 0.15 * step(0.5, fract(p.x * 40.0 + step(0.5, fract(p.y * 30.0)) * 0.5))) * (0.9 + 0.1 * step(0.5, fract(p.y * 30.0)));
    if (p.y > wallY - 0.02 && fract(p.x * 25.0) < 0.5) col *= 1.0; else if (p.y > wallY - 0.02) col = mix(col, hz, 0.8); col = mix(col, hz, 0.3); }
  if (abs(p.x + 0.4) < 0.04 && p.y < 0.0 && p.y > -0.13) col = vec3(0.35, 0.25, 0.2);
  treeRow(col, p, -0.13, 0.07, 0.12, 143.0, vec3(0.38, 0.48, 0.22), hz, 0.25, sun.x, 0.6);
  if (p.y < -0.15) col = mix(desertGround(p), grass(p, vec3(0.45, 0.58, 0.24), vec3(0.6, 0.68, 0.3)), 0.5);
  LIGHT_TINT = vec3(1.0, 0.93, 0.85); RIM = 0.8; RIM_COL = vec3(1.0, 0.85, 0.55);
  bool second = k > 0.5;
  Person M = malki(); M.facing = 1.0; M.armF = vec2(1.3, 0.4); M.talk = second ? 0.0 : 0.5; M.look = 0.5;
  vec2 mpos = vec2(second ? -0.75 : -0.35, -0.38); drawPerson(col, p, mpos, 0.44, M);
  vec2 mh = handPos(mpos, 0.44, M); PX = 1.5 / uRes.y;
  ink(col, sdE2(p - mh - vec2(0.03, 0.01), vec2(0.045, 0.025)), vec3(0.85, 0.6, 0.3), (p - mh) * 9.0);                                // a round loaf
  ink(col, sdE2(p - mpos - vec2(0.13, 0.12), vec2(0.03, 0.045)) - 0.003, vec3(0.6, 0.25, 0.3), p * 9.0);                              // a jug of wine at his side
  Person A = avram(); A.facing = -1.0; A.armF = second ? vec2(1.6, 0.0) : vec2(0.9, 0.5); A.look = second ? 0.6 : -0.5; A.talk = second ? 0.7 : 0.2;
  A.facing = second ? 1.0 : -1.0; drawPerson(col, p, vec2(second ? -0.15 : 0.05, -0.38), 0.44, A);
  if (second) { Person S = townsperson(55.0); S.robe = vec3(0.5, 0.15, 0.35); S.trim = vec3(0.95, 0.8, 0.3); S.wrap = vec3(0.95, 0.8, 0.3); S.facing = -1.0; S.armF = vec2(1.1, 0.6); S.talk = 0.6; S.look = -0.5;
    vec2 spos = vec2(0.45, -0.38); drawPerson(col, p, spos, 0.42, S);
    vec2 ch = vec2(0.25, -0.37); ink(col, sdBox2(p - ch, vec2(0.07, 0.045)) - 0.006, vec3(0.6, 0.38, 0.18), p * 9.0); ink(col, sdBox2(p - ch - vec2(0.0, 0.05), vec2(0.075, 0.015)), vec3(0.85, 0.65, 0.25), p * 9.0);
    for (int i = 0; i < 6; i++) col += vec3(1.0, 0.85, 0.35) * smoothstep(0.012, 0.0, length(p - ch - vec2(-0.05 + float(i) * 0.02, 0.07 + 0.01 * sin(float(i) * 2.0)))) * 0.9; }   // treasure, refused
  return col;
}

// 30 — the stars: Avram outside his tent under a sky too full to count
vec3 sceneStars(vec2 p, float lt) {
  float k = SAT(lt / max(uDur, 1.0)); float more = smoothstep(0.1, 0.6, k);
  vec3 col = skyGrad(p, vec3(0.16, 0.13, 0.3), vec3(0.07, 0.08, 0.22), vec3(0.02, 0.025, 0.08));
  float band = exp(-pow((p.y - 0.2 - p.x * 0.3) * 5.0, 2.0)); float neb = fbm(p * vec2(3.0, 6.0) + vec2(p.y * 2.0, 0.0));
  col += vec3(0.55, 0.5, 0.85) * band * neb * neb * 0.6;
  col += stars(p, uT) * 1.5 + stars(p * 1.6 + 3.0, uT) * (0.6 + 1.6 * more) + stars(p * 2.7 + 7.0, uT) * more * 1.6 + stars(p * 4.1 + 11.0, uT) * more * more * 1.4;
  for (int L = 0; L < 3; L++) { float sc = 18.0 + float(L) * 14.0; vec2 g = p * sc + float(L) * 7.3; vec2 id = floor(g); float h = hash(id);
    if (h > 0.55 - 0.35 * more) { vec2 f = fract(g) - 0.5 - 0.35 * (hash2(id) - 0.5); float d = length(f); float tw = 0.65 + 0.35 * sin(uT * (1.0 + 3.0 * h) + h * 50.0);
      float on = smoothstep(0.55 - 0.35 * more, 0.6 - 0.35 * more, h);
      col += vec3(1.0, 0.95, 0.85) * on * tw * (smoothstep(0.09, 0.0, d) * 1.4 + 0.004 / (d * d + 0.004) * 0.06) * (1.0 - 0.3 * float(L)) * step(-0.1, p.y); } }
  mountains(col, p, -0.1, 0.08, 1.5, 151.0, vec3(0.14, 0.13, 0.24), vec3(0.1, 0.1, 0.2), 0.25, 0.6);
  if (p.y < -0.18) col = mix(vec3(0.12, 0.1, 0.17), vec3(0.2, 0.17, 0.24), fbm(p * 5.0));
  vec2 tq = p - vec2(-0.5, -0.3); PX = 1.5 / uRes.y; LIGHT_TINT = vec3(0.6, 0.62, 0.9);
  ink(col, max(abs(tq.x) - 0.25 + tq.y * 0.8, max(-tq.y, tq.y - 0.24)), vec3(0.7, 0.5, 0.32) * (0.9 + 0.1 * sin(tq.x * 70.0)), tq * 3.0);
  float door = max(abs(tq.x) - 0.06 + tq.y * 0.2, max(-tq.y, tq.y - 0.15)); col = mix(col, vec3(1.0, 0.7, 0.35) * 1.4, smoothstep(0.003, -0.003, door));
  RIM = 1.2; RIM_COL = vec3(0.7, 0.75, 1.0);
  Person A = avram(); A.facing = 1.0; A.look = 0.3; A.armF = vec2(2.5 + 0.1 * sin(uT * 1.5), 0.2); A.armB = vec2(-0.3, 0.3); A.talk = 0.0;
  drawPerson(col, p, vec2(0.05, -0.38), 0.44, A);
  return col;
}

// 31 — the new name: Avram's tent in daylight, light from above; the overlay writes אַבְרָם → אַבְרָהָם
vec3 sceneName(vec2 p, float lt) {
  float k = SAT(lt / max(uDur, 1.0)); vec2 sun = vec2(-0.6, 0.35);
  vec3 col = skyGrad(p, vec3(0.95, 0.92, 0.85), vec3(0.62, 0.78, 0.96), vec3(0.3, 0.5, 0.9));
  col = clouds2D(p, col, vec3(1.0), vec3(0.82, 0.85, 0.92), 0.22, sun, uT); col += sunRays(p, vec2(0.15, 0.7), vec3(1.0, 0.95, 0.8), 0.2);
  vec3 hz = vec3(0.85, 0.88, 0.95); mountains(col, p, -0.02, 0.1, 1.4, 161.0, vec3(0.6, 0.58, 0.6), hz, 0.4, sun.x);
  treeRow(col, p, -0.12, 0.08, 0.13, 163.0, vec3(0.36, 0.48, 0.22), hz, 0.25, sun.x, 0.6);
  if (p.y < -0.15) col = mix(desertGround(p), grass(p, vec3(0.45, 0.58, 0.24), vec3(0.6, 0.68, 0.3)), 0.55);
  vec2 tq = p - vec2(-0.5, -0.3); PX = 1.5 / uRes.y; LIGHT_TINT = vec3(1.0, 0.96, 0.9);
  ink(col, max(abs(tq.x) - 0.25 + tq.y * 0.8, max(-tq.y, tq.y - 0.24)), vec3(0.7, 0.5, 0.32) * (0.9 + 0.1 * sin(tq.x * 70.0)), tq * 3.0);
  float beam = smoothstep(0.14, 0.0, abs(p.x - 0.12) - 0.03 * (0.6 - p.y)) * smoothstep(-0.5, 0.6, p.y); col += vec3(1.0, 0.95, 0.8) * beam * 0.4;
  RIM = 1.0; RIM_COL = vec3(1.0, 0.95, 0.8);
  Person A = avram(); A.facing = 1.0; A.look = 0.2; A.armF = vec2(0.5, 0.3); A.armB = vec2(-0.2, 0.3);
  if (k > 0.35) { A.armF = vec2(2.4, 0.3); A.armB = vec2(-2.4, -0.3); }
  drawPerson(col, p, vec2(0.12, -0.38), 0.44, A);
  return col;
}

// 32 — the promise of Yitzchak: Avraham rejoices in golden light
vec3 scenePromise(vec2 p, float lt) {
  float k = SAT(lt / max(uDur, 1.0)); vec2 sun = vec2(0.0, 0.05);
  vec3 col = skyGrad(p, vec3(1.0, 0.75, 0.45), vec3(0.95, 0.68, 0.6), vec3(0.4, 0.42, 0.78));
  col += vec3(1.0, 0.82, 0.5) * exp(-length(p - sun) * 2.2) * 0.8 + vec3(1.0, 0.97, 0.85) * smoothstep(0.08, 0.075, length(p - sun));
  col += sunRays(p, sun, vec3(1.0, 0.85, 0.55), 0.3); col = clouds2D(p, col, vec3(1.0, 0.85, 0.7), vec3(0.85, 0.6, 0.6), 0.2, sun, uT);
  vec3 hz = vec3(1.0, 0.78, 0.65); mountains(col, p, -0.04, 0.1, 1.4, 171.0, vec3(0.65, 0.48, 0.5), hz, 0.45, sun.x);
  if (p.y < -0.16) col = grass(p, vec3(0.45, 0.55, 0.2), vec3(0.6, 0.66, 0.26)) * vec3(1.08, 0.92, 0.75);
  for (int i = 0; i < 14; i++) { float x = -0.95 + float(i) * 0.14 + 0.05 * hash1(float(i) + 4.0); flower(col, p, vec2(x, -0.45 - 0.05 * hash1(float(i) * 3.0)), 0.07 * smoothstep(0.1 + hash1(float(i)) * 0.4, 0.6 + hash1(float(i)) * 0.3, k), 0.65 + 0.35 * cos(6.28 * (hash1(float(i) * 5.0) + vec3(0.0, 0.33, 0.67)))); }
  col += motes(p, uT, 0.02, 0.12, vec3(1.0, 0.85, 0.55) * 0.6, 0.04);
  LIGHT_TINT = vec3(1.0, 0.88, 0.72); RIM = 1.2; RIM_COL = vec3(1.0, 0.8, 0.5);
  Person A = avram(); A.facing = 1.0; A.look = 0.0; A.talk = 0.8; A.armF = vec2(2.6 + 0.15 * sin(uT * 3.0), 0.2); A.armB = vec2(-2.6 - 0.15 * sin(uT * 3.0), -0.2);
  drawPerson(col, p, vec2(0.0, -0.36), 0.46, A);
  return col;
}
