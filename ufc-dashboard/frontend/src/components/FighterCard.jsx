import { useEffect, useState } from "react";
import { getFighter } from "../api/client";
import RadarChart from "./RadarChart";
import { age, fmt } from "../utils/stats";

function StatRow({ label, value, suffix }) {
  return (
    <div className="stat-row">
      <span className="stat-label">{label}</span>
      <span className="stat-value">{fmt(value, suffix)}</span>
    </div>
  );
}

export default function FighterCard({ id, onClose }) {
  const [fighter, setFighter] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    setFighter(null);
    setError(null);
    getFighter(id)
      .then(setFighter)
      .catch((e) => setError(e.message));
  }, [id]);

  if (error) return <div className="panel error">Błąd: {error}</div>;
  if (!fighter) return <div className="panel muted">Ładowanie…</div>;

  const { physical: p, striking: s, grappling: g, record: r } = fighter;
  const a = age(p.date_of_birth);

  return (
    <div className="panel card">
      <div className="card-header">
        <div>
          <h2>{fighter.name}</h2>
          {fighter.nickname && <p className="nick">"{fighter.nickname}"</p>}
          <p className="record">
            {r.wins}-{r.losses}-{r.draws}{" "}
            <span className="muted">(W-L-D)</span>
          </p>
        </div>
        {onClose && (
          <button className="close" onClick={onClose}>
            ✕
          </button>
        )}
      </div>

      <RadarChart fighters={fighter} />

      <div className="stat-grid">
        <div className="stat-block">
          <h4>Fizyczne</h4>
          <StatRow label="Wzrost" value={p.height_cm} suffix=" cm" />
          <StatRow label="Waga" value={p.weight_kg} suffix=" kg" />
          <StatRow label="Zasięg" value={p.reach_cm} suffix=" cm" />
          <StatRow label="Stance" value={p.stance} />
          <StatRow label="Wiek" value={a} suffix=" lat" />
        </div>
        <div className="stat-block">
          <h4>Uderzenia</h4>
          <StatRow label="SLpM" value={s.slpm} />
          <StatRow label="Celność" value={s.str_acc} suffix="%" />
          <StatRow label="SApM" value={s.sapm} />
          <StatRow label="Obrona" value={s.str_def} suffix="%" />
        </div>
        <div className="stat-block">
          <h4>Grappling</h4>
          <StatRow label="TD / 15 min" value={g.td_avg} />
          <StatRow label="Celność TD" value={g.td_acc} suffix="%" />
          <StatRow label="Obrona TD" value={g.td_def} suffix="%" />
          <StatRow label="Sub / 15 min" value={g.sub_avg} />
        </div>
      </div>
    </div>
  );
}
