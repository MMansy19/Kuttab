'use client';

import React from 'react';

interface PageHeaderProps {
  title: string;
  description?: string;
  breadcrumbs?: Array<{ label: string; href?: string }>;
  className?: string;
}

/**
 * PageHeader component helps with both SEO and UX by providing 
 * consistent, semantic heading structure and optional breadcrumbs
 */
const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  description,
  breadcrumbs,
  className = '',
}) => {
  return (
    <header className={`mb-8 ${className}`}>
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav aria-label="المسار" className="mb-4">
          <ol className="flex flex-wrap items-center text-sm text-gray-500 dark:text-gray-400 rtl:space-x-reverse">
            {breadcrumbs.map((crumb, index) => (
              <li key={index} className="flex items-center">
                {index > 0 && (
                  <span className="mx-2 text-gray-400 dark:text-gray-500">/</span>
                )}
                {crumb.href ? (
                  <a 
                    href={crumb.href} 
                    className="text-emerald-600 dark:text-emerald-500 hover:text-emerald-800 dark:hover:text-emerald-400"
                  >
                    {crumb.label}
                  </a>
                ) : (
                  <span aria-current="page">{crumb.label}</span>
                )}
              </li>
            ))}
          </ol>
        </nav>
      )}
      
      <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
        {title}
      </h1>
      
      {description && (
        <p className="text-lg text-gray-600 dark:text-gray-300">
          {description}
        </p>
      )}
    </header>
  );
};

export default PageHeader;
