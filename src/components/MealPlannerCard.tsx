
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { List, Check, Coffee, Clock, CalendarDays, Plus, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { BREAKFAST_RECIPES } from './RecipeCard';

interface Recipe {
  id: number;
  title: string;
  description: string;
  prepTime?: string;
  image?: string;
  ingredients?: string[];
  instructions?: string[];
  time?: string;
  status?: 'planned' | 'completed';
}

interface MealPlannerCardProps {
  date: Date;
  view?: 'day' | 'week' | 'month';
  onRecipeAdded?: () => void;
}

const MealPlannerCard: React.FC<MealPlannerCardProps> = ({ date, view = 'day', onRecipeAdded }) => {
  const dateKey = date.toISOString().split('T')[0];
  
  const [meals, setMeals] = useState<Recipe[]>([]);

  useEffect(() => {
    // Load saved meals for this date from localStorage
    const savedMeals = JSON.parse(localStorage.getItem('plannedMeals') || '{}');
    if (savedMeals[dateKey]) {
      setMeals(savedMeals[dateKey]);
    } else {
      // Generate consistent meals for each day based on the date if nothing saved
      const dayOfWeek = date.getDay();
      
      const breakfastOptions = [
        {
          id: 101,
          time: '7:30 AM',
          title: 'Quick Banana Oatmeal',
          status: 'planned',
          description: 'Healthy oatmeal with fresh banana slices'
        },
        {
          id: 102,
          time: '8:00 AM',
          title: 'Avocado Toast',
          status: 'completed',
          description: 'Whole grain toast with mashed avocado'
        },
        {
          id: 103,
          time: '7:00 AM',
          title: 'Berry Yogurt Parfait',
          status: 'planned',
          description: 'Greek yogurt with mixed berries and granola'
        },
        {
          id: 104,
          time: '8:15 AM',
          title: 'Scrambled Eggs & Toast',
          status: 'planned',
          description: 'Fluffy scrambled eggs with whole grain toast'
        },
        {
          id: 105,
          time: '7:45 AM',
          title: 'Protein Smoothie Bowl',
          status: 'planned',
          description: 'Blended fruits with protein powder and toppings'
        }
      ];

      // Use the day of week to select 1-2 meals
      const numberOfMeals = (dayOfWeek % 2 === 0) ? 2 : 1;
      const selectedIndices = [(dayOfWeek + 1) % breakfastOptions.length];
      
      if (numberOfMeals === 2) {
        selectedIndices.push((dayOfWeek + 3) % breakfastOptions.length);
      }

      const generatedMeals = selectedIndices.map(index => ({
        ...breakfastOptions[index],
        // Make today's meals more likely to be completed
        status: isToday(date) && Math.random() > 0.5 ? 'completed' : 'planned'
      }));
      
      setMeals(generatedMeals);
    }
  }, [dateKey, date]);

  // Save meals whenever they change
  useEffect(() => {
    if (meals.length > 0) {
      const savedMeals = JSON.parse(localStorage.getItem('plannedMeals') || '{}');
      savedMeals[dateKey] = meals;
      localStorage.setItem('plannedMeals', JSON.stringify(savedMeals));
    }
  }, [meals, dateKey]);

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

  const addRecipe = (recipe: Recipe) => {
    const newMeal = {
      ...recipe,
      id: Date.now(), // Ensure unique id
      time: `${new Date().getHours()}:${String(new Date().getMinutes()).padStart(2, '0')} AM`,
      status: 'planned'
    };
    
    setMeals(currentMeals => [...currentMeals, newMeal]);
    if (onRecipeAdded) onRecipeAdded();
  };

  const removeMeal = (index: number) => {
    setMeals(currentMeals => currentMeals.filter((_, i) => i !== index));
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

  if (view === 'week' || view === 'month') {
    return (
      <motion.div
        className={cn(
          "bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-sm hover:shadow-md transition-all cursor-pointer",
          meals.some(m => m.status === 'completed') ? "border-l-4 border-l-green-500" : "border-l-4 border-l-[#4F2D9E]"
        )}
        whileHover={{ y: -5 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-[#4F2D9E]">{formatDate(date)}</span>
          <div className="flex items-center space-x-1">
            {meals.length > 0 && (
              <span className="bg-[#4F2D9E]/10 text-[#4F2D9E] text-xs px-2 py-0.5 rounded-full">
                {meals.length} breakfast{meals.length !== 1 ? 's' : ''}
              </span>
            )}
          </div>
        </div>
        <div className="space-y-2">
          {meals.slice(0, 2).map((meal, index) => (
            <div key={index} className="flex items-center text-sm">
              <div className={`w-2 h-2 rounded-full mr-2 ${meal.status === 'completed' ? 'bg-green-500' : 'bg-[#4F2D9E]'}`}></div>
              <p className="truncate">{meal.title}</p>
            </div>
          ))}
          {meals.length > 2 && (
            <p className="text-xs text-gray-500">+{meals.length - 2} more...</p>
          )}
        </div>
      </motion.div>
    );
  }

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
        <AnimatePresence>
          {meals.length > 0 ? (
            meals.map((meal, index) => (
              <motion.div 
                key={meal.id || index} 
                variants={item} 
                exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                layout
              >
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
                          {meal.title}
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
                        <Button
                          variant="ghost"
                          onClick={() => removeMeal(index)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
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
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default MealPlannerCard;
