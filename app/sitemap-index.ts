import { MetadataRoute } from 'next';

/**
 * Generates a sitemap index file pointing to different sitemap sections
 * This helps search engines more efficiently crawl large websites
 * @returns {MetadataRoute.SitemapIndex} The sitemap index for Next.js
 */
export default function sitemapIndex(): MetadataRoute.SitemapIndex {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  
  return [
    {
      url: `${baseUrl}/sitemap-main.xml`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/sitemap-teachers.xml`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/sitemap-courses.xml`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/sitemap-auth.xml`,
      lastModified: new Date(),
    },
  ];
}
