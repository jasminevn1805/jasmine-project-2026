'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

// Renders `**text**` as bold within an otherwise plain string.
function renderInlineBold(text: string) {
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, i) =>
    part.startsWith('**') && part.endsWith('**') ? (
      <strong key={i} className="font-semibold text-ink">
        {part.slice(2, -2)}
      </strong>
    ) : (
      <span key={i}>{part}</span>
    )
  );
}

interface TimelineItem {
  period: string;
  role: string;
  org: string;
  location?: string;
  summary?: string | string[];
  highlights?: string[];
  tags?: string[];
}

const experience: TimelineItem[] = [
  {
    period: '2011 — 2014',
    role: 'Technical Foundation',
    org: 'Tanner Asia',
    //location: 'B2B SaaS · Calgary, CA',
    summary:[
      '**Built a foundation in precision, technical communication, and complex information.**',
      'Worked across aerospace, industrial automation, and manufacturing, developing a disciplined approach to accuracy and structured information.',],
    highlights: [
      'Learned to work with complex information where accuracy, consistency, and clarity directly affected the quality of the final product.',
      'Developed a disciplined approach to understanding technical systems, documenting them clearly, and working within demanding standards.',
    ],
    tags: ['Precision', 'Technical Documentation', 'Information Structure'],
  },
  {
    period: '2014 — 2021',
    role: 'From UX to Product Design',
    org: 'Onix · Digital Masons · iVedha',
    //location: 'B2B SaaS · Montreal, Canada',
    summary:[
      '**Moved from interface design into complex product workflows and systems.**',
      'Designed industrial and cloud products where information architecture, operational workflows, and consistency were critical to getting the job done.',],
    highlights: [
      'Learned to move beyond individual screens and understand the workflows, information structures, and operational context that shape how people use complex products.',
      'Developed an early systems-thinking practice through industrial, IoT, cloud, and telehealth products, including reusable patterns and design systems that could scale across experiences.',
    ],
    tags: ['Workflow Thinking', 'Information Architecture', 'Design System'],
  },
  {
    period: '2021 — 2022',
    role: 'End-to-End Product Design',
    org: 'ORO Health',
    //location: 'Product & Cloud Services · Toronto, Canada',
    summary:[
      '**Expanded into end-to-end product ownership.**',
      'Led the design of Dermago from research and information architecture through interaction design, validation, documentation, and launch.',],
    highlights: [
      'Learned to take ownership of the broader product problem—from understanding user and business needs to defining, validating, and delivering the experience.',
      'Became more comfortable making design decisions across competing constraints, working closely with engineering, clinical, business, and client stakeholders.',
    ],
    tags: ['Product Thinking', 'UX Research', 'Decision Making', 'Collaboration'],
  },
  {
    period: '2023 — 2025',
    role: 'Independent Design Practice',
    org: 'Independent',
    //location: 'Industrial SaaS · Stavanger, Norway',
    summary:[
      '**Used independent work to broaden my practice and explore new ways of designing and building.**',
      'Worked across technical documentation and brand projects while developing interactive prototypes and AI-assisted design-to-development workflows',],
    highlights: [
      'Used independent work to broaden my practice, taking greater ownership of ambiguous problems from defining the opportunity through delivery.',
      'Expanded beyond traditional design workflows into interactive prototyping and AI-assisted design-to-development, strengthening my ability to move from idea to working experience.',
    ],
    tags: ['Project Management', 'Experimentation', 'Interaction Design'],
  },
  {
    period: '2025 — 2026',
    role: 'Complex Data Products',
    org: 'BigGeo',
    //location: 'Industrial SaaS · Stavanger, Norway',
    summary:[
      '**Applied systems thinking to spatial data and B2B SaaS.**',
      'Designed data-management, marketplace, and business-management experiences that help users work with complex spatial data and make informed decisions.',],
    highlights: [
      'Applied years of experience designing complex workflows to spatial-data products, where information architecture, data relationships, and business decisions are deeply connected.',
      'Strengthened my ability to think across an entire product ecosystem—from data management and marketplace experiences to business dashboards and the systems connecting them.',
    ],
    tags: ['Data', 'Product Ecosystem', 'Business Context', 'System Thinking'],
  },
];

const education: TimelineItem[] = [
  {
    period: '2015 — 2019',
    role: 'Bachelor of Information Technology',
    org: 'University of Science Ho Chi Minh city',
    location: 'Vietnam',
    summary:
      'Built a technical foundation across computing, information technology, and problem-solving—learning to understand how digital systems work beneath the interface.',
  },
  {
    period: '2019 — 2021',
    role: 'Bachelor of Management Information Systems ',
    org: 'University of Economics Ho Chi Minh city',
    location: 'Vietnam',
    summary:
      'Developed an understanding of how information systems support business operations, decision-making, and organizational needs.',
  },
  {
    period: 'Ongoing',
    role: 'Continuous Learning',
    org: 'Self-directed',
    summary:
      'Self-directed practice across product design, systems thinking, and emerging technology.',
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
          <div className="space-y-3">
            {(Array.isArray(item.summary) ? item.summary : [item.summary]).map((line, i) => (
              <p key={i} className="text-base text-ink leading-relaxed">
                {renderInlineBold(line)}
              </p>
            ))}
          </div>
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
              From technical precision
              <br className="hidden md:block" /> to product systems.
            </h2>
          </div>
          <div className="lg:col-span-4 lg:col-start-9 space-y-3">
            <p className="text-base text-ink leading-relaxed">
              I started in technical documentation, moved into industrial software, and grew into end-to-end product design across healthcare, cloud services, and spatial-data platforms.
            </p>
            <a
              href="/site/PhuongHoang-ProductDesigner-Resume.pdf"
              className="inline-block text-sm text-ink underline underline-offset-4 decoration-line hover:decoration-ink transition-colors"
            >
              Download résumé ↓
            </a>
          </div>
        </motion.div>

        <div className="space-y-24 lg:space-y-32">
          <TimelineGroup
            eyebrow="01 — Experience"
            title="How I grew"
            kicker="Progressive experience across increasingly complex products, systems, and problems."
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
