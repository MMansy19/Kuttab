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
    formats: ['image/avif', 'image/webp'], 
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840], 
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384], 
  },

  compress: true,


  experimental: {
    optimizeCss: true,
    serverActions: {
      bodySizeLimit: '2mb',
    },
    optimizePackageImports: ['react-icons', 'lodash', 'date-fns'],
  },
  // Production-specific compiler options
  compiler: isProd ? {
    removeConsole: {
      exclude: ['error', 'warn'],
    },
  } : {},

};

module.exports = nextConfig;