
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Plus, FileText, Search } from "lucide-react";

import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/lib/supabase";
import { Recipe } from "@/hooks/useMealPlanner";
import { useToast } from "@/hooks/use-toast";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { RecipeCard } from "@/components/RecipeCard";
import NavBar from '@/components/NavBar';

const Recipes = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  
  useEffect(() => {
    const fetchRecipes = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }
      
      try {
        const { data, error } = await supabase
          .from('recipes')
          .select('*')
          .eq('user_id', user.id);
          
        if (error) {
          throw error;
        }
        
        // Transform the data to match Recipe type
        const formattedRecipes: Recipe[] = data.map(recipe => ({
          id: recipe.id,
          title: recipe.title,
          description: recipe.description,
          prepTime: recipe.prep_time,
          image: recipe.image_url,
          image_path: recipe.image_path,
          ingredients: recipe.ingredients,
          instructions: recipe.instructions,
          servings: recipe.servings
        }));
        
        setRecipes(formattedRecipes);
      } catch (error) {
        console.error('Error fetching recipes:', error);
        toast({
          title: "Error",
          description: "Failed to load recipes.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchRecipes();
  }, [user, toast]);
  
  const filteredRecipes = recipes.filter(recipe => 
    recipe.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    recipe.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const handleViewRecipe = (recipeId: string | number) => {
    // Future feature: View recipe details
    console.log(`View recipe: ${recipeId}`);
    // navigate(`/recipes/${recipeId}`);
  };
  
  return (
    <div className="min-h-screen bg-[#F8F5FF]">
      <NavBar />
      <div className="container mx-auto p-4 md:p-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <BookOpen className="h-6 w-6 text-purple-500" />
            <h1 className="text-2xl font-bold">My Recipes</h1>
          </div>
          
          <div className="w-full md:w-auto flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-3">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                type="text"
                placeholder="Search recipes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Button 
              className="bg-purple-600 hover:bg-purple-700"
              onClick={() => navigate('/create-recipe')}
            >
              <Plus className="h-4 w-4 mr-2" />
              Create New Recipe
            </Button>
          </div>
        </div>
        
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-64 rounded-lg bg-gray-200 animate-pulse"></div>
            ))}
          </div>
        ) : recipes.length === 0 ? (
          <Card className="p-8 text-center">
            <div className="flex flex-col items-center space-y-4">
              <FileText className="h-12 w-12 text-gray-400" />
              <h2 className="text-xl font-semibold">No Recipes Yet</h2>
              <p className="text-gray-500 max-w-md mx-auto">
                You haven't created any recipes yet. Get started by creating your first recipe!
              </p>
              <Button 
                className="mt-4 bg-purple-600 hover:bg-purple-700"
                onClick={() => navigate('/create-recipe')}
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Recipe
              </Button>
            </div>
          </Card>
        ) : filteredRecipes.length === 0 ? (
          <Card className="p-8 text-center">
            <div className="flex flex-col items-center space-y-4">
              <Search className="h-12 w-12 text-gray-400" />
              <h2 className="text-xl font-semibold">No Matching Recipes</h2>
              <p className="text-gray-500">
                No recipes match your search query. Try adjusting your search.
              </p>
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRecipes.map((recipe) => (
              <RecipeCard 
                key={recipe.id} 
                recipe={recipe}
                onClick={() => handleViewRecipe(recipe.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Recipes;
