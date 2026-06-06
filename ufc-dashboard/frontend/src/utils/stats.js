// Normalizacja statystyk do skali 0-100 na potrzeby radar chartu.
// Procenty (acc/def) zostają jak są; wartości "per minute / per 15 min"
// skalujemy względem rozsądnych maksimów spotykanych w UFC.
const clamp = (v) => Math.max(0, Math.min(100, v));

export function radarValues(fighter) {
  const s = fighter.striking || {};
  const g = fighter.grappling || {};
  return [
    clamp((s.slpm || 0) * 10), // Atak (SLpM, ~10 = max)
    clamp(s.str_acc || 0), // Celność (%)
    clamp(s.str_def || 0), // Obrona (%)
    clamp((g.td_avg || 0) * 16.7), // Takedowny (~6/15min = max)
    clamp(g.td_def || 0), // Obrona TD (%)
    clamp((g.sub_avg || 0) * 33.3), // Submission (~3/15min = max)
  ];
}

export const RADAR_LABELS = [
  "Atak (SLpM)",
  "Celność",
  "Obrona",
  "Takedowny",
  "Obrona TD",
  "Submission",
];

export function age(dob) {
  if (!dob) return null;
  const d = new Date(dob);
  if (isNaN(d)) return null;
  const diff = Date.now() - d.getTime();
  return Math.floor(diff / (365.25 * 24 * 3600 * 1000));
}

export const fmt = (v, suffix = "") =>
  v === null || v === undefined ? "—" : `${v}${suffix}`;
