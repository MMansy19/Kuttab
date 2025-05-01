
const originalConfig = require('./next.config.js');

module.exports = {
  ...originalConfig,
  // Add any build-specific configurations here
  swcMinify: true,
  poweredByHeader: false,
  reactStrictMode: true,
};
