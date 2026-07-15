import type { MetadataRoute } from 'next'

const BASE = 'https://kkdanny.com'

const CATEGORY_SLUGS = [
  'cement-concrete', 'steel-reinforcement', 'roofing-materials',
  'paint-finishes', 'tiles-flooring', 'timber-lumber',
  'hardware-fasteners', 'tools-equipment', 'wire-mesh',
  'pipes-plumbing', 'delivery-service',
]

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()
  return [
    { url: BASE, lastModified: now, changeFrequency: 'weekly', priority: 1 },
    { url: `${BASE}/products`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE}/quote`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE}/contact`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE}/about`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE}/gallery`, lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${BASE}/delivery`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE}/bulk-orders`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    ...CATEGORY_SLUGS.map(slug => ({
      url: `${BASE}/products/${slug}`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    })),
  ]
}
