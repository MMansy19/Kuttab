// Regenerate Prisma client with correct paths
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🧹 Cleaning Prisma cache and regenerating client...');

try {
  // Ensure the output directory exists
  const outputDir = path.join(__dirname, 'prisma', 'generated', 'prisma-client');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Run prisma generate
  console.log('🔄 Running prisma generate...');
  execSync('npx prisma generate', { stdio: 'inherit' });
  console.log('✅ Prisma client generated successfully');

  // If the build is successful, continue to Next.js build
  console.log('🔄 Starting Next.js build...');
  execSync('next build', { stdio: 'inherit' });
  console.log('✅ Build completed successfully');
} catch (error) {
  console.error('❌ Error during build:', error.message);
  process.exit(1);
}
