'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';

export default function Contact() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const socials = [
    { name: 'GitHub', url: 'https://github.com/jasminevn1805/jasmine-project-2026', icon: '→' },
    { name: 'LinkedIn', url: 'https://www.linkedin.com/in/phuonghoangux/', icon: '→' },
  ];

  return (
    <section className="py-40 px-6 border-t border-line">
      <div className="max-w-screen-2xl mx-auto w-full">
        {/* CTA Section */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-24"
        >
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-8 leading-tight">
            Let's Work Together
          </h2>
          <p className="text-lg md:text-xl text-secondary mb-12 whitespace-nowrap">
            Have a project in mind? Let&apos;s create something amazing together.
          </p>
          <a
            href="mailto:jasminevn1805@gmail.com"
            className="inline-block px-12 py-6 bg-ink text-white text-base md:text-lg font-semibold hover:bg-secondary transition-all duration-300 transform hover:scale-105 tracking-wide"
          >
            GET IN TOUCH
          </a>
        </motion.div>

        {/* Footer */}
        <div className="border-t border-line pt-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-20 md:gap-24 mb-16">
            {/* Social Links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h3 className="text-xs md:text-sm uppercase tracking-widest text-secondary mb-6 font-medium">
                FOLLOW ME
              </h3>
              <div className="space-y-3">
                {socials.map((social, index) => (
                  <motion.a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ opacity: 0, x: -20 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                    className="block text-lg md:text-xl hover:text-secondary transition-colors group"
                  >
                    {social.name}
                    <span className="inline-block ml-2 group-hover:translate-x-2 transition-transform">
                      {social.icon}
                    </span>
                  </motion.a>
                ))}
              </div>
            </motion.div>

            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <h3 className="text-xs md:text-sm uppercase tracking-widest text-secondary mb-6 font-medium">
                CONTACT
              </h3>
              <div className="space-y-3 text-lg md:text-xl">
                <a
                  href="mailto:jasminevn1805@gmail.com"
                  className="block hover:text-secondary transition-colors"
                >
                  jasminevn1805@gmail.com
                </a>
                <p className="text-ink">Calgary, Canada</p>
              </div>
            </motion.div>
          </div>

          {/* Copyright */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="pt-8 border-t border-line text-center text-secondary"
          >
            <p className="text-sm">© {new Date().getFullYear()} Phuong Hoang. All Rights Reserved.</p>
            <p className="text-xs mt-2 text-muted">Built with Next.js, TypeScript & Framer Motion</p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
