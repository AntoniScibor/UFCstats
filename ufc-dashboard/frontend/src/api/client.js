// Cienki klient REST do Flask API. W dev requesty /api są proxowane przez Vite.
const BASE = import.meta.env.VITE_API_URL || "";

async function request(path, params) {
  const url = new URL(`${BASE}/api${path}`, window.location.origin);
  if (params) {
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== "") url.searchParams.set(k, v);
    });
  }
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`API ${res.status}: ${res.statusText}`);
  }
  return res.json();
}

export const getFighters = (params) => request("/fighters", params);
export const getFighter = (id) => request(`/fighters/${id}`);
export const getStances = () => request("/stances");
export const compareFighters = (f1, f2) => request("/compare", { f1, f2 });
export const getHealth = () => request("/health");