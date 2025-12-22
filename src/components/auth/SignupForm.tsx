"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Eye, EyeOff, Check } from "lucide-react";
import { signInWithGoogle } from "../../lib/supabase";

interface SignupFormData {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export function SignupForm() {
  const router = useRouter();
  const [formData, setFormData] = useState<SignupFormData>({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const validatePassword = (password: string) => {
    return password.length >= 8;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Validation
    if (
      !formData.first_name ||
      !formData.last_name ||
      !formData.email ||
      !formData.password
    ) {
      setError("Tous les champs sont requis");
      setIsLoading(false);
      return;
    }

    if (!validatePassword(formData.password)) {
      setError("Le mot de passe doit contenir au moins 8 caractères");
      setIsLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Les mots de passe ne correspondent pas");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          first_name: formData.first_name,
          last_name: formData.last_name,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (data.success) {
        router.push("/auth/signin?message=Compte créé avec succès");
      } else {
        setError(data.error || "Une erreur est survenue");
      }
    } catch (error) {
      setError("Une erreur est survenue");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    try {
      setIsLoading(true);
      const result = await signInWithGoogle();
      if (result.error) {
        setError(result.error);
      }
      // If successful, the user will be redirected by Supabase
    } catch (error) {
      setError("Erreur de connexion avec Google");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Top section (mobile) / Left side (desktop) - Brand */}
      <div className="lg:hidden bg-slate-900 relative overflow-hidden py-8 px-6">
        <Image
          src="/img/bg_signup.png"
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
          <div className="mb-4">
            <h2 className="text-2xl font-bold mb-1">Pas de compte ?</h2>
            <h2 className="text-2xl font-bold">Inscris toi</h2>
          </div>
          <p className="text-sm text-gray-300">
            Tu as déjà un compte ?{" "}
            <Link
              href="/auth/signin"
              className="text-blue-400 hover:underline font-medium"
            >
              Connecte toi
            </Link>
          </p>
        </div>
      </div>

      {/* Desktop left side - Brand */}
      <div className="hidden lg:flex lg:w-1/2 bg-slate-900 relative overflow-hidden">
        <Image
          src="/img/bg_signup.png"
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
      <div className="flex-1 lg:w-1/2 flex items-start lg:items-center justify-center p-6 lg:p-8 bg-white lg:bg-gray-50">
        <Card className="w-full max-w-md border-0 shadow-none bg-transparent">
          <CardContent className="p-0 pt-4 lg:pt-0">
            <div className="space-y-5">
              <div className="hidden lg:block">
                <h2 className="text-3xl font-bold text-slate-900 leading-tight">
                  Pas de compte ?
                </h2>
                <h3 className="text-3xl font-bold text-slate-900 leading-tight">
                  Inscris toi
                </h3>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* First Name and Last Name */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label
                      htmlFor="first_name"
                      className="text-sm font-normal text-gray-600"
                    >
                      Prénom
                    </Label>
                    <Input
                      id="first_name"
                      name="first_name"
                      type="text"
                      placeholder="Prénom"
                      value={formData.first_name}
                      onChange={handleInputChange}
                      className="h-14 bg-white border-gray-300 rounded-xl text-base"
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label
                      htmlFor="last_name"
                      className="text-sm font-normal text-gray-600"
                    >
                      Nom
                    </Label>
                    <Input
                      id="last_name"
                      name="last_name"
                      type="text"
                      placeholder="Nom"
                      value={formData.last_name}
                      onChange={handleInputChange}
                      className="h-14 bg-white border-gray-300 rounded-xl text-base"
                      required
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-1.5">
                  <Label
                    htmlFor="email"
                    className="text-sm font-normal text-gray-600"
                  >
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
                      className="h-14 bg-white border-gray-300 rounded-xl pr-10 text-base"
                      required
                    />
                    {formData.email && (
                      <Check className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-green-500" />
                    )}
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-1.5">
                  <Label
                    htmlFor="password"
                    className="text-sm font-normal text-gray-600"
                  >
                    Crée un mot de passe
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Mot de passe"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="h-14 bg-white border-gray-300 rounded-xl pr-10 text-base"
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
                  <p className="text-xs text-gray-500 mt-1">
                    Min. 8 caractères, 1 majuscule, 1 chiffre, 1 caractère
                    spécial
                  </p>
                </div>

                {/* Confirm Password */}
                <div className="space-y-1.5">
                  <Label
                    htmlFor="confirmPassword"
                    className="text-sm font-normal text-gray-600"
                  >
                    Confirme ton mot de passe
                  </Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Répéter le mot de passe"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className="h-14 bg-white border-gray-300 rounded-xl pr-10 text-base"
                      required
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-3 top-1/2 transform -translate-y-1/2"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="w-5 h-5 text-gray-400" />
                      ) : (
                        <Eye className="w-5 h-5 text-gray-400" />
                      )}
                    </button>
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
                  className="w-full h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium text-base"
                >
                  {isLoading ? "Création..." : "Créer un compte"}
                </Button>

                {/* <div className="flex items-center text-sm text-gray-500 my-6">
                  <div className="flex-1 border-t border-gray-300"></div>
                  <span className="px-4">ou inscris toi avec</span>
                  <div className="flex-1 border-t border-gray-300"></div>
                </div> */}

                {/* Google OAuth Button */}
                {/* <Button
                  type="button"
                  variant="outline"
                  onClick={handleGoogleSignup}
                  disabled={isLoading}
                  className="w-full h-14 border-gray-300 hover:bg-gray-50 rounded-xl"
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
                </Button> */}

                <div className="hidden lg:block">
                  <span className="text-sm text-gray-600">
                    Tu as déjà un compte ?{" "}
                    <Link
                      href="/auth/signin"
                      className="text-blue-600 hover:underline font-medium"
                    >
                      Connecte toi
                    </Link>
                  </span>
                </div>

                {/* Terms and conditions */}
                <div className="text-xs text-gray-600">
                  En créant un compte, tu acceptes les{" "}
                  <Link
                    href="#"
                    className="text-slate-900 font-semibold hover:underline"
                  >
                    Conditions d'utilisation
                  </Link>{" "}
                  et notre{" "}
                  <Link
                    href="#"
                    className="text-slate-900 font-semibold hover:underline"
                  >
                    politique de traitement des données
                  </Link>
                  .
                </div>
              </form>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
