/**
 * Pre-build script to fix sitemap and route handler compatibility
 * Run this before the Next.js build process on Vercel
 */
const fs = require('fs');
const path = require('path');

/**
 * Add export directive to sitemap route handlers
 */
function fixSitemapExports() {
  const sitemapFiles = [
    'app/sitemap-auth.xml/route.ts',
    'app/sitemap-teachers.xml/route.ts',
    'app/sitemap-main.xml/route.ts',
    'app/sitemap-courses.xml/route.ts'
  ];
  
  console.log('🔧 Fixing sitemap exports for Vercel compatibility...');
  
  sitemapFiles.forEach(filePath => {
    try {
      const fullPath = path.join(process.cwd(), filePath);
      if (fs.existsSync(fullPath)) {
        let content = fs.readFileSync(fullPath, 'utf8');
        
        // Add export type declaration if it doesn't exist
        if (!content.includes('export type')) {
          content = content + `\n\n// Type declaration to fix Vercel build issues\nexport type SitemapRoute = {};\n`;
          fs.writeFileSync(fullPath, content);
          console.log(`✅ Added type export to ${filePath}`);
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
