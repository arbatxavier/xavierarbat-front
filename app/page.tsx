"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Button from "./components/Button";
import { useI18n } from "./i18n/provider";
import { SITE_URL } from "@/lib/config";

const backgroundImages = [
  `${SITE_URL}/images/home/motherboard.jpg`,
];

export default function Home() {
  const { t } = useI18n();
  const [currentIdx, setCurrentIdx] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIdx((prev) => (prev + 1) % backgroundImages.length);
    }, 6000); // Change image every 6 seconds
    return () => clearInterval(timer);
  }, []);

  return (
    <>
      {/* Hero — Image Background Carousel */}
      <section className="relative h-screen w-full overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 z-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIdx}
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 2, ease: "easeInOut" }}
              className="absolute inset-0"
            >
              <Image
                src={backgroundImages[currentIdx]}
                alt="Background"
                fill
                className="object-cover"
                priority
              />
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="absolute inset-0 bg-background/70 z-[1]" />

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
            <span className="text-accent-cyan">X</span>
            <span className="text-foreground">avier </span>
            <span className="text-accent">Ar</span>
            <span className="text-foreground">ba</span>
            <span className="text-accent">t</span>
            <span className="text-accent-cyan">.</span>
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
              src={`${SITE_URL}/images/home/me.jpg`}
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
