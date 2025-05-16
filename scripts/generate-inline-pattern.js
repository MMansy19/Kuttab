/* This script generates a tiny base64 version of the Islamic pattern for inline CSS */
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

console.log('🔄 Generating optimized pattern for inlining...');

// Source pattern image file
const patternPath = path.join(__dirname, '../public/images/islamic-pattern.webp');
const outputPath = path.join(__dirname, '../styles/pattern-base64.css');

async function generateInlinePattern() {
  try {
    if (!fs.existsSync(patternPath)) {
      console.error('❌ Source pattern image not found at:', patternPath);
      return;
    }

    // Create a tiny version of the pattern (30px wide)
    const tinyPattern = await sharp(patternPath)
      .resize(30) // Tiny size that still shows the pattern
      .webp({ quality: 20 }) // Very low quality is fine for a background pattern
      .toBuffer();
    
    // Convert to base64
    const base64Pattern = tinyPattern.toString('base64');
    
    // Generate CSS with the data URL
    const css = `/* Auto-generated tiny pattern for immediate loading */
:root {
  --pattern-bg: url('data:image/webp;base64,${base64Pattern}');
}

/* CSS class for the pattern background */
.pattern-bg {
  background-image: var(--pattern-bg);
  background-repeat: repeat;
}

/* Use the high-res version once loaded */
.pattern-bg-hq {
  background-image: var(--pattern-bg); /* Start with tiny version */
}
.pattern-bg-hq.loaded {
  background-image: url('/images/islamic-pattern.webp'); /* Replace with high-res when loaded */
}
`;
    
    // Write the CSS file
    fs.writeFileSync(outputPath, css);
    
    console.log(`✅ Generated inline pattern CSS at: ${outputPath}`);
    console.log(`   Base64 size: ${base64Pattern.length} bytes`);
    
  } catch (error) {
    console.error('❌ Error generating inline pattern:', error.message);
  }
}

// Execute the pattern generation
generateInlinePattern().catch(err => {
  console.error('❌ An error occurred:', err);
  process.exit(1);
});
