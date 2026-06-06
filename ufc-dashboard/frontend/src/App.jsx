import { useState } from "react";
import FighterList from "./components/FighterList";
import FighterCard from "./components/FighterCard";
import Comparator from "./components/Comparator";

export default function App() {
  const [tab, setTab] = useState("browse");
  const [selectedId, setSelectedId] = useState(null);

  return (
    <div className="app">
      <header className="header">
        <h1>
          <span className="accent">UFC</span> Dashboard
        </h1>
        <nav className="tabs">
          <button
            className={tab === "browse" ? "active" : ""}
            onClick={() => setTab("browse")}
          >
            Zawodnicy
          </button>
          <button
            className={tab === "compare" ? "active" : ""}
            onClick={() => setTab("compare")}
          >
            Porównywarka
          </button>
        </nav>
      </header>

      <main className="main">
        {tab === "browse" && (
          <div className="browse-layout">
            <FighterList onSelect={setSelectedId} />
            {selectedId ? (
              <FighterCard
                id={selectedId}
                onClose={() => setSelectedId(null)}
              />
            ) : (
              <div className="panel muted center placeholder">
                Wybierz zawodnika z listy, aby zobaczyć profil.
              </div>
            )}
          </div>
        )}
        {tab === "compare" && <Comparator />}
      </main>

      <footer className="footer">
        Dane: ufcstats (Kaggle) · React + Vite + Chart.js
      </footer>
    </div>
  );
}
