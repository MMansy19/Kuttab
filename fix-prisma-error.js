// This script will fix the Prisma environment and cache issues
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Clear Prisma cache and recreate the Prisma client output directory
try {
  console.log('🧹 Clearing Prisma cache...');
  
  // Define paths
  const prismaNodeModulesDir = path.join(__dirname, 'prisma', 'node_modules');
  const prismaClientDir = path.join(prismaNodeModulesDir, '.prisma', 'client');
  
  // Create directories if they don't exist
  if (!fs.existsSync(prismaNodeModulesDir)) {
    fs.mkdirSync(prismaNodeModulesDir, { recursive: true });
  }
  
  if (!fs.existsSync(path.join(prismaNodeModulesDir, '.prisma'))) {
    fs.mkdirSync(path.join(prismaNodeModulesDir, '.prisma'), { recursive: true });
  }
  
  if (!fs.existsSync(prismaClientDir)) {
    fs.mkdirSync(prismaClientDir, { recursive: true });
  }
  
  // Create an empty index.js file to make sure the directory is valid
  fs.writeFileSync(path.join(prismaClientDir, 'index.js'), '// Placeholder file');
  
  console.log('✅ Prisma directories prepared');
  
  // Run Prisma generate with explicit path
  console.log('🔄 Generating Prisma client...');
  execSync('npx prisma generate', { stdio: 'inherit' });
  
  console.log('✅ Prisma client generated successfully');
} catch (error) {
  console.error('❌ Error fixing Prisma:', error.message);
  process.exit(1);
}
