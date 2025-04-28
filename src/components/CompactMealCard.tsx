
import React from 'react';
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Coffee, Check, Clock, ArrowRight } from "lucide-react";
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
        "h-full"
      )}
    >
      <div className={cn("p-4 flex flex-col", "h-full")}>
        <div className="flex items-center justify-between mb-3">
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

        <div className="space-y-2 flex-grow">
          {meals.length > 0 ? (
            <div className="space-y-2">
              {meals.slice(0, isCompactView ? 2 : 3).map((meal, index) => (
                <div 
                  key={index} 
                  className={cn(
                    "flex items-center justify-between py-1.5 px-2.5 rounded-md",
                    "bg-gray-50/80 hover:bg-gray-100 transition-colors",
                    meal.status === 'completed' ? "bg-green-50/80" : ""
                  )}
                >
                  <div className="flex items-center gap-2 min-w-0 max-w-[70%]">
                    <div className={cn(
                      "w-2 h-2 rounded-full flex-shrink-0",
                      meal.status === 'completed' ? 'bg-green-500' : 'bg-[#4F2D9E]'
                    )}/>
                    <p className="truncate text-sm">{meal.title}</p>
                  </div>
                  {meal.time && (
                    <div className="flex items-center text-xs text-gray-500">
                      <Clock className="w-3 h-3 mr-1" />
                      {meal.time}
                    </div>
                  )}
                </div>
              ))}
              
              {meals.length > (isCompactView ? 2 : 3) && (
                <p className="text-xs text-[#4F2D9E] flex items-center mt-1 justify-end">
                  +{meals.length - (isCompactView ? 2 : 3)} more
                  <ArrowRight className="w-3 h-3 ml-1" />
                </p>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-6 text-gray-400">
              <Coffee className={cn("mb-1", "h-5 w-5")} />
              <span className="text-xs">Add breakfast</span>
            </div>
          )}
        </div>
        
        {meals.length > 0 && !isCompactView && (
          <div className="mt-3 pt-2 border-t border-gray-100">
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
