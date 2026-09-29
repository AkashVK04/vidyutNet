// Shared Recharts styling. Categorical palette validated for the dark surface
// (lightness band, CVD separation and contrast) — assign in this fixed order.
export const SERIES = ['#0ea5c6', '#d97706', '#8b5cf6'];

export const axisProps = {
  stroke: 'rgba(148,178,222,0.25)',
  tick: { fill: '#8193ad', fontSize: 10.5, fontFamily: 'JetBrains Mono, monospace' },
  tickLine: false,
  axisLine: { stroke: 'rgba(148,178,222,0.18)' },
};

export const gridProps = { stroke: 'rgba(148,178,222,0.08)', vertical: false };

export const tooltipProps = {
  contentStyle: {
    background: 'rgba(10,20,38,0.97)',
    border: '1px solid rgba(148,178,222,0.2)',
    borderRadius: 6,
    fontSize: 12,
    color: '#e2e8f0',
    padding: '6px 10px',
  },
  labelStyle: { color: '#94a3b8', fontFamily: 'JetBrains Mono, monospace', fontSize: 11, marginBottom: 2 },
  itemStyle: { color: '#e2e8f0', padding: 0 },
  cursor: { stroke: 'rgba(148,178,222,0.35)', strokeWidth: 1 },
};
