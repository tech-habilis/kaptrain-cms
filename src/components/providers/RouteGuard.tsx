"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "./AuthProvider";

// Define route protection rules
const ROUTE_PERMISSIONS: Record<
  string,
  { requiredRole?: string; adminOnly?: boolean }
> = {
  "/admin": { adminOnly: true },
  "/dashboard": { requiredRole: "user" },
  "/profile": { requiredRole: "user" },
};

// Public routes that don't require authentication
const PUBLIC_ROUTES = ["/", "/auth/signin", "/auth/signup", "/auth/error"];

function isPublicRoute(pathname: string): boolean {
  return PUBLIC_ROUTES.some((route) => {
    return pathname === route || pathname.startsWith(`${route}/`);
  });
}

function getRequiredPermission(pathname: string) {
  // Check exact matches first
  if (ROUTE_PERMISSIONS[pathname]) {
    return ROUTE_PERMISSIONS[pathname];
  }

  // Check if path starts with any protected route
  for (const [route, permission] of Object.entries(ROUTE_PERMISSIONS)) {
    if (pathname.startsWith(route + "/")) {
      return permission;
    }
  }

  return null;
}

interface RouteGuardProps {
  children: React.ReactNode;
}

export function RouteGuard({ children }: RouteGuardProps) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    console.log("RouteGuard effect:", { user: !!user, loading, pathname });

    if (loading) return; // Wait for auth to load

    const isPublic = isPublicRoute(pathname);
    const requiredPermission = getRequiredPermission(pathname);

    console.log("Route check:", {
      isPublic,
      requiredPermission,
      hasUser: !!user,
    });

    // Redirect authenticated users away from auth pages
    if (user && (pathname === "/auth/signin" || pathname === "/auth/signup")) {
      console.log("Redirecting authenticated user away from auth pages");
      router.push("/dashboard");
      return;
    }

    // If route is public, allow access
    if (isPublic) {
      console.log("Public route, allowing access");
      return;
    }

    // If route requires auth and user is not authenticated
    if ((requiredPermission || !isPublic) && !user) {
      console.log("Protected route without user, redirecting to signin");
      const signInUrl = `/auth/signin?callbackUrl=${encodeURIComponent(
        pathname
      )}`;
      router.push(signInUrl);
      return;
    }

    // Check role-based permissions
    if (user && requiredPermission) {
      const userRole = user.role;

      // Check admin-only routes
      if (
        requiredPermission.adminOnly &&
        userRole !== "admin" &&
        userRole !== "superadmin"
      ) {
        console.log("Insufficient permissions, redirecting to dashboard");
        router.push("/dashboard?error=insufficient-permissions");
        return;
      }

      // Add more role checks here if needed
    }
  }, [user, loading, pathname, router]);

  // Show loading spinner while checking auth
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  // Show content
  return <>{children}</>;
}
