
import React from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { Recipe } from '@/hooks/useMealPlanner';
import CompactMealCard from './CompactMealCard';
import { format } from 'date-fns';
import { cn } from "@/lib/utils";

interface CalendarPlannerViewProps {
  dates: Date[];
  selectedDate: Date;
  plannedMeals: Record<string, Recipe[]>;
  onDateSelect: (date: Date) => void;
  view: 'week' | 'month';
}

const CalendarPlannerView: React.FC<CalendarPlannerViewProps> = ({
  dates,
  selectedDate,
  plannedMeals,
  onDateSelect,
  view
}) => {
  const selectedDateStr = selectedDate.toISOString().split('T')[0];

  const getMealsForDate = (date: Date): Recipe[] => {
    const dateKey = date.toISOString().split('T')[0];
    return plannedMeals[dateKey] || [];
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-medium text-[#4F2D9E] flex items-center">
          {view === 'week' 
            ? `Week of ${format(dates[0], 'MMMM d')}`
            : `${format(dates[0], 'MMMM yyyy')}`
          }
        </h2>
      </div>
      
      <div className={cn(
        "grid gap-4",
        view === 'week' 
          ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7" 
          : "grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7"
      )}>
        <AnimatePresence>
          {dates.map((date) => {
            const dateKey = date.toISOString().split('T')[0];
            const isSelected = dateKey === selectedDateStr;
            const meals = getMealsForDate(date);
            
            return (
              <motion.div
                key={dateKey}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                layout
              >
                <CompactMealCard
                  date={date}
                  meals={meals}
                  onClick={() => onDateSelect(date)}
                  isSelected={isSelected}
                />
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default CalendarPlannerView;
