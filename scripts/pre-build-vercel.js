/**
 * pre-build-vercel.js
 * 
 * This script runs before the build process on Vercel to ensure proper setup
 */
console.log('Running pre-build vercel script...');

// 1. Fix route types
require('./fix-all-api-route-handlers');

// 2. Clean generated types
const fs = require('fs');
const path = require('path');
const { rimraf } = require('rimraf');

const typesDir = path.join(process.cwd(), '.next', 'types');
if (fs.existsSync(typesDir)) {
  console.log(`Cleaning types directory: ${typesDir}`);
  rimraf(typesDir);
}

// 3. Apply specific fixes to problematic files
const bookingsIdRoutePath = path.join(process.cwd(), 'app', 'api', 'bookings', '[id]', 'route.ts');
if (fs.existsSync(bookingsIdRoutePath)) {
  console.log(`Checking and fixing ${bookingsIdRoutePath}`);
  
  let content = fs.readFileSync(bookingsIdRoutePath, 'utf8');
  
  // Remove BookingParams type if it exists
  const typeRegex = /type\s+BookingParams\s+=\s+{\s+id:\s+string\s*};?/;
  if (typeRegex.test(content)) {
    console.log('Removing BookingParams type...');
    content = content.replace(typeRegex, '');
    fs.writeFileSync(bookingsIdRoutePath, content);
  }
  
  // Ensure all handlers use correct param format
  const handlerRegex = /export\s+async\s+function\s+(GET|POST|PUT|PATCH|DELETE)\s*\(\s*request:\s*NextRequest,\s*(?:context:\s*)?{\s*params(?:\s*):\s*(?:{[^}]*}|[^}]*)\s*}\s*\)/g;
  
  if (handlerRegex.test(content)) {
    console.log('Fixing route handler signatures...');
    content = content.replace(handlerRegex, (match, method) => {
      return `export async function ${method}(\n  request: NextRequest,\n  { params }: { params: { id: string } }\n)`;
    });
    fs.writeFileSync(bookingsIdRoutePath, content);
  }
}

console.log('Pre-build vercel script completed successfully');
