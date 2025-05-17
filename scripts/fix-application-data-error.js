/**
 * This script specifically addresses the EPERM error with Application Data folder
 * by patching the Node.js filesystem operations
 */

const originalReaddir = require('fs').readdir;
const originalReaddirSync = require('fs').readdirSync;
const path = require('path');

// Problematic paths to bypass
const problematicPaths = [
  'C:\\Users\\mahmo\\Application Data',
  'C:/Users/mahmo/Application Data',
  path.normalize('C:/Users/mahmo/Application Data'),
  path.normalize('C:\\Users\\mahmo\\Application Data')
];

// Patch readdir
require('fs').readdir = function(dirPath, options, callback) {
  if (typeof options === 'function') {
    callback = options;
    options = undefined;
  }
  
  // Check if this is a problematic path
  if (problematicPaths.includes(dirPath) || 
      problematicPaths.includes(path.normalize(dirPath)) ||
      dirPath.includes('Application Data')) {
    console.log(`⚠️ Bypassing problematic path: ${dirPath}`);
    
    // Return empty array for problematic paths
    if (callback) {
      process.nextTick(() => callback(null, []));
      return;
    }
  }
  
  // Otherwise use the original function
  return originalReaddir.apply(this, arguments);
};

// Patch readdirSync
require('fs').readdirSync = function(dirPath, options) {
  // Check if this is a problematic path
  if (problematicPaths.includes(dirPath) || 
      problematicPaths.includes(path.normalize(dirPath)) ||
      dirPath.includes('Application Data')) {
    console.log(`⚠️ Bypassing problematic path sync: ${dirPath}`);
    
    // Return empty array for problematic paths
    return [];
  }
  
  // Otherwise use the original function
  try {
    return originalReaddirSync.apply(this, arguments);
  } catch (error) {
    if (error.code === 'EPERM' && 
        (dirPath.includes('Application Data') || dirPath.includes('AppData'))) {
      console.log(`⚠️ Caught EPERM error for: ${dirPath}`);
      return [];
    }
    throw error;
  }
};

console.log('✅ Application Data permission error fix applied');
