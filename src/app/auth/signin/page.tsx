import { Suspense } from "react";
import { LoginForm } from "../../../components/auth/LoginForm";

interface SignInPageProps {
  searchParams: Promise<{
    callbackUrl?: string;
    message?: string;
  }>;
}

export default async function SignInPage({ searchParams }: SignInPageProps) {
  const params = await searchParams;

  return (
    <div>
      {params.message && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 p-4 text-sm text-green-600 bg-green-50 border border-green-200 rounded-md">
          {params.message}
        </div>
      )}
      <Suspense fallback={<div>Loading...</div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
