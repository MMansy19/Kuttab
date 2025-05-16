/**
 * Special pre-build script that runs before the Vercel build process
 * This ensures that all components are properly exported and available for import
 */

const fs = require('fs');
const path = require('path');

console.log('Running component fix script...');

// Ensure required directories exist
const dirs = [
  'components/ui',
  'features/auth/components',
  'features/auth'
];

// Create directories that might be missing
dirs.forEach(dir => {
  const fullPath = path.join(process.cwd(), dir);
  if (!fs.existsSync(fullPath)) {
    console.log(`Creating missing directory: ${dir}`);
    fs.mkdirSync(fullPath, { recursive: true });
  }
});

// Fix Section component
const sectionPath = path.join(process.cwd(), 'components/ui/Section.tsx');
if (fs.existsSync(sectionPath)) {
  console.log('Section component exists, ensuring it exports correctly...');
  const content = fs.readFileSync(sectionPath, 'utf8');
  
  // Check if component is properly exported
  if (!content.includes('export function Section') && 
      !content.includes('export const Section')) {
    console.log('Adding proper export to Section component');
    
    // Add export if missing
    const fixedContent = content.replace(
      /function Section/,
      'export function Section'
    );
    
    fs.writeFileSync(sectionPath, fixedContent);
  }
  
  // Check if SectionHeader is exported
  if (content.includes('function SectionHeader') && 
      !content.includes('export function SectionHeader') &&
      !content.includes('export const SectionHeader')) {
    console.log('Adding SectionHeader export');
    
    const fixedContent = content.replace(
      /function SectionHeader/,
      'export function SectionHeader'
    );
    
    fs.writeFileSync(sectionPath, fixedContent);
  }
}

// Fix Card component
const cardPath = path.join(process.cwd(), 'components/ui/Card.tsx');
if (fs.existsSync(cardPath)) {
  console.log('Card component exists, ensuring it exports correctly...');
  let content = fs.readFileSync(cardPath, 'utf8');
  
  // Make sure Card is exported
  if (!content.includes('export const Card') && 
      !content.includes('export default Card')) {
    console.log('Adding export for Card component');
    
    // Add export at the end if not already exported
    if (content.includes('const Card =') && !content.includes('export {')) {
      content = content + '\n\nexport { Card };';
      fs.writeFileSync(cardPath, content);
    }
  }
  
  // Check if CardContent is exported
  if (content.includes('const CardContent =') && 
      !content.includes('export const CardContent') &&
      !content.includes('export { Card, CardContent }')) {
    console.log('Adding CardContent export');
    
    // Replace any existing export with a combined export
    if (content.includes('export { Card }')) {
      content = content.replace(
        'export { Card }',
        'export { Card, CardContent }'
      );
    } else {
      content = content + '\n\nexport { Card, CardContent };';
    }
    
    fs.writeFileSync(cardPath, content);
  }
}

// Fix auth components
const authFeatureIndexPath = path.join(process.cwd(), 'features/auth/index.ts');
if (fs.existsSync(authFeatureIndexPath)) {
  console.log('Auth feature index exists, ensuring it exports correctly...');
} else {
  console.log('Creating auth feature index file...');
  
  // Create a basic index file that re-exports common auth components
  const indexContent = `/**
 * Auth feature index
 * Exports all auth-related components and utilities
 */

// Re-export components
export * from './components/LoginForm';
export * from './components/RegisterForm';
export * from './components/RoleGuard';
export * from './components/UserMenu';

// Re-export hooks
export * from './hooks/useAuth';
export * from './hooks/useAuthRedirect';

// Re-export services
export * from './services/auth-service';
`;
  
  fs.writeFileSync(authFeatureIndexPath, indexContent);
}

console.log('Component fix script completed!');
