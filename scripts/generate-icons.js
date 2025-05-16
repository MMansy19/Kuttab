/* This script generates icon files for the Kottab PWA
 * It converts the logo.svg to various sizes of PNG files for PWA icons
 */
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

console.log('🔄 Generating PWA icons from logo...');

// Make sure the directories exist
const iconDir = path.join(__dirname, '../public/images');
if (!fs.existsSync(iconDir)) {
  fs.mkdirSync(iconDir, { recursive: true });
}

// Source SVG file
const logoPath = path.join(__dirname, '../public/images/logo.svg');

// Icon sizes to generate (based on manifest.json)
const sizes = [192, 512];

// Convert SVG to PNG at various sizes
async function generateIcons() {
  try {
    if (!fs.existsSync(logoPath)) {
      console.error('❌ Source logo.svg not found at:', logoPath);
      return;
    }

    // Read the SVG content
    const svgBuffer = fs.readFileSync(logoPath);

    // Generate each size
    for (const size of sizes) {
      const outputPath = path.join(iconDir, `icon-${size}x${size}.png`);
      
      await sharp(svgBuffer)
        .resize(size, size)
        .png()
        .toFile(outputPath);
        
      console.log(`✅ Generated: ${outputPath}`);
    }

    console.log('🎉 All icons generated successfully');
  } catch (error) {
    console.error('❌ Error generating icons:', error.message);
  }
}

// Execute the icon generation
generateIcons().catch(err => {
  console.error('❌ An error occurred during icon generation:', err);
  process.exit(1);
});
