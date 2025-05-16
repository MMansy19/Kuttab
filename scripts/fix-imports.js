/**
 * This script fixes import path issues that may occur during build
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Log information about the environment
console.log('Current working directory:', process.cwd());
console.log('Environment variables:', {
  NODE_ENV: process.env.NODE_ENV,
  // Add other relevant environment variables
});

/**
 * Checks if a path exists in the filesystem
 */
function pathExists(importPath) {
  try {
    // Convert @/components/ui/Card to absolute path
    const resolvedPath = importPath
      .replace('@/', path.join(process.cwd(), '/'))
      .replace(/\\/g, '/');
    
    // Check for different extensions
    const extensions = ['.ts', '.tsx', '.js', '.jsx', '/index.ts', '/index.tsx', '/index.js'];
    
    for (const ext of extensions) {
      const fullPath = resolvedPath + ext;
      if (fs.existsSync(fullPath)) {
        return true;
      }
    }
    
    return false;
  } catch (error) {
    console.error('Error checking path:', error);
    return false;
  }
}

/**
 * Fix imports in a TypeScript/JavaScript file
 */
function fixImportsInFile(filePath) {
  console.log(`Checking imports in: ${filePath}`);
  
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let changed = false;
    
    // Find all import statements
    const importRegex = /import\s+(?:(?:{[^}]*}|\*\s+as\s+[^,]*|[^,{]*),?\s*)*\s*from\s+['"]([^'"]+)['"]/g;
    let match;
    
    // Log all import paths
    console.log(`Imports in ${filePath}:`);
    while ((match = importRegex.exec(content)) !== null) {
      const importPath = match[1];
      const exists = importPath.startsWith('@/') ? pathExists(importPath) : true;
      console.log(`  - ${importPath} ${exists ? '✓' : '❌'}`);
    }
    
    // Write back content if changed
    if (changed) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✓ Fixed imports in ${filePath}`);
    }
  } catch (error) {
    console.error(`Error fixing imports in ${filePath}:`, error);
  }
}

/**
 * Main function
 */
async function main() {
  try {
    // Find all TypeScript files
    const files = glob.sync('app/**/*.{ts,tsx}', {
      ignore: ['node_modules/**', '.next/**']
    });
    
    console.log(`Found ${files.length} TypeScript files to check.`);
    
    // Process each file
    for (const file of files) {
      fixImportsInFile(file);
    }
    
    console.log('Import checking completed.');
  } catch (error) {
    console.error('Error fixing imports:', error);
    process.exit(1);
  }
}

// Run the script
main();
