'use client';

import { motion } from 'framer-motion';

export default function Hero() {
  return (
    <section
      id="home"
      className="px-6 pt-32 pb-8 lg:pt-36 lg:pb-10"
    >
      <div className="max-w-screen-2xl w-full mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6"
        >
          <div className="space-y-2">
            <p className="text-[11px] uppercase tracking-[0.22em] text-muted font-medium">
              Portfolio · 2026
            </p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-normal leading-[1.05] tracking-tight text-ink">
              Phuong Hoang
            </h1>
            <p className="text-xl md:text-2xl text-secondary leading-snug">
              Senior Product Designer — Calgary, Canada
            </p>
          </div>

          <motion.a
            href="#projects"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="self-start lg:self-end inline-block px-7 py-3 border border-ink text-sm tracking-[0.18em] uppercase text-ink hover:bg-ink hover:text-inverse transition-colors"
          >
            View Work ↓
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}
