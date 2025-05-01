import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";

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
        if (!credentials?.email || !credentials?.password) {
          return null // Return null instead of throwing error
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user || !user.password) {
          return null
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isPasswordValid) {
          return null
        }

        return {
          id: user.id,
          name: user.name || (user.email ? user.email.split('@')[0] : 'user'), // Fallback name
          email: user.email || '', // Ensure email is never null
          image: user.image,
          role: user.role,
        };
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
      if (url.startsWith("/")) return `${baseUrl}${url}`
      // Handle absolute URLs
      else if (new URL(url).origin === baseUrl) return url
      return baseUrl
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
  secret: process.env.NEXTAUTH_SECRET,
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
}