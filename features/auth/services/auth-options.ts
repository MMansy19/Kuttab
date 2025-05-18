import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { isFrontendOnlyMode } from "@/lib/config";

/**
 * Authentication configuration options for NextAuth.js
 */
export const authOptions: NextAuthOptions = {
  // Only use PrismaAdapter if not in frontend-only mode (don't check instance type on client)
  ...(typeof window === "undefined" && !isFrontendOnlyMode ? { adapter: PrismaAdapter(prisma) } : {}),
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      // Add the required req parameter for NextAuth type compatibility
      async authorize(credentials, req) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          const user = await prisma.user.findUnique({
            where: { email: credentials.email }
          });

          // Check if user exists and has a password
          const storedPassword = user?.password;
          if (!user || !storedPassword) {
            return null;
          }

          const isPasswordValid = await bcrypt.compare(
            credentials.password,
            storedPassword
          );

          if (!isPasswordValid) {
            return null;
          }

          // Return a properly typed User object (non-null values)
          return {
            id: user.id,
            name: user.name || "",  // Use empty string instead of undefined/null
            email: user.email || "",
            image: user.image || "",
            role: user.role
          };
        } catch (error) {
          console.error("Auth error:", error);
          return null;
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      // Include user role and id in the JWT token
      if (user) {
        token.role = user.role;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      // Make role and id available in the session
      if (session.user && token) {
        session.user.role = token.role as string;
        session.user.id = token.id as string;
      }
      return session;
    }
  },
  pages: {
    signIn: '/auth/login',
    error: '/auth/error',
    signOut: '/auth/login'
  },
  debug: process.env.NODE_ENV === 'development'
};
