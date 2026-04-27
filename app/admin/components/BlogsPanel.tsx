"use client";

import { useState, useEffect, useCallback } from "react";
import { adminBlogs, type BlogCreateReq, type I18nMap } from "@/lib/admin-api";
import { I18nInput, I18nTextarea } from "./I18nFields";

const EMPTY_I18N: I18nMap = { en: "", es: "", ca: "" };

interface BlogItem {
  slug: string;
  date: string;
  title: string;
  shortDescription: string;
}

export default function BlogsPanel({ apiKey }: { apiKey: string }) {
  const [items, setItems] = useState<BlogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState<string | null>(null);

  // Form state
  const [slug, setSlug] = useState("");
  const [date, setDate] = useState("");
  const [title, setTitle] = useState<I18nMap>({ ...EMPTY_I18N });
  const [description, setDescription] = useState<I18nMap>({ ...EMPTY_I18N });
  const [content, setContent] = useState<I18nMap>({ ...EMPTY_I18N });
  const [saving, setSaving] = useState(false);

  const refresh = useCallback(async () => {
    setLoading(true); setError("");
    try {
      const data = (await adminBlogs.list(apiKey)) as BlogItem[];
      setItems(data);
    } catch (e) {
      setError(String(e));
    } finally {
      setLoading(false);
    }
  }, [apiKey]);

  useEffect(() => { refresh(); }, [refresh]);

  const resetForm = () => {
    setSlug(""); setDate("");
    setTitle({ ...EMPTY_I18N }); setDescription({ ...EMPTY_I18N }); setContent({ ...EMPTY_I18N });
    setEditing(null);
  };

  const startCreate = () => {
    resetForm();
    setDate(new Date().toISOString().split("T")[0]);
    setEditing("__new__");
  };

  const startEdit = async (s: string) => {
    setError("");
    try {
      const [en, es, ca] = await Promise.all([
        adminBlogs.detail(s, apiKey, "en") as Promise<Record<string, string>>,
        adminBlogs.detail(s, apiKey, "es") as Promise<Record<string, string>>,
        adminBlogs.detail(s, apiKey, "ca") as Promise<Record<string, string>>,
      ]);
      setSlug(en.slug);
      setDate(en.date);
      setTitle({ en: en.title, es: es.title, ca: ca.title });
      setDescription({ en: en.description ?? "", es: es.description ?? "", ca: ca.description ?? "" });
      setContent({ en: en.content ?? "", es: es.content ?? "", ca: ca.content ?? "" });
      setEditing(s);
    } catch (e) {
      setError(String(e));
    }
  };

  const handleSave = async () => {
    setSaving(true); setError("");
    try {
      if (editing === "__new__") {
        const payload: BlogCreateReq = { slug, date, title, description, content };
        await adminBlogs.create(payload, apiKey);
      } else {
        await adminBlogs.update(editing!, { date, title, description, content }, apiKey);
      }
      resetForm();
      await refresh();
    } catch (e) {
      setError(String(e));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (s: string) => {
    if (!confirm(`Delete blog "${s}"?`)) return;
    setError("");
    try {
      await adminBlogs.delete(s, apiKey);
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
            {editing === "__new__" ? "New Blog Post" : `Edit: ${editing}`}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {editing === "__new__" && (
              <div>
                <label className="block text-xs text-foreground/50 uppercase tracking-widest mb-1">Slug</label>
                <input value={slug} onChange={(e) => setSlug(e.target.value)}
                  className="w-full bg-background border border-surface-light rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-accent"
                  placeholder="my-blog-post-slug" />
              </div>
            )}
            <div>
              <label className="block text-xs text-foreground/50 uppercase tracking-widest mb-1">Date</label>
              <input type="date" value={date} onChange={(e) => setDate(e.target.value)}
                className="w-full bg-background border border-surface-light rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-accent" />
            </div>
          </div>

          <I18nInput label="Title" value={title} onChange={setTitle} />
          <I18nTextarea label="Description / Excerpt" value={description} onChange={setDescription} rows={2} />
          <I18nTextarea label="Content (Markdown)" value={content} onChange={setContent} rows={12} />

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
          Blog Posts ({items.length})
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
        <p className="text-foreground/30 text-sm">No blog posts yet.</p>
      ) : (
        <div className="space-y-2">
          {items.map((item) => (
            <div key={item.slug}
              className="flex items-center justify-between p-4 bg-surface border border-surface-light rounded-xl">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground truncate">{item.title}</p>
                <p className="text-xs text-foreground/30">{item.slug} &middot; {item.date}</p>
                {item.shortDescription && (
                  <p className="text-xs text-foreground/40 mt-1 truncate">{item.shortDescription}</p>
                )}
              </div>
              <div className="flex gap-2 ml-4 shrink-0">
                <button onClick={() => startEdit(item.slug)}
                  className="text-xs px-3 py-1.5 border border-surface-light text-foreground/50 rounded-lg hover:text-accent-cyan hover:border-accent-cyan cursor-pointer transition-colors">
                  Edit
                </button>
                <button onClick={() => handleDelete(item.slug)}
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
