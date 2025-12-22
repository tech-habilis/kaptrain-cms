"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Badge } from "../ui/badge";

export function DashboardContent() {
  const { data: session } = useSession();
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await signOut({ callbackUrl: "/auth/signin" });
    } catch (error) {
      console.error("SignOut error:", error);
    }
  };

  const user = session?.user;
  const userRole = user?.role || "user";

  // Role-based permissions
  const canPerform = (action: string) => {
    switch (userRole) {
      case "superadmin":
        return true;
      case "admin":
        return ["read", "write", "edit", "delete"].includes(action);
      case "user":
        return action === "read";
      default:
        return false;
    }
  };

  const isAdmin = () => ["superadmin", "admin"].includes(userRole);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <h1 className="text-3xl font-bold text-gray-900">
                CMS Dashboard
              </h1>
              <Badge variant="secondary">{userRole}</Badge>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">
                Welcome, {user?.name || user?.email}
              </span>
              <Button onClick={handleSignOut} variant="outline">
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* User Info Card */}
            <Card>
              <CardHeader>
                <CardTitle>Your Profile</CardTitle>
                <CardDescription>Account information and role</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div>
                  <span className="font-medium">Email:</span> {user?.email}
                </div>
                {user?.name && (
                  <div>
                    <span className="font-medium">Name:</span> {user.name}
                  </div>
                )}
                <div>
                  <span className="font-medium">Role:</span>{" "}
                  <Badge variant="secondary">{userRole}</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Permissions Card */}
            <Card>
              <CardHeader>
                <CardTitle>Your Permissions</CardTitle>
                <CardDescription>What you can do in the CMS</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center space-x-2">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      canPerform("read") ? "bg-green-500" : "bg-red-500"
                    }`}
                  ></span>
                  <span>Read Content</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      canPerform("write") ? "bg-green-500" : "bg-red-500"
                    }`}
                  ></span>
                  <span>Create Content</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      canPerform("edit") ? "bg-green-500" : "bg-red-500"
                    }`}
                  ></span>
                  <span>Edit Content</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      canPerform("delete") ? "bg-green-500" : "bg-red-500"
                    }`}
                  ></span>
                  <span>Delete Content</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      canPerform("manage") ? "bg-green-500" : "bg-red-500"
                    }`}
                  ></span>
                  <span>Manage Users</span>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions Card */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Common tasks for your role</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {isAdmin() && (
                  <>
                    <Button variant="outline" className="w-full justify-start">
                      User Management
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      System Settings
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Role Hierarchy Info */}
            <Card className="md:col-span-2 lg:col-span-3">
              <CardHeader>
                <CardTitle>CMS Role Hierarchy</CardTitle>
                <CardDescription>
                  Understanding the different roles in the system
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <Badge
                      variant={userRole === "user" ? "default" : "secondary"}
                      className="mb-2"
                    >
                      User
                    </Badge>
                    <p className="text-sm text-gray-600">
                      Can read and browse published content
                    </p>
                  </div>
                  <div className="text-center">
                    <Badge
                      variant={userRole === "admin" ? "default" : "secondary"}
                      className="mb-2"
                    >
                      Admin
                    </Badge>
                    <p className="text-sm text-gray-600">
                      Can manage all content and moderate submissions
                    </p>
                  </div>
                  <div className="text-center">
                    <Badge
                      variant={
                        userRole === "superadmin" ? "default" : "secondary"
                      }
                      className="mb-2"
                    >
                      Super Admin
                    </Badge>
                    <p className="text-sm text-gray-600">
                      Full system access and user management
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
