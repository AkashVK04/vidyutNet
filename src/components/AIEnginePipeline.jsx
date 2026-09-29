import { motion } from 'framer-motion';
import { Radar, Satellite, Zap, Merge, BrainCircuit, MapPinned, Siren, Cpu } from 'lucide-react';
import { modelInfo } from '../data/analyticsData.js';
import { DemoTag, Panel } from './ui.jsx';
import { cx } from '../utils/formatters.js';

const STAGES = [
  { label: 'Radar', sub: 'DWR Z · ZDR · KDP', icon: Radar, tone: 'cyan' },
  { label: 'Satellite', sub: 'INSAT-3D TIR / WV', icon: Satellite, tone: 'cyan' },
  { label: 'Lightning', sub: 'LLN CG + IC strokes', icon: Zap, tone: 'cyan' },
  { label: 'Data Fusion', sub: 'QC · regrid 1 km · sync', icon: Merge, tone: 'blue' },
  { label: 'Spatiotemporal AI Model', sub: 'ConvLSTM encoder–decoder', icon: BrainCircuit, tone: 'violet' },
  { label: 'Hyperlocal Forecast', sub: '0–60 min · 1 km grid', icon: MapPinned, tone: 'amber' },
  { label: 'Early Warning', sub: 'Village-level alerts', icon: Siren, tone: 'red' },
];

const TONE = {
  cyan: 'border-cyan-400/30 text-cyan-300 bg-cyan-400/[0.07]',
  blue: 'border-blue-400/30 text-blue-300 bg-blue-400/[0.07]',
  violet: 'border-violet-400/35 text-violet-300 bg-violet-400/[0.08]',
  amber: 'border-amber-400/35 text-amber-300 bg-amber-400/[0.07]',
  red: 'border-red-400/35 text-red-300 bg-red-500/[0.08]',
};

function FlowArrow({ delay = 0, horizontal = false }) {
  return (
    <div className={cx('relative flex items-center justify-center', horizontal ? 'h-6 w-8' : 'h-6 w-full')}>
      <div className={cx('bg-gradient-to-b from-cyan-400/10 to-cyan-400/40', horizontal ? 'h-px w-full bg-gradient-to-r' : 'h-full w-px')} />
      <motion.span
        className="absolute h-1.5 w-1.5 rounded-full bg-cyan-300 shadow-[0_0_8px_#22d3ee]"
        animate={horizontal ? { x: [-14, 14], opacity: [0, 1, 0] } : { y: [-10, 10], opacity: [0, 1, 0] }}
        transition={{ duration: 1.2, repeat: Infinity, delay, ease: 'easeInOut' }}
      />
    </div>
  );
}

export default function AIEnginePipeline({ className }) {
  const metrics = [
    ['Inference latency', modelInfo.latency],
    ['Forecast resolution', modelInfo.resolution],
    ['Forecast horizon', modelInfo.horizon],
    ['Refresh interval', modelInfo.refresh],
    ['Confidence', modelInfo.confidence],
  ];
  return (
    <Panel className={className} title={modelInfo.name} kicker="AI Nowcasting Engine" icon={Cpu} actions={<DemoTag>Demonstration metrics</DemoTag>}>
      <div className="grid gap-6 lg:grid-cols-[minmax(0,340px)_1fr]">
        <div className="flex flex-col items-stretch">
          {STAGES.map((s, i) => (
            <div key={s.label}>
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className={cx('flex items-center gap-3 rounded-md border px-3 py-2', TONE[s.tone])}
              >
                <s.icon size={16} />
                <div className="min-w-0">
                  <p className="text-[12.5px] font-semibold uppercase tracking-wide text-slate-100">{s.label}</p>
                  <p className="text-[11px] text-slate-400">{s.sub}</p>
                </div>
              </motion.div>
              {i < STAGES.length - 1 && <FlowArrow delay={i * 0.15} />}
            </div>
          ))}
        </div>
        <div className="space-y-4">
          <div>
            <p className="kicker">Model type</p>
            <p className="mt-0.5 text-[15px] font-semibold text-white">{modelInfo.type}</p>
            <p className="mt-1 text-[12.5px] leading-relaxed text-slate-400">{modelInfo.architecture}. Radar, satellite and lightning observations are fused on a common 1 km grid; the model extrapolates storm evolution and converts it into hazard probabilities for every village polygon.</p>
          </div>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {metrics.map(([k, v]) => (
              <div key={k} className="rounded-md border border-line bg-white/[0.015] px-3 py-2.5">
                <p className="kicker !text-[9.5px]">{k}</p>
                <p className="num mt-1 text-lg font-semibold text-white">{v}</p>
              </div>
            ))}
            <div className="rounded-md border border-line bg-white/[0.015] px-3 py-2.5">
              <p className="kicker !text-[9.5px]">Model version</p>
              <p className="num mt-1 text-lg font-semibold text-white">{modelInfo.version}</p>
            </div>
          </div>
          <p className="rounded-md border border-amber-400/20 bg-amber-400/[0.06] px-3 py-2 text-[11.5px] text-amber-100/80">
            These are prototype / demonstration values. No trained model runs in this frontend; forecasts are pre-computed synthetic data.
          </p>
          <div>
            <p className="kicker mb-2">Input tensors (per inference run)</p>
            <div className="grid grid-cols-2 gap-1.5 font-mono text-[11px] text-slate-400 sm:grid-cols-4">
              {['Z  [6×256×256]', 'ZDR [6×256×256]', 'TIR [4×256×256]', 'LLN [6×256×256]'].map((t) => (
                <span key={t} className="rounded border border-line px-2 py-1">{t}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Panel>
  );
}

export { FlowArrow };
