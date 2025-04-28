
import React from 'react';

const RecipeCard: React.FC = () => {
  return (
    <div className="neumorphic p-6 transition-all duration-300 hover:shadow-[8px_8px_20px_rgba(0,0,0,0.1),-8px_-8px_20px_rgba(255,255,255,0.8)] dark:hover:shadow-[8px_8px_20px_rgba(0,0,0,0.3),-8px_-8px_20px_rgba(255,255,255,0.05)]">
      <h2 className="text-xl mb-2 font-bold">Quick Banana Oatmeal</h2>
      <p className="text-muted-foreground mb-4">Ready in 8 minutes</p>
      <div className="space-y-2">
        <p>• 1 cup quick oats</p>
        <p>• 1 ripe banana, sliced</p>
        <p>• 1 cup milk (any type)</p>
        <p>• 1 tbsp honey or maple syrup</p>
        <p>• Cinnamon to taste</p>
      </div>
    </div>
  );
};

export default RecipeCard;
