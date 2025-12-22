"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Eye, EyeOff, Check } from "lucide-react";

interface LoginFormData {
  email: string;
  password: string;
}

export function LoginForm() {
  const router = useRouter();
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (!formData.email || !formData.password) {
      setError("Email et mot de passe requis");
      setIsLoading(false);
      return;
    }

    try {
      const result = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (result?.error) {
        setError("Email ou mot de passe incorrect");
      } else if (result?.ok) {
        router.push("/dashboard");
        router.refresh();
      }
    } catch (error) {
      setError("Une erreur est survenue");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await signIn("google", { callbackUrl: "/dashboard" });
    } catch (error) {
      setError("Erreur de connexion avec Google");
    }
  };

  const handleAppleLogin = () => {
    // TODO: Implement Apple OAuth
    console.log("Apple login clicked");
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Top section (mobile) / Left side (desktop) - Brand */}
      <div className="lg:hidden bg-slate-900 relative overflow-hidden py-8 px-6">
        <Image
          src="/img/bg_signin.png"
          alt="Background"
          fill
          className="object-cover opacity-30"
        />
        <div className="relative z-10 text-white">
          <div className="flex items-center mb-6">
            <Image
              src="/img/logo.png"
              alt="KAPTRAIN Logo"
              width={32}
              height={43}
              className="mr-2"
            />
            <h1 className="text-xl font-bold">KAPTRAIN</h1>
          </div>
          <h2 className="text-2xl font-bold mb-4">Connecte toi à ton compte</h2>
          <p className="text-sm text-gray-300">
            Tu n'as pas de compte ?{" "}
            <Link
              href="/auth/signup"
              className="text-blue-400 hover:underline font-medium"
            >
              Inscris toi
            </Link>
          </p>
        </div>
      </div>

      {/* Desktop left side - Brand */}
      <div className="hidden lg:flex lg:w-1/2 bg-slate-900 relative overflow-hidden">
        <Image
          src="/img/bg_signin.png"
          alt="Background"
          fill
          className="object-cover opacity-30"
        />
        <div className="relative z-10 flex flex-col justify-center items-center text-white w-full h-full p-12">
          <div className="text-center">
            <div className="mb-8">
              <Image
                src="/img/logo.png"
                alt="KAPTRAIN Logo"
                width={80}
                height={108}
                className="mx-auto mb-6"
              />
              <h1 className="text-4xl font-bold mb-2">KAPTRAIN</h1>
            </div>
            <div>
              <h2 className="text-2xl font-semibold mb-2">
                L'Expertise de haut
              </h2>
              <h2 className="text-2xl font-semibold">
                niveau, accessible à tous
              </h2>
            </div>
          </div>
        </div>
      </div>

      {/* Form section */}
      <div className="flex-1 lg:w-1/2 flex items-center justify-center px-6 lg:p-8 bg-white lg:bg-gray-50">
        <Card className="w-full max-w-md border-0 shadow-none bg-transparent">
          <CardContent className="p-0">
            <div className="space-y-6">
              <div className="hidden lg:block text-center lg:text-left">
                <h2 className="text-2xl font-bold text-slate-900">
                  Connecte toi à ton compte
                </h2>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm text-gray-600">
                    Adresse mail
                  </Label>
                  <div className="relative">
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="exemple@gmail.com"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="h-12 bg-white border-gray-200 rounded-lg pr-10"
                      required
                    />
                    {formData.email && (
                      <Check className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5" />
                    )}
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm text-gray-600">
                    Mot de passe
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••••••"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="h-12 bg-white border-gray-200 rounded-lg pr-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2"
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5 text-gray-400" />
                      ) : (
                        <Eye className="w-5 h-5 text-gray-400" />
                      )}
                    </button>
                  </div>
                  <div className="text-right">
                    <Link
                      href="/auth/forgot-password"
                      className="text-sm text-gray-500 hover:text-blue-600 font-bold"
                    >
                      Mot de passe oublié ?
                    </Link>
                  </div>
                </div>

                {error && (
                  <div className="text-red-500 text-sm text-center">
                    {error}
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium"
                >
                  {isLoading ? "Connexion..." : "Se connecter"}
                </Button>

                <div className="flex items-center text-sm text-gray-500 my-6">
                  <div className="flex-1 border-t border-gray-300"></div>
                  <span className="px-4">ou connecte toi avec</span>
                  <div className="flex-1 border-t border-gray-300"></div>
                </div>

                {/* OAuth Buttons */}
                <div className="grid grid-cols-2 gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleGoogleLogin}
                    className="h-12 border-gray-200 hover:bg-gray-50"
                  >
                    <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                    Google
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleAppleLogin}
                    className="h-12 border-gray-200 hover:bg-gray-50"
                  >
                    <svg
                      className="w-5 h-5 mr-2"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                    </svg>
                    Apple
                  </Button>
                </div>

                <div className="hidden lg:block">
                  <span className="text-sm text-gray-600">
                    Tu n'as pas de compte ?{" "}
                    <Link
                      href="/auth/signup"
                      className="text-blue-600 hover:underline font-medium"
                    >
                      Inscris toi
                    </Link>
                  </span>
                </div>
              </form>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
