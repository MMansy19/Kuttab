/**
 * build-info.js
 * 
 * This script outputs important information about the build environment
 * to help debug issues with Prisma on Vercel.
 */

console.log('📋 Build Environment Info');
console.log('------------------------');

// System info
console.log('Node version:', process.version);
console.log('Platform:', process.platform);
console.log('Architecture:', process.arch);

// Environment variables (safely)
console.log('\n📝 Environment Variables:');
console.log('- DATABASE_URL:', process.env.DATABASE_URL ? '✓ SET' : '✗ NOT SET');
console.log('- NEXTAUTH_SECRET:', process.env.NEXTAUTH_SECRET ? '✓ SET' : '✗ NOT SET');
console.log('- NEXTAUTH_URL:', process.env.NEXTAUTH_URL ? '✓ SET' : '✗ NOT SET');
console.log('- VERCEL:', process.env.VERCEL ? '✓ SET' : '✗ NOT SET');
console.log('- NODE_ENV:', process.env.NODE_ENV);

// Get package info
try {
  const pkg = require('../package.json');
  console.log('\n📦 Package Info:');
  console.log('- Name:', pkg.name);
  console.log('- Version:', pkg.version);
  
  // List important dependencies
  console.log('\n📚 Dependencies:');
  console.log('- Next.js:', pkg.dependencies.next);
  console.log('- Prisma:', pkg.dependencies.prisma);
  console.log('- @prisma/client:', pkg.dependencies['@prisma/client']);
  console.log('- NextAuth.js:', pkg.dependencies['next-auth']);
} catch (error) {
  console.error('❌ Failed to load package.json:', error.message);
}

console.log('\n✅ Build info check complete');
