/**
 * This script validates that all critical build dependencies are correctly installed
 * and can be resolved in the current environment.
 */
const fs = require('fs');
const path = require('path');

// List of critical build dependencies that must be available
const CRITICAL_DEPENDENCIES = [
  'next',
  'tailwindcss',
  'postcss',
  'autoprefixer',
  'glob',
  '@prisma/client',
  'prisma'
];

console.log('🔍 Checking critical build dependencies...');
const missing = [];

for (const dep of CRITICAL_DEPENDENCIES) {
  try {
    require.resolve(dep);
    console.log(`✅ ${dep} is properly installed and available`);
  } catch (e) {
    console.log(`❌ ${dep} is NOT available: ${e.message}`);
    missing.push(dep);
  }
}

// Check for tailwindcss specifically in postcss.config.js
try {
  const postcssConfig = require(path.join(process.cwd(), 'postcss.config.js'));
  if (postcssConfig && postcssConfig.plugins && postcssConfig.plugins.tailwindcss) {
    console.log('✅ tailwindcss is configured in postcss.config.js');
  } else {
    console.log('⚠️ tailwindcss might not be properly configured in postcss.config.js');
  }
} catch (e) {
  console.log('⚠️ Could not validate postcss.config.js:', e.message);
}

// Summary
if (missing.length > 0) {
  console.error(`
⚠️ VALIDATION FAILED: The following critical dependencies are missing: 
${missing.join(', ')}

These dependencies are required for the build process. 
Please install them by running:
npm install --save-dev ${missing.join(' ')}
`);
  process.exit(1);
} else {
  console.log('✅ All critical build dependencies are properly installed');
}
