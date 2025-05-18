/**
 * Next.js Configuration
 * Consolidated configuration file with fixes for EPERM errors and build optimizations
 * @type {import('next').NextConfig}
 */
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Apply system directory protection before anything else
try {
  require('./scripts/win-directory-protection.js');
} catch (error) {
  console.warn('⚠️ Failed to apply system directory protection:', error.message);
}

// Constants
const isProd = process.env.NODE_ENV === 'production';
const isFrontendOnly = process.env.NEXT_PUBLIC_FRONTEND_ONLY === 'true' ||
  (isProd && (!process.env.DATABASE_URL || process.env.DATABASE_URL === 'frontend-only'));

// Enhanced list of paths to exclude from glob scanning
const excludedPaths = [
  // System directories
  '**/Application Data/**',
  '**/AppData/**',
  '**/Cookies/**',
  '**/Local Settings/**',
  '**/Temp/**',
  '**/Windows/**',

  // User directories - specific to mahmo
  'C:/Users/mahmo/Application Data/**',
  'C:/Users/mahmo/Cookies/**',
  'C:/Users/mahmo/Local Settings/**',
  'C:\\Users\\mahmo\\Application Data/**',
  'C:\\Users\\mahmo\\Cookies/**',
  'C:\\Users\\mahmo\\Local Settings/**',

  // Exact matches for problematic directories
  'C:/Users/mahmo/Application Data',
  'C:/Users/mahmo/Cookies',
  'C:\\Users\\mahmo\\Application Data',
  'C:\\Users\\mahmo\\Cookies',

  // Project directories
  '**/node_modules/**',
  '**/.next/**',
  '**/.cache/**',
  '**/.git/**',
  '**/.vscode/**',
  '**/.*' // All dotfiles
];

// Function to patch generated route type files
function fixRouteTypes() {
  try {
    console.log('🔧 Fixing route handler types...');

    if (fs.existsSync(path.join(process.cwd(), '.next', 'types'))) {
      if (fs.existsSync(path.join(process.cwd(), 'scripts', 'fix-route-types.js'))) {
        console.log('Running type fix script...');
        execSync('node scripts/fix-route-types.js', { stdio: 'inherit' });
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

    if (fs.existsSync(path.join(process.cwd(), 'scripts', 'build', 'fix-auth-build.js'))) {
      console.log('Running auth fix script...');
      execSync('node scripts/build/fix-auth-build.js --build', { stdio: 'inherit' });
    }
  } catch (error) {
    console.warn('⚠️ Error fixing auth build:', error.message);
  }
}

// Custom glob handler to prevent system directory scanning
function createSafeGlob() {
  try {
    const glob = require('glob');
    const { promisify } = require('util');
    
    // Check if glob is a function or object with sync method
    if (typeof glob === 'function') {
      const originalGlob = promisify(glob);
      
      return async function safeGlob(pattern, options) {
        const blockedPatterns = [
          /Application Data/i,
          /Cookies/i,
          /AppData/i,
          /Local Settings/i,
          /Windows/i,
          /Program Files/i
        ];

        if (blockedPatterns.some(regex => regex.test(pattern))) {
          return [];
        }

        // Add additional safety checks
        if (typeof pattern === 'string' && pattern.includes('..')) {
          const resolved = path.resolve(pattern);
          if (!resolved.startsWith(process.cwd())) {
            return [];
          }
        }

        try {
          return await originalGlob(pattern, options);
        } catch (error) {
          if (error.code === 'EPERM') {
            console.warn(`⚠️ EPERM error in glob (skipping): ${error.path || pattern}`);
            return [];
          }
          throw error;
        }
      };
    } else if (glob && typeof glob.sync === 'function') {
      // Handle newer glob versions where it's an object
      return async function safeGlob(pattern, options) {
        const blockedPatterns = [
          /Application Data/i,
          /Cookies/i,
          /AppData/i,
          /Local Settings/i,
          /Windows/i,
          /Program Files/i
        ];

        if (blockedPatterns.some(regex => regex.test(pattern))) {
          return [];
        }

        // Add additional safety checks
        if (typeof pattern === 'string' && pattern.includes('..')) {
          const resolved = path.resolve(pattern);
          if (!resolved.startsWith(process.cwd())) {
            return [];
          }
        }

        try {
          // Convert sync to async with Promise
          return await Promise.resolve(glob.sync(pattern, options));
        } catch (error) {
          if (error.code === 'EPERM') {
            console.warn(`⚠️ EPERM error in glob (skipping): ${error.path || pattern}`);
            return [];
          }
          throw error;
        }
      };
    } else {
      // Fallback if we can't properly wrap glob
      console.warn('⚠️ Unable to create safe glob wrapper - using default implementation');
      return null;
    }
  } catch (error) {
    console.warn('⚠️ Error creating safe glob handler:', error.message);
    return null;
  }
}

const nextConfig = {
  // Core configurations
  serverExternalPackages: ['@prisma/client', 'mongoose'],
  poweredByHeader: false,
  reactStrictMode: true,
  output: 'standalone',

  // File system routing restrictions
  onDemandEntries: {
    maxInactiveAge: 60 * 60 * 1000,
    pagesBufferLength: 2
  },
  // Webpack configuration with enhanced security
  webpack: (config, { isServer }) => {
    // Enhanced watch options
    config.watchOptions = {
      ignored: excludedPaths,
      aggregateTimeout: 200,
      poll: 1000,
      followSymlinks: false
    };

    // Add null-loader for system files
    config.module.rules.push({
      test: /(Application Data|Cookies|Local Settings|Windows|Program Files)/i,
      loader: 'null-loader'
    });

    // Add EPERM error handling to webpack
    if (!config.plugins) config.plugins = [];
    config.plugins.push({
      apply: (compiler) => {
        // Handle errors during compilation
        compiler.hooks.done.tap('HandleEPERMErrors', stats => {
          if (stats.hasErrors()) {
            const info = stats.toJson();
            const errors = info.errors || [];
            
            // Log EPERM errors but continue build
            errors.forEach(error => {
              if (error.message && (error.message.includes('EPERM') || error.message.includes('operation not permitted'))) {
                console.warn(`⚠️ Ignoring EPERM error: ${error.message.split('\n')[0]}`);
              }
            });
          }
        });
      }
    });

    // Add safety checks for file resolution
    config.resolve.unsafeCache = false;
    config.snapshot = {
      managedPaths: [/^(.+?[\\/]node_modules[\\/])/],
      immutablePaths: [/^(.+?[\\/]public[\\/])/]
    };

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
          }
        ],
      }
    ];
  },

  // Image optimization
  images: {
    domains: ['via.placeholder.com', 'placehold.co'],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 7,
  },

  // Environment variables
  env: {
    NEXT_PUBLIC_VERCEL_ENV: process.env.VERCEL_ENV || 'development',
    FRONTEND_ONLY: isFrontendOnly ? 'true' : 'false',
  },
  // Experimental features with enhanced security
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
    optimizeCss: true,
    optimizePackageImports: ['react-icons', 'lodash', 'date-fns'],
    webpackBuildWorker: true,
    cpus: 1
  },

  // Production-specific compiler options
  compiler: isProd ? {
    removeConsole: {
      exclude: ['error', 'warn'],
    },
  } : {},
};

module.exports = nextConfig;