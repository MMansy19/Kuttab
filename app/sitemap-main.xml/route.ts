import { MetadataRoute } from 'next';
import { sitemapResponse } from '@/utils/sitemap-utils';

/**
 * Generate the main sitemap containing primary pages
 * @returns {Response} A response containing the sitemap XML
 */
export async function GET() {
  const sitemap = generateSitemap();
  return sitemapResponse(sitemap);
}

function generateSitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  
  // Get the current date for lastModified
  const currentDate = new Date();
  
  // Define main site pages
  return [
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.7,
    }
  ];
}

// Type declaration to fix Vercel build issues
export type SitemapRoute = {};
