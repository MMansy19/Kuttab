/**
 * clean-types.js
 * This script removes the .next/types directory before building to prevent 
 * stale type errors from persisting between builds.
 */
const fs = require('fs');
const path = require('path');
const rimraf = require('rimraf');

const typesDir = path.join(process.cwd(), '.next', 'types');

console.log(`Cleaning Next.js types directory: ${typesDir}`);

if (fs.existsSync(typesDir)) {
  rimraf.sync(typesDir);
  console.log('Types directory removed successfully');
} else {
  console.log('Types directory does not exist, nothing to clean');
}

console.log('Proceeding with build...');
