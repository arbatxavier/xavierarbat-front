"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { adminImages } from "@/lib/admin-api";

const FOLDERS = ["projects", "blogs", "home", "contacts"];

export default function ImagesPanel({ apiKey }: { apiKey: string }) {
  const [folder, setFolder] = useState("projects");
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await adminImages.list(folder, apiKey);
      setImages(data);
    } catch (e) {
      setError(String(e));
    } finally {
      setLoading(false);
    }
  }, [folder, apiKey]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const handleUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    setError("");
    try {
      for (const file of Array.from(files)) {
        await adminImages.upload(folder, file, apiKey);
      }
      await refresh();
    } catch (e) {
      setError(String(e));
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const handleDelete = async (path: string) => {
    const filename = path.split("/").pop() ?? "";
    if (!confirm(`Delete "${filename}"?`)) return;
    setError("");
    try {
      await adminImages.delete(folder, filename, apiKey);
      await refresh();
    } catch (e) {
      setError(String(e));
    }
  };

  const copyUrl = (path: string) => {
    const url = adminImages.publicUrl(path);
    navigator.clipboard.writeText(url);
    setCopied(path);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    handleUpload(e.dataTransfer.files);
  };

  return (
    <div>
      {error && (
        <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* Folder selector + Upload button */}
      <div className="flex items-center gap-4 mb-6">
        <div className="flex gap-1">
          {FOLDERS.map((f) => (
            <button
              key={f}
              onClick={() => setFolder(f)}
              className={`text-xs px-4 py-2 rounded-lg border cursor-pointer transition-colors ${
                folder === f
                  ? "border-accent text-accent bg-accent/10"
                  : "border-surface-light text-foreground/40 hover:text-foreground/60"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="flex-1" />

        <input
          ref={fileRef}
          type="file"
          multiple
          accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml"
          className="hidden"
          onChange={(e) => handleUpload(e.target.files)}
        />
        <button
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          className="px-4 py-1.5 bg-accent text-background rounded-lg text-sm font-semibold hover:bg-accent/80 disabled:opacity-50 cursor-pointer transition-colors"
        >
          {uploading ? "Uploading..." : "+ Upload"}
        </button>
      </div>

      {/* Drop zone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        className={`mb-6 p-8 border-2 border-dashed rounded-2xl text-center transition-colors ${
          dragOver
            ? "border-accent bg-accent/5 text-accent"
            : "border-surface-light text-foreground/20"
        }`}
      >
        <p className="text-sm">
          {dragOver ? "Drop files here" : "Drag & drop images here, or use the Upload button"}
        </p>
      </div>

      {/* Image count */}
      <h3 className="text-sm text-foreground/50 uppercase tracking-widest mb-4">
        {folder} ({images.length} images)
      </h3>

      {/* Gallery */}
      {loading ? (
        <p className="text-foreground/30 text-sm">Loading...</p>
      ) : images.length === 0 ? (
        <p className="text-foreground/30 text-sm">No images in this folder.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {images.map((path) => {
            const url = adminImages.publicUrl(path);
            const filename = path.split("/").pop() ?? "";
            const isCopied = copied === path;

            return (
              <div
                key={path}
                className="group relative bg-surface border border-surface-light rounded-xl overflow-hidden"
              >
                {/* Thumbnail */}
                <div
                  className="aspect-square relative cursor-pointer"
                  onClick={() => copyUrl(path)}
                  title="Click to copy URL"
                >
                  <img
                    src={url}
                    alt={filename}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />

                  {/* Copy overlay */}
                  <div
                    className={`absolute inset-0 flex items-center justify-center transition-opacity ${
                      isCopied
                        ? "bg-accent/80 opacity-100"
                        : "bg-background/60 opacity-0 group-hover:opacity-100"
                    }`}
                  >
                    <span className="text-xs font-bold text-background">
                      {isCopied ? "Copied!" : "Click to copy URL"}
                    </span>
                  </div>
                </div>

                {/* Info bar */}
                <div className="p-2 flex items-center justify-between gap-1">
                  <p
                    className="text-[10px] text-foreground/40 truncate flex-1"
                    title={filename}
                  >
                    {filename}
                  </p>
                  <button
                    onClick={() => handleDelete(path)}
                    className="text-[10px] px-2 py-0.5 text-foreground/30 hover:text-red-400 cursor-pointer transition-colors shrink-0"
                    title="Delete"
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
