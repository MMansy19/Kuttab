/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  allowedDevOrigins: [
    'http://localhost:3000',
    'http://192.168.1.8:3000',
  ],
  // Add these options to optimize performance
  compiler: {
    // Remove console logs in production
    removeConsole: process.env.NODE_ENV === 'production',
  },
  images: {
    domains: ['images.unsplash.com', 'img.icons8.com'], // Added icons8 domain
  },
  // Add webpack configuration to exclude problematic directories
  webpack: (config, { isServer }) => {
    // Exclude the Cookies directory from being processed
    config.watchOptions = {
      ...config.watchOptions,
      ignored: ['**/.git/**', '**/node_modules/**', '**/Cookies/**', 'C:\\Users\\mahmo\\Cookies/**']
    };
    
    return config;
  },
};

module.exports = nextConfig;
