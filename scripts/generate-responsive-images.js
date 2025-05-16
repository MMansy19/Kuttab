const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const glob = require('glob');

console.log('🖼️ Starting responsive image generation...');

// Check if sharp is installed
try {
  require.resolve('sharp');
} catch (e) {
  console.log('⚠️ Sharp is not installed. Installing now...');
  try {
    execSync('npm install --save-dev sharp', { stdio: 'inherit' });
  } catch (error) {
    console.error('❌ Failed to install sharp:', error.message);
    process.exit(1);
  }
}

// Define image directories to process
const imageDirs = [
  './public/images',
];

// Define the breakpoints for responsive images (should match next.config.js)
const breakpoints = [320, 480, 640, 750, 828, 1080, 1200, 1920];

// Function to generate responsive versions of images
async function generateResponsiveImages() {
  console.log('\n🔄 Generating responsive image versions...');

  let processedCount = 0;
  let successCount = 0;
  let errorCount = 0;
  let bytesReduction = 0;
  
  for (const dir of imageDirs) {
    // Look only for original images (not already resized versions)
    const files = glob.sync(`${dir}/**/!(*.avif|*.webp|*-*w.*).(png|jpg|jpeg|gif)`);
    
    for (const file of files) {
      processedCount++;
      
      try {
        // Get original file size
        const originalStats = fs.statSync(file);
        const originalSize = originalStats.size;
        
        // Get image metadata
        const metadata = await sharp(file).metadata();
        const { width } = metadata;
        
        // Only create responsive sizes for images larger than the smallest breakpoint
        if (width > breakpoints[0]) {
          // Determine which breakpoints we need to create
          const neededBreakpoints = breakpoints.filter(bp => bp < width);
          
          for (const bp of neededBreakpoints) {
            const ext = path.extname(file);
            const basename = path.basename(file, ext);
            const dirname = path.dirname(file);
            
            // Create filename for the resized image
            const resizedFile = path.join(dirname, `${basename}-${bp}w${ext}`);
            
            // Skip if already exists
            if (fs.existsSync(resizedFile)) {
              continue;
            }
            
            // Resize the image
            await sharp(file)
              .resize({
                width: bp,
                withoutEnlargement: true,
                fit: 'inside'
              })
              .toFile(resizedFile);
                
            console.log(`✅ Created: ${resizedFile}`);
            
            // Convert to WebP
            const webpFile = path.join(dirname, `${basename}-${bp}w.webp`);
            
            await sharp(file)
              .resize({
                width: bp,
                withoutEnlargement: true,
                fit: 'inside'
              })
              .webp({ quality: 80 })
              .toFile(webpFile);
              
            console.log(`✅ Created: ${webpFile}`);
            
            // Calculate bytes saved
            const webpStats = fs.statSync(webpFile);
            const webpSize = webpStats.size;
            bytesReduction += originalSize - webpSize;
            
            // Convert to AVIF for modern browsers
            const avifFile = path.join(dirname, `${basename}-${bp}w.avif`);
            
            await sharp(file)
              .resize({
                width: bp,
                withoutEnlargement: true,
                fit: 'inside'
              })
              .avif({ quality: 70 })
              .toFile(avifFile);
              
            console.log(`✅ Created: ${avifFile}`);
            
            // Calculate bytes saved
            const avifStats = fs.statSync(avifFile);
            const avifSize = avifStats.size;
            bytesReduction += originalSize - avifSize;
          }
        }
        
        // Also ensure WebP and AVIF versions of the original exist
        const ext = path.extname(file);
        const basename = path.basename(file, ext);
        const dirname = path.dirname(file);
        
        const webpFile = path.join(dirname, `${basename}.webp`);
        if (!fs.existsSync(webpFile)) {
          await sharp(file)
            .webp({ quality: 80 })
            .toFile(webpFile);
          console.log(`✅ Created: ${webpFile}`);
        }
        
        const avifFile = path.join(dirname, `${basename}.avif`);
        if (!fs.existsSync(avifFile)) {
          await sharp(file)
            .avif({ quality: 70 })
            .toFile(avifFile);
          console.log(`✅ Created: ${avifFile}`);
        }
        
        successCount++;
      } catch (error) {
        console.error(`❌ Error processing ${file}:`, error.message);
        errorCount++;
      }
    }
  }
  
  const mbSaved = (bytesReduction / (1024 * 1024)).toFixed(2);
  console.log(`\n🎉 Processing complete! ${successCount}/${processedCount} images processed successfully.`);
  console.log(`💾 Total space saved: ${mbSaved} MB`);
  if (errorCount > 0) {
    console.log(`⚠️ ${errorCount} errors encountered.`);
  }
}

// Execute the conversion
generateResponsiveImages().catch(err => {
  console.error('❌ An error occurred during processing:', err);
  process.exit(1);
});
