
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  Users,
  Calendar,
  Leaf,
  Clock,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  Check,
  Loader2
} from 'lucide-react';
import { cn } from '@/lib/utils';

export interface MealPlanPreferences {
  servings: number;
  daysToplan: number;
  dietaryPreferences: string[];
  maxPrepTime: number;
  cuisineStyle: string;
}

interface MealPlannerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onGenerate: (preferences: MealPlanPreferences) => Promise<void>;
}

const DIETARY_OPTIONS = [
  { id: 'none', label: 'No Restrictions', icon: '🍳' },
  { id: 'vegetarian', label: 'Vegetarian', icon: '🥬' },
  { id: 'vegan', label: 'Vegan', icon: '🌱' },
  { id: 'gluten-free', label: 'Gluten-Free', icon: '🌾' },
  { id: 'dairy-free', label: 'Dairy-Free', icon: '🥛' },
  { id: 'low-carb', label: 'Low-Carb', icon: '🥑' },
];

const CUISINE_OPTIONS = [
  { id: 'any', label: 'Any Style', description: 'Mix of different cuisines' },
  { id: 'american', label: 'American Classic', description: 'Pancakes, eggs, bacon' },
  { id: 'mediterranean', label: 'Mediterranean', description: 'Light and healthy' },
  { id: 'asian', label: 'Asian Fusion', description: 'Rice bowls, congee' },
  { id: 'european', label: 'European', description: 'Croissants, crepes' },
  { id: 'healthy', label: 'Health-Focused', description: 'Smoothie bowls, oats' },
];

const MealPlannerModal: React.FC<MealPlannerModalProps> = ({
  open,
  onOpenChange,
  onGenerate
}) => {
  const [step, setStep] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [preferences, setPreferences] = useState<MealPlanPreferences>({
    servings: 2,
    daysToplan: 7,
    dietaryPreferences: ['none'],
    maxPrepTime: 20,
    cuisineStyle: 'any'
  });

  const totalSteps = 4;

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleDietaryToggle = (id: string) => {
    setPreferences(prev => {
      if (id === 'none') {
        return { ...prev, dietaryPreferences: ['none'] };
      }

      const current = prev.dietaryPreferences.filter(p => p !== 'none');
      if (current.includes(id)) {
        const updated = current.filter(p => p !== id);
        return { ...prev, dietaryPreferences: updated.length === 0 ? ['none'] : updated };
      } else {
        return { ...prev, dietaryPreferences: [...current, id] };
      }
    });
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      await onGenerate(preferences);
      onOpenChange(false);
      setStep(1);
    } finally {
      setIsGenerating(false);
    }
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-8"
          >
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-foreground/5 flex items-center justify-center">
                <Users className="h-8 w-8 text-foreground/60" />
              </div>
              <h3 className="text-xl font-medium mb-2">How many people?</h3>
              <p className="text-sm text-muted-foreground">We'll adjust portions accordingly</p>
            </div>

            <div className="space-y-6">
              <div className="flex justify-center items-center gap-6">
                {[1, 2, 3, 4].map(num => (
                  <button
                    key={num}
                    onClick={() => setPreferences(prev => ({ ...prev, servings: num }))}
                    className={cn(
                      "w-16 h-16 rounded-2xl text-xl font-medium transition-all duration-300",
                      preferences.servings === num
                        ? "bg-foreground text-background scale-110"
                        : "bg-secondary hover:bg-secondary/80"
                    )}
                  >
                    {num}
                  </button>
                ))}
              </div>
              <p className="text-center text-sm text-muted-foreground">
                {preferences.servings} {preferences.servings === 1 ? 'person' : 'people'}
              </p>
            </div>
          </motion.div>
        );

      case 2:
        return (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-8"
          >
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-foreground/5 flex items-center justify-center">
                <Calendar className="h-8 w-8 text-foreground/60" />
              </div>
              <h3 className="text-xl font-medium mb-2">Plan for how many days?</h3>
              <p className="text-sm text-muted-foreground">We'll generate a meal for each day</p>
            </div>

            <div className="space-y-6 px-4">
              <Slider
                value={[preferences.daysToplan]}
                onValueChange={([value]) => setPreferences(prev => ({ ...prev, daysToplan: value }))}
                min={1}
                max={14}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>1 day</span>
                <span className="font-medium text-foreground text-lg">{preferences.daysToplan} days</span>
                <span>14 days</span>
              </div>
            </div>
          </motion.div>
        );

      case 3:
        return (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-foreground/5 flex items-center justify-center">
                <Leaf className="h-8 w-8 text-foreground/60" />
              </div>
              <h3 className="text-xl font-medium mb-2">Any dietary preferences?</h3>
              <p className="text-sm text-muted-foreground">Select all that apply</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {DIETARY_OPTIONS.map(option => (
                <button
                  key={option.id}
                  onClick={() => handleDietaryToggle(option.id)}
                  className={cn(
                    "flex items-center gap-3 p-4 rounded-xl transition-all duration-300 text-left",
                    preferences.dietaryPreferences.includes(option.id)
                      ? "bg-foreground text-background"
                      : "bg-secondary hover:bg-secondary/80"
                  )}
                >
                  <span className="text-xl">{option.icon}</span>
                  <span className="text-sm font-medium">{option.label}</span>
                  {preferences.dietaryPreferences.includes(option.id) && (
                    <Check className="h-4 w-4 ml-auto" />
                  )}
                </button>
              ))}
            </div>
          </motion.div>
        );

      case 4:
        return (
          <motion.div
            key="step4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-foreground/5 flex items-center justify-center">
                <Sparkles className="h-8 w-8 text-foreground/60" />
              </div>
              <h3 className="text-xl font-medium mb-2">What style do you prefer?</h3>
              <p className="text-sm text-muted-foreground">Choose your favorite cuisine</p>
            </div>

            <div className="space-y-2">
              {CUISINE_OPTIONS.map(option => (
                <button
                  key={option.id}
                  onClick={() => setPreferences(prev => ({ ...prev, cuisineStyle: option.id }))}
                  className={cn(
                    "w-full flex items-center justify-between p-4 rounded-xl transition-all duration-300 text-left",
                    preferences.cuisineStyle === option.id
                      ? "bg-foreground text-background"
                      : "bg-secondary hover:bg-secondary/80"
                  )}
                >
                  <div>
                    <p className="font-medium">{option.label}</p>
                    <p className={cn(
                      "text-xs",
                      preferences.cuisineStyle === option.id
                        ? "text-background/70"
                        : "text-muted-foreground"
                    )}>
                      {option.description}
                    </p>
                  </div>
                  {preferences.cuisineStyle === option.id && (
                    <Check className="h-5 w-5 flex-shrink-0" />
                  )}
                </button>
              ))}
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg bg-card/95 backdrop-blur-xl border-border/50 rounded-2xl p-0 overflow-hidden">
        {/* Progress bar */}
        <div className="h-1 bg-secondary">
          <motion.div
            className="h-full bg-foreground"
            initial={{ width: 0 }}
            animate={{ width: `${(step / totalSteps) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>

        <div className="p-6">
          <DialogHeader className="mb-6">
            <DialogTitle className="text-xs font-medium tracking-widest uppercase text-muted-foreground">
              Step {step} of {totalSteps}
            </DialogTitle>
            <DialogDescription className="sr-only">
              Configure your meal plan preferences
            </DialogDescription>
          </DialogHeader>

          <AnimatePresence mode="wait">
            {renderStepContent()}
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex justify-between items-center mt-8 pt-6 border-t border-border/30">
            {step > 1 ? (
              <Button
                variant="ghost"
                onClick={handleBack}
                className="rounded-full"
              >
                <ChevronLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            ) : (
              <Button
                variant="ghost"
                onClick={() => onOpenChange(false)}
                className="rounded-full"
              >
                Cancel
              </Button>
            )}

            {step < totalSteps ? (
              <Button
                onClick={handleNext}
                className="btn-primary rounded-full"
              >
                Continue
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            ) : (
              <Button
                onClick={handleGenerate}
                disabled={isGenerating}
                className="btn-primary rounded-full min-w-[160px]"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-2" />
                    Generate Plan
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MealPlannerModal;
