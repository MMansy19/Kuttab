/**
 * find-corrupt-json.js
 * 
 * This script scans the project for JSON files and identifies any that are corrupted
 * or malformed. It tries to fix them if possible.
 */
const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Directories to exclude from scanning
const excludeDirs = [
  'node_modules',
  '.next',
  '.git',
  'build-output',
  '.next-build',
  '.next-temp'
];

// Function to check if a JSON file is valid
function isValidJSON(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    JSON.parse(content);
    return true;
  } catch (error) {
    return { error: error.message };
  }
}

// Function to attempt to fix a JSON file
function tryFixJSON(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Common JSON corruption issues
    let fixedContent = content
      // Fix trailing commas
      .replace(/,\s*}/g, '}')
      .replace(/,\s*\]/g, ']')
      // Fix missing brackets
      .replace(/}\s*{/g, '},{')
      // Fix missing quotes around property names
      .replace(/([{,]\s*)([a-zA-Z0-9_]+)(\s*:)/g, '$1"$2"$3');
    
    // Try to parse the fixed content
    try {
      JSON.parse(fixedContent);
      // Save the fixed content
      fs.writeFileSync(filePath, fixedContent);
      return true;
    } catch (parseError) {
      // If automatic fixing fails, try a more aggressive approach
      try {
        // For extreme cases, try to extract valid JSON
        const match = content.match(/{[\s\S]*}/);
        if (match) {
          const extractedJSON = match[0];
          JSON.parse(extractedJSON); // Test if valid
          fs.writeFileSync(filePath, extractedJSON);
          return true;
        }
      } catch (extractError) {
        // If all attempts fail, return false
        return false;
      }
    }
  } catch (error) {
    return false;
  }
}

console.log('Scanning for JSON files...');

// Use glob to find all JSON files, excluding specified directories
const excludePattern = excludeDirs.map(dir => `**/${dir}/**`).join('|');
const jsonFiles = glob.sync('**/*.json', {
  ignore: excludePattern
});

console.log(`Found ${jsonFiles.length} JSON files to check.`);

const corruptFiles = [];
const fixedFiles = [];

// Check each JSON file
jsonFiles.forEach(filePath => {
  const result = isValidJSON(filePath);
  
  if (result !== true) {
    console.log(`❌ Corrupt JSON found in: ${filePath}`);
    console.log(`   Error: ${result.error}`);
    
    // Try to fix the file
    const fixed = tryFixJSON(filePath);
    if (fixed) {
      console.log(`✅ Successfully fixed: ${filePath}`);
      fixedFiles.push(filePath);
    } else {
      console.log(`⚠️ Could not automatically fix: ${filePath}`);
      corruptFiles.push(filePath);
    }
  }
});

// Print summary
console.log('\n--- Summary ---');
console.log(`Total JSON files checked: ${jsonFiles.length}`);
console.log(`Corrupt files found: ${corruptFiles.length + fixedFiles.length}`);
console.log(`Files successfully fixed: ${fixedFiles.length}`);
console.log(`Files that need manual attention: ${corruptFiles.length}`);

if (corruptFiles.length > 0) {
  console.log('\nThe following files need manual attention:');
  corruptFiles.forEach(file => console.log(`- ${file}`));
}
