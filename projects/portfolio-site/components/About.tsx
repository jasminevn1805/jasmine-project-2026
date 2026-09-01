'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';

export default function About() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const experience = [
    {
      label: '01',
      value: 'Frame',
      detail:
        'Product strategy · Problem definition · User research.',
    },
    {
      label: '02',
      value: 'Structure',
      detail:
        'Information architecture · User flows · Content structure · Systems thinking.',
    },
    {
      label: '03',
      value: 'Design',
      detail:
        'Interaction design · Visual design · Design systems.',
    },
    {
      label: '04',
      value: 'Validate',
      detail:
        'Prototyping · Usability testing · Working prototypes.',
    },
    {
      label: '05',
      value: 'Deliver',
      detail:
        'Design–development collaboration · Design specifications · UX Audit · Design handoff.',
    },
  ];

  const domains = [
    'Spatial Data',
    'Healthcare',
    'Oil & Gas',
    'Consumer Products',
    'B2B SaaS',
  ];

  const eyebrowClass =
    'text-[11px] uppercase tracking-[0.22em] text-secondary font-medium';

  return (
    <section id="about" className="px-6 pb-12 lg:pb-16">
      <div className="max-w-screen-2xl mx-auto w-full">
        <div
          ref={ref}
          className="grid grid-cols-1 md:grid-cols-[4fr_5fr_3fr] gap-12 lg:gap-20 items-center"
        >
          {/* Left Column — Bio, Contact, Domains */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="space-y-10"
          >
            <div className="space-y-5">
              <h3 className={eyebrowClass}>About</h3>
              <p className="text-2xl md:text-3xl font-normal text-ink leading-tight tracking-tight">
                Hi, I&apos;m Phuong.
              </p>
              <p className="text-base text-ink leading-relaxed">
                <span className="font-medium">Product Designer building clear experiences for complex products.</span>{' '}
              </p>
              <p className="text-base text-ink leading-relaxed">
                I work across product strategy, UX, systems, and interaction design — turning ambiguous problems into structured experiences and working prototypes.

              </p>
              <p className="text-base text-ink leading-relaxed">
                I’m particularly interested in complex B2B products, data-heavy experiences, and systems that need to scale.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className={eyebrowClass}>Contact</h3>
              <a
                href="mailto:jasminevn1805@gmail.com"
                className="block text-sm text-ink hover:text-secondary transition-colors"
              >
                Email
              </a>
              <a
                href="https://www.linkedin.com/in/phuonghoangux/"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-sm text-ink hover:text-secondary transition-colors"
              >
                LinkedIn ↗
              </a>
              <a
                href="https://github.com/jasminevn1805/jasmine-project-2026"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-sm text-ink hover:text-secondary transition-colors"
              >
                GitHub ↗
              </a>
            </div>

            <div className="space-y-4">
              <h3 className={eyebrowClass}>Domains I've Worked</h3>
              <div className="flex flex-wrap gap-2">
                {domains.map((item) => (
                  <span
                    key={item}
                    className="text-sm text-ink border border-line rounded-full px-3 py-1.5 hover:border-ink transition-colors"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Middle Column — Portrait */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="flex items-stretch"
          >
            <div className="relative w-full aspect-6/9 bg-canvas rounded-[400px] border border-line p-6 shadow-[0_40px_100px_-40px_rgba(0,0,0,0.18)]">
              <div className="relative w-full h-full bg-linear-to-br from-surface to-line rounded-[400px] overflow-hidden flex items-center justify-center">
                {/* Drop the real portrait at public/site/your-photo.jpg —
                    this path picks it up automatically, nothing else to change. */}
                <img
                  src="/site/homepage-photo.png"
                  /*src="https://unsplash.com/photos/a-foggy-landscape-with-trees-in-the-distance-6YmzwamGzCg"*/
                  alt="Phuong Hoang"
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </div>
            </div>
          </motion.div>

          {/* Right Column — Credibility */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="space-y-10"
          >
            <h3 className={eyebrowClass}>How I Work</h3>
            {experience.map((item) => (
              <div key={item.label} className="space-y-2">
                <h3 className={eyebrowClass}>{item.label}</h3>
                <div className="text-2xl md:text-3xl font-normal text-ink leading-tight tracking-tight">
                  {item.value}
                </div>
                <p className="text-sm text-secondary leading-relaxed">
                  {item.detail}
                </p>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
