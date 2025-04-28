
import React from 'react';
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Coffee, Check } from "lucide-react";
import { Recipe } from '@/hooks/useMealPlanner';
import { format } from 'date-fns';

interface CompactMealCardProps {
  date: Date;
  meals: Recipe[];
  onClick: () => void;
  isSelected?: boolean;
}

const CompactMealCard: React.FC<CompactMealCardProps> = ({ 
  date, 
  meals, 
  onClick,
  isSelected = false
}) => {
  const completedCount = meals.filter(m => m.status === 'completed').length;
  const allCompleted = completedCount > 0 && completedCount === meals.length;
  const someCompleted = completedCount > 0 && completedCount < meals.length;
  
  return (
    <motion.div
      whileHover={{ y: -5 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={cn(
        "bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-sm cursor-pointer transition-all",
        "hover:shadow-md border border-transparent",
        isSelected ? "ring-2 ring-[#4F2D9E] ring-opacity-60" : "",
        allCompleted ? "border-l-4 border-l-green-500" : 
        someCompleted ? "border-l-4 border-l-yellow-500" : 
        meals.length > 0 ? "border-l-4 border-l-[#4F2D9E]" : ""
      )}
    >
      <div className="flex items-center justify-between mb-2">
        <span className={cn(
          "text-sm font-medium",
          isSelected ? "text-[#4F2D9E]" : "text-gray-700"
        )}>
          {format(date, 'MMM d')}
        </span>
        <div className="flex items-center space-x-1">
          {meals.length > 0 && (
            <Badge variant={isSelected ? "default" : "outline"} className={cn(
              "text-xs",
              isSelected ? "bg-[#4F2D9E]" : "bg-[#4F2D9E]/5 text-[#4F2D9E]"
            )}>
              {meals.length} meal{meals.length !== 1 ? 's' : ''}
            </Badge>
          )}
        </div>
      </div>
      <div className="space-y-2">
        {meals.slice(0, 2).map((meal, index) => (
          <div key={index} className="flex items-center text-sm">
            <div className={cn(
              "w-2 h-2 rounded-full mr-2",
              meal.status === 'completed' ? 'bg-green-500' : 'bg-[#4F2D9E]'
            )}></div>
            <p className="truncate">{meal.title}</p>
          </div>
        ))}
        {meals.length > 2 && (
          <p className="text-xs text-gray-500">+{meals.length - 2} more...</p>
        )}
        {meals.length === 0 && (
          <div className="flex items-center justify-center py-3">
            <Coffee className="h-4 w-4 text-gray-300 mr-1" />
            <span className="text-xs text-gray-400">Add breakfast</span>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default CompactMealCard;
