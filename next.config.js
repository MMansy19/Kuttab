/** @type {import('next').NextConfig} */
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

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
  // Using updated property names for Next.js 
  serverExternalPackages: ['@prisma/client'],
  
  poweredByHeader: false,
  reactStrictMode: true,
  
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

  // Add proper environment variable handling
  env: {
    NEXT_PUBLIC_VERCEL_ENV: process.env.VERCEL_ENV || 'development',
  },
  
  // Enable experimental features for improved Vercel deployment
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
    optimizeCss: true,
  }
};

module.exports = nextConfig;