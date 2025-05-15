import { MetadataRoute } from 'next';
import teachersData from '@/data/teachers';
import { sitemapResponse } from '@/utils/sitemap-utils';

/**
 * Generate a sitemap focused on teacher profiles
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
    // Generate teacher profile routes
  const teacherRoutes = teachersData.map((teacher: any) => ({
    url: `${baseUrl}/teachers/${teacher.id}`,
    lastModified: currentDate,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));
  
  return teacherRoutes;
}

// Type declaration to fix Vercel build issues
export type SitemapRoute = {};
