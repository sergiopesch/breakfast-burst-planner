
-- Create profiles table if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'profiles' AND schemaname = 'public') THEN
    CREATE TABLE profiles (
      id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
      username TEXT UNIQUE,
      display_name TEXT,
      avatar_url TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
    );
    
    -- Set up RLS for profiles
    ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
    
    CREATE POLICY "Users can read their own profile" 
      ON profiles FOR SELECT
      USING (auth.uid() = id);
      
    CREATE POLICY "Users can create their own profile" 
      ON profiles FOR INSERT
      WITH CHECK (auth.uid() = id);
      
    CREATE POLICY "Users can update their own profile" 
      ON profiles FOR UPDATE
      USING (auth.uid() = id);
      
    -- Create a trigger to create a profile when a new user signs up
    CREATE OR REPLACE FUNCTION public.handle_new_user()
    RETURNS TRIGGER AS $$
    BEGIN
      INSERT INTO public.profiles (id, username, display_name, avatar_url)
      VALUES (new.id, 
              lower(split_part(new.email, '@', 1)), 
              coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
              new.raw_user_meta_data->>'avatar_url');
      RETURN new;
    END;
    $$ LANGUAGE plpgsql SECURITY DEFINER;
    
    -- Create the trigger on auth.users
    DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
    CREATE TRIGGER on_auth_user_created
      AFTER INSERT ON auth.users
      FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
  END IF;
END $$;

-- Set up storage bucket for avatars if it doesn't exist
DO $$
BEGIN
  -- Create bucket if it doesn't exist
  BEGIN
    INSERT INTO storage.buckets (id, name, public) 
    VALUES ('avatars', 'avatars', true);
  EXCEPTION 
    WHEN unique_violation THEN
      -- Bucket already exists, do nothing
  END;
END $$;

-- Set up storage policies for avatars
DO $$
DECLARE
  policy_exists BOOLEAN;
BEGIN
  -- Check if "Anyone can view avatars" policy exists
  SELECT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE policyname = 'Anyone can view avatars' 
    AND tablename = 'objects' 
    AND schemaname = 'storage'
  ) INTO policy_exists;
  
  IF NOT policy_exists THEN
    -- Create the policy if it doesn't exist
    EXECUTE 'CREATE POLICY "Anyone can view avatars" 
      ON storage.objects FOR SELECT
      USING (bucket_id = ''avatars'')';
  END IF;
  
  -- Check if "Auth users can upload avatars" policy exists
  SELECT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE policyname = 'Auth users can upload avatars' 
    AND tablename = 'objects' 
    AND schemaname = 'storage'
  ) INTO policy_exists;
  
  IF NOT policy_exists THEN
    -- Create the policy if it doesn't exist
    EXECUTE 'CREATE POLICY "Auth users can upload avatars" 
      ON storage.objects FOR INSERT
      WITH CHECK (bucket_id = ''avatars'' AND auth.uid()::text = (storage.foldername(name))[1])';
  END IF;
  
  -- Check if "Users can update own avatars" policy exists
  SELECT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE policyname = 'Users can update own avatars' 
    AND tablename = 'objects' 
    AND schemaname = 'storage'
  ) INTO policy_exists;
  
  IF NOT policy_exists THEN
    -- Create the policy if it doesn't exist
    EXECUTE 'CREATE POLICY "Users can update own avatars" 
      ON storage.objects FOR UPDATE
      USING (bucket_id = ''avatars'' AND auth.uid()::text = (storage.foldername(name))[1])';
  END IF;
  
  -- Check if "Users can delete own avatars" policy exists
  SELECT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE policyname = 'Users can delete own avatars' 
    AND tablename = 'objects' 
    AND schemaname = 'storage'
  ) INTO policy_exists;
  
  IF NOT policy_exists THEN
    -- Create the policy if it doesn't exist
    EXECUTE 'CREATE POLICY "Users can delete own avatars" 
      ON storage.objects FOR DELETE
      USING (bucket_id = ''avatars'' AND auth.uid()::text = (storage.foldername(name))[1])';
  END IF;
END $$;
