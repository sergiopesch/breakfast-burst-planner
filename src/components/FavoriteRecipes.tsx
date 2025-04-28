
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, Coffee, Plus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

interface Recipe {
  id: number;
  title: string;
  description: string;
  image: string;
  prepTime: string;
  ingredients: string[];
  instructions: string[];
}

interface FavoriteRecipesProps {
  onAddToPlanner?: (recipe: Recipe, date: Date) => void;
  selectedDate?: Date;
}

const FavoriteRecipes: React.FC<FavoriteRecipesProps> = ({ onAddToPlanner, selectedDate }) => {
  const [favorites, setFavorites] = useState<Recipe[]>([]);

  useEffect(() => {
    const likedRecipes = JSON.parse(localStorage.getItem('likedRecipes') || '[]');
    setFavorites(likedRecipes);
  }, []);

  const handleRemoveFavorite = (id: number) => {
    const updatedFavorites = favorites.filter(recipe => recipe.id !== id);
    setFavorites(updatedFavorites);
    localStorage.setItem('likedRecipes', JSON.stringify(updatedFavorites));
  };

  if (favorites.length === 0) {
    return (
      <div className="text-center py-8">
        <Heart className="h-12 w-12 mx-auto text-gray-300 mb-3" />
        <p className="text-gray-500">No favorite recipes yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <AnimatePresence>
        {favorites.map((recipe) => (
          <motion.div
            key={recipe.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="neumorphic overflow-hidden transition-all duration-300 border-l-4 border-l-[#4F2D9E]">
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg">
                    <img 
                      src={recipe.image} 
                      alt={recipe.title} 
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex-grow">
                    <h3 className="font-medium text-[#4F2D9E] flex items-center">
                      <Coffee className="h-4 w-4 mr-2" />
                      {recipe.title}
                    </h3>
                    <p className="text-sm text-gray-600">{recipe.description}</p>
                  </div>
                  <div className="flex flex-col gap-2">
                    {onAddToPlanner && selectedDate && (
                      <Button 
                        variant="ghost"
                        size="sm"
                        onClick={() => onAddToPlanner(recipe, selectedDate)}
                        className="text-[#4F2D9E] hover:bg-[#4F2D9E]/10"
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Add
                      </Button>
                    )}
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-[#4F2D9E] border-[#4F2D9E] hover:bg-[#4F2D9E]/10"
                        >
                          View
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[425px]">
                        <motion.div 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3 }}
                          className="space-y-4 p-4"
                        >
                          <h2 className="text-xl font-semibold text-[#4F2D9E] flex items-center">
                            <Coffee className="h-5 w-5 mr-2" />
                            {recipe.title}
                          </h2>
                          <div className="space-y-2">
                            <h3 className="font-medium text-[#4F2D9E]">Ingredients:</h3>
                            <ul className="list-inside list-disc space-y-1 text-gray-600">
                              {recipe.ingredients.map((ingredient, index) => (
                                <motion.li 
                                  key={index} 
                                  initial={{ opacity: 0, x: -10 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: index * 0.05 }}
                                >
                                  {ingredient}
                                </motion.li>
                              ))}
                            </ul>
                          </div>
                          <div className="space-y-2">
                            <h3 className="font-medium text-[#4F2D9E]">Instructions:</h3>
                            <ol className="list-inside list-decimal space-y-2 text-gray-600">
                              {recipe.instructions.map((instruction, index) => (
                                <motion.li 
                                  key={index}
                                  initial={{ opacity: 0, x: -10 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: 0.2 + index * 0.05 }}
                                >
                                  {instruction}
                                </motion.li>
                              ))}
                            </ol>
                          </div>
                        </motion.div>
                      </DialogContent>
                    </Dialog>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveFavorite(recipe.id)}
                      className="text-red-500 hover:bg-red-50"
                    >
                      <Heart className="h-4 w-4 fill-red-500 mr-1" />
                      Unlike
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default FavoriteRecipes;
