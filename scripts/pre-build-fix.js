/**
 * Pre-build script for Vercel build process
 * Run this before the Next.js build process on Vercel
 */
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

/**
 * Run performance optimization scripts
 */
function runOptimizationScripts() {
  console.log('🚀 Running performance optimization scripts...');
  
  try {
    // Convert images to WebP/AVIF
    console.log('📷 Optimizing images...');
    execSync('node scripts/convert-to-webp.js', { stdio: 'inherit' });
    
    console.log('✅ Optimization scripts completed successfully!');
  } catch (error) {
    console.warn('⚠️ Error running optimization scripts:', error.message);
    console.log('Continuing with build process...');
  }
}

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
