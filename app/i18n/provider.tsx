"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useLayoutEffect,
  ReactNode,
} from "react";

import es from "./es.json";
import ca from "./ca.json";
import en from "./en.json";

export type Locale = "es" | "ca" | "en";

const dictionaries: Record<Locale, typeof es> = { es, ca, en };

const LOCALES: Locale[] = ["es", "ca", "en"];
const LOCALE_LABELS: Record<Locale, string> = {
  es: "ES",
  ca: "CA",
  en: "EN",
};
const STORAGE_KEY = "preferred-locale";

interface I18nContextValue {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: typeof es;
  locales: Locale[];
  labels: Record<Locale, string>;
  mounted: boolean;
}

const I18nContext = createContext<I18nContextValue | null>(null);

/** Detects the preferred browser language and maps it to our locales */
function detectLocale(): Locale {
  if (typeof window === "undefined") return "en";

  // 1. Check localStorage
  const stored = localStorage.getItem(STORAGE_KEY) as Locale | null;
  if (stored && LOCALES.includes(stored)) return stored;

  // 2. Check navigator.languages (Chrome exposes user preferences here)
  const browserLangs = navigator.languages ?? [navigator.language];

  for (const lang of browserLangs) {
    const code = lang.toLowerCase();
    // Exact match: "ca", "es", "en"
    if (LOCALES.includes(code as Locale)) return code as Locale;
    // Prefix match: "es-ES" -> "es", "ca-ES" -> "ca", "en-US" -> "en"
    const prefix = code.split("-")[0] as Locale;
    if (LOCALES.includes(prefix)) return prefix;
  }

  return "en"; // fallback
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en");
  const [mounted, setMounted] = useState(false);

  useLayoutEffect(() => {
    setLocaleState(detectLocale());
    setMounted(true);
  }, []);

  const setLocale = (l: Locale) => {
    setLocaleState(l);
    localStorage.setItem(STORAGE_KEY, l);
    document.documentElement.lang = l;
  };

  // Prevents incorrect language flash during SSR/hydration
  useEffect(() => {
    if (mounted) {
      document.documentElement.lang = locale;
    }
  }, [locale, mounted]);

  return (
    <I18nContext.Provider
      value={{
        locale,
        setLocale,
        t: dictionaries[locale],
        locales: LOCALES,
        labels: LOCALE_LABELS,
        mounted,
      }}
    >
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
}
