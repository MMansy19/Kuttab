# Authentication System

This module provides a comprehensive authentication system for the Kottab application, implementing a feature-based architecture that separates concerns and makes the code more maintainable.

## Overview

The authentication system has been completely restructured to follow best practices for maintainability and extensibility. It provides:

- **Type-safe authentication** with comprehensive TypeScript types
- **Role-based access control** for protecting routes and UI elements
- **Cross-tab synchronization** of authentication state
- **Enhanced UI components** for login, registration, and user menus
- **Centralized authentication services** that abstract away implementation details
- **Custom React hooks** for easy access to auth functionality

## Structure

```
features/auth/
├── components/       # Reusable UI components 
│   ├── AuthCard.tsx             # Layout wrapper for auth forms
│   ├── LoginForm.tsx            # Login form component
│   ├── RegisterForm.tsx         # Registration form component
│   ├── PasswordStrengthIndicator.tsx  # Password strength UI
│   ├── ProtectedRoute.tsx       # Route protection component
│   ├── RoleGuard.tsx            # Role-based access control
│   └── UserMenu.tsx             # User profile menu
├── hooks/            # React hooks for auth functionality
│   ├── useAuth.tsx              # Main auth hook
│   └── useAuthRedirect.tsx      # Redirect based on auth state
├── providers/        # Auth context providers
│   ├── AuthProvider.tsx         # Main auth context provider
│   └── AuthSyncProvider.tsx     # Cross-tab sync provider
├── services/         # Authentication services
│   ├── auth-service.ts          # Authentication API service
│   └── auth-api-service.ts      # Additional API operations
├── types/            # TypeScript definitions
│   └── index.ts                 # Auth-related types
└── utils/            # Utility functions
    └── password-validation.ts   # Password validation helpers
```

## Key Features

### Type Safety

All authentication operations are fully typed, providing excellent developer experience and catching potential errors at compile-time.

### Role-Based Access Control

The system supports fine-grained role-based access control for both UI components and routes:

```tsx
// Protect UI elements based on user role
<RoleGuard allowedRoles={['ADMIN', 'TEACHER']}>
  <AdminSettings />
</RoleGuard>

// Protect entire routes
<ProtectedRoute requiredRoles={['ADMIN']}>
  <AdminDashboard />
</ProtectedRoute>
```

### Cross-Tab Synchronization

Authentication state is synchronized across browser tabs, ensuring consistent user experience:

- When a user logs out in one tab, all other tabs are automatically logged out
- When a session expires in one tab, all tabs are updated

## Usage

### Basic Authentication

```tsx
import { useAuth } from '@/features/auth';

function MyComponent() {
  const { user, login, logout, register } = useAuth();
  
  // Check if user is authenticated
  if (user) {
    return <div>Welcome, {user.name}!</div>;
  }
  
  // Login example
  const handleLogin = async () => {
    const result = await login({
      email: 'user@example.com',
      password: 'password123'
    });
    
    if (result.success) {
      // User logged in successfully
    }
  };
  
  return <button onClick={handleLogin}>Login</button>;
}
```

### Protected Routes

```tsx
import { ProtectedRoute } from '@/features/auth';

function MyProtectedPage() {
  return (
    <ProtectedRoute>
      {/* Content only visible to authenticated users */}
      <div>Protected content</div>
    </ProtectedRoute>
  );
}
```

## Documentation

For more detailed information, please refer to the following guides:

- [Integration Guide](./INTEGRATION-GUIDE.md) - How to use the auth system in your components
- [Migration Guide](./MIGRATION-GUIDE.md) - How to migrate from the old auth system
- [Implementation Plan](./IMPLEMENTATION-PLAN.md) - Step-by-step plan for implementing the migration
- [Test Plan](./TEST-PLAN.md) - Comprehensive testing strategy for auth functionality

## Examples

Example implementations can be found in the `examples/` directory:

- [HomePage.tsx](./examples/HomePage.tsx) - Example home page with auth integration
- [AuthErrorPage.tsx](./examples/AuthErrorPage.tsx) - Example auth error page
- [DashboardPage.tsx](./examples/DashboardPage.tsx) - Example dashboard with role-based UI

## Contribution

When extending this authentication system, please follow these guidelines:

1. Keep components small and focused on a single responsibility
2. Use TypeScript for all new code
3. Document any new hooks or components in this README
4. Add tests for new functionality
5. Follow the existing coding style and structure

### Role-Based Access Control

```tsx
import { RoleGuard } from '@/features/auth';

function AdminPanel() {
  return (
    <RoleGuard 
      allowedRoles={['ADMIN']}
      redirect={true}
      fallback={<div>You don't have permission to access this page.</div>}
    >
      {/* Content only visible to admins */}
      <div>Admin Panel</div>
    </RoleGuard>
  );
}
```

### Login and Registration Forms

```tsx
import { LoginForm, RegisterForm } from '@/features/auth';

// Login page
function LoginPage() {
  return <LoginForm callbackUrl="/dashboard" />;
}

// Registration page
function SignupPage() {
  return <RegisterForm callbackUrl="/dashboard" />;
}
```

## Authentication Flow

1. User enters credentials in `LoginForm` or `RegisterForm`
2. Form calls corresponding method from `useAuth` hook
3. Auth service makes API request to backend
4. On success, user is redirected to the callback URL
5. Protected routes and components verify authentication status using `useAuth` hook

## Session Synchronization

The auth module includes a tab synchronization system that keeps authentication state in sync across browser tabs:

- When a user logs out in one tab, all other tabs will also log out
- When a token is refreshed, other tabs are notified
- Works across different pages of the application

This is implemented using the `AuthSyncProvider` and browser communication channels.
