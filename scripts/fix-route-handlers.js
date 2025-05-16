#!/usr/bin/env node
/**
 * Simple script to fix API route handlers for Next.js 15
 */
const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Find API route files with dynamic segments
console.log('Finding API route files...');
const mainFiles = glob.sync('app/api/**/[[]*/route.ts', { absolute: true });
const nestedFiles = glob.sync('app/api/**/[[]*/*/route.ts', { absolute: true });
const files = [...mainFiles, ...nestedFiles];
console.log(`Found ${files.length} files`);

// Process each file
let fixedCount = 0;
files.forEach(file => {
  console.log(`Processing ${file}`);
  try {
    // Read the file content
    const content = fs.readFileSync(file, 'utf8');
    
    // Extract the parameter name from the file path
    const pathParts = file.split(path.sep);
    const dynamicPart = pathParts.find(part => part.startsWith('[') && part.endsWith(']'));
    if (!dynamicPart) {
      console.log(`No dynamic segment found in path: ${file}`);
      return;
    }
    
    const paramName = dynamicPart.replace(/^\[|\]$/g, '');
    const typeName = `${paramName.charAt(0).toUpperCase() + paramName.slice(1)}Params`;
    
    // Check if the file already has the type
    if (content.includes(`type ${typeName}`)) {
      console.log(`File already has type ${typeName}: ${file}`);
      return;
    }
    
    // Add the type definition after imports
    let modified = content;
    const typeDefinition = `\n\ntype ${typeName} = { ${paramName}: string };\n`;
    
    const lastImport = content.lastIndexOf('import');
    if (lastImport !== -1) {
      const afterImports = content.indexOf('\n\n', lastImport);
      if (afterImports !== -1) {
        modified = content.slice(0, afterImports) + typeDefinition + content.slice(afterImports);
      } else {
        // If we can't find a blank line after imports, add the type after the file comment
        modified = content.replace(/(\/\/ filepath:[^\n]+\n)/, `$1${typeDefinition}`);
      }
    } else {
      // If no imports, add at the beginning of the file
      modified = typeDefinition + content;
    }
    
    // Update the route handlers
    modified = modified.replace(
      /\{\s*params\s*\}:\s*\{\s*params:\s*\{\s*[a-zA-Z0-9_]+:\s*string\s*\}\s*\}/g,
      `{ params }: { params: ${typeName} }`
    );
    
    // Write the changes back
    fs.writeFileSync(file, modified);
    console.log(`✓ Fixed ${file}`);
    fixedCount++;
  } catch (err) {
    console.error(`Error processing ${file}:`, err);
  }
});

console.log(`\nFixed ${fixedCount} of ${files.length} files`);
