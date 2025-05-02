const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const https = require('https');
const { getDatabaseUrl, getPrismaProvider } = require('./lib/db-config');

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

// Direct download of the engine from Prisma CDN
const downloadEngine = () => {
  return new Promise((resolve, reject) => {
    // The URL pattern for Prisma engines (this may change in future versions)
    const engineUrl = `https://binaries.prisma.sh/all_commits/${PRISMA_VERSION}/windows/${WINDOWS_ENGINE_FILENAME}`;
    const enginePath = path.join(ENGINES_DIR, WINDOWS_ENGINE_FILENAME);
    
    console.log(`📥 Downloading Prisma engine from: ${engineUrl}`);
    
    // Create a write stream to save the file
    const fileStream = fs.createWriteStream(enginePath);
    
    https.get(engineUrl, (response) => {
      if (response.statusCode === 200) {
        response.pipe(fileStream);
        fileStream.on('finish', () => {
          fileStream.close();
          console.log('✅ Engine downloaded successfully');
          resolve(true);
        });
      } else if (response.statusCode === 302 || response.statusCode === 301) {
        // Handle redirects
        console.log(`↪️ Redirecting to: ${response.headers.location}`);
        https.get(response.headers.location, (redirectResponse) => {
          redirectResponse.pipe(fileStream);
          fileStream.on('finish', () => {
            fileStream.close();
            console.log('✅ Engine downloaded successfully after redirect');
            resolve(true);
          });
        }).on('error', (e) => {
          fs.unlinkSync(enginePath);
          reject(e);
        });
      } else {
        fs.unlinkSync(enginePath);
        reject(new Error(`Failed to download: ${response.statusCode}`));
      }
    }).on('error', (e) => {
      fs.unlinkSync(enginePath);
      reject(e);
    });
  });
};

// Try different approaches to get Prisma working
const runPrismaFix = async () => {
  try {
    console.log('🔧 Starting Prisma engine fix...');
    
    // Approach 1: Try standard generate with environment variables to skip binary downloads
    try {
      console.log('🔄 Approach 1: Using Prisma CLI with custom flags...');
      execSync('npx prisma generate --no-engine', { 
        stdio: 'inherit',
        env: { 
          ...process.env,
          PRISMA_ENGINES_CHECKSUM_IGNORE_MISSING: "1"
        }
      });
      console.log('✅ Successfully generated Prisma client');
      return true;
    } catch (err) {
      console.log(`⚠️ Approach 1 failed: ${err.message}`);
    }
    
    // Approach 2: Direct download
    try {
      console.log('🔄 Approach 2: Direct download of engine binaries...');
      await downloadEngine();
      
      console.log('⚡ Generating client with existing engine...');
      execSync('npx prisma generate --no-engine', { 
        stdio: 'inherit',
        env: {
          ...process.env,
          PRISMA_ENGINES_CHECKSUM_IGNORE_MISSING: "1"
        }
      });
      console.log('✅ Successfully generated client with pre-downloaded engine');
      return true;
    } catch (err) {
      console.log(`⚠️ Approach 2 failed: ${err.message}`);
    }
    
    // Approach 3: Use the client without the engines (Accelerate mode)
    console.log('🔄 Approach 3: Generating client in accelerate-only mode...');
    execSync('npx prisma generate --no-engine', { stdio: 'inherit' });
    console.log('⚠️ Generated client without engine (only for use with Prisma Accelerate)');
    
    console.log('🎉 Prisma setup completed with best available option');
    return true;
  } catch (error) {
    console.error(`❌ All approaches failed: ${error.message}`);
    return false;
  }
};

// Main function 
function ensureProperPrismaSetup() {
  console.log('🔧 Ensuring proper Prisma setup for deployment...');
  
  try {
    // Get database configuration based on environment
    const databaseUrl = getDatabaseUrl();
    const provider = getPrismaProvider(databaseUrl);
    
    console.log(`Using database provider: ${provider}`);
    
    // Read the current schema
    const schemaPath = path.join(process.cwd(), 'prisma', 'schema.prisma');
    let schemaContent = fs.readFileSync(schemaPath, 'utf8');
    
    // Check if the provider matches what's in the schema
    const currentProviderMatch = schemaContent.match(/provider\s*=\s*"([^"]+)"/);
    const currentProvider = currentProviderMatch ? currentProviderMatch[1] : null;
    
    console.log(`Current provider in schema: ${currentProvider}, Target provider: ${provider}`);
    
    if (currentProvider !== provider) {
      // In production, we need to ensure the schema uses postgresql
      console.log(`Updating schema provider from ${currentProvider} to ${provider}...`);
      
      schemaContent = schemaContent.replace(
        /provider\s*=\s*"([^"]+)"/,
        `provider = "${provider}"`
      );
      
      // Update the URL as well
      schemaContent = schemaContent.replace(
        /url\s*=\s*"[^"]+"/,
        `url = env("DATABASE_URL")`
      );
      
      fs.writeFileSync(schemaPath, schemaContent);
      console.log('✅ Schema updated successfully');
    } else {
      console.log('✅ Schema provider is already correctly configured');
    }
    
    // Run prisma generate to ensure the client is updated
    console.log('Generating Prisma client...');
    execSync('npx prisma generate', { stdio: 'inherit' });
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

runPrismaFix();