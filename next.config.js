/**
 * Next.js Configuration
 * Consolidated configuration file that handles both development and production builds
 * @type {import('next').NextConfig}
 */

// Constants
const isProd = process.env.NODE_ENV === 'production';
const isFrontendOnly = 
  (isProd && (!process.env.DATABASE_URL || process.env.DATABASE_URL === 'frontend-only'));

const nextConfig = {
  // Core configurations
  serverExternalPackages: ['@prisma/client', 'mongoose'],
  poweredByHeader: false,
  reactStrictMode: true,

  // Security headers for SEO and protection
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(self)'
          },
          {
            key: 'Access-Control-Allow-Origin',
            value: '*'
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, OPTIONS'
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Content-Type, Authorization'
          },
        ],
      },
      {
        // Apply specific CORS headers for manifest.json
        source: '/manifest.json',
        headers: [
          {
            key: 'Content-Type',
            value: 'application/manifest+json'
          },
          {
            key: 'Access-Control-Allow-Origin',
            value: '*'
          },
        ],
      },
    ];
  },

  // Image optimization
  images: {
    domains: ['via.placeholder.com', 'placehold.co'],
    formats: ['image/avif', 'image/webp'], // Always use modern formats
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840], // Responsive image sizes
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384], // Additional image sizes
    minimumCacheTTL: 60 * 60 * 24 * 7, // Cache images for 7 days
  },

  compress: true,


  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
    // Enable optimizeCss with critters for critical CSS extraction
    optimizeCss: true,
    optimizePackageImports: ['react-icons', 'lodash', 'date-fns'],
    // Add any additional experimental features here
  },
  // Production-specific compiler options
  compiler: isProd ? {
    removeConsole: {
      exclude: ['error', 'warn'],
    },
  } : {},

};

module.exports = nextConfig;