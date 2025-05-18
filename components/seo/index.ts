import React, { ReactNode } from 'react';
import SEOMonitor from './SEOMonitor';

export { default as StructuredData } from './StructuredData';
export { default as SchemaOrgData } from './SchemaOrgData';
export { default as SEOMonitor } from './SEOMonitor';

// Only use SEOMonitor in development or for admin users
export const withSEOMonitor = (component: ReactNode): ReactNode => {
  if (process.env.NODE_ENV === 'development' || (typeof window !== 'undefined' && window.localStorage.getItem('isAdmin'))) {
    return React.createElement(
      React.Fragment,
      null,
      component,
      React.createElement(SEOMonitor)
    );
  }
  
  return component;
};
