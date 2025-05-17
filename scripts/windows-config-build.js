/**
 * A custom build script that uses a Windows-specific Next.js configuration
 * to avoid EPERM errors during build.
 */
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Starting Windows-compatible build with custom Next.js config...');

// Make sure Prisma client is generated
try {
  console.log('📊 Generating Prisma client...');
  execSync('npx prisma generate', { stdio: 'inherit' });
  console.log('✅ Prisma client generated successfully');
} catch (error) {
  console.error('❌ Failed to generate Prisma client:', error.message);
  process.exit(1);
}

// Run the Next.js build with the Windows-specific config
try {
  console.log('🏗️ Running Next.js build with Windows-specific config...');
  execSync('next build --config next.config.windows.js', { 
    stdio: 'inherit',
    env: {
      ...process.env,
      NODE_ENV: 'production',
      NEXT_TELEMETRY_DISABLED: '1',
      CHOKIDAR_USEPOLLING: 'true'
    }
  });
  console.log('✅ Build completed successfully');
} catch (error) {
  console.error('❌ Build failed:', error.message);
  
  // Try a fallback approach if the custom config fails
  console.log('🔄 Trying fallback build approach...');
  try {
    // Create a temporary Next.js config file with minimal settings
    const minimalConfigPath = path.join(process.cwd(), 'next.config.minimal.js');
    fs.writeFileSync(minimalConfigPath, `
/** @type {import('next').NextConfig} */
module.exports = {
  // Very minimal config to reduce chances of errors
  reactStrictMode: false,
  experimental: {},
  webpack: (config) => {
    config.watchOptions = { ignored: /.*/i };
    return config;
  }
};
    `);
    
    // Run with the minimal config
    execSync('next build --config next.config.minimal.js', { 
      stdio: 'inherit',
      env: {
        ...process.env,
        NODE_ENV: 'production',
        NEXT_TELEMETRY_DISABLED: '1'
      }
    });
    
    // Clean up
    if (fs.existsSync(minimalConfigPath)) {
      fs.unlinkSync(minimalConfigPath);
    }
    
    console.log('✅ Build completed successfully with fallback approach');
  } catch (fallbackError) {
    console.error('❌ Fallback build also failed:', fallbackError.message);
    process.exit(1);
  }
}

console.log('✨ Windows-compatible build process completed!');
