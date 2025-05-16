/**
 * This script creates stubs for missing UI components to fix build errors
 */
const fs = require('fs');
const path = require('path');

console.log('Running component stub creator...');

// Create directories if they don't exist
function ensureDirectoryExists(dirPath) {
  const fullPath = path.join(process.cwd(), dirPath);
  if (!fs.existsSync(fullPath)) {
    console.log(`Creating directory: ${dirPath}`);
    fs.mkdirSync(fullPath, { recursive: true });
  }
}

// Create a basic component stub
function createComponentStub(componentPath, componentContent) {
  const fullPath = path.join(process.cwd(), componentPath);
  
  // Skip if file already exists
  if (fs.existsSync(fullPath)) {
    console.log(`Component already exists: ${componentPath}`);
    return;
  }
  
  console.log(`Creating component stub: ${componentPath}`);
  fs.writeFileSync(fullPath, componentContent);
}

// Handle component directories
ensureDirectoryExists('components/ui');
ensureDirectoryExists('features/auth');
ensureDirectoryExists('features/auth/components');

// Section component
const sectionContent = `import React from 'react';

interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  background?: 'default' | 'light' | 'dark' | 'primary' | 'gradient';
  containerWidth?: 'full' | 'container' | 'narrow';
  spacing?: 'none' | 'small' | 'medium' | 'large';
}

export function Section({
  background = 'default',
  containerWidth = 'container',
  spacing = 'medium',
  className = '',
  children,
  ...props
}: SectionProps) {
  return (
    <section 
      className={\`section section-\${background} section-\${spacing} \${className}\`}
      {...props}
    >
      <div className={\`section-container section-\${containerWidth}\`}>
        {children}
      </div>
    </section>
  );
}

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  centered?: boolean;
  className?: string;
}

export function SectionHeader({ 
  title, 
  subtitle, 
  centered = false,
  className = '' 
}: SectionHeaderProps) {
  return (
    <header className={\`section-header \${centered ? 'text-center' : ''} \${className}\`}>
      <h2 className="text-3xl font-bold mb-4">{title}</h2>
      {subtitle && <p className="text-lg text-gray-600 mb-6">{subtitle}</p>}
    </header>
  );
}
`;

// Card component
const cardContent = `import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'bordered' | 'raised';
  padding?: 'none' | 'small' | 'medium' | 'large';
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className = '', variant = 'default', padding = 'medium', children, ...props }, ref) => {
    return (
      <div 
        ref={ref}
        className={\`card card-\${variant} card-padding-\${padding} \${className}\`}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {}

export const CardContent = React.forwardRef<HTMLDivElement, CardContentProps>(
  ({ className = '', children, ...props }, ref) => {
    return (
      <div 
        ref={ref}
        className={\`card-content \${className}\`}
        {...props}
      >
        {children}
      </div>
    );
  }
);

CardContent.displayName = 'CardContent';
`;

// AuthCard component
const authCardContent = `import React from 'react';

interface AuthCardProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}

export function AuthCard({ 
  title, 
  subtitle, 
  children, 
  footer,
  className = '' 
}: AuthCardProps) {
  return (
    <div className={\`auth-card max-w-md w-full mx-auto bg-white dark:bg-gray-800 rounded-lg shadow p-6 \${className}\`}>
      <div className="auth-card-header mb-6">
        <h1 className="text-2xl font-bold text-center mb-2">{title}</h1>
        {subtitle && (
          <p className="text-gray-600 dark:text-gray-400 text-center">{subtitle}</p>
        )}
      </div>
      
      <div className="auth-card-content">
        {children}
      </div>
      
      {footer && (
        <div className="auth-card-footer mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
          {footer}
        </div>
      )}
    </div>
  );
}
`;

// LoginForm component
const loginFormContent = `import React from 'react';
import { useState } from 'react';

interface LoginFormProps {
  callbackUrl?: string;
  defaultEmail?: string;
  error?: string | null;
  onSuccess?: () => void;
}

export function LoginForm({ 
  callbackUrl = '/dashboard', 
  defaultEmail = '', 
  error = null,
  onSuccess
}: LoginFormProps) {
  const [email, setEmail] = useState(defaultEmail || '');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState(error || '');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Stub for login
    console.log('Login attempted with:', { email, password, callbackUrl });
    setIsLoading(true);
    
    // Simulate login
    setTimeout(() => {
      setIsLoading(false);
      if (onSuccess) onSuccess();
      // In a real implementation, this would redirect or call an auth function
    }, 1000);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {formError && (
        <div className="bg-red-100 text-red-600 p-3 rounded text-sm mb-4">
          {formError}
        </div>
      )}
      
      <div>
        <label htmlFor="email" className="block text-sm font-medium mb-1">
          Email
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 border rounded"
          placeholder="your@email.com"
          required
        />
      </div>
      
      <div>
        <label htmlFor="password" className="block text-sm font-medium mb-1">
          Password
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 border rounded"
          placeholder="••••••••"
          required
        />
      </div>
      
      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-2 px-4 bg-blue-600 text-white rounded font-medium"
      >
        {isLoading ? 'Signing in...' : 'Sign in'}
      </button>
    </form>
  );
}
`;

// Auth feature index
const authIndexContent = `// Basic export for auth feature
export * from './components/LoginForm';
export * from './components/AuthCard';

// Basic auth hook
export function useAuth() {
  return {
    user: null,
    isLoading: false,
    isAuthenticated: false,
    login: async () => {},
    logout: async () => {},
    register: async () => {},
  };
}
`;

// Create component stubs
createComponentStub('components/ui/Section.tsx', sectionContent);
createComponentStub('components/ui/Card.tsx', cardContent);
createComponentStub('features/auth/components/AuthCard.tsx', authCardContent);
createComponentStub('features/auth/components/LoginForm.tsx', loginFormContent);
createComponentStub('features/auth/index.ts', authIndexContent);

console.log('Component stub creation completed!');
