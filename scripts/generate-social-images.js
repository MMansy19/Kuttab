/* This script creates social media preview images with our logo */
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const { createCanvas, loadImage } = require('canvas');

console.log('🔄 Generating social media preview images...');

// Make sure the directories exist
const imagesDir = path.join(__dirname, '../public/images');
if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true });
}

// Source logo file
const logoPath = path.join(__dirname, '../public/images/ikuttab-logo.png');

// Social media preview image sizes
const socialImages = [
  { name: 'og-image.jpg', width: 1200, height: 630 },  // Open Graph image
  { name: 'twitter-image.jpg', width: 1200, height: 600 }  // Twitter image
];

// Generate social preview images with logo and text
async function generateSocialImages() {
  try {
    // Create a canvas for the social media images
    const generatePreviewImage = async (width, height, filename) => {
      const canvas = createCanvas(width, height);
      const ctx = canvas.getContext('2d');
      
      // Background gradient (emerald to blue gradient)
      const gradient = ctx.createLinearGradient(0, 0, width, height);
      gradient.addColorStop(0, '#047857');  // emerald-700
      gradient.addColorStop(1, '#1d4ed8');  // blue-700
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);
      
      // Load and draw the logo
      const logo = await loadImage(logoPath);
      const logoSize = Math.min(width, height) * 0.25;  // Logo size based on image dimensions
      const logoX = (width - logoSize) / 2;
      const logoY = (height - logoSize) / 3;
      
      ctx.drawImage(logo, logoX, logoY, logoSize, logoSize);
      
      // Add text
      ctx.font = `bold ${Math.floor(width * 0.08)}px Cairo, sans-serif`;
      ctx.textAlign = 'center';
      ctx.fillStyle = '#FFFFFF';
      ctx.fillText('كُتّاب', width / 2, height * 0.65);
      
      // Add subtitle
      ctx.font = `${Math.floor(width * 0.04)}px Cairo, sans-serif`;
      ctx.fillText('منصة تعليم القرآن الكريم', width / 2, height * 0.75);
      
      // Save the image
      const buffer = canvas.toBuffer('image/jpeg', { quality: 0.9 });
      fs.writeFileSync(path.join(imagesDir, filename), buffer);
      console.log(`✅ Generated: ${filename}`);
    };
    
    // Generate each social media image
    for (const { name, width, height } of socialImages) {
      await generatePreviewImage(width, height, name);
    }
    
    console.log('🎉 All social media preview images generated successfully');
  } catch (error) {
    console.error('❌ Error generating social media images:', error.message);
  }
}

// Execute the image generation
generateSocialImages().catch(err => {
  console.error('❌ An error occurred during social image generation:', err);
  process.exit(1);
});
