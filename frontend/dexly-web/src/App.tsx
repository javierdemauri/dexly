import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";

// ------------------------------
// Simple Auth Context (mock)
// ------------------------------

type AuthContextValue = {
  isAuthenticated: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
  return ctx;
}

function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  // Restore from localStorage to persist sessions in dev
  useEffect(() => {
    const flag = localStorage.getItem("dexly_demo_authed");
    setIsAuthenticated(flag === "1");
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      isAuthenticated,
      async signIn(email: string, _password: string) {
        // TODO: reemplazar con auth real (SFMC / JWT). Por ahora valida formato email.
        if (!email.includes("@")) throw new Error("Ingrese un email válido");
        localStorage.setItem("dexly_demo_authed", "1");
        setIsAuthenticated(true);
      },
      signOut() {
        localStorage.removeItem("dexly_demo_authed");
        setIsAuthenticated(false);
      }
    }),
    [isAuthenticated]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// ------------------------------
// Layout (Top Navbar)
// ------------------------------

function TopNav() {
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = () => {
    signOut();
    navigate("/login", { replace: true });
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-4 px-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-black text-white font-bold">D</div>
          <span className="text-sm font-semibold tracking-wide">Dexly</span>
          <span className="ml-2 hidden text-xs text-neutral-500 sm:inline">Data Extensions – Console</span>
        </div>
        <nav className="flex items-center gap-3">
          <button
            onClick={handleSignOut}
            className="inline-flex items-center gap-2 rounded-xl border px-3 py-1.5 text-sm font-medium shadow-sm transition hover:bg-neutral-50 active:scale-[0.98]"
            aria-label="Sign out"
            title="Sign out"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">Sign out</span>
          </button>
        </nav>
      </div>
    </header>
  );
}

function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900">
      <TopNav />
      <main className="mx-auto max-w-7xl px-4 py-6">{children}</main>
    </div>
  );
}

// ------------------------------
// Pages
// ------------------------------

function LoginPage() {
  const { isAuthenticated, signIn } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthenticated) navigate("/app", { replace: true });
  }, [isAuthenticated, navigate]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await signIn(email, password);
      navigate("/app", { replace: true });
    } catch (err: any) {
      setError(err?.message ?? "No se pudo iniciar sesión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid min-h-screen place-items-center bg-neutral-50 px-4 py-10">
      <div className="w-full max-w-md rounded-2xl border bg-white p-6 shadow-sm">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-2xl bg-black text-white text-lg font-bold">D</div>
          <h1 className="text-lg font-semibold">Dexly – Sign in</h1>
          <p className="mt-1 text-sm text-neutral-500">Accedé a tu consola de Data Extensions</p>
        </div>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border px-3 py-2 text-sm outline-none ring-black/5 focus:ring"
              placeholder="javi@example.com"
              autoComplete="username"
              required
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border px-3 py-2 text-sm outline-none ring-black/5 focus:ring"
              placeholder="••••••••"
              autoComplete="current-password"
              required
            />
          </div>
          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>
          )}
          <button
            type="submit"
            disabled={loading}
            className="inline-flex w-full items-center justify-center rounded-xl bg-black px-3 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-black/90 active:scale-[0.99] disabled:opacity-60"
          >
            {loading ? "Ingresando…" : "Ingresar"}
          </button>
        </form>
        <p className="mt-4 text-center text-xs text-neutral-500">Demo: cualquier email con “@” y password cualquiera</p>
      </div>
    </div>
  );
}

function MainPage() {
  // Placeholder for the "tabla principal" (DE overview soon)
  return (
    <AppShell>
      <section className="mb-5">
        <h2 className="text-xl font-semibold">Main View</h2>
        <p className="mt-1 text-sm text-neutral-600">
          Esta será la tabla principal del producto. Por ahora, dejamos un placeholder con datos de ejemplo.
        </p>
      </section>

      <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">
        <div className="border-b bg-neutral-50 px-4 py-3 text-sm text-neutral-600">Data Extensions (demo)</div>
        <div className="w-full overflow-x-auto">
          <table className="w-full min-w-[720px] table-fixed text-left text-sm">
            <thead>
              <tr className="border-b bg-white">
                <th className="px-4 py-3 font-medium">Nombre</th>
                <th className="px-4 py-3 font-medium">Filas</th>
                <th className="px-4 py-3 font-medium">Última carga</th>
                <th className="px-4 py-3 font-medium">Owner</th>
              </tr>
            </thead>
            <tbody>
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <tr key={i} className="border-b last:border-0 hover:bg-neutral-50">
                  <td className="truncate px-4 py-3">DE_Subscribers_{i}</td>
                  <td className="px-4 py-3 tabular-nums">{(Math.random()*1_000_000).toFixed(0)}</td>
                  <td className="px-4 py-3">2025-09-2{i} 12:{i}3</td>
                  <td className="px-4 py-3">marketing-team</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AppShell>
  );
}

// ------------------------------
// Route Guards
// ------------------------------

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function RedirectIfAuthed({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  if (isAuthenticated) return <Navigate to="/app" replace />;
  return <>{children}</>;
}

// ------------------------------
// Root App (Router)
// ------------------------------

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route
            path="/login"
            element={
              <RedirectIfAuthed>
                <LoginPage />
              </RedirectIfAuthed>
            }
          />
          <Route
            path="/app"
            element={
              <ProtectedRoute>
                <MainPage />
              </ProtectedRoute>
            }
          />
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

