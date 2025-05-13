// Define Role and Gender types locally since they aren't enums in Prisma schema
export enum Role {
  USER = "USER",
  TEACHER = "TEACHER",
  ADMIN = "ADMIN"
}

export enum Gender {
  MALE = "MALE",
  FEMALE = "FEMALE"
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  image?: string | null;
  role: Role | string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  role: Role | string;
  gender: Gender | string;
}

export interface AuthResult {
  success: boolean;
  message?: string;
  user?: AuthUser;
  error?: string;
  redirectUrl?: string;
}

export type AuthStatus = 'authenticated' | 'unauthenticated' | 'loading';

export interface AuthSession {
  user: AuthUser;
  expires: string;
}
