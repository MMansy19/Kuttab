/**
 * This script ensures the Prisma client is properly loaded during build time.
 * It resolves issues with Prisma client initialization in Next.js serverless environments.
 */
const path = require('path');
const fs = require('fs');

const PRISMA_CLIENT_PATH = path.join(__dirname, 'prisma/generated/prisma-client');

function ensurePrismaClientExists() {
  if (!fs.existsSync(PRISMA_CLIENT_PATH)) {
    console.error('❌ Prisma client directory not found!');
    console.error(`Expected path: ${PRISMA_CLIENT_PATH}`);
    console.error('Please run "npx prisma generate" to create the Prisma client.');
    process.exit(1);
  }
  
  const indexPath = path.join(PRISMA_CLIENT_PATH, 'index.js');
  if (!fs.existsSync(indexPath)) {
    console.error('❌ Prisma client index.js not found!');
    console.error('Please run "npx prisma generate" to create the Prisma client.');
    process.exit(1);
  }
  
  console.log('✅ Prisma client exists and is ready for use');
}

// Force import of the Prisma client to ensure it's loaded
function loadPrismaClient() {
  try {
    // Try to require the Prisma client
    require(PRISMA_CLIENT_PATH);
    console.log('✅ Prisma client loaded successfully');
  } catch (error) {
    console.error('❌ Failed to load Prisma client:', error.message);
    console.error('Please run "npx prisma generate" to create the Prisma client.');
    process.exit(1);
  }
}

// Run the checks
ensurePrismaClientExists();
loadPrismaClient();

console.log('✅ Prisma client verification complete');
