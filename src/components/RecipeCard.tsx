import React, { useState, useEffect } from 'react';
import { Heart, Clock, Loader2, X } from 'lucide-react';
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
    description: "A healthy breakfast bowl with creamy oats and fresh banana slices",
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
    description: "Classic breakfast favorite with perfectly toasted bread and creamy avocado",
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
    description: "Light and refreshing layers of yogurt, berries, and crunchy granola",
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
    description: "Nutrient-packed morning fuel with beautiful toppings",
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
    description: "Savory morning delight with fluffy eggs and melted cheese",
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
          const { data, error } = await supabase
            .from('recipes')
            .select('id')
            .eq('user_id', user.id)
            .eq('title', recipe.title)
            .single();

          if (error && error.code !== 'PGRST116') {
            console.error('Error checking liked status:', error);
          }

          setIsLiked(!!data);
        } catch (error) {
          console.error('Error checking if recipe is liked:', error);
          const likedRecipes = JSON.parse(localStorage.getItem('likedRecipes') || '[]');
          const isAlreadyLiked = likedRecipes.some((liked: any) => liked.id === recipe.id);
          setIsLiked(isAlreadyLiked);
        }
      } else {
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
          const recipeId = uuidv4();

          let imagePath = null;
          let imageUrl = recipe.image;

          if (recipe.image && recipe.image.startsWith('http')) {
            try {
              setUploadingImage(true);
              const response = await fetch(recipe.image);
              const blob = await response.blob();
              const file = new File([blob], `recipe-${recipeId}.jpg`, { type: 'image/jpeg' });

              const { path, url, error } = await uploadRecipeImage(file, user.id);

              if (!error && path && url) {
                imagePath = path;
                imageUrl = url;
              }
            } catch (error) {
              console.error('Error uploading image to Supabase:', error);
            } finally {
              setUploadingImage(false);
            }
          }

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
        window.dispatchEvent(new Event('storage'));
      } catch (error) {
        console.error('Error updating like status in Supabase:', error);
        handleLocalStorageLike();
      }
    } else {
      handleLocalStorageLike();
    }
  };

  const handleLocalStorageLike = () => {
    const likedRecipes = JSON.parse(localStorage.getItem('likedRecipes') || '[]');
    let updatedLikedRecipes;

    if (isLiked) {
      updatedLikedRecipes = likedRecipes.filter((liked: any) => liked.id !== recipe.id);
      toast({
        title: "Removed from favorites",
        description: `${recipe.title} has been removed from your favorites`,
        duration: 2000,
      });
    } else {
      updatedLikedRecipes = [...likedRecipes, recipe];
      toast({
        title: "Added to favorites",
        description: `${recipe.title} has been added to your favorites`,
        duration: 2000,
      });
    }

    localStorage.setItem('likedRecipes', JSON.stringify(updatedLikedRecipes));
    setIsLiked(!isLiked);
    window.dispatchEvent(new Event('storage'));
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <motion.div
        className="group cursor-pointer"
        whileHover={{ y: -4 }}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
        onClick={() => {
          if (onClick) {
            onClick();
          } else {
            setIsOpen(true);
          }
        }}
      >
        <div className="card-elegant overflow-hidden rounded-xl">
          {/* Image Container */}
          <div className="relative aspect-[4/3] overflow-hidden bg-secondary">
            <ImageLoader
              src={recipe.image}
              alt={recipe.title}
              className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              fallbackClassName="h-full w-full flex items-center justify-center bg-secondary shimmer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            {/* Like button */}
            <button
              className={`absolute right-3 top-3 rounded-full p-2.5 transition-all duration-300 ${
                isLiked
                  ? 'bg-foreground text-background'
                  : 'bg-background/90 backdrop-blur-sm text-foreground hover:bg-background'
              }`}
              onClick={handleLike}
              disabled={uploadingImage}
              aria-label={isLiked ? "Remove from favorites" : "Add to favorites"}
            >
              {uploadingImage ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Heart className={`h-4 w-4 transition-all duration-300 ${isLiked ? 'fill-current' : ''}`} />
              )}
            </button>

            {/* Prep time badge */}
            <div className="absolute left-3 bottom-3 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-background/90 backdrop-blur-sm text-xs font-medium text-foreground">
              <Clock className="h-3 w-3" />
              <span>{recipe.prepTime}</span>
            </div>
          </div>

          {/* Content */}
          <div className="p-5">
            <h2 className="text-lg font-medium text-foreground group-hover:text-foreground/80 transition-colors duration-300 mb-1.5">
              {recipe.title}
            </h2>
            <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
              {recipe.description}
            </p>

            {/* Tags */}
            <div className="mt-4 flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-full bg-secondary text-xs font-medium text-secondary-foreground">
                Breakfast
              </span>
              <span className="px-2.5 py-1 rounded-full bg-secondary text-xs font-medium text-secondary-foreground">
                Easy
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Recipe Dialog */}
      <DialogContent className="sm:max-w-[500px] bg-card/95 backdrop-blur-xl border-border/50 p-0 overflow-hidden rounded-2xl">
        <div className="relative">
          {recipe.image && (
            <div className="relative h-56 overflow-hidden">
              <ImageLoader
                src={recipe.image}
                alt={recipe.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-card via-card/30 to-transparent" />
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-3 right-3 h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background"
                onClick={() => setIsOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}

          <div className="p-6 -mt-12 relative">
            <DialogTitle className="text-xl font-medium text-foreground mb-2">
              {recipe.title}
            </DialogTitle>
            <DialogDescription className="text-muted-foreground text-sm">
              {recipe.description}
            </DialogDescription>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-6 mt-6"
            >
              {/* Ingredients */}
              <div className="space-y-3">
                <h3 className="text-xs font-medium tracking-widest uppercase text-muted-foreground">
                  Ingredients
                </h3>
                <ul className="space-y-2">
                  {recipe.ingredients?.map((ingredient, index) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.03 }}
                      className="flex items-start gap-3 text-sm text-foreground/80"
                    >
                      <span className="w-1 h-1 rounded-full bg-foreground/40 mt-2 flex-shrink-0" />
                      {ingredient}
                    </motion.li>
                  ))}
                </ul>
              </div>

              {/* Instructions */}
              <div className="space-y-3">
                <h3 className="text-xs font-medium tracking-widest uppercase text-muted-foreground">
                  Instructions
                </h3>
                <ol className="space-y-3">
                  {recipe.instructions?.map((instruction, index) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.15 + index * 0.03 }}
                      className="flex gap-3 text-sm text-foreground/80"
                    >
                      <span className="flex-shrink-0 w-5 h-5 rounded-full bg-secondary text-xs font-medium flex items-center justify-center text-secondary-foreground">
                        {index + 1}
                      </span>
                      <span className="pt-0.5 leading-relaxed">{instruction}</span>
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
