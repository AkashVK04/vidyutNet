import { useEffect, useMemo, useRef, useState } from 'react';
import L from 'leaflet';
import { MapContainer, Pane, Popup, TileLayer, ZoomControl, useMap } from 'react-leaflet';
import { useApp, useAnimatedT } from '../context/AppContext.jsx';
import { useWeatherLayers, useDistrictStates, useVillageStates } from '../hooks/useWeatherLayers.js';
import {
  DistrictLayer, DistrictLabels, CityLabels, VillageMarkers, RadarCoverageLayer, SatelliteLayer, RainfallLayer,
  RadarLayer, RiskLayer, PredictionLayer, WindLayer, LightningLayer, CellTags, SelectedCellHalo,
  PowerLayer, RailLayer, AirportLayer, useInfrastructureExposure,
} from './map/layers.jsx';
import { dbzToIntensity, scoreToLevel } from '../utils/riskCalculator.js';
import { fmtCoord, fmtInt } from '../utils/formatters.js';

export const MAP_CENTER = [12.93, 77.42];
const TILE_URL = 'https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png';
const TILE_ATTR = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a> · Weather overlays: simulated';

function MapBehaviour({ focus, onReady }) {
  const map = useMap();
  const readyRef = useRef(onReady);
  readyRef.current = onReady;
  useEffect(() => {
    readyRef.current?.(map);
    const el = map.getContainer();
    const ro = new ResizeObserver(() => map.invalidateSize({ animate: false }));
    ro.observe(el);
    return () => ro.disconnect();
  }, [map]);
  useEffect(() => {
    if (focus?.center) map.flyTo(focus.center, focus.zoom ?? 11, { duration: 1.1 });
  }, [focus, map]);
  return null;
}

function Panes() {
  return (
    <>
      <Pane name="districts" style={{ zIndex: 330 }} />
      <Pane name="coverage" style={{ zIndex: 340 }} />
      <Pane name="sat" style={{ zIndex: 350 }} />
      <Pane name="rain" style={{ zIndex: 355 }} />
      <Pane name="radar" style={{ zIndex: 360 }} />
      <Pane name="risk" style={{ zIndex: 370 }} />
      <Pane name="infra" style={{ zIndex: 380 }} />
      <Pane name="track" style={{ zIndex: 390 }} />
      <Pane name="lightning" style={{ zIndex: 600 }} />
      <Pane name="labels" style={{ zIndex: 620 }} />
      <Pane name="lightningTop" style={{ zIndex: 630 }} />
    </>
  );
}

export default function WeatherMap({
  layers: layersOverride,
  center = MAP_CENTER,
  zoom = 9,
  showDistricts = true,
  showLabels = true,
  showVillages = true,
  showCellTags = true,
  showRoleOverlays = true,
  districtRiskFill = false,
  zoomControl = true,
  mapChildren,
  children,
  className = '',
  followFocus = true,
  onMap,
}) {
  const app = useApp();
  const t = useAnimatedT();
  const layers = layersOverride || app.layers;
  const { cells, radar, satellite, risk, rainfall, wind, tracks, strikes } = useWeatherLayers(t, app.sim);
  const districtStates = useDistrictStates(t, app.sim.riskJitter);
  const villageStates = useVillageStates(t, app.sim.riskJitter);
  const exposureData = useInfrastructureExposure(cells);
  const [popup, setPopup] = useState(null);
  const svgRenderer = useMemo(() => L.svg({ pane: 'track' }), []);
  const selectedCell = cells.find((c) => c.id === app.selectedCellId);
  const mapRef = useRef(null);

  const selectCell = (id) => {
    app.setSelectedCellId(id);
    const c = cells.find((x) => x.id === id);
    app.toast('Storm cell selected', 'info', c ? `${c.id} · ${c.locality} · ${Math.round(c.dbz)} dBZ` : id);
  };

  const role = app.role;

  return (
    <div className={`relative h-full w-full overflow-hidden ${className}`}>
      <MapContainer
        center={center}
        zoom={zoom}
        minZoom={7}
        maxZoom={13}
        zoomSnap={0.25}
        preferCanvas
        zoomControl={false}
        attributionControl
        className="h-full w-full"
        worldCopyJump={false}
      >
        <Panes />
        <TileLayer url={TILE_URL} attribution={TILE_ATTR} subdomains="abcd" />
        {zoomControl && <ZoomControl position="bottomright" />}
        <MapBehaviour focus={followFocus ? app.mapFocus : null} onReady={(m) => { mapRef.current = m; onMap?.(m); }} />

        {showDistricts && (
          <DistrictLayer
            states={districtStates}
            selectedId={app.selectedDistrictId}
            showRiskFill={districtRiskFill}
            onSelect={(d, latlng) => {
              app.setSelectedDistrictId(d.id);
              setPopup({ kind: 'district', pos: latlng, data: d });
            }}
          />
        )}
        {layers.coverage && <RadarCoverageLayer />}
        {layers.satellite && <SatelliteLayer shields={satellite} />}
        {layers.rainfall && <RainfallLayer rain={rainfall} />}
        {layers.radar && <RadarLayer rings={radar} onSelectCell={selectCell} />}
        {layers.risk && <RiskLayer zones={risk} onSelect={(z, latlng) => setPopup({ kind: 'zone', pos: latlng, data: z })} />}
        {showRoleOverlays && role === 'power' && <PowerLayer exposureData={exposureData} />}
        {showRoleOverlays && role === 'rail' && <RailLayer exposureData={exposureData} />}
        {showRoleOverlays && role === 'airport' && <AirportLayer exposureData={exposureData} />}
        {layers.prediction && <PredictionLayer tracks={tracks} svgRenderer={svgRenderer} selectedId={app.selectedCellId} />}
        <SelectedCellHalo cell={selectedCell} />
        {layers.wind && <WindLayer vectors={wind} />}
        {layers.lightning && <LightningLayer strikes={strikes} onSelect={(s, latlng) => setPopup({ kind: 'strike', pos: latlng, data: s })} />}
        {showLabels && showDistricts && <DistrictLabels states={districtStates} />}
        {showLabels && <CityLabels />}
        {showVillages && <VillageMarkers villages={villageStates} onSelect={(v, latlng) => setPopup({ kind: 'village', pos: latlng, data: v })} />}
        {showCellTags && layers.radar && <CellTags cells={cells} selectedId={app.selectedCellId} onSelect={selectCell} />}
        {typeof mapChildren === 'function' ? mapChildren({ cells, strikes, tracks, t, svgRenderer }) : mapChildren}

        {popup && (
          <Popup position={popup.pos} eventHandlers={{ remove: () => setPopup(null) }} autoPan>
            <MapPopupContent popup={popup} cells={cells} onInspectCell={(id) => { selectCell(id); setPopup(null); }} />
          </Popup>
        )}
      </MapContainer>
      {children}
    </div>
  );
}

function Row({ k, v, vClass = '' }) {
  return (
    <div className="flex justify-between gap-4">
      <span className="text-slate-400">{k}</span>
      <span className={`num text-slate-100 ${vClass}`}>{v}</span>
    </div>
  );
}

function MapPopupContent({ popup, cells, onInspectCell }) {
  const { kind, data } = popup;
  if (kind === 'strike') {
    return (
      <div className="min-w-[190px] space-y-1">
        <p className="font-semibold text-amber-300">⚡ {data.type === 'CG' ? 'Cloud-to-ground stroke' : 'Intra-cloud flash'}</p>
        <Row k="Time" v={`${data.time} IST`} />
        <Row k="Peak current" v={`${data.kA > 0 ? '+' : ''}${data.kA} kA`} />
        <Row k="Parent cell" v={data.cellId} />
        <Row k="Location" v={fmtCoord(data.pos)} />
        <p className="pt-1 text-[10px] text-amber-200/70">Simulated LLN detection</p>
      </div>
    );
  }
  if (kind === 'zone') {
    const cell = cells.find((c) => c.id === data.cellId);
    return (
      <div className="min-w-[210px] space-y-1">
        <p className="font-semibold" style={{ color: data.level.color }}>{data.level.label} risk zone</p>
        <Row k="Driving cell" v={data.cellId} />
        <Row k="District" v={data.district} />
        {cell && <Row k="Lightning prob." v={`${Math.round(cell.lightningProb)}%`} />}
        {cell && <Row k="Severe prob." v={`${Math.round(cell.severeProb)}%`} />}
        <button onClick={() => onInspectCell(data.cellId)} className="btn-primary mt-2 w-full !py-1 !text-xs">Inspect storm cell</button>
      </div>
    );
  }
  if (kind === 'district') {
    const lvl = scoreToLevel(data.score);
    return (
      <div className="min-w-[200px] space-y-1">
        <p className="font-semibold text-slate-100">{data.name}</p>
        <Row k="Risk score" v={`${Math.round(data.score)} / 100`} vClass="" />
        <Row k="Risk level" v={lvl.key} vClass={lvl.text} />
        <Row k="Lightning prob." v={`${Math.round(data.lightningProb)}%`} />
        <Row k="Pop. exposed" v={fmtInt(data.affectedPopulation)} />
        <p className="pt-1 text-[10px] text-slate-500">Approximate boundaries (demonstration)</p>
      </div>
    );
  }
  if (kind === 'village') {
    return (
      <div className="min-w-[190px] space-y-1">
        <p className="font-semibold text-slate-100">{data.name} <span className="text-slate-500">· {data.taluk}</span></p>
        <Row k="Risk" v={data.level.key} vClass={data.level.text} />
        <Row k="Lightning prob." v={`${Math.round(data.lightningProb)}%`} />
        <Row k="Expected onset" v={data.onsetText} />
        <Row k="Population" v={fmtInt(data.population)} />
        <p className="pt-1 font-mono text-[11px] font-semibold" style={{ color: data.level.color }}>{data.action}</p>
      </div>
    );
  }
  return null;
}

export { dbzToIntensity };
