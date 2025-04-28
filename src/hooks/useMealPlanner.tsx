
import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { useToast } from "@/hooks/use-toast";

export interface Recipe {
  id: number;
  title: string;
  description: string;
  prepTime?: string;
  image?: string;
  ingredients?: string[];
  instructions?: string[];
  time?: string;
  status?: 'planned' | 'completed';
}

export const useMealPlanner = (refreshTrigger = 0) => {
  const [plannedMeals, setPlannedMeals] = useState<Record<string, Recipe[]>>({});
  const [likedRecipes, setLikedRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Load liked recipes and planned meals from localStorage
    const loadStoredData = () => {
      const storedRecipes = JSON.parse(localStorage.getItem('likedRecipes') || '[]');
      const storedMeals = JSON.parse(localStorage.getItem('plannedMeals') || '{}');
      
      setLikedRecipes(storedRecipes);
      setPlannedMeals(storedMeals);
    };

    loadStoredData();
    
    // Simulate loading data
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 400);
    
    return () => clearTimeout(timer);
  }, [refreshTrigger]);

  const addRecipeToPlanner = (recipe: Recipe, date: Date) => {
    if (!date) return;
    
    const dateKey = date.toISOString().split('T')[0];
    
    const newMeal: Recipe = {
      ...recipe,
      time: `8:00 AM`,
      status: 'planned'
    };
    
    setPlannedMeals(prev => {
      const updated = { ...prev };
      updated[dateKey] = updated[dateKey] ? [...updated[dateKey], newMeal] : [newMeal];
      
      // Save to localStorage
      localStorage.setItem('plannedMeals', JSON.stringify(updated));
      
      return updated;
    });
    
    toast({
      title: "Recipe Added",
      description: `${recipe.title} added to ${format(date, 'MMM d')}`,
      duration: 2000,
    });
  };

  const toggleMealStatus = (date: Date, mealIndex: number) => {
    const dateKey = date.toISOString().split('T')[0];
    
    setPlannedMeals(prev => {
      const updated = { ...prev };
      
      if (updated[dateKey] && updated[dateKey][mealIndex]) {
        const newStatus = updated[dateKey][mealIndex].status === 'completed' ? 'planned' : 'completed';
        updated[dateKey][mealIndex] = {
          ...updated[dateKey][mealIndex],
          status: newStatus
        };
        
        localStorage.setItem('plannedMeals', JSON.stringify(updated));
      }
      
      return updated;
    });
  };

  const removeMeal = (date: Date, mealIndex: number) => {
    const dateKey = date.toISOString().split('T')[0];
    
    setPlannedMeals(prev => {
      const updated = { ...prev };
      
      if (updated[dateKey]) {
        updated[dateKey] = updated[dateKey].filter((_, i) => i !== mealIndex);
        if (updated[dateKey].length === 0) {
          delete updated[dateKey];
        }
        
        localStorage.setItem('plannedMeals', JSON.stringify(updated));
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
    removeMeal
  };
};
