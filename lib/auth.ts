import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import { isFrontendOnlyMode } from "./config";

// Helper function for debug logging in development
const debug = (...args: any[]) => {
  if (process.env.NODE_ENV === "development") {
    console.log("[Auth Debug]", ...args);
  }
};

// Mock users for frontend-only mode with plain text password for testing
const mockUsers = [
  {
    id: "mock-user-1",
    name: "Demo User",
    email: "demo@example.com",
    password: "$2a$12$k8Y.iR8Y5Oe7UKGCIxOy3OW9tRK/xd7ItpfmOGe1WQL9Yl/0GJoXu", // hashed "password123"
    plainPassword: "password123", // For direct comparison if bcrypt fails
    role: "USER",
    image: "/images/icons/user-avatar.svg"
  },
  {
    id: "mock-teacher-1",
    name: "Demo Teacher",
    email: "teacher@example.com",
    password: "$2a$12$k8Y.iR8Y5Oe7UKGCIxOy3OW9tRK/xd7ItpfmOGe1WQL9Yl/0GJoXu", // hashed "password123"
    plainPassword: "password123", // For direct comparison if bcrypt fails
    role: "TEACHER",
    image: "/images/icons/teacher-avatar.svg"
  },
  {
    id: "mock-admin-1",
    name: "Demo Admin",
    email: "admin@example.com",
    password: "$2a$12$k8Y.iR8Y5Oe7UKGCIxOy3OW9tRK/xd7ItpfmOGe1WQL9Yl/0GJoXu", // hashed "password123"
    plainPassword: "password123", // For direct comparison if bcrypt fails
    role: "ADMIN",
    image: "/images/icons/admin-avatar.svg"
  },
  {
    id: "mock-admin-2",
    name: "Admin User",
    email: "admin@admin.com",
    password: "$2a$12$k8Y.iR8Y5Oe7UKGCIxOy3OW9tRK/xd7ItpfmOGe1WQL9Yl/0GJoXu", // hashed "password123"
    plainPassword: "password123", // For direct comparison if bcrypt fails
    role: "ADMIN",
    image: "/images/icons/admin-avatar.svg"
  },
  // Add your registration test user
  {
    id: "mock-user-2",
    name: "mahmoud",
    email: "mmansy132003@gmail.com",
    password: "$2a$12$k8Y.iR8Y5Oe7UKGCIxOy3OW9tRK/xd7ItpfmOGe1WQL9Yl/0GJoXu", // hashed "11111111"
    plainPassword: "11111111", // For direct comparison 
    role: "USER",
    gender: "MALE",
    image: "/images/icons/user-avatar.svg"
  }
];

// Always force frontend-only mode for now to ensure mock users are used
const forceFrontendOnly = true;

debug("Auth configuration loading. Frontend-only mode:", forceFrontendOnly);

// Remove PrismaAdapter to fix compatibility issues
export const authOptions: NextAuthOptions = {
  // Adapter removed due to Prisma version incompatibilities
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        debug("Authorization attempt for email:", credentials?.email);

        if (!credentials?.email || !credentials?.password) {
          debug("Missing credentials");
          return null;
        }

        try {
          // Always use mock users mode for now to debug
          debug("Using mock users for authentication");
          const user = mockUsers.find(user => user.email === credentials.email);
          
          if (!user) {
            debug("User not found in mock data");
            return null;
          }
          
          debug("Found user:", user.email, "with role:", user.role);
          
          // Try direct password comparison first for debugging
          if (credentials.password === user.plainPassword) {
            debug("Direct password match successful");
            return {
              id: user.id,
              name: user.name,
              email: user.email,
              image: user.image,
              role: user.role,
            };
          }
          
          // Fall back to bcrypt compare 
          try {
            const isPasswordValid = await bcrypt.compare(
              credentials.password,
              user.password
            );
            
            debug("bcrypt password comparison result:", isPasswordValid);
            
            if (!isPasswordValid) {
              debug("Password invalid");
              return null;
            }
            
            return {
              id: user.id,
              name: user.name,
              email: user.email,
              image: user.image,
              role: user.role,
            };
          } catch (bcryptError) {
            debug("bcrypt comparison error:", bcryptError);
            // If we already matched the plaintext password earlier, we'd have returned
            debug("No fallback available, authentication failed");
            return null;
          }
        } catch (error) {
          debug("Authentication error:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        // Type the token correctly to accept custom properties
        return {
          ...token,
          id: user.id,
          role: user.role || "USER" // Default to USER role if none provided
        };
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        // Ensure user object exists and properly typed
        session.user = {
          ...session.user,
          id: token.id as string,
          role: token.role as string
        };
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      // Handle relative callback URLs
      debug("Redirect - URL:", url, "BaseURL:", baseUrl);
      
      // Default redirect behavior
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      // Handle absolute URLs
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    }
  },
  pages: {
    signIn: "/auth/login",
    error: "/auth/error", // Custom error page
    newUser: "/dashboard" // Where to redirect after first sign in
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60 // 24 hours
  },
  jwt: {
    maxAge: 30 * 24 * 60 * 60, // Match session maxAge
  },
  secret: process.env.NEXTAUTH_SECRET || 'frontend-only-deployment-secret',
  debug: process.env.NODE_ENV === "development",
  cookies: {
    sessionToken: {
      name: `__Secure-next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
  },
};