/**
 * This script adds security and SEO attributes to external links
 * by scanning all HTML files and adding rel="noopener noreferrer" to 
 * external links for better security and SEO
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Function to process HTML files
function processHTMLFiles() {
  console.log('🔒 Adding security attributes to external links...');
  
  // Get all HTML files from the build output
  const htmlFiles = glob.sync('.next/server/**/*.html');
  let updatedCount = 0;
  
  for (const file of htmlFiles) {
    try {
      let content = fs.readFileSync(file, 'utf8');
      
      // Regular expression to find external links without rel attributes
      const externalLinkRegex = /<a\s+(?:[^>]*?\s+)?href=["'](https?:\/\/[^"']+)["'](?![^>]*?\s+rel=["'][^"']*["'])[^>]*?>/gi;
      
      // Replace external links to add rel="noopener noreferrer"
      const updatedContent = content.replace(externalLinkRegex, (match, url) => {
        return match.replace(/<a\s+/, '<a rel="noopener noreferrer" ');
      });
      
      // Only write if changes were made
      if (content !== updatedContent) {
        fs.writeFileSync(file, updatedContent, 'utf8');
        updatedCount++;
      }
    } catch (error) {
      console.error(`Error processing ${file}:`, error.message);
    }
  }
  
  console.log(`✅ Added security attributes to ${updatedCount} files.`);
}

// Execute if called directly
if (require.main === module) {
  processHTMLFiles();
}

module.exports = {
  processHTMLFiles
};
