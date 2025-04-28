
import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import { useMealPlanner, Recipe } from '@/hooks/useMealPlanner';
import { getViewDates } from '@/utils/calendarUtils';
import DayPlannerView from '@/components/DayPlannerView';
import CalendarPlannerView from '@/components/CalendarPlannerView';
import PlannerLayout from '@/components/PlannerLayout';
import PlannerHeader from '@/components/PlannerHeader';
import CalendarView from '@/components/CalendarView';
import FavoritesSection from '@/components/FavoritesSection';
import { generateRecipe } from '@/utils/recipeGenerator';

type ViewType = 'day' | 'week' | 'month';

const Planner = () => {
  const [date, setDate] = useState<Date>(new Date());
  const [view, setView] = useState<ViewType>('day');
  const [showFavorites, setShowFavorites] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const { toast } = useToast();

  // Get data from our custom hook
  const { 
    plannedMeals, 
    likedRecipes, 
    isLoading, 
    addRecipeToPlanner,
    toggleMealStatus,
    removeMeal
  } = useMealPlanner(refreshKey);

  const viewDates = getViewDates(view, date);

  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      setDate(selectedDate);
      if (view !== 'day') {
        setView('day');
      }
    }
  };

  const handleViewChange = (newView: ViewType) => {
    setView(newView);
  };

  const getMealsForDate = (date: Date): Recipe[] => {
    const dateKey = date.toISOString().split('T')[0];
    return plannedMeals[dateKey] || [];
  };

  const handleAddToPlanner = (recipe: Recipe) => {
    const currentMeals = getMealsForDate(date);
    if (currentMeals.length > 0) {
      toast({
        title: "Recipe Already Exists",
        description: "You already have a breakfast planned for this day. Remove it first to add a new one.",
      });
      return;
    }
    
    addRecipeToPlanner(recipe, date);
    setRefreshKey(prev => prev + 1);
  };
  
  const handleGenerateRecipe = (servings: number) => {
    const currentMeals = getMealsForDate(date);
    if (currentMeals.length > 0) {
      return;
    }
    
    const newRecipe = generateRecipe(servings);
    addRecipeToPlanner(newRecipe, date);
    setRefreshKey(prev => prev + 1);
  };

  const handleToggleMealStatus = (index: number) => {
    toggleMealStatus(date, index);
    setRefreshKey(prev => prev + 1);
  };

  const handleRemoveMeal = (index: number) => {
    removeMeal(date, index);
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-[#F8F5FF]">
      <div className="p-4 md:p-8 max-w-7xl mx-auto">
        <div className="space-y-8">
          <PlannerHeader 
            title="Breakfast Planner" 
            subtitle="Plan your morning meals with ease" 
          />

          <PlannerLayout
            sidebar={
              <div className="space-y-6">
                <CalendarView 
                  date={date}
                  view={view}
                  plannedMeals={plannedMeals}
                  onDateSelect={handleDateSelect}
                  onViewChange={handleViewChange}
                />
                
                <FavoritesSection 
                  showFavorites={showFavorites}
                  setShowFavorites={setShowFavorites}
                  likedRecipes={likedRecipes}
                  selectedDate={date}
                  onAddToPlanner={handleAddToPlanner}
                />
              </div>
            }
            content={
              <AnimatePresence mode="sync">
                {isLoading ? (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-4 h-full flex items-center justify-center"
                  >
                    <div className="animate-pulse space-y-4 w-full">
                      <div className="h-12 bg-gray-200 rounded-md w-3/4"></div>
                      <div className="h-32 bg-gray-200 rounded-md w-full"></div>
                      <div className="h-32 bg-gray-200 rounded-md w-full"></div>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="content"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card className="overflow-hidden shadow-md p-6 border border-purple-100">
                      <AnimatePresence mode="sync">
                        {view === 'day' && (
                          <motion.div
                            key="day-view"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            <DayPlannerView
                              date={date}
                              meals={getMealsForDate(date)}
                              onToggleMealStatus={handleToggleMealStatus}
                              onRemoveMeal={handleRemoveMeal}
                              onAddClick={() => {
                                if (likedRecipes.length > 0) {
                                  setShowFavorites(true);
                                } else {
                                  toast({
                                    title: "No Favorite Recipes",
                                    description: "Like some recipes first to add them to your plan",
                                  });
                                }
                              }}
                              onGenerateRecipe={handleGenerateRecipe}
                            />
                          </motion.div>
                        )}
                        
                        {(view === 'week' || view === 'month') && (
                          <motion.div
                            key={`${view}-view`}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            <CalendarPlannerView
                              dates={viewDates}
                              selectedDate={date}
                              plannedMeals={plannedMeals}
                              onDateSelect={handleDateSelect}
                              view={view}
                            />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </Card>
                  </motion.div>
                )}
              </AnimatePresence>
            }
          />
        </div>
      </div>
    </div>
  );
};

export default Planner;
