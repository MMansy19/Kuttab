// Script to replace animation imports and usages with static versions
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const glob = require('glob');

console.log('Starting animation removal process...');

// Paths to search for files with animation imports or usage
const searchPaths = [
  './app/**/*.{ts,tsx}',
  './components/**/*.{ts,tsx}'
];

// Find files with framer-motion imports
function findAnimationFiles() {
  let files = [];
  searchPaths.forEach(pattern => {
    const matches = glob.sync(pattern, { cwd: process.cwd() });
    files = files.concat(matches);
  });
  
  console.log(`Found ${files.length} files to check for animation code`);
  return files;
}

// Replace framer-motion imports with StaticWrapper imports
function replaceImports(content) {
  // Replace AnimatePresence imports
  content = content.replace(
    /import\s+{\s*AnimatePresence\s*(?:,[\s\w,{}]*)?}\s+from\s+['"]@\/utils\/framer-motion['"];?/g,
    ''
  );
  
  // Replace motion imports
  content = content.replace(
    /import\s+{\s*motion\s*(?:,[\s\w,{}]*)?}\s+from\s+['"]@\/utils\/framer-motion['"];?/g,
    ''
  );
  
  // Replace AnimationWrapper imports with StaticWrapper
  content = content.replace(
    /import\s+AnimationWrapper\s+from\s+['"]@\/components\/ui\/AnimationWrapper['"];?/g,
    'import StaticWrapper from "@/components/ui/StaticWrapper";'
  );
  
  // Replace any other framer-motion specific imports
  content = content.replace(
    /import\s+.*?\s+from\s+['"]framer-motion['"];?/g,
    ''
  );
  
  return content;
}

// Replace animation usage with static equivalents
function replaceUsage(content) {
  // Replace AnimatePresence tags
  content = content.replace(/<AnimatePresence[^>]*>([\s\S]*?)<\/AnimatePresence>/g, '$1');
  
  // Replace motion.div and other motion elements
  content = content.replace(/<motion\.([a-z]+)([^>]*?)>([\s\S]*?)<\/motion\.\1>/gi, (_, tag, props, children) => {
    // Remove animation-specific props
    const cleanProps = props.replace(/\s+(initial|animate|exit|transition|variants)=\{[^}]*\}/g, '');
    return `<${tag}${cleanProps}>${children}</${tag}>`;
  });
  
  // Replace AnimationWrapper with StaticWrapper
  content = content.replace(/<AnimationWrapper([^>]*)>([\s\S]*?)<\/AnimationWrapper>/g, '<StaticWrapper$1>$2</StaticWrapper>');
  
  // Remove any remaining animation-specific code
  content = content.replace(/variants=\{[^}]*\}/g, '');
  content = content.replace(/initial=\{[^}]*\}/g, '');
  content = content.replace(/animate=\{[^}]*\}/g, '');
  content = content.replace(/exit=\{[^}]*\}/g, '');
  content = content.replace(/transition=\{[^}]*\}/g, '');
  
  return content;
}

// Process each file
function processFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const originalContent = content;
    
    // Check if file has animation imports
    if (content.includes('framer-motion') || 
        content.includes('AnimationWrapper') || 
        content.includes('motion.') ||
        content.includes('AnimatePresence')) {
      
      // Replace imports and usage
      let newContent = replaceImports(content);
      newContent = replaceUsage(newContent);
      
      // Check if any changes were made
      if (newContent !== originalContent) {
        fs.writeFileSync(filePath, newContent, 'utf8');
        console.log(`✓ Updated ${filePath}`);
        return true;
      }
    }
    return false;
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error.message);
    return false;
  }
}

// Main execution
const files = findAnimationFiles();
let updatedCount = 0;

files.forEach(file => {
  const updated = processFile(path.join(process.cwd(), file));
  if (updated) updatedCount++;
});

console.log(`\nAnimation removal complete. Updated ${updatedCount} files.`);
console.log('You may still need to manually check components that used animations to ensure proper styling.');
