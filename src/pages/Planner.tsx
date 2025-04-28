
import React from 'react';
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar as CalendarIcon, Plus } from "lucide-react";
import MealPlannerCard from '../components/MealPlannerCard';

const Planner = () => {
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  const [selectedMeals, setSelectedMeals] = React.useState<{[key: string]: string}>({});

  const handleDateSelect = (selectedDate: Date | undefined) => {
    setDate(selectedDate);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <div className="min-h-screen p-6 md:p-8 max-w-6xl mx-auto">
      <div className="space-y-8 fade-up">
        <header className="mb-8">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-medium mb-2 text-[#4F2D9E]">
            Meal Planner
          </h1>
          <p className="text-lg md:text-xl text-gray-500">
            Plan your breakfast schedule
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="p-4 neumorphic">
            <CardContent className="pt-4">
              <div className="flex items-center gap-2 mb-4">
                <CalendarIcon className="h-5 w-5 text-[#4F2D9E]" />
                <h2 className="text-xl font-medium text-[#4F2D9E]">
                  {date ? formatDate(date) : 'Select a date'}
                </h2>
              </div>
              <Calendar
                mode="single"
                selected={date}
                onSelect={handleDateSelect}
                className="rounded-md border"
              />
            </CardContent>
          </Card>

          <div className="space-y-4">
            {date && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-medium text-[#4F2D9E]">
                    Planned Meals
                  </h2>
                  <Button 
                    onClick={() => {}} 
                    className="bg-[#4F2D9E] text-white hover:bg-[#4F2D9E]/90"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Meal
                  </Button>
                </div>
                <MealPlannerCard date={date} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Planner;
