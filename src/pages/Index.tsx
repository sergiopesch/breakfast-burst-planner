
import React, { useEffect, useState } from 'react';
import { getUserName } from '../utils/getUserName';
import RecipeCard from '../components/RecipeCard';
import CtaButton from '../components/CtaButton';

const Index = () => {
  const [isVisible, setIsVisible] = useState(false);
  const userName = getUserName();
  
  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="min-h-screen p-6 md:p-8 max-w-5xl mx-auto">
      <div className={`space-y-8 ${isVisible ? 'fade-up' : 'opacity-0'}`}>
        {/* Greeting Header */}
        <header className="mb-8">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-2">Good morning, {userName}!</h1>
          <p className="text-lg md:text-xl text-muted-foreground">What's for breakfast today?</p>
        </header>
        
        {/* Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Recipe Card */}
          <div className="md:col-span-1">
            <div className="mb-4">
              <h2 className="text-xl font-semibold">Surprise me</h2>
              <p className="text-muted-foreground">Try something new today</p>
            </div>
            <RecipeCard />
          </div>
          
          {/* CTA Section */}
          <div className="md:col-span-1 flex flex-col justify-center items-start">
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Plan your week</h2>
              <p className="text-muted-foreground mb-4">Organize your breakfast schedule to save time and avoid repetition</p>
              <CtaButton to="/planner">Go to meal planner</CtaButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
