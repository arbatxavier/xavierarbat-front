"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useI18n } from "../i18n/provider";

const navLinks = [
  { href: "/", key: "home" as const },
  { href: "/portfolio", key: "portfolio" as const },
  { href: "/blog", key: "blog" as const },
  { href: "/contact", key: "contact" as const },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { t, locale, setLocale, locales, labels } = useI18n();
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-surface-light">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="text-xl font-bold tracking-tight">
          <span className="text-accent-cyan">X</span>
          <span className="text-foreground">avier </span>
          <span className="text-accent">Ar</span>
          <span className="text-foreground">ba</span>
          <span className="text-accent">t</span>
          <span className="text-accent-cyan">.</span>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`relative text-sm uppercase tracking-widest transition-colors duration-300 ${
                isActive(link.href)
                  ? "text-accent"
                  : "text-foreground/60 hover:text-accent"
              }`}
            >
              {t.nav[link.key]}
              {isActive(link.href) && (
                <motion.span
                  layoutId="nav-indicator"
                  className="absolute -bottom-1 left-0 right-0 h-0.5 bg-accent rounded-full"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
            </Link>
          ))}
          {/* Language selector */}
          <div className="flex items-center gap-1 ml-2">
            {locales.map((l) => (
              <button
                key={l}
                onClick={() => setLocale(l)}
                className={`text-xs px-2 py-1 transition-colors duration-200 cursor-pointer ${
                  locale === l
                    ? "text-accent-cyan border-b border-accent-cyan"
                    : "text-foreground/40 hover:text-foreground/70"
                }`}
              >
                {labels[l]}
              </button>
            ))}
          </div>
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden flex flex-col gap-1.5 w-6"
          aria-label="Toggle menu"
        >
          <motion.span
            animate={isOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
            className="block h-0.5 w-full bg-foreground"
          />
          <motion.span
            animate={isOpen ? { opacity: 0 } : { opacity: 1 }}
            className="block h-0.5 w-full bg-foreground"
          />
          <motion.span
            animate={isOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
            className="block h-0.5 w-full bg-foreground"
          />
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden overflow-hidden bg-background border-t border-surface-light rounded-b-2xl"
          >
            <div className="flex flex-col px-6 py-6 gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`text-lg uppercase tracking-widest transition-colors ${
                    isActive(link.href)
                      ? "text-accent"
                      : "text-foreground/60 hover:text-accent"
                  }`}
                >
                  {isActive(link.href) && (
                    <span className="inline-block w-2 h-2 bg-accent rounded-full mr-3 align-middle" />
                  )}
                  {t.nav[link.key]}
                </Link>
              ))}
              {/* Mobile language selector */}
              <div className="flex items-center gap-3 pt-4 border-t border-surface-light">
                {locales.map((l) => (
                  <button
                    key={l}
                    onClick={() => {
                      setLocale(l);
                      setIsOpen(false);
                    }}
                    className={`text-sm px-3 py-1 transition-colors cursor-pointer ${
                      locale === l
                        ? "text-accent-cyan border border-accent-cyan rounded-lg"
                        : "text-foreground/40 hover:text-foreground/70 border border-surface-light rounded-lg"
                    }`}
                  >
                    {labels[l]}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
