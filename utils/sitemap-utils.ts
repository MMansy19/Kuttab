/**
 * Utility functions for generating and handling sitemap XML output
 */

import { MetadataRoute } from 'next';
import { NextResponse } from 'next/dist/server/web/spec-extension/response';

/**
 * Convert a MetadataRoute.Sitemap to XML format
 * @param sitemap - The sitemap data
 * @returns XML string
 */
export function sitemapToXml(sitemap: MetadataRoute.Sitemap): string {
  return '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
    sitemap.map(entry => 
      `  <url>\n` +
      `    <loc>${entry.url}</loc>\n` +
      (entry.lastModified ? `    <lastmod>${formatDate(entry.lastModified)}</lastmod>\n` : '') +
      (entry.changeFrequency ? `    <changefreq>${entry.changeFrequency}</changefreq>\n` : '') +
      (entry.priority !== undefined ? `    <priority>${entry.priority}</priority>\n` : '') +
      `  </url>`
    ).join('\n') +
    '\n</urlset>';
}

/**
 * Format a date for XML sitemap
 * @param date - Date or string
 * @returns Formatted date string
 */
function formatDate(date: Date | string): string {
  if (typeof date === 'string') return date;
  return date.toISOString();
}

/**
 * Create a NextResponse with XML content
 * @param xml - XML string
 * @returns NextResponse
 */
export function createXmlResponse(xml: string): NextResponse {
  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml',
    },
  });
}

/**
 * Convert a sitemap to XML and return as NextResponse
 * @param sitemap - Sitemap data
 * @returns NextResponse
 */
export function sitemapResponse(sitemap: MetadataRoute.Sitemap): NextResponse {
  const xml = sitemapToXml(sitemap);
  return createXmlResponse(xml);
}
