import { MetadataRoute } from 'next';
import { sitemapResponse } from '@/utils/sitemap-utils';

/**
 * Generate a sitemap for authentication-related pages
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
  
  // Authentication routes
  return [
    {
      url: `${baseUrl}/auth/login`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.6,
    },    {
      url: `${baseUrl}/auth/signup`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.6,
    }
  ];
}

// Type declaration to fix Vercel build issues
export type SitemapRoute = {};
