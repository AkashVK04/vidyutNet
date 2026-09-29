import { blob, toGeoJSONRing, polygonAreaKm2 } from './geo.js';

function hashSeed(id) {
  let h = 7;
  for (const ch of id) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  return h % 10000;
}

export function alertPolygon(alert) {
  return blob(alert.center, alert.radiusKm * 0.95, { seed: hashSeed(alert.id), heading: 48, stretch: 1.35, rough: 0.14, points: 40 });
}

export function alertGeoJSON(alert) {
  const poly = alertPolygon(alert);
  return {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        geometry: { type: 'Polygon', coordinates: [toGeoJSONRing(poly)] },
        properties: {
          id: alert.id,
          severity: alert.severity,
          hazard: alert.hazard,
          title: alert.title,
          location: alert.location,
          issued: `${alert.issued} IST`,
          expiry: `${alert.expiry} IST`,
          onset: alert.onset,
          confidence: alert.confidence,
          population: alert.population,
          areaKm2: Number(polygonAreaKm2(poly).toFixed(1)),
          villages: alert.villages,
          source: 'VidyutNet prototype — SYNTHETIC DEMONSTRATION DATA',
        },
      },
    ],
  };
}

export function downloadJSON(obj, filename) {
  const blobData = new Blob([JSON.stringify(obj, null, 2)], { type: 'application/geo+json' });
  const url = URL.createObjectURL(blobData);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
