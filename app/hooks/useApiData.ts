"use client";

import { useState, useEffect, useLayoutEffect, useRef } from "react";

// ---------------------------------------------------------------------------
// localStorage cache helpers
// ---------------------------------------------------------------------------

const STORAGE_PREFIX = "swr_";
const STORAGE_TTL = 60 * 60 * 1000; // 1 hour

interface StorageEntry<T> {
  data: T;
  ts: number;
}

function readCache<T>(key: string): T | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_PREFIX + key);
    if (!raw) return null;
    const entry: StorageEntry<T> = JSON.parse(raw);
    if (Date.now() - entry.ts > STORAGE_TTL) {
      localStorage.removeItem(STORAGE_PREFIX + key);
      return null;
    }
    return entry.data;
  } catch {
    return null;
  }
}

function writeCache<T>(key: string, data: T) {
  if (typeof window === "undefined") return;
  try {
    const entry: StorageEntry<T> = { data, ts: Date.now() };
    localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(entry));
  } catch {
    // Storage full or unavailable — ignore silently
  }
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

/**
 * Stale-while-revalidate hook with localStorage persistence.
 *
 * Render priority:
 *   1. `initialData` for SSR (server has no localStorage)
 *   2. localStorage cache restored in useLayoutEffect (BEFORE browser paint)
 *   3. Fresh API data from background fetch (only re-renders if data changed)
 *
 * Result: on F5 / repeat visits the user sees cached data instantly with
 * zero flicker — the browser never paints the SSR fallback.
 */
export function useApiData<T>({
  key,
  initialData,
  fetcher,
}: {
  key: string;
  initialData: T;
  fetcher: () => Promise<T>;
}): { data: T; isRevalidating: boolean } {
  // SSR-safe: always start with initialData (server has no localStorage)
  const [data, setData] = useState<T>(initialData);
  const [isRevalidating, setIsRevalidating] = useState(false);

  const fetcherRef = useRef(fetcher);
  fetcherRef.current = fetcher;
  const dataRef = useRef(data);
  dataRef.current = data;

  // -----------------------------------------------------------------------
  // BEFORE paint: restore cached data from localStorage.
  // useLayoutEffect fires synchronously after DOM mutations but BEFORE the
  // browser repaints, so the user never sees the initialData → cache flash.
  // -----------------------------------------------------------------------
  useLayoutEffect(() => {
    const cached = readCache<T>(key);
    if (cached) {
      setData(cached);
      dataRef.current = cached;
    }
  }, [key]);

  // -----------------------------------------------------------------------
  // AFTER paint: revalidate from the API in the background.
  // Only triggers a re-render if the response differs from current data.
  // -----------------------------------------------------------------------
  useEffect(() => {
    let cancelled = false;
    setIsRevalidating(true);

    fetcherRef
      .current()
      .then((fresh) => {
        if (cancelled) return;

        const freshJson = JSON.stringify(fresh);
        const currentJson = JSON.stringify(dataRef.current);

        // Skip re-render when data is identical → zero flicker
        if (freshJson !== currentJson) {
          setData(fresh);
          dataRef.current = fresh;
        }

        // Always persist (updates the timestamp even if data is unchanged)
        writeCache(key, fresh);
      })
      .catch(() => {
        // Keep current data — local / cached fallback is good enough
      })
      .finally(() => {
        if (!cancelled) setIsRevalidating(false);
      });

    return () => {
      cancelled = true;
    };
  }, [key]);

  return { data, isRevalidating };
}
