const fs = require('fs');
const path = require('path');

async function clean() {
  const dirs = ['.next', '.next-temp', 'build-output', 'node_modules/.cache'];
  
  console.log('Starting cleanup...');
  
  for (const dir of dirs) {
    try {
      if (fs.existsSync(dir)) {
        fs.rmSync(dir, { recursive: true, force: true });
        console.log(`✓ Deleted ${dir}`);
      } else {
        console.log(`- ${dir} not found`);
      }
    } catch (error) {
      console.error(`! Error cleaning ${dir}:`, error.message);
    }
  }
  
  console.log('Cleanup complete!');
}

clean().catch(console.error);