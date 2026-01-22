import React, { useState, useEffect } from 'react';
import { Heart, Clock, Coffee, Loader2 } from 'lucide-react';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { motion } from 'framer-motion';
import { useToast } from "@/hooks/use-toast";
import { supabase, handleSupabaseError, uploadRecipeImage } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';
import { v4 as uuidv4 } from 'uuid';
import { Button } from "@/components/ui/button";
import { Recipe } from '@/hooks/useMealPlanner';
import ImageLoader from './ImageLoader';

// Get Supabase image URL helper with cache busting
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
  const [isOpen, setIsOpen] = useState(false);
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
              description: recipe.description || '',
              prep_time: recipe.prepTime || '',
              image_url: imageUrl,
              image_path: imagePath,
              ingredients: recipe.ingredients || [],
              instructions: recipe.instructions || [],
              servings: recipe.servings || 2
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
        
        // Trigger storage event to update other components
        window.dispatchEvent(new Event('storage'));
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
    
    // Trigger storage event to update other components
    window.dispatchEvent(new Event('storage'));
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <motion.div
        className="group cursor-pointer"
        whileHover={{ y: -6 }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
        onClick={() => {
          if (onClick) {
            onClick();
          } else {
            setIsOpen(true);
          }
        }}
      >
        <div className="card-hover neumorphic overflow-hidden rounded-2xl">
          <div className="relative aspect-[4/3] max-h-[280px] w-full overflow-hidden">
            <ImageLoader
              src={recipe.image}
              alt={recipe.title}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
              fallbackClassName="h-full w-full flex items-center justify-center bg-gradient-to-br from-brand-purple-lighter to-brand-warm-lighter shimmer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent"></div>

            {/* Like button */}
            <button
              className={`absolute right-4 top-4 rounded-xl ${isLiked ? 'bg-brand-purple text-white shadow-glow' : 'bg-white/90 text-brand-purple hover:bg-white'} backdrop-blur-md p-2.5 transition-all duration-300 hover:scale-110 active:scale-95`}
              onClick={handleLike}
              disabled={uploadingImage}
              aria-label={isLiked ? "Remove from favorites" : "Add to favorites"}
            >
              {uploadingImage ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Heart className={`h-5 w-5 transition-all duration-300 ${isLiked ? 'fill-white scale-110' : 'group-hover:scale-110'}`} />
              )}
            </button>

            {/* Prep time badge */}
            <div className="absolute left-4 bottom-4 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/90 backdrop-blur-md text-sm font-medium text-foreground shadow-soft">
              <Clock className="h-3.5 w-3.5 text-brand-purple" />
              <span>{recipe.prepTime}</span>
            </div>
          </div>

          <div className="p-5">
            <h2 className="text-xl font-semibold text-foreground group-hover:text-brand-purple transition-colors duration-300 flex items-center gap-2">
              <Coffee className="h-5 w-5 text-brand-purple" />
              {recipe.title}
            </h2>
            <p className="mt-2 text-sm text-muted-foreground line-clamp-2 leading-relaxed">{recipe.description}</p>

            {/* Tags/Quick info */}
            <div className="mt-4 flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-full bg-brand-purple-lighter/60 text-brand-purple text-xs font-medium">
                Breakfast
              </span>
              <span className="px-2.5 py-1 rounded-full bg-brand-warm-lighter text-brand-warm text-xs font-medium">
                Easy
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      <DialogContent className="sm:max-w-[500px] glass border-white/30 p-0 overflow-hidden">
        <div className="relative">
          {recipe.image && (
            <div className="relative h-48 overflow-hidden">
              <ImageLoader
                src={recipe.image}
                alt={recipe.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent"></div>
            </div>
          )}

          <div className="p-6 -mt-8 relative">
            <DialogTitle className="text-2xl font-bold text-foreground flex items-center gap-2">
              <div className="p-2 rounded-xl bg-gradient-to-br from-brand-purple to-brand-purple-light shadow-soft">
                <Coffee className="h-5 w-5 text-white" />
              </div>
              {recipe.title}
            </DialogTitle>
            <DialogDescription className="mt-2 text-muted-foreground">
              {recipe.description}
            </DialogDescription>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-5 mt-6"
            >
              <div className="space-y-3">
                <h3 className="font-semibold text-brand-purple flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-purple"></span>
                  Ingredients
                </h3>
                <ul className="space-y-2">
                  {recipe.ingredients?.map((ingredient, index) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex items-start gap-2 text-muted-foreground text-sm"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-brand-warm mt-2 flex-shrink-0"></span>
                      {ingredient}
                    </motion.li>
                  ))}
                </ul>
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold text-brand-purple flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-purple"></span>
                  Instructions
                </h3>
                <ol className="space-y-3">
                  {recipe.instructions?.map((instruction, index) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 + index * 0.05 }}
                      className="flex gap-3 text-sm text-muted-foreground"
                    >
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-brand-purple-lighter text-brand-purple text-xs font-semibold flex items-center justify-center">
                        {index + 1}
                      </span>
                      <span className="pt-0.5">{instruction}</span>
                    </motion.li>
                  ))}
                </ol>
              </div>
            </motion.div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RecipeCard;
