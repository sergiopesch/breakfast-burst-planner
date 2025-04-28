
import React, { useState, useEffect } from 'react';
import { Heart, Clock, Coffee, Upload, Loader2 } from 'lucide-react';
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { motion } from 'framer-motion';
import { useToast } from "@/hooks/use-toast";
import { supabase, handleSupabaseError, uploadRecipeImage } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';
import { v4 as uuidv4 } from 'uuid';
import { Button } from "@/components/ui/button";
import { Recipe } from '@/hooks/useMealPlanner';

// Get Supabase image URL helper
const getSupabaseImageUrl = (filename: string) => {
  return `https://nwnrgctxzqunasquaarl.supabase.co/storage/v1/object/public/recipe-images/template/${filename}`;
};

// Updated with Supabase-hosted images
const BREAKFAST_RECIPES = [
  {
    id: 1,
    title: "Quick Banana Oatmeal",
    description: "A healthy breakfast bowl",
    prepTime: "8 min prep",
    image: getSupabaseImageUrl("oatmeal.jpg"),
    ingredients: [
      "1 cup quick oats",
      "1 ripe banana, sliced",
      "1 cup milk (any type)",
      "1 tbsp honey or maple syrup",
      "Cinnamon to taste"
    ],
    instructions: [
      "In a microwave-safe bowl, combine oats and milk",
      "Microwave for 1-2 minutes, stirring halfway",
      "Add sliced banana and honey/maple syrup",
      "Sprinkle with cinnamon and serve hot"
    ]
  },
  {
    id: 2,
    title: "Avocado Toast",
    description: "Classic breakfast favorite",
    prepTime: "5 min prep",
    image: getSupabaseImageUrl("avocado-toast.jpg"),
    ingredients: [
      "2 slices whole grain bread",
      "1 ripe avocado",
      "2 eggs",
      "Salt and pepper to taste",
      "Red pepper flakes (optional)"
    ],
    instructions: [
      "Toast the bread until golden brown",
      "Mash the avocado and spread on toast",
      "Fry eggs sunny side up",
      "Top toast with eggs and seasonings"
    ]
  },
  {
    id: 3,
    title: "Berry Yogurt Parfait",
    description: "Light and refreshing start",
    prepTime: "6 min prep",
    image: getSupabaseImageUrl("granola.jpg"),
    ingredients: [
      "1 cup Greek yogurt",
      "1/2 cup mixed berries",
      "1/4 cup granola",
      "1 tbsp honey",
      "Mint leaves for garnish"
    ],
    instructions: [
      "Layer yogurt at the bottom of a glass",
      "Add a layer of mixed berries",
      "Top with granola and drizzle honey",
      "Garnish with mint leaves"
    ]
  },
  {
    id: 4,
    title: "Breakfast Smoothie Bowl",
    description: "Nutrient-packed morning fuel",
    prepTime: "7 min prep",
    image: getSupabaseImageUrl("smoothie.jpg"),
    ingredients: [
      "1 frozen banana",
      "1/2 cup frozen berries",
      "1/4 cup Greek yogurt",
      "1/4 cup almond milk",
      "Toppings: granola, fresh fruit, nuts"
    ],
    instructions: [
      "Blend frozen banana, berries, yogurt and milk until smooth",
      "Pour into a bowl",
      "Arrange toppings artfully on top",
      "Serve immediately before it melts"
    ]
  },
  {
    id: 5,
    title: "Breakfast Quesadilla",
    description: "Savory morning delight",
    prepTime: "10 min prep",
    image: getSupabaseImageUrl("sandwich.jpg"),
    ingredients: [
      "2 flour tortillas",
      "2 eggs, scrambled",
      "1/4 cup shredded cheese",
      "2 tbsp salsa",
      "Avocado slices for serving"
    ],
    instructions: [
      "Place tortilla in a hot pan",
      "Add scrambled eggs and cheese",
      "Top with second tortilla and flip when golden",
      "Serve with salsa and avocado"
    ]
  }
];

export { BREAKFAST_RECIPES };

interface RecipeCardProps {
  recipe: Recipe;
  onClick?: () => void;
}

const RecipeCard: React.FC<RecipeCardProps> = ({ recipe, onClick }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    const checkIfLiked = async () => {
      if (user) {
        try {
          // Check if recipe is already liked in Supabase
          const { data, error } = await supabase
            .from('recipes')
            .select('id')
            .eq('user_id', user.id)
            .eq('title', recipe.title)
            .single();
          
          if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
            console.error('Error checking liked status:', error);
          }
          
          setIsLiked(!!data);
        } catch (error) {
          console.error('Error checking if recipe is liked:', error);
          // Fall back to localStorage if Supabase fails
          const likedRecipes = JSON.parse(localStorage.getItem('likedRecipes') || '[]');
          const isAlreadyLiked = likedRecipes.some((liked: any) => liked.id === recipe.id);
          setIsLiked(isAlreadyLiked);
        }
      } else {
        // If no user, use localStorage
        const likedRecipes = JSON.parse(localStorage.getItem('likedRecipes') || '[]');
        const isAlreadyLiked = likedRecipes.some((liked: any) => liked.id === recipe.id);
        setIsLiked(isAlreadyLiked);
      }
    };
    
    checkIfLiked();
  }, [recipe, user]);

  const handleLike = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (user) {
      try {
        if (isLiked) {
          // Remove from Supabase
          const { error } = await supabase
            .from('recipes')
            .delete()
            .eq('user_id', user.id)
            .eq('title', recipe.title);
          
          if (error) {
            handleSupabaseError(error, toast);
            return;
          }
          
          toast({
            title: "Removed from favorites",
            description: `${recipe.title} has been removed from your favorites`,
            duration: 2000,
          });
        } else {
          // Add to Supabase
          const recipeId = uuidv4();
          
          // Upload image to Supabase Storage if available
          let imagePath = null;
          let imageUrl = recipe.image;
          
          if (recipe.image && recipe.image.startsWith('http')) {
            try {
              // Fetch image and convert to File object for upload
              setUploadingImage(true);
              const response = await fetch(recipe.image);
              const blob = await response.blob();
              const file = new File([blob], `recipe-${recipeId}.jpg`, { type: 'image/jpeg' });
              
              // Upload to Supabase Storage
              const { path, url, error } = await uploadRecipeImage(file, user.id);
              
              if (!error && path && url) {
                imagePath = path;
                imageUrl = url;
              }
            } catch (error) {
              console.error('Error uploading image to Supabase:', error);
              // Continue with the original image URL if upload fails
            } finally {
              setUploadingImage(false);
            }
          }
          
          // Add recipe to database
          const { error } = await supabase
            .from('recipes')
            .insert({
              id: recipeId,
              user_id: user.id,
              title: recipe.title,
              description: recipe.description,
              prep_time: recipe.prepTime,
              image_url: imageUrl,
              image_path: imagePath,
              ingredients: recipe.ingredients,
              instructions: recipe.instructions
            });
          
          if (error) {
            handleSupabaseError(error, toast);
            return;
          }
          
          toast({
            title: "Added to favorites",
            description: `${recipe.title} has been added to your favorites`,
            duration: 2000,
          });
        }
        
        setIsLiked(!isLiked);
      } catch (error) {
        console.error('Error updating like status in Supabase:', error);
        // Fall back to localStorage if Supabase fails
        handleLocalStorageLike();
      }
    } else {
      // If no user, use localStorage
      handleLocalStorageLike();
    }
  };
  
  const handleLocalStorageLike = () => {
    const likedRecipes = JSON.parse(localStorage.getItem('likedRecipes') || '[]');
    let updatedLikedRecipes;
    
    if (isLiked) {
      // Remove from liked recipes
      updatedLikedRecipes = likedRecipes.filter((liked: any) => liked.id !== recipe.id);
      toast({
        title: "Removed from favorites",
        description: `${recipe.title} has been removed from your favorites`,
        duration: 2000,
      });
    } else {
      // Add to liked recipes
      updatedLikedRecipes = [...likedRecipes, recipe];
      toast({
        title: "Added to favorites",
        description: `${recipe.title} has been added to your favorites`,
        duration: 2000,
      });
    }
    
    localStorage.setItem('likedRecipes', JSON.stringify(updatedLikedRecipes));
    setIsLiked(!isLiked);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <motion.div 
          className="group cursor-pointer"
          whileHover={{ y: -5 }}
          transition={{ type: "spring", stiffness: 300 }}
          onClick={onClick}
        >
          <div className="neumorphic overflow-hidden rounded-xl transition-all duration-300 hover:shadow-[8px_8px_20px_rgba(0,0,0,0.1),-8px_-8px_20px_rgba(255,255,255,0.8)] dark:hover:shadow-[8px_8px_20px_rgba(0,0,0,0.3),-8px_-8px_20px_rgba(255,255,255,0.05)]">
            <div className="relative aspect-square max-h-[240px] w-full overflow-hidden">
              <img
                src={recipe.image}
                alt={recipe.title}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
              <button 
                className={`absolute right-3 top-3 rounded-full ${isLiked ? 'bg-[#4F2D9E] text-white' : 'bg-white/90 text-[#4F2D9E]'} backdrop-blur-sm p-2 transition-transform hover:scale-110`}
                onClick={handleLike}
                disabled={uploadingImage}
              >
                {uploadingImage ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <Heart className={`h-5 w-5 ${isLiked ? 'fill-white' : ''}`} />
                )}
              </button>
            </div>
            <div className="p-4">
              <div className="flex items-center gap-2 mb-1">
                <Clock className="h-4 w-4 text-[#4F2D9E]" />
                <span className="text-sm text-gray-600">{recipe.prepTime}</span>
              </div>
              <h2 className="mt-2 text-lg font-medium text-[#4F2D9E] flex items-center">
                <Coffee className="h-4 w-4 mr-2" />
                {recipe.title}
              </h2>
              <p className="mt-1 text-sm text-gray-600">{recipe.description}</p>
            </div>
          </div>
        </motion.div>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-4 p-4"
        >
          <h2 className="text-xl font-semibold text-[#4F2D9E] flex items-center">
            <Coffee className="h-5 w-5 mr-2" />
            {recipe.title}
          </h2>
          <div className="space-y-2">
            <h3 className="font-medium text-[#4F2D9E]">Ingredients:</h3>
            <ul className="list-inside list-disc space-y-1 text-gray-600">
              {recipe.ingredients?.map((ingredient, index) => (
                <motion.li 
                  key={index} 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  {ingredient}
                </motion.li>
              ))}
            </ul>
          </div>
          <div className="space-y-2">
            <h3 className="font-medium text-[#4F2D9E]">Instructions:</h3>
            <ol className="list-inside list-decimal space-y-2 text-gray-600">
              {recipe.instructions?.map((instruction, index) => (
                <motion.li 
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + index * 0.05 }}
                >
                  {instruction}
                </motion.li>
              ))}
            </ol>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};

export default RecipeCard;
