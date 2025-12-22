// Authentication types for CMS system with role-based access control

export type UserRole = "superadmin" | "admin" | "user";

export interface User {
  id: string;
  email: string;
  name?: string;
  first_name?: string;
  last_name?: string;
  emailVerified?: Date;
  image?: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserProfile {
  id: string;
  displayName?: string;
  bio?: string;
  avatarUrl?: string;
  preferences: Record<string, any>;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

export interface Account {
  id: string;
  type: string;
  provider: string;
  providerAccountId: string;
  refreshToken?: string;
  accessToken?: string;
  expiresAt?: number;
  tokenType?: string;
  scope?: string;
  idToken?: string;
  sessionState?: string;
  userId: string;
}

export interface Session {
  user: {
    id: string;
    email: string;
    name?: string;
    image?: string;
    role: UserRole;
  };
  supabaseAccessToken: string;
  expires: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  role?: UserRole; // Optional, defaults to 'user'
}

export interface AuthResponse {
  success: boolean;
  user?: User;
  error?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

// Role hierarchy for permission checking
export const ROLE_HIERARCHY: Record<UserRole, number> = {
  superadmin: 1,
  admin: 2,
  user: 3,
};

// Role permissions
export interface RolePermissions {
  canRead: boolean;
  canWrite: boolean;
  canEdit: boolean;
  canDelete: boolean;
  canManageUsers: boolean;
  canAssignRoles: boolean;
}

export const ROLE_PERMISSIONS: Record<UserRole, RolePermissions> = {
  user: {
    canRead: true,
    canWrite: false,
    canEdit: false,
    canDelete: false,
    canManageUsers: false,
    canAssignRoles: false,
  },
  admin: {
    canRead: true,
    canWrite: true,
    canEdit: true, // All content
    canDelete: true,
    canManageUsers: false,
    canAssignRoles: false,
  },
  superadmin: {
    canRead: true,
    canWrite: true,
    canEdit: true,
    canDelete: true,
    canManageUsers: true,
    canAssignRoles: true,
  },
};

// Utility functions for role checking
export function hasPermission(
  userRole: UserRole,
  requiredRole: UserRole
): boolean {
  return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[requiredRole];
}

export function canPerformAction(
  userRole: UserRole,
  action: keyof RolePermissions
): boolean {
  return ROLE_PERMISSIONS[userRole][action];
}

export function getDefaultRole(): UserRole {
  return "user";
}

export function isValidRole(role: string): role is UserRole {
  return ["superadmin", "admin", "user"].includes(role);
}
