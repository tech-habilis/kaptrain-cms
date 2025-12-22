import { createClient } from "@supabase/supabase-js";
import {
  UserRole,
  isValidRole,
  getDefaultRole,
  hasPermission,
  ROLE_PERMISSIONS,
} from "../types/auth";

// Database type definitions
export interface Database {
  public: {
    Tables: {
      user_profiles: {
        Row: {
          id: string;
          email: string;
          name: string | null;
          first_name: string | null;
          last_name: string | null;
          role: UserRole;
          display_name: string | null;
          bio: string | null;
          avatar_url: string | null;
          preferences: Record<string, any>;
          last_login: string | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          name?: string | null;
          first_name?: string | null;
          last_name?: string | null;
          role?: UserRole;
          display_name?: string | null;
          bio?: string | null;
          avatar_url?: string | null;
          preferences?: Record<string, any>;
          last_login?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          name?: string | null;
          first_name?: string | null;
          last_name?: string | null;
          role?: UserRole;
          display_name?: string | null;
          bio?: string | null;
          avatar_url?: string | null;
          preferences?: Record<string, any>;
          last_login?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
}

// Create Supabase client
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_KEY!
);

// Create admin client for server-side operations
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);



// User registration functions
export interface RegisterUserData {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  role?: UserRole;
}

export interface RegisterResult {
  success: boolean;
  user?: {
    id: string;
    email: string;
    name?: string;
    first_name?: string;
    last_name?: string;
    role: UserRole;
  };
  error?: string;
}

export async function registerUser(
  userData: RegisterUserData
): Promise<RegisterResult> {
  try {
    // Validate input
    if (!userData.email || !userData.password || !userData.first_name || !userData.last_name) {
      return { success: false, error: "Email, password, first name, and last name are required" };
    }

    if (!isValidEmail(userData.email)) {
      return { success: false, error: "Invalid email format" };
    }

    if (!isValidPassword(userData.password)) {
      return {
        success: false,
        error: "Password must be at least 8 characters long",
      };
    }

    // Assign role (default to user if not specified)
    const role =
      userData.role && isValidRole(userData.role)
        ? userData.role
        : getDefaultRole();

    const fullName = `${userData.first_name} ${userData.last_name}`;

    // Create user with Supabase Auth
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: userData.email.toLowerCase(),
      password: userData.password,
      email_confirm: true,
      user_metadata: {
        first_name: userData.first_name,
        last_name: userData.last_name,
        name: fullName,
        role: role,
      },
    });

    if (authError || !authData.user) {
      console.error("Error creating auth user:", authError);
      return { 
        success: false, 
        error: authError?.message || "Failed to create user account" 
      };
    }

    // Update the user profile with the role (the trigger will create the basic profile)
    const { error: profileError } = await supabaseAdmin
      .from("user_profiles")
      .update({
        role,
        first_name: userData.first_name,
        last_name: userData.last_name,
        name: fullName,
        display_name: fullName,
      })
      .eq("id", authData.user.id);

    if (profileError) {
      console.error("Error updating user profile:", profileError);
      // Don't fail the registration if profile update fails
    }

    return {
      success: true,
      user: {
        id: authData.user.id,
        email: authData.user.email!,
        first_name: userData.first_name,
        last_name: userData.last_name,
        name: fullName,
        role: role,
      },
    };
  } catch (error) {
    console.error("Registration error:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}

// Password validation
export function isValidPassword(password: string): boolean {
  return typeof password === "string" && password.length >= 8;
}

// Email validation
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Login function
export interface LoginUserData {
  email: string;
  password: string;
}

export interface LoginResult {
  success: boolean;
  user?: {
    id: string;
    email: string;
    name?: string;
    role: UserRole;
  };
  error?: string;
}

export async function loginUser(
  loginData: LoginUserData
): Promise<LoginResult> {
  try {
    // Validate input
    if (!loginData.email || !loginData.password) {
      return { success: false, error: "Email and password are required" };
    }

    if (!isValidEmail(loginData.email)) {
      return { success: false, error: "Invalid email format" };
    }

    // Sign in with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: loginData.email.toLowerCase(),
      password: loginData.password,
    });

    if (authError || !authData.user) {
      return { 
        success: false, 
        error: authError?.message || "Invalid email or password" 
      };
    }

    // Get user profile
    const { data: profile, error: profileError } = await supabaseAdmin
      .from("user_profiles")
      .select("*")
      .eq("id", authData.user.id)
      .eq("is_active", true)
      .single();

    if (profileError || !profile) {
      console.error("Error fetching user profile:", profileError);
      return { success: false, error: "User profile not found" };
    }

    // Update last login
    await supabaseAdmin
      .from("user_profiles")
      .update({
        last_login: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", authData.user.id);

    return {
      success: true,
      user: {
        id: profile.id,
        email: profile.email,
        name: profile.name || undefined,
        role: profile.role,
      },
    };
  } catch (error) {
    console.error("Login error:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}

// User profile management
export interface UpdateProfileData {
  displayName?: string;
  bio?: string;
  avatarUrl?: string;
  preferences?: Record<string, any>;
}

export async function updateUserProfile(
  userId: string,
  profileData: UpdateProfileData,
  currentUserRole?: UserRole
): Promise<{ success: boolean; error?: string }> {
  try {
    // Check permissions (users can update their own profile, admins can update any)
    if (currentUserRole !== "admin") {
      // Additional permission check would go here in a real implementation
      // For now, we'll assume the userId matches the current user
    }

    const { error } = await supabaseAdmin
      .from("user_profiles")
      .update({
        display_name: profileData.displayName,
        bio: profileData.bio,
        avatar_url: profileData.avatarUrl,
        preferences: profileData.preferences,
        updated_at: new Date().toISOString(),
      })
      .eq("id", userId);

    if (error) {
      console.error("Error updating profile:", error);
      return { success: false, error: "Failed to update profile" };
    }

    return { success: true };
  } catch (error) {
    console.error("Profile update error:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}

// Password change
export async function changeUserPassword(
  userId: string,
  newPassword: string,
  currentUserRole?: UserRole
): Promise<{ success: boolean; error?: string }> {
  try {
    if (!isValidPassword(newPassword)) {
      return {
        success: false,
        error: "Password must be at least 8 characters long",
      };
    }

    // Update password using Supabase Auth
    const { error } = await supabaseAdmin.auth.admin.updateUserById(
      userId,
      { password: newPassword }
    );

    if (error) {
      console.error("Error updating password:", error);
      return { success: false, error: "Failed to update password" };
    }

    // Update timestamp in profile
    await supabaseAdmin
      .from("user_profiles")
      .update({
        updated_at: new Date().toISOString(),
      })
      .eq("id", userId);

    return { success: true };
  } catch (error) {
    console.error("Password change error:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}

// Role management functions
export async function assignUserRole(
  userId: string,
  newRole: UserRole,
  adminUserId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    // Verify admin permissions
    const { data: adminUser } = await supabaseAdmin
      .from("user_profiles")
      .select("role")
      .eq("id", adminUserId)
      .single();

    if (!adminUser || !hasPermission(adminUser.role, "admin")) {
      return { success: false, error: "Insufficient permissions" };
    }

    if (!isValidRole(newRole)) {
      return { success: false, error: "Invalid role" };
    }

    // Update user role
    const { error } = await supabaseAdmin
      .from("user_profiles")
      .update({
        role: newRole,
        updated_at: new Date().toISOString(),
      })
      .eq("id", userId);

    if (error) {
      console.error("Error updating user role:", error);
      return { success: false, error: "Failed to update user role" };
    }

    return { success: true };
  } catch (error) {
    console.error("Role assignment error:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}

// Get user with profile
export async function getUserWithProfile(userId: string) {
  try {
    const { data: user, error: userError } = await supabaseAdmin
      .from("user_profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (userError || !user) {
      console.error("Error fetching user:", userError);
      return null;
    }

    return user;
  } catch (error) {
    console.error("Get user with profile error:", error);
    return null;
  }
}

// List users with role filtering (admin only)
export interface ListUsersOptions {
  role?: UserRole;
  isActive?: boolean;
  limit?: number;
  offset?: number;
}

export async function listUsers(
  options: ListUsersOptions = {},
  adminUserId: string
) {
  try {
    // Verify admin permissions
    const { data: adminUser } = await supabaseAdmin
      .from("user_profiles")
      .select("role")
      .eq("id", adminUserId)
      .single();

    if (!adminUser || !hasPermission(adminUser.role, "admin")) {
      throw new Error("Insufficient permissions");
    }

    let query = supabaseAdmin
      .from("user_profiles")
      .select("*");

    if (options.role) {
      query = query.eq("role", options.role);
    }

    if (options.isActive !== undefined) {
      query = query.eq("is_active", options.isActive);
    }

    if (options.limit) {
      query = query.limit(options.limit);
    }

    if (options.offset) {
      query = query.range(
        options.offset,
        options.offset + (options.limit || 10) - 1
      );
    }

    const { data, error } = await query.order("created_at", {
      ascending: false,
    });

    if (error) {
      console.error("Error listing users:", error);
      return { success: false, error: "Failed to fetch users" };
    }

    return { success: true, users: data };
  } catch (error) {
    console.error("List users error:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}

// Role validation utilities
export function validateRolePermission(
  userRole: UserRole,
  action: keyof typeof ROLE_PERMISSIONS.admin
): boolean {
  return ROLE_PERMISSIONS[userRole][action];
}

export function canUserPerformAction(
  userRole: UserRole,
  targetUserRole: UserRole,
  action: "read" | "write" | "edit" | "delete" | "manage"
): boolean {
  // Users can always read their own data
  if (action === "read" && userRole === targetUserRole) {
    return true;
  }

  // Role-based permissions
  switch (userRole) {
    case "superadmin":
      return true; // Admins can do everything
    case "admin":
      return (
        ["read", "write", "edit"].includes(action) &&
        hasPermission(userRole, targetUserRole)
      );
    case "user":
      return action === "read";
    default:
      return false;
  }
}

// Get current user session
export async function getCurrentUser() {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error || !user) {
      return null;
    }

    // Get user profile
    const { data: profile, error: profileError } = await supabase
      .from("user_profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (profileError || !profile) {
      return null;
    }

    return {
      id: user.id,
      email: user.email!,
      name: profile.name || undefined,
      role: profile.role,
      profile,
    };
  } catch (error) {
    console.error("Error getting current user:", error);
    return null;
  }
}

// Sign out user
export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.error("Error signing out:", error);
    return { success: false, error: error.message };
  }
  return { success: true };
}

// Utility to create authenticated Supabase client with user session
export function createAuthenticatedClient(supabaseAccessToken: string) {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_KEY!,
    {
      global: {
        headers: {
          Authorization: `Bearer ${supabaseAccessToken}`,
        },
      },
    }
  );
}
// Google OAuth functions
export async function signInWithGoogle() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
      queryParams: {
        access_type: 'offline',
        prompt: 'consent',
      },
    },
  })

  if (error) {
    console.error('Error signing in with Google:', error)
    return { success: false, error: error.message }
  }

  return { success: true, data }
}

export async function handleOAuthCallback(code: string) {
  try {
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (error) {
      console.error('Error exchanging code for session:', error)
      return { success: false, error: error.message }
    }

    if (data.user) {
      // Check if user profile exists, create if not
      const { data: existingProfile } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', data.user.id)
        .single()

      if (!existingProfile) {
        // Create profile for OAuth user
        const { error: profileError } = await supabase
          .from('user_profiles')
          .insert({
            id: data.user.id,
            email: data.user.email!,
            name: data.user.user_metadata?.full_name || data.user.user_metadata?.name,
            first_name: data.user.user_metadata?.given_name,
            last_name: data.user.user_metadata?.family_name,
            avatar_url: data.user.user_metadata?.avatar_url,
            role: getDefaultRole(),
            is_active: true,
          })

        if (profileError) {
          console.error('Error creating OAuth user profile:', profileError)
        }
      }
    }

    return { success: true, data }
  } catch (error) {
    console.error('OAuth callback error:', error)
    return { success: false, error: 'An unexpected error occurred' }
  }
}