/**
 * fix-api-route-handlers.js
 * This script updates the API route handlers in the app/ directory to use
 * consistent parameter types for Next.js 15 compatibility
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

// Process a single route file
function processRouteFile(filePath) {
  try {
    console.log(`Processing ${filePath}...`);
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Skip files that don't have route handlers with params
    if (!content.includes('{ params }') && !content.includes('params:')) {
      console.log(`No params found in ${filePath}, skipping.`);
      return false;
    }
    
    // Get the parameter name from the file path (e.g., [id] -> id)
    const pathParts = filePath.split(path.sep);
    const dynamicSegments = pathParts.filter(part => part.startsWith('[') && part.endsWith(']'));
    
    if (dynamicSegments.length === 0) {
      console.log(`No dynamic segments in ${filePath}, skipping.`);
      return false;
    }
    
    const paramName = dynamicSegments[0].replace(/^\[|\]$/g, '');
    const typeName = `${paramName.charAt(0).toUpperCase() + paramName.slice(1)}Params`;
    
    // Skip if the file already has the type definition
    if (content.includes(`type ${typeName}`)) {
      console.log(`Type ${typeName} already exists in ${filePath}, skipping.`);
      return false;
    }
    
    // Create modified content
    let modifiedContent = content;
    
    // Add the type definition after imports
    const lastImportIndex = content.lastIndexOf('import ');
    if (lastImportIndex !== -1) {
      // Find the end of the imports section
      const importsEndIndex = content.indexOf('\n\n', lastImportIndex);
      if (importsEndIndex !== -1) {
        // Insert the type definition after imports
        const typeDefinition = `\n\ntype ${typeName} = { ${paramName}: string };`;
        modifiedContent = 
          content.substring(0, importsEndIndex) + 
          typeDefinition + 
          content.substring(importsEndIndex);
      }
    }
    
    // Update route handler parameter types
    modifiedContent = modifiedContent.replace(
      /\{\s*params\s*\}:\s*\{\s*params:\s*\{\s*[a-zA-Z0-9_]+:\s*string\s*\}\s*\}/g,
      `{ params }: { params: ${typeName} }`
    );
    
    // Write the modified content back to the file
    fs.writeFileSync(filePath, modifiedContent);
    console.log(`✓ Updated ${filePath}`);
    return true;
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error);
    return false;
  }
}

// Main function
async function main() {
  try {    // Find all API route files
    const pattern = 'app/api/**/[[]*/route.ts';
    console.log(`Searching for API route files: ${pattern}`);
    
    let files;
    if (typeof glob.sync === 'function') {
      // Use sync version if available
      files = glob.sync(pattern, { absolute: true });
    } else {
      // Use promise version for glob v11+
      files = await glob(pattern, { absolute: true });
    }
    
    console.log(`Found ${files.length} API route files with dynamic segments.`);
    
    let updatedCount = 0;
    for (const file of files) {
      const updated = processRouteFile(file);
      if (updated) {
        updatedCount++;
      }
    }
    
    console.log(`Updated ${updatedCount} of ${files.length} files.`);
  } catch (error) {
    console.error('Error:', error);
  }
}

// Run the script
main();
