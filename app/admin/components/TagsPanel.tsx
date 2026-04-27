"use client";

import { useState, useEffect, useCallback } from "react";
import { adminTags } from "@/lib/admin-api";

interface Tag {
  key: string;
  label: string;
}

export default function TagsPanel({ apiKey }: { apiKey: string }) {
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Create form
  const [newKey, setNewKey] = useState("");
  const [newLabel, setNewLabel] = useState("");
  const [creating, setCreating] = useState(false);

  // Edit state
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [editLabel, setEditLabel] = useState("");

  const refresh = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await adminTags.list(apiKey);
      setTags(data);
    } catch (e) {
      setError(String(e));
    } finally {
      setLoading(false);
    }
  }, [apiKey]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const handleCreate = async () => {
    const key = newKey.trim().toUpperCase().replace(/\s+/g, "_");
    if (!key) return;
    setCreating(true);
    setError("");
    try {
      await adminTags.create(
        { key, label: newLabel.trim() || null },
        apiKey,
      );
      setNewKey("");
      setNewLabel("");
      await refresh();
    } catch (e) {
      setError(String(e));
    } finally {
      setCreating(false);
    }
  };

  const handleUpdate = async (tagKey: string) => {
    if (!editLabel.trim()) return;
    setError("");
    try {
      await adminTags.update(tagKey, { label: editLabel.trim() }, apiKey);
      setEditingKey(null);
      setEditLabel("");
      await refresh();
    } catch (e) {
      setError(String(e));
    }
  };

  const handleDelete = async (tagKey: string) => {
    if (!confirm(`Delete tag "${tagKey}"?`)) return;
    setError("");
    try {
      await adminTags.delete(tagKey, apiKey);
      await refresh();
    } catch (e) {
      setError(String(e));
    }
  };

  const startEdit = (tag: Tag) => {
    setEditingKey(tag.key);
    setEditLabel(tag.label);
  };

  const cancelEdit = () => {
    setEditingKey(null);
    setEditLabel("");
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
        <div className="flex gap-3 items-end">
          <div className="flex-1">
            <label className="block text-xs text-foreground/40 mb-1">Key</label>
            <input
              value={newKey}
              onChange={(e) => setNewKey(e.target.value)}
              placeholder="e.g. WATERCOLOR"
              className="w-full bg-background border border-surface-light rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-accent transition-colors"
            />
          </div>
          <div className="flex-1">
            <label className="block text-xs text-foreground/40 mb-1">
              Label (EN default)
            </label>
            <input
              value={newLabel}
              onChange={(e) => setNewLabel(e.target.value)}
              placeholder="e.g. Watercolor"
              onKeyDown={(e) => e.key === "Enter" && handleCreate()}
              className="w-full bg-background border border-surface-light rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-accent transition-colors"
            />
          </div>
          <button
            onClick={handleCreate}
            disabled={creating || !newKey.trim()}
            className="px-5 py-2 bg-accent text-background rounded-lg text-sm font-semibold hover:bg-accent/80 disabled:opacity-50 cursor-pointer transition-colors shrink-0"
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
              className="flex items-center gap-3 bg-surface border border-surface-light rounded-xl px-4 py-3"
            >
              {/* Key badge */}
              <span className="text-xs font-mono px-2 py-0.5 bg-surface-light text-accent rounded shrink-0">
                {tag.key}
              </span>

              {editingKey === tag.key ? (
                <>
                  <input
                    value={editLabel}
                    onChange={(e) => setEditLabel(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleUpdate(tag.key);
                      if (e.key === "Escape") cancelEdit();
                    }}
                    className="flex-1 bg-background border border-accent rounded-lg px-3 py-1.5 text-sm text-foreground focus:outline-none"
                    autoFocus
                  />
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
          ))}
        </div>
      )}
    </div>
  );
}
