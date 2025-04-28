
import React, { useState, useEffect } from 'react';
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar as CalendarIcon, Plus, Home, Coffee } from "lucide-react";
import { Link } from "react-router-dom";
import MealPlannerCard from '../components/MealPlannerCard';
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";

const Planner = () => {
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  const [selectedMeals, setSelectedMeals] = React.useState<{[key: string]: string}>({});
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 600);
    
    return () => clearTimeout(timer);
  }, []);
  
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
              className="text-[#4F2D9E] border-[#4F2D9E] hover:bg-[#4F2D9E]/10 px-6 py-5 text-lg font-medium"
              size="lg"
            >
              <Home className="h-6 w-6 mr-2" />
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
                <div className="calendar-wrapper relative">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={handleDateSelect}
                    className="rounded-md border bg-white/50 backdrop-blur-sm shadow-inner"
                  />
                  
                  <div className="calendar-glow absolute inset-0 bg-gradient-to-br from-[#4F2D9E]/5 to-transparent rounded-md pointer-events-none"></div>
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
                        Planned Breakfast
                      </h2>
                      <Button 
                        onClick={() => {
                          toast({
                            title: "Breakfast Added",
                            description: "Your breakfast has been added to the planner",
                          });
                        }} 
                        className="bg-[#4F2D9E] text-white hover:bg-[#4F2D9E]/90"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Breakfast
                      </Button>
                    </div>
                    <MealPlannerCard date={date} />
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
