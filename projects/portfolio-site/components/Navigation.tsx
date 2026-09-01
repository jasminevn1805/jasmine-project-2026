'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close the mobile menu whenever the viewport grows past the `md`
  // breakpoint, so it can't be left open behind the now-visible desktop nav.
  useEffect(() => {
    const mql = window.matchMedia('(min-width: 768px)');
    const onChange = () => setMenuOpen(false);
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
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
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            className="text-xl text-ink"
          >
            {menuOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {/* Mobile menu panel */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="md:hidden overflow-hidden bg-canvas/95 backdrop-blur-md border-b border-line"
          >
            <div className="max-w-screen-2xl mx-auto px-6 py-6 flex flex-col gap-6 text-sm tracking-widest">
              <a
                href="#home"
                onClick={() => setMenuOpen(false)}
                className="text-ink hover:text-secondary transition-colors"
              >
                HOME
              </a>
              <a
                href="#about"
                onClick={() => setMenuOpen(false)}
                className="text-ink hover:text-secondary transition-colors"
              >
                ABOUT
              </a>
              <a
                href="#projects"
                onClick={() => setMenuOpen(false)}
                className="text-ink hover:text-secondary transition-colors"
              >
                PROJECTS
              </a>
              <a
                href="mailto:jasminevn1805@gmail.com"
                onClick={() => setMenuOpen(false)}
                className="px-6 py-2 border border-ink hover:bg-ink hover:text-white transition-all text-center"
              >
                CONTACT
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
