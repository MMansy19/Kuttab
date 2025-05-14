import { MetadataRoute } from 'next';
import teachersData from '@/data/teachers';

/**
 * Generate a sitemap focused on teacher profiles
 * @returns {MetadataRoute.Sitemap} A sitemap object for Next.js
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  
  // Get the current date for lastModified
  const currentDate = new Date();
    // Generate teacher profile routes
  const teacherRoutes = teachersData.map((teacher: any) => ({
    url: `${baseUrl}/teachers/${teacher.id}`,
    lastModified: currentDate,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));
  
  return teacherRoutes;
}
