const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const os = require('os');

console.log(`🚀 Preparing build environment for ${os.platform()}...`);

// Paths
const nextDir = path.join(__dirname, '.next');
const nextTempDir = path.join(__dirname, '.next-temp');
const buildOutputDir = path.join(__dirname, 'build-output');
const cacheDir = path.join(__dirname, 'node_modules', '.cache');

// Clean build directories
console.log('🧹 Cleaning build directories...');
[nextDir, nextTempDir, buildOutputDir].forEach(dir => {
  if (fs.existsSync(dir)) {
    console.log(`  ✓ Deleted ${path.relative(__dirname, dir)}`);
    fs.rmSync(dir, { recursive: true, force: true });
  } else {
    console.log(`  - ${path.relative(__dirname, dir)} not found`);
  }
});

// Clean cache directory
if (fs.existsSync(cacheDir)) {
  fs.rmSync(cacheDir, { recursive: true, force: true });
  console.log(`  ✓ Deleted ${path.relative(__dirname, cacheDir)}`);
}

// Create temporary Next.js build config
const nextConfigContent = `
const originalConfig = require('./next.config.js');

module.exports = {
  ...originalConfig,
  // Add any build-specific configurations here
  swcMinify: true,
  poweredByHeader: false,
  reactStrictMode: true,
};
`;

fs.writeFileSync(path.join(__dirname, 'next.config.build.js'), nextConfigContent);
console.log('✓ Created temporary Next.js build config');

// Generate Prisma client safely
console.log('🔄 Generating Prisma client...');
try {
  // Use our safe Prisma script instead of direct generation
  require('./prisma-fix');
} catch (error) {
  console.error(`❌ Failed to generate Prisma client: ${error.message}`);
  process.exit(1);
}