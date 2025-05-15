import { MetadataRoute } from 'next';

/**
 * Generate a sitemap for course-related pages
 * This function uses the built-in Next.js sitemap support
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  
  // Get the current date for lastModified
  const currentDate = new Date();
  
  // Placeholder for future course pages
  // When you add actual courses, generate their URLs here
  return [
    {
      url: `${baseUrl}/courses`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/quran-courses`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/arabic-courses`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.7,
    }
  ];
}
