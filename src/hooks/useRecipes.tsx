
import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useToast } from "@/hooks/use-toast";
import { supabase, handleSupabaseError, uploadRecipeImage } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';
import { Recipe } from "@/hooks/useMealPlanner";

export function useRecipes() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const { toast } = useToast();
  const { user } = useAuth();
  
  const refreshRecipes = () => {
    setRefreshTrigger(prev => prev + 1);
  };
  
  useEffect(() => {
    const fetchRecipes = async () => {
      setIsLoading(true);

      try {
        if (user) {
          // Fetch from Supabase for logged-in users
          const { data, error } = await supabase
            .from('recipes')
            .select('*')
            .eq('user_id', user.id);

          if (error) {
            throw error;
          }

          const formattedRecipes: Recipe[] = data.map(recipe => ({
            id: recipe.id,
            title: recipe.title,
            description: recipe.description,
            prepTime: recipe.prep_time,
            image: recipe.image_url,
            image_path: recipe.image_path,
            ingredients: recipe.ingredients,
            instructions: recipe.instructions,
            servings: recipe.servings
          }));

          setRecipes(formattedRecipes);
        } else {
          // Load from localStorage for anonymous users
          const likedRecipes = JSON.parse(localStorage.getItem('likedRecipes') || '[]');
          const customRecipes = JSON.parse(localStorage.getItem('customRecipes') || '[]');

          // Combine and deduplicate recipes
          const allRecipes = [...customRecipes];
          likedRecipes.forEach((recipe: Recipe) => {
            if (!allRecipes.some(r => r.id === recipe.id)) {
              allRecipes.push(recipe);
            }
          });

          setRecipes(allRecipes);
        }
      } catch (error) {
        console.error('Error fetching recipes:', error);
        if (user) {
          handleSupabaseError(error, toast);
        }
        // Fall back to localStorage on error
        const likedRecipes = JSON.parse(localStorage.getItem('likedRecipes') || '[]');
        setRecipes(likedRecipes);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecipes();

    // Listen for storage changes
    const handleStorageChange = () => {
      if (!user) {
        const likedRecipes = JSON.parse(localStorage.getItem('likedRecipes') || '[]');
        const customRecipes = JSON.parse(localStorage.getItem('customRecipes') || '[]');
        const allRecipes = [...customRecipes];
        likedRecipes.forEach((recipe: Recipe) => {
          if (!allRecipes.some(r => r.id === recipe.id)) {
            allRecipes.push(recipe);
          }
        });
        setRecipes(allRecipes);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [user, refreshTrigger, toast]);
  
  const saveRecipe = async (recipeData: Partial<Recipe>, imageFile?: File) => {
    try {
      const recipeId = recipeData.id || uuidv4();
      const isNew = !recipeData.id;

      if (user) {
        // Save to Supabase for logged-in users
        let imageUrl = recipeData.image;
        let imagePath = recipeData.image_path;

        // Upload image if provided
        if (imageFile) {
          const uploadResult = await uploadRecipeImage(imageFile, user.id);

          if (uploadResult.error) {
            console.error('Error uploading image:', uploadResult.error);
            toast({
              title: "Image Upload Failed",
              description: "Could not upload image. Recipe will be saved without an image.",
              variant: "destructive"
            });
          } else {
            imageUrl = uploadResult.url;
            imagePath = uploadResult.path;
          }
        }

        const recipe = {
          id: recipeId,
          user_id: user.id,
          title: recipeData.title,
          description: recipeData.description,
          prep_time: recipeData.prepTime,
          image_url: imageUrl,
          image_path: imagePath,
          ingredients: recipeData.ingredients,
          instructions: recipeData.instructions,
          servings: recipeData.servings
        };

        // Insert or update the recipe
        const { error } = isNew
          ? await supabase.from('recipes').insert(recipe)
          : await supabase.from('recipes').update(recipe).eq('id', recipeId);

        if (error) {
          throw error;
        }
      } else {
        // Save to localStorage for anonymous users
        const newRecipe: Recipe = {
          id: recipeId,
          title: recipeData.title || '',
          description: recipeData.description,
          prepTime: recipeData.prepTime,
          image: recipeData.image,
          ingredients: recipeData.ingredients,
          instructions: recipeData.instructions,
          servings: recipeData.servings
        };

        const customRecipes = JSON.parse(localStorage.getItem('customRecipes') || '[]');

        if (isNew) {
          localStorage.setItem('customRecipes', JSON.stringify([...customRecipes, newRecipe]));
        } else {
          const updatedRecipes = customRecipes.map((r: Recipe) =>
            r.id === recipeId ? newRecipe : r
          );
          localStorage.setItem('customRecipes', JSON.stringify(updatedRecipes));
        }

        // Trigger storage event
        window.dispatchEvent(new Event('storage'));
      }

      toast({
        title: isNew ? "Recipe Created" : "Recipe Updated",
        description: user
          ? `Your recipe has been ${isNew ? 'created' : 'updated'} successfully!`
          : `Your recipe has been ${isNew ? 'created' : 'updated'} locally.`,
      });

      // Refresh the recipes list
      refreshRecipes();

      return { success: true, recipeId };
    } catch (error) {
      console.error('Error saving recipe:', error);
      if (user) {
        handleSupabaseError(error, toast);
      }
      return { success: false };
    }
  };
  
  const deleteRecipe = async (recipeId: string | number) => {
    try {
      if (user) {
        // Find the recipe to get the image path
        const recipeToDelete = recipes.find(r => r.id === recipeId);

        // Delete the recipe from the database
        const { error } = await supabase
          .from('recipes')
          .delete()
          .eq('id', recipeId)
          .eq('user_id', user.id);

        if (error) {
          throw error;
        }

        // If the recipe had an image, delete it from storage
        if (recipeToDelete?.image_path) {
          await supabase.storage
            .from('recipe-images')
            .remove([recipeToDelete.image_path]);
        }
      } else {
        // Delete from localStorage for anonymous users
        const customRecipes = JSON.parse(localStorage.getItem('customRecipes') || '[]');
        const likedRecipes = JSON.parse(localStorage.getItem('likedRecipes') || '[]');

        localStorage.setItem('customRecipes', JSON.stringify(
          customRecipes.filter((r: Recipe) => r.id !== recipeId)
        ));
        localStorage.setItem('likedRecipes', JSON.stringify(
          likedRecipes.filter((r: Recipe) => r.id !== recipeId)
        ));

        // Trigger storage event
        window.dispatchEvent(new Event('storage'));
      }

      toast({
        title: "Recipe Deleted",
        description: "Your recipe has been deleted successfully.",
      });

      // Update the local state
      setRecipes(recipes.filter(recipe => recipe.id !== recipeId));

      return { success: true };
    } catch (error) {
      console.error('Error deleting recipe:', error);
      if (user) {
        handleSupabaseError(error, toast);
      }
      return { success: false };
    }
  };
  
  return {
    recipes,
    isLoading,
    saveRecipe,
    deleteRecipe,
    refreshRecipes
  };
}
