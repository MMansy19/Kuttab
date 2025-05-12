const fs = require('fs');
const path = require('path');
const { exec, execSync } = require('child_process');

// Function to recursively delete a directory
function deleteFolderRecursive(folderPath) {
  if (!fs.existsSync(folderPath)) {
    return;
  }

  try {
    // Try the direct approach first
    console.log(`Attempting to delete ${folderPath}...`);
    fs.rmSync(folderPath, { recursive: true, force: true });
    console.log(`Successfully deleted ${folderPath}`);
  } catch (err) {
    console.warn(`Error deleting folder with fs.rmSync: ${err.message}`);
    
    // On Windows, try using rd command as fallback
    if (process.platform === 'win32') {
      try {
        console.log(`Attempting to delete with Windows command...`);
        // Using /s (recursive) and /q (quiet) flags
        execSync(`rd /s /q "${folderPath}"`, { stdio: 'inherit' });
        console.log(`Successfully deleted ${folderPath} with Windows command`);
      } catch (err) {
        console.error(`Failed to delete with Windows command: ${err.message}`);
        console.log('Please close any applications that might be using these files and try again.');
      }
    }
  }
}

// Clean build artifacts
console.log('Cleaning build artifacts...');

// Clean .next directory
deleteFolderRecursive(path.join(__dirname, '.next'));

// Clean any other directories if needed
// deleteFolderRecursive(path.join(__dirname, 'other-directory'));

console.log('Cleanup completed.');