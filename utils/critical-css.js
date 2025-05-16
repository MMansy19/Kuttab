/**
 * Critical CSS Extractor
 * This utility helps manage critical CSS for improved performance
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const glob = require('glob');

// Check if required packages are installed
function checkDependencies() {
  const requiredPackages = ['critical', 'critters'];
  const missingPackages = [];

  for (const pkg of requiredPackages) {
    try {
      require.resolve(pkg);
    } catch (e) {
      missingPackages.push(pkg);
    }
  }

  if (missingPackages.length > 0) {
    console.log(`⚠️ Missing packages: ${missingPackages.join(', ')}. Installing...`);
    try {
      execSync(`npm install --save-dev ${missingPackages.join(' ')}`, { stdio: 'inherit' });
      console.log('✅ Packages installed successfully.');
    } catch (error) {
      console.error('❌ Failed to install packages:', error.message);
      process.exit(1);
    }
  }
}

// Extract critical CSS from main stylesheets
async function extractCriticalCSS() {
  checkDependencies();

  try {
    const criticalCSS = require('critical');
    
    console.log('🔍 Extracting critical CSS...');
    
    await criticalCSS.generate({
      base: 'public/',
      src: 'index.html',
      target: {
        css: 'styles/critical.css',
        html: 'index-critical.html',
      },
      width: 1300,
      height: 900,
      inline: true,
    });
    
    console.log('✅ Critical CSS extracted successfully!');
  } catch (error) {
    console.error('❌ Error extracting critical CSS:', error.message);
  }
}

// Function to enable critters in Next.js config
function enableCrittersInNextConfig() {
  const configPath = path.join(process.cwd(), 'next.config.js');
  
  if (!fs.existsSync(configPath)) {
    console.error('❌ next.config.js not found!');
    return;
  }
  
  let configContent = fs.readFileSync(configPath, 'utf8');
  
  // Check if optimizeCss is already set to true
  if (configContent.includes('optimizeCss: true')) {
    console.log('✅ optimizeCss is already enabled in next.config.js');
    return;
  }
  
  // Replace optimizeCss: false with optimizeCss: true
  if (configContent.includes('optimizeCss: false')) {
    configContent = configContent.replace('optimizeCss: false', 'optimizeCss: true');
  } else {
    // If experimental section exists but doesn't have optimizeCss
    if (configContent.includes('experimental: {')) {
      configContent = configContent.replace(
        'experimental: {',
        'experimental: {\n    optimizeCss: true,'
      );
    } else {
      // If no experimental section exists, add it
      configContent = configContent.replace(
        'const nextConfig = {',
        'const nextConfig = {\n  experimental: {\n    optimizeCss: true,\n  },'
      );
    }
  }
  
  fs.writeFileSync(configPath, configContent, 'utf8');
  console.log('✅ Enabled optimizeCss in next.config.js');
}

// Main function
async function main() {
  console.log('🚀 Starting critical CSS optimization...');
  enableCrittersInNextConfig();
  await extractCriticalCSS();
  console.log('🎉 CSS optimization complete!');
}

// Execute if called directly
if (require.main === module) {
  main().catch(console.error);
}

module.exports = {
  extractCriticalCSS,
  enableCrittersInNextConfig,
};
