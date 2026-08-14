'use client';

import { motion, useInView } from 'framer-motion';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { use, useRef } from 'react';
import { projects, ContentSection } from '../data';

// Component to render individual content sections
function SectionRenderer({ section, fullWidthDivider }: { section: ContentSection; index: number; fullWidthDivider: boolean }) {
  const sectionRef = useRef(null);
  const inView = useInView(sectionRef, { once: true, margin: '-100px' });

  // Chapter breaks (section-group) get a full-bleed divider; everything else
  // gets a divider scoped to the content column width.
  const outerDivider = fullWidthDivider ? 'border-b border-line' : '';
  const innerDivider = fullWidthDivider ? '' : 'border-b border-line pb-14';

  // Renders `**text**` as bold within an otherwise plain string — used for
  // inline sub-header emphasis (e.g. "**Credit:** ...") inside list item bodies.
  const renderInlineBold = (text: string) => {
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
  };

  const ContentLines = ({ content }: { content: string | string[] }) => {
    const lines = Array.isArray(content) ? content : [content];
    return (
      <div className="space-y-3">
        {lines.map((line, i) => (
          <p key={i} className="text-base text-ink leading-relaxed">{line}</p>
        ))}
      </div>
    );
  };

  // Text-only section
  if (section.type === 'text') {
    if (section.layout === 'split') {
      return (
        <section className={`py-20 px-6 ${outerDivider}`} ref={sectionRef}>
          <div className={`max-w-screen-2xl mx-auto ${innerDivider}`}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.05 }}
              >
                {section.heading && (
                  <h2 className="text-2xl md:text-3xl lg:text-4xl font-normal text-ink tracking-tight leading-[1.15]">
                    {section.heading}
                  </h2>
                )}
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                {section.content && <ContentLines content={section.content} />}
              </motion.div>
            </div>
          </div>
        </section>
      );
    }

    return (
      <section className={`py-20 px-6 ${outerDivider}`} ref={sectionRef}>
        <div className={`max-w-screen-2xl mx-auto ${innerDivider}`}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            {section.heading && (
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-normal mb-6 text-ink tracking-tight leading-[1.15]">
                {section.heading}
              </h2>
            )}
            {section.content && <ContentLines content={section.content} />}
          </motion.div>
        </div>
      </section>
    );
  }

  // Section group / chapter header
  if (section.type === 'section-group') {
    return (
      <section className="pt-20 pb-4 px-6" ref={sectionRef}>
        <div className="max-w-screen-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="pt-2"
          >
            {section.heading && (
              <h2 className="text-xs md:text-sm uppercase tracking-[0.2em] font-semibold text-secondary">
                {section.heading}
              </h2>
            )}
          </motion.div>
        </div>
      </section>
    );
  }

  // Image-only section
  if (section.type === 'image') {
    return (
      <section className={`py-20 px-6 ${outerDivider}`} ref={sectionRef}>
        <div className={`max-w-screen-2xl mx-auto ${innerDivider}`}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.6 }}
            className="relative bg-surface rounded-xl overflow-hidden shadow-sm"
          >
            {section.image ? (
              <img src={section.image} alt={section.heading || ''} className="w-full h-auto object-cover" />
            ) : (
              <div className="h-125 md:h-175 bg-linear-to-br from-surface to-line flex items-center justify-center">
                <span className="text-8xl opacity-20">🎨</span>
              </div>
            )}
          </motion.div>
        </div>
      </section>
    );
  }

  // List section (scannable summary/body items, two-column)
  if (section.type === 'list') {
    return (
      <section className={`py-20 px-6 ${outerDivider}`} ref={sectionRef}>
        <div className={`max-w-screen-2xl mx-auto ${innerDivider}`}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
              <div>
                {section.heading && (
                  <h2 className="text-2xl md:text-3xl lg:text-4xl font-normal text-ink tracking-tight leading-[1.15]">
                    {section.heading}
                  </h2>
                )}
              </div>

              <div className="space-y-10">
                {section.items?.map((item, itemIndex) => (
                  <div key={itemIndex} className="space-y-3">
                    <h3 className="text-lg md:text-xl font-medium text-ink tracking-tight">
                      {item.summary}
                    </h3>
                    {Array.isArray(item.body) ? (
                      <div className="space-y-3">
                        {item.body.map((line, lineIndex) => (
                          <p key={lineIndex} className="text-base text-ink leading-relaxed">
                            {renderInlineBold(line)}
                          </p>
                        ))}
                      </div>
                    ) : (
                      <p className="text-base text-ink leading-relaxed">{renderInlineBold(item.body)}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    );
  }

  // Text + Image section (side by side)
  if (section.type === 'text-image') {
    const isImageRight = section.layout === 'right';
    return (
      <section className={`py-20 px-6 ${outerDivider}`} ref={sectionRef}>
        <div className={`max-w-screen-2xl mx-auto ${innerDivider}`}>
          <div className={`grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center ${isImageRight ? '' : 'lg:grid-flow-dense'}`}>
            <motion.div
              initial={{ opacity: 0, x: isImageRight ? -30 : 30 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6 }}
              className={isImageRight ? '' : 'lg:col-start-2'}
            >
              {section.heading && (
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-normal mb-4 text-ink tracking-tight leading-[1.15]">
                  {section.heading}
                </h2>
              )}
              {section.content && <ContentLines content={section.content} />}
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: isImageRight ? 30 : -30 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 }}
              className={`relative bg-surface rounded-xl overflow-hidden shadow-sm ${isImageRight ? '' : 'lg:col-start-1 lg:row-start-1'}`}
            >
              {section.image ? (
                <img src={section.image} alt={section.heading || ''} className="w-full h-auto block" />
              ) : (
                <div className="h-100 md:h-125 bg-linear-to-br from-surface to-line flex items-center justify-center">
                  <span className="text-8xl opacity-20">📸</span>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </section>
    );
  }

  // List + Image section (scannable summary/body list, paired with supporting image)
  if (section.type === 'list-image') {
    const isImageRight = section.layout === 'right';
    return (
      <section className={`py-20 px-6 ${outerDivider}`} ref={sectionRef}>
        <div className={`max-w-screen-2xl mx-auto ${innerDivider}`}>
          <div className={`grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center ${isImageRight ? '' : 'lg:grid-flow-dense'}`}>
            <motion.div
              initial={{ opacity: 0, x: isImageRight ? -30 : 30 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6 }}
              className={isImageRight ? '' : 'lg:col-start-2'}
            >
              {section.heading && (
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-normal mb-6 text-ink tracking-tight leading-[1.15]">
                  {section.heading}
                </h2>
              )}
              <div className="space-y-7">
                {section.items?.map((item, itemIndex) => (
                  <div key={itemIndex} className="space-y-2">
                    <h3 className="text-lg md:text-xl font-medium text-ink tracking-tight">
                      {item.summary}
                    </h3>
                    {Array.isArray(item.body) ? (
                      <div className="space-y-2">
                        {item.body.map((line, lineIndex) => (
                          <p key={lineIndex} className="text-base text-ink leading-relaxed">
                            {renderInlineBold(line)}
                          </p>
                        ))}
                      </div>
                    ) : (
                      <p className="text-base text-ink leading-relaxed">{renderInlineBold(item.body)}</p>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: isImageRight ? 30 : -30 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 }}
              className={`relative bg-surface rounded-xl overflow-hidden shadow-sm ${isImageRight ? '' : 'lg:col-start-1 lg:row-start-1'}`}
            >
              {section.image ? (
                <img src={section.image} alt={section.heading || ''} className="w-full h-auto block" />
              ) : (
                <div className="h-100 md:h-125 bg-linear-to-br from-surface to-line flex items-center justify-center">
                  <span className="text-8xl opacity-20">📸</span>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </section>
    );
  }

  // Image grid section
  if (section.type === 'image-grid') {
    const imageCount = section.images?.length || 0;
    const gridCols = imageCount === 2 ? 'md:grid-cols-2' : imageCount === 3 ? 'md:grid-cols-3' : 'md:grid-cols-2';
    
    return (
      <section className={`py-20 px-6 ${outerDivider}`} ref={sectionRef}>
        <div className={`max-w-screen-2xl mx-auto ${innerDivider}`}>
          <div className={`grid grid-cols-1 ${gridCols} gap-8`}>
            {section.images?.map((img, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="flex flex-col gap-3"
              >
                <div className="bg-surface rounded-xl overflow-hidden shadow-sm">
                  {img ? (
                    <img src={img} alt={section.captions?.[i] || ''} className="w-full h-auto block" />
                  ) : (
                    <div className="aspect-square bg-linear-to-br from-surface to-line flex items-center justify-center">
                      <span className="text-6xl opacity-20">📱</span>
                    </div>
                  )}
                </div>
                {section.captions?.[i] && (
                  <p className="text-[12px] text-muted leading-relaxed">{section.captions[i]}</p>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Stats / outcomes grid
  if (section.type === 'stats') {
    return (
      <section className={`py-20 px-6 ${outerDivider}`} ref={sectionRef}>
        <div className={`max-w-screen-2xl mx-auto ${innerDivider}`}>
          {section.heading && (
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5 }}
              className="text-2xl md:text-3xl lg:text-4xl font-normal text-ink tracking-tight leading-[1.15] mb-8"
            >
              {section.heading}
            </motion.h2>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-line">
            {section.stats?.map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.07 }}
                className="bg-canvas px-8 py-10 flex flex-col gap-2"
              >
                <span className="text-5xl font-light text-ink tracking-tight leading-none">{stat.value}</span>
                <span className="text-sm font-medium text-ink mt-1">{stat.label}</span>
                {stat.note && <span className="text-[12px] text-muted leading-relaxed">{stat.note}</span>}
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Journey map section
  if (section.type === 'journey') {
    return (
      <section className={`py-20 px-6 ${outerDivider}`} ref={sectionRef}>
        <div className={`max-w-screen-2xl mx-auto ${innerDivider}`}>
          {section.heading && (
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5 }}
              className="text-2xl md:text-3xl lg:text-4xl font-normal text-ink tracking-tight leading-[1.15] mb-4"
            >
              {section.heading}
            </motion.h2>
          )}
          {section.content && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.05 }}
              className="mb-14"
            >
              <ContentLines content={section.content} />
            </motion.div>
          )}

          {/* Scenarios */}
          <div className="space-y-14">
            {section.scenarios?.map((scenario, si) => (
              <div key={si}>
                <div className="mb-5">
                  <h3 className="text-lg md:text-xl font-medium text-ink tracking-tight">{scenario.title}</h3>
                  {scenario.context && (
                    <p className="text-sm text-muted mt-1 leading-relaxed">{scenario.context}</p>
                  )}
                </div>

                {/* Step cards — horizontal journey flow on desktop, 2-col grid on mobile */}

                {/* Desktop: full horizontal timeline */}
                <div className="hidden lg:flex gap-px bg-line rounded-xl overflow-hidden">
                  {scenario.steps.map((step, ti) => (
                    <motion.div
                      key={ti}
                      initial={{ opacity: 0, y: 16 }}
                      animate={inView ? { opacity: 1, y: 0 } : {}}
                      transition={{ duration: 0.4, delay: ti * 0.06 }}
                      className={`flex-1 min-w-0 px-5 py-6 flex flex-col gap-3 ${step.friction ? 'bg-rose-50/50' : 'bg-canvas'}`}
                    >
                      <div className="flex items-start justify-between gap-2 flex-wrap">
                        <span className="text-[10px] uppercase tracking-[0.18em] text-secondary font-medium whitespace-nowrap">
                          {String(ti + 1).padStart(2, '0')} · {step.stage}
                        </span>
                        {step.friction && (
                          <span className="text-[9px] uppercase tracking-[0.14em] font-semibold text-rose-500 bg-rose-100 px-1.5 py-0.5 rounded whitespace-nowrap">
                            Friction
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-ink leading-snug">{step.action}</p>
                      <p className="text-[12px] text-muted italic leading-snug mt-auto pt-2 border-t border-line">{step.feeling}</p>
                    </motion.div>
                  ))}
                </div>

                {/* Mobile / tablet: 2-column grid */}
                <div className="lg:hidden grid grid-cols-1 sm:grid-cols-2 gap-px bg-line rounded-xl overflow-hidden">
                  {scenario.steps.map((step, ti) => (
                    <motion.div
                      key={ti}
                      initial={{ opacity: 0, y: 16 }}
                      animate={inView ? { opacity: 1, y: 0 } : {}}
                      transition={{ duration: 0.4, delay: ti * 0.06 }}
                      className={`px-5 py-6 flex flex-col gap-3 ${step.friction ? 'bg-rose-50/50' : 'bg-canvas'}`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="text-[10px] uppercase tracking-[0.18em] text-secondary font-medium">
                          {String(ti + 1).padStart(2, '0')} · {step.stage}
                        </span>
                        {step.friction && (
                          <span className="text-[9px] uppercase tracking-[0.14em] font-semibold text-rose-500 bg-rose-100 px-1.5 py-0.5 rounded">
                            Friction
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-ink leading-snug">{step.action}</p>
                      <p className="text-[12px] text-muted italic leading-snug mt-auto pt-2 border-t border-line">{step.feeling}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Synthesized insights */}
          {section.insights && section.insights.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mt-14 border-t border-line pt-10"
            >
              <h3 className="text-[11px] uppercase tracking-[0.22em] text-secondary mb-6 font-medium">
                What the map revealed
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-5">
                {section.insights.map((insight, ii) => (
                  <div key={ii} className="flex gap-4">
                    <span className="text-sm font-medium text-ink/30 tabular-nums">{String(ii + 1).padStart(2, '0')}</span>
                    <p className="text-base text-ink leading-relaxed">{insight}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </section>
    );
  }

  // Quote section
  if (section.type === 'quote') {
    return (
      <section className={`py-32 px-6 ${outerDivider}`} ref={sectionRef}>
        <div className={`max-w-screen-2xl mx-auto ${innerDivider}`}>
          <div className="max-w-7xl mx-auto text-center">
            <motion.blockquote
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="text-xl md:text-2xl lg:text-3xl font-normal text-ink italic leading-relaxed"
            >
              {Array.isArray(section.content) ? section.content.join(' ') : section.content}
            </motion.blockquote>
          </div>
        </div>
      </section>
    );
  }

  return null;
}

export default function ProjectDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const project = projects[slug];

  if (!project) {
    notFound();
  }

  // Refs for scroll animations
  const heroRef = useRef(null);
  const heroImageRef = useRef(null);
  const descriptionRef = useRef(null);
  const galleryRef = useRef(null);
  const ctaRef = useRef(null);

  // InView hooks
  const heroInView = useInView(heroRef, { once: true, margin: '-100px' });
  const heroImageInView = useInView(heroImageRef, { once: true, margin: '-100px' });
  const descriptionInView = useInView(descriptionRef, { once: true, margin: '-100px' });
  const galleryInView = useInView(galleryRef, { once: true, margin: '-100px' });
  const ctaInView = useInView(ctaRef, { once: true, margin: '-100px' });

  return (
    <main className="min-h-screen bg-canvas">
      {/* Header with Back Button */}
      <header className="sticky top-0 z-50 bg-canvas/80 backdrop-blur-md border-b border-line">
        <div className="max-w-screen-2xl mx-auto px-6 py-6">
          <Link 
            href="/#projects"
            className="inline-flex items-center gap-2 text-ink hover:text-secondary transition-colors"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12.5 5L7.5 10L12.5 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Back to Home
          </Link>
        </div>
      </header>

      {/* Hero Section - Split Layout */}
      <section className="py-20 px-6">
        <div className="max-w-screen-2xl mx-auto" ref={heroRef}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 lg:items-start">
            {/* Left Column - Title & Social */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="flex flex-col justify-between"
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-normal tracking-tight leading-tight">
                {project.title}
              </h1>

            </motion.div>

            {/* Right Column - Description */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="flex flex-col items-start"
            >
              
              <h2 className="text-[13px] md:text-sm font-medium mt-3 mb-4 text-secondary uppercase tracking-[0.15em] leading-tight">
                {project.overviewHeadline || 'Overview'}
              </h2>
              <p className="text-base text-ink leading-relaxed">
                {project.description}
              </p>

              {/* Live demo CTA — only renders for projects that ship a working URL.
                  In dev this points at localhost (e.g. http://localhost:3001 for meal-prep);
                  in production it points at the deployed app. */}
              {project.link && (
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-2 mt-8 px-5 py-3 rounded-full border border-ink/15 text-sm font-medium text-ink hover:bg-ink hover:text-canvas hover:border-ink transition-colors w-fit"
                >
                  <span
                    className="inline-block w-2 h-2 rounded-full bg-emerald-500 group-hover:bg-emerald-300"
                    aria-hidden
                  />
                  Try the live demo
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
                    <path d="M4 10L10 4M10 4H5M10 4V9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </a>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Hero Image Section */}
      <section className="py-10 px-6">
        <div className="max-w-screen-2xl mx-auto" ref={heroImageRef}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={heroImageInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.6 }}
            className="relative h-125 md:h-175 bg-surface rounded-xl overflow-hidden shadow-sm"
          >
            <div className="w-full h-full bg-linear-to-br from-surface to-line flex items-center justify-center">
              <span className="text-8xl opacity-20">🎨</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Meta Info Section */}
      <section className={`pt-6 pb-20 px-6 ${project.sections[0]?.type === 'section-group' ? 'border-b border-line' : ''}`}>
        <div
          className={`max-w-screen-2xl mx-auto w-full ${project.sections[0]?.type === 'section-group' ? '' : 'border-b border-line pb-14'}`}
          ref={descriptionRef}
        >
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={descriptionInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="w-fit max-w-full"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-8 gap-y-10 text-left">
              <div className="min-w-0">
                <h3 className="text-[11px] uppercase tracking-[0.22em] text-secondary mb-3 font-medium">SERVICES</h3>
                <div className="text-sm md:text-base text-ink leading-relaxed space-y-1">
                  {project.services.map((service, i) => (
                    <p key={i}>{service}</p>
                  ))}
                </div>
              </div>

              <div className="min-w-0">
                <h3 className="text-[11px] uppercase tracking-[0.22em] text-secondary mb-3 font-medium">PLATFORMS</h3>
                <div className="text-sm md:text-base text-ink leading-relaxed space-y-1">
                  {project.platforms.map((platform, i) => (
                    <p key={i}>{platform}</p>
                  ))}
                </div>
              </div>

              <div className="min-w-0">
                <h3 className="text-[11px] uppercase tracking-[0.22em] text-secondary mb-3 font-medium">INDUSTRY</h3>
                <div className="text-sm md:text-base text-ink leading-relaxed space-y-1">
                  {project.industry.split(',').map((item, i) => (
                    <p key={i}>{item.trim()}</p>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Dynamic Content Sections */}
      {project.sections.map((section, index) => (
        <SectionRenderer
          key={index}
          section={section}
          index={index}
          fullWidthDivider={project.sections[index + 1]?.type === 'section-group'}
        />
      ))}

      {/* Final Gallery Images */}
      {project.images && project.images.length > 0 && (
        <section className="py-20 px-6">
          <div className="max-w-screen-2xl mx-auto border-b border-line pb-14" ref={galleryRef}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {project.images.map((img, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  animate={galleryInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                  className="flex flex-col gap-3"
                >
                  <div className="bg-surface rounded-xl overflow-hidden shadow-sm">
                    {img ? (
                      <img src={img} alt={project.imageLabels?.[i] || ''} className="w-full h-auto block" />
                    ) : (
                      <div className="h-100 md:h-125 bg-linear-to-br from-surface to-line flex items-center justify-center">
                        <span className="text-6xl opacity-20">📱</span>
                      </div>
                    )}
                  </div>
                  {project.imageLabels?.[i] && (
                    <p className="text-[12px] text-muted leading-relaxed">{project.imageLabels[i]}</p>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Footer CTA */}
      <section className="py-32 px-6">
        <div className="max-w-screen-2xl mx-auto text-center" ref={ctaRef}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={ctaInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <Link
              href="/#projects"
              className="inline-block text-4xl md:text-5xl lg:text-6xl font-normal hover:text-secondary transition-colors"
            >
              View More Projects →
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-line py-8 px-6">
        <div className="max-w-screen-2xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-secondary">
          <p>© 2026 All Rights Reserved.</p>
          <div className="flex gap-6">
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-ink transition-colors">Twitter</a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-ink transition-colors">LinkedIn</a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-ink transition-colors">Instagram</a>
          </div>
        </div>
      </footer>
    </main>
  );
}
