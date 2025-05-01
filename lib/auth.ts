import { NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Missing credentials");
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email,
          },
        });

        if (!user || !user.password) {
          throw new Error("Invalid credentials");
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isPasswordValid) {
          throw new Error("Invalid credentials");
        }

        // Transform the Prisma User to match NextAuth User interface
        // This ensures we have non-null values for required fields
        return {
          id: user.id,
          name: user.name || "",
          email: user.email || "",
          image: user.image,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, account, trigger }) {
      // Initial sign in
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.role = user.role;
        token.name = user.name;
        token.image = user.image;
        // Add issued at time for token rotation validation
        token.iat = Math.floor(Date.now() / 1000);
      }
      
      // Return token with minimal modification to reduce session updates
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.role = token.role as "USER" | "TEACHER" | "ADMIN";
        session.user.email = token.email as string;
        session.user.name = token.name as string;
        session.user.image = token.image as string | null;
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/login",
    signOut: "/",
    error: "/auth/error",
  },
  session: {
    strategy: "jwt",
    // Extend session lifetime to reduce frequent renewals
    maxAge: 24 * 60 * 60, // 24 hours
  },
  jwt: {
    // Extend token max age to match session
    maxAge: 24 * 60 * 60, // 24 hours
  },
  secret: process.env.NEXTAUTH_SECRET,
  // Prevent excessive debug logging
  debug: process.env.NODE_ENV === "development",
  // Only send cookie on same-origin requests
  cookies: {
    sessionToken: {
      name: `__Secure-next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: true,
      },
    },
  },
};