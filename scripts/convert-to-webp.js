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
  './public/images', // your images directory
];

// all images that need  optimization
const criticalImages = [
  'image1.png',
  'image2.png',
  // ... 
];

// Quality settings
const defaultQuality = 80;
const criticalQuality = 75; // Slightly more aggressive compression for critical images
const backgroundQuality = 65; // More aggressive for patterns/backgrounds

// Create WebP and AVIF versions of all images
async function convertToWebP() {
  console.log('\n🔄 Converting images to WebP and AVIF formats...');

  let processedCount = 0;
  let successCount = 0;
  let errorCount = 0;
  
  for (const dir of imageDirs) {
    const files = glob.sync(`${dir}/**/*.{png,jpg,jpeg,gif}`);
    
    for (const file of files) {
      const filename = path.basename(file);
      const isCritical = criticalImages.includes(filename);
      const isPattern = filename.includes('pattern');
      
      // Determine appropriate quality based on image type
      let quality = defaultQuality;
      if (isCritical) quality = criticalQuality;
      if (isPattern) quality = backgroundQuality;
      
      const webpOutput = file.replace(/\.(png|jpg|jpeg|gif)$/i, '.webp');
      const avifOutput = file.replace(/\.(png|jpg|jpeg|gif)$/i, '.avif');
      
      processedCount++;
      
      try {
        // Process as WebP
        await sharp(file)
          .webp({ quality })
          .toFile(webpOutput);
          
        // Process as AVIF
        await sharp(file)
          .avif({ quality })
          .toFile(avifOutput);
          
        console.log(`✅ Converted: ${file} -> WebP and AVIF (${isCritical ? 'CRITICAL' : 'standard'} quality: ${quality})`);
        successCount++;
      } catch (error) {
        console.error(`❌ Error converting ${file}:`, error.message);
        errorCount++;
      }
    }
  }
  
  console.log(`\n🎉 Conversion complete! ${successCount}/${processedCount} images processed successfully. ${errorCount} errors.`);
}

// Execute the conversion
convertToWebP().catch(err => {
  console.error('❌ An error occurred during conversion:', err);
  process.exit(1);
});
