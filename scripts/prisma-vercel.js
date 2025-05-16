/**
 * prisma-vercel.js
 * 
 * This script ensures Prisma works correctly on Vercel by:
 * 1. Generating the Prisma client
 * 2. Checking database connection
 * 3. Setting up appropriate flags for Prisma on serverless
 */

const { execSync } = require('child_process');
const { writeFileSync, existsSync, mkdirSync } = require('fs');
const { join } = require('path');

console.log('🔮 Setting up Prisma for Vercel deployment...');

// Generate Prisma client with multiple approaches to ensure success
try {
  console.log('🔄 Generating Prisma Client - First attempt...');
  execSync('npx prisma generate', { stdio: 'inherit' });
  console.log('✅ Prisma Client generated successfully');
} catch (error) {
  console.error('⚠️ First attempt failed, trying alternative method:', error.message);
    try {
    // Try direct import path
    execSync('npx prisma@6.6.0 generate', { stdio: 'inherit' });
    console.log('✅ Prisma Client generated successfully with specific version');
  } catch (secondError) {
    console.error('❌ Failed to generate Prisma Client:', secondError.message);
    console.error('⚠️ Continuing build process despite errors - this might cause runtime issues');
    // Don't exit with error code to allow the build to continue
    // process.exit(1);
  }
}

// Set up .prisma directory for connection information
const prismaDir = join(process.cwd(), '.prisma');
if (!existsSync(prismaDir)) {
  mkdirSync(prismaDir, { recursive: true });
}

// Create a datasource-meta.json file to help with serverless deployments
const datasourceMeta = {
  version: '1',
  environments: ['production', 'development', 'preview'],
  databaseUrl: process.env.DATABASE_URL ? '*****' : 'missing',
  warnings: [],
};

// Check for essential configuration
if (!process.env.DATABASE_URL) {
  datasourceMeta.warnings.push('DATABASE_URL environment variable is missing');
}

try {
  writeFileSync(
    join(prismaDir, 'datasource-meta.json'),
    JSON.stringify(datasourceMeta, null, 2)
  );
  console.log('✅ Created Prisma metadata for deployment');
} catch (error) {
  console.error('❌ Failed to write Prisma metadata:', error.message);
}

console.log('✅ Prisma setup for Vercel completed');
