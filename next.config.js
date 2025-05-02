/** @type {import('next').NextConfig} */
const nextConfig = {
  // Using updated property names for Next.js 15.3.1
  serverExternalPackages: ['@prisma/client'],
  
  // This property is now implicit in Next.js 15
  // swcMinify: true,
  
  poweredByHeader: false,
  reactStrictMode: true,
  
  // Simplified webpack configuration
  webpack: (config) => {
    config.watchOptions = {
      ignored: ['**/node_modules/**', '**/.next/**'],
      poll: false,
    };
    
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
}

module.exports = nextConfig;