
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
  servings?: number;
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
            description: "Fluffy pancakes with maple syrup and fresh berries",
            prepTime: "15 min",
            servings: 2,
            image: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=480&q=80",
            ingredients: ["1 cup all-purpose flour", "2 tbsp sugar", "2 tsp baking powder", "1/2 tsp salt", "1 cup milk", "1 large egg", "2 tbsp melted butter"],
            instructions: ["Mix dry ingredients", "Whisk wet ingredients separately", "Combine mixtures until just blended", "Cook on hot griddle until bubbles form", "Flip and cook other side until golden"]
          },
          {
            id: 2,
            title: "Avocado Toast",
            description: "Healthy breakfast with sourdough bread and smashed avocado",
            prepTime: "10 min",
            servings: 1,
            image: "https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=480&q=80",
            ingredients: ["2 slices sourdough bread", "1 ripe avocado", "1/2 lemon", "Salt and pepper to taste", "Red pepper flakes", "Poached egg (optional)"],
            instructions: ["Toast bread until golden", "Mash avocado with lemon juice", "Spread on toast", "Season with salt, pepper and red pepper flakes"]
          },
          {
            id: 3,
            title: "Berry Smoothie Bowl",
            description: "Refreshing fruit bowl with granola and fresh berries",
            prepTime: "8 min",
            servings: 1,
            image: "https://images.unsplash.com/photo-1511690743698-d9d85f2fbf38?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=480&q=80",
            ingredients: ["1 cup frozen mixed berries", "1 ripe banana", "1/2 cup Greek yogurt", "1/4 cup almond milk", "1 tbsp honey", "1/4 cup granola", "Fresh berries for topping"],
            instructions: ["Blend berries, banana, yogurt, milk and honey", "Pour into bowl", "Top with granola and fresh fruit"]
          },
          {
            id: 4,
            title: "Eggs Benedict",
            description: "Classic breakfast with hollandaise sauce and Canadian bacon",
            prepTime: "25 min",
            servings: 2,
            image: "https://images.unsplash.com/photo-1608039829572-78524f79c4c7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=480&q=80",
            ingredients: ["4 English muffins", "4 large eggs", "4 slices Canadian bacon", "2 egg yolks", "1 tbsp lemon juice", "1/2 cup melted butter", "Salt and cayenne pepper"],
            instructions: ["Make hollandaise: whisk yolks with lemon juice over low heat", "Slowly add melted butter until thick", "Poach eggs for 3 minutes", "Toast muffins, heat bacon", "Layer muffins with bacon, poached eggs, and sauce"]
          },
          {
            id: 5,
            title: "Overnight Oats",
            description: "Easy make-ahead breakfast with chia seeds and fruit",
            prepTime: "5 min + overnight",
            servings: 1,
            image: "https://images.unsplash.com/photo-1517673132405-a56a62b18caf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=480&q=80",
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
