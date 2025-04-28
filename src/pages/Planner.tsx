
import React, { useState, useEffect } from 'react';
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar as CalendarIcon, Plus, Home, Coffee, Heart, Grid, Calendar as CalendarSquare } from "lucide-react";
import { Link } from "react-router-dom";
import MealPlannerCard from '../components/MealPlannerCard';
import FavoriteRecipes from '../components/FavoriteRecipes';
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BREAKFAST_RECIPES } from '../components/RecipeCard';
import { format, addDays, startOfWeek, startOfMonth, eachDayOfInterval } from 'date-fns';

type ViewType = 'day' | 'week' | 'month';

const Planner = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [showFavorites, setShowFavorites] = useState(false);
  const [likedRecipes, setLikedRecipes] = useState<any[]>([]);
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [view, setView] = useState<ViewType>('day');
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    // Load liked recipes from localStorage
    const loadLikedRecipes = () => {
      const storedRecipes = JSON.parse(localStorage.getItem('likedRecipes') || '[]');
      setLikedRecipes(storedRecipes);
    };

    loadLikedRecipes();
    
    // Add event listener for storage changes
    const handleStorageChange = () => {
      loadLikedRecipes();
    };

    window.addEventListener('storage', handleStorageChange);
    
    // Simulate loading data
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 600);
    
    return () => {
      clearTimeout(timer);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [refreshKey]);
  
  const handleDateSelect = (selectedDate: Date | undefined) => {
    setDate(selectedDate);
    if (selectedDate) {
      toast({
        title: "Breakfast Plan",
        description: `Viewing breakfast for ${formatDate(selectedDate)}`,
        duration: 2000,
      });
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const handleAddRecipeToPlanner = (recipe: any, date: Date) => {
    if (!date) return;
    
    const dateKey = date.toISOString().split('T')[0];
    const savedMeals = JSON.parse(localStorage.getItem('plannedMeals') || '{}');
    
    const newMeal = {
      ...recipe,
      time: `8:00 AM`,
      status: 'planned'
    };
    
    savedMeals[dateKey] = savedMeals[dateKey] ? [...savedMeals[dateKey], newMeal] : [newMeal];
    localStorage.setItem('plannedMeals', JSON.stringify(savedMeals));
    
    toast({
      title: "Recipe Added",
      description: `${recipe.title} added to ${format(date, 'MMM d')}`,
      duration: 2000,
    });
    
    setRefreshKey(prev => prev + 1);
  };

  const getViewDates = (): Date[] => {
    if (!date) return [];
    if (view === 'day') return [date];
    
    if (view === 'week') {
      const weekStart = startOfWeek(date, { weekStartsOn: 1 });
      return eachDayOfInterval({ 
        start: weekStart, 
        end: addDays(weekStart, 6) 
      });
    }
    
    if (view === 'month') {
      const monthStart = startOfMonth(date);
      const daysInMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
      return eachDayOfInterval({
        start: monthStart,
        end: new Date(date.getFullYear(), date.getMonth(), daysInMonth)
      });
    }
    
    return [];
  };

  const viewDates = getViewDates();

  return (
    <div className="min-h-screen p-6 md:p-8 max-w-6xl mx-auto bg-[#F8F5FF]">
      <div className="space-y-8 fade-up">
        <header className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-medium mb-2 text-[#4F2D9E] flex items-center">
              <Coffee className="h-8 w-8 mr-3 text-[#4F2D9E]" />
              Breakfast Planner
            </h1>
            <p className="text-lg md:text-xl text-gray-500">
              Plan your morning meals with ease
            </p>
          </div>
          <Link to="/">
            <Button 
              variant="outline" 
              className="text-[#4F2D9E] border-[#4F2D9E] hover:bg-[#4F2D9E]/10 px-8 py-6 text-xl font-medium"
              size="lg"
            >
              <Home className="h-6 w-6 mr-3" />
              Home
            </Button>
          </Link>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="p-4 neumorphic overflow-hidden bg-gradient-to-br from-white to-[#F0EBFF] border-none">
              <CardContent className="pt-4">
                <div className="flex items-center gap-2 mb-4">
                  <CalendarIcon className="h-5 w-5 text-[#4F2D9E]" />
                  <h2 className="text-xl font-medium text-[#4F2D9E]">
                    {date ? formatDate(date) : 'Select a date'}
                  </h2>
                </div>
                <div className="relative space-y-4">
                  <div className="flex items-center justify-between mb-4">
                    <Tabs 
                      defaultValue="day" 
                      className="w-full"
                      onValueChange={(value) => setView(value as ViewType)}
                    >
                      <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="day" className="flex items-center gap-1">
                          <CalendarIcon className="h-4 w-4" />
                          <span>Day</span>
                        </TabsTrigger>
                        <TabsTrigger value="week" className="flex items-center gap-1">
                          <Grid className="h-4 w-4" />
                          <span>Week</span>
                        </TabsTrigger>
                        <TabsTrigger value="month" className="flex items-center gap-1">
                          <CalendarSquare className="h-4 w-4" />
                          <span>Month</span>
                        </TabsTrigger>
                      </TabsList>
                    </Tabs>
                  </div>
                  
                  <div className="calendar-wrapper relative">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={handleDateSelect}
                      className="rounded-md border bg-white/50 backdrop-blur-sm shadow-inner"
                    />
                    <div className="calendar-glow absolute inset-0 bg-gradient-to-br from-[#4F2D9E]/5 to-transparent rounded-md pointer-events-none"></div>
                  </div>
                  
                  <div className="flex items-center justify-between mt-4">
                    <h3 className="font-medium text-[#4F2D9E] flex items-center">
                      <Heart className="h-4 w-4 mr-2" />
                      Favorite Recipes
                    </h3>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowFavorites(!showFavorites)}
                      className="text-[#4F2D9E] border-[#4F2D9E] hover:bg-[#4F2D9E]/10"
                    >
                      {showFavorites ? "Hide Favorites" : "Show Favorites"}
                    </Button>
                  </div>
                  
                  <AnimatePresence>
                    {showFavorites && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <FavoriteRecipes 
                          onAddToPlanner={handleAddRecipeToPlanner} 
                          selectedDate={date} 
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <AnimatePresence mode="wait">
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
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="space-y-4"
              >
                {date && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h2 className="text-xl font-medium text-[#4F2D9E] flex items-center">
                        <Coffee className="h-5 w-5 mr-2" />
                        {view === 'day' 
                          ? 'Planned Breakfast' 
                          : view === 'week'
                            ? 'Weekly Breakfast Plan'
                            : 'Monthly Breakfast Plan'
                        }
                      </h2>
                      <Button 
                        onClick={() => {
                          if (likedRecipes.length > 0) {
                            setShowFavorites(true);
                          } else {
                            toast({
                              title: "No Favorite Recipes",
                              description: "Like some recipes first to add them to your plan",
                            });
                          }
                        }} 
                        className="bg-[#4F2D9E] text-white hover:bg-[#4F2D9E]/90"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Breakfast
                      </Button>
                    </div>

                    {view === 'day' ? (
                      <MealPlannerCard 
                        key={`${date.toISOString()}-${refreshKey}`} 
                        date={date} 
                        onRecipeAdded={() => setRefreshKey(prev => prev + 1)}
                      />
                    ) : (
                      <div className={`grid gap-4 ${view === 'week' ? 'grid-cols-1 md:grid-cols-3 lg:grid-cols-4' : 'grid-cols-1 md:grid-cols-3 lg:grid-cols-4'}`}>
                        <AnimatePresence>
                          {viewDates.map((viewDate) => (
                            <motion.div
                              key={viewDate.toISOString()}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              transition={{ duration: 0.3 }}
                              onClick={() => handleDateSelect(viewDate)}
                            >
                              <MealPlannerCard 
                                date={viewDate} 
                                view={view} 
                              />
                            </motion.div>
                          ))}
                        </AnimatePresence>
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Planner;
