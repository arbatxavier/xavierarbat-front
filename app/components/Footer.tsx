"use client";

import Link from "next/link";
import { useI18n } from "../i18n/provider";
import { useApiData } from "../hooks/useApiData";
import {
  getIcon,
  type ContactChannel,
} from "../data/contacts";
import { fallbackContacts } from "../data/defaults/contacts";
import { fallbackContactsToLocal } from "../data/mappers";
import { fetchContacts } from "@/lib/api";

export default function Footer() {
  const { t, locale, mounted } = useI18n();

  const { data: allContacts } = useApiData<ContactChannel[]>({
    key: `contacts-footer-${locale}`,
    initialData: fallbackContactsToLocal(fallbackContacts),
    fetcher: () => fetchContacts(locale),
    ready: mounted,
  });

  const links = allContacts.filter((ch) => ch.showInFooter);

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
