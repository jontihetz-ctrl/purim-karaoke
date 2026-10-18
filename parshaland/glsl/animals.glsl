// ── Animals and birds: coloured, outlined, with eyes. Facing +x, feet at 0; elephant ≈ 0.75 tall in local units ──
// kinds: 0 elephant, 1 giraffe, 2 lion, 3 zebra, 4 sheep, 5 rabbit
void drawAnimal(inout vec3 col, vec2 p, vec2 pos, float h, int kind, float ph, float facing) {
  vec2 q = (p - pos) / h; q.x *= facing; PX = 1.5 / (uRes.y * h);
  if (abs(q.x) > 0.75 || q.y < -0.05 || q.y > 1.4) return;
  col *= 1.0 - 0.22 * smoothstep(1.0, 0.0, length(vec2(q.x / 0.42, (q.y + 0.005) / 0.04)));          // contact shadow
  float s1 = sin(ph), s2 = sin(ph + PI);
  if (kind == 0) { // elephant
    vec3 c = vec3(0.6, 0.62, 0.68);
    leg(col, q, vec2(-0.2, 0.3), 0.3, s2, 0.075, c * 0.85); leg(col, q, vec2(0.15, 0.3), 0.3, s2, 0.075, c * 0.85);
    ink(col, sdSeg2(q, vec2(-0.34, 0.45), vec2(-0.42, 0.3), 0.015, 0.008), c * 0.8, q);                                     // tail
    ink(col, sdE2(q - vec2(-0.02, 0.42), vec2(0.34, 0.22)), c, q);
    leg(col, q, vec2(-0.12, 0.3), 0.3, s1, 0.08, c); leg(col, q, vec2(0.22, 0.3), 0.3, s1, 0.08, c);
    float trunk = min(sdSeg2(q, vec2(0.42, 0.5), vec2(0.5, 0.3), 0.055, 0.04), sdSeg2(q, vec2(0.5, 0.3), vec2(0.47 + 0.03 * sin(uT * 1.3), 0.12), 0.04, 0.028));
    ink(col, min(sdE2(q - vec2(0.33, 0.52), vec2(0.15, 0.14)), trunk), c, q);
    ink(col, sdE2(q - vec2(0.24, 0.53), vec2(0.1, 0.14)), c * 0.86, q);                                                  // ear
    ink(col, sdSeg2(q, vec2(0.43, 0.42), vec2(0.5, 0.37), 0.014, 0.006), vec3(0.97, 0.95, 0.88), q);                     // tusk
    eye(col, q, vec2(0.37, 0.58), 0.02);
  } else if (kind == 1) { // giraffe
    vec3 c = vec3(0.95, 0.78, 0.35);
    leg(col, q, vec2(-0.16, 0.58), 0.58, s2, 0.035, c * 0.85); leg(col, q, vec2(0.12, 0.58), 0.58, s2, 0.035, c * 0.85);
    float body = sdE2(q - vec2(0.0, 0.64), vec2(0.25, 0.12)); float neck = sdSeg2(q, vec2(0.18, 0.66), vec2(0.34, 1.16), 0.065, 0.04);
    float head = sdE2(q - vec2(0.41, 1.2), vec2(0.09, 0.05));
    vec2 sp = q * 9.0; vec2 id = floor(sp); float spot = length(fract(sp) - 0.5 - 0.25 * (hash2(id) - 0.5)) - 0.28;
    vec3 cc = mix(c, vec3(0.62, 0.36, 0.15), smoothstep(0.03, -0.03, spot) * step(q.y, 1.14));
    ink(col, min(min(body, neck), head), cc, q);
    leg(col, q, vec2(-0.1, 0.58), 0.58, s1, 0.04, c); leg(col, q, vec2(0.17, 0.58), 0.58, s1, 0.04, c);
    ink(col, min(sdCap2(q, vec2(0.37, 1.24), vec2(0.36, 1.31), 0.012), sdCap2(q, vec2(0.42, 1.24), vec2(0.42, 1.31), 0.012)), vec3(0.55, 0.32, 0.15), q);   // ossicones
    eye(col, q, vec2(0.43, 1.215), 0.016);
  } else if (kind == 2) { // lion
    vec3 c = vec3(0.92, 0.7, 0.32);
    leg(col, q, vec2(-0.2, 0.26), 0.26, s2, 0.05, c * 0.85); leg(col, q, vec2(0.15, 0.26), 0.26, s2, 0.05, c * 0.85);
    ink(col, min(sdSeg2(q, vec2(-0.28, 0.36), vec2(-0.44, 0.44 + 0.03 * sin(uT * 2.0)), 0.015, 0.01), length(q - vec2(-0.45, 0.45 + 0.03 * sin(uT * 2.0))) - 0.035), c * 0.8, q);   // tail with tuft
    ink(col, sdE2(q - vec2(-0.02, 0.34), vec2(0.3, 0.13)), c, q);
    leg(col, q, vec2(-0.13, 0.26), 0.26, s1, 0.055, c); leg(col, q, vec2(0.22, 0.26), 0.26, s1, 0.055, c);
    vec2 hq = q - vec2(0.3, 0.44); float a = atan(hq.y, hq.x); float mane = length(hq) - 0.19 - 0.022 * sin(a * 12.0 + 1.0);
    ink(col, mane, vec3(0.78, 0.42, 0.12), q);
    ink(col, sdE2(hq - vec2(0.02, -0.01), vec2(0.115, 0.105)), c * 1.04, q);
    col = mix(col, vec3(0.35, 0.18, 0.1), smoothstep(PX, -PX, sdE2(hq - vec2(0.1, -0.03), vec2(0.022, 0.016))));     // nose
    eye(col, q, vec2(0.36, 0.47), 0.016);
  } else if (kind == 3) { // zebra
    vec3 c = vec3(0.96, 0.96, 0.95);
    float stripes = step(0.5, fract(q.x * 9.0 + 0.6 * sin(q.y * 12.0)));
    leg(col, q, vec2(-0.18, 0.32), 0.32, s2, 0.03, c * 0.8); leg(col, q, vec2(0.14, 0.32), 0.32, s2, 0.03, c * 0.8);
    float body = sdE2(q - vec2(0.0, 0.42), vec2(0.26, 0.12)); float neck = sdSeg2(q, vec2(0.2, 0.46), vec2(0.32, 0.7), 0.06, 0.045);
    float head = sdSeg2(q, vec2(0.32, 0.72), vec2(0.44, 0.58), 0.05, 0.035);
    ink(col, min(min(body, neck), head), mix(c, vec3(0.08), stripes * 0.92), q);
    ink(col, sdSeg2(q, vec2(0.19, 0.55), vec2(0.31, 0.77), 0.018, 0.012), vec3(0.1), q);                                // mane
    leg(col, q, vec2(-0.12, 0.32), 0.32, s1, 0.033, c); leg(col, q, vec2(0.19, 0.32), 0.32, s1, 0.033, c);
    eye(col, q, vec2(0.36, 0.69), 0.014);
  } else if (kind == 4) { // sheep: a fluffy cloud of wool on dark legs
    vec3 c = vec3(0.96, 0.95, 0.9); vec3 dk = vec3(0.25, 0.22, 0.22);
    leg(col, q, vec2(-0.16, 0.25), 0.25, s2, 0.028, dk); leg(col, q, vec2(0.14, 0.25), 0.25, s2, 0.028, dk);
    float wool = sdE2(q - vec2(0.0, 0.4), vec2(0.28, 0.16));
    for (int i = 0; i < 7; i++) { float a = float(i) * 0.9; wool = smin(wool, length(q - vec2(0.0, 0.42) - vec2(cos(a) * 0.24, sin(a) * 0.14)) - 0.08, 0.03); }
    ink(col, wool, c * (0.92 + 0.1 * noise(q * 30.0)), q);
    leg(col, q, vec2(-0.1, 0.25), 0.25, s1, 0.03, dk); leg(col, q, vec2(0.2, 0.25), 0.25, s1, 0.03, dk);
    ink(col, sdE2(q - vec2(0.3, 0.45), vec2(0.09, 0.075)), dk * 1.4, q); ink(col, sdE2(q - vec2(0.25, 0.5), vec2(0.05, 0.025)), dk * 1.2, q);
    eye(col, q, vec2(0.33, 0.47), 0.014);
  } else { // rabbit
    vec3 c = vec3(0.68, 0.55, 0.45);
    ink(col, length(q - vec2(-0.2, 0.28)) - 0.06, vec3(0.97), q);                                                       // fluffy tail
    ink(col, sdE2(q - vec2(-0.02, 0.22), vec2(0.2, 0.15)), c, q);
    ink(col, sdE2(q - vec2(0.05, 0.05), vec2(0.12, 0.05)), c * 0.9, q);                                                 // hind foot
    ink(col, min(sdSeg2(q, vec2(0.14, 0.44), vec2(0.1, 0.72), 0.04, 0.03), sdSeg2(q, vec2(0.2, 0.44), vec2(0.22, 0.71), 0.04, 0.03)), c * 0.95, q);   // ears
    ink(col, sdE2(q - vec2(0.2, 0.38), vec2(0.1, 0.09)), c, q);
    col = mix(col, vec3(1.0, 0.6, 0.6), smoothstep(PX, -PX, length(q - vec2(0.29, 0.37)) - 0.012));
    eye(col, q, vec2(0.24, 0.41), 0.014);
  }
}
// a bird in flight, wings flapping; optionally with an olive leaf in its beak
void drawBird(inout vec3 col, vec2 p, vec2 pos, float h, float ph, vec3 c, float facing, bool leaf) {
  if (h <= 0.0) return;
  vec2 q = (p - pos) / h; q.x *= facing; PX = 1.5 / (uRes.y * h); if (abs(q.x) > 1.2 || abs(q.y) > 1.0) return;
  float flap = sin(ph);
  vec2 wq = rot(-0.6 * flap) * (q - vec2(-0.05, 0.05)); float wingB = sdE2(wq - vec2(-0.05, 0.28), vec2(0.18, 0.3));
  ink(col, wingB, c * 0.82, q);
  ink(col, min(sdE2(q - vec2(0.0, 0.0), vec2(0.36, 0.15)), sdTrap(vec2(q.y, -q.x - 0.3), -0.0, 0.25, 0.04, 0.14, 0.0)), c, q);
  ink(col, sdE2(q - vec2(0.33, 0.07), vec2(0.13, 0.11)), c, q);
  ink(col, sdTrap(vec2(q.y - 0.05, q.x - 0.44), 0.0, 0.12, 0.035, 0.0, 0.0), vec3(1.0, 0.65, 0.2), q);
  vec2 wq2 = rot(0.7 * flap) * (q - vec2(0.0, 0.05)); ink(col, sdE2(wq2 - vec2(0.02, 0.3), vec2(0.18, 0.32)), c * 0.95, q);
  eye(col, q, vec2(0.37, 0.1), 0.03);
  if (leaf) { vec2 lq = rot(-0.4) * (q - vec2(0.62, 0.02)); ink(col, sdE2(lq, vec2(0.16, 0.06)), vec3(0.35, 0.62, 0.25), q); }
}
