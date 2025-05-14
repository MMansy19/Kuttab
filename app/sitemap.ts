import { MetadataRoute } from 'next';
import teachersData from '@/data/teachers'; // Import mock data for now

/**
 * Generate the sitemap dynamically
 * This helps search engines discover and index your pages efficiently
 * @returns {MetadataRoute.Sitemap} A sitemap object for Next.js
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  
  // Get the current date for lastModified
  const currentDate = new Date();
  
  // Generate static routes
  const staticRoutes = [
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/teachers`,
      lastModified: currentDate,
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/auth/login`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    },
    {
      url: `${baseUrl}/auth/signup`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    },
    {
      url: `${baseUrl}/donate`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
  ];
    // Generate teacher profile routes (using mock data for now)
  // In production, you would fetch this from your database
  const teacherRoutes = teachersData.map((teacher: any) => ({
    url: `${baseUrl}/teachers/${teacher.id}`,
    lastModified: currentDate,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));
  
  // You can add other dynamic routes here
  // For example, blog posts, courses, etc.
  
  // Combine all routes
  return [...staticRoutes, ...teacherRoutes];
}
