# Authentication Migration Guide

This guide provides instructions for migrating from the old authentication implementation to the new modular authentication system. This new approach organizes code better and makes it easier to maintain, extend, and test.

## Table of Contents

1. [Overview of Changes](#overview-of-changes)
2. [Step-by-Step Migration](#step-by-step-migration)
3. [Common Migration Patterns](#common-migration-patterns)
4. [FAQ](#faq)

## Overview of Changes

The key changes in the new authentication system:

- **Features-based Organization**: All auth code now lives in `features/auth/` directory
- **Separation of Concerns**: UI components, business logic, and API services are now separated
- **Centralized Auth Types**: Common types are defined in `features/auth/types`
- **Simplified Hooks**: The `useAuth` hook provides a unified API for all auth functionality
- **Improved Sync**: Better handling of authentication state across browser tabs
- **Enhanced Password Security**: More robust password validation and UI feedback

## Step-by-Step Migration

### 1. Update Provider in Root Layout

Replace the old SessionProvider with the new AuthProvider:

```tsx
// old implementation in layout.tsx
import SessionProvider from "@/components/SessionProvider";

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <SessionProvider>
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
```

```tsx
// new implementation in layout.tsx
import { AuthProvider } from "@/features/auth";

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
```

### 2. Update Authentication Pages

Replace the old auth pages with the new ones:

```tsx
// app/auth/login/page.tsx - replace with:
"use client";

import { AuthCard, LoginForm } from "@/features/auth";
import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";

export default function LoginPage() {
  const searchParams = useSearchParams();
  const [urlError, setUrlError] = useState(null);
  const callbackUrl = searchParams?.get("callbackUrl") || "/dashboard";
  
  useEffect(() => {
    const errorParam = searchParams?.get("error");
    if (errorParam) {
      setUrlError(decodeURIComponent(errorParam));
    }
  }, [searchParams]);

  return (
    <AuthCard title="مرحبًا بعودتك" error={urlError}>
      <LoginForm callbackUrl={callbackUrl} />
    </AuthCard>
  );
}
```

```tsx
// app/auth/signup/page.tsx - replace with:
"use client";

import { AuthCard, RegisterForm } from "@/features/auth";
import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";

export default function SignupPage() {
  const searchParams = useSearchParams();
  const [urlError, setUrlError] = useState(null);
  const callbackUrl = searchParams?.get("callbackUrl") || "/dashboard";
  
  useEffect(() => {
    const errorParam = searchParams?.get("error");
    if (errorParam) {
      setUrlError(decodeURIComponent(errorParam));
    }
  }, [searchParams]);

  return (
    <AuthCard title="إنشاء حساب جديد" error={urlError}>
      <RegisterForm callbackUrl={callbackUrl} />
    </AuthCard>
  );
}
```

### 3. Update Components Using Auth

Replace `useSession` with `useAuth`:

```tsx
// Old way
import { useSession } from "next-auth/react";

function MyComponent() {
  const { data: session, status } = useSession();
  
  if (status === "loading") return <div>Loading...</div>;
  if (status === "unauthenticated") return <div>Please login</div>;
  
  return <div>Welcome {session?.user?.name}</div>;
}
```

```tsx
// New way
import { useAuth } from "@/features/auth";

function MyComponent() {
  const { user, status } = useAuth();
  
  if (status === "loading") return <div>Loading...</div>;
  if (status === "unauthenticated") return <div>Please login</div>;
  
  return <div>Welcome {user?.name}</div>;
}
```

### 4. Replace Role-Based Guards

Update role-based access components:

```tsx
// Old way
import RoleGuard from "@/components/auth/RoleGuard";

function AdminPage() {
  return (
    <RoleGuard allowedRoles={["admin"]} redirect>
      <div>Admin content</div>
    </RoleGuard>
  );
}
```

```tsx
// New way
import { RoleGuard } from "@/features/auth";

function AdminPage() {
  return (
    <RoleGuard allowedRoles={["ADMIN"]} redirect>
      <div>Admin content</div>
    </RoleGuard>
  );
}
```

### 5. Replace Direct Auth Actions

Replace direct auth actions with the new hooks:

```tsx
// Old way
import { signOut } from "next-auth/react";

function LogoutButton() {
  return (
    <button onClick={() => signOut()}>
      Logout
    </button>
  );
}
```

```tsx
// New way
import { useAuth } from "@/features/auth";

function LogoutButton() {
  const { logout } = useAuth();
  
  return (
    <button onClick={logout}>
      Logout
    </button>
  );
}
```

## Common Migration Patterns

### Protected API Routes

```tsx
// Old way
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  
  // Protected API logic here
}
```

The server-side authentication check can remain the same for now, but will be updated in a future migration.

### Using the UserMenu Component

Add the new UserMenu component to your navigation:

```tsx
import { UserMenu } from "@/features/auth";

function Navigation() {
  return (
    <nav>
      <div className="logo">My App</div>
      <div className="links">
        <a href="/">Home</a>
        <a href="/about">About</a>
      </div>
      <UserMenu />
    </nav>
  );
}
```

## FAQ

### Why migrate to this new system?

The new authentication system offers better organization, separation of concerns, and maintainability. It makes it easier to extend functionality and fix bugs.

### Will this break existing functionality?

The migration is designed to maintain feature parity with the existing system. The user experience should remain the same or better.

### How do I handle custom authentication scenarios?

The `useAuth` hook provides access to all authentication capabilities. For advanced scenarios, additional hooks and utilities can be added to the auth feature.

### Is this compatible with NextAuth.js?

Yes, the new system is built on top of NextAuth.js and maintains compatibility with it. It just provides a more organized way to use NextAuth.
