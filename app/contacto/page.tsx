"use client";

import { motion } from "framer-motion";
import { useI18n } from "../i18n/provider";
import { contactChannels } from "../data/contacts";

export default function ContactPage() {
  const { t } = useI18n();

  return (
    <section className="pt-28 pb-20 px-6 max-w-5xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-14"
      >
        <h1 className="text-4xl md:text-5xl font-bold mb-2">
          {t.contact.title_prefix}
          <span className="text-accent">{t.contact.title_highlight}</span>
        </h1>
        <p className="text-foreground/50 max-w-lg">
          {t.contact.description}
        </p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {contactChannels.map((ch, i) => (
          <motion.a
            key={ch.key}
            href={ch.href}
            target={ch.href.startsWith("http") ? "_blank" : undefined}
            rel={ch.href.startsWith("http") ? "noopener noreferrer" : undefined}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.08 * i }}
            whileHover={{ scale: 1.02 }}
            className={`group flex items-center gap-4 p-5 bg-surface border border-surface-light rounded-2xl transition-all duration-300 ${ch.hoverBorder}`}
          >
            <span
              className={`text-2xl w-10 h-10 flex items-center justify-center bg-surface-light rounded-xl text-foreground/50 transition-colors duration-300 ${ch.hoverIcon}`}
            >
              {ch.icon}
            </span>
            <div className="min-w-0">
              <p className="text-xs uppercase tracking-widest text-foreground/40 mb-1">
                {t.contact.labels[ch.key as keyof typeof t.contact.labels]}
              </p>
              <p className="text-sm text-foreground/80 group-hover:text-foreground transition-colors truncate">
                {ch.display}
              </p>
            </div>
          </motion.a>
        ))}
      </div>
    </section>
  );
}
