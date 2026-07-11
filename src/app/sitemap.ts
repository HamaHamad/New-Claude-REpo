import type { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://immigai.app'
  const now = new Date()

  // Public routes only — authenticated routes are disallowed in robots.ts
  const publicRoutes = [
    { path: '/',              priority: 1.0,  changeFrequency: 'weekly'   as const },
    { path: '/login',         priority: 0.3,  changeFrequency: 'yearly'   as const },
  ]

  return publicRoutes.map(route => ({
    url: `${baseUrl}${route.path}`,
    lastModified: now,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }))
}
