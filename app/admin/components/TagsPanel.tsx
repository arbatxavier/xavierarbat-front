"use client";

import { useState, useEffect, useCallback } from "react";
import { adminTags, type I18nMap } from "@/lib/admin-api";

const LOCALES = ["en", "es", "ca"] as const;
const LOCALE_LABELS: Record<string, string> = { en: "English", es: "Español", ca: "Català" };

interface Tag {
  key: string;
  label: string; // default (en) label for display in list
}

interface TagI18n {
  key: string;
  label: I18nMap;
}

export default function TagsPanel({ token }: { token: string }) {
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [creating, setCreating] = useState(false);

  // Create form state
  const [newKey, setNewKey] = useState("");
  const [newLabels, setNewLabels] = useState<I18nMap>({ en: "", es: "", ca: "" });

  // Edit state
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [editLabels, setEditLabels] = useState<I18nMap>({ en: "", es: "", ca: "" });
  const [loadingEdit, setLoadingEdit] = useState(false);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await adminTags.list(token);
      setTags(data);
    } catch (err) {
      setError(String(err));
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleCreate = async () => {
    if (!newKey.trim()) return;
    setCreating(true);
    setError("");
    try {
      const labelMap: Partial<I18nMap> = {};
      for (const loc of LOCALES) {
        if (newLabels[loc].trim()) labelMap[loc] = newLabels[loc].trim();
      }
      await adminTags.create(
        { key: newKey.trim(), label: Object.keys(labelMap).length > 0 ? labelMap : null },
        token,
      );
      setNewKey("");
      setNewLabels({ en: "", es: "", ca: "" });
      loadData();
    } catch (err) {
      setError(String(err));
      console.error(err);
    } finally {
      setCreating(false);
    }
  };

  const startEdit = async (tag: Tag) => {
    setEditingKey(tag.key);
    setLoadingEdit(true);
    setError("");
    try {
      const i18n = await adminTags.detailI18n(tag.key, token);
      setEditLabels(i18n.label);
    } catch (err) {
      setError(String(err));
      setEditingKey(null);
    } finally {
      setLoadingEdit(false);
    }
  };

  const cancelEdit = () => {
    setEditingKey(null);
    setEditLabels({ en: "", es: "", ca: "" });
  };

  const handleUpdate = async (tagKey: string) => {
    const labelMap: Partial<I18nMap> = {};
    for (const loc of LOCALES) {
      if (editLabels[loc].trim()) labelMap[loc] = editLabels[loc].trim();
    }
    if (Object.keys(labelMap).length === 0) return;
    setError("");
    try {
      await adminTags.update(tagKey, { label: labelMap }, token);
      setEditingKey(null);
      setEditLabels({ en: "", es: "", ca: "" });
      loadData();
    } catch (err) {
      setError(String(err));
      console.error(err);
    }
  };

  const handleDelete = async (tagKey: string) => {
    if (!confirm(`Delete tag "${tagKey}"?`)) return;
    setError("");
    try {
      await adminTags.delete(tagKey, token);
      loadData();
    } catch (err) {
      setError(String(err));
      console.error(err);
    }
  };

  return (
    <div>
      {error && (
        <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* Create new tag */}
      <div className="bg-surface border border-surface-light rounded-2xl p-5 mb-8">
        <h3 className="text-sm text-foreground/50 uppercase tracking-widest mb-4">
          Create Tag
        </h3>
        <div className="space-y-3">
          <div>
            <label className="block text-xs text-foreground/40 mb-1">Key</label>
            <input
              value={newKey}
              onChange={(e) => setNewKey(e.target.value)}
              placeholder="e.g. WATERCOLOR"
              className="w-full bg-background border border-surface-light rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-accent transition-colors"
            />
          </div>
          <div className="grid grid-cols-3 gap-3">
            {LOCALES.map((loc) => (
              <div key={loc}>
                <label className="block text-xs text-foreground/40 mb-1">
                  Label ({LOCALE_LABELS[loc]})
                </label>
                <input
                  value={newLabels[loc]}
                  onChange={(e) =>
                    setNewLabels((prev) => ({ ...prev, [loc]: e.target.value }))
                  }
                  placeholder={`Label in ${loc}`}
                  onKeyDown={(e) => e.key === "Enter" && handleCreate()}
                  className="w-full bg-background border border-surface-light rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-accent transition-colors"
                />
              </div>
            ))}
          </div>
          <button
            onClick={handleCreate}
            disabled={creating || !newKey.trim()}
            className="px-5 py-2 bg-accent text-background rounded-lg text-sm font-semibold hover:bg-accent/80 disabled:opacity-50 cursor-pointer transition-colors"
          >
            {creating ? "Creating..." : "+ Add"}
          </button>
        </div>
      </div>

      {/* Tag list */}
      <h3 className="text-sm text-foreground/50 uppercase tracking-widest mb-4">
        All Tags ({tags.length})
      </h3>

      {loading ? (
        <p className="text-foreground/30 text-sm">Loading...</p>
      ) : tags.length === 0 ? (
        <p className="text-foreground/30 text-sm">No tags yet.</p>
      ) : (
        <div className="space-y-2">
          {tags.map((tag) => (
            <div
              key={tag.key}
              className="bg-surface border border-surface-light rounded-xl px-4 py-3"
            >
              <div className="flex items-center gap-3">
                {/* Key badge */}
                <span className="text-xs font-mono px-2 py-0.5 bg-surface-light text-accent rounded shrink-0">
                  {tag.key}
                </span>

                {editingKey === tag.key ? (
                  <div className="flex-1 flex items-center gap-2">
                    {loadingEdit ? (
                      <span className="text-sm text-foreground/30">Loading translations...</span>
                    ) : (
                      <>
                        <button
                          onClick={() => handleUpdate(tag.key)}
                          className="text-xs px-3 py-1 text-accent hover:text-accent/80 cursor-pointer transition-colors"
                        >
                          Save
                        </button>
                        <button
                          onClick={cancelEdit}
                          className="text-xs px-3 py-1 text-foreground/30 hover:text-foreground/50 cursor-pointer transition-colors"
                        >
                          Cancel
                        </button>
                      </>
                    )}
                  </div>
                ) : (
                  <>
                    <span className="flex-1 text-sm text-foreground/70">
                      {tag.label}
                    </span>
                    <button
                      onClick={() => startEdit(tag)}
                      className="text-xs px-3 py-1 text-foreground/30 hover:text-accent cursor-pointer transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(tag.key)}
                      className="text-xs px-3 py-1 text-foreground/30 hover:text-red-400 cursor-pointer transition-colors"
                    >
                      Delete
                    </button>
                  </>
                )}
              </div>

              {/* Inline edit form for all locales */}
              {editingKey === tag.key && !loadingEdit && (
                <div className="grid grid-cols-3 gap-3 mt-3">
                  {LOCALES.map((loc) => (
                    <div key={loc}>
                      <label className="block text-xs text-foreground/40 mb-1">
                        {LOCALE_LABELS[loc]}
                      </label>
                      <input
                        value={editLabels[loc]}
                        onChange={(e) =>
                          setEditLabels((prev) => ({ ...prev, [loc]: e.target.value }))
                        }
                        onKeyDown={(e) => {
                          if (e.key === "Enter") handleUpdate(tag.key);
                          if (e.key === "Escape") cancelEdit();
                        }}
                        className="w-full bg-background border border-accent/50 rounded-lg px-3 py-1.5 text-sm text-foreground focus:outline-none focus:border-accent transition-colors"
                        autoFocus={loc === "en"}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
