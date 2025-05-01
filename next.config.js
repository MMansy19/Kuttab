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
  }
}

module.exports = nextConfig;