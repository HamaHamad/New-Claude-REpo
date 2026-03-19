/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    serverActions: {
      // Include your Vercel deployment URL and custom domain
      allowedOrigins: [
        'localhost:3000',
        process.env.VERCEL_URL,
        process.env.NEXT_PUBLIC_APP_URL
          ? new URL(process.env.NEXT_PUBLIC_APP_URL).host
          : undefined,
      ].filter(Boolean),
      bodySizeLimit: '11mb',
    },
  },
  images: {
    remotePatterns: [
      { protocol: 'http',  hostname: 'localhost' },
      { protocol: 'https', hostname: '*.vercel.app' },
      // Vercel Blob storage
      { protocol: 'https', hostname: '*.public.blob.vercel-storage.com' },
      ...(process.env.NEXT_PUBLIC_APP_URL
        ? [{ protocol: 'https', hostname: new URL(process.env.NEXT_PUBLIC_APP_URL).hostname }]
        : []),
    ],
  },
}
module.exports = nextConfig
