
-- Meal Planner Database Setup
-- This file contains SQL to set up all necessary tables and relationships
-- for the meal planning application. It includes recipes, planned_meals,
-- their relationship, and appropriate RLS policies.

-- First, check if the recipes table exists and create if it doesn't
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'recipes' AND schemaname = 'public') THEN
    CREATE TABLE recipes (
      id UUID PRIMARY KEY,
      user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
      title TEXT NOT NULL,
      description TEXT,
      prep_time TEXT,
      image_url TEXT,
      image_path TEXT,
      ingredients TEXT[],
      instructions TEXT[],
      servings INTEGER,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
    );
    
    -- Set up RLS for recipes
    ALTER TABLE recipes ENABLE ROW LEVEL SECURITY;
    CREATE POLICY "Users can read their own recipes" 
      ON recipes FOR SELECT
      USING (auth.uid() = user_id);
      
    CREATE POLICY "Users can create their own recipes" 
      ON recipes FOR INSERT
      WITH CHECK (auth.uid() = user_id);
      
    CREATE POLICY "Users can update their own recipes" 
      ON recipes FOR UPDATE
      USING (auth.uid() = user_id);
      
    CREATE POLICY "Users can delete their own recipes" 
      ON recipes FOR DELETE
      USING (auth.uid() = user_id);
  END IF;
  
  -- Check if the planned_meals table exists and create if it doesn't
  IF NOT EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'planned_meals' AND schemaname = 'public') THEN
    CREATE TABLE planned_meals (
      id UUID PRIMARY KEY,
      user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
      recipe_id UUID NOT NULL,
      date TEXT NOT NULL,
      time TEXT,
      status TEXT DEFAULT 'planned',
      created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
    );
    
    -- Set up RLS for planned_meals
    ALTER TABLE planned_meals ENABLE ROW LEVEL SECURITY;
    CREATE POLICY "Users can read their own planned meals" 
      ON planned_meals FOR SELECT
      USING (auth.uid() = user_id);
      
    CREATE POLICY "Users can create their own planned meals" 
      ON planned_meals FOR INSERT
      WITH CHECK (auth.uid() = user_id);
      
    CREATE POLICY "Users can update their own planned meals" 
      ON planned_meals FOR UPDATE
      USING (auth.uid() = user_id);
      
    CREATE POLICY "Users can delete their own planned meals" 
      ON planned_meals FOR DELETE
      USING (auth.uid() = user_id);
  END IF;
END $$;

-- Now that we've ensured both tables exist, add the foreign key constraint
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.constraint_column_usage
    WHERE table_name = 'planned_meals'
    AND column_name = 'recipe_id'
    AND constraint_name LIKE '%fk%'
  ) THEN
    -- Add the foreign key constraint
    ALTER TABLE planned_meals
    ADD CONSTRAINT planned_meals_recipe_id_fkey
    FOREIGN KEY (recipe_id)
    REFERENCES recipes(id)
    ON DELETE CASCADE;
  END IF;
END $$;

-- Also, let's create a view to join these tables for easier querying
-- First check if the view exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 
    FROM pg_views
    WHERE viewname = 'meal_plans'
  ) THEN
    EXECUTE '
    CREATE VIEW meal_plans AS
    SELECT 
      pm.id, 
      pm.user_id, 
      pm.date, 
      pm.time, 
      pm.status,
      r.id as recipe_id, 
      r.title, 
      r.description,
      r.prep_time, 
      r.image_url, 
      r.ingredients, 
      r.instructions,
      r.servings
    FROM planned_meals pm
    JOIN recipes r ON pm.recipe_id = r.id';
    
    -- Remove the problematic ownership change
    EXECUTE 'COMMENT ON VIEW meal_plans IS ''Join of planned meals with recipe details''';
  END IF;
END $$;

-- If needed, create storage bucket for recipe images
DO $$
BEGIN
  -- Create bucket if it doesn't exist (this is a bit of a hack but works)
  BEGIN
    INSERT INTO storage.buckets (id, name, public) 
    VALUES ('recipe-images', 'recipe-images', true);
  EXCEPTION 
    WHEN unique_violation THEN
      -- Bucket already exists, do nothing
  END;
END $$;

-- Set up storage policies for recipe images - SAFELY
DO $$
DECLARE
  policy_exists BOOLEAN;
BEGIN
  -- Check if "Anyone can view recipe images" policy exists
  SELECT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE policyname = 'Anyone can view recipe images' 
    AND tablename = 'objects' 
    AND schemaname = 'storage'
  ) INTO policy_exists;
  
  IF NOT policy_exists THEN
    -- Create the policy if it doesn't exist
    EXECUTE 'CREATE POLICY "Anyone can view recipe images" 
      ON storage.objects FOR SELECT
      USING (bucket_id = ''recipe-images'')';
  END IF;
  
  -- Check if "Auth users can upload recipe images" policy exists
  SELECT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE policyname = 'Auth users can upload recipe images' 
    AND tablename = 'objects' 
    AND schemaname = 'storage'
  ) INTO policy_exists;
  
  IF NOT policy_exists THEN
    -- Create the policy if it doesn't exist
    EXECUTE 'CREATE POLICY "Auth users can upload recipe images" 
      ON storage.objects FOR INSERT
      WITH CHECK (bucket_id = ''recipe-images'' AND auth.role() = ''authenticated'')';
  END IF;
  
  -- Check if "Users can update own recipe images" policy exists
  SELECT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE policyname = 'Users can update own recipe images' 
    AND tablename = 'objects' 
    AND schemaname = 'storage'
  ) INTO policy_exists;
  
  IF NOT policy_exists THEN
    -- Create the policy if it doesn't exist
    EXECUTE 'CREATE POLICY "Users can update own recipe images" 
      ON storage.objects FOR UPDATE
      USING (bucket_id = ''recipe-images'' AND auth.uid()::text = (storage.foldername(name))[1])';
  END IF;
  
  -- Check if "Users can delete own recipe images" policy exists
  SELECT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE policyname = 'Users can delete own recipe images' 
    AND tablename = 'objects' 
    AND schemaname = 'storage'
  ) INTO policy_exists;
  
  IF NOT policy_exists THEN
    -- Create the policy if it doesn't exist
    EXECUTE 'CREATE POLICY "Users can delete own recipe images" 
      ON storage.objects FOR DELETE
      USING (bucket_id = ''recipe-images'' AND auth.uid()::text = (storage.foldername(name))[1])';
  END IF;
END $$;
