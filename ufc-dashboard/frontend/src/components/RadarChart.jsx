import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from "chart.js";
import { Radar } from "react-chartjs-2";
import { radarValues, RADAR_LABELS } from "../utils/stats";

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

const COLORS = [
  { line: "#e11d48", fill: "rgba(225,29,72,0.25)" },
  { line: "#3b82f6", fill: "rgba(59,130,246,0.25)" },
];

// Przyjmuje 1 lub 2 zawodników i rysuje nałożone radary.
export default function RadarChart({ fighters }) {
  const list = Array.isArray(fighters) ? fighters : [fighters];

  const data = {
    labels: RADAR_LABELS,
    datasets: list.map((f, i) => ({
      label: f.name,
      data: radarValues(f),
      borderColor: COLORS[i % COLORS.length].line,
      backgroundColor: COLORS[i % COLORS.length].fill,
      borderWidth: 2,
      pointBackgroundColor: COLORS[i % COLORS.length].line,
    })),
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      r: {
        min: 0,
        max: 100,
        angleLines: { color: "rgba(255,255,255,0.1)" },
        grid: { color: "rgba(255,255,255,0.1)" },
        pointLabels: { color: "#cbd5e1", font: { size: 12 } },
        ticks: {
          color: "#64748b",
          backdropColor: "transparent",
          stepSize: 25,
        },
      },
    },
    plugins: {
      legend: {
        display: list.length > 1,
        labels: { color: "#e2e8f0" },
      },
    },
  };

  return (
    <div style={{ height: 320 }}>
      <Radar data={data} options={options} />
    </div>
  );
}
