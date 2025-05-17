/**
 * Next.js Configuration
 * Consolidated configuration file that handles both development and production builds
 * @type {import('next').NextConfig}
 */
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Apply permission error fixes before anything else
require('./scripts/fix-permission-errors.js');

// Constants
const isProd = process.env.NODE_ENV === 'production';
const isFrontendOnly = process.env.NEXT_PUBLIC_FRONTEND_ONLY === 'true' || 
  (isProd && (!process.env.DATABASE_URL || process.env.DATABASE_URL === 'frontend-only'));

// List of paths to exclude from glob scanning to avoid permission errors
const excludedPaths = [
  '**/Application Data/**',
  '**/AppData/**',
  '**/node_modules/.cache/**',
  '**/node_modules/.bin/**',
  'C:/Users/mahmo/Application Data/**',
  'C:/Users/mahmo/Cookies',
  'C:/Users/mahmo/Cookies/**',
  'C:/Users/mahmo/Application Data',
  'C:\\Users\\mahmo\\Application Data',
  'C:\\Users\\mahmo\\Application Data/**',
  'C:\\Users\\mahmo\\Cookies',
];

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
  // Core configurations
  serverExternalPackages: ['@prisma/client', 'mongoose'],
  poweredByHeader: false,
  reactStrictMode: true,  // Exclude problematic paths to prevent permission errors
  onDemandEntries: {
    maxInactiveAge: 60 * 60 * 1000,
    pagesBufferLength: 2
  },  
  // Webpack configuration to exclude problematic paths
  webpack: (config, { isServer }) => {
    // Explicitly define ignored paths for webpack to prevent EPERM errors
    config.watchOptions = {
      ignored: [
        '**/node_modules/**', 
        '**/.next/**',
        '**/Application Data/**',
        '**/AppData/**',
        'C:/Users/mahmo/Application Data/**',
        'C:\\Users\\mahmo\\Application Data/**',
        ...excludedPaths
      ],
      aggregateTimeout: 300,
      poll: 1000,
    };
    
    // Add EPERM error handling to webpack
    if (!config.plugins) config.plugins = [];
    config.plugins.push({
      apply: (compiler) => {
        // Handle errors during compilation
        compiler.hooks.done.tap('HandleErrors', stats => {
          if (stats.hasErrors()) {
            const info = stats.toJson();
            const errors = info.errors || [];
            
            // Filter out EPERM errors to prevent build failures
            const criticalErrors = errors.filter(error => {
              return !(error.message && 
                      (error.message.includes('EPERM') || 
                       error.message.includes('operation not permitted')));
            });
            
            if (criticalErrors.length === 0 && errors.length > 0) {
              console.log('⚠️ Ignoring non-critical EPERM errors during build');
            }
          }
        });
      }
    });
    
    // Run after webpack build completes
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
    // Note: swcMinify is now enabled by default in Next.js 13+
  // and has been removed from the configuration options
  
  // Security headers for SEO and protection
  async headers() {
    return [
      {
        // Apply these headers to all routes
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
  // See: https://nextjs.org/docs/app/building-your-application/routing/internationalization
  // Image optimization
  images: {
    domains: ['via.placeholder.com', 'placehold.co'],
    formats: ['image/avif', 'image/webp'], // Always use modern formats
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840], // Responsive image sizes
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384], // Additional image sizes
    minimumCacheTTL: 60 * 60 * 24 * 7, // Cache images for 7 days
  },
    // Performance optimizations
  // Note: poweredByHeader is already set above
  compress: true, // Enable compression
  
  // Environment variables
  env: {
    NEXT_PUBLIC_VERCEL_ENV: process.env.VERCEL_ENV || 'development',
    FRONTEND_ONLY: isFrontendOnly ? 'true' : 'false', // Convert boolean to string
  },
  // Experimental features
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
  
  // Browserslist should be defined in package.json or .browserslistrc, not here
};

module.exports = nextConfig;