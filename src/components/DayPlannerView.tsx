import React from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { Plus, UtensilsCrossed } from "lucide-react";
import { Button } from "@/components/ui/button";
import PlannerRecipeCard from './PlannerRecipeCard';
import { Recipe } from '@/hooks/useMealPlanner';
import { format } from 'date-fns';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Form, FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";

interface DayPlannerViewProps {
  date: Date;
  meals: Recipe[];
  onToggleMealStatus: (index: number) => void;
  onRemoveMeal: (index: number) => void;
  onAddClick: () => void;
  onGenerateRecipe: (servings: number) => void;
}

interface RecipeForm {
  servings: number;
}

const DayPlannerView: React.FC<DayPlannerViewProps> = ({
  date,
  meals,
  onToggleMealStatus,
  onRemoveMeal,
  onAddClick,
  onGenerateRecipe
}) => {
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const { toast } = useToast();

  const form = useForm<RecipeForm>({
    defaultValues: {
      servings: 2
    }
  });

  const handleAddClick = () => {
    if (meals.length > 0) {
      toast({
        title: "Recipe Already Added",
        description: "You already have a breakfast planned for this day."
      });
      return;
    }
    setIsDialogOpen(true);
  };

  const handleSubmit = (values: RecipeForm) => {
    onGenerateRecipe(values.servings);
    setIsDialogOpen(false);
    toast({
      title: "Recipe Generated",
      description: `Breakfast recipe for ${values.servings} ${values.servings === 1 ? 'person' : 'people'} has been added.`
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs font-medium tracking-widest uppercase text-muted-foreground mb-1 block">
            Daily plan
          </span>
          <h2 className="text-xl font-medium text-foreground">
            {format(date, 'EEEE, MMMM d')}
          </h2>
        </div>
      </div>

      <motion.div
        className="space-y-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <AnimatePresence>
          {meals.length > 0 ? (
            meals.map((meal, index) => (
              <PlannerRecipeCard
                key={meal.id || index}
                meal={meal}
                onToggleStatus={() => onToggleMealStatus(index)}
                onRemove={() => onRemoveMeal(index)}
              />
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-16 bg-secondary/30 rounded-xl border border-border/30"
            >
              <UtensilsCrossed className="h-10 w-10 mx-auto text-muted-foreground/40 mb-4" />
              <p className="text-muted-foreground mb-6">No breakfast planned for this day</p>
              <Button
                className="btn-primary rounded-full px-6"
                size="sm"
                onClick={handleAddClick}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Breakfast
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md bg-card/95 backdrop-blur-xl border-border/50 rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-medium">Create Breakfast Recipe</DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground">
              How many people will be having breakfast?
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="servings"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">Number of people</FormLabel>
                    <FormControl>
                      <select
                        className="w-full border border-border/50 rounded-lg p-3 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-foreground/10"
                        {...field}
                        onChange={e => field.onChange(parseInt(e.target.value))}
                      >
                        {[1, 2, 3, 4, 5, 6].map(num => (
                          <option key={num} value={num}>
                            {num} {num === 1 ? 'person' : 'people'}
                          </option>
                        ))}
                      </select>
                    </FormControl>
                  </FormItem>
                )}
              />

              <div className="flex justify-end gap-3">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setIsDialogOpen(false)}
                  className="rounded-full"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="btn-primary rounded-full"
                >
                  Generate Recipe
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DayPlannerView;
