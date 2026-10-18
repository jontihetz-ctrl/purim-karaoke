// ── SCENES (Bereishis) ──────────────────────────────────────────────────────
// Content rules: Hashem is never shown (only light). Chava is never drawn. Angels appear only as radiant light.
Person adam() { Person P = defaultPerson(); P.robe = vec3(0.62, 0.5, 0.32); P.trim = vec3(0.86, 0.8, 0.62); P.beard = vec3(0.3, 0.2, 0.12); P.beardLen = 0.45;
  P.wrap = vec3(0.92, 0.88, 0.78); P.blink = blinkAt(0.37); return P; }
Person kayin() { Person P = defaultPerson(); P.robe = vec3(0.55, 0.3, 0.18); P.trim = vec3(0.75, 0.6, 0.35); P.beard = vec3(0.15, 0.09, 0.05); P.beardLen = 0.3;
  P.wrap = vec3(0.6, 0.45, 0.3); P.blink = blinkAt(0.61); return P; }
Person hevel() { Person P = defaultPerson(); P.robe = vec3(0.35, 0.55, 0.72); P.trim = vec3(0.9, 0.88, 0.75); P.beard = vec3(0.4, 0.26, 0.13); P.beardLen = 0.22;
  P.wrap = vec3(0.95, 0.93, 0.85); P.blink = blinkAt(0.83); return P; }

// a fruit tree with a round canopy and fruit (used in Gan Eden)
void fruitTree(inout vec3 col, vec2 p, vec2 base, float h, vec3 leaf, vec3 fruit, float glowAmt, float sunX) {
  vec2 q = (p - base) / h; if (abs(q.x) > 0.8 || q.y < -0.05 || q.y > 1.35) return;
  float aa = 1.5 / (uRes.y * h);
  float trunk = sdSeg2(q, vec2(0.0, 0.0), vec2(0.02, 0.55), 0.07, 0.045);
  trunk = min(trunk, sdSeg2(q, vec2(0.01, 0.4), vec2(-0.22, 0.68), 0.035, 0.02)); trunk = min(trunk, sdSeg2(q, vec2(0.015, 0.45), vec2(0.25, 0.72), 0.035, 0.02));
  col *= 1.0 - 0.25 * smoothstep(0.6, 0.0, length((q - vec2(0.12, 0.0)) / vec2(0.6, 0.07)));
  if (trunk < aa) { float side = SAT(0.5 + q.x * 6.0 * sign(sunX - base.x)); col = mix(col, vec3(0.36, 0.23, 0.13) * (0.65 + 0.5 * side) * (0.9 + 0.15 * noise(q * 40.0)), smoothstep(aa, -aa, trunk)); }
  vec2 cc = vec2(0.0, 0.85); float can = 1e5;
  for (int i = 0; i < 6; i++) { float a = float(i) * 1.047 + 0.3; can = min(can, length(q - cc - vec2(cos(a) * 0.26, sin(a) * 0.17)) - 0.22); }
  can = min(can, length(q - cc) - 0.3); can += 0.03 * (fbm(q * 8.0) - 0.5);
  if (can < aa) { vec2 nn = normalize(q - cc + 1e-4); float lit = SAT(0.5 + 0.6 * dot(nn, normalize(vec2(sunX - base.x, 0.9))));
    vec3 c = leaf * (0.55 + 0.6 * lit) * (0.8 + 0.35 * noise(q * 26.0)); c = mix(c * 0.65, c, smoothstep(-0.06, 0.0, can + 0.02 * noise(q * 40.0)));
    vec2 fq = q * 9.0; vec2 id = floor(fq); float hh = hash(id + base * 13.0);
    if (hh > 0.72) { float fd = length(fract(fq) - 0.5 - 0.15 * (hash2(id) - 0.5)) - 0.2; c = mix(c, fruit * (0.75 + 0.45 * SAT(-fract(fq).x + 0.7)), smoothstep(0.04, -0.04, fd)); }
    col = mix(col, c, smoothstep(aa, -aa, can)); }
  col += vec3(1.0, 0.9, 0.55) * glowAmt * 0.35 * exp(-length(q - cc) * 2.2);
}
vec3 rainStreaks(vec2 p, float amt) { if (amt <= 0.0) return vec3(0.0);
  vec2 rq = vec2(p.x * 60.0 + p.y * 6.0, p.y * 3.0 + uT * 7.0); vec2 id = floor(rq); float h = hash(vec2(id.x, floor(rq.y + hash1(id.x) * 10.0)));
  return vec3(0.75, 0.82, 0.95) * step(0.86, h) * smoothstep(0.1, 0.0, abs(fract(rq.x) - 0.5)) * smoothstep(0.0, 0.3, fract(rq.y + hash1(id.x) * 10.0)) * amt * 0.5; }
void flower(inout vec3 col, vec2 p, vec2 base, float h, vec3 c) {
  if (h <= 0.002) return; vec2 q = (p - base) / h;
  col = mix(col, vec3(0.25, 0.5, 0.18), smoothstep(0.06, 0.02, abs(q.x - 0.05 * sin(q.y * 3.0))) * step(0.0, q.y) * step(q.y, 0.85));
  float r = length(q - vec2(0.0, 0.9)); float pet = 0.18 + 0.06 * cos(atan(q.y - 0.9, q.x) * 5.0);
  col = mix(col, c, smoothstep(0.03, -0.03, r - pet)); col = mix(col, vec3(1.0, 0.85, 0.3), smoothstep(0.03, -0.03, r - 0.07));
}

// bare earth with tiny sprouts just at the surface: the plants waited under the ground until Adam davened for rain (Rashi 2:5)
vec3 sproutSoil(vec2 p) {
  vec3 c = mix(vec3(0.58, 0.44, 0.3), vec3(0.48, 0.36, 0.24), fbm(p * vec2(4.0, 14.0))) * (0.88 + 0.16 * noise(p * 160.0));
  vec2 g = p * vec2(70.0, 110.0); vec2 id = floor(g); float h = hash(id);
  if (h > 0.8) { vec2 f = fract(g) - vec2(0.5, 0.3); float sp = min(length((f - vec2(-0.12, 0.12)) / vec2(0.2, 0.09)), length((f - vec2(0.12, 0.12)) / vec2(0.2, 0.09)));
    c = mix(c, vec3(0.42, 0.62, 0.25), smoothstep(1.0, 0.6, sp)); }
  return c; }

// 15 — days 1–3: darkness, "let there be light", the sky, dry land, grass and trees
vec3 sceneCreation(vec2 p, float lt) {
  float k = SAT(lt / max(uDur, 1.0));
  float light = smoothstep(0.1, 0.24, k), sky = smoothstep(0.4, 0.55, k), land = smoothstep(0.66, 0.82, k), grow = smoothstep(0.76, 1.0, k);
  vec2 q = rot(uT * 0.02) * p; float sw = fbm(q * 2.4 + 0.8 * fbm(q * 3.0 + uT * 0.04));
  vec3 col = vec3(0.012, 0.014, 0.035) + vec3(0.03, 0.04, 0.1) * sw * (1.0 - light * 0.5);
  vec2 lc = vec2(0.0, 0.22); float r = length(p - lc); float burst = light * (1.0 - sky * 0.85);
  col += vec3(1.0, 0.92, 0.75) * (0.06 / (r * r + 0.03)) * 0.22 * burst;
  col += vec3(1.0, 0.9, 0.7) * pow(0.5 + 0.5 * sin(atan(p.x - lc.x, p.y - lc.y) * 16.0 + uT * 0.25), 8.0) * exp(-r * 1.4) * 0.45 * burst;
  col += vec3(0.2, 0.18, 0.26) * light * (1.0 - sky);
  vec3 skyc = skyGrad(p, vec3(0.8, 0.88, 1.0), vec3(0.52, 0.72, 0.95), vec3(0.25, 0.45, 0.85));
  skyc = clouds2D(p, skyc, vec3(1.0), vec3(0.75, 0.8, 0.9), 0.28, vec2(0.3, 0.5), uT); skyc += sunRays(p, vec2(0.0, 0.6), vec3(1.0, 0.95, 0.85), 0.12);
  float hz = mix(0.55, -0.08, sky); float d = hz - p.y;
  vec3 sea = mix(vec3(0.2, 0.42, 0.6), vec3(0.05, 0.2, 0.38), SAT(d * 2.2));
  sea += vec3(1.0, 0.95, 0.85) * pow(noise(vec2(p.x * 40.0, d * 300.0 / (d + 0.1) - uT)), 6.0) * 0.5 * SAT(1.0 - abs(p.x) * 1.2);
  float wl = hz + wave(p.x, uT, 0.0) * 0.6; vec3 world = p.y > wl ? skyc : sea;
  col = mix(col, world, sky);
  if (land > 0.0 && p.y > wl - 0.005) { vec3 c0 = col; mountains(col, p, -0.02 + 0.5 * (land - 1.0), 0.13, 1.4, 15.0, vec3(0.5, 0.55, 0.62), vec3(0.75, 0.82, 0.95), 0.38, 0.0); col = mix(c0, col, land); }
  if (land > 0.0) {
    float shore = 0.35 + 0.12 * fbm(vec2(p.y * 3.0, 4.0));
    float lh = -0.06 + 0.07 * fbm(vec2(p.x * 2.0, 1.0)) + 0.06 * exp(-pow((p.x + 0.4) * 2.0, 2.0)) - 0.5 * (1.0 - land);
    float sink = smoothstep(shore - 0.02, shore + 0.1, p.x);
    lh -= 0.4 * sink;
    if (p.y < lh) { vec3 sand = vec3(0.82, 0.72, 0.52) * (0.85 + 0.15 * fbm(p * 30.0));
      vec3 g = sproutSoil(p); float gm = grow * smoothstep(0.0, 0.25, shore - 0.05 - p.x + (1.0 - grow) * 0.5);
      col = mix(sand, g, gm); col *= 0.85 + 0.15 * smoothstep(lh - 0.3, lh, p.y); }
    // (no trees yet: they come up only after Adam davens for rain)
  }
  return col;
}

// 16 — days 4–6: the sun and the moon (the moon is made smaller and given the stars), fish and birds, the animals
vec3 sceneCreation2(vec2 p, float lt) {
  float k = SAT(lt / max(uDur, 1.0));
  float appear = smoothstep(0.0, 0.1, k), shrink = smoothstep(0.24, 0.38, k), starsOn = smoothstep(0.36, 0.55, k), life = smoothstep(0.62, 0.72, k), beasts = smoothstep(0.78, 0.9, k);
  float dn = smoothstep(-0.25, 0.35, p.x);                                                      // day on the left, night on the right
  vec3 day = skyGrad(p, vec3(1.0, 0.85, 0.65), vec3(0.6, 0.78, 0.98), vec3(0.3, 0.52, 0.9));
  vec3 night = skyGrad(p, vec3(0.2, 0.18, 0.4), vec3(0.08, 0.1, 0.28), vec3(0.02, 0.03, 0.12));
  vec3 col = mix(day, night, dn);
  col += stars(p, uT) * dn * starsOn * 1.6 + stars(p * 1.8 + 5.0, uT) * dn * starsOn;
  vec2 sp = vec2(-0.48, 0.24), mp = vec2(0.45, 0.24);
  float sr = 0.11 * appear, mr = 0.11 * appear * (1.0 - 0.5 * shrink);
  col += vec3(1.0, 0.8, 0.45) * exp(-length(p - sp) * 3.5) * 0.7 * appear;
  col += sunRays(p, sp, vec3(1.0, 0.85, 0.5), 0.35 * appear) * (1.0 - dn);
  col = mix(col, vec3(1.0, 0.86, 0.45) * 1.5, smoothstep(0.004, -0.004, length(p - sp) - sr));
  // the moon, with a small face: sad while complaining, happy once the stars come
  col += vec3(0.6, 0.65, 0.9) * exp(-length(p - mp) * 6.0) * 0.25 * appear;
  vec2 mq = p - mp; float md = length(mq) - mr;
  if (md < 0.004) { vec3 mc = vec3(0.95, 0.94, 0.88) * (0.85 + 0.15 * noise(mq * 60.0)) * (1.0 - 0.15 * smoothstep(0.3, 0.6, noise(mq * 25.0)));
    col = mix(col, mc, smoothstep(0.004, -0.004, md));
    if (mr > 0.02) { vec2 fq = mq / mr; float sad = smoothstep(0.1, 0.24, k) * (1.0 - starsOn);
      col = mix(col, vec3(0.3, 0.3, 0.35), smoothstep(0.1, 0.06, length(fq - vec2(-0.3, 0.15))) + smoothstep(0.1, 0.06, length(fq - vec2(0.3, 0.15))));
      float mouthY = -0.32; float curve = mix(-0.25, 0.25, sad);
      float mouth = abs(fq.y - mouthY - curve * (1.0 - fq.x * fq.x * 6.0) * 0.4) - 0.035; col = mix(col, vec3(0.35, 0.3, 0.32), smoothstep(0.03, 0.0, mouth) * step(abs(fq.x), 0.35)); } }
  for (int i = 0; i < 9; i++) { float a = float(i) * 0.698 + uT * 0.1; vec2 s = mp + vec2(cos(a), sin(a) * 0.7) * (0.17 + 0.05 * sin(float(i) * 3.1));
    float tw = 0.7 + 0.3 * sin(uT * 3.0 + float(i)); float sd = length(p - s); col += vec3(1.0, 0.95, 0.8) * (smoothstep(0.012, 0.0, sd) * 1.5 + 0.003 / (sd * sd + 0.0008) * 0.02) * starsOn * tw; }
  mountains(col, p, -0.1, 0.1, 2.0, 27.0, mix(vec3(0.5, 0.55, 0.6), vec3(0.2, 0.2, 0.35), dn), mix(vec3(0.8, 0.85, 0.95), vec3(0.15, 0.15, 0.3), dn), 0.35, -0.48);
  // ground: sea on the left, meadow on the right
  float shoreX = -0.05 + 0.04 * sin(p.y * 12.0);
  if (p.y < -0.18) {
    if (p.x < shoreX) { float d = -0.18 - p.y; col = mix(vec3(0.25, 0.5, 0.7), vec3(0.08, 0.25, 0.45), SAT(d * 3.0)); col += vec3(1.0, 0.95, 0.85) * pow(noise(vec2(p.x * 40.0, d * 300.0 / (d + 0.1) - uT)), 6.0) * 0.4; }
    else col = sproutSoil(p) * mix(1.0, 0.55, dn); }
  // fish leaping from the sea
  for (int i = 0; i < 4; i++) { float ph = fract(uT * 0.35 + float(i) * 0.27); float x0 = -0.85 + float(i) * 0.2;
    vec2 fp = vec2(x0 + ph * 0.14, -0.2 + sin(ph * PI) * 0.12); float ang = cos(ph * PI) * 0.9;
    vec2 fq = rot(-ang) * (p - fp); float body = sdE2(fq, vec2(0.028, 0.012)) ; float tail = sdTrap(vec2(fq.y, -fq.x - 0.03), -0.0, 0.02, 0.0, 0.014, 0.0);
    vec3 fc = 0.6 + 0.4 * cos(6.28 * (float(i) * 0.23 + vec3(0.0, 0.33, 0.67)));
    if (min(body, tail) < 0.0) col = mix(col, fc * (0.75 + 0.4 * SAT(fq.y * 60.0 + 0.5)), life * smoothstep(0.0, 0.1, sin(ph * PI))); }
  // birds across the sky
  for (int i = 0; i < 4; i++) { float x = -1.0 + fract(uT * 0.04 + float(i) * 0.25) * 2.0; drawBird(col, p, vec2(x, 0.0 + 0.06 * float(i % 2) + 0.02 * sin(uT + float(i))), 0.05 * life, uT * 9.0 + float(i), vec3(0.95), 1.0, false); }
  // the animals arrive on the meadow
  LIGHT_TINT = mix(vec3(1.0, 0.95, 0.88), vec3(0.6, 0.6, 0.85), dn);
  if (beasts > 0.0) { for (int i = 0; i < 4; i++) { int kinds[4] = int[](3, 1, 2, 5); float hs[4] = float[](0.24, 0.3, 0.2, 0.09);
    float x = 0.2 + float(i) * 0.19 + (1.0 - beasts) * 0.8; drawAnimal(col, p, vec2(x, -0.3 + 0.01 * float(i)), hs[i], kinds[i], uT * 6.0 * (1.0 - beasts), -1.0); } }
  return col;
}

// 17 — Adam names the animals; he davens for rain and the plants spring up
vec3 sceneAdam(vec2 p, float lt) {
  float k = SAT(lt / max(uDur, 1.0)); float rain = smoothstep(0.6, 0.7, k) * (1.0 - smoothstep(0.88, 0.97, k)); float bloom = smoothstep(0.78, 1.0, k);
  vec2 sun = vec2(-0.6, 0.3);
  vec3 col = skyGrad(p, vec3(1.0, 0.86, 0.66), vec3(0.62, 0.78, 0.96), vec3(0.32, 0.52, 0.9));
  col += vec3(1.0, 0.85, 0.6) * exp(-length(p - sun) * 3.0) * 0.6 * (1.0 - rain);
  col = clouds2D(p, col, mix(vec3(1.0), vec3(0.65, 0.68, 0.75), rain), mix(vec3(0.78, 0.8, 0.9), vec3(0.35, 0.38, 0.48), rain), 0.25 + 0.45 * rain, sun, uT * 2.0);
  col *= 1.0 - 0.25 * rain;
  vec3 hz = mix(vec3(0.82, 0.86, 0.95), vec3(0.6, 0.64, 0.72), rain);
  mountains(col, p, 0.0, 0.15, 1.3, 33.0, vec3(0.52, 0.56, 0.64), hz, 0.35, sun.x);
  if (p.y < -0.14) { col = mix(sproutSoil(p), grass(p, vec3(0.38, 0.6, 0.22), vec3(0.55, 0.74, 0.3)), smoothstep(0.0, 1.0, bloom * 1.3 - fbm(p * 3.0) * 0.3)); col *= 1.0 - 0.15 * rain; }
  if (bloom > 0.02) treeRow(col, p, -0.13, 0.08 * bloom, 0.1, 41.0, vec3(0.28, 0.46, 0.2), hz, 0.25, sun.x, 0.75);   // trees grow once the rain falls
  for (int i = 0; i < 14; i++) { float x = -0.95 + float(i) * 0.14 + 0.05 * hash1(float(i)); flower(col, p, vec2(x, -0.47 - 0.04 * hash1(float(i) * 3.0)), 0.07 * SAT(bloom * 1.6 - hash1(float(i) * 7.0) * 0.6), 0.65 + 0.35 * cos(6.28 * (hash1(float(i) * 5.0) + vec3(0.0, 0.33, 0.67)))); }
  LIGHT_TINT = mix(vec3(1.0, 0.95, 0.88), vec3(0.8, 0.82, 0.9), rain); RIM = 0.6; RIM_COL = vec3(1.0, 0.85, 0.6);
  // animals step forward one by one to be named (names appear above them in the overlay)
  int kinds[4] = int[](5, 4, 2, 0); float hs[4] = float[](0.11, 0.17, 0.26, 0.36);
  for (int i = 0; i < 4; i++) { float t0 = 0.2 + float(i) * 0.08; float on = smoothstep(t0 - 0.05, t0, k);
    vec2 pos = vec2(0.1 + float(i) * 0.22, -0.3 + 0.01 * float(i)); pos.x += (1.0 - on) * 0.12;
    float named = smoothstep(t0, t0 + 0.03, k) * (1.0 - smoothstep(t0 + 0.07, t0 + 0.1, k));
    col += vec3(1.0, 0.9, 0.6) * named * 0.25 * exp(-length((p - pos - vec2(0.0, hs[i] * 0.5)) / vec2(hs[i] * 0.8, hs[i] * 0.7)) * 1.5);
    if (on > 0.01) drawAnimal(col, p, pos, hs[i], kinds[i], (1.0 - on) * uT * 6.0, -1.0); }
  Person A = adam(); A.facing = 1.0; A.talk = (k > 0.18 && k < 0.55) ? 0.6 : 0.0; A.look = 0.6;
  float pray = smoothstep(0.58, 0.64, k);
  A.armF = mix(vec2(1.7 + 0.15 * sin(uT * 2.0), 0.25), vec2(2.7, 0.2), pray); A.armB = mix(vec2(-0.2, 0.3), vec2(-2.6, -0.2), pray);
  // (Adam is not shown before the sin: the animals come forward to be named)
  col += rainStreaks(p, rain);
  return col;
}

// 18 — the first Shabbos: the whole world at rest in golden light
vec3 sceneShabbos(vec2 p, float lt) {
  vec2 sun = vec2(0.35, -0.02);
  vec3 col = skyGrad(p, vec3(1.0, 0.62, 0.3), vec3(0.9, 0.5, 0.45), vec3(0.3, 0.28, 0.62));
  col += vec3(1.0, 0.75, 0.4) * exp(-length(p - sun) * 3.0) * 0.6 + vec3(1.0, 0.95, 0.8) * smoothstep(0.06, 0.055, length(p - sun));
  col = clouds2D(p, col, vec3(1.0, 0.82, 0.65), vec3(0.8, 0.55, 0.6), 0.22, sun, uT * 0.5);
  col += sunRays(p, vec2(0.0, 0.7), vec3(1.0, 0.92, 0.75), 0.16);
  vec3 hz = vec3(1.0, 0.75, 0.62);
  mountains(col, p, 0.0, 0.14, 1.3, 51.0, vec3(0.6, 0.45, 0.5), hz, 0.45, sun.x);
  float lake = -0.1;
  if (p.y < lake && p.y > -0.2) { vec2 rp = vec2(p.x, 2.0 * lake - p.y); vec3 refl = skyGrad(rp, vec3(1.0, 0.62, 0.3), vec3(0.9, 0.5, 0.45), vec3(0.3, 0.28, 0.62));
    refl += vec3(1.0, 0.8, 0.5) * exp(-length(rp - sun) * 2.5) * 0.7; col = refl * vec3(0.75, 0.8, 0.9);
    col += vec3(1.0, 0.85, 0.6) * pow(noise(vec2(p.x * 50.0, (lake - p.y) * 400.0 / ((lake - p.y) + 0.1) - uT * 0.5)), 6.0) * exp(-abs(p.x - sun.x) * 4.0) * 0.8; }
  treeRow(col, p, -0.1, 0.08, 0.11, 57.0, vec3(0.36, 0.4, 0.16), hz, 0.15, sun.x, 0.55);
  if (p.y < -0.2) col = grass(p, vec3(0.4, 0.52, 0.16), vec3(0.58, 0.62, 0.22)) * vec3(1.08, 0.92, 0.72);
  treeRow(col, p, -0.22, 0.16, 0.3, 59.0, vec3(0.32, 0.38, 0.14), hz, 0.0, sun.x, 0.5);
  LIGHT_TINT = vec3(1.0, 0.85, 0.65); RIM = 1.0; RIM_COL = vec3(1.0, 0.75, 0.45);
  // resting animals
  drawAnimal(col, p, vec2(-0.55, -0.3), 0.13, 4, 0.0, 1.0); drawAnimal(col, p, vec2(-0.42, -0.31), 0.11, 4, 0.0, -1.0);
  drawAnimal(col, p, vec2(0.62, -0.3), 0.2, 2, 0.0, -1.0); drawAnimal(col, p, vec2(0.46, -0.31), 0.08, 5, 0.0, 1.0);
  col += motes(p, uT, 0.015, 0.1, vec3(1.0, 0.85, 0.55) * 0.5, 0.035);
  return col;
}

// 19 — Gan Eden: a river, fruit trees, the Tree of Life and the Tree of Knowledge; Adam tends the garden
vec3 sceneGan(vec2 p, float lt) {
  vec2 sun = vec2(-0.55, 0.38);
  vec3 col = skyGrad(p, vec3(0.92, 0.95, 1.0), vec3(0.6, 0.8, 0.98), vec3(0.32, 0.55, 0.92));
  col = clouds2D(p, col, vec3(1.0), vec3(0.8, 0.85, 0.95), 0.24, sun, uT); col += sunRays(p, sun, vec3(1.0, 0.95, 0.8), 0.15);
  vec3 hz = vec3(0.82, 0.9, 1.0);
  mountains(col, p, 0.02, 0.14, 1.2, 61.0, vec3(0.55, 0.62, 0.72), hz, 0.38, sun.x);
  treeRow(col, p, -0.08, 0.07, 0.07, 63.0, vec3(0.3, 0.55, 0.25), hz, 0.3, sun.x, 0.85);
  if (p.y < -0.1) col = grass(p, vec3(0.32, 0.62, 0.22), vec3(0.5, 0.78, 0.3));
  // the river winding toward us
  float rx = 0.05 + 0.18 * sin(p.y * 6.0 + 1.0) * SAT(-p.y * 2.0); float rw = 0.01 + 0.12 * SAT(-p.y - 0.1);
  if (p.y < -0.1 && abs(p.x - rx) < rw) { float d = abs(p.x - rx) / rw; col = mix(vec3(0.35, 0.65, 0.85), vec3(0.2, 0.45, 0.7), d * d);
    col += vec3(1.0) * pow(noise(vec2(p.x * 30.0, p.y * 80.0 + uT * 1.5)), 8.0) * 0.6; col = mix(col, vec3(0.55, 0.45, 0.3), smoothstep(0.85, 1.0, d)); }
  fruitTree(col, p, vec2(-0.82, -0.2), 0.3, vec3(0.3, 0.55, 0.2), vec3(0.95, 0.35, 0.2), 0.0, sun.x);
  fruitTree(col, p, vec2(0.85, -0.22), 0.3, vec3(0.28, 0.52, 0.2), vec3(1.0, 0.6, 0.15), 0.0, sun.x);
  fruitTree(col, p, vec2(-0.33, -0.16), 0.4, vec3(0.3, 0.6, 0.25), vec3(1.0, 0.85, 0.3), 0.9 + 0.1 * sin(uT * 2.0), sun.x);   // Tree of Life (glowing)
  fruitTree(col, p, vec2(0.42, -0.16), 0.38, vec3(0.25, 0.48, 0.18), vec3(0.85, 0.15, 0.25), 0.0, sun.x);                      // Tree of Knowledge
  for (int i = 0; i < 16; i++) { float x = -0.95 + float(i) * 0.125 + 0.05 * hash1(float(i) + 2.0); flower(col, p, vec2(x, -0.47 - 0.05 * hash1(float(i) * 3.3)), 0.06 + 0.02 * hash1(float(i)), 0.65 + 0.35 * cos(6.28 * (hash1(float(i) * 5.5) + vec3(0.0, 0.33, 0.67)))); }
  LIGHT_TINT = vec3(1.0, 0.97, 0.9); RIM = 0.5; RIM_COL = vec3(1.0, 0.9, 0.7);
  drawAnimal(col, p, vec2(0.62, -0.46), 0.22, 2, 0.0, -1.0); drawAnimal(col, p, vec2(0.78, -0.47), 0.12, 4, 0.0, -1.0);   // the lion lies with the sheep
  for (int i = 0; i < 3; i++) drawBird(col, p, vec2(-0.9 + fract(uT * 0.05 + float(i) * 0.33) * 1.8, 0.22 + 0.05 * float(i)), 0.045, uT * 9.0 + float(i), vec3(0.95, 0.6 + 0.2 * float(i), 0.3), 1.0, false);
  Person A = adam(); A.facing = 1.0; A.walk = uT * 5.0; A.tool = 2; A.armF = vec2(0.4, 0.2); A.look = 0.5;
  // (Adam is not shown before the sin)
  return col;
}

// 20 — the nachash on the Tree of Knowledge; later Adam with the fruit, realising
vec3 sceneNachash(vec2 p, float lt) {
  float k = SAT(lt / max(uDur, 1.0)); float dusk = smoothstep(0.3, 0.9, k);
  vec3 col = mix(skyGrad(p, vec3(0.9, 0.95, 1.0), vec3(0.6, 0.8, 0.95), vec3(0.35, 0.55, 0.9)), skyGrad(p, vec3(0.75, 0.5, 0.55), vec3(0.45, 0.32, 0.5), vec3(0.15, 0.12, 0.3)), dusk);
  for (int i = 0; i < 12; i++) { vec2 c = vec2(hash1(float(i)) * 2.0 - 1.0, hash1(float(i) * 3.0) * 0.6 - 0.3); col += mix(vec3(0.4, 0.7, 0.3), vec3(0.3, 0.3, 0.4), dusk) * 0.15 * exp(-length(p - c) * 7.0); }   // soft garden bokeh
  if (p.y < -0.25) col = mix(grass(p, vec3(0.3, 0.55, 0.2), vec3(0.45, 0.68, 0.28)), vec3(0.2, 0.22, 0.25), dusk * 0.5);
  PX = 1.5 / uRes.y; LIGHT_TINT = mix(vec3(1.0, 0.97, 0.9), vec3(0.75, 0.65, 0.8), dusk);
  // trunk and a big branch with leaves and fruit
  float trunk = sdSeg2(p, vec2(-0.7, -0.6), vec2(-0.62, 0.6), 0.1, 0.07);
  float branch = sdSeg2(p, vec2(-0.66, 0.2), vec2(0.5, 0.3), 0.045, 0.02);
  ink(col, min(trunk, branch), vec3(0.4, 0.26, 0.14) * (0.9 + 0.15 * noise(p * vec2(20.0, 60.0))), p * 2.0);
  for (int i = 0; i < 9; i++) { float t = float(i) / 8.0; vec2 bp = mix(vec2(-0.6, 0.21), vec2(0.45, 0.3), t); vec2 lp = bp + vec2(0.03 * sin(float(i) * 2.0), 0.08 + 0.04 * cos(float(i) * 3.0));
    vec2 lq = rot(0.5 * sin(float(i) * 1.7)) * (p - lp); ink(col, sdE2(lq, vec2(0.06, 0.028)), vec3(0.25, 0.5, 0.2), lq * 6.0);
    if (i % 2 == 1) { vec2 fp = bp - vec2(0.0, 0.07 + 0.01 * sin(uT * 2.0 + float(i))); bool taken = (i == 5) && k > 0.5;
      if (!taken) { ink(col, length(p - fp) - 0.035, vec3(0.85, 0.15, 0.22), (p - fp) * 10.0); col = mix(col, vec3(1.0, 0.85, 0.85), smoothstep(0.01, 0.0, length(p - fp - vec2(-0.012, 0.012)) - 0.007)); } } }
  // the snake: coiled along the branch, head lowered, swaying, tongue flicking
  float sway = sin(uT * 1.6) * 0.03; float sn = 1e5; float tt = 0.0; vec2 prev = vec2(-0.36, 0.25);
  for (int i = 1; i < 40; i++) { float t = float(i) / 39.0; vec2 bp = mix(vec2(-0.36, 0.25), vec2(0.15, 0.285), t);
    vec2 c = bp + vec2(0.0, 0.032 * sin(t * 16.0));
    if (t > 0.72) { float u = (t - 0.72) / 0.28; c = vec2(0.15, 0.285) + vec2(0.07 * u + sway * u, -0.17 * u * u); }
    float r = mix(0.03, 0.02, t); float d = sdCap2(p, prev, c, r); if (d < sn) { sn = d; tt = t; } prev = c; }
  vec3 scale = mix(vec3(0.3, 0.55, 0.25), vec3(0.85, 0.75, 0.2), step(0.5, fract(tt * 14.0)));
  ink(col, sn, scale, p * 8.0);
  // the nachash had legs (Rashi 3:14): four small legs gripping the branch
  for (int L = 0; L < 4; L++) { float t = 0.1 + float(L) * 0.18; vec2 bp = mix(vec2(-0.36, 0.25), vec2(0.15, 0.285), t); vec2 c = bp + vec2(0.0, 0.032 * sin(t * 16.0));
    float wig = 0.01 * sin(uT * 2.2 + float(L) * 1.7);
    for (int sd = 0; sd < 2; sd++) { float dx = sd == 0 ? -0.018 : 0.018; vec2 hip = c + vec2(dx * 0.6, -0.012); vec2 knee = hip + vec2(dx * 1.2 + wig, -0.022); vec2 foot = vec2(knee.x + dx * 0.4, bp.y - 0.028);
      float leg = min(sdCap2(p, hip, knee, 0.008), sdCap2(p, knee, foot, 0.007)); leg = min(leg, sdE2(p - foot - vec2(dx * 0.4, 0.0), vec2(0.013, 0.006)));
      ink(col, leg, sd == 0 ? vec3(0.22, 0.42, 0.18) : vec3(0.3, 0.55, 0.24), p * 8.0); } }
  vec2 hp = vec2(0.225 + sway, 0.11); ink(col, sdE2(p - hp, vec2(0.05, 0.032)), vec3(0.32, 0.58, 0.26), (p - hp) * 8.0);
  col = mix(col, vec3(1.0, 0.9, 0.2), smoothstep(0.009, 0.005, length(p - hp - vec2(0.012, 0.008)))); col = mix(col, vec3(0.05), smoothstep(0.004, 0.002, abs(p.x - hp.x - 0.012)) * step(length(p - hp - vec2(0.012, 0.008)), 0.008));
  float flick = step(0.6, fract(uT * 0.9)); col = mix(col, vec3(0.85, 0.15, 0.2), flick * smoothstep(0.004, 0.0, sdCap2(p, hp + vec2(0.03, -0.005), hp + vec2(0.065, -0.012), 0.002)));
  // Adam, holding the fruit, realising
  float aOn = smoothstep(0.5, 0.58, k);
  if (aOn > 0.0) { Person A = adam(); A.facing = -1.0; A.armF = vec2(1.1, 1.3); A.brow = smoothstep(0.75, 0.85, k); A.look = -0.3; A.talk = 0.0;
    vec2 pos = vec2(0.62 + (1.0 - aOn) * 0.4, -0.5); drawPerson(col, p, pos, 0.5, A);
    vec2 fh = pos + vec2(-0.085, 0.36) * 0.5 * 2.0; ink(col, length(p - vec2(pos.x - 0.075, pos.y + 0.345)) - 0.02, vec3(0.85, 0.15, 0.22), p * 10.0); }
  col *= 1.0 - 0.35 * dusk * smoothstep(0.3, 1.3, length(p));
  return col;
}

// 21 — leaving Gan Eden: the light of the garden behind the gate, the fiery turning sword, angels as light; Adam goes out to work the land
vec3 sceneExile(vec2 p, float lt) {
  float k = SAT(lt / max(uDur, 1.0));
  vec3 col = skyGrad(p, vec3(0.6, 0.55, 0.6), vec3(0.42, 0.42, 0.52), vec3(0.2, 0.2, 0.3));
  col = clouds2D(p, col, vec3(0.75, 0.72, 0.78), vec3(0.32, 0.3, 0.38), 0.55, vec2(-0.6, 0.2), uT);
  vec2 gate = vec2(-0.5, -0.1);
  col += vec3(1.0, 0.9, 0.6) * exp(-length((p - gate) * vec2(1.0, 0.7)) * 3.0) * 0.9;                    // the garden's light
  mountains(col, p, -0.02, 0.1, 1.8, 71.0, vec3(0.35, 0.33, 0.38), vec3(0.5, 0.48, 0.55), 0.3, -0.5);
  if (p.y < -0.18) { col = mix(vec3(0.5, 0.42, 0.32), vec3(0.38, 0.32, 0.26), fbm(p * vec2(5.0, 18.0)));
    vec2 sc = p * vec2(30.0, 45.0); vec2 id = floor(sc); if (hash(id) > 0.9 && p.x > -0.2) col = mix(col, vec3(0.3, 0.25, 0.2), smoothstep(0.35, 0.15, length(fract(sc) - 0.5))); }
  // thorny bushes on the outside
  for (int i = 0; i < 6; i++) { vec2 b = vec2(0.0 + float(i) * 0.17, -0.36 - 0.03 * hash1(float(i))); vec2 q = p - b; float a = atan(q.y, q.x); float r = 0.05 + 0.02 * abs(sin(a * 7.0));
    if (length(q) < r && q.y > -0.01) col = vec3(0.25, 0.22, 0.16) * (0.8 + 0.3 * noise(q * 80.0)); }
  // the gate: two stone pillars and an arch, brilliant light inside
  PX = 1.5 / uRes.y; LIGHT_TINT = vec3(0.9, 0.85, 0.85);
  vec2 g = p - gate; float inside = max(abs(g.x) - 0.12, max(-g.y - 0.12, g.y - 0.18)); inside = min(inside, length(g - vec2(0.0, 0.18)) - 0.12);
  col = mix(col, vec3(1.0, 0.95, 0.75) * 1.4, smoothstep(0.004, -0.004, inside));
  ink(col, sdBox2(g - vec2(-0.16, 0.05), vec2(0.04, 0.2)), vec3(0.75, 0.72, 0.68), g * 3.0); ink(col, sdBox2(g - vec2(0.16, 0.05), vec2(0.04, 0.2)), vec3(0.75, 0.72, 0.68), g * 3.0);
  ink(col, max(abs(length(g - vec2(0.0, 0.2)) - 0.16) - 0.035, -g.y + 0.2), vec3(0.78, 0.75, 0.7), g * 3.0);
  // the turning, flaming sword
  vec2 sq = rot(uT * 2.2) * (g - vec2(0.0, 0.04)); float blade = sdE2(sq, vec2(0.11, 0.03));
  vec3 fire = mix(vec3(1.0, 0.4, 0.1), vec3(1.0, 0.9, 0.5), SAT(1.0 - abs(sq.y) * 50.0)) * (1.2 + 0.4 * noise(vec2(sq.x * 30.0, uT * 8.0)));
  col = mix(col, fire * 1.6, smoothstep(0.012, -0.004, blade + 0.008 * noise(vec2(sq.x * 20.0, uT * 10.0)))); col += vec3(1.0, 0.5, 0.15) * 0.3 * exp(-abs(blade) * 25.0);
  for (int i = 0; i < 2; i++) { vec2 ac = gate + vec2(i == 0 ? -0.28 : 0.28, 0.12 + 0.02 * sin(uT * 1.5 + float(i))); float d = length(p - ac);   // angels as radiant light
    col += vec3(1.0, 0.97, 0.88) * (0.004 / (d * d + 0.0012)) * 0.5 + vec3(1.0, 0.97, 0.85) * smoothstep(0.045, 0.0, d) * 1.6; }
  // Adam walks out, then works the hard ground
  Person A = adam(); A.facing = 1.0; float walking = 1.0 - smoothstep(0.55, 0.65, k); A.walk = walking * uT * 5.0; A.look = 0.2; A.brow = 0.0;
  A.tool = k > 0.6 ? 4 : 0; A.armF = k > 0.6 ? vec2(0.9 + 0.3 * sin(uT * 3.0), 0.5) : vec2(0.2, 0.3);
  float ax = mix(-0.32, 0.45, smoothstep(0.0, 0.6, k)); drawPerson(col, p, vec2(ax, -0.45), 0.44, A);
  return col;
}

// 22 — Kayin and Hevel bring korbanos; fire from heaven takes Hevel's; then Kayin alone, wandering
vec3 sceneKayin(vec2 p, float lt) {
  float k = SAT(lt / max(uDur, 1.0)); float fire = smoothstep(0.32, 0.38, k) * (1.0 - smoothstep(0.55, 0.62, k)); float dark = smoothstep(0.58, 0.7, k); float wander = smoothstep(0.78, 0.84, k);
  vec2 sun = vec2(0.6, 0.25);
  vec3 col = mix(skyGrad(p, vec3(1.0, 0.85, 0.6), vec3(0.62, 0.78, 0.95), vec3(0.32, 0.52, 0.9)), skyGrad(p, vec3(0.45, 0.35, 0.4), vec3(0.25, 0.22, 0.32), vec3(0.08, 0.08, 0.15)), dark);
  col = clouds2D(p, col, mix(vec3(1.0), vec3(0.45, 0.42, 0.5), dark), mix(vec3(0.75, 0.8, 0.9), vec3(0.15, 0.14, 0.2), dark), 0.25 + 0.4 * dark, sun, uT * (1.0 + 3.0 * dark));
  vec3 hz = mix(vec3(0.82, 0.86, 0.95), vec3(0.25, 0.24, 0.32), dark);
  mountains(col, p, 0.0, 0.12, 1.5, 81.0, mix(vec3(0.5, 0.55, 0.62), vec3(0.2, 0.2, 0.26), dark), hz, 0.35, sun.x);
  if (p.y < -0.16) { vec3 fieldL = mix(vec3(0.62, 0.52, 0.3), vec3(0.72, 0.6, 0.32), step(0.5, fract(p.x * 18.0 + p.y * 4.0)));   // Kayin's furrowed field
    vec3 g = grass(p, vec3(0.38, 0.58, 0.22), vec3(0.52, 0.7, 0.28)); col = mix(fieldL, g, smoothstep(-0.1, 0.1, p.x)); col *= 1.0 - 0.5 * dark; }
  PX = 1.5 / uRes.y; LIGHT_TINT = mix(vec3(1.0, 0.95, 0.88), vec3(0.55, 0.52, 0.65), dark); RIM = 0.4; RIM_COL = vec3(1.0, 0.8, 0.55);
  // two stone altars
  vec2 a1 = vec2(-0.28, -0.24), a2 = vec2(0.3, -0.24);
  for (int i = 0; i < 2; i++) { vec2 a = i == 0 ? a1 : a2; for (int r = 0; r < 3; r++) for (int c = 0; c < 3 - r; c++) { vec2 sc = a + vec2((float(c) - (2.0 - float(r)) * 0.5) * 0.06, float(r) * 0.04 - 0.06);
      ink(col, sdBox2(p - sc, vec2(0.028, 0.018)) - 0.004, vec3(0.62, 0.6, 0.56) * (0.85 + 0.2 * hash1(float(r * 3 + c + i * 9))), (p - sc) * 9.0); } }
  for (int i = 0; i < 3; i++) ink(col, length(p - a1 - vec2(-0.03 + float(i) * 0.03, 0.045)) - 0.016, vec3(0.45, 0.35, 0.18), p * 9.0);   // Kayin's poor fruit
  if (k < 0.58) drawAnimal(col, p, a2 + vec2(0.0, 0.025), 0.07, 4, 0.0, 1.0);                                                  // Hevel's finest lamb
  // fire from heaven onto Hevel's korban
  if (fire > 0.0) { float beam = smoothstep(0.06, 0.0, abs(p.x - a2.x) - 0.01 * (1.0 + (p.y - a2.y) * 2.0)) * step(a2.y, p.y);
    col += vec3(1.0, 0.75, 0.35) * beam * fire * 0.9 * (0.8 + 0.2 * noise(vec2(p.x * 30.0, p.y * 10.0 - uT * 6.0)));
    vec2 fq = (p - a2 - vec2(0.0, 0.03)) / 0.12; col += flame(fq, uT, 5.0) * 2.0 * fire; col += vec3(1.0, 0.6, 0.25) * fire * 0.4 * exp(-length(p - a2) * 5.0); }
  if (k > 0.55 && k < 0.8) col += vec3(1.0, 0.45, 0.15) * 0.15 * exp(-length(p - a2) * 8.0) * (0.7 + 0.3 * sin(uT * 7.0));     // embers
  // the brothers
  Person K = kayin(); K.facing = 1.0; K.brow = smoothstep(0.38, 0.45, k); K.look = 0.8; K.armF = vec2(0.6, 0.6); K.armB = vec2(0.3, 0.4);
  float kx = -0.55; if (wander > 0.0) { K.facing = -1.0; K.walk = uT * 4.0; K.tool = 4; K.armF = vec2(0.7, 0.4); K.brow = 0.0; K.look = -0.6; kx = -0.55 - (k - 0.8) * 3.0; }
  drawPerson(col, p, vec2(kx, -0.46), 0.46, K);
  if (k < 0.58) { Person H = hevel(); H.facing = -1.0; H.tool = 4; H.armF = vec2(0.5, 0.3); H.look = -0.4; H.talk = 0.0;
    drawPerson(col, p, vec2(0.6, -0.46), 0.44, H);
    for (int i = 0; i < 3; i++) drawAnimal(col, p, vec2(0.75 + float(i) * 0.08, -0.47 - 0.01 * float(i)), 0.09, 4, 0.0, -1.0); }
  col += rainStreaks(p, dark * 0.25);
  return col;
}

// 23 — ten generations from Adam to Noach: lanterns light along a winding path beneath a great tree as days and years fly by
vec2 genPos(int i) { float fi = float(i); return vec2(-0.78 + fi * 0.172, -0.38 + 0.065 * sin(fi * 1.3) + fi * 0.048); }
vec3 sceneGenerations(vec2 p, float lt) {
  float k = SAT(lt / max(uDur, 1.0));
  float cyc = fract(uT * 0.12); float day = 0.5 + 0.5 * sin(cyc * 6.2832);                                      // days and nights flying by
  vec3 col = mix(skyGrad(p, vec3(0.2, 0.18, 0.38), vec3(0.08, 0.1, 0.25), vec3(0.02, 0.03, 0.1)), skyGrad(p, vec3(1.0, 0.82, 0.62), vec3(0.6, 0.76, 0.95), vec3(0.32, 0.5, 0.88)), day);
  col += stars(p, uT) * (1.0 - day) * 1.2;
  vec2 sun = vec2(-0.9 + cyc * 1.8, -0.1 + 0.5 * sin(cyc * 3.1416)); col += vec3(1.0, 0.85, 0.55) * smoothstep(0.05, 0.045, length(p - sun)) * day * 1.4 + vec3(1.0, 0.8, 0.5) * exp(-length(p - sun) * 4.0) * 0.4 * day;
  vec3 hz = mix(vec3(0.2, 0.2, 0.35), vec3(0.78, 0.82, 0.92), day);
  mountains(col, p, 0.0, 0.14, 1.3, 91.0, mix(vec3(0.15, 0.15, 0.25), vec3(0.5, 0.55, 0.62), day), hz, 0.35, sun.x);
  if (p.y < -0.12) col = grass(p, vec3(0.35, 0.55, 0.22), vec3(0.5, 0.68, 0.28)) * mix(0.4, 1.0, day);
  // the great tree of generations
  vec2 tb = vec2(0.55, -0.42); float tr = sdSeg2(p, tb, tb + vec2(-0.02, 0.45), 0.06, 0.035);
  for (int i = 0; i < 5; i++) { float a = -1.0 + float(i) * 0.5; vec2 s = tb + vec2(-0.02, 0.3 + 0.03 * float(i)); tr = min(tr, sdSeg2(p, s, s + vec2(sin(a), cos(a)) * 0.28, 0.025, 0.008)); }
  col = mix(col, vec3(0.32, 0.22, 0.13) * mix(0.45, 1.0, day), smoothstep(0.004, -0.004, tr));
  float can = 1e5; for (int i = 0; i < 7; i++) { float a = float(i) * 0.9; can = min(can, length(p - tb - vec2(-0.02, 0.58) - vec2(cos(a) * 0.22, sin(a) * 0.13)) - 0.15); }
  can += 0.03 * (fbm(p * 9.0) - 0.5);
  if (can < 0.0) { vec3 lc = vec3(0.28, 0.5, 0.22) * (0.65 + 0.4 * noise(p * 22.0)) * mix(0.45, 1.0, day); col = lc; }
  // path and the ten lanterns (names appear in the overlay)
  for (int i = 0; i < 9; i++) { vec2 a = genPos(i), b = genPos(i + 1); float d = sdSeg2(p, a, b, 0.012, 0.012); col = mix(col, vec3(0.75, 0.65, 0.45) * mix(0.45, 1.0, day), smoothstep(0.004, -0.004, d)); }
  for (int i = 0; i < 10; i++) { float on = smoothstep(0.06 + float(i) * 0.08, 0.1 + float(i) * 0.08, k); vec2 c = genPos(i); float d = length(p - c);
    vec3 lc = i == 6 ? vec3(1.0, 0.95, 0.7) : (i == 9 ? vec3(0.7, 0.9, 1.0) : vec3(1.0, 0.75, 0.4));
    col = mix(col, vec3(0.25, 0.2, 0.15), smoothstep(0.022, 0.018, d)); col = mix(col, lc * (0.5 + 1.2 * on), smoothstep(0.016, 0.012, d));
    col += lc * on * (0.003 / (d * d + 0.002)) * 0.25 * (0.9 + 0.1 * sin(uT * 4.0 + float(i))); }
  return col;
}
