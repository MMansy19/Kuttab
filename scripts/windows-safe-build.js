#!/usr/bin/env node
/**
 * windows-safe-build.js
 * 
 * This script runs the Next.js build with special precautions to avoid 
 * Windows-specific EPERM errors during the build process.
 */
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// ANSI colors for output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  red: '\x1b[31m',
};

console.log(`${colors.bright}${colors.blue}🔨 Starting Windows-safe build process...${colors.reset}`);

// Step 1: Generate Prisma client
console.log(`${colors.yellow}📊 Generating Prisma client...${colors.reset}`);
try {
  execSync('npx prisma generate', { stdio: 'inherit' });
  console.log(`${colors.green}✅ Prisma client generated successfully${colors.reset}`);
} catch (error) {
  console.error(`${colors.red}❌ Failed to generate Prisma client: ${error.message}${colors.reset}`);
  process.exit(1);
}

// Step 2: Create a build-specific Next.js config
console.log(`${colors.yellow}🔧 Creating build-specific Next.js config...${colors.reset}`);
try {
  execSync('node scripts/create-build-config.js', { stdio: 'inherit' });
  console.log(`${colors.green}✅ Build-specific config created${colors.reset}`);
} catch (error) {
  console.error(`${colors.red}❌ Failed to create build config: ${error.message}${colors.reset}`);
  process.exit(1);
}

// Step 3: Run Next.js build with the custom config
console.log(`${colors.yellow}🏗️ Building Next.js application with custom config...${colors.reset}`);
try {
  // Use cross-env to set environment variables for Windows compatibility
  execSync('npx cross-env NODE_OPTIONS="--max-old-space-size=4096" NEXT_TELEMETRY_DISABLED=1 next build', {
    stdio: 'inherit',
    env: {
      ...process.env,
      NEXT_CONFIG_BUILD: 'true',
    },
  });
  console.log(`${colors.green}✅ Build completed successfully${colors.reset}`);
} catch (error) {
  console.error(`${colors.red}❌ Build failed: ${error.message}${colors.reset}`);
  process.exit(1);
}

// Cleanup temporary files
console.log(`${colors.yellow}🧹 Cleaning up temporary files...${colors.reset}`);
const tempConfigPath = path.join(__dirname, '..', 'next.config.build-temp.js');
if (fs.existsSync(tempConfigPath)) {
  fs.unlinkSync(tempConfigPath);
}

console.log(`${colors.bright}${colors.green}✨ Windows-safe build process completed!${colors.reset}`);
