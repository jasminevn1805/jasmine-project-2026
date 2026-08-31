'use client';

import { motion, useInView } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import Link from 'next/link';

interface Project {
  slug: string;
  title: string;
  category: string;
  description: string;
  image: string;
  link?: string;
  github?: string;
}

const projects: Project[] = [
  {
    slug: 'design-system',
    title: 'React Design System',
    category: 'Design Systems · Figma API · React · Storybook',
    description:
      'A token-driven component library — 1,000+ design tokens auto-generated from Figma, five production-ready components, and a one-command sync pipeline.',
    image: '/ds-hero.jpg',
    github: 'https://github.com/jasminehoang/design-system',
  },
  {
    slug: 'cookstash-ver1',
    title: 'Cookstash',
    category: 'Consumer Product · Next.js · Zustand · Tailwind',
    description:
      'A responsive web app that turns scattered social-media recipe saves into organized meal plans and smart grocery lists.',
    image: '/mp-hero.jpg',
  },
  {
    slug: 'cookstash-ver2',
    title: 'Cookstash',
    category: 'Consumer Product · Next.js · Zustand · Tailwind',
    description:
      'A responsive web app that turns scattered social-media recipe saves into organized meal plans and smart grocery lists.',
    image: '/mp-hero.jpg',
  },
  {
    slug: 'ecommerce-platform',
    title: 'E-Commerce Redesign',
    category: 'UX Redesign · React · Performance',
    description:
      'A complete redesign of a luxury fashion e-commerce platform that reduced cart abandonment by 35% and doubled page load speed.',
    image: '/ecommerce-hero.jpg',
    link: 'https://luxeandco.com',
  },
  {
    slug: 'datalab-dashboard',
    title: 'Datalab Dashboard: Turning Fragmented Data into Confident Decisions',
    category: 'B2B SaaS · UX Research · Information Architecture',
    description:
      "A single, information-dense dashboard request turned into three focused experiences — Credit Consumption, Sales Performance, and Channel Performance — each built around the question that business area actually needs answered.",
    image: '/case-study/datalab-dashboard/dd-design-secision-01-current-credit.png',
    link: 'https://www.biggeo.com/products/datalab',
  },
  {
    slug: 'dermago',
    title: 'Dermago',
    category: 'Digital Health · UX Research · Design Systems',
    description:
      'An asynchronous, chat-based telemedicine app that replaces the three-week wait for a five-minute appointment with a photo, a symptom, and a diagnosis — no waiting room required.',
    image: '/dermago-hero.jpg',
    link: 'https://orohealth.me',
  },
  {
    slug: 'portfolio-website',
    title: 'Portfolio & Brand Identity',
    category: 'Brand · Next.js · Framer Motion',
    description:
      "A minimalist, performance-first personal site — the portfolio you're looking at right now.",
    image: '/portfolio-hero.jpg',
    github: 'https://github.com/jasminehoang/portfolio',
  },
];

export default function Projects() {
  const ref = useRef(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const total = projects.length;
  const [activeIndex, setActiveIndex] = useState(0);

  // Triple the cards for seamless infinite loop
  const infiniteProjects = [...projects, ...projects, ...projects];

  // Refs to mutable state used inside the slide function
  const translateRef = useRef(0);
  const transitioningRef = useRef(false);

  const slide = (dir: 1 | -1) => {
    const container = containerRef.current;
    if (!container || transitioningRef.current) return;

    const firstCard = container.children[0] as HTMLElement | undefined;
    if (!firstCard) return;

    const gap = 48; // md:gap-12
    const step = firstCard.offsetWidth + gap;

    transitioningRef.current = true;
    translateRef.current -= dir * step;

    container.style.transition = 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
    container.style.transform = `translateX(${translateRef.current}px)`;

    // Update visible index (mod total)
    setActiveIndex((prev) => {
      const next = (prev + dir + total) % total;
      return next;
    });

    setTimeout(() => {
      // Seamless reset when we've passed one full set
      const resetThreshold = -(step * total);
      if (translateRef.current <= resetThreshold) {
        container.style.transition = 'none';
        translateRef.current = 0;
        container.style.transform = 'translateX(0)';
        void container.offsetHeight; // force reflow
      } else if (translateRef.current > 0) {
        // user pressed back past the start — jump forward by one set
        container.style.transition = 'none';
        translateRef.current = -(step * (total - 1));
        container.style.transform = `translateX(${translateRef.current}px)`;
        void container.offsetHeight;
      }
      transitioningRef.current = false;
    }, 600);
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let intervalId: NodeJS.Timeout = setInterval(() => slide(1), 3500);

    const onMouseEnter = () => clearInterval(intervalId);
    const onMouseLeave = () => {
      intervalId = setInterval(() => slide(1), 3500);
    };

    container.addEventListener('mouseenter', onMouseEnter);
    container.addEventListener('mouseleave', onMouseLeave);

    return () => {
      clearInterval(intervalId);
      container.removeEventListener('mouseenter', onMouseEnter);
      container.removeEventListener('mouseleave', onMouseLeave);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const eyebrowCount =
    total <= 3
      ? `${String(total).padStart(2, '0')} selected works`
      : `${String(total).padStart(2, '0')} case studies`;

  const intro =
    total <= 3
      ? 'A focused selection — each one chosen to show a different facet of how I work: from research and systems thinking to shipping production-ready code.'
      : 'A cross-section of recent work across B2B and B2C — design systems, consumer products, and end-to-end shipped experiences. Each card tells a small story; click in for the full case study.';

  return (
    <section
      id="projects"
      className="py-32 lg:py-40 border-t border-line"
      ref={ref}
    >
      <div className="max-w-screen-2xl mx-auto w-full px-6">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 mb-16 lg:mb-20 items-end"
        >
          <div className="lg:col-span-7 space-y-4">
            <p className="text-[11px] uppercase tracking-[0.22em] text-secondary font-medium">
              Selected Work · {eyebrowCount}
            </p>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-normal text-ink tracking-tight leading-[1.05]">
              Things I&apos;ve shipped,
              <br className="hidden md:block" /> systems I&apos;ve built.
            </h2>
          </div>
          <div className="lg:col-span-4 lg:col-start-9 space-y-4">
            <p className="text-base text-ink leading-relaxed">{intro}</p>
          </div>
        </motion.div>

        {/* Counter + arrows */}
        <div className="flex items-center justify-between mb-6">
          <p
            className="text-[11px] uppercase tracking-[0.22em] text-secondary font-medium tabular-nums"
            aria-live="polite"
          >
            <span className="text-ink">
              {String(activeIndex + 1).padStart(2, '0')}
            </span>
            <span className="mx-2 text-muted">/</span>
            <span>{String(total).padStart(2, '0')}</span>
          </p>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => slide(-1)}
              aria-label="Previous project"
              className="w-10 h-10 rounded-full border border-line text-ink hover:border-ink transition-colors flex items-center justify-center"
            >
              ←
            </button>
            <button
              type="button"
              onClick={() => slide(1)}
              aria-label="Next project"
              className="w-10 h-10 rounded-full border border-line text-ink hover:border-ink transition-colors flex items-center justify-center"
            >
              →
            </button>
          </div>
        </div>

        {/* Carousel — transform-based smooth auto-scroll */}
        <div className="relative -mx-6 px-6 overflow-hidden">
          <div
            ref={containerRef}
            className="flex gap-8 md:gap-12 py-4 pb-6"
            style={{ willChange: 'transform' }}
          >
            {infiniteProjects.map((project, index) => {
              const displayIndex = index % total;
              return (
                <Link
                  key={`project-${index}`}
                  href={`/projects/${project.slug}`}
                  className="shrink-0 w-[85vw] md:w-[calc((100%-6rem)/3)] block"
                >
                  <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.5, delay: (index % total) * 0.08 }}
                    className="group"
                  >
                    <div
                      className="
                        relative h-96 md:h-120 bg-surface mb-5 overflow-hidden
                        rounded-xl
                        shadow-sm group-hover:shadow-lg
                        transition-[box-shadow,transform] duration-500 ease-out
                        group-hover:-translate-y-1
                      "
                    >
                      <div className="w-full h-full bg-linear-to-br from-surface to-line flex items-center justify-center transition-transform duration-500 group-hover:scale-105">
                        <span className="text-6xl opacity-20">🎨</span>
                      </div>
                      <div className="absolute inset-0 bg-canvas/85 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <span className="px-5 py-2.5 bg-ink text-inverse rounded-pill text-sm font-medium tracking-wide shadow-md">
                          View case study →
                        </span>
                      </div>
                      <span className="absolute top-4 left-4 text-[11px] uppercase tracking-[0.22em] text-secondary font-medium bg-canvas/85 backdrop-blur-sm px-2.5 py-1 rounded-pill shadow-xs">
                        {String(displayIndex + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
                      </span>
                    </div>
                    <div className="space-y-2">
                      <p className="text-[11px] uppercase tracking-[0.22em] text-secondary font-medium">
                        {project.category}
                      </p>
                      <h3 className="text-xl md:text-2xl font-normal text-ink tracking-tight group-hover:text-secondary transition-colors">
                        {project.title}
                      </h3>
                      <p className="text-base text-ink leading-relaxed">
                        {project.description}
                      </p>
                    </div>
                  </motion.div>
                </Link>
              );
            })}
          </div>
        </div>

        <p className="mt-6 text-xs text-muted tracking-wide text-center md:text-right">
          Use ← → to step through, or hover to pause
        </p>
      </div>
    </section>
  );
}
