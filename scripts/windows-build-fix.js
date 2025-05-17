/**
 * Windows Build Fix
 * 
 * This script helps fix common Windows build issues related to permissions
 * and file access during Next.js builds.
 */
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🔧 Running Windows build fixes...');

// Set environment variables to help with Windows issues
process.env.NEXT_DISABLE_RECURSIVE_GLOB = 'true';
process.env.NODE_OPTIONS = `${process.env.NODE_OPTIONS || ''} --max-old-space-size=4096`;

// Create a .nowatchignore file to exclude problematic paths
const nowatchIgnorePath = path.join(process.cwd(), '.nowatchignore');
const ignoreContent = `
# Paths that cause permission errors on Windows
**/Application Data/**
**/AppData/**
**/node_modules/.cache/**
**/node_modules/.bin/**
C:\\Users\\mahmo\\Application Data
C:\\Users\\mahmo\\Application Data/**
`;

try {
  fs.writeFileSync(nowatchIgnorePath, ignoreContent, 'utf8');
  console.log('✅ Created .nowatchignore file to exclude problematic paths');
} catch (error) {
  console.error('❌ Error creating .nowatchignore file:', error);
}

// Clean Next.js cache to prevent stale build issues
try {
  if (fs.existsSync(path.join(process.cwd(), '.next'))) {
    console.log('🧹 Cleaning Next.js cache...');
    
    try {
      // Use rimraf if available (safer than fs.rmSync for Windows)
      execSync('npx rimraf .next', { stdio: 'inherit' });
    } catch (err) {
      console.log('Falling back to native directory removal...');
      try {
        fs.rmSync(path.join(process.cwd(), '.next'), { recursive: true, force: true });
      } catch (error) {
        console.warn('⚠️ Could not remove .next directory, continuing anyway:', error.message);
      }
    }
    
    console.log('✅ Next.js cache cleaned successfully');
  }
} catch (error) {
  console.warn('⚠️ Error cleaning Next.js cache:', error.message);
}

// Create empty .next directory to ensure it exists
try {
  if (!fs.existsSync(path.join(process.cwd(), '.next'))) {
    fs.mkdirSync(path.join(process.cwd(), '.next'), { recursive: true });
  }
} catch (error) {
  console.warn('⚠️ Error creating .next directory:', error.message);
}

console.log('✅ Windows build fixes completed');
console.log('🚀 Starting build process with Windows optimizations...');
