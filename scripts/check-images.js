const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const glob = require('glob');

console.log('📸 Starting image optimization process...');

// Define image directories to optimize
const imageDirs = [
  './public/images',
];

// Check if sharp is installed (used by Next.js for image optimization)
try {
  require.resolve('sharp');
  console.log('✅ Sharp is installed - Next.js image optimization will work properly');
} catch (e) {
  console.log('⚠️ Sharp is not installed. Installing now...');
  try {
    execSync('npm install sharp', { stdio: 'inherit' });
    console.log('✅ Sharp installed successfully');
  } catch (error) {
    console.error('❌ Failed to install sharp. This may affect image optimization:', error.message);
  }
}

// Check if next/image components are using the loading="lazy" attribute
function checkImageComponents() {
  console.log('\n🔍 Checking Next.js Image components...');
  
  const files = glob.sync('./app/**/*.{js,jsx,ts,tsx}', { cwd: process.cwd() })
    .concat(glob.sync('./components/**/*.{js,jsx,ts,tsx}', { cwd: process.cwd() }));
  
  let imagesWithoutLazy = 0;
  let totalNextImages = 0;
  
  files.forEach(file => {
    try {
      const content = fs.readFileSync(path.join(process.cwd(), file), 'utf8');
      
      // Count Image components
      const imageMatches = content.match(/<Image[^>]*>/g) || [];
      totalNextImages += imageMatches.length;
      
      // Count Image components without loading="lazy"
      const nonLazyImages = imageMatches.filter(img => 
        !img.includes('loading="lazy"') && 
        !img.includes("loading='lazy'") && 
        !img.includes('priority') && 
        !img.includes("priority={true}")
      );
      
      imagesWithoutLazy += nonLazyImages.length;
      
      if (nonLazyImages.length > 0) {
        console.log(`  ⚠️ ${file} has ${nonLazyImages.length} Image components without lazy loading`);
      }
    } catch (error) {
      console.error(`  ❌ Error checking ${file}:`, error.message);
    }
  });
  
  console.log(`\n📊 Image Component Summary: ${imagesWithoutLazy} of ${totalNextImages} Next.js Image components need lazy loading attribute`);
}

// Check for regular img tags that should be converted to next/image
function checkRegularImgTags() {
  console.log('\n🔍 Checking for regular <img> tags that should be converted to Next.js Image...');
  
  const files = glob.sync('./app/**/*.{js,jsx,ts,tsx}', { cwd: process.cwd() })
    .concat(glob.sync('./components/**/*.{js,jsx,ts,tsx}', { cwd: process.cwd() }));
  
  let regularImgTags = 0;
  
  files.forEach(file => {
    try {
      const content = fs.readFileSync(path.join(process.cwd(), file), 'utf8');
      
      // Count regular img tags
      const imgMatches = content.match(/<img[^>]*>/g) || [];
      regularImgTags += imgMatches.length;
      
      if (imgMatches.length > 0) {
        console.log(`  ⚠️ ${file} has ${imgMatches.length} regular <img> tags that should be converted to Next.js Image`);
      }
    } catch (error) {
      console.error(`  ❌ Error checking ${file}:`, error.message);
    }
  });
  
  console.log(`\n📊 Regular Image Tags: ${regularImgTags} <img> tags should be converted to Next.js Image components`);
}

// Main function
function main() {
  // Check Next.js Image components
  checkImageComponents();
  
  // Check for regular img tags
  checkRegularImgTags();
  
  console.log('\n✅ Image optimization check complete');
}

main();
