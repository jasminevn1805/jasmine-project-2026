import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**' }, // Allow OG thumbnails from any domain
    ],
  },

  // ── Security headers ────────────────────────────────────────────────────────
  // Applied to every response. Instruct the browser to enforce safety rules
  // that defend against clickjacking, MIME sniffing, and information leakage.
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          // Prevents browsers from MIME-sniffing a response away from the declared content-type.
          // Stops attacks where a malicious file is served as a different type.
          { key: 'X-Content-Type-Options', value: 'nosniff' },

          // Prevents the site from being embedded in an <iframe> on another domain.
          // Defends against clickjacking attacks.
          { key: 'X-Frame-Options', value: 'DENY' },

          // Controls how much referrer info is sent. 'strict-origin-when-cross-origin'
          // sends full path within the same site, only origin when crossing to another site.
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },

          // Disables browser features this app doesn't use.
          // Stops a compromised dependency sneaking access to camera/mic/location.
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },

          // Tells browsers to only connect via HTTPS for the next year.
          // Only enable once the site is confirmed to be on HTTPS (i.e. deployed on Vercel).
          { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains' },
        ],
      },
    ]
  },
}

export default nextConfig
