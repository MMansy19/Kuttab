/**
 * Pre-build script for Vercel build process
 * Run this before the Next.js build process on Vercel
 */
const fs = require('fs');
const path = require('path');

/**
 * Verify sitemap files exist in the proper locations
 */
function verifySitemapFiles() {
  const sitemapFiles = [
    'app/sitemap.ts',
    'app/teachers/sitemap.ts',
    'app/courses/sitemap.ts',
    'app/auth/sitemap.ts',
    'app/sitemap-index.ts'
  ];
  
  console.log('🔍 Verifying sitemap files...');
  
  let allFilesExist = true;
  
  sitemapFiles.forEach(filePath => {
    try {
      const fullPath = path.join(process.cwd(), filePath);
      if (fs.existsSync(fullPath)) {
        console.log(`✅ Found sitemap file: ${filePath}`);
      } else {
        console.warn(`⚠️ Missing sitemap file: ${filePath}`);
        allFilesExist = false;
      }
    } catch (error) {
      console.error(`❌ Error checking ${filePath}: ${error.message}`);
    }
  });
  
  return allFilesExist;
}

// Run checks
try {
  const sitemapsValid = verifySitemapFiles();
  console.log(sitemapsValid 
    ? '✅ All sitemap files are in place' 
    : '⚠️ Some sitemap files are missing - build may fail');
  console.log('✅ Pre-build checks completed');
} catch (error) {
  console.error('❌ Error during pre-build checks:', error);
  // Don't fail the build for sitemap issues
}
