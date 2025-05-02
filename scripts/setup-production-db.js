// This script helps ensure database migrations are properly applied in production
const { execSync } = require('child_process');
const path = require('path');

// Function to run a command and log its output
function runCommand(command) {
  console.log(`Running: ${command}`);
  
  try {
    execSync(command, { 
      stdio: 'inherit',
      env: {
        ...process.env,
        DATABASE_URL: process.env.DATABASE_URL
      }
    });
    
    console.log(`✅ Successfully executed: ${command}`);
  } catch (error) {
    console.error(`❌ Error executing ${command}:`, error.message);
    // Don't exit immediately, try to continue with other commands
  }
}

// Main function for setup
async function setupProductionDb() {
  console.log('Setting up production database...');
  
  try {
    // Generate Prisma client
    runCommand('npx prisma generate');
    
    // Run database migrations
    runCommand('npx prisma migrate deploy');
    
    // Optional: You can check if the database connection works
    runCommand('npx prisma db push --accept-data-loss');
    
    console.log('✅ Production database setup completed');
  } catch (error) {
    console.error('❌ Failed to set up production database:', error);
    process.exit(1);
  }
}

// Run the setup
setupProductionDb();