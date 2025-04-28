
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
      const storedRecipes = localStorage.getItem('likedRecipes');
      const storedMeals = localStorage.getItem('plannedMeals');
      
      // If no stored recipes, initialize with sample recipes
      if (!storedRecipes) {
        const sampleRecipes: Recipe[] = [
          {
            id: 1,
            title: "Classic Pancakes",
            description: "Fluffy pancakes with maple syrup",
            prepTime: "15 min",
            image: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=480&q=80",
            ingredients: ["Flour", "Milk", "Eggs", "Sugar", "Baking powder"],
            instructions: ["Mix dry ingredients", "Add wet ingredients", "Cook on griddle"]
          },
          {
            id: 2,
            title: "Avocado Toast",
            description: "Healthy breakfast with sourdough bread",
            prepTime: "10 min",
            image: "https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=480&q=80",
            ingredients: ["Bread", "Avocado", "Salt", "Pepper", "Red pepper flakes"],
            instructions: ["Toast bread", "Mash avocado", "Season and serve"]
          },
          {
            id: 3,
            title: "Berry Smoothie Bowl",
            description: "Refreshing fruit bowl with granola",
            prepTime: "8 min",
            image: "https://images.unsplash.com/photo-1511690743698-d9d85f2fbf38?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=480&q=80",
            ingredients: ["Frozen berries", "Banana", "Yogurt", "Honey", "Granola"],
            instructions: ["Blend fruits", "Pour in bowl", "Top with granola"]
          },
          {
            id: 4,
            title: "Eggs Benedict",
            description: "Classic breakfast with hollandaise sauce",
            prepTime: "25 min",
            image: "https://images.unsplash.com/photo-1608039829572-78524f79c4c7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=480&q=80",
            ingredients: ["English muffins", "Eggs", "Ham", "Butter", "Lemon juice"],
            instructions: ["Poach eggs", "Toast muffins", "Make hollandaise", "Assemble"]
          },
          {
            id: 5,
            title: "Overnight Oats",
            description: "Easy make-ahead breakfast",
            prepTime: "5 min + overnight",
            image: "https://images.unsplash.com/photo-1517673132405-a56a62b18caf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=480&q=80",
            ingredients: ["Oats", "Milk", "Chia seeds", "Honey", "Fruits"],
            instructions: ["Mix ingredients", "Refrigerate overnight", "Top with fruits"]
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
      time: `${7 + Math.floor(Math.random() * 2)}:${Math.random() > 0.5 ? '00' : (Math.random() > 0.5 ? '15' : (Math.random() > 0.5 ? '30' : '45'))} AM`,
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
