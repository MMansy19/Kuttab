// Re-export all auth components and hooks for easy imports

// Components
export { AuthCard } from './components/AuthCard';
export { LoginForm } from './components/LoginForm';
export { RegisterForm } from './components/RegisterForm';
export { PasswordStrengthIndicator } from './components/PasswordStrengthIndicator';
export { ProtectedRoute } from './components/ProtectedRoute';
export { RoleGuard } from './components/RoleGuard';
export { UserMenu } from './components/UserMenu';
export { AuthErrorHandler } from './components/AuthErrorHandler';

// Hooks
export { useAuth } from './hooks/useAuth';
export { useAuthSync } from './providers/AuthSyncProvider';
export { useAuthRedirect } from './hooks/useAuthRedirect';

// Providers
export { AuthProvider } from './providers/AuthProvider';
export { AuthSyncProvider } from './providers/AuthSyncProvider';

// Services
export { authService } from './services/auth-service';
export { authApiService } from './services/auth-api-service';

// Types
export type * from './types';

// Utils
export * from './utils/password-validation';
