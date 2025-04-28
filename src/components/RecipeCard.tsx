
import React from 'react';
import { Heart, Clock } from 'lucide-react';
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

const RECIPES = [
  {
    title: "Quick Banana Oatmeal",
    description: "A healthy breakfast bowl",
    prepTime: "8 min prep",
    image: "https://images.unsplash.com/photo-1586511925558-a4c6376fe65f?w=800&auto=format&fit=crop&q=60",
    ingredients: [
      "1 cup quick oats",
      "1 ripe banana, sliced",
      "1 cup milk (any type)",
      "1 tbsp honey or maple syrup",
      "Cinnamon to taste"
    ],
    instructions: [
      "In a microwave-safe bowl, combine oats and milk",
      "Microwave for 1-2 minutes, stirring halfway",
      "Add sliced banana and honey/maple syrup",
      "Sprinkle with cinnamon and serve hot"
    ]
  },
  {
    title: "Avocado Toast",
    description: "Classic breakfast favorite",
    prepTime: "5 min prep",
    image: "https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?w=800&auto=format&fit=crop&q=60",
    ingredients: [
      "2 slices whole grain bread",
      "1 ripe avocado",
      "2 eggs",
      "Salt and pepper to taste",
      "Red pepper flakes (optional)"
    ],
    instructions: [
      "Toast the bread until golden brown",
      "Mash the avocado and spread on toast",
      "Fry eggs sunny side up",
      "Top toast with eggs and seasonings"
    ]
  },
  {
    title: "Berry Yogurt Parfait",
    description: "Light and refreshing start",
    prepTime: "6 min prep",
    image: "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=800&auto=format&fit=crop&q=60",
    ingredients: [
      "1 cup Greek yogurt",
      "1/2 cup mixed berries",
      "1/4 cup granola",
      "1 tbsp honey",
      "Mint leaves for garnish"
    ],
    instructions: [
      "Layer yogurt at the bottom of a glass",
      "Add a layer of mixed berries",
      "Top with granola and drizzle honey",
      "Garnish with mint leaves"
    ]
  }
];

const RecipeCard: React.FC = () => {
  const recipe = RECIPES[Math.floor(Math.random() * RECIPES.length)];

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="group cursor-pointer">
          <div className="neumorphic overflow-hidden rounded-xl transition-all duration-300 hover:shadow-[8px_8px_20px_rgba(0,0,0,0.1),-8px_-8px_20px_rgba(255,255,255,0.8)] dark:hover:shadow-[8px_8px_20px_rgba(0,0,0,0.3),-8px_-8px_20px_rgba(255,255,255,0.05)]">
            <div className="relative aspect-video max-h-[280px] w-full overflow-hidden">
              <img
                src={recipe.image}
                alt={recipe.title}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <button className="absolute right-3 top-3 rounded-full bg-white/90 backdrop-blur-sm p-2 transition-transform hover:scale-110 hover:bg-[#4F2D9E] hover:text-white">
                <Heart className="h-5 w-5" />
              </button>
            </div>
            <div className="p-4">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-[#4F2D9E]" />
                <span className="text-sm text-gray-600">{recipe.prepTime}</span>
              </div>
              <h2 className="mt-2 text-lg font-medium text-[#4F2D9E]">{recipe.title}</h2>
              <p className="mt-1 text-sm text-gray-600">{recipe.description}</p>
            </div>
          </div>
        </div>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <div className="space-y-4 p-4">
          <h2 className="text-xl font-semibold text-[#4F2D9E]">{recipe.title}</h2>
          <div className="space-y-2">
            <h3 className="font-medium text-[#4F2D9E]">Ingredients:</h3>
            <ul className="list-inside list-disc space-y-1 text-gray-600">
              {recipe.ingredients.map((ingredient, index) => (
                <li key={index}>{ingredient}</li>
              ))}
            </ul>
          </div>
          <div className="space-y-2">
            <h3 className="font-medium text-[#4F2D9E]">Instructions:</h3>
            <ol className="list-inside list-decimal space-y-2 text-gray-600">
              {recipe.instructions.map((instruction, index) => (
                <li key={index}>{instruction}</li>
              ))}
            </ol>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RecipeCard;
