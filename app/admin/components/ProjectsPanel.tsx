"use client";

import { useState, useEffect, useCallback } from "react";
import { adminProjects, type ProjectCreateReq, type I18nMap } from "@/lib/admin-api";
import { I18nInput, I18nTextarea } from "./I18nFields";

const EMPTY_I18N: I18nMap = { en: "", es: "", ca: "" };

const TAG_OPTIONS = [
  "ILLUSTRATION", "INK", "FAN_ART", "ANIME", "MANGA", "PORTRAIT",
  "CINEMA", "HORROR", "CONCEPT", "ANIMALS", "TECHNIQUE", "POINTILLISM",
  "LITERATURE", "SKULL", "REALISM",
];

const DISPLAY_OPTIONS = ["COVER", "CONTAIN", "TOP"];
const RATIO_OPTIONS = ["PORTRAIT", "SQUARE", "FOURTHIRDS"];

interface ProjectItem {
  slug: string;
  date: string;
  image: string;
  title: string;
  tags: string[];
}

export default function ProjectsPanel({ apiKey }: { apiKey: string }) {
  const [items, setItems] = useState<ProjectItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState<string | null>(null); // slug or "__new__"

  // Form state
  const [slug, setSlug] = useState("");
  const [date, setDate] = useState("");
  const [image, setImage] = useState("");
  const [title, setTitle] = useState<I18nMap>({ ...EMPTY_I18N });
  const [description, setDescription] = useState<I18nMap>({ ...EMPTY_I18N });
  const [content, setContent] = useState<I18nMap>({ ...EMPTY_I18N });
  const [tags, setTags] = useState<string[]>([]);
  const [imageDisplay, setImageDisplay] = useState("COVER");
  const [aspectRatio, setAspectRatio] = useState("PORTRAIT");
  const [altImages, setAltImages] = useState("");
  const [saving, setSaving] = useState(false);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = (await adminProjects.list(apiKey)) as ProjectItem[];
      setItems(data);
    } catch (e) {
      setError(String(e));
    } finally {
      setLoading(false);
    }
  }, [apiKey]);

  useEffect(() => { refresh(); }, [refresh]);

  const resetForm = () => {
    setSlug(""); setDate(""); setImage("");
    setTitle({ ...EMPTY_I18N }); setDescription({ ...EMPTY_I18N }); setContent({ ...EMPTY_I18N });
    setTags([]); setImageDisplay("COVER"); setAspectRatio("PORTRAIT"); setAltImages("");
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
      // Fetch detail for each locale to populate the i18n fields
      const [en, es, ca] = await Promise.all([
        adminProjects.detail(s, apiKey, "en") as Promise<Record<string, string>>,
        adminProjects.detail(s, apiKey, "es") as Promise<Record<string, string>>,
        adminProjects.detail(s, apiKey, "ca") as Promise<Record<string, string>>,
      ]);
      setSlug(en.slug);
      setDate(en.date);
      setImage(en.image);
      setTitle({ en: en.title, es: es.title, ca: ca.title });
      setDescription({ en: en.description ?? "", es: es.description ?? "", ca: ca.description ?? "" });
      setContent({ en: en.content ?? "", es: es.content ?? "", ca: ca.content ?? "" });
      setTags((en.tags as unknown as string[]) ?? []);
      setImageDisplay(en.imageDisplay ?? "COVER");
      setAspectRatio(en.aspectRatio ?? "PORTRAIT");
      setAltImages(((en.altImages as unknown as string[]) ?? []).join("\n"));
      setEditing(s);
    } catch (e) {
      setError(String(e));
    }
  };

  const handleSave = async () => {
    setSaving(true); setError("");
    try {
      const alts = altImages.split("\n").map((s) => s.trim()).filter(Boolean);
      if (editing === "__new__") {
        const payload: ProjectCreateReq = {
          slug, date, image, title, description, content,
          tags, imageDisplay, aspectRatio, altImages: alts,
        };
        await adminProjects.create(payload, apiKey);
      } else {
        await adminProjects.update(editing!, {
          date, image, title, description, content,
          tags, imageDisplay, aspectRatio, altImages: alts,
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

  const handleDelete = async (s: string) => {
    if (!confirm(`Delete project "${s}"?`)) return;
    setError("");
    try {
      await adminProjects.delete(s, apiKey);
      await refresh();
    } catch (e) {
      setError(String(e));
    }
  };

  const toggleTag = (tag: string) => {
    setTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
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
            {editing === "__new__" ? "New Project" : `Edit: ${editing}`}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Slug (only on create) */}
            {editing === "__new__" && (
              <div>
                <label className="block text-xs text-foreground/50 uppercase tracking-widest mb-1">Slug</label>
                <input value={slug} onChange={(e) => setSlug(e.target.value)}
                  className="w-full bg-background border border-surface-light rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-accent"
                  placeholder="my-project-slug" />
              </div>
            )}
            <div>
              <label className="block text-xs text-foreground/50 uppercase tracking-widest mb-1">Date</label>
              <input type="date" value={date} onChange={(e) => setDate(e.target.value)}
                className="w-full bg-background border border-surface-light rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-accent" />
            </div>
            <div>
              <label className="block text-xs text-foreground/50 uppercase tracking-widest mb-1">Image URL</label>
              <input value={image} onChange={(e) => setImage(e.target.value)}
                className="w-full bg-background border border-surface-light rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-accent"
                placeholder="https://xavierarbat.com/images/projects/..." />
            </div>
            <div>
              <label className="block text-xs text-foreground/50 uppercase tracking-widest mb-1">Image Display</label>
              <select value={imageDisplay} onChange={(e) => setImageDisplay(e.target.value)}
                className="w-full bg-background border border-surface-light rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-accent">
                {DISPLAY_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs text-foreground/50 uppercase tracking-widest mb-1">Aspect Ratio</label>
              <select value={aspectRatio} onChange={(e) => setAspectRatio(e.target.value)}
                className="w-full bg-background border border-surface-light rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-accent">
                {RATIO_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
              </select>
            </div>
          </div>

          <I18nInput label="Title" value={title} onChange={setTitle} />
          <I18nTextarea label="Description" value={description} onChange={setDescription} rows={2} />
          <I18nTextarea label="Content (Markdown)" value={content} onChange={setContent} rows={8} />

          {/* Tags */}
          <div>
            <label className="block text-xs text-foreground/50 uppercase tracking-widest mb-2">Tags</label>
            <div className="flex flex-wrap gap-2">
              {TAG_OPTIONS.map((tag) => (
                <button key={tag} type="button" onClick={() => toggleTag(tag)}
                  className={`text-xs px-3 py-1.5 rounded-lg border cursor-pointer transition-colors ${
                    tags.includes(tag)
                      ? "border-accent-cyan text-accent-cyan bg-accent-cyan/10"
                      : "border-surface-light text-foreground/40 hover:text-foreground/60"
                  }`}>
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Alt images */}
          <div>
            <label className="block text-xs text-foreground/50 uppercase tracking-widest mb-1">
              Alt Images (one URL per line)
            </label>
            <textarea value={altImages} onChange={(e) => setAltImages(e.target.value)} rows={3}
              className="w-full bg-background border border-surface-light rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-accent resize-y font-mono"
              placeholder={"https://xavierarbat.com/images/projects/detail-1.jpg\nhttps://xavierarbat.com/images/projects/detail-2.jpg"} />
          </div>

          {/* Actions */}
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
          Projects ({items.length})
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
        <p className="text-foreground/30 text-sm">No projects yet.</p>
      ) : (
        <div className="space-y-2">
          {items.map((item) => (
            <div key={item.slug}
              className="flex items-center justify-between p-4 bg-surface border border-surface-light rounded-xl">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground truncate">{item.title}</p>
                <p className="text-xs text-foreground/30">{item.slug} &middot; {item.date}</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {item.tags.map((tag) => (
                    <span key={tag} className="text-[10px] px-1.5 py-0.5 bg-surface-light text-accent-cyan rounded">
                      {tag}
                    </span>
                  ))}
                </div>
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
