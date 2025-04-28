
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
      if (!user) {
        setIsLoading(false);
        return;
      }
      
      setIsLoading(true);
      
      try {
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
      } catch (error) {
        console.error('Error fetching recipes:', error);
        handleSupabaseError(error, toast);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchRecipes();
  }, [user, refreshTrigger, toast]);
  
  const saveRecipe = async (recipeData: Partial<Recipe>, imageFile?: File) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to save recipes.",
        variant: "destructive"
      });
      return { success: false };
    }
    
    try {
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
      
      // Determine if we're creating or updating
      const recipeId = recipeData.id || uuidv4();
      const isNew = !recipeData.id;
      
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
      
      toast({
        title: isNew ? "Recipe Created" : "Recipe Updated",
        description: `Your recipe has been ${isNew ? 'created' : 'updated'} successfully!`,
      });
      
      // Refresh the recipes list
      refreshRecipes();
      
      return { success: true, recipeId };
    } catch (error) {
      console.error('Error saving recipe:', error);
      handleSupabaseError(error, toast);
      return { success: false };
    }
  };
  
  const deleteRecipe = async (recipeId: string | number) => {
    if (!user) return { success: false };
    
    try {
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
      
      toast({
        title: "Recipe Deleted",
        description: "Your recipe has been deleted successfully.",
      });
      
      // Update the local state
      setRecipes(recipes.filter(recipe => recipe.id !== recipeId));
      
      return { success: true };
    } catch (error) {
      console.error('Error deleting recipe:', error);
      handleSupabaseError(error, toast);
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
