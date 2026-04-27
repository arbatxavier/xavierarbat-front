"use client";

import { useState } from "react";
import type { I18nMap } from "@/lib/admin-api";

const LANGS: { code: keyof I18nMap; label: string }[] = [
  { code: "en", label: "EN" },
  { code: "es", label: "ES" },
  { code: "ca", label: "CA" },
];

// ---------------------------------------------------------------------------
// I18nInput — single-line text input for 3 languages
// ---------------------------------------------------------------------------

export function I18nInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: I18nMap;
  onChange: (v: I18nMap) => void;
}) {
  const [tab, setTab] = useState<keyof I18nMap>("en");

  return (
    <div>
      <label className="block text-xs text-foreground/50 uppercase tracking-widest mb-1">
        {label}
      </label>
      <div className="flex gap-1 mb-1">
        {LANGS.map((l) => (
          <button
            key={l.code}
            type="button"
            onClick={() => setTab(l.code)}
            className={`text-[10px] px-2 py-0.5 rounded cursor-pointer transition-colors ${
              tab === l.code
                ? "bg-accent text-background font-bold"
                : "bg-surface-light text-foreground/40 hover:text-foreground/60"
            }`}
          >
            {l.label}
          </button>
        ))}
      </div>
      <input
        type="text"
        value={value[tab]}
        onChange={(e) => onChange({ ...value, [tab]: e.target.value })}
        className="w-full bg-background border border-surface-light rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-accent transition-colors"
      />
    </div>
  );
}

// ---------------------------------------------------------------------------
// I18nTextarea — multi-line textarea for 3 languages
// ---------------------------------------------------------------------------

export function I18nTextarea({
  label,
  value,
  onChange,
  rows = 4,
}: {
  label: string;
  value: I18nMap;
  onChange: (v: I18nMap) => void;
  rows?: number;
}) {
  const [tab, setTab] = useState<keyof I18nMap>("en");

  return (
    <div>
      <label className="block text-xs text-foreground/50 uppercase tracking-widest mb-1">
        {label}
      </label>
      <div className="flex gap-1 mb-1">
        {LANGS.map((l) => (
          <button
            key={l.code}
            type="button"
            onClick={() => setTab(l.code)}
            className={`text-[10px] px-2 py-0.5 rounded cursor-pointer transition-colors ${
              tab === l.code
                ? "bg-accent text-background font-bold"
                : "bg-surface-light text-foreground/40 hover:text-foreground/60"
            }`}
          >
            {l.label}
          </button>
        ))}
      </div>
      <textarea
        value={value[tab]}
        onChange={(e) => onChange({ ...value, [tab]: e.target.value })}
        rows={rows}
        className="w-full bg-background border border-surface-light rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-accent transition-colors resize-y font-mono"
      />
    </div>
  );
}
