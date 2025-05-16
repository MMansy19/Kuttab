#!/usr/bin/env node

/**
 * Script to seed production database with initial data
 * Usage: node scripts/seed-production.js
 * 
 * This script requires the DATABASE_URL environment variable
 * to be set to the production database connection string
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

function checkEnvVar() {
  if (!process.env.DATABASE_URL) {
    console.error('❌ DATABASE_URL environment variable is not set.');
    console.error('Please provide your production database URL by setting the DATABASE_URL environment variable.');
    console.error('Example: DATABASE_URL=postgresql://... node scripts/seed-production.js');
    process.exit(1);
  }
}

async function main() {
  try {
    console.log('🚀 Starting production database seeding...');
    console.log('🔍 Checking for environment variables...');
    
    checkEnvVar();
    
    console.log('✅ DATABASE_URL found');
    
    console.log('\n🔄 Running database seed command...');
    // Run seed command with the production environment
    execSync('npx prisma db seed', { 
      stdio: 'inherit',
      env: {
        ...process.env,
        NODE_ENV: 'production'
      } 
    });
    
    console.log('\n✅ Production database seeded successfully!');
    console.log('\nLogin details for all users:');
    console.log('Email: admin@example.com, Password: password123, Role: ADMIN');
    console.log('Email: teacher@example.com, Password: password123, Role: TEACHER');
    console.log('Email: user@example.com, Password: password123, Role: USER');
    
  } catch (error) {
    console.error('\n❌ Error seeding production database:', error.message);
    process.exit(1);
  }
}

main();
