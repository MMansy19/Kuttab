/* This script generates favicon and icon files from the logo */
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

console.log('🔄 Generating favicon and icons from logo...');

// Make sure the directories exist
const publicDir = path.join(__dirname, '../public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// Source logo file
const logoPath = path.join(__dirname, '../public/images/ikuttab-logo.png');

// Icon sizes to generate
const favicons = [
  { size: 16, name: 'favicon-16x16.png' },
  { size: 32, name: 'favicon-32x32.png' },
  { size: 48, name: 'favicon-48x48.png' },
  { size: 64, name: 'favicon.ico' }, // Actually needs special treatment for .ico
  { size: 192, name: 'icon-192x192.png' },
  { size: 512, name: 'icon-512x512.png' },
];

// Convert logo to various sizes
async function generateIcons() {
  try {
    if (!fs.existsSync(logoPath)) {
      console.error('❌ Source logo not found at:', logoPath);
      return;
    }

    // Generate each size
    for (const { size, name } of favicons) {
      if (name === 'favicon.ico') {
        // Special case for .ico file which needs a different approach
        // For this simple script, we'll just use a PNG with .ico extension
        const outputPath = path.join(publicDir, name);
        
        await sharp(logoPath)
          .resize(size, size)
          .png()
          .toFile(outputPath);
          
        console.log(`✅ Generated: ${outputPath} (Note: This is a PNG with .ico extension)`);
        
        // Also create a true favicon.png
        await sharp(logoPath)
          .resize(size, size)
          .png()
          .toFile(path.join(publicDir, 'favicon.png'));
      } else {
        const outputPath = path.join(publicDir, name);
        
        await sharp(logoPath)
          .resize(size, size)
          .png()
          .toFile(outputPath);
          
        console.log(`✅ Generated: ${outputPath}`);
      }
    }

    // Update icons in images folder for PWA
    await sharp(logoPath)
      .resize(192, 192)
      .png()
      .toFile(path.join(__dirname, '../public/images/icon-192x192.png'));
      
    await sharp(logoPath)
      .resize(512, 512)
      .png()
      .toFile(path.join(__dirname, '../public/images/icon-512x512.png'));

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
