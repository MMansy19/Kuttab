const { copyFileSync, mkdirSync, existsSync, readdirSync } = require('fs');
const { join } = require('path');
const { execSync } = require('child_process');

// Function to ensure directory exists
function ensureDirectoryExists(dir) {
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }
}

// Function to copy directory contents recursively
function copyDirectory(source, destination) {
  // Ensure destination exists
  ensureDirectoryExists(destination);
  
  // Get all items in the source directory
  const items = readdirSync(source, { withFileTypes: true });
  
  // Process each item
  for (const item of items) {
    const sourcePath = join(source, item.name);
    const destPath = join(destination, item.name);
    
    if (item.isDirectory()) {
      // Recursively copy subdirectories
      copyDirectory(sourcePath, destPath);
    } else {
      // Copy files
      try {
        copyFileSync(sourcePath, destPath);
      } catch (err) {
        console.warn(`⚠️ Could not copy ${sourcePath}: ${err.message}`);
      }
    }
  }
}

// First, run the type fix script if we're in a build environment
try {
  console.log('🔧 Fixing route handler types for build...');
  if (existsSync(join(process.cwd(), '.next', 'types'))) {
    execSync('node scripts/fix-route-types.js', { stdio: 'inherit' });
  } else {
    console.log('⚠️ No .next/types directory found, skipping type fixes');
  }
} catch (error) {
  console.warn('⚠️ Error running type fix script:', error.message);
  console.log('⚠️ Continuing with build despite errors...');
}

// Output directories for Vercel
const outputDir = join(process.cwd(), '.vercel', 'output');
const functionDir = join(outputDir, 'functions', 'api');

// Ensure the directories exist
ensureDirectoryExists(functionDir);

// Copy Prisma schema and other necessary files to the functions directory
try {
  console.log('📁 Preparing Prisma files for Vercel deployment...');
  
  // Create a prisma directory in the functions directory
  const prismaFunctionDir = join(functionDir, 'prisma');
  ensureDirectoryExists(prismaFunctionDir);

  // Copy schema.prisma
  const schemaSource = join(process.cwd(), 'prisma', 'schema.prisma');
  const schemaDest = join(prismaFunctionDir, 'schema.prisma');
  
  if (existsSync(schemaSource)) {
    copyFileSync(schemaSource, schemaDest);
    console.log('✅ Copied schema.prisma');
  } else {
    console.warn('⚠️ schema.prisma not found in source directory');
  }
  
  // Copy migration files to ensure they're available
  const migrationSource = join(process.cwd(), 'prisma', 'migrations');
  if (existsSync(migrationSource)) {
    const migrationDest = join(prismaFunctionDir, 'migrations');
    ensureDirectoryExists(migrationDest);
    
    // Copy migration_lock.toml
    const lockSource = join(migrationSource, 'migration_lock.toml');
    if (existsSync(lockSource)) {
      const lockDest = join(migrationDest, 'migration_lock.toml');
      copyFileSync(lockSource, lockDest);
      console.log('✅ Copied migration_lock.toml');
    } else {
      console.warn('⚠️ migration_lock.toml not found');
    }
    
    // Copy all migration directories
    try {
      const migrationDirs = readdirSync(migrationSource, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory() && dirent.name !== '..' && dirent.name !== '.');
      
      console.log(`Found ${migrationDirs.length} migration directories`);
      
      for (const dir of migrationDirs) {
        const sourceMigrationDir = join(migrationSource, dir.name);
        const destMigrationDir = join(migrationDest, dir.name);
        
        copyDirectory(sourceMigrationDir, destMigrationDir);
        console.log(`✅ Copied migration: ${dir.name}`);
      }
    } catch (err) {
      console.warn(`⚠️ Error copying migration directories: ${err.message}`);
    }
  } else {
    console.warn('⚠️ Migrations directory not found, skipping migration copy');
  }
  
  // Make sure the environment variables are properly passed to Vercel
  console.log('\n🔐 Checking environment variables:');
  if (!process.env.DATABASE_URL) {
    console.warn('⚠️ DATABASE_URL is not set! Please add it in your Vercel project settings.');
  } else {
    console.log('✅ DATABASE_URL is set');
  }
  
  if (!process.env.NEXTAUTH_SECRET) {
    console.warn('⚠️ NEXTAUTH_SECRET is not set! Please add it in your Vercel project settings.');
  } else {
    console.log('✅ NEXTAUTH_SECRET is set');
  }
  
  console.log('\n✅ Prisma setup completed for Vercel deployment');
} catch (error) {
  console.error('❌ Error during Vercel build preparation:', error);
  // Don't fail the build completely
  console.log('⚠️ Continuing with build despite errors...');
}