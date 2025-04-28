
import React from 'react';
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Coffee, Clock, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Recipe } from '@/hooks/useMealPlanner';

interface PlannerRecipeCardProps {
  meal: Recipe;
  onToggleStatus: () => void;
  onRemove: () => void;
  className?: string;
}

const PlannerRecipeCard: React.FC<PlannerRecipeCardProps> = ({ 
  meal, 
  onToggleStatus, 
  onRemove,
  className 
}) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, height: 0, marginBottom: 0 }}
      transition={{ duration: 0.3 }}
      className={className}
    >
      <Card className={cn(
        "overflow-hidden transition-all duration-200 hover:shadow-md",
        meal.status === 'completed' ? "border-l-4 border-l-green-500" : "border-l-4 border-l-[#4F2D9E]"
      )}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1 flex-1">
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-2 text-gray-500" />
                <p className="text-sm text-gray-500">{meal.time}</p>
              </div>
              <div className="flex items-center gap-3">
                {meal.image && (
                  <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-lg hidden sm:block">
                    <img 
                      src={meal.image} 
                      alt={meal.title} 
                      className="h-full w-full object-cover"
                    />
                  </div>
                )}
                <div>
                  <h3 className="font-medium text-[#4F2D9E] flex items-center">
                    <Coffee className="h-4 w-4 mr-2" />
                    {meal.title}
                  </h3>
                  <p className="text-sm text-gray-600 line-clamp-1">{meal.description}</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={onToggleStatus}
                className={cn(
                  "transition-all duration-300",
                  meal.status === 'completed' 
                    ? "text-green-600 hover:text-green-700 hover:bg-green-50" 
                    : "text-[#4F2D9E] hover:bg-[#4F2D9E]/10"
                )}
              >
                <Check className={cn(
                  "h-4 w-4",
                  meal.status === 'completed' ? "text-green-500" : "text-gray-400"
                )} />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={onRemove}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default PlannerRecipeCard;
