import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

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
  providers: [    CredentialsProvider({
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

        try {          // Always use mock users mode for now to debug
          debug("Using mock users for authentication");
          
          // For the test email specifically, always allow access with any password
          // DEVELOPMENT ONLY - REMOVE IN PRODUCTION
          if (credentials.email === "mmansy132003@gmail.com") {
            debug("Special case for test user - allowing access");
            return {
              id: "test-user-id",
              name: "Test User",
              email: credentials.email,
              image: "/images/icons/user-avatar.svg",
              role: "USER",
            };
          }
          
          // Try to find user in mock data
          const user = mockUsers.find(user => user.email.toLowerCase() === credentials.email.toLowerCase());
          
          if (!user) {
            // If the user doesn't exist in mockUsers but we're in frontend-only mode,
            // try to check if this is a newly registered user
            debug("User not found in mock data, checking if this is a registered user");
            
            // For any email with "@" - allow login with password "password123" or "11111111"
            // This allows newly registered users to login in frontend-only mode
            if (credentials.email.includes("@") && 
                (credentials.password === "password123" || credentials.password === "11111111")) {
              debug("Allowing access for registered user with standard password");
              return {
                id: `registered-${Date.now()}`,
                name: credentials.email.split('@')[0], // Use part of email as name
                email: credentials.email,
                image: "/images/icons/user-avatar.svg",
                role: "USER",
              };
            }
            
            debug("User not found in mock data and password doesn't match standard ones");
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
        debug("JWT callback - adding user data to token:", user.id, user.role);
        token.id = user.id;
        token.role = user.role || "USER"; // Default to USER role if none provided
        token.name = user.name;
        token.email = user.email;
        token.picture = user.image;
      }
      debug("JWT callback returning token:", token);
      return token;
    },
    async session({ session, token }) {
      // Ensure user object exists and properly typed
      debug("Session callback - adding token data to session:", token.id, token.role);
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.name = token.name as string;
        session.user.email = token.email as string;
        session.user.image = token.picture as string | undefined;
      }
      debug("Session callback returning session:", session);
      return session;
    },    async redirect({ url, baseUrl }) {
      // Handle relative callback URLs
      debug("Redirect - URL:", url, "BaseURL:", baseUrl);
      
      // Make sure dashboard URLs are properly handled
      if (url.startsWith("/dashboard") || url.includes("/dashboard")) {
        debug("Dashboard URL detected in redirect, allowing:", url);
        return `${baseUrl}${url.startsWith("/") ? url : `/${url}`}`;
      }
      
      // Default redirect behavior
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      // Handle absolute URLs - use try/catch to handle invalid URLs
      try {
        if (new URL(url).origin === baseUrl) return url;
      } catch (e) {
        debug("Invalid URL in redirect callback:", url);
        return `${baseUrl}/dashboard`;
      }
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
  debug: process.env.NODE_ENV === "development",  cookies: {
    sessionToken: {
      name: process.env.NODE_ENV === "production" 
        ? `__Secure-next-auth.session-token`
        : `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
  },
};