
import React from 'react';
import { Heart, Clock } from 'lucide-react';
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

const RecipeCard: React.FC = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="group cursor-pointer">
          <div className="neumorphic overflow-hidden rounded-xl transition-all duration-300 hover:shadow-[8px_8px_20px_rgba(0,0,0,0.1),-8px_-8px_20px_rgba(255,255,255,0.8)] dark:hover:shadow-[8px_8px_20px_rgba(0,0,0,0.3),-8px_-8px_20px_rgba(255,255,255,0.05)]">
            <div className="relative aspect-[4/3] w-full overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1586511925558-a4c6376fe65f?w=800&auto=format&fit=crop&q=60"
                alt="Banana Oatmeal Bowl"
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <button className="absolute right-3 top-3 rounded-full bg-white p-2 transition-transform hover:scale-110">
                <Heart className="h-5 w-5" />
              </button>
            </div>
            <div className="p-4">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-500">8 min prep</span>
              </div>
              <h2 className="mt-2 text-lg font-medium">Quick Banana Oatmeal</h2>
              <p className="mt-1 text-sm text-gray-500">A healthy breakfast bowl</p>
            </div>
          </div>
        </div>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <div className="space-y-4 p-4">
          <h2 className="text-xl font-semibold">Quick Banana Oatmeal</h2>
          <div className="space-y-2">
            <h3 className="font-medium">Ingredients:</h3>
            <ul className="list-inside list-disc space-y-1 text-gray-600">
              <li>1 cup quick oats</li>
              <li>1 ripe banana, sliced</li>
              <li>1 cup milk (any type)</li>
              <li>1 tbsp honey or maple syrup</li>
              <li>Cinnamon to taste</li>
            </ul>
          </div>
          <div className="space-y-2">
            <h3 className="font-medium">Instructions:</h3>
            <ol className="list-inside list-decimal space-y-2 text-gray-600">
              <li>In a microwave-safe bowl, combine oats and milk</li>
              <li>Microwave for 1-2 minutes, stirring halfway</li>
              <li>Add sliced banana and honey/maple syrup</li>
              <li>Sprinkle with cinnamon and serve hot</li>
            </ol>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RecipeCard;
