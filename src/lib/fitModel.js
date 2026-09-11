// ==========================================================================
// Fit Space — the placement adaptation of the "Compatibility Space" toy model.
//
//   student, role -> weighted gap D -> fit C = e^(-k D²) -> role floors Ω_K
//                                   -> readiness P(offer-ready by month t)
//   profile -> spectrum SPD(λ) -> CIE 1931 XYZ -> sRGB colour
//
// Colour maths is a straight port of the original index.html / model.py.
// Nothing here is fitted to data; every constant is a dial.
// ==========================================================================
import { SKILLS } from "../data/fit";

const N = SKILLS.length;

/* ---------- colour: SPD -> CIE 1931 -> sRGB ---------- */
function gpiece(x, mu, s1, s2) { const s = x < mu ? s1 : s2, d = (x - mu) / s; return Math.exp(-0.5 * d * d); }
export function xbar(l) { return 1.056 * gpiece(l, 599.8, 37.9, 31.0) + 0.362 * gpiece(l, 442.0, 16.0, 26.7) - 0.065 * gpiece(l, 501.1, 20.4, 26.2); }
export function ybar(l) { return 0.821 * gpiece(l, 568.8, 46.9, 40.5) + 0.286 * gpiece(l, 530.9, 16.3, 31.1); }
export function zbar(l) { return 1.217 * gpiece(l, 437.0, 11.8, 36.0) + 0.681 * gpiece(l, 459.0, 26.0, 13.8); }

const SIGMA = 18;
export function spd(v, l) {
  let s = 0;
  for (let i = 0; i < N; i++) { const d = (l - SKILLS[i].lam) / SIGMA; s += v[i] * Math.exp(-0.5 * d * d); }
  return s;
}
function gam(c) { c = Math.max(0, Math.min(1, c)); return c <= 0.0031308 ? 12.92 * c : 1.055 * Math.pow(c, 1 / 2.4) - 0.055; }
export function xyzToRgb(X, Y, Z) {
  let r = 3.2406 * X - 1.5372 * Y - 0.4986 * Z, g = -0.9689 * X + 1.8758 * Y + 0.0415 * Z, b = 0.0557 * X - 0.2040 * Y + 1.0570 * Z;
  const m = Math.min(r, g, b); if (m < 0) { r -= m; g -= m; b -= m; }   // out of gamut: desaturate toward white
  const M = Math.max(r, g, b, 1); r /= M; g /= M; b /= M;
  return [Math.round(gam(r) * 255), Math.round(gam(g) * 255), Math.round(gam(b) * 255)];
}
export const hex = (rgb) => "#" + rgb.map((v) => v.toString(16).padStart(2, "0")).join("");

const CHROMA_BOOST = 2.6, XW = 0.3127, YW = 0.3290;
// Six overlapping lobes integrate close to white; chromaticity is pushed away
// from D65 so profiles stay distinguishable. Lightness tracks the mean score.
export function profileColour(v) {
  let X = 0, Y = 0, Z = 0;
  for (let l = 400; l <= 700; l += 2) { const p = spd(v, l); X += p * xbar(l); Y += p * ybar(l); Z += p * zbar(l); }
  const s = X + Y + Z;
  if (Y <= 1e-9 || s <= 1e-9) return "#000000";
  const cx = XW + CHROMA_BOOST * (X / s - XW), cy = Math.max(0.02, YW + CHROMA_BOOST * (Y / s - YW));
  const mean = v.reduce((a, b) => a + b, 0) / N;
  const Yt = 0.14 + 0.62 * mean;
  return hex(xyzToRgb((cx * Yt) / cy, Yt, ((1 - cx - cy) * Yt) / cy));
}
export const wavelengthRgb = (l) => xyzToRgb(xbar(l), ybar(l), zbar(l));

/* ---------- gap -> fit ---------- */
export function normWeights(w) {
  const s = w.reduce((a, b) => a + b, 0) || 1;
  return w.map((x) => x / s);
}

// Per-skill error. Asymmetric: exceeding a requirement costs nothing, only a
// shortfall does — the README's "asymmetric traits" extension. Symmetric is the
// original model: any gap, either direction, counts.
export const gapTerm = (s, need, asymmetric) => (asymmetric ? Math.max(0, need - s) : s - need);

export function d2(student, role, { asymmetric = true } = {}) {
  const w = normWeights(role.w);
  let sum = 0;
  for (let i = 0; i < N; i++) { const e = gapTerm(student[i], role.need[i], asymmetric); sum += w[i] * e * e; }
  return sum;
}
export const fit = (student, role, { k = 6, asymmetric = true } = {}) => Math.exp(-k * d2(student, role, { asymmetric }));

// Ω_K as hard floors (company cut-offs): s_i ≥ floor_i. A floor of 0 leaves the skill free.
export const meetsFloors = (student, floors) => floors.every((f, i) => student[i] >= f);

/* ---------- time: readiness ---------- */
// Constant "offer-ready" rate that rises with fit: rate(C) = r0 · e^(κC).
export const rate = (C, { r0 = 0.06, kappa = 2.4 } = {}) => r0 * Math.exp(kappa * C);
export const readiness = (C, t, opts) => 1 - Math.exp(-rate(C, opts) * t);
export const medianMonths = (C, opts) => Math.LN2 / rate(C, opts);

/* ---------- searching the space ---------- */
function mulberry32(a) {
  return function () {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Share of the floor-constrained space {s : s_i ≥ floor_i} that clears C0.
// Large share: the floors are doing the selecting. Near zero: the threshold is.
// Seeded so the readout doesn't flicker between renders.
export function regionShare(role, floors, { c0 = 0.6, k = 6, asymmetric = true, samples = 12000 } = {}) {
  const rnd = mulberry32(90210);
  const w = normWeights(role.w);
  let pass = 0;
  for (let n = 0; n < samples; n++) {
    let sum = 0;
    for (let i = 0; i < N; i++) {
      const s = floors[i] + rnd() * (1 - floors[i]);
      const e = gapTerm(s, role.need[i], asymmetric);
      sum += w[i] * e * e;
    }
    if (Math.exp(-k * sum) >= c0) pass++;
  }
  return pass / samples;
}

export function rankRoles(student, roles, opts = {}) {
  return roles
    .map((role) => {
      const D2 = d2(student, role, opts);
      const shape = d2(student, role, { asymmetric: false });
      return { role, D: Math.sqrt(D2), C: Math.exp(-(opts.k ?? 6) * D2), shape, floorsOk: meetsFloors(student, role.floors) };
    })
    // equal fits (common once over-qualification is free) break toward the
    // role whose profile is closest in shape to yours
    .sort((a, b) => Math.round((b.C - a.C) * 100) || a.shape - b.shape);
}
