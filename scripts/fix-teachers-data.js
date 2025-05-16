/**
 * This script creates or ensures the teachers data module is properly exported
 */

const fs = require('fs');
const path = require('path');

console.log('Fixing teachers data module...');

// Ensure the data directory exists
const dataDir = path.join(process.cwd(), 'data');
if (!fs.existsSync(dataDir)) {
  console.log('Creating data directory...');
  fs.mkdirSync(dataDir, { recursive: true });
}

// Check if teachers.ts file exists
const teachersFilePath = path.join(dataDir, 'teachers.ts');
if (!fs.existsSync(teachersFilePath)) {
  console.log('Creating teachers.ts file...');
  
  // Check if mock-teachers.ts exists to re-export from it
  const mockTeachersPath = path.join(dataDir, 'mock-teachers.ts');
  let teachersContent = '';
  
  if (fs.existsSync(mockTeachersPath)) {
    teachersContent = `/**
 * Teachers data module
 * Re-exports mock teachers for development and provides functions
 * to interact with teacher data
 */

// Import mock data for development
import { mockTeachers } from './mock-teachers';

// Export mock data
export const teachers = mockTeachers;

/**
 * Find a teacher by ID
 */
export function getTeacherById(id: string) {
  return teachers.find(teacher => teacher.id === id);
}

/**
 * Get all teachers
 */
export function getAllTeachers() {
  return teachers;
}

/**
 * Get featured teachers (top rated)
 */
export function getFeaturedTeachers(limit = 4) {
  return teachers
    .filter(teacher => teacher.approvalStatus === "APPROVED" && teacher.isAvailable)
    .sort((a, b) => b.averageRating - a.averageRating)
    .slice(0, limit);
}

export default {
  getTeacherById,
  getAllTeachers,
  getFeaturedTeachers,
  teachers
};`;
  } else {
    // Create a minimal stub if mock-teachers.ts doesn't exist
    teachersContent = `/**
 * Teachers data module
 */

// Export mock data
export const teachers = [];

/**
 * Find a teacher by ID
 */
export function getTeacherById(id: string) {
  return teachers.find(teacher => teacher.id === id);
}

/**
 * Get all teachers
 */
export function getAllTeachers() {
  return teachers;
}

/**
 * Get featured teachers (top rated)
 */
export function getFeaturedTeachers(limit = 4) {
  return [];
}

export default {
  getTeacherById,
  getAllTeachers,
  getFeaturedTeachers,
  teachers
};`;
  }
  
  fs.writeFileSync(teachersFilePath, teachersContent);
  console.log('Created teachers.ts file');
} else {
  console.log('Found existing teachers.ts file, ensuring exports are correct...');
  
  const content = fs.readFileSync(teachersFilePath, 'utf8');
  
  // Check if the file exports the necessary functions
  const missingExports = [];
  if (!content.includes('export function getTeacherById')) missingExports.push('getTeacherById');
  if (!content.includes('export function getAllTeachers')) missingExports.push('getAllTeachers');
  if (!content.includes('export function getFeaturedTeachers')) missingExports.push('getFeaturedTeachers');
  if (!content.includes('export const teachers')) missingExports.push('teachers');
  
  if (missingExports.length > 0) {
    console.log(`Adding missing exports: ${missingExports.join(', ')}`);
    
    let updatedContent = content;
    const hasDefaultExport = content.includes('export default');
    
    // Add missing function exports
    let functionsToAdd = '';
    if (missingExports.includes('getTeacherById')) {
      functionsToAdd += `
/**
 * Find a teacher by ID
 */
export function getTeacherById(id: string) {
  return teachers.find(teacher => teacher.id === id);
}
`;
    }
    
    if (missingExports.includes('getAllTeachers')) {
      functionsToAdd += `
/**
 * Get all teachers
 */
export function getAllTeachers() {
  return teachers;
}
`;
    }
    
    if (missingExports.includes('getFeaturedTeachers')) {
      functionsToAdd += `
/**
 * Get featured teachers (top rated)
 */
export function getFeaturedTeachers(limit = 4) {
  return teachers
    .filter(teacher => teacher.rating >= 4.5)
    .slice(0, limit);
}
`;
    }
    
    // If no teachers constant, add it
    if (missingExports.includes('teachers')) {
      const teachersArr = content.includes('teachersData') 
        ? 'export const teachers = teachersData;'
        : 'export const teachers = [];';
      
      // Insert after imports
      const lastImportIndex = Math.max(
        content.lastIndexOf('import'),
        content.lastIndexOf('} from')
      );
      
      if (lastImportIndex > -1) {
        const endOfImportsIndex = content.indexOf('\n', lastImportIndex);
        updatedContent = 
          content.slice(0, endOfImportsIndex + 1) + 
          '\n' + teachersArr + '\n' +
          content.slice(endOfImportsIndex + 1);
      } else {
        updatedContent = teachersArr + '\n\n' + updatedContent;
      }
    }
    
    // Add function exports
    if (functionsToAdd) {
      // Add before default export if it exists
      if (hasDefaultExport) {
        const defaultExportIndex = content.indexOf('export default');
        updatedContent = 
          updatedContent.slice(0, defaultExportIndex) + 
          functionsToAdd +
          updatedContent.slice(defaultExportIndex);
      } else {
        // Otherwise add at the end
        updatedContent += functionsToAdd;
      }
    }
    
    // Add default export if missing
    if (!hasDefaultExport) {
      updatedContent += `
export default {
  getTeacherById,
  getAllTeachers,
  getFeaturedTeachers,
  teachers
};`;
    }
    
    fs.writeFileSync(teachersFilePath, updatedContent);
    console.log('Updated teachers.ts file with missing exports');
  } else {
    console.log('Teachers module has all necessary exports');
  }
}

console.log('Teachers data module fix completed!');
