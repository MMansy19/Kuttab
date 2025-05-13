#!/usr/bin/env node
/**
 * Auth Migration Script
 * 
 * This script helps with migrating from the old auth system to the new feature-based auth architecture.
 * It performs the following tasks:
 * 1. Creates backup copies of files being modified
 * 2. Updates import statements in components using NextAuth
 * 3. Updates auth provider in app layouts
 * 
 * Usage: node scripts/migrate-auth.js
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Configuration
const rootDir = process.cwd();
const backupDir = path.join(rootDir, 'backup-pre-auth-migration');
const filesToModify = [
  'app/auth/login/page.tsx',
  'app/auth/signup/page.tsx',
  'app/auth/error/page.tsx',
  'app/layout.tsx',
];

// Files to check for NextAuth imports
const dirsToScan = [
  'app',
  'components',
];

// Create backup directory
console.log('Creating backup directory...');
if (!fs.existsSync(backupDir)) {
  fs.mkdirSync(backupDir, { recursive: true });
}

// Backup files
console.log('Backing up files...');
filesToModify.forEach(file => {
  const fullPath = path.join(rootDir, file);
  if (fs.existsSync(fullPath)) {
    const backupPath = path.join(backupDir, file);
    const backupDirPath = path.dirname(backupPath);
    
    if (!fs.existsSync(backupDirPath)) {
      fs.mkdirSync(backupDirPath, { recursive: true });
    }
    
    fs.copyFileSync(fullPath, backupPath);
    console.log(`  Backed up ${file}`);
  } else {
    console.log(`  Warning: ${file} does not exist`);
  }
});

// Find files with NextAuth imports
console.log('\nScanning for files with NextAuth imports...');
let filesToCheck = [];

const findTsxFiles = (dir, fileList = []) => {
  const files = fs.readdirSync(dir);
  
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      findTsxFiles(filePath, fileList);
    } else if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
      fileList.push(filePath);
    }
  }
  
  return fileList;
};

dirsToScan.forEach(dir => {
  const dirPath = path.join(rootDir, dir);
  if (fs.existsSync(dirPath)) {
    filesToCheck = [...filesToCheck, ...findTsxFiles(dirPath)];
  }
});

// Check for NextAuth imports
const filesWithNextAuth = [];
filesToCheck.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  
  if (content.includes('next-auth/react') || content.includes('next-auth/jwt')) {
    filesWithNextAuth.push(path.relative(rootDir, file));
  }
});

console.log('Files with NextAuth imports:');
filesWithNextAuth.forEach(file => {
  console.log(`  - ${file}`);
});

// Generate migration report
console.log('\nGenerating migration report...');
const report = `
# Auth Migration Report

Generated on: ${new Date().toLocaleString()}

## Files to Modify

${filesToModify.map(file => `- ${file}`).join('\n')}

## Files Using NextAuth (${filesWithNextAuth.length})

${filesWithNextAuth.map(file => `- ${file}`).join('\n')}

## Migration Steps

1. Update the root layout to use the new auth providers
2. Migrate all authentication pages
3. Update components using NextAuth
4. Test authentication flows
`;

fs.writeFileSync(path.join(rootDir, 'auth-migration-report.md'), report);
console.log('Migration report generated: auth-migration-report.md');

// Print next steps
console.log('\nNext steps:');
console.log('1. Review the migration report');
console.log('2. Follow the migration guide in features/auth/MIGRATION-GUIDE.md');
console.log('3. Update files that use next-auth with the new auth components');
console.log('4. Test all authentication flows after migration');
