import { Suspense } from "react";
import { SignupForm } from "../../../components/auth/SignupForm";

interface SignUpPageProps {
  searchParams: Promise<{
    callbackUrl?: string;
  }>;
}

export default async function SignUpPage({ searchParams }: SignUpPageProps) {
  const params = await searchParams;

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SignupForm />
    </Suspense>
  );
}
