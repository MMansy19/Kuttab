import NextAuth from "next-auth";
import { Role } from "@prisma/client";

declare module "next-auth" {
  interface User {
    id: string;
    role: Role;
    name: string;
    email: string;
    image?: string | null;
  }

  interface Session {
    user: {
      id: string;
      role: Role;
      name: string;
      email: string;
      image?: string | null;
    }
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: Role;
    name: string;
    email: string;
    image?: string | null;
  }
}