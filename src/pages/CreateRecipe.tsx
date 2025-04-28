
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from "react-hook-form";
import { v4 as uuidv4 } from 'uuid';
import { ChefHat, Save, Plus, X, FileText } from "lucide-react";

import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase, uploadRecipeImage } from '@/lib/supabase';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card } from "@/components/ui/card";
import NavBar from '@/components/NavBar';

type FormValues = {
  title: string;
  description: string;
  prepTime: string;
  servings: number;
  ingredients: string[];
  instructions: string[];
}

const CreateRecipe = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  
  const form = useForm<FormValues>({
    defaultValues: {
      title: '',
      description: '',
      prepTime: '',
      servings: 2,
      ingredients: [''],
      instructions: ['']
    }
  });

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedImage(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const addIngredient = () => {
    const currentIngredients = form.getValues('ingredients');
    form.setValue('ingredients', [...currentIngredients, '']);
  };

  const removeIngredient = (index: number) => {
    const currentIngredients = form.getValues('ingredients');
    if (currentIngredients.length > 1) {
      const newIngredients = currentIngredients.filter((_, i) => i !== index);
      form.setValue('ingredients', newIngredients);
    }
  };

  const addInstruction = () => {
    const currentInstructions = form.getValues('instructions');
    form.setValue('instructions', [...currentInstructions, '']);
  };

  const removeInstruction = (index: number) => {
    const currentInstructions = form.getValues('instructions');
    if (currentInstructions.length > 1) {
      const newInstructions = currentInstructions.filter((_, i) => i !== index);
      form.setValue('instructions', newInstructions);
    }
  };

  const onSubmit = async (values: FormValues) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to save recipes.",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Filter out empty ingredients and instructions
      const filteredIngredients = values.ingredients.filter(item => item.trim() !== '');
      const filteredInstructions = values.instructions.filter(item => item.trim() !== '');
      
      const recipeId = uuidv4();
      
      let imageUrl = null;
      let imagePath = null;
      
      // Upload image if selected
      if (selectedImage) {
        const { path, url, error } = await uploadRecipeImage(selectedImage, user.id);
        
        if (error) {
          console.error('Error uploading image:', error);
          toast({
            title: "Image Upload Failed",
            description: "Could not upload image. Recipe will be saved without an image.",
            variant: "destructive"
          });
        } else {
          imageUrl = url;
          imagePath = path;
        }
      }
      
      // Save recipe to database
      const { error } = await supabase.from('recipes').insert({
        id: recipeId,
        user_id: user.id,
        title: values.title,
        description: values.description,
        prep_time: values.prepTime,
        servings: values.servings,
        ingredients: filteredIngredients,
        instructions: filteredInstructions,
        image_url: imageUrl,
        image_path: imagePath
      });
      
      if (error) {
        throw error;
      }
      
      toast({
        title: "Recipe Saved",
        description: "Your recipe has been saved successfully!",
      });
      
      // Navigate to planner or recipes list
      navigate('/planner');
    } catch (error) {
      console.error('Error saving recipe:', error);
      toast({
        title: "Error Saving Recipe",
        description: "There was an error saving your recipe. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F5FF]">
      <NavBar />
      <div className="container mx-auto p-4 md:p-8 max-w-3xl">
        <div className="flex items-center space-x-2 mb-6">
          <ChefHat className="h-6 w-6 text-purple-500" />
          <h1 className="text-2xl font-bold">Create New Recipe</h1>
        </div>
        
        <Card className="p-6 shadow-md border border-purple-100">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Recipe Title */}
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Recipe Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Delicious Pancakes" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Description */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="A brief description of your recipe..." 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Image Upload */}
              <div className="space-y-2">
                <FormLabel>Recipe Image</FormLabel>
                <div className="flex items-center gap-4">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleImageSelect}
                    className="max-w-64"
                  />
                  
                  {imagePreview && (
                    <div className="relative w-20 h-20">
                      <img 
                        src={imagePreview} 
                        alt="Recipe preview" 
                        className="w-full h-full object-cover rounded-md" 
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute -top-2 -right-2 h-6 w-6"
                        onClick={() => {
                          setSelectedImage(null);
                          setImagePreview(null);
                        }}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Prep Time */}
                <FormField
                  control={form.control}
                  name="prepTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Prep Time</FormLabel>
                      <FormControl>
                        <Input placeholder="20 minutes" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {/* Servings */}
                <FormField
                  control={form.control}
                  name="servings"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Servings</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          min="1"
                          {...field} 
                          onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              {/* Ingredients */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <FormLabel>Ingredients</FormLabel>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addIngredient}
                    className="text-xs"
                  >
                    <Plus className="h-3 w-3 mr-1" /> Add Ingredient
                  </Button>
                </div>
                
                {form.watch('ingredients').map((_, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <FormField
                      control={form.control}
                      name={`ingredients.${index}`}
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormControl>
                            <Input placeholder="1 cup flour" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeIngredient(index)}
                      disabled={form.watch('ingredients').length <= 1}
                      className="h-8 w-8"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
              
              {/* Instructions */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <FormLabel>Instructions</FormLabel>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addInstruction}
                    className="text-xs"
                  >
                    <Plus className="h-3 w-3 mr-1" /> Add Step
                  </Button>
                </div>
                
                {form.watch('instructions').map((_, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="flex-shrink-0 w-7 h-7 rounded-full bg-purple-100 flex items-center justify-center text-xs font-medium text-purple-700">
                      {index + 1}
                    </div>
                    <FormField
                      control={form.control}
                      name={`instructions.${index}`}
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormControl>
                            <Textarea 
                              placeholder="Mix dry ingredients together..." 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeInstruction(index)}
                      disabled={form.watch('instructions').length <= 1}
                      className="h-8 w-8"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
              
              <div className="pt-4 flex justify-end space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/planner')}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit"
                  className="bg-purple-600 hover:bg-purple-700"
                  disabled={isLoading}
                >
                  <Save className="h-4 w-4 mr-2" />
                  {isLoading ? 'Saving...' : 'Save Recipe'}
                </Button>
              </div>
            </form>
          </Form>
        </Card>
      </div>
    </div>
  );
};

export default CreateRecipe;
