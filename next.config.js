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

const nextConfig = {
  // Core configurations
  serverExternalPackages: ['@prisma/client', 'mongoose'],
  poweredByHeader: false,
  reactStrictMode: true,
  swcMinify: isProd,
  
  // Locale configuration
  i18n: {
    locales: ['ar'],
    defaultLocale: 'ar',
    localeDetection: true,
  },
    // Image optimization
  images: {
    domains: ['via.placeholder.com', 'placehold.co'],
    formats: ['image/avif', 'image/webp'], // Always use modern formats
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840], // Responsive image sizes
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384], // Additional image sizes
    minimumCacheTTL: 60 * 60 * 24 * 7, // Cache images for 7 days
  },
  
  // Performance optimizations
  poweredByHeader: false, // Remove X-Powered-By header for security
  compress: true, // Enable compression
  
  // Simplified webpack configuration
  webpack: (config, { isServer }) => {
    config.watchOptions = {
      ignored: ['**/node_modules/**', '**/.next/**'],
      poll: false,
    };

    // Run after webpack build completes
    if (isServer) {
      config.plugins.push({
        apply: (compiler) => {
          compiler.hooks.afterEmit.tap('FixRouteTypes', fixRouteTypes);
        },
      });
    }
    
    return config;
  },

  // Environment variables
  env: {
    NEXT_PUBLIC_VERCEL_ENV: process.env.VERCEL_ENV || 'development',
    FRONTEND_ONLY: isFrontendOnly,
  },
  
  // Experimental features
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
    optimizeCss: isProd,
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