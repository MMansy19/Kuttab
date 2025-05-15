import { NextResponse } from 'next/server';

/**
 * Generate a sitemap for course-related pages
 * @returns {NextResponse} A response containing the sitemap XML
 */
export async function GET() {
  const sitemap = generateSitemap();
  return new NextResponse(
    '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
    sitemap.map(entry => 
      `  <url>\n` +
      `    <loc>${entry.url}</loc>\n` +
      `    <lastmod>${entry.lastModified.toISOString()}</lastmod>\n` +
      `    <changefreq>${entry.changeFrequency}</changefreq>\n` +
      `    <priority>${entry.priority}</priority>\n` +
      `  </url>`
    ).join('\n') +
    '\n</urlset>',
    {
      headers: {
        'Content-Type': 'application/xml',
      },
    }
  );
}

function generateSitemap() {
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

// Type declaration to fix Vercel build issues
export type SitemapRoute = {};
