
-- First, check if the recipe_id column has the foreign key constraint
-- If not, add it to the planned_meals table
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
CREATE OR REPLACE VIEW meal_plans AS
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
JOIN recipes r ON pm.recipe_id = r.id;

-- Create RLS policy for the view
ALTER VIEW meal_plans OWNER TO authenticated;
COMMENT ON VIEW meal_plans IS 'Join of planned meals with recipe details';
