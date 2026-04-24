"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Button from "./components/Button";
import { useI18n } from "./i18n/provider";

export default function Home() {
  const { t } = useI18n();

  return (
    <>
      {/* Hero — Video Background */}
      <section className="relative h-screen w-full overflow-hidden flex items-center justify-center">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/video/hero.mp4" type="video/mp4" />
        </video>

        <div className="absolute inset-0 bg-background/70" />

        <div className="relative z-10 text-center px-6 max-w-3xl">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-accent uppercase tracking-[0.3em] text-sm mb-4"
          >
            {t.hero.subtitle}
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl md:text-7xl font-bold leading-tight"
          >
            Xavier <span className="text-accent">Arbat</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mt-6 text-foreground/60 text-lg md:text-xl max-w-xl mx-auto leading-relaxed"
          >
            {t.hero.description}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="mt-10 flex gap-4 justify-center flex-wrap"
          >
            <Button href="/portfolio">{t.hero.cta_portfolio}</Button>
            <Button href="/blog" variant="outline">
              {t.hero.cta_blog}
            </Button>
          </motion.div>
        </div>

        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
        >
          <div className="w-5 h-8 border-2 border-foreground/30 rounded-full flex items-start justify-center p-1">
            <div className="w-1 h-2 bg-accent rounded-full" />
          </div>
        </motion.div>
      </section>

      {/* Quick About Section */}
      <section className="py-24 px-6 max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="grid md:grid-cols-2 gap-12 items-center"
        >
          <div>
            <h2 className="text-3xl font-bold mb-4">
              {t.about.title_prefix}{" "}
              <span className="text-accent-cyan">{t.about.title_highlight}</span>
            </h2>
            <p className="text-foreground/60 leading-relaxed mb-6">
              {t.about.description}
            </p>
            <Button href="/portfolio" variant="outline">
              {t.about.cta}
            </Button>
          </div>
          <div className="relative aspect-square bg-surface border border-surface-light rounded-2xl overflow-hidden">
            <Image
              src="/images/me.jpg"
              alt="Xavier Arbat"
              fill
              className="object-cover"
              priority
            />
          </div>
        </motion.div>
      </section>
    </>
  );
}
