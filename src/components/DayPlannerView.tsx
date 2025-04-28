
import React from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { Coffee, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import PlannerRecipeCard from './PlannerRecipeCard';
import { Recipe } from '@/hooks/useMealPlanner';
import { format } from 'date-fns';

interface DayPlannerViewProps {
  date: Date;
  meals: Recipe[];
  onToggleMealStatus: (index: number) => void;
  onRemoveMeal: (index: number) => void;
  onAddClick: () => void;
}

const DayPlannerView: React.FC<DayPlannerViewProps> = ({
  date,
  meals,
  onToggleMealStatus,
  onRemoveMeal,
  onAddClick
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-medium text-[#4F2D9E] flex items-center">
          <Coffee className="h-5 w-5 mr-2" />
          {format(date, 'EEEE, MMMM d')}
        </h2>
        <Button 
          onClick={onAddClick} 
          className="bg-[#4F2D9E] text-white hover:bg-[#4F2D9E]/90"
          size="sm"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Breakfast
        </Button>
      </div>

      <motion.div
        className="space-y-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <AnimatePresence>
          {meals.length > 0 ? (
            meals.map((meal, index) => (
              <PlannerRecipeCard
                key={meal.id || index}
                meal={meal}
                onToggleStatus={() => onToggleMealStatus(index)}
                onRemove={() => onRemoveMeal(index)}
              />
            ))
          ) : (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-10 bg-white/50 backdrop-blur-sm rounded-lg shadow-sm"
            >
              <Coffee className="h-12 w-12 mx-auto text-gray-300 mb-3" />
              <p className="text-gray-500 mb-4">No breakfast planned for this day</p>
              <Button 
                className="bg-[#4F2D9E] text-white hover:bg-[#4F2D9E]/90"
                size="sm"
                onClick={onAddClick}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Breakfast
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default DayPlannerView;
