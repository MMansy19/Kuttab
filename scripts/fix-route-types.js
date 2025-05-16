/**
 * This script fixes the type issues in Next.js generated route files
 * It runs after the build process to patch generated type files
 */

const fs = require('fs');
const path = require('path');

// Handle different versions of glob
let glob;
try {
  // Try to import glob using v11 syntax
  const globModule = require('glob');
  glob = globModule.glob || globModule;
} catch (e) {
  // Fallback if glob isn't available at all
  console.error('Could not load glob module:', e.message);
  process.exit(1);
}

/**
 * Find all generated route type files
 * @returns {Promise<string[]>}
 */
async function findGeneratedRouteTypes() {
  try {
    // Handle both glob v11+ promise-based API and older callback-based API
    if (typeof glob.then === 'function' || typeof glob === 'function') {
      // New promise-based glob v11+
      const files = await glob('.next/types/app/**/route.ts');
      return files;
    } else {
      // Older callback-based glob
      return new Promise((resolve, reject) => {
        glob('.next/types/app/**/route.ts', (err, files) => {
          if (err) reject(err);
          else resolve(files);
        });
      });
    }
  } catch (err) {
    console.error('Error finding route types:', err);
    throw err;
  }
}

/**
 * Fix the route types in a file
 * @param {string} filePath - Path to the route.ts file
 */
function fixRouteTypes(filePath) {
  console.log(`Fixing types in ${filePath}...`);
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Fix Promise<{ params: ... }> to { params: ... }
    content = content.replace(
      /Promise<{\s*params:\s*{([^}]*)}\s*}>/g, 
      '{ params: {$1} }'
    );
    
    // Fix RouteContext = { params: Promise<SegmentParams> } to { params: SegmentParams }
    content = content.replace(
      /type RouteContext = \{\s*params:\s*Promise<SegmentParams>\s*\}/g,
      'type RouteContext = { params: SegmentParams }'
    );

    // Fix params?: { id: string } | undefined to params: { id: string }
    content = content.replace(
      /params\?:\s*{([^}]*)}\s*\|\s*undefined/g,
      'params: {$1}'
    );
    
    // Add a comment at the top
    const headerComment = `/**
 * This file was automatically patched by fix-route-types.js
 * Original type issues with Promise-wrapped params have been fixed
 */
`;
    
    fs.writeFileSync(filePath, headerComment + content);
    console.log(`✓ Fixed ${filePath}`);
  } catch (error) {
    console.error(`Error fixing ${filePath}:`, error);
  }
}

/**
 * Main function
 */
async function main() {
  try {
    console.log('Finding generated route types...');
    const files = await findGeneratedRouteTypes();
    
    if (files.length === 0) {
      console.log('No route type files found. Build may not have generated types yet.');
      return;
    }
    
    console.log(`Found ${files.length} route type files to fix.`);
    
    // Process each file
    for (const file of files) {
      fixRouteTypes(file);
    }
    
    console.log('Type fixing completed successfully!');
    
    // Create or update a flag file to indicate types have been fixed
    fs.writeFileSync('.next/types/.types-fixed', new Date().toISOString());
    
  } catch (error) {
    console.error('Error fixing route types:', error);
    process.exit(1);
  }
}

// Run the script
main();