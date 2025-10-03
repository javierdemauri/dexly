const API_URL = import.meta.env.VITE_API_URL;

export async function login(username, password) {
  const r = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password })
  });
  if (!r.ok) throw new Error("Credenciales inválidas");
  const data = await r.json();
  localStorage.setItem("dexly_token", data.token);
  return data.token;
}

export function logout() {
  localStorage.removeItem("dexly_token");
}

export async function getDe(key) {
  const token = localStorage.getItem("dexly_token");
  if (!token) throw new Error("No autenticado");
  const r = await fetch(`${API_URL}/de/${encodeURIComponent(key)}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (r.status === 401 || r.status === 403) { logout(); throw new Error("Sesión expirada"); }
  if (!r.ok) throw new Error("Error API");
  return r.json();
}
