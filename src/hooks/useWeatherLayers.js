import { useMemo } from 'react';
import { stormCells, cellStateAt, futurePositions } from '../data/stormCellsData.js';
import { reflectivityRings } from '../data/radarData.js';
import { irCloudShields } from '../data/satelliteData.js';
import { generateStrikes } from '../data/lightningData.js';
import { riskZonesFor, predictionCone, rainfallField, windField } from '../data/riskZonesData.js';
import { districts, districtStateAt } from '../data/districtsData.js';
import { villages, villageStateAt } from '../data/villagesData.js';

/** Resolved storm-cell states at fractional step t. */
export function useStormCells(t, dbzJitter = 0) {
  return useMemo(() => stormCells.map((c) => cellStateAt(c, t, c.dbz[0] >= 40 ? dbzJitter : dbzJitter * 0.4)), [t, dbzJitter]);
}

/** All simulated map overlays derived from the storm cells. */
export function useWeatherLayers(t, sim = {}) {
  const cells = useStormCells(t, sim.dbzJitter || 0);
  const stepForStrikes = Math.round(t);

  const radar = useMemo(() => cells.flatMap(reflectivityRings), [cells]);
  const satellite = useMemo(() => cells.flatMap(irCloudShields), [cells]);
  const risk = useMemo(() => cells.flatMap(riskZonesFor), [cells]);
  const rainfall = useMemo(() => cells.flatMap(rainfallField), [cells]);
  const wind = useMemo(() => windField(cells), [cells]);
  const tracks = useMemo(
    () =>
      cells
        .filter((c) => c.dbz >= 40)
        .map((c) => ({ id: c.id, cell: c, cone: predictionCone(c, 30), points: futurePositions(c, t, 3) })),
    [cells, t],
  );
  // Strikes are regenerated per whole step (plus simulation extras) to keep them stable while tweening.
  const strikes = useMemo(() => generateStrikes(stepForStrikes, sim.strikeExtra || 0), [stepForStrikes, sim.strikeExtra]);

  return { cells, radar, satellite, risk, rainfall, wind, tracks, strikes };
}

export function useDistrictStates(t, riskJitter = 0) {
  return useMemo(() => districts.map((d) => districtStateAt(d, t, d.risk[0] > 30 ? riskJitter : 0)), [t, riskJitter]);
}

export function useVillageStates(t, jitter = 0) {
  return useMemo(
    () => villages.map((v) => villageStateAt(v, t, v.prob[0] > 40 ? jitter : 0)).sort((a, b) => b.lightningProb - a.lightningProb),
    [t, jitter],
  );
}
