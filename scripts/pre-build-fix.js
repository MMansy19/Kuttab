/**
 * Pre-build script to fix sitemap and route handler compatibility
 * Run this before the Next.js build process on Vercel
 */
const fs = require('fs');
const path = require('path');

/**
 * Check sitemap files to ensure they use the metadata approach
 */
function fixSitemapExports() {
  const sitemapFiles = [
    'app/sitemap-auth.xml/route.ts',
    'app/sitemap-teachers.xml/route.ts',
    'app/sitemap-main.xml/route.ts',
    'app/sitemap-courses.xml/route.ts'
  ];
  
  console.log('🔧 Checking sitemap exports for Vercel compatibility...');
  
  sitemapFiles.forEach(filePath => {
    try {
      const fullPath = path.join(process.cwd(), filePath);
      if (fs.existsSync(fullPath)) {
        let content = fs.readFileSync(fullPath, 'utf8');
        
        // Remove any type exports if they exist as they're not needed with the metadata approach
        if (content.includes('export type SitemapRoute')) {
          content = content.replace(/\n\n\/\/ Type declaration to fix Vercel build issues\nexport type SitemapRoute = \{\};?\n?/g, '');
          fs.writeFileSync(fullPath, content);
          console.log(`✅ Removed unnecessary type export from ${filePath}`);
        }
      }
    } catch (error) {
      console.error(`❌ Error processing ${filePath}: ${error.message}`);
    }
  });
}

// Run fixes
try {
  fixSitemapExports();
  console.log('✅ Pre-build fixes completed');
} catch (error) {
  console.error('❌ Error during pre-build fixes:', error);
  process.exit(1);
}
