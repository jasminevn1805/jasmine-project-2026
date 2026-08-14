'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

interface TimelineItem {
  period: string;
  role: string;
  org: string;
  location?: string;
  summary?: string;
  highlights?: string[];
  tags?: string[];
}

const experience: TimelineItem[] = [
  {
    period: '2024 — Present',
    role: 'Senior Product Designer',
    org: 'Company Name',
    location: 'Remote · Calgary, CA',
    summary:
      'Lead end-to-end design for a B2B SaaS platform — from discovery and research through interaction, visual design, and engineering handoff.',
    highlights: [
      'Own the design system, growing it from 12 to 60+ production components',
      'Partner with PM and engineering to ship 3 major releases per quarter',
      'Introduced AI-assisted prototyping, cutting validation cycles by ~40%',
    ],
    tags: ['B2B SaaS', 'Design Systems', 'Prototyping'],
  },
  {
    period: '2021 — 2024',
    role: 'Product Designer',
    org: 'Outsourcing Studio · Client-embedded',
    location: 'Vietnam',
    summary:
      'Embedded with multiple client teams across fintech, e-commerce, and healthcare. Took products from problem framing to launch.',
    highlights: [
      'Shipped 6 client products spanning web and mobile (B2B + B2C)',
      'Ran research, journey mapping, IA, and high-fidelity UI',
      'Built and handed off reusable component libraries to dev teams',
    ],
    tags: ['B2B', 'B2C', 'Mobile', 'Web', 'Research'],
  },
  {
    period: '2019 — 2021',
    role: 'Product Designer',
    org: 'In-house Product Company',
    location: 'Vietnam',
    summary:
      'Designed core experiences for a consumer-facing product. Worked closely with PM, engineering, and marketing.',
    highlights: [
      'Redesigned the onboarding flow, improving activation by 22%',
      'Established the team’s first atomic design system',
    ],
    tags: ['B2C', 'Atomic Design', 'Onboarding'],
  },
];

const education: TimelineItem[] = [
  {
    period: '2015 — 2019',
    role: 'Bachelor of Information Technology',
    org: 'University Name',
    location: 'Vietnam',
    summary:
      'Focused on human–computer interaction, software engineering, and visual design.',
  },
  {
    period: 'Ongoing',
    role: 'Continuous Learning',
    org: 'Self-directed',
    summary:
      'Design systems, accessibility (WCAG), AI tooling for design, and modern frontend (React, Tailwind, Next.js).',
  },
];

function TimelineEntry({
  item,
  isLast,
  delay,
}: {
  item: TimelineItem;
  isLast: boolean;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.5, delay }}
      className="relative grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-10 pb-14 last:pb-0"
    >
      {/* Period + rail */}
      <div className="md:col-span-4 relative md:pl-6">
        {!isLast && (
          <span
            aria-hidden
            className="hidden md:block absolute left-0 top-3 -bottom-14 w-px bg-line"
          />
        )}
        <span
          aria-hidden
          className="hidden md:block absolute -left-0.75 top-2.5 w-2 h-2 rounded-full bg-ink"
        />
        <p className="text-[11px] uppercase tracking-[0.22em] text-secondary font-medium md:pt-1">
          {item.period}
        </p>
        <h3 className="mt-3 text-xl md:text-2xl font-normal text-ink tracking-tight leading-tight">
          {item.role}
        </h3>
        <p className="mt-1 text-sm text-secondary">
          {item.org}
          {item.location && <span> · {item.location}</span>}
        </p>
      </div>

      {/* Details */}
      <div className="md:col-span-8 space-y-4">
        {item.summary && (
          <p className="text-base text-ink leading-relaxed">{item.summary}</p>
        )}

        {item.highlights && item.highlights.length > 0 && (
          <ul className="space-y-1.5">
            {item.highlights.map((h) => (
              <li
                key={h}
                className="text-sm text-secondary leading-relaxed pl-4 relative before:content-['—'] before:absolute before:left-0 before:text-muted"
              >
                {h}
              </li>
            ))}
          </ul>
        )}

        {item.tags && item.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-1">
            {item.tags.map((t) => (
              <span
                key={t}
                className="text-xs text-secondary border border-line rounded-full px-2.5 py-1"
              >
                {t}
              </span>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}

function TimelineGroup({
  eyebrow,
  title,
  kicker,
  items,
}: {
  eyebrow: string;
  title: string;
  kicker?: string;
  items: TimelineItem[];
}) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
      {/* Sticky title column */}
      <div className="lg:col-span-4 xl:col-span-3">
        <div className="lg:sticky lg:top-28 space-y-3">
          <p className="text-[11px] uppercase tracking-[0.22em] text-secondary font-medium">
            {eyebrow}
          </p>
          <h2 className="text-3xl md:text-4xl font-normal text-ink tracking-tight leading-tight">
            {title}
          </h2>
          {kicker && (
            <p className="text-sm text-secondary leading-relaxed max-w-xs">
              {kicker}
            </p>
          )}
        </div>
      </div>

      {/* Entries column */}
      <div className="lg:col-span-8 xl:col-span-9">
        {items.map((item, i) => (
          <TimelineEntry
            key={item.role + item.period}
            item={item}
            isLast={i === items.length - 1}
            delay={i * 0.08}
          />
        ))}
      </div>
    </div>
  );
}

export default function Experience() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="experience" className="px-6 py-32 lg:py-40">
      <div className="max-w-screen-2xl mx-auto w-full">
        {/* Section header — balanced 2-col */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 mb-24 lg:mb-32 items-end"
        >
          <div className="lg:col-span-7 space-y-4">
            <p className="text-[11px] uppercase tracking-[0.22em] text-secondary font-medium">
              Career
            </p>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-normal text-ink tracking-tight leading-[1.05]">
              A path through product,
              <br className="hidden md:block" /> systems, and code.
            </h2>
          </div>
          <div className="lg:col-span-4 lg:col-start-9 space-y-3">
            <p className="text-base text-ink leading-relaxed">
              Six years of shipping real products — from B2C consumer apps to
              B2B SaaS — across in-house teams and client engagements.
            </p>
            <a
              href="/resume.pdf"
              className="inline-block text-sm text-ink underline underline-offset-4 decoration-line hover:decoration-ink transition-colors"
            >
              Download résumé ↓
            </a>
          </div>
        </motion.div>

        <div className="space-y-24 lg:space-y-32">
          <TimelineGroup
            eyebrow="01 — Experience"
            title="Where I've worked"
            kicker="Senior IC roles across product companies and client-embedded teams."
            items={experience}
          />
          <TimelineGroup
            eyebrow="02 — Education"
            title="How I learned"
            kicker="Formal training plus continuous, self-directed practice."
            items={education}
          />
        </div>
      </div>
    </section>
  );
}
