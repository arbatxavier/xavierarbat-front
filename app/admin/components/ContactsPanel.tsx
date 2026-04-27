"use client";

import { useState, useEffect, useCallback } from "react";
import { adminContacts, type ContactCreateReq, type I18nMap } from "@/lib/admin-api";
import { I18nInput } from "./I18nFields";

const EMPTY_I18N: I18nMap = { en: "", es: "", ca: "" };

interface ContactItem {
  name: string;
  display: string;
  value: string;
  link: string | null;
  showInFooter: boolean;
}

export default function ContactsPanel({ apiKey }: { apiKey: string }) {
  const [items, setItems] = useState<ContactItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState<string | null>(null);

  // Form state
  const [name, setName] = useState("");
  const [display, setDisplay] = useState<I18nMap>({ ...EMPTY_I18N });
  const [value, setValue] = useState("");
  const [link, setLink] = useState("");
  const [showInFooter, setShowInFooter] = useState(true);
  const [saving, setSaving] = useState(false);

  const refresh = useCallback(async () => {
    setLoading(true); setError("");
    try {
      const data = (await adminContacts.list(apiKey)) as ContactItem[];
      setItems(data);
    } catch (e) {
      setError(String(e));
    } finally {
      setLoading(false);
    }
  }, [apiKey]);

  useEffect(() => { refresh(); }, [refresh]);

  const resetForm = () => {
    setName(""); setDisplay({ ...EMPTY_I18N }); setValue(""); setLink(""); setShowInFooter(true);
    setEditing(null);
  };

  const startCreate = () => {
    resetForm();
    setEditing("__new__");
  };

  const startEdit = (item: ContactItem) => {
    setName(item.name);
    // Display from the list is already translated (single string).
    // We set all 3 locales to the current value — user can refine each.
    setDisplay({ en: item.display, es: item.display, ca: item.display });
    setValue(item.value);
    setLink(item.link ?? "");
    setShowInFooter(item.showInFooter);
    setEditing(item.name);
  };

  const handleSave = async () => {
    setSaving(true); setError("");
    try {
      if (editing === "__new__") {
        const payload: ContactCreateReq = {
          name, display, value, link: link || null, showInFooter,
        };
        await adminContacts.create(payload, apiKey);
      } else {
        await adminContacts.update(editing!, {
          display, value, link: link || null, showInFooter,
        }, apiKey);
      }
      resetForm();
      await refresh();
    } catch (e) {
      setError(String(e));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (n: string) => {
    if (!confirm(`Delete contact "${n}"?`)) return;
    setError("");
    try {
      await adminContacts.delete(n, apiKey);
      await refresh();
    } catch (e) {
      setError(String(e));
    }
  };

  return (
    <div>
      {error && (
        <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* --- FORM --- */}
      {editing !== null && (
        <div className="mb-6 p-5 bg-surface border border-surface-light rounded-2xl space-y-4">
          <h3 className="text-lg font-semibold text-foreground">
            {editing === "__new__" ? "New Contact" : `Edit: ${editing}`}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {editing === "__new__" && (
              <div>
                <label className="block text-xs text-foreground/50 uppercase tracking-widest mb-1">
                  Name (identifier)
                </label>
                <input value={name} onChange={(e) => setName(e.target.value)}
                  className="w-full bg-background border border-surface-light rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-accent"
                  placeholder="instagram, email, github..." />
              </div>
            )}
            <div>
              <label className="block text-xs text-foreground/50 uppercase tracking-widest mb-1">Value</label>
              <input value={value} onChange={(e) => setValue(e.target.value)}
                className="w-full bg-background border border-surface-light rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-accent"
                placeholder="@username, email@example.com, +34..." />
            </div>
            <div>
              <label className="block text-xs text-foreground/50 uppercase tracking-widest mb-1">Link (URL)</label>
              <input value={link} onChange={(e) => setLink(e.target.value)}
                className="w-full bg-background border border-surface-light rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-accent"
                placeholder="https://..." />
            </div>
          </div>

          <I18nInput label="Display text" value={display} onChange={setDisplay} />

          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" checked={showInFooter} onChange={(e) => setShowInFooter(e.target.checked)}
              className="w-4 h-4 rounded border-surface-light accent-accent" />
            <span className="text-sm text-foreground/70">Show in footer</span>
          </label>

          <div className="flex gap-3 pt-2">
            <button onClick={handleSave} disabled={saving}
              className="px-5 py-2 bg-accent text-background rounded-lg text-sm font-semibold hover:bg-accent/80 disabled:opacity-50 cursor-pointer transition-colors">
              {saving ? "Saving..." : editing === "__new__" ? "Create" : "Update"}
            </button>
            <button onClick={resetForm}
              className="px-5 py-2 border border-surface-light text-foreground/60 rounded-lg text-sm hover:text-foreground cursor-pointer transition-colors">
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* --- LIST --- */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm text-foreground/50 uppercase tracking-widest">
          Contacts ({items.length})
        </h3>
        {editing === null && (
          <button onClick={startCreate}
            className="px-4 py-1.5 bg-accent text-background rounded-lg text-sm font-semibold hover:bg-accent/80 cursor-pointer transition-colors">
            + New
          </button>
        )}
      </div>

      {loading ? (
        <p className="text-foreground/30 text-sm">Loading...</p>
      ) : items.length === 0 ? (
        <p className="text-foreground/30 text-sm">No contacts yet.</p>
      ) : (
        <div className="space-y-2">
          {items.map((item) => (
            <div key={item.name}
              className="flex items-center justify-between p-4 bg-surface border border-surface-light rounded-xl">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground">{item.name}</p>
                <p className="text-xs text-foreground/30">
                  {item.display} &middot; {item.value}
                  {item.showInFooter && (
                    <span className="ml-2 text-accent-cyan">footer</span>
                  )}
                </p>
              </div>
              <div className="flex gap-2 ml-4 shrink-0">
                <button onClick={() => startEdit(item)}
                  className="text-xs px-3 py-1.5 border border-surface-light text-foreground/50 rounded-lg hover:text-accent-cyan hover:border-accent-cyan cursor-pointer transition-colors">
                  Edit
                </button>
                <button onClick={() => handleDelete(item.name)}
                  className="text-xs px-3 py-1.5 border border-surface-light text-foreground/50 rounded-lg hover:text-red-400 hover:border-red-400 cursor-pointer transition-colors">
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
