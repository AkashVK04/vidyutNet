import { Maximize2 } from 'lucide-react';
import { useApp } from '../context/AppContext.jsx';
import { timelineSteps } from '../data/timelineData.js';
import WeatherMap from '../components/WeatherMap.jsx';
import { MapLayerControl, MapLegend } from '../components/MapControls.jsx';
import Timeline from '../components/Timeline.jsx';
import KPIGrid from '../components/KPIGrid.jsx';
import StormCellPanel from '../components/StormCellPanel.jsx';
import VillageWarnings from '../components/VillageWarnings.jsx';
import SystemHealth from '../components/SystemHealth.jsx';
import RiskHeatmap from '../components/RiskHeatmap.jsx';
import ForecastChart from '../components/ForecastChart.jsx';
import { StatusBar, RoleFocusPanel } from '../components/DashboardWidgets.jsx';
import { DemoTag, Tooltip } from '../components/ui.jsx';
import { ROLES } from '../data/systemData.js';
import PublicWarning from './PublicWarning.jsx';

export default function Dashboard() {
  const { timeStep, role, setPresentation } = useApp();
  const roleMeta = ROLES.find((r) => r.id === role);

  if (role === 'public') {
    return (
      <div className="space-y-3">
        <StatusBar />
        <PublicWarning embedded />
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <StatusBar />
      <KPIGrid />

      <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_330px] 2xl:grid-cols-[minmax(0,1fr)_370px]">
        <section className="panel relative h-[max(540px,calc(100vh-265px))] overflow-hidden p-0" aria-label="Hyperlocal nowcast map">
          <WeatherMap districtRiskFill={role === 'ddma'}>
            <div className="pointer-events-none absolute left-3 top-3 z-[800] flex flex-wrap items-center gap-2">
              <div className="panel-glass pointer-events-auto px-3 py-1.5">
                <p className="kicker !text-[9.5px] text-cyan-300/80">Hyperlocal Nowcast Map</p>
                <p className="text-[12.5px] font-semibold text-white">
                  Karnataka · Bengaluru region <span className="num font-normal text-slate-400">· valid {timelineSteps[timeStep].time} IST</span>
                </p>
              </div>
              <DemoTag className="pointer-events-auto hidden sm:inline-flex" />
              {role !== 'ddma' && <span className="chip pointer-events-auto border-cyan-400/30 bg-ink-900/90 text-cyan-200">{roleMeta.label} overlay</span>}
            </div>
            <div className="absolute right-3 top-3 z-[800] flex items-start gap-2">
              <Tooltip label="Presentation Mode">
                <button onClick={() => setPresentation(true)} className="panel-glass grid h-9 w-9 place-items-center text-slate-300 hover:text-white" aria-label="Maximize map in presentation mode">
                  <Maximize2 size={15} />
                </button>
              </Tooltip>
              <MapLayerControl className="hidden sm:block" />
            </div>
            <MapLegend className="absolute bottom-[104px] left-3 z-[800] hidden sm:block" />
            <Timeline className="absolute bottom-3 left-3 right-3 z-[800] md:right-14" />
          </WeatherMap>
        </section>

        <aside className="flex min-w-0 flex-col gap-3">
          <StormCellPanel />
          <RoleFocusPanel />
          <VillageWarnings limit={4} dense />
          <SystemHealth />
        </aside>
      </div>

      <RiskHeatmap />
      <ForecastChart />
    </div>
  );
}
