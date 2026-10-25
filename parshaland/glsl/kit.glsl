// ── Scenery kit: grass, mountains, trees, sun rays, palms ──
vec3 grass(vec2 p, vec3 a, vec3 b) {
  vec3 c = mix(a, b, fbm(p * vec2(4.0, 14.0)));
  float blades = noise(vec2(p.x * 320.0 + 9.0 * noise(p * 12.0), p.y * 26.0));                 // vertical blade strokes
  c *= 0.82 + 0.3 * blades; c += vec3(0.08, 0.1, 0.02) * smoothstep(0.75, 0.95, blades);           // light catching blade tips
  vec2 fc = p * vec2(70.0, 90.0); vec2 id = floor(fc); float h = hash(id);                         // scattered wildflowers
  if (h > 0.965 && p.y < -0.12) c = mix(c, mix(vec3(1.0, 0.95, 0.85), 0.65 + 0.35 * cos(6.28 * (h * 9.0 + vec3(0.0, 0.33, 0.67))), step(0.982, h)), smoothstep(0.32, 0.18, length(fract(fc) - 0.5)));
  vec2 cs = p * vec2(1.4, 3.5) + vec2(uT * 0.025, 0.0); c *= 0.84 + 0.16 * smoothstep(0.35, 0.62, 0.65 * noise(cs) + 0.35 * noise(cs * 2.3));     // cloud shadows drifting over the fields
  return c; }
// ── scenery kit ──
float ridgeH(float x, float base, float amp, float freq, float seed) {                             // sharp mountain ridgeline
  float n = 0.0, a = 0.6, f = freq; for (int i = 0; i < 4; i++) { n += a * (1.0 - abs(noise(vec2(x * f + seed, seed)) * 2.0 - 1.0)); f *= 2.1; a *= 0.45; }
  return base + amp * (n - 0.55); }
void mountains(inout vec3 col, vec2 p, float base, float amp, float freq, float seed, vec3 rock, vec3 hazeCol, float haze, float sunX) {
  float h = ridgeH(p.x, base, amp, freq, seed); if (p.y > h) return;
  float slope = (ridgeH(p.x + 0.004, base, amp, freq, seed) - ridgeH(p.x - 0.004, base, amp, freq, seed)) / 0.008;
  float lit = SAT(0.55 - slope * sign(sunX - p.x) * 0.6);                                          // slopes facing the sun are brighter
  vec3 c = rock * (0.62 + 0.55 * lit) * (0.9 + 0.12 * fbm(p * vec2(18.0, 30.0) + seed));
  c += vec3(1.0, 0.85, 0.6) * smoothstep(0.006, 0.0, h - p.y) * 0.25 * lit;                        // sunlit ridge edge
  col = mix(c, hazeCol, SAT(haze + (h - p.y) * 1.2 * haze)); }                                     // haze thickens down into the valley
void treeRow(inout vec3 col, vec2 p, float ground, float size, float spacing, float seed, vec3 leaf, vec3 hazeCol, float haze, float sunX, float density) {
  float cell = floor(p.x / spacing);
  for (int k = -1; k <= 1; k++) { float id = cell + float(k); float h1 = hash1(id * 13.1 + seed); if (h1 > density) continue;
    float x0 = (id + 0.2 + 0.6 * hash1(id * 7.7 + seed)) * spacing; float s = size * (0.7 + 0.6 * hash1(id * 3.3 + seed));
    float gy = ground + 0.01 * sin(x0 * 9.0 + seed); vec2 q = (p - vec2(x0, gy)) / s;
    if (abs(q.x) > 0.75 || q.y < -0.1 || q.y > 1.2) continue;
    bool cyp = hash1(id * 5.1 + seed) > 0.62;
    float trunk = sdBox2(q - vec2(0.0, 0.18), vec2(0.035, 0.18));
    vec2 cc = cyp ? vec2(0.0, 0.62) : vec2(0.0, 0.52);
    float can = cyp ? sdE2(q - cc, vec2(0.13, 0.48)) : min(min(length(q - cc) - 0.3, length(q - cc - vec2(-0.2, -0.08)) - 0.2), length(q - cc - vec2(0.21, -0.05)) - 0.21);
    can += 0.035 * (fbm(q * 9.0 + id) - 0.5);
    float sh = smoothstep(0.6, 0.0, length((q - vec2(0.12, 0.0)) / vec2(0.5, 0.06)));               // shadow on the ground
    col *= 1.0 - 0.25 * sh * (1.0 - haze);
    if (trunk < 0.0) col = mix(vec3(0.3, 0.2, 0.12) * (0.8 + 0.3 * step(0.0, q.x * sign(sunX - x0))), hazeCol, haze);
    if (can < 0.0) { vec2 nn = normalize(q - cc + 1e-4); float lit = SAT(0.5 + 0.6 * dot(nn, normalize(vec2(sunX - x0, 0.8))));
      vec3 c = leaf * (0.55 + 0.6 * lit) * (0.8 + 0.35 * noise(q * 28.0 + id));                      // leafy clumps
      c = mix(c * 0.6, c, smoothstep(-0.05, 0.0, can + 0.02 * noise(q * 40.0)));                      // darker heart
      col = mix(c, hazeCol, haze); }
    col = mix(col, mix(leaf * 0.3, hazeCol, haze), smoothstep(0.012, 0.0, abs(can)) * (1.0 - haze) * 0.7); } }
vec3 sunRays(vec2 p, vec2 sun, vec3 c, float strength) {
  float ang = atan(p.x - sun.x, p.y - sun.y); float r = length(p - sun);
  float rays = pow(0.5 + 0.5 * sin(ang * 14.0 + noise(vec2(ang * 3.0, uT * 0.1)) * 6.0), 4.0);
  return c * rays * exp(-r * 1.6) * strength; }
// palm tree: curved trunk with rings and a crown of drooping fronds (lit from sunX side)
void palm(inout vec3 col, vec2 p, vec2 base, float h, float lean, vec3 trunkC, vec3 leafC, float haze, vec3 hazeCol, float sunX) {
  vec2 q = (p - base) / h; if (q.y < -0.05 || q.y > 1.35 || abs(q.x - lean * 0.5) > 0.9) return;
  float cx = lean * q.y * q.y; float tw = 0.045 - 0.015 * q.y;
  float trunk = max(abs(q.x - cx) - tw, max(-q.y, q.y - 1.0));
  float aa = 1.5 / (uRes.y * h);
  if (trunk < aa) { float ring = 0.8 + 0.2 * smoothstep(0.3, 0.7, fract(q.y * 18.0)); float side = SAT(0.5 + (q.x - cx) / tw * 0.5 * sign(sunX - base.x));
    col = mix(col, mix(trunkC * ring * (0.6 + 0.5 * side), hazeCol, haze), smoothstep(aa, -aa, trunk)); }
  vec2 top = vec2(lean, 1.0); float fr = 1e5;
  for (int i = 0; i < 7; i++) { float a = -2.6 + float(i) * 0.87; vec2 dir = vec2(cos(a), sin(a)); vec2 r = q - top; float t = SAT(dot(r, dir) / 0.55);
    vec2 c = top + dir * t * 0.55 - vec2(0.0, 0.32 * t * t); float w = 0.07 * sin(t * 3.1416) + 0.008;
    float d = length(r + top - c) - w; d += 0.005 * sin(t * 38.0) * smoothstep(0.1, 0.3, t); fr = min(fr, d); }
  if (fr < aa) { float lit = SAT(0.55 + 0.4 * (q.x - lean) * sign(sunX - base.x)); col = mix(col, mix(leafC * (0.55 + 0.55 * lit), hazeCol, haze), smoothstep(aa, -aa, fr)); } }
