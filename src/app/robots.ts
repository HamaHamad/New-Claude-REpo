import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://immigai.app'

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/dashboard',
          '/case',
          '/cases',
          '/documents',
          '/analytics',
          '/compliance',
          '/clients',
          '/settings',
          '/forms',
          '/assistant',
          '/login',
          '/api',
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  }
}
