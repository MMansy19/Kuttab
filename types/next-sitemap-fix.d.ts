/**
 * Fix for Next.js sitemap types in route handlers
 */
import { MetadataRoute } from 'next';

declare module 'next' {
  namespace MetadataRoute {
    // Ensure sitemap doesn't conflict with route handlers
    export interface Sitemap {
      url: string;
      lastModified?: string | Date;
      changeFrequency?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
      priority?: number;
    }
  }
}

// Fix route handler compatibility with sitemap files
declare module 'next/dist/server/web/exports' {
  interface RouteHandlerManager {
    sitemap?: (props?: any) => Promise<MetadataRoute.Sitemap> | MetadataRoute.Sitemap;
  }
}
