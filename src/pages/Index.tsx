
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router';
import RecipeCard from '../components/RecipeCard';
import CtaButton from '../components/CtaButton';
import { Button } from "@/components/ui/button";
import { RefreshCw, Heart, ArrowRight, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { BREAKFAST_RECIPES } from '../components/RecipeCard';

const Index = () => {
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
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative">
        <div className="container mx-auto px-6 pt-16 pb-24 md:pt-24 md:pb-32">
          <div className={`max-w-4xl mx-auto text-center ${isVisible ? 'fade-up' : 'opacity-0'}`}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              <span className="inline-block text-xs font-medium tracking-widest uppercase text-muted-foreground mb-6">
                Discover new breakfast ideas
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight text-foreground mb-6">
                Good morning.{' '}
                <span className="text-gradient">Rise & dine</span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-xl mx-auto mb-10 leading-relaxed">
                Start your day with delicious inspiration. Find the perfect breakfast to fuel your morning.
              </p>

              <div className="flex flex-wrap items-center justify-center gap-4">
                <CtaButton to="/planner">
                  Open planner
                </CtaButton>
                <CtaButton to="/create-recipe" variant="secondary">
                  Create recipe
                </CtaButton>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Featured Recipe Section */}
      <section className="py-16 md:py-24 border-t border-border/30">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Section Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-10">
              <div>
                <span className="text-xs font-medium tracking-widest uppercase text-muted-foreground mb-2 block">
                  Featured
                </span>
                <h2 className="text-2xl md:text-3xl font-medium text-foreground">
                  Today's inspiration
                </h2>
              </div>

              <div className="flex flex-wrap items-center gap-4">
                <Button
                  onClick={handleRandomize}
                  variant="outline"
                  className="group flex items-center gap-2.5 rounded-full px-5 py-2.5 border-border/50 hover:border-foreground/30 transition-all duration-300"
                  aria-label="Show me a different recipe"
                  disabled={isSpinning}
                >
                  <RefreshCw
                    className={`h-4 w-4 transition-transform duration-500 ${isSpinning ? 'animate-spin' : 'group-hover:rotate-180'}`}
                    aria-hidden="true"
                  />
                  <span className="text-sm font-medium">Surprise me</span>
                </Button>

                <AnimatePresence>
                  {favoriteCount > 0 && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/50"
                    >
                      <Heart className="h-4 w-4 fill-foreground/60 text-foreground/60" aria-hidden="true" />
                      <span className="text-sm font-medium text-foreground/80">
                        {favoriteCount} saved
                      </span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Recipe Card */}
            <motion.div
              key={recipeKey}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="max-w-2xl"
            >
              <RecipeCard recipe={currentRecipe} />
            </motion.div>

            {/* View All Link */}
            <div className="mt-8">
              <Link
                to="/recipes"
                className="group inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-300"
              >
                <span>View all recipes</span>
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24 border-t border-border/30 bg-secondary/30">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-4xl mx-auto"
          >
            <div className="text-center mb-16">
              <span className="text-xs font-medium tracking-widest uppercase text-muted-foreground mb-2 block">
                How it works
              </span>
              <h2 className="text-2xl md:text-3xl font-medium text-foreground">
                Simple, elegant planning
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
              {[
                {
                  step: '01',
                  title: 'Discover',
                  description: 'Browse curated breakfast recipes or create your own delicious meals.',
                },
                {
                  step: '02',
                  title: 'Plan',
                  description: 'Organize your weekly breakfast schedule with our intuitive planner.',
                },
                {
                  step: '03',
                  title: 'Enjoy',
                  description: 'Wake up knowing exactly what delicious breakfast awaits you.',
                },
              ].map((feature, index) => (
                <motion.div
                  key={feature.step}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="text-center md:text-left"
                >
                  <span className="text-4xl font-light text-border mb-4 block">
                    {feature.step}
                  </span>
                  <h3 className="text-lg font-medium text-foreground mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-28 border-t border-border/30">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-2xl mx-auto text-center"
          >
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-medium text-foreground mb-6">
              Ready to transform your mornings?
            </h2>
            <p className="text-muted-foreground mb-10 leading-relaxed">
              Join thousands of breakfast enthusiasts who have made their mornings more delicious and organized.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <CtaButton to="/planner">
                Get started
              </CtaButton>
              <CtaButton to="/recipes" variant="secondary">
                Browse recipes
              </CtaButton>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Index;
