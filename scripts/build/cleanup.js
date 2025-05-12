/**
 * Consolidated cleanup utility for the kottab project
 * Handles various cleanup operations for development and build processes
 */
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const os = require('os');

// Paths configuration
const BASE_DIR = path.resolve(__dirname, '../..');
const PATHS = {
  nextDir: path.join(BASE_DIR, '.next'),
  nextTempDir: path.join(BASE_DIR, '.next-temp'),
  buildOutputDir: path.join(BASE_DIR, 'build-output'),
  cacheDir: path.join(BASE_DIR, 'node_modules', '.cache'),
  generatedDir: path.join(BASE_DIR, 'generated')
};

// Utility functions
const logger = {
  info: (message) => console.log(`ℹ️ ${message}`),
  success: (message) => console.log(`✅ ${message}`),
  warning: (message) => console.log(`⚠️ ${message}`),
  error: (message) => console.error(`❌ ${message}`)
};

/**
 * Safely deletes a directory with proper error handling
 */
function safeDeleteDirectory(dirPath, options = { silent: false }) {
  if (!fs.existsSync(dirPath)) {
    if (!options.silent) {
      logger.info(`Directory not found: ${path.relative(BASE_DIR, dirPath)}`);
    }
    return false;
  }
  
  try {
    // Try the direct approach first
    fs.rmSync(dirPath, { recursive: true, force: true });
    logger.success(`Deleted: ${path.relative(BASE_DIR, dirPath)}`);
    return true;
  } catch (err) {
    logger.warning(`Error deleting folder with fs.rmSync: ${err.message}`);
    
    // On Windows, try using rd command as fallback
    if (process.platform === 'win32') {
      try {
        execSync(`rd /s /q "${dirPath}"`, { stdio: 'inherit' });
        logger.success(`Deleted with rd command: ${path.relative(BASE_DIR, dirPath)}`);
        return true;
      } catch (cmdErr) {
        logger.error(`Failed to delete directory with rd command: ${cmdErr.message}`);
      }
    }
    
    return false;
  }
}

/**
 * Standard cleanup for development
 * Clears temporary build files
 */
function standardCleanup() {
  logger.info('Starting standard cleanup...');
  
  const dirsToClean = [
    PATHS.nextDir, 
    PATHS.nextTempDir, 
    PATHS.buildOutputDir,
    path.join(PATHS.cacheDir)
  ];
  
  for (const dir of dirsToClean) {
    safeDeleteDirectory(dir);
  }
  
  logger.success('Standard cleanup completed');
}

/**
 * Deep cleanup for troubleshooting
 * WARNING: This will remove node_modules and require reinstallation
 */
function deepCleanup() {
  logger.warning('Starting deep cleanup (including node_modules)...');
  
  const dirsToClean = [
    PATHS.nextDir, 
    PATHS.nextTempDir, 
    PATHS.buildOutputDir,
    PATHS.cacheDir,
    PATHS.generatedDir,
    path.join(BASE_DIR, 'node_modules')
  ];
  
  for (const dir of dirsToClean) {
    safeDeleteDirectory(dir);
  }
  
  logger.success('Deep cleanup completed');
  logger.info('You will need to run "npm install" to reinstall dependencies');
}

/**
 * Specific cleanup for build process
 * Cleans only what's necessary before building
 */
function buildCleanup() {
  logger.info('Preparing build environment...');
  
  const dirsToClean = [
    PATHS.nextDir, 
    PATHS.nextTempDir, 
    PATHS.buildOutputDir
  ];
  
  for (const dir of dirsToClean) {
    safeDeleteDirectory(dir);
  }
  
  logger.success('Build preparation completed');
}

// Export the functions for use in npm scripts
module.exports = {
  standard: standardCleanup,
  deep: deepCleanup,
  build: buildCleanup,
  safeDeleteDirectory
};

// When run directly, execute standard cleanup by default
if (require.main === module) {
  const arg = process.argv[2];
  
  if (arg === 'deep') {
    deepCleanup();
  } else if (arg === 'build') {
    buildCleanup();
  } else {
    standardCleanup();
  }
}
