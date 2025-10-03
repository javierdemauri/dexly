const API_URL = import.meta.env.VITE_API_URL;

export async function pingApi() {
  const r = await fetch(`${API_URL}/`);
  if (!r.ok) throw new Error("API error");
  return r.text();
}