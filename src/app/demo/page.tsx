"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";

export default function DemoPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Authentication Demo
          </h1>
          <p className="text-gray-600">
            Test the authentication system with these demo accounts
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                Demo Accounts
                <Badge variant="secondary">Credentials</Badge>
              </CardTitle>
              <CardDescription>
                Use these accounts to test different role levels
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                  <div>
                    <div className="font-medium">admin@example.com</div>
                    <div className="text-sm text-gray-600">password123</div>
                  </div>
                  <Badge variant="destructive">Admin</Badge>
                </div>

                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div>
                    <div className="font-medium">editor@example.com</div>
                    <div className="text-sm text-gray-600">password123</div>
                  </div>
                  <Badge variant="default">Editor</Badge>
                </div>

                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div>
                    <div className="font-medium">author@example.com</div>
                    <div className="text-sm text-gray-600">password123</div>
                  </div>
                  <Badge variant="secondary">Author</Badge>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-medium">viewer@example.com</div>
                    <div className="text-sm text-gray-600">password123</div>
                  </div>
                  <Badge variant="outline">Viewer</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                Google OAuth
                <Badge variant="secondary">OAuth</Badge>
              </CardTitle>
              <CardDescription>
                Sign in with your Google account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-gray-700">
                  When you sign in with Google, you'll be assigned the "Viewer"
                  role by default. Contact an administrator to request role
                  changes.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Role Permissions</CardTitle>
            <CardDescription>
              Understanding what each role can do in the CMS
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">Permission</th>
                    <th className="text-center p-2">Viewer</th>
                    <th className="text-center p-2">Author</th>
                    <th className="text-center p-2">Editor</th>
                    <th className="text-center p-2">Admin</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="p-2">Read Content</td>
                    <td className="text-center p-2">✅</td>
                    <td className="text-center p-2">✅</td>
                    <td className="text-center p-2">✅</td>
                    <td className="text-center p-2">✅</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-2">Create Content</td>
                    <td className="text-center p-2">❌</td>
                    <td className="text-center p-2">✅</td>
                    <td className="text-center p-2">✅</td>
                    <td className="text-center p-2">✅</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-2">Edit Content</td>
                    <td className="text-center p-2">❌</td>
                    <td className="text-center p-2">✅ (Own)</td>
                    <td className="text-center p-2">✅ (All)</td>
                    <td className="text-center p-2">✅ (All)</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-2">Delete Content</td>
                    <td className="text-center p-2">❌</td>
                    <td className="text-center p-2">❌</td>
                    <td className="text-center p-2">✅</td>
                    <td className="text-center p-2">✅</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-2">Manage Users</td>
                    <td className="text-center p-2">❌</td>
                    <td className="text-center p-2">❌</td>
                    <td className="text-center p-2">❌</td>
                    <td className="text-center p-2">✅</td>
                  </tr>
                  <tr>
                    <td className="p-2">Assign Roles</td>
                    <td className="text-center p-2">❌</td>
                    <td className="text-center p-2">❌</td>
                    <td className="text-center p-2">❌</td>
                    <td className="text-center p-2">✅</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
