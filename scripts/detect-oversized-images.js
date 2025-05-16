/**
 * Script to detect oversized images on the site
 * Helps identify images that are much larger than their displayed size
 */
const fs = require('fs');
const path = require('path');
const glob = require('glob');
const sharp = require('sharp');
const imageSize = require('image-size');

console.log('🔍 Detecting oversized images...');

// Define common component display sizes - these are the typical rendered sizes
// based on UI component inspection
const componentImageSizes = {
  // Map component types to their typical display sizes
  'hero': { width: 480, height: 480 },
  'card': { width: 320, height: 200 },
  'avatar': { width: 96, height: 96 },
  'thumbnail': { width: 160, height: 120 },
  'icon': { width: 24, height: 24 },
  'logo': { width: 120, height: 40 },
  'banner': { width: 1200, height: 400 },
};

// Define image directories to scan
const imageDirs = ['./public/images'];

// Calculate how much an image is oversized
function getOversizedFactor(actualWidth, actualHeight, displayWidth, displayHeight) {
  const areaDifference = (actualWidth * actualHeight) / (displayWidth * displayHeight);
  return areaDifference;
}

// Check for oversized images
async function detectOversizedImages() {
  console.log('\n📏 Analyzing image dimensions...');
  
  let oversizedImages = [];
  let totalWastedBytes = 0;
  
  // Scan all image files
  for (const dir of imageDirs) {
    const files = glob.sync(`${dir}/**/*.{png,jpg,jpeg,gif,webp,avif}`);
    
    for (const file of files) {
      try {
        // Skip already processed responsive files
        if (file.includes('-') && (file.includes('w.webp') || file.includes('w.avif'))) {
          continue;
        }
        
        // Get image dimensions using sharp
        const metadata = await sharp(file).metadata();
        const { width, height } = metadata;
        
        // Get file size
        const stats = fs.statSync(file);
        const fileSizeInBytes = stats.size;
        
        // Try to identify image type based on path and filename
        const filename = path.basename(file);
        const imageType = Object.keys(componentImageSizes).find(type => 
          filename.toLowerCase().includes(type)
        ) || 'unknown';
        
        // Get typical display size for this image type
        const displaySize = componentImageSizes[imageType] || { width: 320, height: 240 }; // default
        
        // Calculate oversized factor
        const factor = getOversizedFactor(width, height, displaySize.width, displaySize.height);
        
        // Calculate wasted bytes (approximate)
        const wastedBytes = fileSizeInBytes - (fileSizeInBytes / factor);
        
        // If image is significantly oversized (4x or more)
        if (factor >= 4 && wastedBytes >= 4 * 1024) { // 4x factor and at least 4KB waste
          totalWastedBytes += wastedBytes;
          
          oversizedImages.push({
            file,
            actualWidth: width,
            actualHeight: height,
            recommendedWidth: displaySize.width,
            recommendedHeight: displaySize.height,
            sizeFactor: factor.toFixed(1),
            fileSize: (fileSizeInBytes / 1024).toFixed(1) + ' KB',
            wastedSize: (wastedBytes / 1024).toFixed(1) + ' KB',
            guessedType: imageType
          });
        }
      } catch (error) {
        console.error(`❌ Error analyzing ${file}:`, error.message);
      }
    }
  }
  
  // Report results
  if (oversizedImages.length > 0) {
    console.log(`\n⚠️ Found ${oversizedImages.length} potentially oversized images (wasting approximately ${(totalWastedBytes / (1024 * 1024)).toFixed(2)} MB):`);
    
    // Sort by wasted size
    oversizedImages.sort((a, b) => 
      parseFloat(b.wastedSize) - parseFloat(a.wastedSize)
    );
    
    // Display top 10 worst offenders
    oversizedImages.slice(0, 10).forEach((img, index) => {
      console.log(`\n${index + 1}. ${img.file}`);
      console.log(`   Actual: ${img.actualWidth}x${img.actualHeight}, Recommended: ${img.recommendedWidth}x${img.recommendedHeight}`);
      console.log(`   ${img.sizeFactor}x larger than needed, wasting ${img.wastedSize}`);
      console.log(`   Guessed usage: ${img.guessedType}`);
    });
    
    console.log(`\n💡 Recommendation: Run 'node scripts/generate-responsive-images.js' to automatically create properly sized versions.`);
  } else {
    console.log('✅ No significantly oversized images detected.');
  }
}

// Execute the detection
detectOversizedImages().catch(err => {
  console.error('❌ An error occurred during analysis:', err);
  process.exit(1);
});
