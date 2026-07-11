/** @type {import('next').NextConfig} */

// Safely parse a URL that may or may not include a protocol prefix
function safeHostname(raw) {
  if (!raw) return null
  try {
    const url = raw.startsWith('http') ? raw : `https://${raw}`
    return new URL(url).hostname
  } catch {
    return raw
  }
}

function safeHost(raw) {
  if (!raw) return null
  try {
    const url = raw.startsWith('http') ? raw : `https://${raw}`
    return new URL(url).host
  } catch {
    return raw
  }
}

const appUrl = process.env.NEXT_PUBLIC_APP_URL

// ── Security headers ─────────────────────────────────────────
// Applied to every response. Tighten CSP further once trusted domains are known.
const securityHeaders = [
  // Force HTTPS for 1 year (2 years in prod with preload once verified)
  { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains' },
  // Prevent clickjacking
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  // Prevent MIME-type sniffing
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  // Referrer policy — only send origin to cross-origin targets
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  // Disable JS engines leaking page info in cross-origin requests
  { key: 'X-DNS-Prefetch-Control', value: 'on' },
  // Permissions policy — lock down powerful APIs
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(), browsing-topics=(), interest-cohort=()',
  },
  // Content Security Policy
  // - default-src: only same origin
  // - script-src: same origin + inline (Next needs this) + eval (dev only)
  // - style-src: same origin + inline (Tailwind/CSS-in-JS) + fonts.googleapis.com
  // - img-src: same origin + data: + blob: + Vercel Blob + https
  // - font-src: same origin + fonts.gstatic.com
  // - connect-src: same origin + https://api.anthropic.com + Vercel Blob
  // - frame-ancestors: same origin only (clickjacking defense)
  {
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "img-src 'self' data: blob: https: https://*.public.blob.vercel-storage.com",
      "font-src 'self' data: https://fonts.gstatic.com",
      "connect-src 'self' https://api.anthropic.com https://*.public.blob.vercel-storage.com",
      "frame-ancestors 'self'",
      "base-uri 'self'",
      "form-action 'self'",
      "object-src 'none'",
      "upgrade-insecure-requests",
    ].join('; '),
  },
]

const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  webpack: (config, { isServer }) => {
    // Mark nodemailer as optional — it's only require()'d at runtime in notifications.ts
    if (isServer) {
      config.externals = config.externals || []
      // Don't bundle nodemailer; it will be require()'d lazily at runtime if installed.
      config.externals.push('nodemailer')
    }
    return config
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: securityHeaders,
      },
    ]
  },
  experimental: {
    serverActions: {
      allowedOrigins: [
        'localhost:3000',
        process.env.VERCEL_URL,
        safeHost(appUrl),
      ].filter(Boolean),
      bodySizeLimit: '11mb',
    },
  },
  images: {
    remotePatterns: [
      { protocol: 'http',  hostname: 'localhost' },
      { protocol: 'https', hostname: '*.vercel.app' },
      { protocol: 'https', hostname: '*.public.blob.vercel-storage.com' },
      ...(appUrl ? [{ protocol: 'https', hostname: safeHostname(appUrl) }] : []),
    ],
  },
}
module.exports = nextConfig
