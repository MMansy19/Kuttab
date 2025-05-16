/**
 * fix-prisma-json.js
 * 
 * This script helps fix JSON parsing issues in Prisma client generation.
 * Sometimes the cached JSON files in the Prisma directory can get corrupted.
 */
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Define directories to check for corrupted JSON files
const dirsToCheck = [
  path.join(process.cwd(), 'node_modules', '.prisma'),
  path.join(process.cwd(), '.prisma')
];

// Create directories if they don't exist
dirsToCheck.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`Created directory: ${dir}`);
  }
});

console.log('Running Prisma generate with clean environment...');

try {
  // Set environment variables to ensure clean generation
  const env = {
    ...process.env,
    PRISMA_FORCE_REGENRATE: 'true',
    PRISMA_SKIP_POSTINSTALL: 'true'
  };
  
  // Run Prisma generate
  execSync('npx prisma generate', { 
    env,
    stdio: 'inherit'
  });
  
  console.log('Prisma client generation completed successfully!');
} catch (error) {
  console.error('Error during Prisma client generation:', error.message);
  
  // Let's try to fix any corrupt JSON files
  console.log('Attempting to fix any corrupt JSON files...');
  
  dirsToCheck.forEach(dir => {
    if (fs.existsSync(dir)) {
      const files = fs.readdirSync(dir).filter(file => file.endsWith('.json'));
      
      files.forEach(file => {
        const filePath = path.join(dir, file);
        console.log(`Checking file: ${filePath}`);
        
        try {
          const content = fs.readFileSync(filePath, 'utf8');
          
          try {
            // Try to parse and reformat the JSON
            const parsed = JSON.parse(content);
            fs.writeFileSync(filePath, JSON.stringify(parsed, null, 2));
            console.log(`✅ Fixed JSON formatting in ${file}`);
          } catch (parseError) {
            console.error(`❌ JSON parse error in ${file}: ${parseError.message}`);
            
            // If the file is corrupted, delete it
            fs.unlinkSync(filePath);
            console.log(`🗑️ Deleted corrupted file: ${file}`);
          }
        } catch (readError) {
          console.error(`Error reading file ${file}: ${readError.message}`);
        }
      });
    }
  });
  
  console.log('Attempting Prisma generate again after fixing JSON files...');
  
  try {
    execSync('npx prisma generate', { stdio: 'inherit' });
    console.log('Prisma client generation succeeded after fixing JSON files!');
  } catch (retryError) {
    console.error('Failed to generate Prisma client even after fixing JSON files:', retryError.message);
    process.exit(1);
  }
}
