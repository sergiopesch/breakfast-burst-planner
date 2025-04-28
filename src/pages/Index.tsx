
import React, { useEffect, useState } from 'react';
import RecipeCard from '../components/RecipeCard';
import CtaButton from '../components/CtaButton';
import { Button } from "@/components/ui/button";
import { RefreshCw, Coffee, Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { BREAKFAST_RECIPES } from '../components/RecipeCard';

const Index = () => {
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
      const likedRecipes = JSON.parse(localStorage.getItem('likedRecipes') || '[]');
      setFavoriteCount(likedRecipes.length);
    };
    
    loadFavorites();
    
    // Listen for changes in localStorage
    const handleStorageChange = () => {
      loadFavorites();
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    // Check for changes every few seconds (for when the same window makes changes)
    const interval = setInterval(loadFavorites, 2000);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const handleRandomize = () => {
    setCurrentRecipe(BREAKFAST_RECIPES[Math.floor(Math.random() * BREAKFAST_RECIPES.length)]);
    setRecipeKey(prev => prev + 1);
  };

  return (
    <div className="min-h-screen p-6 md:p-8 max-w-4xl mx-auto bg-[#F8F5FF]">
      <div className={`space-y-8 ${isVisible ? 'fade-up' : 'opacity-0'}`}>
        {/* Greeting Header */}
        <motion.header 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-medium mb-2 text-[#4F2D9E] flex items-center">
            <Coffee className="h-8 w-8 mr-3" />
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
                  className="flex items-center gap-2 bg-[#4F2D9E] text-white hover:bg-[#4F2D9E]/90 transition-colors"
                >
                  <RefreshCw className="h-4 w-4" />
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
                      <Heart className={`h-5 w-5 mr-1 fill-[#4F2D9E] text-[#4F2D9E]`} />
                      <span className="text-sm font-medium text-[#4F2D9E]">{favoriteCount} recipe{favoriteCount !== 1 ? 's' : ''} saved</span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
            <RecipeCard key={recipeKey} recipe={currentRecipe} />
          </motion.div>
          
          {/* CTA Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="w-full mt-8 p-6 bg-gradient-to-br from-white to-[#F0EBFF] rounded-xl shadow-sm"
          >
            <div className="space-y-4">
              <h2 className="text-xl font-medium text-[#4F2D9E] flex items-center">
                <Coffee className="h-5 w-5 mr-2" />
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
