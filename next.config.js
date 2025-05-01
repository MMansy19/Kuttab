/** @type {import('next').NextConfig} */
const nextConfig = {
  swcMinify: true,
  poweredByHeader: false,
  reactStrictMode: true,
  
  // Keep essential experimental features but remove problematic ones
  experimental: {
    serverComponentsExternalPackages: ['@prisma/client']
  },
  
  // Simplified webpack configuration
  webpack: (config) => {
    config.watchOptions = {
      ignored: ['**/node_modules/**', '**/.next/**'],
      poll: false,
    };
    
    return config;
  }
}

module.exports = nextConfig;