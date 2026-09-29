# VidyutNet — AI-Powered Hyperlocal Weather Nowcasting & Early Warning System

**SIH 2026 · Problem Statement SIH26072** — AI/ML based nowcasting of thunderstorm and lightning using radar, satellite, lightning and model data.

> Frontend-only prototype. All weather data, alerts and model metrics are **synthetic demonstration data**. No backend, API keys, database or real ML inference are required, and no messages are ever sent.

## Run

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # production build in dist/
```

Requires Node 18+. The base map uses free CARTO/OpenStreetMap tiles (no key); if offline, all weather overlays still render on a dark background.

## Stack
React 18 · Vite · Tailwind CSS · React Leaflet · Recharts · Framer Motion · Lucide icons · d3-delaunay (approximate district boundaries).

## Screens
| Route | Screen |
|---|---|
| `#/` | Landing / demo sign-in |
| `#/app/overview` | Main Operations Dashboard (map, KPIs, timeline, storm cells, village warnings, district heatmap, 3-h forecast) |
| `#/app/nowcast` | Hyperlocal Nowcast (precipitation · lightning · severe risk panels, cell forecast table) |
| `#/app/lightning` | Lightning Intelligence (strike map, clusters, predicted path, stroke feed) |
| `#/app/alerts` | Early Warning Center (alert cards, details modal, Create Alert simulation) |
| `#/app/data-sources` | Data Sources Monitor + AI Nowcasting Engine pipeline |
| `#/app/analytics` | Model performance (prototype metrics, contingency table, CSI) |
| `#/public` | Public warning screen (6 languages; English/Kannada complete) |

## Suggested demo flow (for judges)
1. Landing → **Open Command Center**.
2. Point at *System Status: Operational* and the data-flow strip.
3. Toggle layers (Radar, Satellite IR, Lightning, Risk Zones, Prediction Track, Wind, Rainfall).
4. Click storm cell **KAR-042** → side panel with intensity, motion, probabilities.
5. Drag the **Nowcast Timeline** forward (or ←/→ keys, or ▶) — cells move NE, lightning grows, risk zones expand.
6. **Alerts** → open the Severe Thunderstorm Warning → Broadcast (simulated) / Acknowledge / Download GeoJSON.
7. **Create Alert** → Preview → *Prototype Alert Generated Successfully*.
8. **PRESENTATION MODE** → **Start Scenario** (Karnataka Severe Thunderstorm Event, 09:40 → 10:40).
9. Finish on the **Public Warning** screen (switch to ಕನ್ನಡ).

Other controls: **DEMO** toggle (Simulation Mode: live clock, fluctuating values, synthetic alerts), stakeholder **View** selector (DDMA, NDRF/SDRF, Power Utility, Airport, Railways, Public), language selector, notification centre, profile → settings & system status.

## Project structure
```
src/
  components/     Header, KPIGrid, WeatherMap (+ map/layers), MapControls, Timeline, StormCellPanel,
                  AlertCard, AlertModal, CreateAlertModal, DataSourceCard, SystemHealth, RiskHeatmap,
                  ForecastChart, NotificationCenter, Language/RoleSelector, PresentationMode, SettingsDrawer …
  pages/          Landing, Dashboard, Nowcast, Lightning, Alerts, DataSources, Analytics, PublicWarning
  data/           stormCellsData, radarData, satelliteData, lightningData, riskZonesData, districtsData,
                  villagesData, alertsData, forecastData, analyticsData, infrastructureData, systemData,
                  timelineData, translations
  hooks/          useSimulation, useWeatherLayers, useTween, useClickOutside
  context/        AppContext (global state), ToastContext
  utils/          geo, riskCalculator, formatters, alertGeometry, chartTheme
```

## Honesty notes
- District boundaries are an approximate tessellation, labelled as such.
- Translations are illustrative and should be reviewed by native speakers before any operational use.
- Skill scores (CSI 0.68 etc.) are labelled *Prototype / Demonstration Metrics*.
