import type { ProjectData } from './types';

export const ecommercePlatform: ProjectData = {
  slug: 'ecommerce-platform',
  title: 'E-Commerce Platform Redesign',
  services: ['UI/UX Design', 'Frontend Development', 'Performance Optimization'],
  platforms: ['Web', 'Mobile Web', 'Desktop'],
  industry: 'Fashion E-Commerce',
  description:
    'A complete redesign of a luxury fashion e-commerce platform, focusing on performance, accessibility, and a seamless checkout experience that reduced cart abandonment by 35%.',

  sections: [
    {
      type: 'text',
      heading: 'The Challenge',
      content:
        "The existing platform suffered from slow load times, a confusing navigation structure, and a checkout flow that lost 60% of users before completion. Our goal was to reimagine the entire shopping experience while maintaining the brand's premium feel.",
    },
    { type: 'image', image: '/ecommerce-hero.jpg' },
    {
      type: 'text-image',
      heading: 'Research & Discovery',
      content:
        'We conducted user interviews with 15 frequent shoppers, analyzed heatmaps from 10,000 sessions, and benchmarked against competitors. Three key insights emerged: users wanted faster product discovery, visual-first browsing, and a one-page checkout.',
      image: '/ecommerce-research.jpg',
      layout: 'right',
    },
    {
      type: 'text-image',
      heading: 'Design System & Components',
      content:
        'We built a bespoke component library with 40+ components — product cards, size selectors, color swatches, and a responsive image gallery. Every component was designed for both mobile and desktop, with touch-friendly targets and smooth transitions.',
      image: '/ecommerce-components.jpg',
      layout: 'left',
    },
    {
      type: 'quote',
      content: '"Great e-commerce design is invisible — it gets out of the way and lets the product speak for itself."',
    },
    {
      type: 'text',
      heading: 'Results',
      content:
        'The redesigned platform launched to a 35% reduction in cart abandonment, 2x improvement in page load speed, and a 28% increase in average order value. Mobile conversion rates improved by 45%.',
    },
  ],

  images: ['/ecommerce-desktop.jpg', '/ecommerce-mobile.jpg'],
  link: 'https://luxeandco.com',
};
