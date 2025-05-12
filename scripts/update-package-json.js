const fs = require('fs');
const path = require('path');

console.log('🔧 Updating package.json for optimized performance...');

try {
  // Read the package.json file
  const packageJsonPath = path.join(process.cwd(), 'package.json');
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  
  // Remove unused dependencies
  console.log('Removing unused animation-related dependencies...');
  if (packageJson.dependencies['framer-motion']) {
    delete packageJson.dependencies['framer-motion'];
    console.log('- Removed framer-motion');
  }
  
  // Add new optimization dependencies
  console.log('Adding optimization dependencies...');
  
  packageJson.dependencies = {
    ...packageJson.dependencies,
    'sharp': '^0.32.1', // For image optimization
  };
  
  // Add optimization scripts
  console.log('Adding optimization scripts...');
  
  packageJson.scripts = {
    ...packageJson.scripts,
    'optimize:images': 'node scripts/convert-to-webp.js',
    'check:images': 'node scripts/check-images.js',
    'analyze': 'ANALYZE=true next build',
  };
  
  // Write updated package.json
  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
  console.log('✅ package.json updated successfully!');
} catch (error) {
  console.error('❌ Error updating package.json:', error);
}
