import { MetadataRoute } from 'next';

/**
 * Generate a sitemap for course-related pages
 * @returns {MetadataRoute.Sitemap} A sitemap object for Next.js
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
    // Example of what course entries would look like:
    // {
    //   url: `${baseUrl}/courses/quran-tajweed`,
    //   lastModified: currentDate,
    //   changeFrequency: 'weekly',
    //   priority: 0.7,
    // },
  ];
}
