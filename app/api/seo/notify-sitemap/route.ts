import type { NextApiRequest, NextApiResponse } from 'next';

/**
 * Google Search Console and analytics tools integration API
 * This endpoint pings search engines when the sitemap is updated
 */

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Only allow POST requests from authenticated sources
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  // Verify this is an authenticated request (use a secure method in production)
  const apiKey = req.headers['x-api-key'];
  if (apiKey !== process.env.SITEMAP_NOTIFICATION_KEY) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    const sitemapUrl = `${baseUrl}/sitemap.xml`;
    
    // Notify Google
    const googleRes = await fetch(
      `https://www.google.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`,
      { method: 'GET' }
    );
    
    // Notify Bing
    const bingRes = await fetch(
      `https://www.bing.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`,
      { method: 'GET' }
    );

    return res.status(200).json({
      message: 'Sitemap notification successful',
      google: googleRes.status,
      bing: bingRes.status,
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    console.error('Sitemap notification error:', error);
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
}
