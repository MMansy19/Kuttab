// This script helps manage database configuration across environments
const fs = require('fs');
const path = require('path');

/**
 * Helper to determine database configuration based on environment
 * - In development: Uses SQLite by default
 * - In production: Uses PostgreSQL with connection string from environment variables
 */
function getDatabaseUrl() {
  // Default to environment variable
  let databaseUrl = process.env.DATABASE_URL;

  // If in development and no explicit DATABASE_URL is provided, use SQLite
  if (process.env.NODE_ENV !== 'production' && !databaseUrl) {
    databaseUrl = 'file:./dev.db';
    console.log('Using SQLite for development');
  } 
  // For production, ensure we have a proper PostgreSQL URL
  else if (process.env.NODE_ENV === 'production') {
    if (!databaseUrl || !databaseUrl.startsWith('postgresql')) {
      console.warn('WARNING: No valid PostgreSQL DATABASE_URL found in production environment!');
      console.warn('Vercel deployment requires a PostgreSQL database connection.');
    } else {
      console.log('Using PostgreSQL database connection for production');
    }
  }

  return databaseUrl;
}

/**
 * Get the appropriate Prisma provider based on the database URL
 */
function getPrismaProvider(databaseUrl) {
  if (!databaseUrl) return 'postgresql'; // Default to PostgreSQL
  
  if (databaseUrl.startsWith('file:')) {
    return 'sqlite';
  } else if (databaseUrl.startsWith('postgresql')) {
    return 'postgresql';
  } else {
    console.warn('Unrecognized database URL format, defaulting to PostgreSQL');
    return 'postgresql';
  }
}

module.exports = {
  getDatabaseUrl,
  getPrismaProvider
};