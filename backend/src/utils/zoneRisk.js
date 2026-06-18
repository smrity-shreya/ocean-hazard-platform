/**
 * Zone Risk Algorithm
 * -----------------------------------------------------------------------
 * Buckets hazard reports into a coordinate grid and computes a risk score
 * per cell so the frontend map can render green / yellow / red zones.
 *
 * Steps:
 *  1. Filter to reports from the last `WINDOW_HOURS` hours, status != rejected.
 *  2. Snap each report's lat/lng to a grid cell of size GRID_SIZE_DEG.
 *  3. For each report, weight = SEVERITY_WEIGHT[severity] * recencyDecay(hoursAgo).
 *     recencyDecay = max(0.2, 1 - hoursAgo / WINDOW_HOURS)  -> newer reports count more.
 *  4. Sum weights per cell -> riskScore.
 *  5. Classify: score < GREEN_MAX -> green, < YELLOW_MAX -> yellow, else red.
 * -----------------------------------------------------------------------
 */

const GRID_SIZE_DEG = 0.05; // ~5.5km per cell
const WINDOW_HOURS = 24;
const SEVERITY_WEIGHT = { low: 1, medium: 2.5, high: 5 };
const GREEN_MAX = 3;
const YELLOW_MAX = 7;

function cellKey(lat, lng) {
  const cellLat = Math.floor(lat / GRID_SIZE_DEG) * GRID_SIZE_DEG;
  const cellLng = Math.floor(lng / GRID_SIZE_DEG) * GRID_SIZE_DEG;
  return `${cellLat.toFixed(3)}_${cellLng.toFixed(3)}`;
}

function classify(score) {
  if (score < GREEN_MAX) return 'green';
  if (score < YELLOW_MAX) return 'yellow';
  return 'red';
}

/**
 * @param {Array} reports - array of HazardReport docs (lean), each with
 *   location.lat, location.lng, severity, createdAt, status
 * @returns {Array<{lat, lng, score, zoneColor, reportCount}>}
 */
function computeZoneRisk(reports) {
  const now = Date.now();
  const cutoff = now - WINDOW_HOURS * 60 * 60 * 1000;
  const cells = new Map();

  for (const report of reports) {
    if (report.status === 'rejected') continue;
    const createdAt = new Date(report.createdAt).getTime();
    if (createdAt < cutoff) continue;

    const hoursAgo = (now - createdAt) / (1000 * 60 * 60);
    const recencyDecay = Math.max(0.2, 1 - hoursAgo / WINDOW_HOURS);
    const weight = (SEVERITY_WEIGHT[report.severity] || 1) * recencyDecay;

    const key = cellKey(report.location.lat, report.location.lng);
    if (!cells.has(key)) {
      cells.set(key, {
        lat: Math.floor(report.location.lat / GRID_SIZE_DEG) * GRID_SIZE_DEG + GRID_SIZE_DEG / 2,
        lng: Math.floor(report.location.lng / GRID_SIZE_DEG) * GRID_SIZE_DEG + GRID_SIZE_DEG / 2,
        score: 0,
        reportCount: 0,
      });
    }
    const cell = cells.get(key);
    cell.score += weight;
    cell.reportCount += 1;
  }

  return Array.from(cells.values()).map((cell) => ({
    ...cell,
    score: Math.round(cell.score * 100) / 100,
    zoneColor: classify(cell.score),
  }));
}

module.exports = { computeZoneRisk, GRID_SIZE_DEG, WINDOW_HOURS, SEVERITY_WEIGHT };
