// Lightweight geo helpers used to build simulated weather overlays.
export const KM_PER_DEG = 111.32;
const RAD = Math.PI / 180;

/** Deterministic PRNG so mock overlays look identical on every render. */
export function mulberry32(seed) {
  let a = seed >>> 0;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Gaussian sample (Box–Muller) from a uniform PRNG. */
export function gauss(rand) {
  const u = Math.max(rand(), 1e-9);
  const v = rand();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

export function offsetKm([lat, lng], northKm, eastKm) {
  return [lat + northKm / KM_PER_DEG, lng + eastKm / (KM_PER_DEG * Math.cos(lat * RAD))];
}

export function moveAlong(pos, headingDeg, distKm) {
  const h = headingDeg * RAD;
  return offsetKm(pos, distKm * Math.cos(h), distKm * Math.sin(h));
}

export function haversineKm(a, b) {
  const dLat = (b[0] - a[0]) * RAD;
  const dLng = (b[1] - a[1]) * RAD;
  const s =
    Math.sin(dLat / 2) ** 2 + Math.cos(a[0] * RAD) * Math.cos(b[0] * RAD) * Math.sin(dLng / 2) ** 2;
  return 2 * 6371 * Math.asin(Math.sqrt(s));
}

export function bearingDeg(a, b) {
  const y = Math.sin((b[1] - a[1]) * RAD) * Math.cos(b[0] * RAD);
  const x =
    Math.cos(a[0] * RAD) * Math.sin(b[0] * RAD) -
    Math.sin(a[0] * RAD) * Math.cos(b[0] * RAD) * Math.cos((b[1] - a[1]) * RAD);
  return ((Math.atan2(y, x) / RAD) + 360) % 360;
}

/**
 * Organic "echo" polygon: an ellipse stretched along the storm heading with
 * deterministic harmonic noise so each storm cell has a unique, stable shape.
 */
export function blob(center, radiusKm, { seed = 1, heading = 0, stretch = 1.35, points = 44, rough = 0.16, shift = 0 } = {}) {
  const r = mulberry32(seed);
  const ph = [r() * 6.283, r() * 6.283, r() * 6.283, r() * 6.283];
  const h = heading * RAD;
  const c = shift ? moveAlong(center, heading, shift) : center;
  const out = [];
  for (let i = 0; i < points; i++) {
    const a = (i / points) * Math.PI * 2;
    const noise =
      1 +
      rough * Math.sin(2 * a + ph[0]) +
      rough * 0.6 * Math.sin(3 * a + ph[1]) +
      rough * 0.35 * Math.sin(5 * a + ph[2]) +
      rough * 0.2 * Math.sin(7 * a + ph[3]);
    const along = Math.cos(a) * radiusKm * stretch * noise;
    const cross = Math.sin(a) * radiusKm * noise;
    const north = along * Math.cos(h) - cross * Math.sin(h);
    const east = along * Math.sin(h) + cross * Math.cos(h);
    out.push(offsetKm(c, north, east));
  }
  return out;
}

/** Forecast cone polygon: widens from the current position along the heading. */
export function cone(start, heading, lengthKm, w0, w1, steps = 12) {
  const left = [];
  const right = [];
  for (let i = 0; i <= steps; i++) {
    const f = i / steps;
    const p = moveAlong(start, heading, lengthKm * f);
    const w = w0 + (w1 - w0) * f;
    left.push(moveAlong(p, heading - 90, w));
    right.push(moveAlong(p, heading + 90, w));
  }
  const end = moveAlong(start, heading, lengthKm);
  const capL = moveAlong(end, heading - 45, w1 * 0.6);
  const capR = moveAlong(end, heading + 45, w1 * 0.6);
  return [...left, capL, moveAlong(end, heading, w1 * 0.55), capR, ...right.reverse()];
}

export function circlePolygon(center, radiusKm, points = 64) {
  const out = [];
  for (let i = 0; i < points; i++) out.push(moveAlong(center, (i / points) * 360, radiusKm));
  return out;
}

export function polygonAreaKm2(latlngs) {
  if (!latlngs.length) return 0;
  const lat0 = latlngs[0][0] * RAD;
  let s = 0;
  for (let i = 0; i < latlngs.length; i++) {
    const [aLat, aLng] = latlngs[i];
    const [bLat, bLng] = latlngs[(i + 1) % latlngs.length];
    const ax = aLng * KM_PER_DEG * Math.cos(lat0);
    const bx = bLng * KM_PER_DEG * Math.cos(lat0);
    s += ax * (bLat * KM_PER_DEG) - bx * (aLat * KM_PER_DEG);
  }
  return Math.abs(s / 2);
}

export const lerp = (a, b, t) => a + (b - a) * t;
export const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));

/** Interpolate a per-step profile array at fractional step t. */
export function atStep(arr, t) {
  const i = clamp(Math.floor(t), 0, arr.length - 1);
  const j = clamp(i + 1, 0, arr.length - 1);
  return lerp(arr[i], arr[j], clamp(t - i, 0, 1));
}

export function compass(deg) {
  const dirs = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  return dirs[Math.round(((deg % 360) / 22.5)) % 16];
}

/** Convert a [lat,lng] ring to a GeoJSON polygon coordinate ring ([lng,lat], closed). */
export function toGeoJSONRing(latlngs) {
  const ring = latlngs.map(([lat, lng]) => [Number(lng.toFixed(5)), Number(lat.toFixed(5))]);
  if (ring.length) ring.push(ring[0]);
  return ring;
}
