
import React, { useState, useEffect } from 'react';
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Calendar as CalendarIcon, 
  Home, 
  Coffee, 
  Heart, 
  Grid, 
  Calendar as CalendarSquare,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  format, 
  addDays, 
  startOfWeek, 
  startOfMonth, 
  eachDayOfInterval,
  endOfWeek,
  endOfMonth,
  isSameDay,
  addWeeks,
  subWeeks,
  addMonths,
  subMonths
} from 'date-fns';
import { useMealPlanner, Recipe } from '@/hooks/useMealPlanner';
import DayPlannerView from '@/components/DayPlannerView';
import CalendarPlannerView from '@/components/CalendarPlannerView';
import FavoriteRecipesPanel from '@/components/FavoriteRecipesPanel';
import PlannerLayout from '@/components/PlannerLayout';
import { Dialog, DialogTrigger, DialogContent } from '@/components/ui/dialog';

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

  // Get the date range for the selected view
  const getViewDates = (): Date[] => {
    if (view === 'day') return [date];
    
    if (view === 'week') {
      const weekStart = startOfWeek(date, { weekStartsOn: 1 });
      return eachDayOfInterval({ 
        start: weekStart, 
        end: endOfWeek(date, { weekStartsOn: 1 }) 
      });
    }
    
    if (view === 'month') {
      const monthStart = startOfMonth(date);
      return eachDayOfInterval({
        start: monthStart,
        end: endOfMonth(date)
      });
    }
    
    return [];
  };

  const viewDates = getViewDates();

  // Navigation functions
  const navigate = (direction: 'prev' | 'next') => {
    if (view === 'day') {
      setDate(prev => direction === 'next' ? addDays(prev, 1) : addDays(prev, -1));
    } else if (view === 'week') {
      setDate(prev => direction === 'next' ? addWeeks(prev, 1) : subWeeks(prev, 1));
    } else if (view === 'month') {
      setDate(prev => direction === 'next' ? addMonths(prev, 1) : subMonths(prev, 1));
    }
  };

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
    addRecipeToPlanner(recipe, date);
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
    <div className="min-h-screen p-4 md:p-8 max-w-7xl mx-auto bg-[#F8F5FF]">
      <div className="space-y-8">
        <header className="mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-medium mb-2 text-[#4F2D9E] flex items-center">
              <Coffee className="h-8 w-8 mr-3 text-[#4F2D9E]" />
              Breakfast Planner
            </h1>
            <p className="text-gray-500">
              Plan your morning meals with ease
            </p>
          </div>
          <Link to="/">
            <Button 
              variant="outline" 
              className="text-[#4F2D9E] border-[#4F2D9E] hover:bg-[#4F2D9E]/10"
            >
              <Home className="h-5 w-5 mr-2" />
              Back to Home
            </Button>
          </Link>
        </header>

        <PlannerLayout
          sidebar={
            <div className="space-y-6">
              <Card className="overflow-hidden bg-gradient-to-br from-white to-[#F0EBFF] border-none shadow-sm">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="font-medium text-[#4F2D9E] flex items-center">
                      <CalendarIcon className="h-5 w-5 mr-2" />
                      Calendar
                    </h2>
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="ghost" 
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => navigate('prev')}
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <span className="text-sm font-medium text-[#4F2D9E]">
                        {view === 'day' && format(date, 'MMM d, yyyy')}
                        {view === 'week' && `Week of ${format(viewDates[0], 'MMM d')}`}
                        {view === 'month' && format(date, 'MMMM yyyy')}
                      </span>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => navigate('next')}
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="rounded-md overflow-hidden relative">
                    <Tabs 
                      defaultValue={view}
                      value={view}
                      onValueChange={(value) => handleViewChange(value as ViewType)}
                      className="w-full"
                    >
                      <TabsList className="grid w-full grid-cols-3 mb-4">
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
                    
                    <div className="bg-white/70 backdrop-blur-sm rounded-md overflow-hidden shadow-inner">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={handleDateSelect}
                        modifiers={{
                          hasEvents: Object.keys(plannedMeals).map(dateKey => new Date(dateKey))
                        }}
                        modifiersStyles={{
                          hasEvents: {
                            fontWeight: "bold",
                            textDecoration: "underline",
                            textUnderlineOffset: "4px",
                            textDecorationColor: "#4F2D9E"
                          }
                        }}
                        className="rounded-md"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="overflow-hidden shadow-sm">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="font-medium text-[#4F2D9E] flex items-center">
                      <Heart className="h-5 w-5 mr-2" />
                      Favorite Recipes
                    </h2>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowFavorites(!showFavorites)}
                      className="text-[#4F2D9E] border-[#4F2D9E] hover:bg-[#4F2D9E]/10"
                    >
                      {showFavorites ? "Hide" : "Show"}
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
                        <FavoriteRecipesPanel 
                          likedRecipes={likedRecipes}
                          selectedDate={date}
                          onAddToPlanner={handleAddToPlanner}
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </CardContent>
              </Card>
            </div>
          }
          content={
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
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="overflow-hidden shadow-sm p-5">
                    <AnimatePresence mode="wait">
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
  );
};

export default Planner;
