/**
 * fix-all-api-route-handlers.js
 * 
 * This script updates all Next.js App Router API route handlers to use the correct 
 * type signature required by Next.js 15. It fixes the dynamic route param issues
 * that can cause TypeScript errors during build.
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Main function to process route handler files
async function main() {
  try {
    console.log('Scanning for API route handler files...');
    console.log('Current directory:', process.cwd());
    
    // Find all API route files
    const routeFiles = glob.sync('app/api/**/route.ts', { absolute: true });
    console.log(`Found ${routeFiles.length} route handler files`);
    
    let fixedCount = 0;
    
    // Also check and fix types/next-route-handler-fix.d.ts if it exists
    const typeFixFile = path.join(process.cwd(), 'types', 'next-route-handler-fix.d.ts');
    if (fs.existsSync(typeFixFile)) {
      console.log(`Found type definitions file: ${typeFixFile}`);
      
      const typeContent = fs.readFileSync(typeFixFile, 'utf8');
      let newTypeContent = typeContent;
      
      // Update custom param type references in the type definition file
      newTypeContent = newTypeContent.replace(
        /interface\s+(\w+Params)\s+{\s+\w+:\s+string[^}]*}/g,
        (match, typeName) => {
          console.log(`Removing interface ${typeName} from type definitions`);
          return '';
        }
      );
      
      // Update route handler signatures in type definition
      newTypeContent = newTypeContent.replace(
        /context:\s*{\s*params:\s*\w+Params\s*}/g,
        '{ params }: { params: { id: string } }'
      );
      
      if (newTypeContent !== typeContent) {
        fs.writeFileSync(typeFixFile, newTypeContent);
        console.log(`✓ Fixed type definitions in ${typeFixFile}`);
        fixedCount++;
      }
    }
    
    for (const filePath of routeFiles) {
      console.log(`Processing ${filePath}...`);
      
      // Read file content
      const content = fs.readFileSync(filePath, 'utf8');
      let newContent = content;
      
      // Check if file imports Next.js types from old paths
      if (content.includes('next/dist/server/web/spec-extension/request') || 
          content.includes('next/dist/server/web/spec-extension/response')) {
        console.log(`Fixing imports in ${filePath}`);
        
        // Update imports
        newContent = newContent.replace(
          /import\s+{\s*(?:type\s+)?NextRequest\s+}\s+from\s+['"]next\/dist\/server\/web\/spec-extension\/request['"];?/g,
          `import { NextRequest } from 'next/server';`
        );
        
        newContent = newContent.replace(
          /import\s+{\s*(?:type\s+)?NextResponse\s+}\s+from\s+['"]next\/dist\/server\/web\/spec-extension\/response['"];?/g,
          `import { NextResponse } from 'next/server';`
        );
      }
      
      // Check if file has dynamic route handlers with 'context' parameter
      if (newContent.includes('context: { params:') || newContent.includes('context: {params:')) {
        console.log(`Fixing route handler signatures in ${filePath}`);
        
        // Update route handler signatures
        newContent = newContent.replace(
          /(\s*export\s+async\s+function\s+(?:GET|POST|PUT|PATCH|DELETE)\s*\(\s*[^,)]+,\s*)context:\s*{\s*params:\s*{([^}]*)}\s*}\s*\)/g,
          '$1{ params }: { params: {$2} })'
        );
        
        // Update references from context.params.X to params.X
        newContent = newContent.replace(/context\.params\./g, 'params.');
      }
      
      // Check if file has custom param types
      const customParamTypeMatch = /type\s+(\w+Params)\s+=\s+{\s+\w+:\s+string[^}]*};/.exec(newContent);
      if (customParamTypeMatch) {
        const typeName = customParamTypeMatch[1];
        console.log(`Found custom param type: ${typeName}`);
        
        // If a custom type exists, replace { params: TypeName } with { params: { id: string } }
        newContent = newContent.replace(
          new RegExp(`{\\s*params\\s*}:\\s*{\\s*params:\\s*${typeName}\\s*}`, 'g'),
          '{ params }: { params: { id: string } }'
        );
        
        // Remove custom param type definition to prevent confusion
        newContent = newContent.replace(
          new RegExp(`type\\s+${typeName}\\s+=\\s+{\\s+\\w+:\\s+string[^}]*};\\s*\\n?`),
          ''
        );
      }
      
      // Write changes if content was modified
      if (newContent !== content) {
        fs.writeFileSync(filePath, newContent);
        console.log(`✓ Fixed ${filePath}`);
        fixedCount++;
      } else {
        console.log(`No changes needed for ${filePath}`);
      }
    }
    
    console.log(`\nSummary: Fixed ${fixedCount} of ${routeFiles.length} route handler files`);
    
    if (fixedCount > 0) {
      console.log(`\nNext steps:
1. Run 'npm run build' or 'next build' to verify that the TypeScript errors are resolved
2. If you still encounter TypeScript errors, check the problematic files manually`);
    }
    
  } catch (error) {
    console.error('Error:', error);
  }
}

// Run the script
main().catch(err => {
  console.error('Error running script:', err);
  process.exit(1);
});
