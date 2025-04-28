
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
  view?: 'week' | 'month';
}

const CompactMealCard: React.FC<CompactMealCardProps> = ({ 
  date, 
  meals, 
  onClick,
  isSelected = false,
  view = 'week'
}) => {
  const completedCount = meals.filter(m => m.status === 'completed').length;
  const allCompleted = completedCount > 0 && completedCount === meals.length;
  const someCompleted = completedCount > 0 && completedCount < meals.length;
  const isCompactView = view === 'month';
  
  return (
    <Card
      onClick={onClick}
      className={cn(
        "relative overflow-hidden cursor-pointer transition-all duration-200",
        "hover:shadow-lg hover:-translate-y-1",
        isSelected ? "ring-2 ring-[#4F2D9E] ring-opacity-60" : "",
        allCompleted ? "border-l-4 border-l-green-500" : 
        someCompleted ? "border-l-4 border-l-yellow-500" : 
        meals.length > 0 ? "border-l-4 border-l-[#4F2D9E]" : "",
        "h-full"
      )}
    >
      <div className={cn(
        "p-3 flex flex-col",
        "h-full"
      )}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex flex-col">
            <span className={cn(
              "text-sm font-medium",
              isSelected ? "text-[#4F2D9E]" : "text-gray-700"
            )}>
              {isCompactView ? format(date, 'EEE d') : format(date, 'EEE, MMM d')}
            </span>
            {meals.length > 0 && (
              <span className="text-xs text-gray-500 mt-0.5">
                {meals.length} breakfast{meals.length !== 1 ? 's' : ''}
              </span>
            )}
          </div>
          {allCompleted && (
            <Badge variant="outline" className="h-5 px-1 border-green-500 text-green-600 bg-green-50">
              <Check className="w-3 h-3 mr-1" />
              <span className={isCompactView ? "hidden" : "inline"}>Done</span>
            </Badge>
          )}
        </div>

        <div className="space-y-2 flex-grow overflow-hidden">
          {meals.length > 0 ? (
            <>
              {isCompactView ? (
                <div className="flex items-center">
                  <div className="w-2 h-2 rounded-full bg-[#4F2D9E] mr-2"></div>
                  <p className="truncate text-sm">
                    {meals.length === 1 
                      ? meals[0].title 
                      : `${meals[0].title}${meals.length > 1 ? ` +${meals.length-1}` : ''}`}
                  </p>
                </div>
              ) : (
                meals.slice(0, 2).map((meal, index) => (
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
                ))
              )}
              
              {!isCompactView && meals.length > 2 && (
                <p className="text-xs text-[#4F2D9E] flex items-center justify-end mt-1">
                  +{meals.length - 2} more
                  <ArrowRight className="w-3 h-3 ml-1" />
                </p>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-3 text-gray-400">
              <Coffee className={cn("mb-1", isCompactView ? "h-4 w-4" : "h-5 w-5")} />
              <span className="text-xs">Add breakfast</span>
            </div>
          )}
        </div>
        
        {!isCompactView && meals.length > 0 && (
          <div className="mt-2 pt-2 border-t border-gray-100">
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
