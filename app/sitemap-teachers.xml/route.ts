// app/teachers/sitemap.ts
import { MetadataRoute } from 'next'
import teachersData from '@/data/teachers'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

  return teachersData.map((teacher) => ({
    url: `${baseUrl}/teachers/${teacher.id}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.8,
  }))
}
