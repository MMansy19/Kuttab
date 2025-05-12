const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const glob = require('glob');

console.log('🖼️ Starting WebP image conversion...');

// Check if sharp is installed
try {
  require.resolve('sharp');
} catch (e) {
  console.log('⚠️ Sharp is not installed. Installing now...');
  try {
    execSync('npm install sharp', { stdio: 'inherit' });
  } catch (error) {
    console.error('❌ Failed to install sharp:', error.message);
    process.exit(1);
  }
}

// Import sharp
const sharp = require('sharp');

// Define image directories to process
const imageDirs = [
  './public/images',
];

// Create WebP versions of all images
async function convertToWebP() {
  console.log('\n🔄 Converting images to WebP format...');
  
  let totalConverted = 0;
  let totalFailed = 0;
  
  for (const dir of imageDirs) {
    const imageFiles = glob.sync(path.join(dir, '**/*.{jpg,jpeg,png}'), { cwd: process.cwd() });
    
    console.log(`\nFound ${imageFiles.length} images in ${dir}`);
    
    for (const file of imageFiles) {
      const outputFile = file.replace(/\.(jpg|jpeg|png)$/i, '.webp');
      
      // Skip if WebP already exists
      if (fs.existsSync(outputFile)) {
        console.log(`  ⏩ Skipping ${file} - WebP version already exists`);
        continue;
      }
      
      try {
        await sharp(file)
          .webp({ quality: 80 }) // 80% quality offers good balance
          .toFile(outputFile);
          
        console.log(`  ✅ Converted: ${file} → ${outputFile}`);
        totalConverted++;
      } catch (error) {
        console.error(`  ❌ Failed to convert ${file}:`, error.message);
        totalFailed++;
      }
    }
  }
  
  console.log(`\n📊 Conversion Summary: ${totalConverted} images converted to WebP, ${totalFailed} failed`);
}

// Main execution
async function main() {
  try {
    await convertToWebP();
    console.log('\n✅ WebP conversion complete!');
  } catch (error) {
    console.error('❌ An error occurred:', error);
  }
}

main();
