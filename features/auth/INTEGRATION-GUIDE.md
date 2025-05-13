# Authentication Integration Guide

This guide provides common patterns and best practices for integrating the authentication system in various scenarios within your application.

## Table of Contents
- [Basic Authentication](#basic-authentication)
- [Protected Pages](#protected-pages)
- [Role-Based Access Control](#role-based-access-control)
- [Authentication Flow](#authentication-flow)
- [API Route Protection](#api-route-protection)
- [Custom Auth UI](#custom-auth-ui)
- [Performance Considerations](#performance-considerations)

## Basic Authentication

### Getting the Current User

```tsx
import { useAuth } from '@/features/auth';

function ProfileWidget() {
  const { user, status } = useAuth();
  
  if (status === 'loading') {
    return <div>Loading...</div>;
  }
  
  if (!user) {
    return <div>Please log in</div>;
  }
  
  return <div>Welcome, {user.name}!</div>;
}
```

### Login and Logout

```tsx
import { useAuth } from '@/features/auth';

function AuthButtons() {
  const { user, login, logout } = useAuth();
  
  const handleLogin = async () => {
    const result = await login({
      email: 'user@example.com',
      password: 'password123'
    });
    
    if (result.success) {
      console.log('Logged in successfully');
    } else {
      console.error('Login failed:', result.error);
    }
  };
  
  return user ? (
    <button onClick={logout}>Logout</button>
  ) : (
    <button onClick={handleLogin}>Login</button>
  );
}
```

## Protected Pages

### Client-Side Protection

```tsx
// pages/dashboard.tsx
"use client";

import { ProtectedRoute } from '@/features/auth';

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <h1>Dashboard</h1>
      <p>This content is only visible to authenticated users</p>
    </ProtectedRoute>
  );
}
```

### Using the Redirect Hook

```tsx
// pages/settings.tsx
"use client";

import { useAuthRedirect } from '@/features/auth/hooks/useAuthRedirect';

export default function SettingsPage() {
  // This will automatically redirect unauthenticated users to login
  useAuthRedirect({
    redirectIfUnauthenticated: true,
  });
  
  return (
    <div>
      <h1>Settings</h1>
      <p>Your account settings</p>
    </div>
  );
}
```

## Role-Based Access Control

### With RoleGuard Component

```tsx
// pages/admin/index.tsx
"use client";

import { RoleGuard } from '@/features/auth';

export default function AdminPage() {
  return (
    <RoleGuard 
      allowedRoles={['ADMIN']} 
      redirect={true}
      fallback={<div>You don't have permission to view this page</div>}
    >
      <h1>Admin Dashboard</h1>
      <p>Only administrators can see this content</p>
    </RoleGuard>
  );
}
```

### With useAuthRedirect Hook

```tsx
// pages/teacher/courses.tsx
"use client";

import { useAuthRedirect } from '@/features/auth/hooks/useAuthRedirect';

export default function TeacherCoursesPage() {
  const { user } = useAuthRedirect({
    redirectIfUnauthenticated: true,
    requiredRoles: ['TEACHER', 'ADMIN'],
  });
  
  return (
    <div>
      <h1>Your Courses</h1>
      <p>Manage your teaching courses</p>
    </div>
  );
}
```

### Conditionally Showing UI Elements

```tsx
import { useAuth } from '@/features/auth';

function NavigationMenu() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'ADMIN';
  const isTeacher = user?.role === 'TEACHER';
  
  return (
    <nav>
      <a href="/dashboard">Dashboard</a>
      
      {isTeacher && (
        <a href="/dashboard/teacher/schedule">My Schedule</a>
      )}
      
      {isAdmin && (
        <>
          <a href="/dashboard/admin/users">Manage Users</a>
          <a href="/dashboard/admin/settings">System Settings</a>
        </>
      )}
    </nav>
  );
}
```

## Authentication Flow

### Login Flow

1. User visits `/auth/login`
2. Enters credentials in `<LoginForm />`
3. On success, redirected to specified callback URL or role-specific dashboard
4. Session is established and available via `useAuth()`

### Registration Flow

1. User visits `/auth/signup`
2. Completes form in `<RegisterForm />`
3. On success, automatically redirected to login with email pre-filled
4. Completes login to establish session

### Logout Flow

1. User clicks logout button which calls `logout()` from `useAuth()`
2. Session is cleared and user is redirected to login page
3. All browser tabs are synchronized via `AuthSyncProvider`

## API Route Protection

### Server-Side Authentication Check

```ts
// app/api/protected-route/route.ts
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return NextResponse.json(
      { error: "يجب تسجيل الدخول أولاً" },
      { status: 401 }
    );
  }
  
  // Your protected API logic here
  return NextResponse.json({ data: "Protected data" });
}
```

### Role-Based API Protection

```ts
// app/api/admin/route.ts
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return NextResponse.json(
      { error: "يجب تسجيل الدخول أولاً" },
      { status: 401 }
    );
  }
  
  // Check if user has admin role
  if (session.user.role !== "ADMIN") {
    return NextResponse.json(
      { error: "غير مصرح بهذه العملية" },
      { status: 403 }
    );
  }
  
  // Admin-only API logic here
  return NextResponse.json({ success: true });
}
```

## Custom Auth UI

### Creating a Custom Login Form

```tsx
"use client";

import { useState } from 'react';
import { useAuth } from '@/features/auth';

export function CustomLoginForm() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const result = await login({ email, password });
    
    if (result.success) {
      // Handle success
    } else {
      // Handle error
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        required
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        required
      />
      <button type="submit">Login</button>
    </form>
  );
}
```

### Using the Password Strength Indicator

```tsx
"use client";

import { useState } from 'react';
import { PasswordStrengthIndicator } from '@/features/auth';

export function CustomPasswordField() {
  const [password, setPassword] = useState('');
  
  return (
    <div>
      <label>Password</label>
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      
      <PasswordStrengthIndicator
        password={password}
        showSuggestions={true}
      />
    </div>
  );
}
```

## Performance Considerations

### Session Caching

The authentication system includes built-in session caching to minimize redundant API calls. This is handled automatically through the `authService`.

### Code Splitting

All authentication components are exported individually to support code splitting:

```tsx
// Only imports the specific components needed
import { LoginForm } from '@/features/auth/components/LoginForm';
import { useAuth } from '@/features/auth/hooks/useAuth';
```

### Avoiding Unnecessary Re-renders

The `useAuth` hook is optimized to minimize re-renders. It only triggers component updates when the actual authentication state changes.

For components that only need to check if a user is authenticated but don't need the user details, use destructuring to only get what you need:

```tsx
// More efficient, only re-renders on status changes
const { status } = useAuth();

// Less efficient, re-renders when any user property changes
const { user } = useAuth();
```
