/**
 * vercel-postbuild.js
 * 
 * This script runs after the build process on Vercel to ensure that 
 * the Prisma client has been properly generated and is available.
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔍 Running Vercel postbuild checks...');

// Function to check if file exists
function fileExists(filePath) {
  try {
    return fs.existsSync(filePath);
  } catch (error) {
    return false;
  }
}

// Check if we're running in Vercel
const isVercel = process.env.VERCEL === '1';
console.log(`Running in Vercel environment: ${isVercel ? 'Yes' : 'No'}`);

// Check if Prisma client exists
const nodeModulesPath = path.join(process.cwd(), 'node_modules', '.prisma', 'client');
const prismaClientExists = fileExists(nodeModulesPath);
console.log(`Prisma client directory exists: ${prismaClientExists ? 'Yes' : 'No'}`);

if (isVercel) {
  // Check if environment variables are set
  console.log('Checking environment variables:');
  console.log(`- DATABASE_URL: ${process.env.DATABASE_URL ? 'Set' : 'Not set'}`);
  console.log(`- NEXTAUTH_SECRET: ${process.env.NEXTAUTH_SECRET ? 'Set' : 'Not set'}`);
  console.log(`- NEXTAUTH_URL: ${process.env.NEXTAUTH_URL ? 'Set' : 'Not set'}`);
  
  // Force regenerate Prisma client if we're on Vercel
  try {
    console.log('🔄 Force regenerating Prisma Client for Vercel...');
    execSync('npx prisma generate --schema=./prisma/schema.prisma', { 
      stdio: 'inherit',
      env: { ...process.env, PRISMA_GENERATE_DATAPROXY: 'false' }
    });
    console.log('✅ Prisma Client regenerated successfully');
  } catch (error) {
    console.error('⚠️ Failed to regenerate Prisma Client:', error.message);
    console.error('Build will continue, but application may fail at runtime');
  }
}

console.log('✅ Vercel postbuild completed');
