#!/usr/bin/env node

/**
 * prepare-vercel.js
 * 
 * This script prepares the environment for Vercel deployment by:
 * 1. Checking for required environment variables
 * 2. Logging deployment details
 * 3. Running database migrations if needed
 * 
 * Run this script during the build process to ensure smooth deployment.
 */

const { execSync } = require('child_process');

console.log('🚀 Preparing Vercel deployment...');

// Check if running in Vercel environment
const isVercel = process.env.VERCEL === '1';

if (isVercel) {
  console.log('✅ Running in Vercel environment');
  
  // Always ensure Prisma client is generated
  try {
    console.log('📦 Generating Prisma Client for Vercel deployment...');
    execSync('npx prisma generate', { stdio: 'inherit' });
    console.log('✅ Prisma Client generated successfully');
  } catch (error) {
    console.error('❌ Failed to generate Prisma Client:', error.message);
    console.error('This might cause issues with database access!');
  }
  
  // Check for required environment variables
  const requiredEnvVars = [
    'DATABASE_URL',
    'NEXTAUTH_SECRET',
    'NEXTAUTH_URL'
  ];
  
  const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0) {
    console.error('❌ Missing required environment variables:');
    missingVars.forEach(varName => console.error(`   - ${varName}`));
    console.error('Please add these in your Vercel project settings.');
    
    // Don't fail the build, instead log a warning
    console.warn('⚠️ Deployment may fail or behave incorrectly without these variables.');
  } else {
    console.log('✅ All required environment variables are present');
  }
  
  // Run Prisma migrations (optional, can be disabled by setting SKIP_MIGRATION=true)
  if (process.env.SKIP_MIGRATION !== 'true' && process.env.DATABASE_URL) {
    try {
      console.log('🔄 Running database migrations...');
      execSync('npx prisma migrate deploy', { stdio: 'inherit' });
      console.log('✅ Database migrations completed successfully');
    } catch (error) {
      console.error('❌ Database migration failed:', error.message);
      console.warn('⚠️ Continuing with deployment despite migration failure');
    }
  } else {
    console.log('⏭️ Skipping database migrations');
  }
}

console.log('✅ Vercel preparation completed');
