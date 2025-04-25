// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  allowedDevOrigins: [
    'http://localhost:3000',
    'http://192.168.1.8:3000'
  ],
  // Add more config options as needed
};

module.exports = nextConfig;
