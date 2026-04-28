"use client";

import { useState, useEffect } from "react";
import ProjectsPanel from "./components/ProjectsPanel";
import BlogsPanel from "./components/BlogsPanel";
import ContactsPanel from "./components/ContactsPanel";
import ImagesPanel from "./components/ImagesPanel";
import TagsPanel from "./components/TagsPanel";

import { adminAuth } from "@/lib/admin-api";

type Tab = "projects" | "blogs" | "contacts" | "tags" | "images";

const TABS: { key: Tab; label: string }[] = [
  { key: "projects", label: "Projects" },
  { key: "blogs", label: "Blogs" },
  { key: "contacts", label: "Contacts" },
  { key: "tags", label: "Tags" },
  { key: "images", label: "Images" },
];

const SESSION_KEY = "admin_auth_token";

export default function AdminPage() {
  const [token, setToken] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState<Tab>("projects");

  // Restore token from sessionStorage on mount
  useEffect(() => {
    const stored = sessionStorage.getItem(SESSION_KEY);
    if (stored) setToken(stored);
  }, []);

  const handleLogin = async () => {
    if (!username || !password) return;
    setLoading(true);
    setError("");
    try {
      const res = await adminAuth.login({ username, password });
      sessionStorage.setItem(SESSION_KEY, res.token);
      setToken(res.token);
    } catch (err) {
      console.error(err);
      setError("Credenciales inválidas o error de conexión.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem(SESSION_KEY);
    setToken("");
    setUsername("");
    setPassword("");
  };

  // -----------------------------------------------------------------------
  // Auth Gate
  // -----------------------------------------------------------------------
  if (!token) {
    return (
      <section className="pt-28 pb-20 px-6 max-w-md mx-auto">
        <div className="bg-surface border border-surface-light rounded-2xl p-8">
          <h1 className="text-2xl font-bold text-foreground mb-2">Admin</h1>
          <p className="text-sm text-foreground/40 mb-6">
            Inicia sesión para gestionar el contenido.
          </p>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-foreground/40 uppercase tracking-wider mb-1.5 ml-1">
                Usuario
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="nombre de usuario"
                className="w-full bg-background border border-surface-light rounded-lg px-4 py-3 text-sm text-foreground focus:outline-none focus:border-accent transition-colors"
                autoFocus
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-foreground/40 uppercase tracking-wider mb-1.5 ml-1">
                Contraseña
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                placeholder="••••••••"
                className="w-full bg-background border border-surface-light rounded-lg px-4 py-3 text-sm text-foreground focus:outline-none focus:border-accent transition-colors"
              />
            </div>

            {error && (
              <p className="text-xs text-red-400 mt-2 px-1">
                {error}
              </p>
            )}

            <button
              onClick={handleLogin}
              disabled={loading}
              className="w-full py-3 bg-accent text-background rounded-lg text-sm font-semibold hover:bg-accent/80 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-colors mt-2"
            >
              {loading ? "Iniciando sesión..." : "Entrar"}
            </button>
          </div>
        </div>
      </section>
    );
  }

  // -----------------------------------------------------------------------
  // Admin dashboard
  // -----------------------------------------------------------------------
  return (
    <section className="pt-28 pb-20 px-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-foreground">
          Admin <span className="text-accent">Panel</span>
        </h1>
        <button
          onClick={handleLogout}
          className="text-xs px-4 py-1.5 border border-surface-light text-foreground/40 rounded-lg hover:text-red-400 hover:border-red-400 cursor-pointer transition-colors"
        >
          Cerrar sesión
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-8 border-b border-surface-light pb-px">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-5 py-2.5 text-sm font-medium rounded-t-lg cursor-pointer transition-colors ${
              tab === t.key
                ? "bg-surface border border-surface-light border-b-surface text-accent -mb-px"
                : "text-foreground/40 hover:text-foreground/60"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Panel */}
      {tab === "projects" && <ProjectsPanel token={token} />}
      {tab === "blogs" && <BlogsPanel token={token} />}
      {tab === "contacts" && <ContactsPanel token={token} />}
      {tab === "tags" && <TagsPanel token={token} />}
      {tab === "images" && <ImagesPanel token={token} />}
    </section>
  );
}
