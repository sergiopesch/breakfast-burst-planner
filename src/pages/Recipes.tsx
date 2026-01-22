
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Plus, Search, ArrowLeft, UtensilsCrossed } from "lucide-react";

import { useRecipes } from "@/hooks/useRecipes";
import { useAuth } from "@/hooks/useAuth";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import RecipeCard from "@/components/RecipeCard";
import { motion, AnimatePresence } from "framer-motion";

const Recipes = () => {
  const { recipes, isLoading } = useRecipes();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState("");
  const [filteredRecipes, setFilteredRecipes] = useState(recipes);
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");

  // Debounce search query to improve performance
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Filter recipes based on debounced search query
  useEffect(() => {
    if (debouncedSearchQuery.trim() === "") {
      setFilteredRecipes(recipes);
    } else {
      const filtered = recipes.filter(recipe =>
        recipe.title.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
        (recipe.description && recipe.description.toLowerCase().includes(debouncedSearchQuery.toLowerCase()))
      );
      setFilteredRecipes(filtered);
    }
  }, [debouncedSearchQuery, recipes]);

  const handleViewRecipe = (recipeId: string | number) => {
    console.log(`View recipe: ${recipeId}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 md:px-6 py-8 max-w-6xl">
        {/* Header */}
        <div className="mb-10">
          <Link
            to="/"
            className="group inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors mb-6"
          >
            <ArrowLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" />
            Back to Home
          </Link>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
            <div>
              <span className="text-xs font-medium tracking-widest uppercase text-muted-foreground mb-2 block">
                Your collection
              </span>
              <h1 className="text-2xl md:text-3xl font-medium text-foreground">
                My Recipes
              </h1>
            </div>

            <div className="w-full md:w-auto flex flex-col sm:flex-row gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" aria-hidden="true" />
                <Input
                  type="text"
                  placeholder="Search recipes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-full sm:w-64 rounded-full border-border/50 bg-background focus:border-foreground/30"
                  aria-label="Search recipes"
                />
              </div>
              <Button
                className="btn-primary rounded-full px-5"
                onClick={() => navigate('/create-recipe')}
              >
                <Plus className="h-4 w-4 mr-2" aria-hidden="true" />
                Create New
              </Button>
            </div>
          </div>
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {[1, 2, 3].map((i) => (
                <div key={i} className="aspect-[4/3] rounded-xl bg-secondary/50 shimmer" />
              ))}
            </motion.div>
          ) : recipes.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="text-center py-20 px-6 bg-secondary/30 rounded-2xl border border-border/30">
                <UtensilsCrossed className="h-12 w-12 mx-auto text-muted-foreground/40 mb-4" />
                <h2 className="text-xl font-medium text-foreground mb-2">No Recipes Yet</h2>
                <p className="text-muted-foreground max-w-md mx-auto mb-8">
                  You haven't created any recipes yet. Get started by creating your first recipe!
                </p>
                <Button
                  className="btn-primary rounded-full px-6"
                  onClick={() => navigate('/create-recipe')}
                >
                  <Plus className="h-4 w-4 mr-2" aria-hidden="true" />
                  Create Your First Recipe
                </Button>
              </div>
            </motion.div>
          ) : filteredRecipes.length === 0 ? (
            <motion.div
              key="no-results"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="text-center py-20 px-6 bg-secondary/30 rounded-2xl border border-border/30">
                <Search className="h-12 w-12 mx-auto text-muted-foreground/40 mb-4" />
                <h2 className="text-xl font-medium text-foreground mb-2">No Matching Recipes</h2>
                <p className="text-muted-foreground mb-6">
                  No recipes match your search query. Try adjusting your search.
                </p>
                <Button
                  variant="outline"
                  onClick={() => setSearchQuery("")}
                  className="rounded-full"
                >
                  Clear search
                </Button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredRecipes.map((recipe, index) => (
                  <motion.div
                    key={recipe.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <RecipeCard
                      recipe={recipe}
                      onClick={() => handleViewRecipe(recipe.id)}
                    />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Recipes;
