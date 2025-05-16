/** @type {import('next').NextConfig} */

const nextConfig = {
  serverExternalPackages: ['@prisma/client', 'mongoose'],
  poweredByHeader: false,
  reactStrictMode: true,

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


  images: {
    domains: ['via.placeholder.com', 'placehold.co'],
    formats: ['image/avif', 'image/webp'], 
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840], 
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384], 
  },

  webpack: (config, { isServer }) => {
    config.watchOptions = {
      ignored: ['**/node_modules/**', '**/.next/**'],
      poll: false,
    };   
    if (isServer) {
      config.plugins.push({
        apply: (compiler) => {
          compiler.hooks.afterEmit.tap('FixAuthAndRouteTypes', () => {
            fixAuthBuild();
            fixRouteTypes();
          });
        },
      });
    }

    return config;
  },
  experimental: {
    optimizeCss: true,
    serverActions: {
      bodySizeLimit: '2mb',
    },
    optimizePackageImports: ['react-icons', 'lodash', 'date-fns'],
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production'
  },
} 

module.exports = nextConfig;