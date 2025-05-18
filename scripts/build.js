// This script handles the build process with better error handling
const { execSync } = require('child_process');
const path = require('path');

try {
  // Run prisma generate
  console.log('Running prisma generate...');
  execSync('npx prisma generate', { stdio: 'inherit' });
  
  // Run next build with NODE_OPTIONS to avoid glob issues
  console.log('Running next build...');
  process.env.NODE_OPTIONS = '--no-experimental-fetch --max-old-space-size=4096';
  
  // Set NODE_ENV to production to avoid certain warnings
  process.env.NODE_ENV = 'production';
  
  // Run the build
  execSync('npx next build', { 
    stdio: 'inherit',
    env: {
      ...process.env,
      // Polyfill Request for Next.js 
      NODE_OPTIONS: process.env.NODE_OPTIONS + ' --require=next/dist/compiled/whatwg-fetch/fetch.js',
      // Exclude problematic paths from glob scanning
      GLOB_RESTRICT_PATHS: 'Cookies,AppData,Temp,tmp,.git,node_modules'
    }
  });
  
  console.log('Build completed successfully!');
} catch (error) {
  console.error('Build failed:', error.message);
  process.exit(1);
}
