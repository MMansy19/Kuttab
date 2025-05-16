/**
 * Next.js Configuration
 * Consolidated configuration file that handles both development and production builds
 * @type {import('next').NextConfig}
 */
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Constants
const isDev = process.env.NODE_ENV === 'development';
const isProd = process.env.NODE_ENV === 'production';
const isVercel = process.env.VERCEL === '1';
const isFrontendOnly = process.env.NEXT_PUBLIC_FRONTEND_ONLY === 'true' || 
  (isProd && (!process.env.DATABASE_URL || process.env.DATABASE_URL === 'frontend-only'));

// Function to patch generated route type files
function fixRouteTypes() {
  try {
    console.log('🔧 Fixing route handler types...');
    
    // Only run if the types directory exists
    if (fs.existsSync(path.join(process.cwd(), '.next', 'types'))) {
      // Check if our fix script exists
      if (fs.existsSync(path.join(process.cwd(), 'scripts', 'fix-route-types.js'))) {
        console.log('Running type fix script...');
        execSync('node scripts/fix-route-types.js', { stdio: 'inherit' });
      } else {
        console.log('Type fix script not found, skipping');
      }
    }
  } catch (error) {
    console.warn('⚠️ Error fixing route types:', error.message);
  }
}

// Function to fix auth build issues
function fixAuthBuild() {
  try {
    console.log('🔧 Applying auth build fixes...');
    
    // Check if our auth fix script exists
    if (fs.existsSync(path.join(process.cwd(), 'scripts', 'build', 'fix-auth-build.js'))) {
      console.log('Running auth fix script...');
      execSync('node scripts/build/fix-auth-build.js --build', { stdio: 'inherit' });
    } else {
      console.log('Auth fix script not found, skipping');
    }
  } catch (error) {
    console.warn('⚠️ Error fixing auth build:', error.message);
  }
}

const nextConfig = {
  // Core optimizations
  reactStrictMode: true,
  compress: true,
  poweredByHeader: false,

  // Image optimization
  images: {
    domains: [],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 1080, 1200, 1920],
    imageSizes: [16, 32, 64, 96, 128, 256],
    minimumCacheTTL: 86400, // 1 day
  },

  // Security headers
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

  // Locale configuration - removed as it's not supported in App Router
  // Use the app/[locale] directory structure instead
  // See: https://nextjs.org/docs/app/building-your-application/routing/internationalization  // Image optimization
  images: {
    domains: ['via.placeholder.com', 'placehold.co'],
    formats: ['image/avif', 'image/webp'], // Always use modern formats
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840], // Responsive image sizes
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384], // Additional image sizes
    minimumCacheTTL: 60 * 60 * 24 * 7, // Cache images for 7 days
    dangerouslyAllowSVG: true, // Allow SVG files (for logos, icons)
    contentDispositionType: 'attachment', // For better caching
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;", // Add CSP for images
  },
  
  // Performance optimizations
  // Note: poweredByHeader is already set above
  compress: true, // Enable compression
  
  // Simplified webpack configuration
  webpack: (config, { isServer }) => {
    config.watchOptions = {
      ignored: ['**/node_modules/**', '**/.next/**'],
      poll: false,
    };    // Run after webpack build completes
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
  // Environment variables
  env: {
    NEXT_PUBLIC_VERCEL_ENV: process.env.VERCEL_ENV || 'development',
    FRONTEND_ONLY: isFrontendOnly ? 'true' : 'false', // Convert boolean to string
  },
  // Experimental features
  experimental: {
    modern: true,
    optimizePackageImports: ['react-icons'],
    optimizeCss: true,
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

  // Configure Browserslist to target modern browsers only
  browserslist: [
    // Target browsers that support ES6 modules natively
    'last 2 Chrome versions',
    'last 2 Firefox versions',
    'last 2 Safari versions',
    'last 2 Edge versions',
    'not IE 11',
    'not op_mini all'
  ],
  
  // Webpack optimizations
  webpack: (config, { isServer }) => {
    // Split react-icons into separate chunks
    config.optimization.splitChunks = {
      ...config.optimization.splitChunks,
      cacheGroups: {
        reactIcons: {
          test: /[\\/]node_modules[\\/]@react-icons[\\/]/,
          name: 'react-icons',
          chunks: 'all',
          priority: 20,
        },
      },
    };

    return config;
  },
};

module.exports = nextConfig;