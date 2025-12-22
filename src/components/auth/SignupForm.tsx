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
