
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import FavoriteRecipesPanel from '@/components/FavoriteRecipesPanel';
import { Recipe } from '@/hooks/useMealPlanner';

interface FavoritesSectionProps {
  showFavorites: boolean;
  setShowFavorites: (show: boolean) => void;
  likedRecipes: Recipe[];
  selectedDate: Date;
  onAddToPlanner: (recipe: Recipe) => void;
}

const FavoritesSection: React.FC<FavoritesSectionProps> = ({
  showFavorites,
  setShowFavorites,
  likedRecipes,
  selectedDate,
  onAddToPlanner
}) => {
  return (
    <Card className="overflow-hidden shadow-sm">
      <CardContent className="p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-medium text-[#4F2D9E] flex items-center">
            <Heart className="h-5 w-5 mr-2" />
            Favorite Recipes
          </h2>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFavorites(!showFavorites)}
            className="text-[#4F2D9E] border-[#4F2D9E] hover:bg-[#4F2D9E]/10"
          >
            {showFavorites ? "Hide" : "Show"}
          </Button>
        </div>
        
        <AnimatePresence>
          {showFavorites && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <FavoriteRecipesPanel 
                likedRecipes={likedRecipes}
                selectedDate={selectedDate}
                onAddToPlanner={onAddToPlanner}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
};

export default FavoritesSection;
