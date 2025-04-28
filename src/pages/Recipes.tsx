
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Plus, FileText, Search, Loader2 } from "lucide-react";

import { useRecipes } from "@/hooks/useRecipes";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import RecipeCard from "@/components/RecipeCard";
import { motion, AnimatePresence } from "framer-motion";

const Recipes = () => {
  const { recipes, isLoading } = useRecipes();
  const { user } = useAuth();
  const { toast } = useToast();
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
    // Future feature - navigate to recipe details
  };
  
  return (
    <div className="min-h-screen bg-[#F8F5FF] pb-8">
      <div className="container mx-auto p-4 md:p-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <BookOpen className="h-6 w-6 text-purple-500" aria-hidden="true" />
            <h1 className="text-2xl font-bold">My Recipes</h1>
          </div>
          
          <div className="w-full md:w-auto flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-3">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" aria-hidden="true" />
              <Input
                type="text"
                placeholder="Search recipes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
                aria-label="Search recipes"
              />
            </div>
            <Button 
              className="bg-purple-600 hover:bg-purple-700"
              onClick={() => navigate('/create-recipe')}
            >
              <Plus className="h-4 w-4 mr-2" aria-hidden="true" />
              Create New Recipe
            </Button>
          </div>
        </div>
        
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
                <div key={i} className="h-64 rounded-lg bg-gray-200 animate-pulse"></div>
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
              <Card className="p-8 text-center">
                <div className="flex flex-col items-center space-y-4">
                  <FileText className="h-12 w-12 text-gray-400" aria-hidden="true" />
                  <h2 className="text-xl font-semibold">No Recipes Yet</h2>
                  <p className="text-gray-500 max-w-md mx-auto">
                    You haven't created any recipes yet. Get started by creating your first recipe!
                  </p>
                  <Button 
                    className="mt-4 bg-purple-600 hover:bg-purple-700"
                    onClick={() => navigate('/create-recipe')}
                  >
                    <Plus className="h-4 w-4 mr-2" aria-hidden="true" />
                    Create Your First Recipe
                  </Button>
                </div>
              </Card>
            </motion.div>
          ) : filteredRecipes.length === 0 ? (
            <motion.div
              key="no-results"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="p-8 text-center">
                <div className="flex flex-col items-center space-y-4">
                  <Search className="h-12 w-12 text-gray-400" aria-hidden="true" />
                  <h2 className="text-xl font-semibold">No Matching Recipes</h2>
                  <p className="text-gray-500">
                    No recipes match your search query. Try adjusting your search.
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => setSearchQuery("")}
                    className="mt-2"
                  >
                    Clear search
                  </Button>
                </div>
              </Card>
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
                {filteredRecipes.map((recipe) => (
                  <motion.div
                    key={recipe.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
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
