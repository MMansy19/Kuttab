#!/usr/bin/env node

/**
 * This script cleans up the old sitemap XML route files
 * that are no longer needed after migrating to the proper Next.js sitemap structure
 */

const fs = require('fs');
const path = require('path');

// Directories to remove
const directoriesForRemoval = [
  'app/sitemap-auth.xml',
  'app/sitemap-courses.xml',
  'app/sitemap-teachers.xml',
  'app/sitemap-main.xml',
];

console.log('🧹 Cleaning up old sitemap route directories...');

// Loop through each directory and remove it
directoriesForRemoval.forEach(dir => {
  const dirPath = path.join(process.cwd(), dir);
  
  try {
    if (fs.existsSync(dirPath)) {
      // First remove the route.ts file inside
      const routeFilePath = path.join(dirPath, 'route.ts');
      if (fs.existsSync(routeFilePath)) {
        fs.unlinkSync(routeFilePath);
        console.log(`✅ Deleted file: ${routeFilePath}`);
      }
      
      // Then try to remove the directory
      fs.rmdirSync(dirPath);
      console.log(`✅ Removed directory: ${dirPath}`);
    } else {
      console.log(`⏭️ Directory doesn't exist, skipping: ${dirPath}`);
    }
  } catch (error) {
    console.error(`❌ Error removing ${dirPath}: ${error.message}`);
  }
});

console.log('✨ Cleanup complete');
