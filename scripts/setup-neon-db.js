/**
 * setup-neon-db.js
 * 
 * This script helps to set up and test a connection to Neon PostgreSQL.
 * It runs migrations and verifies the database connection.
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

// Load Neon environment variables
dotenv.config({ path: '.env.neon' });

console.log('🚀 Setting up Neon PostgreSQL database...');

// Check if DATABASE_URL is set
if (!process.env.DATABASE_URL) {
  console.error('❌ DATABASE_URL is not set in .env.neon file');
  console.log('Please update the .env.neon file with your Neon connection string');
  process.exit(1);
}

// Check if it's a Neon connection string
if (!process.env.DATABASE_URL.includes('neon.tech')) {
  console.warn('⚠️ The DATABASE_URL does not seem to be a Neon connection string.');
  console.warn('Make sure you\'re using the connection string from your Neon dashboard.');
  
  // Ask for confirmation
  console.log('Do you want to continue anyway? (Y/n)');
  const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
  });
  
  readline.question('', answer => {
    if (answer.toLowerCase() !== 'y' && answer.toLowerCase() !== '') {
      console.log('❌ Setup cancelled.');
      process.exit(0);
    }
    readline.close();
    runSetup();
  });
} else {
  runSetup();
}

function runSetup() {
  console.log('🔄 Testing database connection...');
  
  try {
    // Test connection using Prisma
    execSync('npx prisma db pull --schema=./prisma/schema.prisma', { 
      stdio: 'inherit',
      env: { ...process.env }
    });
    
    console.log('✅ Database connection successful!');
    
    // Run migrations
    console.log('🔄 Running migrations...');
    execSync('npx prisma migrate deploy --schema=./prisma/schema.prisma', {
      stdio: 'inherit',
      env: { ...process.env }
    });
    
    console.log('✅ Migrations completed successfully!');
    
    // Ask if user wants to seed the database
    console.log('\nDo you want to seed the database with initial data? (y/N)');
    const readline = require('readline').createInterface({
      input: process.stdin,
      output: process.stdout
    });
    
    readline.question('', answer => {
      if (answer.toLowerCase() === 'y') {
        console.log('🔄 Seeding database...');
        try {
          execSync('npx prisma db seed', {
            stdio: 'inherit',
            env: { ...process.env }
          });
          console.log('✅ Database seeding completed successfully!');
        } catch (error) {
          console.error('❌ Database seeding failed:', error.message);
        }
      }
      
      console.log('\n✅ Neon PostgreSQL setup completed!');
      console.log('\n📋 Next steps:');
      console.log('1. Add your Neon connection string to Vercel environment variables');
      console.log('2. Deploy your application to Vercel');
      console.log('3. Your application should now be connected to your Neon PostgreSQL database');
      
      readline.close();
    });
    
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    console.error('\nPlease check your connection string and make sure:');
    console.error('1. The connection string is correct');
    console.error('2. Your IP address is allowed in Neon\'s connection settings');
    console.error('3. Your database exists and is accessible');
    process.exit(1);
  }
}
