const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const https = require('https');

// Constants
const PRISMA_VERSION = '6.6.0';
const ENGINES_DIR = path.join(__dirname, 'node_modules', '@prisma', 'engines');
const WINDOWS_ENGINE_FILENAME = 'query_engine-windows.dll.node';

// Create engines directory if it doesn't exist
console.log('📂 Ensuring Prisma engines directory exists...');
if (!fs.existsSync(ENGINES_DIR)) {
  fs.mkdirSync(ENGINES_DIR, { recursive: true });
  console.log('✅ Created Prisma engines directory');
}

// Get database URL from environment with fallback
function getDatabaseUrl() {
  // Default to environment variable
  let databaseUrl = process.env.DATABASE_URL;

  // If in development and no explicit DATABASE_URL is provided, use SQLite
  if (process.env.NODE_ENV !== 'production' && !databaseUrl) {
    databaseUrl = 'file:./dev.db';
    console.log('Using SQLite for development');
  } 
  // For production, ensure we have a proper PostgreSQL URL
  else if (process.env.NODE_ENV === 'production') {
    if (!databaseUrl || !databaseUrl.startsWith('postgresql')) {
      console.warn('WARNING: No valid PostgreSQL DATABASE_URL found in production environment!');
      console.warn('Vercel deployment requires a PostgreSQL database connection.');
    } else {
      console.log('Using PostgreSQL database connection for production');
    }
  }

  return databaseUrl;
}

// Get database provider based on the URL
function getDatabaseProvider(databaseUrl) {
  if (!databaseUrl) return 'postgresql'; // Default to PostgreSQL for production
  
  if (databaseUrl.startsWith('file:')) {
    return 'sqlite';
  } else if (databaseUrl.startsWith('postgresql')) {
    return 'postgresql';
  } else {
    console.warn('Unrecognized database URL format, defaulting to PostgreSQL');
    return 'postgresql';
  }
}

// Main function to fix Prisma schema
function ensureProperPrismaSetup() {
  console.log('🔧 Ensuring proper Prisma setup for deployment...');
  
  try {
    // Get database configuration based on environment
    const databaseUrl = getDatabaseUrl();
    const dbProvider = getDatabaseProvider(databaseUrl);
    
    console.log(`Using database provider: ${dbProvider}`);
    
    // Read the current schema
    const schemaPath = path.join(process.cwd(), 'prisma', 'schema.prisma');
    let schemaContent = fs.readFileSync(schemaPath, 'utf8');
    
    // First, ensure the generator is correctly set to "prisma-client-js"
    const generatorMatch = schemaContent.match(/generator\s+client\s*{[^}]*provider\s*=\s*"([^"]+)"/s);
    const currentGenerator = generatorMatch ? generatorMatch[1] : null;
    
    // Fix the generator if needed - this must be "prisma-client-js"
    if (currentGenerator && currentGenerator !== "prisma-client-js") {
      console.log(`Fixing generator from "${currentGenerator}" to "prisma-client-js"...`);
      schemaContent = schemaContent.replace(
        /generator\s+client\s*{[^}]*provider\s*=\s*"([^"]+)"/s,
        (match) => match.replace(currentGenerator, "prisma-client-js")
      );
    }
    
    // Now check and update the database provider if needed
    const dbProviderMatch = schemaContent.match(/datasource\s+db\s*{[^}]*provider\s*=\s*"([^"]+)"/s);
    const currentDbProvider = dbProviderMatch ? dbProviderMatch[1] : null;
    
    console.log(`Current database provider: ${currentDbProvider}, Target: ${dbProvider}`);
    
    if (currentDbProvider !== dbProvider) {
      console.log(`Updating database provider from "${currentDbProvider}" to "${dbProvider}"...`);
      
      // Replace the database provider in the datasource block
      schemaContent = schemaContent.replace(
        /datasource\s+db\s*{[^}]*provider\s*=\s*"([^"]+)"/s,
        (match) => match.replace(currentDbProvider, dbProvider)
      );
      
      // Update URL to use environment variable
      schemaContent = schemaContent.replace(
        /datasource\s+db\s*{[^}]*url\s*=\s*"[^"]+"/s,
        (match) => match.replace(/url\s*=\s*"[^"]+"/, 'url = env("DATABASE_URL")')
      );
      
      // Write the updated schema back to disk
      fs.writeFileSync(schemaPath, schemaContent);
      console.log('✅ Schema updated successfully');
    } else {
      console.log('✅ Schema database provider is already correctly configured');
    }
    
    // Run prisma generate with appropriate flags for better compatibility
    console.log('Generating Prisma client...');
    execSync('npx prisma generate', { 
      stdio: 'inherit',
      env: {
        ...process.env,
        PRISMA_ENGINES_CHECKSUM_IGNORE_MISSING: "1"
      }
    });
    console.log('✅ Prisma client generated successfully');
    
    return true;
  } catch (error) {
    console.error('❌ Error ensuring proper Prisma setup:', error);
    return false;
  }
}

// Run the function if executed directly
if (require.main === module) {
  const success = ensureProperPrismaSetup();
  if (!success) {
    process.exit(1);
  }
}

module.exports = { ensureProperPrismaSetup };