'use client';

import { motion } from 'framer-motion';
import Hero from '@/components/Hero';
import About from '@/components/About';
import Stats from '@/components/Stats';
import Experience from '@/components/Experience';
import Projects from '@/components/Projects';
import Contact from '@/components/Contact';
import Navigation from '@/components/Navigation';

export default function Home() {
  return (
    <main className="min-h-screen bg-canvas text-ink">
      <Navigation />
      <div className="min-h-screen flex flex-col justify-center">
        <Hero />
        <About />
      </div>
      <Experience />
      <Projects />
      <Contact />
    </main>
  );
}

