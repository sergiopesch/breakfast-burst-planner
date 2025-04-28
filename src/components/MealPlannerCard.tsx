
import React from 'react';
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Coffee, Check, Plus } from "lucide-react";
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
  
  if (view === 'week' || view === 'month') {
    return (
      <motion.div
        className={cn(
          "bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-sm hover:shadow-md transition-all cursor-pointer",
          allCompleted ? "border-l-4 border-l-green-500" : 
          someCompleted ? "border-l-4 border-l-yellow-500" : 
          hasMeals ? "border-l-4 border-l-[#4F2D9E]" : ""
        )}
        whileHover={{ y: -5 }}
        transition={{ type: "spring", stiffness: 300 }}
        onClick={onClick}
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-[#4F2D9E]">{format(date, 'MMM d')}</span>
          <div className="flex items-center space-x-1">
            {hasMeals && (
              <span className="bg-[#4F2D9E]/10 text-[#4F2D9E] text-xs px-2 py-0.5 rounded-full">
                {recipes.length} {recipes.length === 1 ? 'meal' : 'meals'}
              </span>
            )}
          </div>
        </div>
        <div className="space-y-2">
          {recipes.slice(0, 2).map((meal, index) => (
            <div key={index} className="flex items-center text-sm">
              <div className={`w-2 h-2 rounded-full mr-2 ${meal.status === 'completed' ? 'bg-green-500' : 'bg-[#4F2D9E]'}`}></div>
              <p className="truncate">{meal.title}</p>
            </div>
          ))}
          {recipes.length > 2 && (
            <p className="text-xs text-gray-500">+{recipes.length - 2} more...</p>
          )}
        </div>
      </motion.div>
    );
  }

  return null; // Day view is now handled by DayPlannerView component
};

export default MealPlannerCard;
