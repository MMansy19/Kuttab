import { MetadataRoute } from 'next';

// Generate robots.txt dynamically
export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/api/', 
        '/dashboard/admin/',
        '/dashboard/teacher/private/',
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
