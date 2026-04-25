"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useI18n } from "../i18n/provider";
import { getIcon, type ContactChannel } from "../data/contacts";

export default function Footer() {
  const { t } = useI18n();
  const [links, setLinks] = useState<ContactChannel[]>([]);

  useEffect(() => {
    fetch("/api/contacts")
      .then((res) => res.json())
      .then((data) => {
        setLinks(data.filter((ch: ContactChannel) => ch.showInFooter));
      })
      .catch(console.error);
  }, []);

  return (
    <footer className="border-t border-surface-light bg-background py-10 px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-sm text-foreground/40">
          &copy; {new Date().getFullYear()} Xavier Arbat. {t.footer.rights}
        </p>
        <div className="flex gap-5">
          {links.map((link) => (
            <Link
              key={link.key}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={link.key}
              className={`text-lg text-foreground/40 transition-colors duration-300 ${link.hoverSimple}`}
            >
              {getIcon(link.iconName)}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
