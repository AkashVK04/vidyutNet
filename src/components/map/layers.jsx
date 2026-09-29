// Leaflet overlay layers for the simulated weather products.
import { Fragment, memo, useMemo } from 'react';
import L from 'leaflet';
import { Circle, CircleMarker, Marker, Polygon, Polyline, Tooltip as LTooltip } from 'react-leaflet';
import { districtBoundaries, cityLabels } from '../../data/districtsData.js';
import { radarStations } from '../../data/radarData.js';
import { transmissionLines, substations, airports, railLines, railSections } from '../../data/infrastructureData.js';
import { scoreToLevel } from '../../utils/riskCalculator.js';
import { haversineKm, moveAlong } from '../../utils/geo.js';

/* ---------------- icons ---------------- */
const boltSvg = (size, color = '#facc15') =>
  `<svg viewBox="0 0 24 24" width="${size}" height="${size}"><path d="M13.5 1.5 4 14h7l-1.5 8.5L20 9.5h-7.2z" fill="${color}" stroke="#fff6d5" stroke-width="0.8" stroke-linejoin="round"/></svg>`;

const BOLT_FRESH = L.divIcon({ className: 'vn-plain', html: `<div class="vn-bolt fresh">${boltSvg(15)}</div>`, iconSize: [15, 15], iconAnchor: [7, 8] });
const BOLT_RECENT = L.divIcon({ className: 'vn-plain', html: `<div class="vn-bolt">${boltSvg(12, '#fbbf24')}</div>`, iconSize: [12, 12], iconAnchor: [6, 6] });

const labelIcon = (text, cls) =>
  L.divIcon({ className: 'vn-plain', html: `<div class="vn-label ${cls}" style="transform:translate(-50%,-50%)">${text}</div>`, iconSize: [0, 0] });

const radarIcon = L.divIcon({
  className: 'vn-plain',
  html: `<div style="transform:translate(-50%,-50%);width:14px;height:14px;border-radius:3px;background:#0b1830;border:1.5px solid #22d3ee;display:grid;place-items:center;box-shadow:0 0 10px rgba(34,211,238,.5)"><div style="width:4px;height:4px;border-radius:50%;background:#22d3ee"></div></div>`,
  iconSize: [0, 0],
});

const cellTagIcon = (cell, selected) =>
  L.divIcon({
    className: 'vn-plain',
    html: `<div class="vn-cell-tag ${selected ? 'selected' : ''}"><span style="color:${cell.dbz >= 50 ? '#fca5a5' : cell.dbz >= 45 ? '#fdba74' : '#fde68a'}">▲</span> ${cell.id} · ${Math.round(cell.dbz)} dBZ</div>`,
    iconSize: [0, 0],
  });

const arrowIcon = (heading, color = '#e2e8f0', size = 18) =>
  L.divIcon({
    className: 'vn-plain',
    html: `<div style="transform:translate(-50%,-50%) rotate(${heading}deg);width:${size}px;height:${size}px"><svg viewBox="0 0 24 24" width="${size}" height="${size}"><path d="M12 2 20 20 12 15.5 4 20z" fill="${color}" stroke="#020617" stroke-width="1"/></svg></div>`,
    iconSize: [0, 0],
  });

/* ---------------- base geography ---------------- */
export const DistrictLayer = memo(function DistrictLayer({ states, selectedId, onSelect, showRiskFill = false }) {
  return states.map((d) => {
    const lvl = scoreToLevel(d.score);
    const sel = d.id === selectedId;
    return (
      <Polygon
        key={d.id}
        pane="districts"
        positions={districtBoundaries[d.id]}
        pathOptions={{
          color: sel ? '#22d3ee' : 'rgba(148,178,222,0.45)',
          weight: sel ? 2 : 1,
          dashArray: sel ? null : '4 4',
          fillColor: showRiskFill ? lvl.color : '#0b1830',
          fillOpacity: showRiskFill ? 0.16 : sel ? 0.12 : 0.02,
        }}
        eventHandlers={{ click: (e) => onSelect?.(d, e.latlng) }}
      />
    );
  });
});

export function DistrictLabels({ states }) {
  return states.map((d) => (
    <Marker key={d.id} pane="labels" position={d.labelPos || d.centroid} icon={labelIcon(d.name, 'vn-label-district')} interactive={false} keyboard={false} />
  ));
}

export function CityLabels() {
  return cityLabels.map((c) => (
    <Marker key={c.name} pane="labels" position={c.pos} icon={labelIcon(`<span style="display:inline-block;width:5px;height:5px;border-radius:50%;background:#e2e8f0;margin-right:5px;vertical-align:middle"></span>${c.name}`, `vn-label-city ${c.major ? '' : 'minor'}`)} interactive={false} keyboard={false} />
  ));
}

export function VillageMarkers({ villages, onSelect }) {
  return villages.map((v) => (
    <CircleMarker
      key={v.id}
      pane="labels"
      center={v.pos}
      radius={v.level.key === 'LOW' ? 3 : 4.5}
      pathOptions={{ color: '#020617', weight: 1.5, fillColor: v.level.color, fillOpacity: 1 }}
      eventHandlers={{ click: (e) => onSelect?.(v, e.latlng) }}
    >
      <LTooltip className="vn-tip" direction="right" offset={[6, 0]} permanent={v.lightningProb >= 80}>
        {v.name} · {Math.round(v.lightningProb)}%
      </LTooltip>
    </CircleMarker>
  ));
}

/* ---------------- weather layers ---------------- */
export function RadarCoverageLayer() {
  return radarStations.map((s) => (
    <Fragment key={s.id}>
      <Circle pane="coverage" center={s.pos} radius={s.rangeKm * 1000} interactive={false}
        pathOptions={{ color: s.status === 'ONLINE' ? '#22d3ee' : '#f59e0b', weight: 1, opacity: 0.45, dashArray: '2 6', fill: true, fillColor: '#22d3ee', fillOpacity: 0.015 }} />
      <Circle pane="coverage" center={s.pos} radius={s.rangeKm * 500} interactive={false}
        pathOptions={{ color: '#22d3ee', weight: 0.6, opacity: 0.2, dashArray: '1 6', fill: false }} />
      <Marker pane="labels" position={s.pos} icon={radarIcon}>
        <LTooltip className="vn-tip" direction="top" offset={[0, -8]}>
          {s.name} · {s.rangeKm} km · {s.status}
        </LTooltip>
      </Marker>
    </Fragment>
  ));
}

export function SatelliteLayer({ shields }) {
  return shields.map((s) => (
    <Polygon key={s.key} pane="sat" positions={s.positions} interactive={false}
      pathOptions={{ stroke: false, fillColor: s.color, fillOpacity: s.opacity }} />
  ));
}

export function RainfallLayer({ rain }) {
  return rain.map((r) => (
    <Polygon key={r.key} pane="rain" positions={r.positions} interactive={false}
      pathOptions={{ color: r.color, weight: 0.6, opacity: 0.5, fillColor: r.color, fillOpacity: 0.22 }} />
  ));
}

export function RadarLayer({ rings, onSelectCell }) {
  return rings.map((r) => (
    <Polygon key={r.key} pane="radar" positions={r.positions}
      pathOptions={{ color: r.color, weight: 0.7, opacity: 0.8, fillColor: r.color, fillOpacity: r.dbz >= 50 ? 0.55 : 0.34 }}
      eventHandlers={{ click: () => onSelectCell?.(r.key.split('-').slice(0, 2).join('-')) }} />
  ));
}

export function RiskLayer({ zones, onSelect }) {
  return zones.map((z) => (
    <Polygon key={z.id} pane="risk" positions={z.positions}
      pathOptions={{ color: z.level.color, weight: 1.4, opacity: 0.9, dashArray: z.id.endsWith('O') ? '5 4' : null, fillColor: z.level.color, fillOpacity: z.id.endsWith('O') ? 0.07 : 0.14 }}
      eventHandlers={{ click: (e) => onSelect?.(z, e.latlng) }} />
  ));
}

export function PredictionLayer({ tracks, svgRenderer, selectedId, emphasize = false }) {
  return tracks.map(({ id, cell, cone, points }) => {
    const sel = id === selectedId;
    const color = sel ? '#22d3ee' : emphasize ? '#fde68a' : '#e2e8f0';
    const end = points[points.length - 1];
    return (
      <Fragment key={id}>
        <Polygon pane="track" positions={cone} interactive={false}
          pathOptions={{ color, weight: 0.8, opacity: 0.35, fillColor: color, fillOpacity: sel ? 0.12 : 0.07 }} />
        <Polyline pane="track" positions={[cell.pos, ...points]} interactive={false} renderer={svgRenderer} className="vn-flow"
          pathOptions={{ color, weight: sel ? 2.4 : 1.6, opacity: 0.9, className: 'vn-flow' }} />
        {points.map((p, i) => (
          <CircleMarker key={i} pane="track" center={p} radius={2.5} interactive={false}
            pathOptions={{ color, weight: 1, fillColor: '#020617', fillOpacity: 1 }} />
        ))}
        <Marker pane="labels" position={moveAlong(end, cell.heading, 1.2)} icon={arrowIcon(cell.heading, color, sel ? 18 : 14)} interactive={false} keyboard={false} />
      </Fragment>
    );
  });
}

export function WindLayer({ vectors }) {
  return vectors.map((v) => (
    <Marker key={v.id} pane="labels" position={v.pos} interactive={false} keyboard={false}
      icon={L.divIcon({
        className: 'vn-plain',
        iconSize: [0, 0],
        html: `<div style="transform:translate(-50%,-50%);display:flex;flex-direction:column;align-items:center;opacity:.85"><div style="transform:rotate(${v.dir}deg)"><svg width="16" height="16" viewBox="0 0 24 24"><path d="M12 3v16M12 3l-5 6M12 3l5 6" stroke="${v.speed > 35 ? '#fb923c' : v.speed > 24 ? '#fde68a' : '#7dd3fc'}" stroke-width="2.2" fill="none" stroke-linecap="round"/></svg></div><span style="font:600 9px 'JetBrains Mono',monospace;color:#94a3b8;text-shadow:0 0 3px #020617">${v.speed}</span></div>`,
      })} />
  ));
}

export function LightningLayer({ strikes, onSelect, maxRecent = 10 }) {
  const fresh = strikes.filter((s) => s.ageMin < maxRecent);
  const older = strikes.filter((s) => s.ageMin >= maxRecent);
  return (
    <>
      {older.map((s) => (
        <CircleMarker key={s.id} pane="lightning" center={s.pos} radius={s.type === 'CG' ? 2.6 : 2}
          pathOptions={{ stroke: false, fillColor: s.ageMin < 20 ? '#fb923c' : '#b45309', fillOpacity: s.ageMin < 20 ? 0.85 : 0.6 }}
          eventHandlers={{ click: (e) => onSelect?.(s, e.latlng) }} />
      ))}
      {fresh.map((s) => (
        <Marker key={s.id} pane="lightningTop" position={s.pos} icon={s.ageMin < 5 ? BOLT_FRESH : BOLT_RECENT}
          eventHandlers={{ click: (e) => onSelect?.(s, e.latlng) }} />
      ))}
    </>
  );
}

export function CellTags({ cells, selectedId, onSelect, minDbz = 40 }) {
  return cells
    .filter((c) => c.dbz >= minDbz || c.id === selectedId)
    .map((c) => (
      <Marker key={c.id} pane="labels" position={moveAlong(c.pos, 0, c.radiusKm * 0.9)} icon={cellTagIcon(c, c.id === selectedId)}
        eventHandlers={{ click: () => onSelect?.(c.id) }} zIndexOffset={c.id === selectedId ? 1000 : 0} />
    ));
}

export function SelectedCellHalo({ cell }) {
  if (!cell) return null;
  return (
    <Circle pane="track" center={cell.pos} radius={cell.radiusKm * 1700} interactive={false}
      pathOptions={{ color: '#22d3ee', weight: 1.5, dashArray: '3 5', fill: false, opacity: 0.9 }} />
  );
}

/* ---------------- infrastructure (role views) ---------------- */
function exposure(points, cells) {
  let worst = 0;
  points.forEach((p) =>
    cells.forEach((c) => {
      const d = haversineKm(p, c.pos);
      const reach = c.radiusKm * 2.2;
      if (d < reach) worst = Math.max(worst, (c.dbz - 30) * (1 - d / reach));
    }),
  );
  return worst; // 0..~30
}

const expColor = (e) => (e > 12 ? '#ef4444' : e > 5 ? '#fb923c' : e > 0 ? '#facc15' : '#64748b');

export function densify(path, n = 6) {
  const out = [];
  for (let i = 0; i < path.length - 1; i++) {
    for (let k = 0; k < n; k++) {
      const f = k / n;
      out.push([path[i][0] + (path[i + 1][0] - path[i][0]) * f, path[i][1] + (path[i + 1][1] - path[i][1]) * f]);
    }
  }
  out.push(path[path.length - 1]);
  return out;
}

export function useInfrastructureExposure(cells) {
  return useMemo(() => {
    const lines = transmissionLines.map((l) => ({ ...l, exposure: exposure(densify(l.path), cells) }));
    const subs = substations.map((s) => ({ ...s, exposure: exposure([s.pos], cells) }));
    const rail = railSections.map((r) => ({ ...r, exposure: exposure(densify(r.stations), cells) }));
    const air = airports.map((a) => {
      const nearest = Math.min(...cells.filter((c) => c.dbz >= 38).map((c) => haversineKm(a.pos, c.pos) - c.radiusKm));
      return { ...a, nearestKm: Math.max(0, nearest) };
    });
    return { lines, subs, rail, air };
  }, [cells]);
}

export function PowerLayer({ exposureData }) {
  return (
    <>
      {exposureData.lines.map((l) => (
        <Polyline key={l.id} pane="infra" positions={l.path} pathOptions={{ color: expColor(l.exposure), weight: l.kv >= 400 ? 3 : 2, opacity: 0.95 }}>
          <LTooltip className="vn-tip" sticky>{l.name} · {l.exposure > 5 ? 'IN STORM PATH' : l.exposure > 0 ? 'Watch' : 'Clear'}</LTooltip>
        </Polyline>
      ))}
      {exposureData.subs.map((s) => (
        <CircleMarker key={s.id} pane="infra" center={s.pos} radius={5} pathOptions={{ color: '#020617', weight: 2, fillColor: expColor(s.exposure), fillOpacity: 1 }}>
          <LTooltip className="vn-tip">{s.name}</LTooltip>
        </CircleMarker>
      ))}
    </>
  );
}

export function RailLayer({ exposureData }) {
  return (
    <>
      {railLines.map((r) => (
        <Polyline key={r.id} pane="infra" positions={r.path} pathOptions={{ color: '#94a3b8', weight: 3, opacity: 0.5, dashArray: '8 4' }} />
      ))}
      {exposureData.rail.map((s) => (
        <Polyline key={s.id} pane="infra" positions={s.stations} pathOptions={{ color: expColor(s.exposure), weight: 4, opacity: s.exposure > 0 ? 0.95 : 0.4 }}>
          <LTooltip className="vn-tip" sticky>{s.name} · {s.exposure > 5 ? 'Speed restriction advised' : s.exposure > 0 ? 'Monitor' : 'Clear'}</LTooltip>
        </Polyline>
      ))}
    </>
  );
}

export function AirportLayer({ exposureData }) {
  return exposureData.air.map((a) => (
    <Fragment key={a.id}>
      {a.rings.map((r) => (
        <Circle key={r} pane="infra" center={a.pos} radius={r * 1000} interactive={false}
          pathOptions={{ color: a.nearestKm < r ? '#ef4444' : '#a78bfa', weight: 1.2, dashArray: '4 4', fillOpacity: a.nearestKm < r ? 0.08 : 0.02, fillColor: '#a78bfa' }} />
      ))}
      <CircleMarker pane="infra" center={a.pos} radius={6} pathOptions={{ color: '#020617', weight: 2, fillColor: '#a78bfa', fillOpacity: 1 }}>
        <LTooltip className="vn-tip" permanent direction="right" offset={[8, 0]}>✈ {a.id} · nearest cell {a.nearestKm.toFixed(0)} km</LTooltip>
      </CircleMarker>
    </Fragment>
  ));
}
