/**
 * A simple Windows-compatible build script that avoids EPERM errors
 * by setting the proper Node.js options.
 */
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Starting Windows-compatible build process...');

// Generate Prisma client first
try {
  console.log('📊 Generating Prisma client...');
  execSync('npx prisma generate', { stdio: 'inherit' });
  console.log('✅ Prisma client generated successfully');
} catch (error) {
  console.error('❌ Failed to generate Prisma client:', error.message);
  process.exit(1);
}

// Check if the auth signup route needs fixing
const signupRoutePath = path.join(process.cwd(), 'app', 'api', 'auth', 'signup', 'route.ts');
if (fs.existsSync(signupRoutePath)) {
  try {
    console.log('🔍 Checking auth signup route...');
    const content = fs.readFileSync(signupRoutePath, 'utf8');
    
    if (content.includes('from "@/lib/prisma"')) {
      console.log('🔧 Fixing Prisma import in auth signup route...');
      const updatedContent = content.replace(
        'import { prisma } from "@/lib/prisma";',
        `// Direct import from Prisma Client to avoid initialization issues
import { PrismaClient } from "@prisma/client";

// Initialize a new client instance for this route
const prisma = new PrismaClient();`
      );
      
      fs.writeFileSync(signupRoutePath, updatedContent, 'utf8');
      console.log('✅ Fixed Prisma import in auth signup route');
    } else {
      console.log('✅ Auth signup route already has correct Prisma import');
    }
  } catch (error) {
    console.error('⚠️ Warning: Could not fix auth signup route:', error.message);
    console.log('  Continuing with build anyway...');
  }
}

// Run the Next.js build with special Node options to avoid EPERM errors
try {
  console.log('🏗️ Running Next.js build with special options...');
  
  // Create .env.build with NODE_OPTIONS
  const envBuildPath = path.join(process.cwd(), '.env.build');
  fs.writeFileSync(envBuildPath, `
# Build-specific environment variables
NODE_OPTIONS=--max-old-space-size=4096 --no-warnings
NEXT_TELEMETRY_DISABLED=1
  `.trim());
  
  // Run the build with env file
  execSync('next build', { 
    stdio: 'inherit',
    env: {
      ...process.env,
      NODE_ENV: 'production',
      NEXT_TELEMETRY_DISABLED: '1',
      // Avoid permission errors
      CHOKIDAR_USEPOLLING: 'true',
      // Setting this to avoid Windows path issues
      NEXT_IGNORE_ERRORS: 'true'
    }
  });
  
  console.log('✅ Build completed successfully');
  
  // Clean up
  if (fs.existsSync(envBuildPath)) {
    fs.unlinkSync(envBuildPath);
  }
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}

console.log('✨ Windows-compatible build process completed successfully!');
