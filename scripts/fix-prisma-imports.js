/**
 * This script fixes Prisma client import issues in Next.js
 * by directly linking to the generated Prisma client path.
 */
const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Find all TypeScript and JavaScript files that might import Prisma
function findFilesWithPrismaImports() {
  return glob.sync(['app/**/*.{ts,tsx,js,jsx}', 'lib/**/*.{ts,tsx,js,jsx}'], {
    ignore: ['node_modules/**', '.next/**'],
    cwd: process.cwd(),
  });
}

// Check if a file imports Prisma client directly
function hasPrismaImport(content) {
  return content.includes('from \'@prisma/client\'') || 
         content.includes('from "@prisma/client"');
}

// Replace the import with the correct path
function fixPrismaImport(content) {
  // Determine the relative path based on file location
  const updatedContent = content
    .replace(
      /from ['"]@prisma\/client['"]/g, 
      'from \'../prisma/generated/prisma-client\''
    )
    .replace(
      /import \{ PrismaClient \}/g,
      'import { PrismaClient }'
    );
  
  return updatedContent;
}

// Main function
function main() {
  console.log('🔍 Scanning for files with Prisma imports...');
  
  const files = findFilesWithPrismaImports();
  let fixedCount = 0;
  
  files.forEach(filePath => {
    const fullPath = path.join(process.cwd(), filePath);
    const content = fs.readFileSync(fullPath, 'utf8');
    
    if (hasPrismaImport(content)) {
      console.log(`📝 Fixing imports in ${filePath}`);
      const updatedContent = fixPrismaImport(content);
      
      if (content !== updatedContent) {
        fs.writeFileSync(fullPath, updatedContent, 'utf8');
        fixedCount++;
      }
    }
  });
  
  console.log(`✅ Fixed Prisma imports in ${fixedCount} files`);
}

main();
