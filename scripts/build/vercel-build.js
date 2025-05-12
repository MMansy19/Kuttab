/**
 * Vercel Build Script
 * Handles post-build tasks specifically for Vercel deployment
 */
const { copyFileSync, mkdirSync, existsSync, readdirSync } = require('fs');
const { join, resolve } = require('path');
const { execSync } = require('child_process');

// Constants
const BASE_DIR = resolve(__dirname, '../..');

// Utility functions
const logger = {
  info: (message) => console.log(`ℹ️ ${message}`),
  success: (message) => console.log(`✅ ${message}`),
  warning: (message) => console.log(`⚠️ ${message}`),
  error: (message) => console.error(`❌ ${message}`)
};

// Function to ensure directory exists
function ensureDirectoryExists(dir) {
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
    logger.info(`Created directory: ${dir}`);
  }
}

// Function to copy directory contents recursively
function copyDirectory(source, destination) {
  // Ensure destination exists
  ensureDirectoryExists(destination);
  
  // Get all items in the source directory
  const items = readdirSync(source, { withFileTypes: true });
  
  // Process each item
  for (const item of items) {
    const sourcePath = join(source, item.name);
    const destPath = join(destination, item.name);
    
    if (item.isDirectory()) {
      // Recursively copy subdirectories
      copyDirectory(sourcePath, destPath);
    } else {
      // Copy files
      try {
        copyFileSync(sourcePath, destPath);
      } catch (err) {
        logger.error(`Failed to copy file ${sourcePath}: ${err.message}`);
      }
    }
  }
}

// Function to run next-env.d.ts workaround
function fixNextEnvTypes() {
  const nextEnvPath = join(BASE_DIR, 'next-env.d.ts');
  const customTypesDir = join(BASE_DIR, 'types');
  
  logger.info('Running Next.js types fix...');
  
  if (existsSync(nextEnvPath)) {
    logger.info(`Checking ${nextEnvPath}...`);
    
    try {
      // Copy custom type definitions if needed
      ensureDirectoryExists(join(BASE_DIR, '.vercel', 'output', 'types'));
      
      if (existsSync(customTypesDir)) {
        copyDirectory(
          customTypesDir, 
          join(BASE_DIR, '.vercel', 'output', 'types')
        );
        logger.success('Copied custom type definitions');
      }
    } catch (err) {
      logger.error(`Type fix error: ${err.message}`);
    }
  } else {
    logger.warning('next-env.d.ts not found');
  }
}

// Function to handle Prisma setup for Vercel
function setupPrismaForVercel() {
  logger.info('Setting up Prisma for Vercel...');
  
  try {
    // Ensure Prisma client is available in the output directory
    const vercelOutputDir = join(BASE_DIR, '.vercel', 'output', 'functions');
    
    if (existsSync(vercelOutputDir)) {
      logger.info('Vercel output directory exists, proceeding with Prisma setup');
      
      // Execute Prisma fix script
      try {
        require('./prisma-fix');
        logger.success('Prisma fix script executed');
      } catch (err) {
        logger.error(`Failed to run Prisma fix: ${err.message}`);
      }
    } else {
      logger.warning('Vercel output directory not found');
    }
  } catch (err) {
    logger.error(`Prisma setup error: ${err.message}`);
  }
}

// Main function to run all Vercel-specific build steps
function main() {
  logger.info('Starting Vercel-specific build tasks...');
  
  try {
    fixNextEnvTypes();
    setupPrismaForVercel();
    
    logger.success('Vercel build tasks completed successfully');
  } catch (error) {
    logger.error(`Vercel build process failed: ${error.message}`);
    process.exit(1);
  }
}

// Run the script
if (require.main === module) {
  main();
}

// Export functions for use in other scripts
module.exports = {
  ensureDirectoryExists,
  copyDirectory,
  fixNextEnvTypes,
  setupPrismaForVercel
};
