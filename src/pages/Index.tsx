
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import RecipeCard from '../components/RecipeCard';
import CtaButton from '../components/CtaButton';
import { Button } from "@/components/ui/button";
import { RefreshCw, Sunrise, Heart, BookOpen, Sparkles, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { BREAKFAST_RECIPES } from '../components/RecipeCard';
import { useTheme } from '../components/ThemeProvider';

const Index = () => {
  const theme = useTheme();
  const [isVisible, setIsVisible] = useState(false);
  const [recipeKey, setRecipeKey] = useState(0);
  const [favoriteCount, setFavoriteCount] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
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
    setIsSpinning(true);
    const recipes = BREAKFAST_RECIPES.filter(recipe => recipe.id !== currentRecipe.id);
    const newRecipe = recipes[Math.floor(Math.random() * recipes.length)];
    setTimeout(() => {
      setCurrentRecipe(newRecipe);
      setRecipeKey(prev => prev + 1);
      setIsSpinning(false);
    }, 300);
  };

  return (
    <div className="min-h-screen bg-gradient-soft">
      <div className="p-6 md:p-8 lg:p-12 max-w-5xl mx-auto">
        <div className={`space-y-10 ${isVisible ? 'fade-up' : 'opacity-0'}`}>
          {/* Hero Header */}
          <motion.header
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="text-center md:text-left"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-purple-lighter/60 text-brand-purple text-sm font-medium mb-4">
              <Sparkles className="h-4 w-4" aria-hidden="true" />
              <span>Discover new breakfast ideas</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-3 text-foreground">
              Good morning!{' '}
              <span className="text-gradient">Rise & dine</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl">
              Start your day with delicious inspiration. Find the perfect breakfast to fuel your morning.
            </p>
          </motion.header>

          {/* Main Content */}
          <div className="flex flex-col gap-10">
            {/* Recipe Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="w-full"
            >
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div className="flex flex-wrap items-center gap-3">
                  <Button
                    onClick={handleRandomize}
                    className="btn-glow group flex items-center gap-2.5 bg-gradient-to-r from-brand-purple to-brand-purple-light text-white font-medium px-5 py-2.5 rounded-xl border-0"
                    aria-label="Show me a different recipe"
                    disabled={isSpinning}
                  >
                    <RefreshCw className={`h-4 w-4 transition-transform duration-300 ${isSpinning ? 'animate-spin' : 'group-hover:rotate-180'}`} aria-hidden="true" />
                    Surprise me
                  </Button>

                  <AnimatePresence>
                    {favoriteCount > 0 && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-brand-purple-lighter/50"
                      >
                        <Heart className="h-4 w-4 fill-brand-purple text-brand-purple" aria-hidden="true" />
                        <span className="text-sm font-medium text-brand-purple">
                          {favoriteCount} saved
                        </span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <Link
                  to="/recipes"
                  className="group flex items-center gap-2 text-sm font-medium text-brand-purple hover:text-brand-purple-light transition-colors"
                >
                  <BookOpen className="h-4 w-4" aria-hidden="true" />
                  <span>View all recipes</span>
                  <span className="transition-transform duration-200 group-hover:translate-x-0.5">&rarr;</span>
                </Link>
              </div>

              <motion.div
                key={recipeKey}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              >
                <RecipeCard recipe={currentRecipe} />
              </motion.div>
            </motion.div>

            {/* CTA Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="w-full"
            >
              <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-white via-brand-purple-lighter/30 to-brand-warm-lighter/50 border border-white/50 shadow-soft-lg p-8 md:p-10">
                {/* Decorative elements */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-brand-purple/5 to-transparent rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-brand-warm/10 to-transparent rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />

                <div className="relative space-y-5">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-gradient-to-br from-brand-purple to-brand-purple-light shadow-soft">
                      <Calendar className="h-5 w-5 text-white" aria-hidden="true" />
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                      Plan your week
                    </h2>
                  </div>
                  <p className="text-muted-foreground text-lg max-w-lg">
                    Organize your morning meals and never wonder what's for breakfast again. Start each day with purpose.
                  </p>
                  <div className="flex flex-wrap gap-3 pt-2">
                    <CtaButton to="/planner">
                      Open planner
                    </CtaButton>
                    <CtaButton to="/create-recipe" variant="secondary">
                      Create recipe
                    </CtaButton>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
