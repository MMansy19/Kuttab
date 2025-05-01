const nextConfig = {
  // ... your existing config ...

  // Add these new settings:
  experimental: {
    webpackBuildWorker: true, // Enable isolated build
    serverComponentsExternalPackages: ['fs', 'path'] // Isolate FS access
  },

  webpack: (config) => {
    // Completely disable file system watching
    config.watchOptions = {
      ignored: ['**/.*', '**/node_modules/**', '**/.next/**'],
      poll: false,
    };

    // Prevent scanning protected directories
    config.snapshot = {
      managedPaths: [/^(.+?[\\/]node_modules[\\/])/],
      immutablePaths: [],
    };

    return config;
  }
}