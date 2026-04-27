"use client";

import { useState, useEffect } from "react";
import ProjectsPanel from "./components/ProjectsPanel";
import BlogsPanel from "./components/BlogsPanel";
import ContactsPanel from "./components/ContactsPanel";
import ImagesPanel from "./components/ImagesPanel";
import TagsPanel from "./components/TagsPanel";

type Tab = "projects" | "blogs" | "contacts" | "tags" | "images";

const TABS: { key: Tab; label: string }[] = [
  { key: "projects", label: "Projects" },
  { key: "blogs", label: "Blogs" },
  { key: "contacts", label: "Contacts" },
  { key: "tags", label: "Tags" },
  { key: "images", label: "Images" },
];

const SESSION_KEY = "admin_api_key";

export default function AdminPage() {
  const [apiKey, setApiKey] = useState("");
  const [keyInput, setKeyInput] = useState("");
  const [tab, setTab] = useState<Tab>("projects");

  // Restore key from sessionStorage on mount
  useEffect(() => {
    const stored = sessionStorage.getItem(SESSION_KEY);
    if (stored) setApiKey(stored);
  }, []);

  const handleLogin = () => {
    const trimmed = keyInput.trim();
    if (!trimmed) return;
    sessionStorage.setItem(SESSION_KEY, trimmed);
    setApiKey(trimmed);
  };

  const handleLogout = () => {
    sessionStorage.removeItem(SESSION_KEY);
    setApiKey("");
    setKeyInput("");
  };

  // -----------------------------------------------------------------------
  // API Key gate
  // -----------------------------------------------------------------------
  if (!apiKey) {
    return (
      <section className="pt-28 pb-20 px-6 max-w-md mx-auto">
        <div className="bg-surface border border-surface-light rounded-2xl p-8">
          <h1 className="text-2xl font-bold text-foreground mb-2">Admin</h1>
          <p className="text-sm text-foreground/40 mb-6">
            Enter your API key to manage content.
          </p>

          <div className="space-y-4">
            <input
              type="password"
              value={keyInput}
              onChange={(e) => setKeyInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              placeholder="X-API-Key"
              className="w-full bg-background border border-surface-light rounded-lg px-4 py-3 text-sm text-foreground focus:outline-none focus:border-accent transition-colors"
              autoFocus
            />
            <button
              onClick={handleLogin}
              className="w-full py-3 bg-accent text-background rounded-lg text-sm font-semibold hover:bg-accent/80 cursor-pointer transition-colors"
            >
              Enter
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
          Logout
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
      {tab === "projects" && <ProjectsPanel apiKey={apiKey} />}
      {tab === "blogs" && <BlogsPanel apiKey={apiKey} />}
      {tab === "contacts" && <ContactsPanel apiKey={apiKey} />}
      {tab === "tags" && <TagsPanel apiKey={apiKey} />}
      {tab === "images" && <ImagesPanel apiKey={apiKey} />}
    </section>
  );
}
