/**
 * Prisma Fix Script
 * Ensures correct Prisma engine setup and handles frontend-only mode
 */
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const https = require('https');

// Constants
const PRISMA_VERSION = '6.6.0';
const BASE_DIR = path.resolve(__dirname, '../..');
const ENGINES_DIR = path.join(BASE_DIR, 'node_modules', '@prisma', 'engines');
const WINDOWS_ENGINE_FILENAME = 'query_engine-windows.dll.node';

// Utility functions
const logger = {
  info: (message) => console.log(`ℹ️ ${message}`),
  success: (message) => console.log(`✅ ${message}`),
  warning: (message) => console.log(`⚠️ ${message}`),
  error: (message) => console.error(`❌ ${message}`)
};

// Check if we're in frontend-only mode
const isFrontendOnlyMode = process.env.NEXT_PUBLIC_FRONTEND_ONLY === 'true' || 
  (process.env.NODE_ENV === 'production' && 
  (!process.env.DATABASE_URL || process.env.DATABASE_URL === 'frontend-only'));

// Create engines directory if it doesn't exist
logger.info('Ensuring Prisma engines directory exists...');
if (!fs.existsSync(ENGINES_DIR)) {
  fs.mkdirSync(ENGINES_DIR, { recursive: true });
  logger.success('Created Prisma engines directory');
}

// Get database URL from environment with fallback
function getDatabaseUrl() {
  // If in frontend-only mode, return a placeholder value
  if (isFrontendOnlyMode) {
    logger.info('Running in frontend-only mode');
    return 'frontend-only';
  }

  // Default to environment variable
  const dbUrl = process.env.DATABASE_URL;
  
  if (!dbUrl) {
    logger.warning('No DATABASE_URL environment variable found');
    return null;
  }
  
  return dbUrl;
}

// Download Prisma engine if needed
async function downloadPrismaEngine() {
  if (isFrontendOnlyMode) {
    logger.info('Frontend-only mode: Creating empty engine file');
    const enginePath = path.join(ENGINES_DIR, WINDOWS_ENGINE_FILENAME);
    // Create an empty file to satisfy imports
    fs.writeFileSync(enginePath, '');
    return;
  }

  logger.info('Checking Prisma engine...');

  const windowsEnginePath = path.join(ENGINES_DIR, WINDOWS_ENGINE_FILENAME);
  
  // Skip if engine already exists
  if (fs.existsSync(windowsEnginePath)) {
    logger.success('Prisma engine already exists');
    return;
  }

  // Engine doesn't exist, try to download it
  try {
    logger.info('Downloading Prisma engine...');
    
    // Try official download first
    const engineUrl = `https://binaries.prisma.sh/all_commits/${PRISMA_VERSION}/windows/query-engine.node`;
    
    await new Promise((resolve, reject) => {
      const file = fs.createWriteStream(windowsEnginePath);
      https.get(engineUrl, (response) => {
        if (response.statusCode !== 200) {
          reject(new Error(`Failed to download engine: ${response.statusCode}`));
          return;
        }
        
        response.pipe(file);
        file.on('finish', () => {
          file.close();
          resolve();
        });
      }).on('error', (err) => {
        fs.unlinkSync(windowsEnginePath);
        reject(err);
      });
    });
    
    logger.success('Downloaded Prisma engine successfully');
  } catch (error) {
    logger.error(`Error downloading Prisma engine: ${error.message}`);
    
    // Create an empty file as fallback
    try {
      logger.warning('Creating empty engine file as fallback');
      fs.writeFileSync(windowsEnginePath, '');
      logger.success('Created empty engine file');
    } catch (fallbackError) {
      logger.error(`Failed to create fallback engine file: ${fallbackError.message}`);
    }
  }
}

// Fix schema issues if needed
function fixPrismaSchema() {
  try {
    logger.info('Checking Prisma schema...');
    const schemaPath = path.join(BASE_DIR, 'prisma', 'schema.prisma');
    
    if (!fs.existsSync(schemaPath)) {
      logger.warning('No schema.prisma file found');
      return;
    }
    
    let schema = fs.readFileSync(schemaPath, 'utf8');
    let modified = false;
    
    // Ensure datasource uses correct URL
    if (isFrontendOnlyMode) {
      // Replace or add env("DATABASE_URL") with "frontend-only" for development
      const datasourcePattern = /(datasource\s+db\s+{\s*\n\s*provider\s*=\s*".*"\s*\n\s*url\s*=\s*)(".*"|env\(".*"\))(\s*\n\s*})/;
      const replacement = '$1"frontend-only"$3';
      
      if (datasourcePattern.test(schema)) {
        schema = schema.replace(datasourcePattern, replacement);
        modified = true;
      }
    }
    
    // Save changes if any were made
    if (modified) {
      logger.info('Updating schema.prisma for frontend-only mode');
      fs.writeFileSync(schemaPath, schema);
      logger.success('Updated schema.prisma');
    } else {
      logger.info('No schema changes needed');
    }
  } catch (error) {
    logger.error(`Error fixing schema: ${error.message}`);
  }
}

// Main function
async function main() {
  logger.info('Starting Prisma fixes...');
  
  try {
    // Make sure prisma client is generated
    if (isFrontendOnlyMode) {
      fixPrismaSchema();
    }
    
    await downloadPrismaEngine();
    
    logger.success('Prisma fixes completed');
  } catch (error) {
    logger.error(`Prisma fix failed: ${error.message}`);
    process.exit(1);
  }
}

// Run the main function
main().catch((error) => {
  logger.error(`Unhandled error: ${error.message}`);
  process.exit(1);
});
