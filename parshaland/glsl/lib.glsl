// ── Parshaland shader library: noise, shapes, light, sky, scenery ───────────
#define SAT(x) clamp(x, 0.0, 1.0)
#define PI 3.14159265
uniform vec2 uRes;      // canvas size in pixels
uniform float uT;       // film time (seconds)
uniform float uLT;      // time since this scene began
uniform float uDur;     // this scene's length
const mat2 M2 = mat2(0.8, 0.6, -0.6, 0.8);
float hash(vec2 p) { p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }
float hash1(float n) { return fract(sin(n) * 43758.5453123); }
vec2 hash2(vec2 p) { return vec2(hash(p), hash(p + 17.13)); }
float noise(vec2 p) { vec2 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1, 0)), f.x), mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), f.x), f.y); }
float fbm(vec2 p) { float s = 0.0, a = 0.5; for (int i = 0; i < 5; i++) { s += a * noise(p); p = M2 * p * 2.03 + 11.7; a *= 0.5; } return s; }
float win(float t, float a, float b, float f) { return smoothstep(a, a + f, t) * (1.0 - smoothstep(b - f, b, t)); }
mat2 rot(float a) { float c = cos(a), s = sin(a); return mat2(c, -s, s, c); }
// signed distances (2D)
float sdE2(vec2 p, vec2 r) { float k0 = length(p / r), k1 = length(p / (r * r)); return k0 * (k0 - 1.0) / max(k1, 1e-5); }
float sdSeg2(vec2 p, vec2 a, vec2 b, float r0, float r1) { vec2 pa = p - a, ba = b - a; float h = SAT(dot(pa, ba) / dot(ba, ba)); return length(pa - ba * h) - mix(r0, r1, h); }
float sdBox2(vec2 p, vec2 b) { vec2 d = abs(p) - b; return length(max(d, 0.0)) + min(max(d.x, d.y), 0.0); }
float smin(float a, float b, float k) { float h = SAT(0.5 + 0.5 * (b - a) / k); return mix(b, a, h) - k * h * (1.0 - h); }
float fill(float d) { return smoothstep(0.0015, -0.0015, d); }
float sdCap2(vec2 p, vec2 a, vec2 b, float r) { vec2 pa = p - a, ba = b - a; float h = SAT(dot(pa, ba) / dot(ba, ba)); return length(pa - ba * h) - r; }
float sdTrap(vec2 p, float y0, float y1, float w0, float w1, float r) {
  float k = SAT((p.y - y0) / (y1 - y0)); float w = mix(w0, w1, k);
  return max(max(abs(p.x) - w, max(y0 - p.y, p.y - y1)), -1.0) - r * 0.0;
}
// a living flame in local coords q (base at 0, about 1 tall); returns emitted light
vec3 flame(vec2 q, float t, float seed) {
  q.x += 0.12 * sin(q.y * 6.0 - t * 7.0 + seed) * q.y;
  float n = noise(vec2(q.x * 3.0 + seed, q.y * 2.5 - t * 3.5));
  float shape = length(vec2(q.x * (1.6 + q.y * 1.8), (q.y - 0.35) * 0.9)) - 0.42 + 0.25 * n * q.y;
  float core = smoothstep(0.05, -0.25, shape); float body = smoothstep(0.12, -0.05, shape) * step(-0.1, q.y);
  return (vec3(1.0, 0.45, 0.12) * body + vec3(1.0, 0.85, 0.45) * core * 1.2 + vec3(1.0, 0.95, 0.8) * smoothstep(-0.2, -0.38, shape)) * step(-0.15, q.y);
}
vec3 glow(vec2 p, vec2 c, float s, vec3 col) { float d = length((p - c) / s); return col * (0.1 / (d * d + 0.1)) * 0.3; }
// floating dust / light motes drifting upward
vec3 motes(vec2 p, float t, float speed, float density, vec3 c, float size) {
  vec3 acc = vec3(0.0);
  for (int L = 0; L < 2; L++) { float sc = 9.0 + float(L) * 7.0; vec2 g = p * sc + vec2(0.0, -t * speed * sc) + float(L) * 3.1; vec2 id = floor(g); float h = hash(id);
    if (h < density * 8.0) { vec2 f = fract(g) - 0.5 - 0.3 * (hash2(id) - 0.5) - 0.15 * vec2(sin(t * 0.7 + h * 20.0), 0.0); acc += c * smoothstep(size * sc * 0.06, 0.0, length(f)) * (0.5 + 0.5 * sin(t * 2.0 + h * 40.0)); } }
  return acc; }
vec3 skyGrad(vec2 p, vec3 lo, vec3 mid, vec3 hi) { vec3 c = mix(lo, mid, SAT(p.y * 2.2 + 0.45)); return mix(c, hi, SAT(p.y * 1.6 - 0.15)); }
vec3 clouds2D(vec2 p, vec3 base, vec3 lit, vec3 shade, float cover, vec2 sun, float t) {
  vec2 q = p * vec2(1.3, 3.0) + vec2(t * 0.02, 0.0); vec2 w = vec2(fbm(q + 1.3), fbm(q + 7.1)); float c = fbm(q + 1.6 * w);
  float dens = smoothstep(1.0 - cover - 0.15, 1.0 - cover + 0.2, c) * smoothstep(-0.1, 0.2, p.y);
  float c2 = fbm(q + 1.6 * w + normalize(sun - p + 1e-4) * 0.05); float l = SAT((c - c2) * 7.0 + 0.45);
  return mix(base, mix(shade, lit, l), dens * 0.95);
}
vec3 stars(vec2 p, float t) { vec2 sp = p * 120.0; vec2 id = floor(sp); float h = hash(id); vec3 c = vec3(0);
  if (h > 0.975) { vec2 f = fract(sp) - 0.5; c = vec3(1.0, 0.95, 0.85) * smoothstep(0.14, 0.0, length(f)) * (0.6 + 0.4 * sin(t * (1.5 + h * 3.0) + h * 70.0)) * (h - 0.975) * 60.0; }
  return c; }
float hills(float x, float base, float amp, float freq, float seed) { return base + amp * (fbm(vec2(x * freq + seed, seed)) - 0.5) * 2.0; }
float wave(float x, float t, float storm) { return 0.012 * sin(x * 9.0 + t * 1.6) + 0.008 * sin(x * 17.0 - t * 2.3) + storm * (0.03 * sin(x * 5.0 + t * 2.0) + 0.015 * sin(x * 13.0 - t * 3.1)); }
// parchment with an illuminated gold border (title card)
vec3 parchment(vec2 p, float t) {
  float ar = uRes.x / uRes.y; vec2 q = vec2(p.x / (0.5 * ar), p.y / 0.5);
  vec3 c = mix(vec3(0.95, 0.89, 0.74), vec3(0.86, 0.76, 0.56), fbm(p * 4.0) * 0.8 + 0.25 * fbm(p * 22.0));
  c *= 1.0 - 0.35 * smoothstep(0.55, 1.15, length(q * vec2(0.85, 1.0)));                                     // aged edges
  float bx = max(abs(q.x) - 0.9, abs(q.y) - 0.86); float frame = smoothstep(0.012, 0.0, abs(bx + 0.02) - 0.012);
  float inner = smoothstep(0.006, 0.0, abs(bx + 0.06) - 0.004);
  vec3 gold = vec3(0.95, 0.75, 0.32) * (0.75 + 0.45 * pow(0.5 + 0.5 * sin(q.x * 9.0 + q.y * 7.0 + t * 1.5), 6.0));
  c = mix(c, gold, frame); c = mix(c, gold * 0.85, inner);
  for (int i = 0; i < 4; i++) { vec2 cc = vec2(i % 2 == 0 ? -0.86 : 0.86, i < 2 ? -0.82 : 0.82); float d = length((q - cc) * vec2(ar, 1.0) * 0.5);
    c = mix(c, gold, smoothstep(0.035, 0.028, d)); c = mix(c, vec3(0.6, 0.15, 0.15), smoothstep(0.016, 0.012, d)); }
  return c;
}
