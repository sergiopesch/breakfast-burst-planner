
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import RecipeCard from '../components/RecipeCard';
import CtaButton from '../components/CtaButton';
import { Button } from "@/components/ui/button";
import { RefreshCw, Coffee, Heart, BookOpen } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { BREAKFAST_RECIPES } from '../components/RecipeCard';
import { useTheme } from '../components/ThemeProvider';
import ImageLoader from '../components/ImageLoader';

const Index = () => {
  const theme = useTheme();
  const [isVisible, setIsVisible] = useState(false);
  const [recipeKey, setRecipeKey] = useState(0);
  const [favoriteCount, setFavoriteCount] = useState(0);
  const [currentRecipe, setCurrentRecipe] = useState(() => 
    BREAKFAST_RECIPES[Math.floor(Math.random() * BREAKFAST_RECIPES.length)]
  );
  
  useEffect(() => {
    setIsVisible(true);
    
    // Load favorite count
    const loadFavorites = () => {
      try {
        const likedRecipes = JSON.parse(localStorage.getItem('likedRecipes') || '[]');
        setFavoriteCount(likedRecipes.length);
      } catch (error) {
        console.error("Error loading favorites:", error);
        setFavoriteCount(0);
      }
    };
    
    loadFavorites();
    
    // Listen for changes in localStorage
    const handleStorageChange = () => {
      loadFavorites();
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    // Check for changes when custom event is dispatched
    window.addEventListener('favoritesUpdated', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('favoritesUpdated', handleStorageChange);
    };
  }, []);

  const handleRandomize = () => {
    const recipes = BREAKFAST_RECIPES.filter(recipe => recipe.id !== currentRecipe.id);
    const newRecipe = recipes[Math.floor(Math.random() * recipes.length)];
    setCurrentRecipe(newRecipe);
    setRecipeKey(prev => prev + 1);
  };

  return (
    <div className="min-h-screen p-6 md:p-8 max-w-4xl mx-auto">
      <div className={`space-y-8 ${isVisible ? 'fade-up' : 'opacity-0'}`}>
        {/* Greeting Header */}
        <motion.header 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className={`text-3xl md:text-4xl lg:text-5xl ${theme.fonts.heading} mb-2 text-[${theme.colors.primary}] flex items-center`}>
            <Coffee className="h-8 w-8 mr-3" aria-hidden="true" />
            Good morning!
          </h1>
          <p className="text-lg md:text-xl text-gray-500">What's for breakfast today?</p>
        </motion.header>
        
        {/* Main Content */}
        <div className="flex flex-col gap-8">
          {/* Recipe Section */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="w-full"
          >
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-4">
                <Button
                  onClick={handleRandomize}
                  className="flex items-center gap-2 bg-[#4F2D9E] text-white hover:bg-[#3D1C8F] transition-colors"
                  aria-label="Show me a different recipe"
                >
                  <RefreshCw className="h-4 w-4" aria-hidden="true" />
                  Surprise me
                </Button>
                
                <AnimatePresence>
                  {favoriteCount > 0 && (
                    <motion.div 
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="flex items-center"
                    >
                      <Heart className="h-5 w-5 mr-1 fill-[#4F2D9E] text-[#4F2D9E]" aria-hidden="true" />
                      <span className="text-sm font-medium text-[#4F2D9E]">
                        {favoriteCount} recipe{favoriteCount !== 1 ? 's' : ''} saved
                      </span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              
              <Link 
                to="/recipes"
                className="flex items-center text-sm font-medium text-[#4F2D9E] hover:underline"
              >
                <BookOpen className="h-4 w-4 mr-1" aria-hidden="true" />
                View all recipes
              </Link>
            </div>
            <RecipeCard key={recipeKey} recipe={currentRecipe} />
          </motion.div>
          
          {/* CTA Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="w-full mt-8 p-6 bg-gradient-to-br from-white to-[#E5DEFF] rounded-xl shadow-sm"
          >
            <div className="space-y-4">
              <h2 className="text-xl font-medium text-[#4F2D9E] flex items-center">
                <Coffee className="h-5 w-5 mr-2" aria-hidden="true" />
                Plan your breakfast week
              </h2>
              <p className="text-gray-600 mb-4">Organize your morning meals to start each day right</p>
              <CtaButton to="/planner">Go to breakfast planner</CtaButton>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Index;
