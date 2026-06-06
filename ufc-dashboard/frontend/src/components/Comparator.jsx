import { useEffect, useState } from "react";
import { getFighters, compareFighters } from "../api/client";
import RadarChart from "./RadarChart";
import { age, fmt } from "../utils/stats";

// Wyszukiwarka pojedynczego zawodnika z podpowiedziami.
function FighterPicker({ label, value, onPick }) {
  const [q, setQ] = useState("");
  const [results, setResults] = useState([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!q) {
      setResults([]);
      return;
    }
    const t = setTimeout(() => {
      getFighters({ search: q, per_page: 8 })
        .then((res) => setResults(res.fighters))
        .catch(() => {});
    }, 250);
    return () => clearTimeout(t);
  }, [q]);

  return (
    <div className="picker">
      <label className="picker-label">{label}</label>
      <input
        className="input"
        placeholder="Szukaj…"
        value={value ? value.name : q}
        onChange={(e) => {
          setQ(e.target.value);
          setOpen(true);
          if (value) onPick(null);
        }}
        onFocus={() => setOpen(true)}
      />
      {open && results.length > 0 && (
        <ul className="dropdown">
          {results.map((f) => (
            <li
              key={f.id}
              onClick={() => {
                onPick(f);
                setOpen(false);
                setQ("");
              }}
            >
              {f.name}
              {f.nickname && <span className="nick"> "{f.nickname}"</span>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

const ROWS = [
  ["Rekord", (f) => `${f.record.wins}-${f.record.losses}-${f.record.draws}`],
  ["Wzrost", (f) => fmt(f.physical.height_cm, " cm")],
  ["Zasięg", (f) => fmt(f.physical.reach_cm, " cm")],
  ["Stance", (f) => fmt(f.physical.stance)],
  ["Wiek", (f) => fmt(age(f.physical.date_of_birth), " lat")],
  ["SLpM", (f) => fmt(f.striking.slpm)],
  ["Celność", (f) => fmt(f.striking.str_acc, "%")],
  ["SApM", (f) => fmt(f.striking.sapm)],
  ["Obrona", (f) => fmt(f.striking.str_def, "%")],
  ["TD / 15 min", (f) => fmt(f.grappling.td_avg)],
  ["Obrona TD", (f) => fmt(f.grappling.td_def, "%")],
  ["Sub / 15 min", (f) => fmt(f.grappling.sub_avg)],
];

export default function Comparator() {
  const [f1, setF1] = useState(null);
  const [f2, setF2] = useState(null);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (f1 && f2) {
      compareFighters(f1.id, f2.id)
        .then(setData)
        .catch((e) => setError(e.message));
    } else {
      setData(null);
    }
  }, [f1, f2]);

  return (
    <div className="panel">
      <div className="comparator-pickers">
        <FighterPicker label="Zawodnik 1" value={f1} onPick={setF1} />
        <span className="vs">VS</span>
        <FighterPicker label="Zawodnik 2" value={f2} onPick={setF2} />
      </div>

      {error && <div className="error">Błąd: {error}</div>}

      {data && (
        <>
          <RadarChart fighters={[data.fighter1, data.fighter2]} />
          <table className="table compare-table">
            <thead>
              <tr>
                <th>{data.fighter1.name}</th>
                <th className="stat-name">Statystyka</th>
                <th>{data.fighter2.name}</th>
              </tr>
            </thead>
            <tbody>
              {ROWS.map(([label, fn]) => (
                <tr key={label}>
                  <td className="c1">{fn(data.fighter1)}</td>
                  <td className="stat-name">{label}</td>
                  <td className="c2">{fn(data.fighter2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      {!data && (
        <p className="muted center">Wybierz dwóch zawodników do porównania.</p>
      )}
    </div>
  );
}
