/**
 * Fix Permission Issues
 * 
 * This script patches Node.js glob functionality to avoid permission errors
 * on Windows systems, particularly with junction points like "Application Data"
 */

// First, apply our specific Application Data fix
require('./fix-application-data-error.js');

// Monkey patch the glob module to ignore problematic paths
try {
  console.log('🔧 Applying permission error fixes for Windows...');
  
  // List of problematic paths that cause EPERM errors
  const problematicPaths = [
    'C:\\Users\\mahmo\\Application Data',
    'Application Data',
    'AppData'
  ];
  
  // Override the require function to patch glob
  const originalRequire = module.constructor.prototype.require;
  module.constructor.prototype.require = function(path) {
    const result = originalRequire.apply(this, arguments);
    
    // Check if we're loading the glob module
    if (path === 'glob') {
      // Patch the glob.sync function to skip problematic paths
      const originalSync = result.sync;
      result.sync = function(...args) {
        try {
          return originalSync.apply(this, args);
        } catch (error) {
          if (error.code === 'EPERM') {
            console.warn(`⚠️ Skipping path with permission error: ${error.path}`);
            return [];
          }
          throw error;
        }
      };
    }
    
    return result;
  };
  
  console.log('✅ Permission error fix applied successfully');
} catch (error) {
  console.error('❌ Error applying permission fix:', error);
}
