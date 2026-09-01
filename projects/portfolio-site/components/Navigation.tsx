'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-canvas/95 backdrop-blur-md border-b border-line' : 'bg-transparent'
      }`}
    >
      <div className="max-w-screen-2xl mx-auto px-6 py-6 flex justify-between items-center">
        <motion.a
          href="#home"
          whileHover={{ scale: 1.05 }}
          className="text-xl font-bold cursor-pointer"
        >
          PH
        </motion.a>
        
        <div className="hidden md:flex gap-8 items-center text-sm tracking-widest">
          <a href="#home" className="text-ink hover:text-secondary transition-colors">
            HOME
          </a>
          <a href="#about" className="text-ink hover:text-secondary transition-colors">
            ABOUT
          </a>
          <a href="#projects" className="text-ink hover:text-secondary transition-colors">
            PROJECTS
          </a>
          <a
            href="mailto:jasminevn1805@gmail.com"
            className="px-6 py-2 border border-ink hover:bg-ink hover:text-white transition-all"
          >
            CONTACT
          </a>
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden">
          <button className="text-xl">☰</button>
        </div>
      </div>
    </motion.nav>
  );
}
