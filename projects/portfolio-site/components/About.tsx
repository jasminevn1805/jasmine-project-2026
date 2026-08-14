'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';

export default function About() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const experience = [
    {
      label: 'EXPERIENCE',
      value: '6+ years',
      detail:
        'Designing B2B and B2C products across in-house product teams and agencies.',
    },
    {
      label: 'SCOPE',
      value: 'End-to-end',
      detail:
        'Discovery, research, IA, interaction, visual design, and engineering handoff.',
    },
    {
      label: 'CRAFT',
      value: 'Systems & AI',
      detail:
        'Atomic design systems, design thinking, and AI-assisted interactive prototypes.',
    },
  ];

  const expertise = [
    'Product Strategy',
    'User Research',
    'Interaction Design',
    'Design Systems',
    'Prototyping',
    'Design Thinking',
    'Atomic Design',
    'AI-Powered Prototyping',
    'Frontend (React)',
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
          {/* Left Column — Bio, Contact, Expertise */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="space-y-10"
          >
            <div className="space-y-5">
              <h3 className={eyebrowClass}>About</h3>
              <p className="text-2xl md:text-3xl font-normal text-ink leading-tight tracking-tight">
                Hi, I&apos;m Jasmine.
              </p>
              <p className="text-base text-ink leading-relaxed">
                <span className="font-medium">Senior product designer</span>{' '}
                with 6+ years shipping B2B and B2C products — in-house at
                product companies and embedded with clients through
                outsourcing teams.
              </p>
              <p className="text-base text-ink leading-relaxed">
                I work end-to-end and like getting my hands into code, using
                AI to push prototypes past static screens into something you
                can click and feel.
              </p>
              <p className="text-base text-ink leading-relaxed">
                Off-screen: curious by default, a slow thinker and fast doer.
                I believe great products start with really listening.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-2">
                <h3 className={eyebrowClass}>Based in</h3>
                <p className="text-sm text-ink">Calgary, Canada</p>
              </div>
              <div className="space-y-2">
                <h3 className={eyebrowClass}>Contact</h3>
                <a
                  href="mailto:hello@jasminehoang.com"
                  className="block text-sm text-ink hover:text-secondary transition-colors"
                >
                  hello@jasminehoang.com
                </a>
                <a
                  href="https://www.linkedin.com/in/jasminehoang/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-sm text-ink hover:text-secondary transition-colors"
                >
                  LinkedIn ↗
                </a>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className={eyebrowClass}>Expertise</h3>
              <div className="flex flex-wrap gap-2">
                {expertise.map((item) => (
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
                <div className="text-center">
                  <div className="text-8xl mb-4 opacity-90">👩‍💻</div>
                  <p className="text-muted text-sm tracking-wide">
                    Add your photo
                  </p>
                </div>
                {/* Replace with:
                <img src="/your-photo.jpg" alt="Jasmine Hoang" className="absolute inset-0 w-full h-full object-cover" />
                */}
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
            {experience.map((item) => (
              <div key={item.label} className="space-y-2">
                <h3 className={eyebrowClass}>{item.label}</h3>
                <div className="text-4xl md:text-5xl font-normal text-ink leading-tight tracking-tight">
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
