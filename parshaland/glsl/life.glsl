// ── Life kit: camera depth, skies, water, dunes, foreground framing, and the little things that make a scene feel alive ──
// Camera: a scene sets CAM (pan, in screen units at depth 1) and draws each layer at lay(p, depth): sky ≈ 0.05, far hills 0.2, mid 0.5, the action 1, foreground 1.5.
vec2 CAM = vec2(0.0); float CAMZ = 1.0;   // CAMZ < 1 zooms in
vec2 lay(vec2 p, float depth) { return p * CAMZ + CAM * depth; }
float LS(int i) { return uLS[i] / max(uDur, 1.0); }          // the fraction of the scene at which narration line i starts
float at(float k, float a, float d) { return smoothstep(a, a + d, k); }

// a 4-point twinkle (star sparkle) of radius r, returns light
float twinkle(vec2 p, vec2 c, float r) { vec2 d = abs(p - c) / r; float cross_ = max(0.0, 1.0 - d.x * 7.0 - d.y) + max(0.0, 1.0 - d.y * 7.0 - d.x);
  return cross_ * cross_ * 0.8 + 0.04 / (dot(d, d) * 40.0 + 0.04) * 0.6; }
// a field of sparkles that pop on and off (magic, treasure, light from Hashem)
vec3 sparkles(vec2 p, float t, float density, float size, vec3 c) {
  vec3 acc = vec3(0.0);
  for (int L = 0; L < 2; L++) { float sc = 7.0 + float(L) * 6.0; vec2 g = p * sc + float(L) * 5.7; vec2 id = floor(g); float h = hash(id);
    if (h < density) { vec2 c0 = (id + 0.25 + 0.5 * hash2(id + 3.1)) / sc; float life = fract(t * (0.4 + 0.5 * h) + h * 9.0);
      acc += c * twinkle(p, c0, size * (1.0 - float(L) * 0.35)) * sin(life * PI); } }
  return acc; }
// fireflies drifting low over the ground at night
vec3 fireflies(vec2 p, float t, float density, vec3 c) {
  vec3 acc = vec3(0.0); vec2 g = p * 9.0; vec2 id = floor(g);
  for (int j = -1; j <= 1; j++) for (int i = -1; i <= 1; i++) { vec2 cid = id + vec2(i, j); float h = hash(cid); if (h > density) continue;
    vec2 c0 = (cid + 0.5 + 0.4 * vec2(sin(t * 0.7 + h * 30.0), cos(t * 0.53 + h * 17.0))) / 9.0; float d = length(p - c0);
    acc += c * (0.00004 / (d * d + 0.00003)) * (0.5 + 0.5 * sin(t * 3.0 + h * 50.0)); }
  return acc; }
// tumbling petals / confetti falling (amount 0..1)
void petals(inout vec3 col, vec2 p, float t, float amount) {
  if (amount <= 0.0) return;
  for (int L = 0; L < 2; L++) { float sc = 6.0 + float(L) * 5.0; vec2 g = p * sc + vec2(t * 0.25 + float(L) * 3.3, t * (0.5 + 0.2 * float(L))); vec2 id = floor(g); float h = hash(id);
    if (h > amount * 0.6) continue;
    vec2 f = fract(g) - 0.5 - 0.3 * (hash2(id) - 0.5); f = rot(t * (1.0 + 2.0 * h) + h * 10.0) * f; f.y *= 1.0 + 1.5 * abs(sin(t * 2.0 + h * 20.0));
    float d = length(f / vec2(0.09, 0.05)) - 1.0; vec3 pc = 0.6 + 0.4 * cos(6.28 * (h * 5.0 + vec3(0.0, 0.33, 0.67)));
    col = mix(col, pc, smoothstep(0.15, -0.15, d) * 0.95); } }
// a flock of small birds (silhouette Vs with flapping wings) crossing the sky
void flock(inout vec3 col, vec2 p, float t, vec2 start, vec2 vel, float n, float size, vec3 c) {
  for (int i = 0; i < 9; i++) { if (float(i) >= n) break; float fi = float(i);
    vec2 off = vec2(-abs(fi - 4.0) * 0.045 - 0.02 * hash1(fi), (fi - 4.0) * 0.018 + 0.015 * sin(t * 1.3 + fi)) * size * 12.0;
    vec2 bp = start + vel * t + off; vec2 q = (p - bp) / size; if (abs(q.x) > 1.4 || abs(q.y) > 1.0) continue;
    float flap = sin(t * 9.0 + fi * 1.7) * 0.5;
    float w = min(sdSeg2(vec2(abs(q.x), q.y), vec2(0.0), vec2(0.6, 0.25 + flap * 0.6), 0.09, 0.03), sdSeg2(vec2(abs(q.x), q.y), vec2(0.6, 0.25 + flap * 0.6), vec2(1.1, 0.05 + flap), 0.03, 0.01));
    col = mix(col, c, smoothstep(0.06, -0.02, w)); } }
// butterflies fluttering around a point (colourful, wings opening and closing)
void butterflies(inout vec3 col, vec2 p, float t, vec2 center, vec2 range, float n, float size) {
  for (int i = 0; i < 6; i++) { if (float(i) >= n) break; float fi = float(i); float h = hash1(fi * 7.7 + 1.0);
    vec2 bp = center + range * vec2(sin(t * (0.35 + 0.2 * h) + fi * 2.1), 0.6 * sin(t * (0.6 + 0.3 * h) + fi * 1.3) + 0.4 * sin(t * 1.7 + fi));
    vec2 q = (p - bp) / size; if (dot(q, q) > 2.0) continue;
    float open_ = 0.25 + 0.75 * abs(sin(t * 12.0 + fi * 3.0)); vec2 wq = vec2(abs(q.x) / open_, q.y);
    float wings = min(length((wq - vec2(0.42, 0.22)) / vec2(0.42, 0.36)) - 1.0, length((wq - vec2(0.33, -0.25)) / vec2(0.3, 0.26)) - 1.0);
    vec3 wc = 0.55 + 0.45 * cos(6.28 * (h * 3.0 + vec3(0.0, 0.33, 0.67))); wc = mix(wc, vec3(1.0), 0.15);
    col = mix(col, wc * 0.3, smoothstep(0.2, 0.0, wings)); col = mix(col, wc * (0.85 + 0.25 * smoothstep(0.0, -0.6, wings)), smoothstep(0.05, -0.1, wings));
    col = mix(col, vec3(0.15, 0.1, 0.08), smoothstep(0.06, 0.0, sdSeg2(q, vec2(0.0, -0.35), vec2(0.0, 0.35), 0.05, 0.03))); } }
// a shooting star streaking across (period in seconds)
vec3 shootingStar(vec2 p, float t, float period, float seed) {
  float n = floor(t / period); float f = fract(t / period); if (f > 0.18) return vec3(0.0);
  vec2 a = vec2(-0.6 + 1.2 * hash1(n + seed), 0.45 + 0.1 * hash1(n * 1.7 + seed)); vec2 dir = normalize(vec2(0.8, -0.35)); vec2 head = a + dir * f / 0.18 * 0.7;
  vec2 rel = p - head; float along = dot(rel, -dir); float across = abs(dot(rel, vec2(-dir.y, dir.x)));
  float tail = step(0.0, along) * exp(-along * 9.0) * smoothstep(0.004, 0.0, across - along * 0.012);
  return vec3(1.0, 0.95, 0.85) * (tail * 1.4 + 0.0006 / (dot(rel, rel) + 0.0004)) * sin(f / 0.18 * PI); }
// soft light shafts falling from a source (god rays)
vec3 godRays(vec2 p, vec2 src, vec3 c, float strength) {
  vec2 d = p - src; float ang = atan(d.x, -d.y); float r = length(d);
  float shafts = 0.5 + 0.5 * sin(ang * 9.0 + 2.0 * sin(ang * 3.0 + uT * 0.15)); shafts = pow(shafts, 3.0) * (0.6 + 0.4 * noise(vec2(ang * 6.0, uT * 0.2)));
  return c * shafts * exp(-r * 1.2) * smoothstep(1.4, 0.0, abs(ang)) * strength; }
// lens flare for a bright sun visible in frame
vec3 lensFlare(vec2 p, vec2 sun, vec3 c) {
  vec3 acc = c * 0.012 / (abs(p.y - sun.y) * 3.0 + 0.02) * exp(-abs(p.x - sun.x) * 1.5) * 0.25;   // horizontal streak
  for (int i = 1; i < 5; i++) { vec2 g = sun * (1.0 - float(i) * 0.55); float r = 0.02 + 0.025 * float(i);
    acc += (0.5 + 0.5 * cos(6.28 * (float(i) * 0.21 + vec3(0.0, 0.33, 0.67)))) * smoothstep(r, r * 0.6, length(p - g)) * 0.06; }
  return acc; }
// big puffy cartoon clouds drifting (more character than wispy fbm clouds): lit tops, soft shaded bellies
void puffClouds(inout vec3 col, vec2 p, float t, float y, float scale, float speed, vec3 lit, vec3 shade, float seed) {
  float cell = 0.9 * scale; float xx = p.x + t * speed; float id0 = floor(xx / cell);
  for (int k = -1; k <= 1; k++) { float id = id0 + float(k); float h = hash1(id * 3.7 + seed); if (h > 0.75) continue;
    vec2 c = vec2((id + 0.5) * cell - t * speed + (h - 0.5) * cell * 0.4, y + 0.06 * scale * (hash1(id + seed * 2.0) - 0.5)); vec2 q = (p - c) / scale;
    if (abs(q.x) > 0.6 || abs(q.y) > 0.3) continue;
    float d = q.y + 0.02;                                                                                  // flat base
    float puff = 1e5; for (int j = 0; j < 5; j++) { float fj = float(j); vec2 pc = vec2(-0.3 + fj * 0.15, 0.03 + 0.07 * sin(fj * 2.3 + h * 7.0)); puff = min(puff, length(q - pc) - (0.08 + 0.05 * hash1(fj + id * 5.0 + seed))); }
    float cl = max(puff, -d - 0.0) ; cl = smin(cl, max(sdE2(q - vec2(0.0, 0.0), vec2(0.38, 0.06)), -q.y - 0.03), 0.04);
    float shadeK = SAT(0.5 - q.y * 6.0 + 0.3 * (q.x));
    vec3 cc = mix(lit, shade, shadeK * 0.8); col = mix(col, cc, smoothstep(0.012, -0.012, cl) * 0.96); } }
// sparkling water band between y0 (far bank) and y1 (near bank); reflects the sky colour
vec3 water(vec2 p, float t, vec3 deep, vec3 shallow, vec3 sky, float y0, float y1) {
  float d = SAT((y0 - p.y) / max(y0 - y1, 1e-3)); vec3 c = mix(mix(sky, shallow, 0.5), deep, d);
  float w = noise(vec2(p.x * (30.0 - d * 18.0) + t * 0.6, p.y * 140.0 - t * 0.8)); c += vec3(1.0) * pow(w, 10.0) * (0.6 + 0.4 * d);
  c += vec3(1.0, 0.95, 0.85) * step(0.995, hash(floor(vec2(p.x * 300.0, p.y * 500.0 + floor(t * 4.0))))) * 0.8;   // glints
  return c; }
// rolling sand dunes with sunlit crests and soft shadowed lees
void dunes(inout vec3 col, vec2 p, float base, float amp, float freq, float seed, vec3 sand, vec3 hazeCol, float haze, float sunX) {
  float h = base + amp * (sin(p.x * freq + seed) * 0.6 + sin(p.x * freq * 2.3 + seed * 1.7) * 0.3 + 0.2 * noise(vec2(p.x * freq * 3.0, seed)));
  if (p.y > h) return; float dh = amp * freq * (cos(p.x * freq + seed) * 0.6 + cos(p.x * freq * 2.3 + seed * 1.7) * 0.69);
  float lit = SAT(0.6 - dh * sign(sunX - p.x) * 0.5); vec3 c = sand * (0.7 + 0.45 * lit) * (0.94 + 0.08 * noise(p * vec2(40.0, 200.0)));
  c += vec3(1.0, 0.9, 0.7) * smoothstep(0.008, 0.0, h - p.y) * 0.22;                                    // bright crest
  col = mix(c, hazeCol, SAT(haze)); }
// foreground framing: tall grass blades swaying along the bottom edge, with flowers
void fgGrass(inout vec3 col, vec2 p, float t, float y, vec3 c, float flowers) {
  if (p.y > y + 0.16) return;
  for (int L = 0; L < 2; L++) { float sc = 55.0 - float(L) * 20.0; float x = p.x * sc; float id = floor(x); float f = fract(x) - 0.5;
    float h = (0.07 + 0.1 * hash1(id * 1.3 + float(L) * 7.0)) * (1.0 + 0.4 * float(L)); float yy = (p.y - y + 0.02 * float(L)) / h; if (yy > 1.0 || yy < 0.0) { if (yy < 0.0) col = mix(col, c * (0.5 + 0.15 * float(L)), 1.0); continue; }
    float bend = (0.25 + 0.15 * sin(t * 1.4 + id * 0.7)) * yy * yy; float w = 0.35 * (1.0 - yy);
    float blade = abs(f - bend * 2.0) - w;
    if (blade < 0.0) col = c * (0.55 + 0.35 * yy + 0.15 * float(L)) * (0.9 + 0.2 * hash1(id));
    if (flowers > 0.0 && hash1(id * 9.1 + float(L)) < flowers * 0.25 && yy > 0.82) { vec2 fq = vec2((f - bend * 2.0) / sc, (yy - 0.95) * h); float fd = length(fq) - 0.006;
      vec3 fc = 0.6 + 0.4 * cos(6.28 * (hash1(id * 3.3) + vec3(0.0, 0.33, 0.67))); col = mix(col, fc, smoothstep(0.002, -0.002, fd)); col = mix(col, vec3(1.0, 0.85, 0.3), smoothstep(0.002, -0.001, length(fq) - 0.0022)); } } }
// a little house (flat-roofed, mud-brick) with a glowing window; used for towns
void house(inout vec3 col, vec2 p, vec2 pos, vec2 sz, vec3 wall, vec3 hazeCol, float haze, float lights) {
  vec2 q = p - pos; if (abs(q.x) > sz.x + 0.01 || q.y < 0.0 || q.y > sz.y + 0.02) return;
  float body = sdBox2(q - vec2(0.0, sz.y * 0.5), sz * vec2(1.0, 0.5)); vec3 c = wall * (0.85 + 0.2 * step(0.0, -q.x)) * (0.95 + 0.06 * noise(q * 200.0));
  float roof = sdBox2(q - vec2(0.0, sz.y), vec2(sz.x + 0.006, 0.006));
  float win = sdBox2(q - vec2(sz.x * 0.35, sz.y * 0.6), vec2(sz.x * 0.16, sz.y * 0.14)); float door = sdBox2(q - vec2(-sz.x * 0.3, sz.y * 0.22), vec2(sz.x * 0.17, sz.y * 0.22));
  if (body < 0.0) col = mix(c, hazeCol, haze); if (roof < 0.0) col = mix(wall * 0.7, hazeCol, haze);
  if (win < 0.0) col = mix(mix(vec3(0.25, 0.18, 0.15), vec3(1.0, 0.75, 0.4) * 1.3, lights), hazeCol, haze * 0.7);
  if (door < 0.0) col = mix(vec3(0.35, 0.22, 0.14), hazeCol, haze); }
// a soft round tent (goat-hair, striped) with an open door; glow > 0 lights the inside
void tent(inout vec3 col, vec2 p, vec2 pos, float s, vec3 cloth, float glow) {
  vec2 q = (p - pos) / s; PX = 1.5 / (uRes.y * s); if (abs(q.x) > 1.2 || q.y < -0.05 || q.y > 0.9) return;
  col *= 1.0 - 0.3 * smoothstep(1.0, 0.0, length(vec2(q.x / 1.1, q.y / 0.06)));
  float body = max(sdE2(q - vec2(0.0, 0.0), vec2(1.0, 0.72)), -q.y); body = smin(body, sdE2(q - vec2(0.0, 0.62), vec2(0.18, 0.12)), 0.1);
  vec3 c = cloth * (0.85 + 0.15 * step(0.5, fract(q.x * 4.0 + 0.1 * q.y)));
  ink(col, body, c, q);
  float door = max(sdE2(q - vec2(0.12, 0.0), vec2(0.22, 0.48)), -q.y);
  col = mix(col, mix(vec3(0.18, 0.1, 0.06), vec3(1.0, 0.72, 0.38) * 1.5, glow), smoothstep(PX, -PX, door));
  ink(col, min(sdCap2(q, vec2(-0.95, 0.0), vec2(-0.6, 0.55), 0.015), sdCap2(q, vec2(0.95, 0.0), vec2(0.6, 0.55), 0.015)), vec3(0.45, 0.3, 0.18), q);   // guy ropes
  if (glow > 0.0) col += vec3(1.0, 0.65, 0.3) * glow * 0.25 * exp(-length(q - vec2(0.12, 0.2)) * 2.5); }
// a donkey with saddle bags (facing +x, feet at pos)
void drawDonkey(inout vec3 col, vec2 p, vec2 pos, float h, float ph, float facing, vec3 bag) {
  vec2 q = (p - pos) / h; q.x *= facing; PX = 1.5 / (uRes.y * h); if (abs(q.x) > 0.8 || q.y < -0.05 || q.y > 1.1) return;
  col *= 1.0 - 0.22 * smoothstep(1.0, 0.0, length(vec2(q.x / 0.45, q.y / 0.04)));
  vec3 c = vec3(0.55, 0.5, 0.48); float s1 = sin(ph), s2 = sin(ph + PI);
  leg(col, q, vec2(-0.22, 0.35), 0.35, s2, 0.04, c * 0.8); leg(col, q, vec2(0.2, 0.35), 0.35, s2, 0.04, c * 0.8);
  ink(col, sdSeg2(q, vec2(-0.33, 0.52), vec2(-0.42, 0.3 + 0.03 * sin(uT * 3.0)), 0.015, 0.01), c * 0.8, q);
  float body = sdE2(q - vec2(0.0, 0.5), vec2(0.34, 0.15)); float neck = sdSeg2(q, vec2(0.25, 0.55), vec2(0.38, 0.78), 0.08, 0.06);
  float head = sdSeg2(q, vec2(0.38, 0.8), vec2(0.55, 0.68), 0.075, 0.05);
  ink(col, min(min(body, neck), head), c, q);
  ink(col, min(sdSeg2(q, vec2(0.36, 0.86), vec2(0.3, 1.02), 0.025, 0.012), sdSeg2(q, vec2(0.41, 0.86), vec2(0.42, 1.03), 0.025, 0.012)), c * 0.9, q);   // long ears
  col = mix(col, vec3(0.9, 0.88, 0.85), smoothstep(PX, -PX, sdE2(q - vec2(0.55, 0.67), vec2(0.05, 0.04))));                                       // pale muzzle
  ink(col, sdBox2(q - vec2(-0.02, 0.5), vec2(0.13, 0.12)) - 0.03, bag, q); ink(col, sdBox2(q - vec2(-0.02, 0.64), vec2(0.18, 0.025)), bag * 0.6, q);
  leg(col, q, vec2(-0.15, 0.35), 0.35, s1, 0.045, c); leg(col, q, vec2(0.26, 0.35), 0.35, s1, 0.045, c);
  eye(col, q, vec2(0.45, 0.78), 0.016); }
// a goat (little, with horns and beard)
void drawGoat(inout vec3 col, vec2 p, vec2 pos, float h, float ph, float facing, vec3 c) {
  vec2 q = (p - pos) / h; q.x *= facing; PX = 1.5 / (uRes.y * h); if (abs(q.x) > 0.7 || q.y < -0.05 || q.y > 0.95) return;
  col *= 1.0 - 0.22 * smoothstep(1.0, 0.0, length(vec2(q.x / 0.35, q.y / 0.04)));
  float s1 = sin(ph), s2 = sin(ph + PI);
  leg(col, q, vec2(-0.16, 0.28), 0.28, s2, 0.03, c * 0.75); leg(col, q, vec2(0.14, 0.28), 0.28, s2, 0.03, c * 0.75);
  ink(col, min(sdE2(q - vec2(0.0, 0.4), vec2(0.25, 0.12)), sdSeg2(q, vec2(-0.24, 0.45), vec2(-0.3, 0.55), 0.03, 0.015)), c, q);
  ink(col, sdSeg2(q, vec2(0.2, 0.45), vec2(0.32, 0.62), 0.07, 0.06), c, q);
  ink(col, sdE2(q - vec2(0.37, 0.6), vec2(0.1, 0.065)), c, q);
  ink(col, min(sdSeg2(q, vec2(0.33, 0.66), vec2(0.25, 0.8), 0.02, 0.008), sdSeg2(q, vec2(0.37, 0.67), vec2(0.31, 0.82), 0.02, 0.008)), vec3(0.7, 0.62, 0.5), q);
  ink(col, sdSeg2(q, vec2(0.42, 0.55), vec2(0.42, 0.47), 0.02, 0.006), c * 0.7, q);
  leg(col, q, vec2(-0.1, 0.28), 0.28, s1, 0.033, c); leg(col, q, vec2(0.19, 0.28), 0.28, s1, 0.033, c);
  eye(col, q, vec2(0.39, 0.63), 0.014); }
// a sailboat on the river (felucca: a curved hull and a tall triangular sail)
void sailboat(inout vec3 col, vec2 p, vec2 pos, float s, vec3 sail) {
  vec2 q = (p - pos) / s; PX = 1.5 / (uRes.y * s); if (abs(q.x) > 0.7 || q.y < -0.15 || q.y > 1.1) return;
  float hull = max(sdE2(q - vec2(0.0, 0.08), vec2(0.5, 0.1)), q.y - 0.08); ink(col, hull, vec3(0.5, 0.3, 0.16), q);
  ink(col, sdCap2(q, vec2(0.0, 0.05), vec2(0.0, 0.95), 0.012), vec3(0.4, 0.26, 0.14), q);
  float sl = max(max(-q.x + 0.02, q.y - 1.0 + q.x * 1.6), 0.15 - q.y + 0.0 * q.x); sl = max(sl, q.x - 0.45 + 0.1 * sin(q.y * 3.0));
  ink(col, sl, sail * (0.9 + 0.1 * sin(q.y * 20.0)), q);
  col = mix(col, vec3(0.08, 0.06, 0.05), 0.25 * smoothstep(0.02, 0.0, abs(q.y + 0.03 + 0.01 * sin(q.x * 30.0 + uT * 2.0))) * step(abs(q.x), 0.55)); }   // reflection line
