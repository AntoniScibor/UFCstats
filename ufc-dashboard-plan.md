# UFC Dashboard — Plan Projektu

## Stack technologiczny

| Warstwa | Technologia |
|---|---|
| Dane | CSV z Kaggle (ufcstats) |
| Baza danych | SQLite + SQLAlchemy |
| Backend | Python 3 + Flask (REST API) |
| Frontend | React + Vite + Chart.js |

---

## Struktura projektu

```
ufc-dashboard/
├── backend/
│   ├── app.py              # Flask, definicje endpointów
│   ├── models.py           # SQLAlchemy modele (Fighter, Fight)
│   ├── database.py         # połączenie z SQLite
│   ├── import_data.py      # skrypt importu CSV → SQLite
│   └── data/
│       ├── fighters.csv
│       └── fights.csv
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── api/
│   │   │   └── client.js       # fetch do Flask API
│   │   ├── components/
│   │   │   ├── FighterList.jsx     # tabela z wyszukiwarką
│   │   │   ├── FighterCard.jsx     # profil zawodnika
│   │   │   ├── RadarChart.jsx      # radar chart stylu walki
│   │   │   ├── FightHistory.jsx    # historia walk
│   │   │   └── Comparator.jsx      # porównywarka 2 zawodników
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
└── README.md
```

---

## Źródła danych

- **Statystyki zawodników:** https://www.kaggle.com/datasets/asaniczka/ufc-fighters-statistics
- **Wyniki walk + eventy:** https://github.com/Greco1899/scrape_ufc_stats
- **Dataset zbiorczy (z kursami bukmacherskimi):** https://github.com/jansen88/ufc-match-predictor

### Dostępne dane

| Kategoria | Pola |
|---|---|
| Profil zawodnika | imię, rekord (W/L), wzrost, waga, zasięg, stance, data urodzenia |
| Statystyki uderzeniowe | SLpM, SApM, Str. Acc., Str. Def. |
| Statystyki grapplingu | TD Avg., TD Acc., TD Def., Sub. Avg. |
| Walka | metoda (KO/SUB/DEC), runda, czas, event, data |
| Round-by-round | uderzenia głowa/ciało/nogi, takedowny, czas kontroli — per runda |
| Kursy bukmacherskie | kursy przed walką (dane od 2014) |

---

## API Endpoints (Flask)

| Method | Endpoint | Opis |
|---|---|---|
| GET | `/api/fighters` | lista zawodników (+ filtrowanie, wyszukiwanie) |
| GET | `/api/fighters/<id>` | szczegóły zawodnika + statystyki |
| GET | `/api/fighters/<id>/fights` | historia walk zawodnika |
| GET | `/api/fights/<id>` | szczegóły walki |
| GET | `/api/compare?f1=<id>&f2=<id>` | dane do porównywarki |
| GET | `/api/weightclasses` | lista kategorii wagowych |

---

## Plan implementacji

### Tydzień 1 — Backend
- [ ] Pobierz datasety z Kaggle / GitHub
- [ ] Napisz `import_data.py` — wczytaj CSV, zapisz do SQLite
- [ ] Zdefiniuj modele SQLAlchemy (`models.py`)
- [ ] Postaw Flask (`app.py`) z CORS
- [ ] Zaimplementuj endpointy
- [ ] Przetestuj API w Postmanie / curl

### Tydzień 2 — Frontend
- [ ] Stwórz projekt React z Vite (`npm create vite@latest`)
- [ ] Podłącz frontend do Flask API
- [ ] `FighterList` — tabela z wyszukiwarką i filtrem kategorii wagowej
- [ ] `FighterCard` — profil zawodnika ze statystykami
- [ ] `RadarChart` — radar chart: striking / grappling / defense / cardio
- [ ] `FightHistory` — tabela historii walk z metodami zwycięstw

### Tydzień 3 — Rozbudowa i dopieszczanie
- [ ] `Comparator` — porównywarka dwóch zawodników side-by-side
- [ ] Wykres kołowy metod zwycięstw (KO / SUB / DEC / Others)
- [ ] Wykres formy zawodnika w czasie (ostatnie N walk)
- [ ] Filtry: kategoria wagowa, stance, narodowość
- [ ] Responsywny layout (CSS / Tailwind)

---

## Przykładowe wizualizacje

1. **Radar chart** — striking vs grappling vs defense vs cardio (per zawodnik)
2. **Pie chart** — rozkład metod zwycięstw (KO/TKO, Submission, Decision)
3. **Bar chart** — top 10 zawodników wg skuteczności uderzeń w kategorii wagowej
4. **Line chart** — forma zawodnika na przestrzeni ostatnich walk
5. **Porównywarka** — dwie kolumny ze statystykami i wykres różnic
6. **Histogram** — rozkład zasięgu ramion / wzrostu w danej kategorii wagowej

---

## Uruchomienie projektu (docelowo)

```bash
# Backend
cd backend
pip install flask flask-sqlalchemy flask-cors pandas
python import_data.py   # jednorazowy import danych
python app.py           # http://localhost:5000

# Frontend
cd frontend
npm install
npm run dev             # http://localhost:5173
```
