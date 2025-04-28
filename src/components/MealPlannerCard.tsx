
import React from 'react';
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Coffee, Check, Plus, Image as ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Recipe } from '@/hooks/useMealPlanner';
import { format } from 'date-fns';

interface MealPlannerCardProps {
  date: Date;
  view?: 'day' | 'week' | 'month';
  onRecipeAdded?: () => void;
  recipes?: Recipe[];
  onClick?: () => void;
}

const MealPlannerCard: React.FC<MealPlannerCardProps> = ({
  date,
  view = 'day',
  onRecipeAdded,
  recipes = [],
  onClick
}) => {
  const completedCount = recipes.filter(r => r.status === 'completed').length;
  const hasMeals = recipes.length > 0;
  const allCompleted = completedCount === recipes.length && hasMeals;
  const someCompleted = completedCount > 0 && completedCount < recipes.length;
  const firstRecipeWithImage = recipes.find(r => r.image);
  
  if (view === 'week' || view === 'month') {
    return (
      <motion.div
        className={cn(
          "bg-white/90 backdrop-blur-sm rounded-lg shadow-sm hover:shadow-md transition-all cursor-pointer overflow-hidden",
          "flex flex-col",
          allCompleted ? "border-l-4 border-l-green-500" : 
          someCompleted ? "border-l-4 border-l-yellow-500" : 
          hasMeals ? "border-l-4 border-l-[#4F2D9E]" : "",
          "h-full"
        )}
        whileHover={{ y: -5 }}
        transition={{ type: "spring", stiffness: 300 }}
        onClick={onClick}
      >
        <div className="p-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm font-medium text-[#4F2D9E]">{format(date, 'MMM d')}</span>
            <div className="flex items-center space-x-1">
              {hasMeals && (
                <span className="bg-[#4F2D9E]/10 text-[#4F2D9E] text-xs px-2 py-0.5 rounded-full">
                  {recipes.length} {recipes.length === 1 ? 'meal' : 'meals'}
                </span>
              )}
            </div>
          </div>
          
          {view === 'week' && (
            <div className="text-xs text-gray-500 mb-1">
              {format(date, 'EEEE')}
            </div>
          )}
        </div>

        {hasMeals && firstRecipeWithImage ? (
          <div className="relative flex-grow">
            <div 
              className="w-full h-full aspect-[4/3] bg-cover bg-center"
              style={{ backgroundImage: `url(${firstRecipeWithImage.image})` }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-2">
                <span className="text-white text-xs font-medium truncate">{firstRecipeWithImage.title}</span>
              </div>
            </div>
            {recipes.length > 1 && (
              <div className="absolute top-1 right-1 bg-black/70 text-white text-xs rounded-full px-1.5 py-0.5">
                +{recipes.length - 1}
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center justify-center p-2 flex-grow">
            <div className="text-center text-gray-400 flex flex-col items-center py-2">
              {!hasMeals ? (
                <>
                  <Coffee className="h-5 w-5 mb-1" />
                  <span className="text-xs">No meals</span>
                </>
              ) : (
                <>
                  <ImageIcon className="h-5 w-5 mb-1" />
                  <span className="text-xs">No image</span>
                </>
              )}
            </div>
          </div>
        )}
      </motion.div>
    );
  }

  return null; // Day view is now handled by DayPlannerView component
};

export default MealPlannerCard;
