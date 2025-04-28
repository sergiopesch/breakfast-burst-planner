
import React from 'react';
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Coffee, Check, Clock, ArrowRight, Image as ImageIcon } from "lucide-react";
import { Recipe } from '@/hooks/useMealPlanner';
import { format } from 'date-fns';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface CompactMealCardProps {
  date: Date;
  meals: Recipe[];
  onClick: () => void;
  isSelected?: boolean;
  isToday?: boolean;
  view?: 'week' | 'month';
}

const CompactMealCard: React.FC<CompactMealCardProps> = ({ 
  date, 
  meals, 
  onClick,
  isSelected = false,
  isToday = false,
  view = 'week'
}) => {
  const completedCount = meals.filter(m => m.status === 'completed').length;
  const allCompleted = completedCount > 0 && completedCount === meals.length;
  const someCompleted = completedCount > 0 && completedCount < meals.length;
  const isCompactView = view === 'month';
  const firstRecipeWithImage = meals.find(m => m.image);
  
  const dayFormat = 'd';
  const weekdayFormat = isCompactView ? 'EEE' : 'EEEE';
  const monthFormat = 'MMM';
  
  return (
    <Card
      onClick={onClick}
      className={cn(
        "relative overflow-hidden cursor-pointer transition-all duration-200",
        "hover:shadow-md hover:-translate-y-1",
        isSelected ? "ring-2 ring-[#4F2D9E] ring-opacity-70 shadow-md" : "",
        isToday ? "bg-purple-50/50" : "",
        allCompleted ? "border-l-4 border-l-green-500" : 
        someCompleted ? "border-l-4 border-l-yellow-500" : 
        meals.length > 0 ? "border-l-4 border-l-[#4F2D9E]" : "",
        "h-full flex flex-col"
      )}
    >
      <div className={cn("p-4", firstRecipeWithImage ? "pb-2" : "")}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex flex-col">
            <div className="flex items-baseline gap-1.5">
              <span className={cn(
                "font-medium text-xl",
                isToday ? "text-[#4F2D9E]" : "text-gray-800"
              )}>
                {format(date, dayFormat)}
              </span>
              <span className={cn(
                "text-sm",
                isToday ? "text-[#4F2D9E]/80" : "text-gray-600"
              )}>
                {format(date, monthFormat)}
              </span>
            </div>
            <span className={cn(
              "text-xs font-medium mt-0.5",
              isToday ? "text-[#4F2D9E]/80" : "text-gray-500"
            )}>
              {format(date, weekdayFormat)}
            </span>
          </div>
          
          {meals.length > 0 && (
            <Badge 
              variant="outline" 
              className={cn(
                "h-5 px-2 text-xs font-medium rounded-full",
                allCompleted ? "border-green-500 text-green-600 bg-green-50" :
                "border-[#4F2D9E] text-[#4F2D9E] bg-[#4F2D9E]/5"
              )}
            >
              {allCompleted && <Check className="w-3 h-3 mr-0.5" />}
              {meals.length} {meals.length === 1 ? 'meal' : 'meals'}
            </Badge>
          )}
        </div>

        {meals.length > 0 && firstRecipeWithImage ? (
          <div className="relative rounded-md overflow-hidden mt-2 mb-2">
            <div 
              className="w-full aspect-video bg-cover bg-center"
              style={{ backgroundImage: `url(${firstRecipeWithImage.image})` }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent/30 flex items-end">
                <div className="p-2 w-full">
                  <p className="text-white text-sm font-medium truncate">{firstRecipeWithImage.title}</p>
                  <div className="flex items-center text-xs text-white/90 mt-1">
                    <Clock className="w-3 h-3 mr-1" />
                    {firstRecipeWithImage.time}
                  </div>
                </div>
              </div>
            </div>
            {meals.length > 1 && (
              <div className="absolute top-2 right-2 bg-black/70 text-white text-xs font-medium rounded-full px-2 py-0.5">
                +{meals.length - 1}
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-6 text-gray-400 flex-grow">
            <Coffee className={cn("mb-1", "h-5 w-5")} />
            <span className="text-xs">{meals.length === 0 ? "Add breakfast" : "No image available"}</span>
          </div>
        )}
        
        {meals.length > 0 && !isCompactView && (
          <div className="mt-auto pt-2 border-t border-gray-100">
            <Button 
              variant="ghost" 
              size="sm" 
              className="w-full justify-center text-xs text-[#4F2D9E] hover:text-[#4F2D9E] hover:bg-[#4F2D9E]/10"
              onClick={(e) => {
                e.stopPropagation();
                onClick();
              }}
            >
              View Details
              <ArrowRight className="w-3 h-3 ml-1" />
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
};

export default CompactMealCard;
