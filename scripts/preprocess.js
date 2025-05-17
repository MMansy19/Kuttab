/**
 * Preprocess script for builds
 * 
 * This script runs before the build to prepare the environment
 * and fix common issues.
 */
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🔧 Running build preprocessing...');

// Run rimraf to clean next directory
if (fs.existsSync(path.join(process.cwd(), '.next'))) {
  try {
    console.log('Cleaning .next directory...');
    execSync('npx rimraf .next', { stdio: 'inherit' });
  } catch (error) {
    console.warn('⚠️ Error cleaning .next directory:', error.message);
  }
}

// Setting environment variables for better Windows compatibility
process.env.NEXT_TELEMETRY_DISABLED = '1';
process.env.NEXT_DISABLE_RECURSIVE_GLOB = 'true';
process.env.NODE_OPTIONS = `${process.env.NODE_OPTIONS || ''} --max-old-space-size=4096`;

console.log('✅ Preprocessing completed successfully');
