"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { supabase } from "../../lib/supabase";
import { UserRole } from "../../types/auth";

interface User {
  id: string;
  email: string;
  name?: string;
  first_name?: string;
  last_name?: string;
  role: UserRole;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (session?.user) {
          // Get user profile
          const { data: profile, error: profileError } = await supabase
            .from("user_profiles")
            .select("*")
            .eq("id", session.user.id)
            .single();

          console.log("Profile data:", profile, "Profile error:", profileError);

          if (profile) {
            setUser({
              id: session.user.id,
              email: session.user.email!,
              name: profile.name || undefined,
              first_name: profile.first_name || undefined,
              last_name: profile.last_name || undefined,
              role: profile.role,
            });
          }
        }
      } catch (error) {
        console.error("Error getting initial session:", error);
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state change:", event, session);

      if (event === "SIGNED_IN" && session?.user) {
        // Get user profile
        const { data: profile, error: profileError } = await supabase
          .from("user_profiles")
          .select("*")
          .eq("id", session.user.id)
          .single();

        console.log(
          "Auth change - Profile data:",
          profile,
          "Profile error:",
          profileError
        );

        if (profile) {
          setUser({
            id: session.user.id,
            email: session.user.email!,
            name: profile.name || undefined,
            first_name: profile.first_name || undefined,
            last_name: profile.last_name || undefined,
            role: profile.role,
          });
        }
      } else if (event === "SIGNED_OUT") {
        setUser(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    console.log("AuthProvider signOut called");

    // Clear user state immediately for better UX
    setUser(null);
    console.log("User state cleared");

    // Sign out from Supabase in the background (don't await to prevent hanging)
    supabase.auth
      .signOut()
      .then(({ error }) => {
        if (error) {
          console.error("Supabase signOut error:", error);
        } else {
          console.log("Supabase signOut successful");
        }
      })
      .catch((error) => {
        console.error("SignOut error:", error);
      });
  };

  const value = {
    user,
    loading,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
