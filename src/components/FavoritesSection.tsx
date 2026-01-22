
import React from 'react';
import { Button } from "@/components/ui/button";
import { Heart, ChevronDown, ChevronUp } from "lucide-react";
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
    <div className="space-y-4">
      <button
        onClick={() => setShowFavorites(!showFavorites)}
        className="w-full flex items-center justify-between py-2 group"
        aria-expanded={showFavorites}
        aria-controls="favorites-panel"
      >
        <div className="flex items-center gap-2">
          <Heart className="h-4 w-4 text-muted-foreground" />
          <span className="text-xs font-medium tracking-widest uppercase text-muted-foreground">
            Favorites
          </span>
          {likedRecipes.length > 0 && (
            <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-secondary text-secondary-foreground">
              {likedRecipes.length}
            </span>
          )}
        </div>
        {showFavorites ? (
          <ChevronUp className="h-4 w-4 text-muted-foreground transition-transform group-hover:text-foreground" />
        ) : (
          <ChevronDown className="h-4 w-4 text-muted-foreground transition-transform group-hover:text-foreground" />
        )}
      </button>

      <AnimatePresence>
        {showFavorites && (
          <motion.div
            id="favorites-panel"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
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
    </div>
  );
};

export default FavoritesSection;
