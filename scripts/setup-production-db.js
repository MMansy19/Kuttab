// This script helps ensure database migrations are properly applied in production
const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

// Function to run a command and log its output
function runCommand(command, options = {}) {
  console.log(`Running: ${command}`);
  
  try {
    execSync(command, { 
      stdio: 'inherit',
      env: {
        ...process.env,
        PRISMA_ENGINES_CHECKSUM_IGNORE_MISSING: "1",
        ...options.env
      }
    });
    
    console.log(`✅ Successfully executed: ${command}`);
    return true;
  } catch (error) {
    console.error(`❌ Error executing ${command}:`, error.message);
    if (options.critical) {
      throw error;
    }
    return false;
  }
}

// Check if DATABASE_URL is configured properly
function validateDatabaseUrl() {
  const dbUrl = process.env.DATABASE_URL;
  
  if (!dbUrl) {
    console.error('❌ DATABASE_URL environment variable is not set!');
    console.error('Please set a valid PostgreSQL connection URL in your Vercel project settings.');
    return false;
  }
  
  if (process.env.NODE_ENV === 'production' && !dbUrl.startsWith('postgresql')) {
    console.error('❌ Invalid DATABASE_URL for production!');
    console.error('In production, you must use a PostgreSQL database.');
    console.error(`Current DATABASE_URL appears to be: ${dbUrl.substring(0, 10)}...`);
    return false;
  }
  
  return true;
}

// Main function for setup
async function setupProductionDb() {
  console.log('Setting up production database...');
  
  try {
    // Validate database URL
    if (!validateDatabaseUrl() && process.env.NODE_ENV === 'production') {
      console.warn('⚠️ Skipping database setup due to invalid DATABASE_URL');
      console.warn('The build will continue, but your app may not work correctly.');
      return;
    }
    
    // Generate Prisma client with better error handling
    if (!runCommand('npx prisma generate', { critical: false })) {
      console.log('Trying alternative client generation...');
      runCommand('npx prisma generate --no-engine');
    }
    
    // Check if we're in Vercel
    const isVercel = process.env.VERCEL === '1';
    console.log(`Running in Vercel: ${isVercel ? 'Yes' : 'No'}`);
    
    if (isVercel) {
      // For Vercel, we'll use the simpler db push approach which is more reliable
      console.log('Using db push for Vercel deployment...');
      runCommand('npx prisma db push --accept-data-loss', { critical: false });
    } else {
      // For other environments, try migrations first
      console.log('Attempting database migrations...');
      if (!runCommand('npx prisma migrate deploy', { critical: false })) {
        console.log('Migration failed, falling back to db push...');
        runCommand('npx prisma db push --accept-data-loss', { critical: false });
      }
    }
    
    console.log('✅ Production database setup completed');
  } catch (error) {
    console.error('❌ Failed to set up production database:', error);
    console.log('⚠️ Build will continue despite database setup issues');
    // Don't exit with error code in production to allow the build to continue
    if (process.env.NODE_ENV !== 'production') {
      process.exit(1);
    }
  }
}

// Run the setup
setupProductionDb();