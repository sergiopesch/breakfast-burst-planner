import React from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { Coffee, Plus } from "lucide-react";
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
  const {
    toast
  } = useToast();
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
  return <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-medium text-[#4F2D9E] flex items-center">
          <Coffee className="h-5 w-5 mr-2" />
          {format(date, 'EEEE, MMMM d, yyyy')}
        </h2>
        
      </div>

      <motion.div className="space-y-3" initial={{
      opacity: 0
    }} animate={{
      opacity: 1
    }} transition={{
      duration: 0.3
    }}>
        <AnimatePresence>
          {meals.length > 0 ? meals.map((meal, index) => <PlannerRecipeCard key={meal.id || index} meal={meal} onToggleStatus={() => onToggleMealStatus(index)} onRemove={() => onRemoveMeal(index)} />) : <motion.div initial={{
          opacity: 0,
          y: 10
        }} animate={{
          opacity: 1,
          y: 0
        }} className="text-center py-10 bg-white/50 backdrop-blur-sm rounded-lg shadow-sm">
              <Coffee className="h-12 w-12 mx-auto text-gray-300 mb-3" />
              <p className="text-gray-500 mb-4">No breakfast planned for this day</p>
              <Button className="bg-[#4F2D9E] text-white hover:bg-[#4F2D9E]/90" size="sm" onClick={handleAddClick}>
                <Plus className="h-4 w-4 mr-2" />
                Add Breakfast
              </Button>
            </motion.div>}
        </AnimatePresence>
      </motion.div>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Breakfast Recipe</DialogTitle>
            <DialogDescription>
              How many people will be having breakfast?
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
              <FormField control={form.control} name="servings" render={({
              field
            }) => <FormItem>
                    <FormLabel>Number of people</FormLabel>
                    <FormControl>
                      <select className="w-full border rounded-md p-2" {...field} onChange={e => field.onChange(parseInt(e.target.value))}>
                        {[1, 2, 3, 4, 5, 6].map(num => <option key={num} value={num}>
                            {num} {num === 1 ? 'person' : 'people'}
                          </option>)}
                      </select>
                    </FormControl>
                  </FormItem>} />
              
              <div className="flex justify-end gap-3">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-[#4F2D9E] text-white hover:bg-[#4F2D9E]/90">
                  Generate Recipe
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>;
};
export default DayPlannerView;