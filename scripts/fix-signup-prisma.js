/**
 * This script applies a targeted fix for the Prisma client import issue
 * in the auth signup API route, which is causing build errors.
 */
const fs = require('fs');
const path = require('path');

// Path to the auth signup route
const SIGNUP_ROUTE_PATH = path.join(process.cwd(), 'app', 'api', 'auth', 'signup', 'route.ts');

// Fix the Prisma import in the signup route
function fixSignupRoute() {
  try {
    if (!fs.existsSync(SIGNUP_ROUTE_PATH)) {
      console.error(`❌ Signup route file not found at: ${SIGNUP_ROUTE_PATH}`);
      return false;
    }

    // Read the file content
    let content = fs.readFileSync(SIGNUP_ROUTE_PATH, 'utf8');

    // Check if it imports from '@prisma/client'
    if (content.includes('from \'@prisma/client\'') || content.includes('from "@prisma/client"')) {
      console.log('🔧 Fixing Prisma client import in auth signup route');
      
      // Replace the import with the correct path
      content = content.replace(
        /from ['"]@prisma\/client['"]/g,
        'from \'../../../../../prisma/generated/prisma-client\''
      );
      
      // Write the updated content back to the file
      fs.writeFileSync(SIGNUP_ROUTE_PATH, content, 'utf8');
      console.log('✅ Successfully fixed Prisma client import in auth signup route');
      return true;
    } else {
      console.log('✅ No Prisma client import found directly in auth signup route');
      return true;
    }
  } catch (error) {
    console.error('❌ Error fixing auth signup route:', error.message);
    return false;
  }
}

// Fix the lib/prisma.ts file
function fixPrismaLibFile() {
  const PRISMA_LIB_PATH = path.join(process.cwd(), 'lib', 'prisma.ts');
  
  try {
    if (!fs.existsSync(PRISMA_LIB_PATH)) {
      console.error(`❌ Prisma lib file not found at: ${PRISMA_LIB_PATH}`);
      return false;
    }

    // Read the file content
    let content = fs.readFileSync(PRISMA_LIB_PATH, 'utf8');

    // Check if it imports from '@prisma/client'
    if (content.includes('from \'@prisma/client\'') || content.includes('from "@prisma/client"')) {
      console.log('🔧 Fixing Prisma client import in lib/prisma.ts');
      
      // Replace the import with the correct path
      content = content.replace(
        /from ['"]@prisma\/client['"]/g,
        'from \'../prisma/generated/prisma-client\''
      );
      
      // Write the updated content back to the file
      fs.writeFileSync(PRISMA_LIB_PATH, content, 'utf8');
      console.log('✅ Successfully fixed Prisma client import in lib/prisma.ts');
      return true;
    } else {
      console.log('✅ No Prisma client import from @prisma/client found in lib/prisma.ts');
      return true;
    }
  } catch (error) {
    console.error('❌ Error fixing lib/prisma.ts:', error.message);
    return false;
  }
}

// Main function
(function main() {
  console.log('🚀 Starting targeted fix for Prisma client import issues');
  
  const signupResult = fixSignupRoute();
  const prismaLibResult = fixPrismaLibFile();
  
  if (signupResult && prismaLibResult) {
    console.log('✅ All targeted fixes applied successfully');
  } else {
    console.log('⚠️ Some fixes could not be applied');
  }
})();
