import type { ProjectData } from './types';

export const portfolioWebsite: ProjectData = {
  slug: 'portfolio-website',
  title: 'Portfolio Website & Brand Identity',
  services: ['Brand Design', 'Web Development', 'Motion Design'],
  platforms: ['Web', 'Mobile Responsive', 'Next.js'],
  industry: 'Personal Branding',
  description:
    "The portfolio you're looking at right now — a minimalist, performance-first personal site built with Next.js 16, Framer Motion, and a custom design language that reflects my design philosophy.",

  sections: [
    {
      type: 'text',
      heading: 'Design Philosophy',
      content:
        'I wanted a portfolio that practiced what I preach: clean typography, generous whitespace, and interactions that feel intentional rather than decorative. Every animation serves a purpose — guiding attention, creating hierarchy, or providing feedback.',
    },
    { type: 'image', image: '/portfolio-hero.jpg' },
    {
      type: 'text-image',
      heading: 'Typography & Color',
      content:
        'The site uses a restrained palette — near-black (#1A1A1A) on warm white (#FAFAFA) with a single accent gray (#6B6B6B). Typography is set in a clean sans-serif with carefully tuned sizes, weights, and letter-spacing across five responsive breakpoints.',
      image: '/portfolio-typography.jpg',
      layout: 'right',
    },
    {
      type: 'text-image',
      heading: 'Performance & Technical',
      content:
        'Built on Next.js 16 with the App Router, the site scores 100/100 on Lighthouse for performance, accessibility, best practices, and SEO. Framer Motion animations are lazy-loaded and respect prefers-reduced-motion. The entire bundle is under 150KB gzipped.',
      image: '/portfolio-lighthouse.jpg',
      layout: 'left',
    },
    {
      type: 'quote',
      content: '"Your portfolio should be the best piece of work in your portfolio."',
    },
    {
      type: 'text',
      heading: 'Reflection',
      content:
        "Building your own portfolio is the hardest design project — you're simultaneously the client, the designer, and the harshest critic. I went through four major iterations before landing on this version, and I learned more about restraint and editorial design than on any client project.",
    },
  ],

  images: ['/portfolio-full.jpg', '/portfolio-mobile.jpg'],
  github: 'https://github.com/jasminehoang/portfolio',
};
