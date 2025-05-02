// Script to validate Vercel deployment configuration
const fs = require('fs');
const path = require('path');

// Critical environment variables that must be set for proper deployment
const CRITICAL_ENV_VARS = [
  'DATABASE_URL', 
  'NEXTAUTH_SECRET',
];

function checkConfiguration() {
  console.log('🔍 Validating Vercel deployment configuration...');
  
  // Check if we're in Vercel environment
  const isVercel = process.env.VERCEL === '1';
  console.log(`Running in Vercel environment: ${isVercel ? 'Yes' : 'No (this is expected during local validation)'}`);
  
  // Check environment variables
  console.log('\n🔑 Checking environment variables:');
  let missingVars = [];
  
  CRITICAL_ENV_VARS.forEach(envVar => {
    if (!process.env[envVar]) {
      missingVars.push(envVar);
      console.log(`❌ Missing critical environment variable: ${envVar}`);
    } else {
      // Don't log the actual values for security
      console.log(`✅ ${envVar} is set`);
    }
  });
  
  // Check for PostgreSQL database URL in production
  if (process.env.DATABASE_URL && !process.env.DATABASE_URL.startsWith('postgresql') && process.env.NODE_ENV === 'production') {
    console.warn('⚠️ Warning: DATABASE_URL is set but does not appear to be a PostgreSQL connection string');
    console.warn('   For Vercel deployment, you must use a PostgreSQL database');
  }
  
  // Check for files needed for deployment
  console.log('\n📁 Checking for required deployment files:');
  const requiredFiles = [
    { path: 'vercel.json', required: true },
    { path: 'next.config.js', required: true },
    { path: 'prisma/schema.prisma', required: true },
    { path: 'prisma/migrations/migration_lock.toml', required: true }
  ];
  
  requiredFiles.forEach(file => {
    const exists = fs.existsSync(path.join(process.cwd(), file.path));
    if (exists) {
      console.log(`✅ ${file.path} exists`);
    } else if (file.required) {
      console.log(`❌ Missing required file: ${file.path}`);
    } else {
      console.log(`⚠️ Optional file not found: ${file.path}`);
    }
  });
  
  // Prisma configuration check
  try {
    const schemaContent = fs.readFileSync(path.join(process.cwd(), 'prisma/schema.prisma'), 'utf8');
    if (schemaContent.includes('provider = "postgresql"')) {
      console.log('✅ Prisma schema is configured for PostgreSQL');
    } else if (schemaContent.includes('provider = "sqlite"')) {
      console.log('❌ Error: Prisma schema is configured for SQLite, which is not supported on Vercel');
    } else {
      console.log('⚠️ Warning: Could not determine Prisma provider from schema file');
    }
  } catch (error) {
    console.log('❌ Error reading Prisma schema:', error.message);
  }
  
  // Summary
  if (missingVars.length > 0) {
    console.log('\n❌ Validation failed: Missing critical environment variables');
    console.log('   You must set these in the Vercel dashboard before deploying.');
  } else {
    console.log('\n✅ Configuration appears valid for Vercel deployment');
    console.log('   Ensure you have set up a PostgreSQL database and configured all environment variables in the Vercel dashboard.');
  }
}

// Run the validation
checkConfiguration();