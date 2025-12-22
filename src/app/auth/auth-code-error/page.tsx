import Link from "next/link";
import { Button } from "../../../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";

export default function AuthCodeErrorPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-center text-red-600">
              Authentication Error
            </CardTitle>
            <CardDescription className="text-center">
              There was an error during the authentication process.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-600 text-center">
              The authentication code was invalid or expired. Please try signing
              in again.
            </p>
            <div className="flex flex-col space-y-2">
              <Button asChild className="w-full">
                <Link href="/auth/signin">Try Again</Link>
              </Button>
              <Button variant="outline" asChild className="w-full">
                <Link href="/">Go Home</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
