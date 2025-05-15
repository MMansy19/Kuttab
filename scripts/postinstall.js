/**
 * postinstall.js
 * 
 * This script runs after npm install to ensure Prisma client is properly generated.
 * This is especially important in environments like Vercel where dependencies are cached.
 */

const { execSync } = require('child_process');

console.log('📦 Running postinstall script...');

try {
  console.log('🔄 Generating Prisma Client...');
  execSync('npx prisma generate', { stdio: 'inherit' });
  console.log('✅ Prisma Client generated successfully');
} catch (error) {
  console.error('❌ Failed to generate Prisma Client:', error.message);
  console.error('This might cause issues with database access.');
  
  // Don't exit with error to allow deployment to continue
  // The build command should also try to generate Prisma client
}

console.log('📦 Postinstall completed');
