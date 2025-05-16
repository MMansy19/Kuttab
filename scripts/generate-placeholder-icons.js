/* This file generates placeholder icons for the PWA until proper icons are created */
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

console.log('🔄 Generating placeholder PWA icons...');

// Ensure the directory exists
const iconDir = path.join(__dirname, '../public/images');
if (!fs.existsSync(iconDir)) {
  fs.mkdirSync(iconDir, { recursive: true });
}

// Icon sizes needed for manifest.json
const sizes = [192, 512];

// Generate a basic icon with text for each size
async function generatePlaceholderIcons() {
  try {
    for (const size of sizes) {
      const outputPath = path.join(iconDir, `icon-${size}x${size}.png`);
      
      // Generate a simple colored square with text in the middle
      const svg = `
        <svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
          <rect width="100%" height="100%" fill="#047857"/>
          <text 
            x="50%" 
            y="50%" 
            font-family="Arial" 
            font-size="${size/4}px" 
            text-anchor="middle" 
            alignment-baseline="middle" 
            fill="white">
            كُتّاب
          </text>
        </svg>
      `;
      
      await sharp(Buffer.from(svg))
        .png()
        .toFile(outputPath);
        
      console.log(`✅ Generated placeholder icon: ${outputPath}`);
    }
    
    console.log('🎉 All placeholder icons generated successfully');
  } catch (error) {
    console.error('❌ Error generating placeholder icons:', error.message);
  }
}

// Run the generator
generatePlaceholderIcons().catch(err => {
  console.error('❌ An error occurred:', err);
  process.exit(1);
});
