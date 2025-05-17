#!/usr/bin/env node
/**
 * smart-build.js
 * 
 * Automatically selects the appropriate build script based on the platform.
 * Uses the Windows-safe build on Windows platforms to avoid EPERM errors.
 */
const { execSync } = require('child_process');
const os = require('os');

// Detect if running on Windows
const isWindows = os.platform() === 'win32';

// Run the appropriate build command
try {
  if (isWindows) {
    console.log('🪟 Windows detected, using Windows-safe build process...');
    execSync('npm run build:windows', { stdio: 'inherit' });
  } else {
    console.log('🐧 Non-Windows platform detected, using standard build process...');
    execSync('npm run build', { stdio: 'inherit' });
  }
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}
