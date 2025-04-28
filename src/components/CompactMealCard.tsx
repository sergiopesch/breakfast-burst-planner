
import React from 'react';
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Coffee, Check, Clock } from "lucide-react";
import { Recipe } from '@/hooks/useMealPlanner';
import { format } from 'date-fns';
import { Card } from "@/components/ui/card";

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
    <Card
      onClick={onClick}
      className={cn(
        "relative overflow-hidden cursor-pointer transition-all duration-200",
        "hover:shadow-lg hover:-translate-y-1",
        isSelected ? "ring-2 ring-[#4F2D9E] ring-opacity-60" : "",
        allCompleted ? "border-l-4 border-l-green-500" : 
        someCompleted ? "border-l-4 border-l-yellow-500" : 
        meals.length > 0 ? "border-l-4 border-l-[#4F2D9E]" : ""
      )}
    >
      <div className="p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className={cn(
              "text-sm font-medium",
              isSelected ? "text-[#4F2D9E]" : "text-gray-700"
            )}>
              {format(date, 'EEE, MMM d')}
            </span>
            {meals.length > 0 && (
              <span className="text-xs text-gray-500 mt-0.5">
                {meals.length} breakfast{meals.length !== 1 ? 's' : ''}
              </span>
            )}
          </div>
          {allCompleted && (
            <Badge variant="success" className="h-6">
              <Check className="w-3 h-3 mr-1" />
              Done
            </Badge>
          )}
        </div>

        <div className="space-y-2">
          {meals.map((meal, index) => (
            <div 
              key={index} 
              className={cn(
                "flex items-center justify-between p-2 rounded-md",
                "bg-gray-50 hover:bg-gray-100 transition-colors",
                meal.status === 'completed' ? "bg-green-50" : ""
              )}
            >
              <div className="flex items-center space-x-2 min-w-0">
                <div className={cn(
                  "w-2 h-2 rounded-full flex-shrink-0",
                  meal.status === 'completed' ? 'bg-green-500' : 'bg-[#4F2D9E]'
                )}/>
                <p className="truncate text-sm">{meal.title}</p>
              </div>
              {meal.time && (
                <div className="flex items-center text-xs text-gray-500 ml-2">
                  <Clock className="w-3 h-3 mr-1" />
                  {meal.time}
                </div>
              )}
            </div>
          ))}
          
          {meals.length === 0 && (
            <div className="flex flex-col items-center justify-center py-4 text-gray-400">
              <Coffee className="h-5 w-5 mb-1" />
              <span className="text-xs">Add breakfast</span>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default CompactMealCard;
