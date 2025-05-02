const { copyFileSync, mkdirSync, existsSync } = require('fs');
const { join } = require('path');

// Function to ensure directory exists
function ensureDirectoryExists(dir) {
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }
}

// Output directories for Vercel
const outputDir = join(process.cwd(), '.vercel', 'output');
const functionDir = join(outputDir, 'functions', 'api');

// Ensure the directories exist
ensureDirectoryExists(functionDir);

// Copy Prisma schema and other necessary files to the functions directory
try {
  // Create a prisma directory in the functions directory
  const prismaFunctionDir = join(functionDir, 'prisma');
  ensureDirectoryExists(prismaFunctionDir);

  // Copy schema.prisma
  const schemaSource = join(process.cwd(), 'prisma', 'schema.prisma');
  const schemaDest = join(prismaFunctionDir, 'schema.prisma');
  copyFileSync(schemaSource, schemaDest);
  
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
    }
  }
  
  console.log('✅ Prisma schema and migrations copied to Vercel functions directory');
} catch (error) {
  console.error('❌ Error during Vercel build preparation:', error);
  process.exit(1);
}