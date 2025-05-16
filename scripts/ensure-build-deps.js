/**
 * Script to ensure all required build dependencies are installed
 * This is especially important for Vercel deployments where dependencies
 * might be pruned or not installed correctly
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Critical dependencies for the build process
const CRITICAL_DEPENDENCIES = [
  'tailwindcss',
  'glob',
  'postcss',
  'autoprefixer',
  'tailwindcss-rtl'
];

function checkAndInstallDependencies() {
  console.log('🔍 Checking for critical build dependencies...');
  
  const missingDeps = [];
  
  for (const dep of CRITICAL_DEPENDENCIES) {
    try {
      require.resolve(dep);
      console.log(`✅ ${dep} is installed`);
    } catch (e) {
      console.log(`❌ ${dep} is missing`);
      missingDeps.push(dep);
    }
  }
  
  if (missingDeps.length > 0) {
    console.log(`📦 Installing missing dependencies: ${missingDeps.join(', ')}...`);
    try {
      execSync(`npm install --no-save ${missingDeps.join(' ')}`, { 
        stdio: 'inherit',
        env: process.env
      });
      console.log('✅ Dependencies installed successfully');
    } catch (error) {
      console.error('❌ Failed to install dependencies:', error);
      process.exit(1);
    }
  } else {
    console.log('✅ All critical dependencies are installed');
  }
}

// Run the check
checkAndInstallDependencies();
console.log('🚀 Build dependency check completed');
