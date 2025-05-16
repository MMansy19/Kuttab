/**
 * clean-prisma.js
 * 
 * This script cleans up Prisma-related files before a build to ensure consistent versions.
 */
const { execSync } = require('child_process');
const { existsSync, rmSync } = require('fs');
const path = require('path');

console.log('🧹 Cleaning up Prisma-related files before build...');

// Clean up Prisma cache
const prismaLocations = [
  path.join(process.cwd(), 'node_modules', '.prisma'),
  path.join(process.cwd(), 'node_modules', '@prisma'),
  path.join(process.cwd(), '.prisma')
];

prismaLocations.forEach(location => {
  if (existsSync(location)) {
    console.log(`Removing ${location}...`);
    try {
      rmSync(location, { recursive: true, force: true });
      console.log(`✅ Successfully removed ${location}`);
    } catch (error) {
      console.error(`❌ Failed to remove ${location}:`, error.message);
    }
  } else {
    console.log(`Location ${location} does not exist, skipping.`);
  }
});

// Reinstall Prisma with specific version
console.log('📦 Reinstalling Prisma with version 6.6.0...');
try {
  execSync('npm i prisma@6.6.0 @prisma/client@6.6.0 --save-exact', { stdio: 'inherit' });
  console.log('✅ Successfully reinstalled Prisma packages');
} catch (error) {
  console.error('❌ Failed to reinstall Prisma packages:', error.message);
}

console.log('🔄 Prisma cleanup complete!');
