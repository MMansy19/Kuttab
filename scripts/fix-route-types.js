/**
 * This script patches the Next.js App Router type definitions to fix route params typing issues
 */
const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Colors for console output
const colors = {
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  red: '\x1b[31m',
  reset: '\x1b[0m'
};

console.log(`${colors.blue}🔄 Fixing Next.js App Router route types...${colors.reset}`);

// Search for route.ts files in the .next/types directory
const routeTypeFiles = glob.sync('.next/types/app/**/**/route.ts');

// Fix that needs to be applied: change Promise<SegmentParams> to just SegmentParams
const typeFix = routeTypeFiles.map(filePath => {
  console.log(`${colors.yellow}Processing: ${filePath}${colors.reset}`);
  
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Apply fixes
    const fixed = content
      // Fix RouteContext definition to use plain object instead of Promise
      .replace(
        /type RouteContext = \{ params: Promise<SegmentParams> \}/g, 
        'type RouteContext = { params: SegmentParams }'
      )
      // Fix ParamCheck type to handle both Promise and direct object
      .replace(
        /type ParamCheck<T> = \{\s+__tag__: string\s+__param_position__: string\s+__param_type__: T\s+\}/g,
        `type ParamCheck<T> = {
  __tag__: string
  __param_position__: string
  __param_type__: T extends { params: infer P } 
    ? { params: P extends Promise<infer U> ? U : P }
    : T
}`
      )
      // Fix PageProps and LayoutProps interfaces
      .replace(
        /export interface PageProps \{\s+params\?: Promise<SegmentParams>\s+searchParams\?: Promise<any>\s+\}/g,
        'export interface PageProps {\n  params?: SegmentParams\n  searchParams?: any\n}'
      )
      .replace(
        /export interface LayoutProps \{\s+children\?: React.ReactNode\s+\s+params\?: Promise<SegmentParams>\s+\}/g,
        'export interface LayoutProps {\n  children?: React.ReactNode\n  params?: SegmentParams\n}'
      );
    
    // Only write if changes were made
    if (content !== fixed) {
      fs.writeFileSync(filePath, fixed, 'utf8');
      return { file: filePath, fixed: true };
    } else {
      return { file: filePath, fixed: false };
    }
  } catch (err) {
    console.error(`${colors.red}Error processing ${filePath}:${colors.reset}`, err);
    return { file: filePath, error: err.message };
  }
});

// Summary
const fixedCount = typeFix.filter(result => result.fixed).length;
const errorCount = typeFix.filter(result => result.error).length;

console.log(`${colors.green}✅ Fixed ${fixedCount} route type files${colors.reset}`);
if (errorCount > 0) {
  console.log(`${colors.red}⚠️ Encountered errors in ${errorCount} files${colors.reset}`);
}
console.log(`${colors.blue}Type fixing complete!${colors.reset}`);