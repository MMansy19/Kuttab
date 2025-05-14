/**
 * fix-auth-build.js
 * 
 * This script helps resolve issues with authentication during the Next.js build process
 * by setting the appropriate environment variables to bypass authentication checks
 * during static page generation and by adding special handling for pages that use
 * authentication.
 */

const fs = require('fs');
const path = require('path');

// Paths that should have dynamic exports to prevent static generation issues
const authPaths = [
  'app/auth/login/page.tsx',
  'app/auth/signup/page.tsx',
  'app/auth/error/page.tsx',
  'app/contact/page.tsx',
  'app/dashboard/page.tsx',
];

console.log('🔧 Fixing auth build issues...');

// Check if we're running in a build environment
const isBuildEnv = process.env.NODE_ENV === 'production' || process.argv.includes('--build');

if (isBuildEnv) {
  console.log('📦 Running in build environment');
  
  // Set environment variable to indicate we're in a build process
  process.env.NEXT_PUBLIC_BUILD_MODE = 'true';
  process.env.NEXT_PUBLIC_SKIP_AUTH_CHECK = 'true';
  
  // Add dynamic exports to auth pages
  authPaths.forEach(pagePath => {
    const fullPath = path.join(process.cwd(), pagePath);
    
    if (fs.existsSync(fullPath)) {
      console.log(`Checking ${pagePath}...`);
      
      let content = fs.readFileSync(fullPath, 'utf8');
      
      // Check if dynamic exports already exist
      const hasExports = content.includes("export const dynamic = 'force-dynamic'");
      
      if (!hasExports) {
        console.log(`Adding dynamic exports to ${pagePath}`);
        
        const clientDirective = '"use client"';
        const exportLines = `
// These settings prevent static generation issues with session data
export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';
export const revalidate = 0;
`;
        
        // Insert after the "use client" directive
        if (content.includes(clientDirective)) {
          content = content.replace(
            clientDirective,
            `${clientDirective}\n${exportLines}`
          );
          
          fs.writeFileSync(fullPath, content, 'utf8');
          console.log(`✅ Successfully updated ${pagePath}`);
        } else {
          console.log(`⚠️ Couldn't find "use client" directive in ${pagePath}`);
        }
      } else {
        console.log(`✅ ${pagePath} already has dynamic exports`);
      }
    } else {
      console.log(`⚠️ File not found: ${fullPath}`);
    }
  });
  
  console.log('✅ Auth build fixes completed');
} else {
  console.log('ℹ️ Not in build environment, skipping auth fixes');
}