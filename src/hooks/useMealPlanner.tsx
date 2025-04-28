import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { useToast } from "@/hooks/use-toast";
import { supabase, handleSupabaseError, uploadRecipeImage } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';
import { v4 as uuidv4 } from 'uuid';

export interface Recipe {
  id: number | string;
  title: string;
  description: string;
  prepTime?: string;
  image?: string;
  image_path?: string;
  ingredients?: string[];
  instructions?: string[];
  time?: string;
  status?: 'planned' | 'completed';
  servings?: number;
}

export const useMealPlanner = (refreshTrigger = 0) => {
  const [plannedMeals, setPlannedMeals] = useState<Record<string, Recipe[]>>({});
  const [likedRecipes, setLikedRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [forceCacheRefresh, setForceCacheRefresh] = useState(Date.now());
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      
      if (!user) {
        loadFromLocalStorage();
        return;
      }
      
      try {
        const { data: dbRecipes, error: recipesError } = await supabase
          .from('recipes')
          .select('*')
          .eq('user_id', user.id);
          
        if (recipesError) {
          handleSupabaseError(recipesError, toast);
          loadFromLocalStorage();
          return;
        }
        
        const recipes: Recipe[] = dbRecipes.map((dbRecipe: any) => ({
          id: dbRecipe.id,
          title: dbRecipe.title,
          description: dbRecipe.description,
          prepTime: dbRecipe.prep_time,
          image: dbRecipe.image_url,
          image_path: dbRecipe.image_path,
          ingredients: dbRecipe.ingredients,
          instructions: dbRecipe.instructions,
          servings: dbRecipe.servings,
        }));
        
        setLikedRecipes(recipes);
        
        const { data: dbMeals, error: mealsError } = await supabase
          .from('planned_meals')
          .select('*, recipes(*)')
          .eq('user_id', user.id);
          
        if (mealsError) {
          handleSupabaseError(mealsError, toast);
          loadFromLocalStorage();
          return;
        }
        
        const mealsByDate: Record<string, Recipe[]> = {};
        
        dbMeals.forEach((meal: any) => {
          const recipe = meal.recipes;
          
          if (!recipe) return;
          
          const plannedRecipe: Recipe = {
            id: recipe.id,
            title: recipe.title,
            description: recipe.description,
            prepTime: recipe.prep_time,
            image: recipe.image_url,
            image_path: recipe.image_path,
            ingredients: recipe.ingredients,
            instructions: recipe.instructions,
            servings: recipe.servings,
            time: meal.time,
            status: meal.status
          };
          
          if (!mealsByDate[meal.date]) {
            mealsByDate[meal.date] = [];
          }
          
          mealsByDate[meal.date].push(plannedRecipe);
        });
        
        setPlannedMeals(mealsByDate);
      } catch (error) {
        console.error('Error loading data from Supabase:', error);
        loadFromLocalStorage();
      } finally {
        setTimeout(() => setIsLoading(false), 400);
      }
    };
    
    const loadFromLocalStorage = () => {
      localStorage.removeItem('cache-timestamp');
      localStorage.setItem('cache-timestamp', Date.now().toString());
      
      const storedRecipes = localStorage.getItem('likedRecipes');
      const storedMeals = localStorage.getItem('plannedMeals');
      
      if (!storedRecipes) {
        const sampleRecipes: Recipe[] = [
          {
            id: 1,
            title: "Classic Pancakes",
            description: "Fluffy pancakes with maple syrup and fresh berries",
            prepTime: "15 min",
            servings: 2,
            image: "https://images.unsplash.com/photo-1554520735-0a6b8b6ce8b7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=480&q=80",
            ingredients: ["1 cup all-purpose flour", "2 tbsp sugar", "2 tsp baking powder", "1/2 tsp salt", "1 cup milk", "1 large egg", "2 tbsp melted butter"],
            instructions: ["Mix dry ingredients", "Whisk wet ingredients separately", "Combine mixtures until just blended", "Cook on hot griddle until bubbles form", "Flip and cook other side until golden"]
          },
          {
            id: 2,
            title: "Avocado Toast",
            description: "Healthy breakfast with sourdough bread and smashed avocado",
            prepTime: "10 min",
            servings: 1,
            image: "https://images.unsplash.com/photo-1588137378633-dea1336ce8b7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=480&q=80",
            ingredients: ["2 slices sourdough bread", "1 ripe avocado", "1/2 lemon", "Salt and pepper to taste", "Red pepper flakes", "Poached egg (optional)"],
            instructions: ["Toast bread until golden", "Mash avocado with lemon juice", "Spread on toast", "Season with salt, pepper and red pepper flakes"]
          },
          {
            id: 3,
            title: "Berry Smoothie Bowl",
            description: "Refreshing fruit bowl with granola and fresh berries",
            prepTime: "8 min",
            servings: 1,
            image: "https://images.unsplash.com/photo-1628557044797-f21a177c37ec?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=480&q=80",
            ingredients: ["1 cup frozen mixed berries", "1 ripe banana", "1/2 cup Greek yogurt", "1/4 cup almond milk", "1 tbsp honey", "1/4 cup granola", "Fresh berries for topping"],
            instructions: ["Blend berries, banana, yogurt, milk and honey", "Pour into bowl", "Top with granola and fresh fruit"]
          },
          {
            id: 4,
            title: "Eggs Benedict",
            description: "Classic breakfast with hollandaise sauce and Canadian bacon",
            prepTime: "25 min",
            servings: 2,
            image: "https://images.unsplash.com/photo-1525351484163-7529414344d8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=480&q=80",
            ingredients: ["4 English muffins", "4 large eggs", "4 slices Canadian bacon", "2 egg yolks", "1 tbsp lemon juice", "1/2 cup melted butter", "Salt and cayenne pepper"],
            instructions: ["Make hollandaise: whisk yolks with lemon juice over low heat", "Slowly add melted butter until thick", "Poach eggs for 3 minutes", "Toast muffins, heat bacon", "Layer muffins with bacon, poached eggs, and sauce"]
          },
          {
            id: 5,
            title: "Overnight Oats",
            description: "Easy make-ahead breakfast with chia seeds and fruit",
            prepTime: "5 min + overnight",
            servings: 1,
            image: "https://images.unsplash.com/photo-1611740801993-dd9d9fed43a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=480&q=80",
            ingredients: ["1/2 cup rolled oats", "1/2 cup milk of choice", "1 tbsp chia seeds", "1 tbsp honey or maple syrup", "1/4 tsp vanilla extract", "Pinch of salt", "Sliced fruits for topping"],
            instructions: ["Mix all ingredients except toppings", "Place in jar with lid", "Refrigerate overnight", "Add fruits before serving"]
          }
        ];
        
        localStorage.setItem('likedRecipes', JSON.stringify(sampleRecipes));
        setLikedRecipes(sampleRecipes);
      } else {
        setLikedRecipes(JSON.parse(storedRecipes));
      }
      
      if (storedMeals) {
        setPlannedMeals(JSON.parse(storedMeals));
      }
    };
    
    loadData();
  }, [user, refreshTrigger, forceCacheRefresh, toast]);

  const forceRefresh = () => {
    setForceCacheRefresh(Date.now());
  };

  const addRecipeToPlanner = async (recipe: Recipe, date: Date) => {
    if (!date) return;
    
    const dateKey = date.toISOString().split('T')[0];
    
    const newMeal: Recipe = {
      ...recipe,
      time: `${7 + Math.floor(Math.random() * 2)}:${Math.random() > 0.5 ? '00' : (Math.random() > 0.5 ? '15' : (Math.random() > 0.5 ? '30' : '45'))} AM`,
      status: 'planned'
    };
    
    if (user) {
      try {
        const recipeId = typeof recipe.id === 'number' ? 
          await ensureRecipeExists(recipe) : recipe.id;
        
        const { error } = await supabase.from('planned_meals').insert({
          id: uuidv4(),
          user_id: user.id,
          recipe_id: recipeId,
          date: dateKey,
          time: newMeal.time,
          status: 'planned'
        });
        
        if (error) {
          handleSupabaseError(error, toast);
          return;
        }
        
        setPlannedMeals(prev => {
          const updated = { ...prev };
          updated[dateKey] = updated[dateKey] ? [...updated[dateKey], newMeal] : [newMeal];
          return updated;
        });
        
        toast({
          title: "Recipe Added",
          description: `${recipe.title} added to ${format(date, 'MMM d')}`,
          duration: 2000,
        });
      } catch (error) {
        console.error('Error adding recipe to planner:', error);
        toast({
          title: "Failed to Add Recipe",
          description: "There was an error adding this recipe to your plan.",
          variant: "destructive"
        });
      }
    } else {
      setPlannedMeals(prev => {
        const updated = { ...prev };
        updated[dateKey] = updated[dateKey] ? [...updated[dateKey], newMeal] : [newMeal];
        
        localStorage.setItem('plannedMeals', JSON.stringify(updated));
        
        return updated;
      });
      
      toast({
        title: "Recipe Added",
        description: `${recipe.title} added to ${format(date, 'MMM d')}`,
        duration: 2000,
      });
    }
  };

  const ensureRecipeExists = async (recipe: Recipe): Promise<string> => {
    const { data, error } = await supabase
      .from('recipes')
      .select('id')
      .eq('user_id', user!.id)
      .eq('title', recipe.title)
      .single();
    
    if (error && error.code !== 'PGRST116') {
      handleSupabaseError(error, toast);
      throw error;
    }
    
    if (data) {
      return data.id;
    }
    
    const recipeId = uuidv4();
    
    let imagePath = null;
    let imageUrl = recipe.image;
    
    if (recipe.image && recipe.image.startsWith('http')) {
      try {
        const response = await fetch(recipe.image);
        const blob = await response.blob();
        const file = new File([blob], `recipe-${recipeId}.jpg`, { type: 'image/jpeg' });
        
        const { path, url, error: uploadError } = await uploadRecipeImage(file, user!.id);
        
        if (!uploadError && path && url) {
          imagePath = path;
          imageUrl = url;
        }
      } catch (error) {
        console.error('Error uploading image to Supabase:', error);
      }
    }
    
    const { data: newRecipe, error: insertError } = await supabase
      .from('recipes')
      .insert({
        id: recipeId,
        user_id: user!.id,
        title: recipe.title,
        description: recipe.description,
        prep_time: recipe.prepTime,
        image_url: imageUrl,
        image_path: imagePath,
        ingredients: recipe.ingredients,
        instructions: recipe.instructions,
        servings: recipe.servings,
      })
      .select('id')
      .single();
    
    if (insertError) {
      handleSupabaseError(insertError, toast);
      throw insertError;
    }
    
    return newRecipe.id;
  };

  const toggleMealStatus = async (date: Date, mealIndex: number) => {
    const dateKey = date.toISOString().split('T')[0];
    
    if (!plannedMeals[dateKey] || !plannedMeals[dateKey][mealIndex]) {
      return;
    }
    
    const meal = plannedMeals[dateKey][mealIndex];
    const newStatus = meal.status === 'completed' ? 'planned' : 'completed';
    
    if (user) {
      try {
        const { data, error: fetchError } = await supabase
          .from('planned_meals')
          .select('id')
          .eq('user_id', user.id)
          .eq('date', dateKey)
          .eq('recipe_id', meal.id);
        
        if (fetchError) {
          handleSupabaseError(fetchError, toast);
          return;
        }
        
        if (data && data.length > 0) {
          const { error: updateError } = await supabase
            .from('planned_meals')
            .update({ status: newStatus })
            .eq('id', data[0].id);
          
          if (updateError) {
            handleSupabaseError(updateError, toast);
            return;
          }
        }
      } catch (error) {
        console.error('Error toggling meal status:', error);
        toast({
          title: "Failed to Update Status",
          description: "There was an error updating the meal status.",
          variant: "destructive"
        });
      }
    }
    
    setPlannedMeals(prev => {
      const updated = { ...prev };
      
      if (updated[dateKey] && updated[dateKey][mealIndex]) {
        updated[dateKey][mealIndex] = {
          ...updated[dateKey][mealIndex],
          status: newStatus
        };
        
        if (!user) {
          localStorage.setItem('plannedMeals', JSON.stringify(updated));
        }
      }
      
      return updated;
    });
  };

  const removeMeal = async (date: Date, mealIndex: number) => {
    const dateKey = date.toISOString().split('T')[0];
    
    if (!plannedMeals[dateKey] || !plannedMeals[dateKey][mealIndex]) {
      return;
    }
    
    const meal = plannedMeals[dateKey][mealIndex];
    
    if (user) {
      try {
        const { error } = await supabase
          .from('planned_meals')
          .delete()
          .eq('user_id', user.id)
          .eq('date', dateKey)
          .eq('recipe_id', meal.id);
        
        if (error) {
          handleSupabaseError(error, toast);
          return;
        }
      } catch (error) {
        console.error('Error removing meal:', error);
        toast({
          title: "Failed to Remove Meal",
          description: "There was an error removing this meal from your plan.",
          variant: "destructive"
        });
      }
    }
    
    setPlannedMeals(prev => {
      const updated = { ...prev };
      
      if (updated[dateKey]) {
        updated[dateKey] = updated[dateKey].filter((_, i) => i !== mealIndex);
        if (updated[dateKey].length === 0) {
          delete updated[dateKey];
        }
        
        if (!user) {
          localStorage.setItem('plannedMeals', JSON.stringify(updated));
        }
      }
      
      return updated;
    });

    toast({
      title: "Meal Removed",
      description: "Breakfast has been removed from your plan",
      duration: 2000,
    });
  };

  return {
    plannedMeals,
    likedRecipes,
    isLoading,
    addRecipeToPlanner,
    toggleMealStatus,
    removeMeal,
    forceRefresh
  };
};
