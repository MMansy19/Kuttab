/**
 * Export all SEO components for easy importing
 */
export { default as StructuredData } from './StructuredData';
export { default as SchemaOrgData } from './SchemaOrgData';
export { default as PageHeader } from './PageHeader';
export { default as LinkRel } from './LinkRel';
export { default as SEOMonitor } from './SEOMonitor';

// Only use SEOMonitor in development or for admin users
export const withSEOMonitor = (component: React.ReactNode): React.ReactNode => {
  if (process.env.NODE_ENV === 'development' || (typeof window !== 'undefined' && window.localStorage.getItem('isAdmin'))) {
    return (
      <>
        {component}
        <SEOMonitor />
      </>
    );
  }
  
  return component;
};
