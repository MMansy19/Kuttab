import { NextResponse } from 'next/dist/server/web/spec-extension/response';
import { NextRequest } from 'next/dist/server/web/spec-extension/request';

/**
 * Google Search Console and analytics tools integration API
 * This endpoint pings search engines when the sitemap is updated
 */

export async function POST(request: NextRequest) {
  // Verify this is an authenticated request (use a secure method in production)
  const apiKey = request.headers.get('x-api-key');
  if (apiKey !== process.env.SITEMAP_NOTIFICATION_KEY) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
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

    return NextResponse.json({
      message: 'Sitemap notification successful',
      google: googleRes.status,
      bing: bingRes.status,
      timestamp: new Date().toISOString()
    }, { status: 200 });
  } catch (error: any) {
    console.error('Sitemap notification error:', error);
    return NextResponse.json({ message: 'Internal server error', error: error.message }, { status: 500 });
  }
}
