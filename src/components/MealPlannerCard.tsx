
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { List, Check, Coffee, Clock, CalendarDays } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface MealPlannerCardProps {
  date: Date;
}

const MealPlannerCard: React.FC<MealPlannerCardProps> = ({ date }) => {
  // Generate consistent meals for each day based on the date
  const dateKey = date.toISOString().split('T')[0];
  const dayOfWeek = date.getDay();
  
  const breakfastOptions = [
    {
      time: '7:30 AM',
      recipe: 'Quick Banana Oatmeal',
      status: 'planned',
      description: 'Healthy oatmeal with fresh banana slices'
    },
    {
      time: '8:00 AM',
      recipe: 'Avocado Toast',
      status: 'completed',
      description: 'Whole grain toast with mashed avocado'
    },
    {
      time: '7:00 AM',
      recipe: 'Berry Yogurt Parfait',
      status: 'planned',
      description: 'Greek yogurt with mixed berries and granola'
    },
    {
      time: '8:15 AM',
      recipe: 'Scrambled Eggs & Toast',
      status: 'planned',
      description: 'Fluffy scrambled eggs with whole grain toast'
    },
    {
      time: '7:45 AM',
      recipe: 'Protein Smoothie Bowl',
      status: 'planned',
      description: 'Blended fruits with protein powder and toppings'
    }
  ];

  // Deterministically select meals for each day based on the date
  const [meals, setMeals] = useState(() => {
    // Use the day of week to select 1-2 meals
    const numberOfMeals = (dayOfWeek % 2 === 0) ? 2 : 1;
    const selectedIndices = [(dayOfWeek + 1) % breakfastOptions.length];
    
    if (numberOfMeals === 2) {
      selectedIndices.push((dayOfWeek + 3) % breakfastOptions.length);
    }

    return selectedIndices.map(index => ({
      ...breakfastOptions[index],
      // Make today's meals more likely to be completed
      status: isToday(date) && Math.random() > 0.5 ? 'completed' : 'planned'
    }));
  });

  function isToday(someDate: Date) {
    const today = new Date();
    return someDate.getDate() === today.getDate() &&
      someDate.getMonth() === today.getMonth() &&
      someDate.getFullYear() === today.getFullYear();
  }

  const toggleStatus = (index: number) => {
    setMeals(currentMeals => 
      currentMeals.map((meal, i) => 
        i === index 
          ? { ...meal, status: meal.status === 'completed' ? 'planned' : 'completed' } 
          : meal
      )
    );
  };

  const list = {
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1,
      },
    },
    hidden: {
      opacity: 0,
      transition: {
        when: "afterChildren",
      },
    },
  };

  const item = {
    visible: { opacity: 1, y: 0 },
    hidden: { opacity: 0, y: 20 },
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <div className="space-y-4">
      <div className="bg-white/90 backdrop-blur-sm rounded-lg p-3 mb-3 inline-flex items-center shadow-sm">
        <CalendarDays className="h-4 w-4 mr-2 text-[#4F2D9E]" />
        <span className="text-sm font-medium text-[#4F2D9E]">{formatDate(date)}</span>
      </div>

      <motion.div
        initial="hidden"
        animate="visible"
        variants={list}
        className="space-y-4"
      >
        {meals.length > 0 ? (
          meals.map((meal, index) => (
            <motion.div key={index} variants={item}>
              <Card className={cn(
                "neumorphic overflow-hidden transition-all duration-300",
                meal.status === 'completed' ? "border-l-4 border-l-green-500" : "border-l-4 border-l-[#4F2D9E]"
              )}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-2 text-gray-500" />
                        <p className="text-sm text-gray-500">{meal.time}</p>
                      </div>
                      <h3 className="font-medium text-[#4F2D9E] flex items-center">
                        <Coffee className="h-4 w-4 mr-2" />
                        {meal.recipe}
                      </h3>
                      <p className="text-sm text-gray-600">{meal.description}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="ghost" 
                        onClick={() => toggleStatus(index)}
                        className={cn(
                          "transition-all duration-300",
                          meal.status === 'completed' 
                            ? "text-green-600 hover:text-green-700 hover:bg-green-50" 
                            : "text-[#4F2D9E] hover:bg-[#4F2D9E]/10"
                        )}
                      >
                        {meal.status === 'completed' ? (
                          <Check className="h-4 w-4" />
                        ) : (
                          <List className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))
        ) : (
          <motion.div variants={item} className="text-center py-8">
            <Coffee className="h-12 w-12 mx-auto text-gray-300 mb-3" />
            <p className="text-gray-500">No breakfast planned for this day</p>
            <Button 
              className="mt-4 bg-[#4F2D9E] text-white hover:bg-[#4F2D9E]/90"
              size="sm"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Breakfast
            </Button>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default MealPlannerCard;
