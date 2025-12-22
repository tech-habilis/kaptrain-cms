-- Create user role enum
CREATE TYPE user_role AS ENUM ('superadmin', 'admin', 'user');

-- Create user_profiles table linked to auth.users
CREATE TABLE public.user_profiles (
    id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email text UNIQUE NOT NULL,
    name text,
    first_name text,
    last_name text,
    role user_role NOT NULL DEFAULT 'user',
    display_name text,
    bio text,
    avatar_url text,
    preferences jsonb DEFAULT '{}',
    last_login timestamp with time zone,
    is_active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX idx_user_profiles_email ON public.user_profiles(email);
CREATE INDEX idx_user_profiles_role ON public.user_profiles(role);
CREATE INDEX idx_user_profiles_active ON public.user_profiles(is_active);

-- Function to automatically create user profile when auth user is created
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.user_profiles (id, email, name, first_name, last_name, display_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.raw_user_meta_data->>'full_name'),
    NEW.raw_user_meta_data->>'first_name',
    NEW.raw_user_meta_data->>'last_name',
    CONCAT(
      COALESCE(NEW.raw_user_meta_data->>'first_name', ''),
      ' ',
      COALESCE(NEW.raw_user_meta_data->>'last_name', '')
    )
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to automatically create profile for new users
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Grant permissions
GRANT ALL ON TABLE public.user_profiles TO service_role;
GRANT SELECT, INSERT, UPDATE ON TABLE public.user_profiles TO authenticated;
GRANT SELECT, INSERT, UPDATE ON TABLE public.user_profiles TO anon;
