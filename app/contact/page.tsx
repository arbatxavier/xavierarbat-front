"use client";

import { motion } from "framer-motion";
import { useI18n } from "../i18n/provider";
import { useApiData } from "../hooks/useApiData";
import {
  getIcon,
  type ContactChannel,
} from "../data/contacts";
import { fallbackContacts } from "../data/defaults/contacts";
import { fallbackContactsToLocal } from "../data/mappers";
import { fetchContacts } from "@/lib/api";

export default function ContactPage() {
  const { t, locale, mounted } = useI18n();

  const { data: channels } = useApiData<ContactChannel[]>({
    key: `contacts-${locale}`,
    initialData: fallbackContactsToLocal(fallbackContacts),
    fetcher: () => fetchContacts(locale),
    ready: mounted,
  });

  return (
    <section className="pt-28 pb-20 px-6 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-4xl md:text-5xl font-bold mb-2">
          {t.contact.title_prefix}
          <span className="text-accent">{t.contact.title_highlight}</span>
        </h1>
        <p className="text-foreground/50 mb-12 max-w-lg">
          {t.contact.description}
        </p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {channels.map((channel, i) => (
          <motion.a
            key={channel.key}
            href={channel.href}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className={`group p-6 bg-surface border border-surface-light rounded-2xl transition-all duration-300 ${channel.hoverBorder}`}
          >
            <div
              className={`text-2xl mb-4 transition-colors duration-300 ${channel.hoverIcon}`}
            >
              {getIcon(channel.iconName)}
            </div>
            <p className="text-xs text-foreground/30 uppercase tracking-widest mb-1">
              {t.contact.labels[channel.key as keyof typeof t.contact.labels]}
            </p>
            <p className="text-sm font-semibold text-foreground/80 break-all">
              {channel.display}
            </p>
          </motion.a>
        ))}
      </div>
    </section>
  );
}
