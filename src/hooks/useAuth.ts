"use client";

import { useAuth as useSupabaseAuth } from "../components/providers/AuthProvider";
import { UserRole, hasPermission, ROLE_PERMISSIONS } from "../types/auth";

export function useAuth() {
  const { user, loading } = useSupabaseAuth();

  const isAuthenticated = !!user;
  const isLoading = loading;

  return {
    user,
    isAuthenticated,
    isLoading,
  };
}

export function useRole() {
  const { user, isAuthenticated } = useAuth();

  const userRole = user?.role;

  const hasRole = (requiredRole: UserRole): boolean => {
    if (!isAuthenticated || !userRole) return false;
    return hasPermission(userRole, requiredRole);
  };

  const canPerform = (
    action: "read" | "write" | "edit" | "delete" | "manage"
  ): boolean => {
    if (!isAuthenticated || !userRole) return false;

    const permissions = ROLE_PERMISSIONS[userRole];
    if (!permissions) return false;

    switch (action) {
      case "read":
        return permissions.canRead;
      case "write":
        return permissions.canWrite;
      case "edit":
        return permissions.canEdit;
      case "delete":
        return permissions.canDelete;
      case "manage":
        return permissions.canManageUsers;
      default:
        return false;
    }
  };

  const isAdmin = (): boolean => hasRole("admin");
  const isSuperAdmin = (): boolean => hasRole("superadmin");
  const isUser = (): boolean => hasRole("user");

  return {
    userRole,
    hasRole,
    canPerform,
    isAdmin,
    isSuperAdmin,
    isUser,
  };
}
