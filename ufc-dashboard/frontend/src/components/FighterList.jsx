import { useEffect, useState } from "react";
import { getFighters, getStances } from "../api/client";

const COLUMNS = [
  { key: "name", label: "Zawodnik" },
  { key: "stance", label: "Stance", sortable: false },
  { key: "record", label: "Rekord", sortable: false },
  { key: "slpm", label: "SLpM" },
  { key: "str_acc", label: "Celność %" },
  { key: "td_avg", label: "TD/15" },
];

export default function FighterList({ onSelect }) {
  const [fighters, setFighters] = useState([]);
  const [stances, setStances] = useState([]);
  const [search, setSearch] = useState("");
  const [stance, setStance] = useState("");
  const [sort, setSort] = useState("name");
  const [order, setOrder] = useState("asc");
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    getStances().then(setStances).catch(() => {});
  }, []);

  // Debounce wyszukiwarki -> reset strony.
  useEffect(() => {
    const t = setTimeout(() => setPage(1), 300);
    return () => clearTimeout(t);
  }, [search, stance]);

  useEffect(() => {
    setLoading(true);
    setError(null);
    getFighters({ search, stance, sort, order, page, per_page: 20 })
      .then((res) => {
        setFighters(res.fighters);
        setPages(res.pages);
        setTotal(res.total);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [search, stance, sort, order, page]);

  const toggleSort = (key) => {
    if (sort === key) {
      setOrder(order === "asc" ? "desc" : "asc");
    } else {
      setSort(key);
      setOrder("asc");
    }
  };

  return (
    <div className="panel">
      <div className="toolbar">
        <input
          className="input"
          placeholder="Szukaj zawodnika…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="input"
          value={stance}
          onChange={(e) => setStance(e.target.value)}
        >
          <option value="">Wszystkie stance</option>
          {stances.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <span className="muted">{total} zawodników</span>
      </div>

      {error && <div className="error">Błąd: {error}</div>}

      <table className="table">
        <thead>
          <tr>
            {COLUMNS.map((c) => (
              <th
                key={c.key}
                onClick={() => c.sortable !== false && toggleSort(c.key)}
                className={c.sortable !== false ? "sortable" : ""}
              >
                {c.label}
                {sort === c.key && (order === "asc" ? " ▲" : " ▼")}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {fighters.map((f) => (
            <tr key={f.id} onClick={() => onSelect(f.id)} className="row">
              <td>
                <strong>{f.name}</strong>
                {f.nickname && <span className="nick"> "{f.nickname}"</span>}
              </td>
              <td>{f.physical.stance || "—"}</td>
              <td>
                {f.record.wins}-{f.record.losses}-{f.record.draws}
              </td>
              <td>{f.striking.slpm ?? "—"}</td>
              <td>{f.striking.str_acc ?? "—"}</td>
              <td>{f.grappling.td_avg ?? "—"}</td>
            </tr>
          ))}
          {!loading && fighters.length === 0 && (
            <tr>
              <td colSpan={COLUMNS.length} className="muted center">
                Brak wyników
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <div className="pager">
        <button disabled={page <= 1} onClick={() => setPage(page - 1)}>
          ← Poprzednia
        </button>
        <span>
          Strona {page} / {pages}
        </span>
        <button disabled={page >= pages} onClick={() => setPage(page + 1)}>
          Następna →
        </button>
      </div>
    </div>
  );
}
