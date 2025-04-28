
import React, { useEffect, useState } from 'react';
import { getUserName } from '../utils/getUserName';
import RecipeCard from '../components/RecipeCard';
import CtaButton from '../components/CtaButton';
import { Button } from "@/components/ui/button";
import { RefreshCw } from 'lucide-react';

const Index = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [recipeKey, setRecipeKey] = useState(0);
  
  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleRandomize = () => {
    setRecipeKey(prev => prev + 1);
  };

  return (
    <div className="min-h-screen p-6 md:p-8 max-w-4xl mx-auto">
      <div className={`space-y-8 ${isVisible ? 'fade-up' : 'opacity-0'}`}>
        {/* Greeting Header */}
        <header className="mb-8">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-medium mb-2 text-[#4F2D9E]">Good morning!</h1>
          <p className="text-lg md:text-xl text-gray-500">What's for breakfast today?</p>
        </header>
        
        {/* Main Content */}
        <div className="flex flex-col gap-8">
          {/* Recipe Section */}
          <div className="w-full">
            <div className="flex justify-between items-center mb-4">
              <div>
                <Button
                  onClick={handleRandomize}
                  className="flex items-center gap-2 bg-[#4F2D9E] text-white hover:bg-[#4F2D9E]/90 transition-colors"
                >
                  <RefreshCw className="h-4 w-4" />
                  Surprise me
                </Button>
              </div>
            </div>
            <RecipeCard key={recipeKey} />
          </div>
          
          {/* CTA Section */}
          <div className="w-full mt-8 p-6 bg-[#F7F5FF] rounded-xl">
            <div className="space-y-4">
              <h2 className="text-xl font-medium text-[#4F2D9E]">Plan your week</h2>
              <p className="text-gray-600 mb-4">Organize your breakfast schedule to save time and avoid repetition</p>
              <CtaButton to="/planner">Go to meal planner</CtaButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
