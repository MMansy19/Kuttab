import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "./prisma";
import { DefaultSession } from "next-auth";

// Use a default secret for build time, but require real secret at runtime
const getAuthSecret = () => {
  if (process.env.NEXTAUTH_SECRET) {
    return process.env.NEXTAUTH_SECRET;
  }
  
  // During build time, use a placeholder
  if (process.env.NODE_ENV === 'production' && process.env.NEXT_PUBLIC_BUILD_MODE === 'true') {
    console.warn('Using placeholder NEXTAUTH_SECRET for build process');
    return 'build-time-placeholder-secret-not-used-in-runtime';
  }
  
  throw new Error("NEXTAUTH_SECRET is not set in environment variables");
};

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials): Promise<any> {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("البريد الإلكتروني وكلمة المرور مطلوبان");
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email.toLowerCase() },
        });

        if (!user) {
          throw new Error("المستخدم غير موجود");
        }

        if (!user.password) {
          throw new Error("هذا الحساب مسجل بواسطة مزود خارجي");
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isPasswordValid) {
          throw new Error("كلمة المرور غير صحيحة");
        }

        // Ensure we return a proper User object that matches NextAuth's expectations
        return {
          id: user.id,
          name: user.name || "",
          email: user.email || "", // Ensure email is never null
          role: user.role || "USER", // Default role if not specified
          image: user.image || null,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role || "USER";
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
    newUser: "/dashboard",
  },  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: getAuthSecret(),
  debug: process.env.NODE_ENV === "development",
};

// Extend the User type to match our returned user object
declare module "next-auth" {
  interface User {
    id: string;
    name: string;
    email: string;
    role: string;
    image?: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: string;
  }
}

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      role: string;
      image?: string | null;
    } & DefaultSession["user"];
  }
}