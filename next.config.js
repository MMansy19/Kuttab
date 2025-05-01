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
    domains: ['images.unsplash.com', 'img.icons8.com'],
  },
  
  webpack: (config) => {
    // Exclude problematic directories from being processed
    config.watchOptions = {
      ...config.watchOptions,
      ignored: [
        '**/.git/**', 
        '**/node_modules/**', 
        '**/Cookies/**', 
        '**/.next/**',
        '**/AppData/**',
        '**/Application Data/**',
        '**/Local Settings/**',
        '**/NetHood/**',
        '**/PrintHood/**',
        '**/Recent/**',
        '**/Start Menu/**',
        '**/Templates/**',
        '**/SendTo/**',
        'C:\\Users\\mahmo\\Cookies/**',
        'C:\\Users\\mahmo\\Application Data/**',
      ]
    };
    
    return config;
  },
  
  // Set production-only options
  productionBrowserSourceMaps: false,
};

module.exports = nextConfig;
