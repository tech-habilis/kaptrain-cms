"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../hooks/useAuth";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";

export default function Home() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (isAuthenticated) {
    return null; // Will redirect to dashboard
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Kaptrain CMS
          </h1>
          <p className="text-lg text-gray-600">
            Content Management System with Role-Based Authentication
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-center">Welcome</CardTitle>
            <CardDescription className="text-center">
              Sign in to access your CMS dashboard
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              className="w-full"
              onClick={() => router.push("/auth/signin")}
            >
              Sign In
            </Button>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => router.push("/auth/signup")}
            >
              Create Account
            </Button>
          </CardContent>
        </Card>

        <div className="text-center text-sm text-gray-500">
          <p>Role-based access control with:</p>
          <div className="flex justify-center space-x-2 mt-2">
            <span className="px-2 py-1 bg-gray-200 rounded text-xs">
              Superadmin
            </span>
            <span className="px-2 py-1 bg-gray-200 rounded text-xs">Admin</span>
            <span className="px-2 py-1 bg-gray-200 rounded text-xs">User</span>
          </div>
        </div>
      </div>
    </div>
  );
}
