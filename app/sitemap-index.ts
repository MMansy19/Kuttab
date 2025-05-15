import { MetadataRoute } from 'next';

/**
 * Generates a sitemap index file pointing to different sitemap sections
 * This helps search engines more efficiently crawl large websites
 * @returns {Array<{url: string, lastModified?: Date | string}>} The sitemap index for Next.js
 */
export default function sitemapIndex(): Array<{url: string, lastModified?: Date | string}> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  
  return [
    {
      url: `${baseUrl}/sitemap.xml`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/teachers/sitemap.xml`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/courses/sitemap.xml`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/auth/sitemap.xml`,
      lastModified: new Date(),
    },
  ];
}
