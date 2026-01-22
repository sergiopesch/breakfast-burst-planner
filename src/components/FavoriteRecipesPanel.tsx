
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, Coffee, Plus, Search } from "lucide-react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Recipe } from '@/hooks/useMealPlanner';
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { format } from 'date-fns';
import ImageLoader from './ImageLoader';

interface FavoriteRecipesPanelProps {
  likedRecipes: Recipe[];
  selectedDate?: Date;
  onAddToPlanner?: (recipe: Recipe) => void;
}

const FavoriteRecipesPanel: React.FC<FavoriteRecipesPanelProps> = ({
  likedRecipes,
  selectedDate,
  onAddToPlanner
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredRecipes, setFilteredRecipes] = useState<Recipe[]>(likedRecipes);
  const [openRecipeId, setOpenRecipeId] = useState<string | number | null>(null);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredRecipes(likedRecipes);
    } else {
      const filtered = likedRecipes.filter(recipe => 
        recipe.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        (recipe.description && recipe.description.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      setFilteredRecipes(filtered);
    }
  }, [searchTerm, likedRecipes]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  if (likedRecipes.length === 0) {
    return (
      <div className="rounded-lg bg-card/80 backdrop-blur-sm shadow-sm border border-border/40 p-6 text-center">
        <Heart className="h-12 w-12 mx-auto text-muted-foreground/40 mb-3" />
        <p className="text-muted-foreground">No favorite recipes yet</p>
        <p className="text-sm text-muted-foreground/70 mt-2">Like some recipes to add them here</p>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }} 
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          type="text"
          placeholder="Search favorite recipes..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="pl-10 bg-card/80 backdrop-blur-sm border-border/50"
          aria-label="Search favorite recipes"
        />
      </div>
      
      <div className="grid grid-cols-1 gap-3">
        <AnimatePresence>
          {filteredRecipes.map(recipe => (
            <motion.div 
              key={recipe.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <Card className={cn(
                "overflow-hidden transition-all duration-200 hover:shadow-md",
                "border-l-4 border-l-primary"
              )}>
                <CardContent className="p-4 my-0 px-0 mx-px py-[11px]">
                  <div className="flex items-center gap-3 px-0 mx-[16px] my-0 py-0">
                    <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg">
                      <ImageLoader
                        src={recipe.image}
                        alt={recipe.title}
                        className="h-full w-full object-cover"
                        fallbackClassName="h-full w-full flex items-center justify-center bg-secondary"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-primary">
                        {recipe.title}
                      </h3>
                    </div>
                    <div className="flex flex-col gap-2">
                      <Dialog open={openRecipeId === recipe.id} onOpenChange={(open) => setOpenRecipeId(open ? recipe.id : null)}>
                        <DialogContent className="sm:max-w-[500px]">
                          <DialogTitle className="text-xl font-semibold text-primary flex items-center">
                            <Coffee className="h-5 w-5 mr-2" />
                            {recipe.title}
                          </DialogTitle>
                          <DialogDescription>
                            {recipe.description}
                          </DialogDescription>

                          <div className="space-y-4 p-4">
                            <div className="flex items-start gap-4">
                              <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg">
                                <ImageLoader
                                  src={recipe.image}
                                  alt={recipe.title}
                                  className="h-full w-full object-cover"
                                  fallbackClassName="h-full w-full flex items-center justify-center bg-secondary"
                                />
                              </div>
                              <div>
                                {recipe.prepTime && (
                                  <p className="text-sm text-muted-foreground flex items-center mt-1">
                                    <Coffee className="h-4 w-4 mr-1" aria-hidden="true" />
                                    Prep time: {recipe.prepTime}
                                  </p>
                                )}
                              </div>
                            </div>
                            
                            <div className="space-y-2">
                              <h3 className="font-medium text-primary">Ingredients:</h3>
                              <ul className="list-inside list-disc space-y-1 text-foreground/70">
                                {recipe.ingredients?.map((ingredient, index) => (
                                  <li key={index}>{ingredient}</li>
                                ))}
                              </ul>
                            </div>

                            <div className="space-y-2">
                              <h3 className="font-medium text-primary">Instructions:</h3>
                              <ol className="list-inside list-decimal space-y-2 text-foreground/70">
                                {recipe.instructions?.map((instruction, index) => (
                                  <li key={index}>{instruction}</li>
                                ))}
                              </ol>
                            </div>
                            
                            {selectedDate && onAddToPlanner && (
                              <div className="flex justify-end mt-4">
                                <Button 
                                  onClick={() => {
                                    onAddToPlanner(recipe);
                                    setOpenRecipeId(null);
                                  }} 
                                  className="bg-primary text-white hover:bg-primary/90"
                                >
                                  <Plus className="h-4 w-4 mr-2" />
                                  Add to {format(selectedDate, 'MMM d')}
                                </Button>
                              </div>
                            )}
                          </div>
                        </DialogContent>
                      </Dialog>
                      
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => setOpenRecipeId(recipe.id)} 
                        className="text-primary border-primary hover:bg-primary/10 mx-px my-[6px] py-[2px] px-[4px]"
                      >
                        View
                      </Button>
                      
                      {selectedDate && onAddToPlanner && (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => onAddToPlanner(recipe)} 
                          className="text-primary border-primary hover:bg-primary/10 mx-px my-[6px] py-[2px] px-[4px]"
                        >
                          <Plus className="h-4 w-4 mr-1" />
                          Add
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default FavoriteRecipesPanel;
