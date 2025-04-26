/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  allowedDevOrigins: [
    'http://localhost:3000',
    'http://192.168.1.8:3000',
  ],
  // Add these options to optimize performance
  swcMinify: true,  // Use SWC for minification (faster than Terser)
  compiler: {
    // Remove console logs in production
    removeConsole: process.env.NODE_ENV === 'production',
  },
  images: {
    domains: ['images.unsplash.com'], // Add any domains you use for images
  },
};

module.exports = nextConfig;
