
import React, { useState, useEffect, Suspense } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Plus, Search, ArrowLeft, UtensilsCrossed, Grid, LayoutGrid, Filter } from "lucide-react";

import { useRecipes } from "@/hooks/useRecipes";
import { useAuth } from "@/hooks/useAuth";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import RecipeCard, { BREAKFAST_RECIPES } from "@/components/RecipeCard";
import { motion, AnimatePresence } from "framer-motion";
import { ScrollReveal, StaggerContainer, StaggerItem } from "@/components/ScrollReveal";
import OptimizedImage from "@/components/OptimizedImage";

const Recipes = () => {
  const { recipes, isLoading } = useRecipes();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState("");
  const [filteredRecipes, setFilteredRecipes] = useState(recipes);
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<'grid' | 'masonry'>('grid');
  const [showTemplates, setShowTemplates] = useState(true);

  // Combine user recipes with template recipes
  const allRecipes = showTemplates
    ? [...recipes, ...BREAKFAST_RECIPES.map(r => ({ ...r, isTemplate: true }))]
    : recipes;

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Filter recipes
  useEffect(() => {
    if (debouncedSearchQuery.trim() === "") {
      setFilteredRecipes(allRecipes);
    } else {
      const filtered = allRecipes.filter(recipe =>
        recipe.title.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
        (recipe.description && recipe.description.toLowerCase().includes(debouncedSearchQuery.toLowerCase()))
      );
      setFilteredRecipes(filtered);
    }
  }, [debouncedSearchQuery, allRecipes, recipes, showTemplates]);

  const handleViewRecipe = (recipeId: string | number) => {
    console.log(`View recipe: ${recipeId}`);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Header */}
      <div className="relative h-[40vh] min-h-[320px] overflow-hidden">
        <OptimizedImage
          src="https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?w=1920&q=80"
          alt="Breakfast spread"
          className="w-full h-full object-cover"
          containerClassName="absolute inset-0"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-background/20" />

        <div className="absolute inset-0 flex items-end">
          <div className="container mx-auto px-6 pb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Link
                to="/"
                className="group inline-flex items-center gap-2 text-sm font-medium text-foreground/70 hover:text-foreground transition-colors mb-6"
              >
                <ArrowLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" />
                Back to Home
              </Link>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-medium text-foreground tracking-tight mb-4">
                Recipe Collection
              </h1>
              <p className="text-lg text-foreground/70 max-w-xl">
                Discover delicious breakfast ideas and create your own culinary masterpieces
              </p>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="sticky top-16 z-40 bg-background/80 backdrop-blur-xl border-b border-border/30">
        <div className="container mx-auto px-6 py-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            {/* Search */}
            <div className="relative w-full sm:w-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search recipes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-11 w-full sm:w-80 rounded-full border-border/50 bg-background focus:border-foreground/30"
              />
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
              {/* View Toggle */}
              <div className="flex items-center gap-1 bg-secondary/50 rounded-full p-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className={`h-8 w-8 rounded-full ${viewMode === 'grid' ? 'bg-background shadow-sm' : ''}`}
                  onClick={() => setViewMode('grid')}
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className={`h-8 w-8 rounded-full ${viewMode === 'masonry' ? 'bg-background shadow-sm' : ''}`}
                  onClick={() => setViewMode('masonry')}
                >
                  <LayoutGrid className="h-4 w-4" />
                </Button>
              </div>

              {/* Filter Toggle */}
              <Button
                variant="outline"
                size="sm"
                className={`rounded-full ${showTemplates ? '' : 'bg-foreground text-background'}`}
                onClick={() => setShowTemplates(!showTemplates)}
              >
                <Filter className="h-4 w-4 mr-2" />
                {showTemplates ? 'All' : 'My Recipes'}
              </Button>

              {/* Create Button */}
              <Button
                className="btn-primary rounded-full px-5"
                onClick={() => navigate('/create-recipe')}
              >
                <Plus className="h-4 w-4 mr-2" />
                Create
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-6 py-12">
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className={viewMode === 'masonry'
                ? "columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6"
                : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              }
            >
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className={`rounded-2xl bg-secondary/50 shimmer ${
                    viewMode === 'masonry'
                      ? `aspect-[${i % 2 === 0 ? '3/4' : '4/3'}] break-inside-avoid mb-6`
                      : 'aspect-[4/3]'
                  }`}
                  style={viewMode === 'masonry' ? { aspectRatio: i % 2 === 0 ? '3/4' : '4/3' } : undefined}
                />
              ))}
            </motion.div>
          ) : filteredRecipes.length === 0 && recipes.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              <ScrollReveal>
                <div className="text-center py-24 px-6 bg-secondary/30 rounded-3xl border border-border/30">
                  <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-secondary flex items-center justify-center">
                    <UtensilsCrossed className="h-10 w-10 text-muted-foreground/40" />
                  </div>
                  <h2 className="text-2xl font-medium text-foreground mb-3">Start Your Collection</h2>
                  <p className="text-muted-foreground max-w-md mx-auto mb-8">
                    Create your first recipe and begin building your personal breakfast collection.
                  </p>
                  <Button
                    className="btn-primary rounded-full px-8 py-6"
                    onClick={() => navigate('/create-recipe')}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Create Your First Recipe
                  </Button>
                </div>
              </ScrollReveal>
            </motion.div>
          ) : filteredRecipes.length === 0 ? (
            <motion.div
              key="no-results"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              <div className="text-center py-24 px-6 bg-secondary/30 rounded-3xl border border-border/30">
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-secondary flex items-center justify-center">
                  <Search className="h-10 w-10 text-muted-foreground/40" />
                </div>
                <h2 className="text-2xl font-medium text-foreground mb-3">No Matching Recipes</h2>
                <p className="text-muted-foreground mb-8">
                  Try adjusting your search or filters to find what you're looking for.
                </p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchQuery("");
                    setShowTemplates(true);
                  }}
                  className="rounded-full"
                >
                  Clear filters
                </Button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {/* Results count */}
              <p className="text-sm text-muted-foreground mb-8">
                Showing {filteredRecipes.length} {filteredRecipes.length === 1 ? 'recipe' : 'recipes'}
              </p>

              {viewMode === 'masonry' ? (
                <div className="columns-1 md:columns-2 lg:columns-3 gap-6">
                  {filteredRecipes.map((recipe, index) => (
                    <motion.div
                      key={recipe.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: Math.min(index * 0.05, 0.3) }}
                      className="break-inside-avoid mb-6"
                    >
                      <RecipeCard
                        recipe={recipe}
                        onClick={() => handleViewRecipe(recipe.id)}
                      />
                    </motion.div>
                  ))}
                </div>
              ) : (
                <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredRecipes.map((recipe) => (
                    <StaggerItem key={recipe.id}>
                      <RecipeCard
                        recipe={recipe}
                        onClick={() => handleViewRecipe(recipe.id)}
                      />
                    </StaggerItem>
                  ))}
                </StaggerContainer>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom CTA */}
      {filteredRecipes.length > 0 && (
        <ScrollReveal>
          <div className="container mx-auto px-6 pb-24">
            <div className="bg-secondary/30 rounded-3xl p-12 text-center">
              <h3 className="text-2xl font-medium text-foreground mb-4">
                Have a recipe to share?
              </h3>
              <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                Add your favorite breakfast recipes to your collection and access them anytime.
              </p>
              <Button
                className="btn-primary rounded-full px-8"
                onClick={() => navigate('/create-recipe')}
              >
                <Plus className="h-4 w-4 mr-2" />
                Create New Recipe
              </Button>
            </div>
          </div>
        </ScrollReveal>
      )}
    </div>
  );
};

export default Recipes;
