
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { List, Check } from "lucide-react";

interface MealPlannerCardProps {
  date: Date;
}

const MealPlannerCard: React.FC<MealPlannerCardProps> = ({ date }) => {
  const meals = [
    {
      time: '8:00 AM',
      recipe: 'Quick Banana Oatmeal',
      status: 'planned'
    },
    {
      time: '8:30 AM',
      recipe: 'Avocado Toast',
      status: 'completed'
    }
  ];

  return (
    <div className="space-y-4">
      {meals.map((meal, index) => (
        <Card key={index} className="neumorphic overflow-hidden">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm text-gray-500">{meal.time}</p>
                <h3 className="font-medium text-[#4F2D9E]">{meal.recipe}</h3>
              </div>
              <div className="flex items-center gap-2">
                {meal.status === 'completed' ? (
                  <Button 
                    variant="ghost" 
                    className="text-green-600 hover:text-green-700 hover:bg-green-50"
                  >
                    <Check className="h-4 w-4" />
                  </Button>
                ) : (
                  <Button 
                    variant="ghost"
                    className="text-[#4F2D9E] hover:bg-[#4F2D9E]/10"
                  >
                    <List className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default MealPlannerCard;
