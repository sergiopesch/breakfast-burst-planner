
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from "react-hook-form";
import { v4 as uuidv4 } from 'uuid';
import { Save, Plus, X, ArrowLeft, Image as ImageIcon } from "lucide-react";

import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase, uploadRecipeImage } from '@/lib/supabase';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

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
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 md:px-6 py-8 max-w-2xl">
        {/* Header */}
        <div className="mb-8">
          <Link
            to="/planner"
            className="group inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors mb-6"
          >
            <ArrowLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" />
            Back to Planner
          </Link>

          <span className="text-xs font-medium tracking-widest uppercase text-muted-foreground mb-2 block">
            New recipe
          </span>
          <h1 className="text-2xl md:text-3xl font-medium text-foreground">
            Create Recipe
          </h1>
        </div>

        {/* Form */}
        <div className="bg-card/50 backdrop-blur-sm rounded-xl border border-border/40 p-6 md:p-8 shadow-elegant">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {/* Recipe Title */}
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">Recipe Title</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Delicious Pancakes"
                        className="rounded-lg border-border/50 focus:border-foreground/30"
                        {...field}
                      />
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
                    <FormLabel className="text-sm font-medium">Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="A brief description of your recipe..."
                        className="rounded-lg border-border/50 focus:border-foreground/30 min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Image Upload */}
              <div className="space-y-3">
                <FormLabel className="text-sm font-medium">Recipe Image</FormLabel>
                <div className="flex items-start gap-4">
                  <label className="flex-1 cursor-pointer">
                    <div className={`border-2 border-dashed rounded-xl p-6 text-center transition-colors ${
                      imagePreview ? 'border-foreground/20' : 'border-border/50 hover:border-foreground/20'
                    }`}>
                      {imagePreview ? (
                        <div className="relative">
                          <img
                            src={imagePreview}
                            alt="Recipe preview"
                            className="w-full h-40 object-cover rounded-lg"
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            className="absolute -top-2 -right-2 h-7 w-7 rounded-full"
                            onClick={(e) => {
                              e.preventDefault();
                              setSelectedImage(null);
                              setImagePreview(null);
                            }}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        <div className="py-4">
                          <ImageIcon className="h-8 w-8 mx-auto text-muted-foreground/40 mb-2" />
                          <p className="text-sm text-muted-foreground">Click to upload an image</p>
                          <p className="text-xs text-muted-foreground/60 mt-1">PNG, JPG up to 10MB</p>
                        </div>
                      )}
                    </div>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleImageSelect}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Prep Time */}
                <FormField
                  control={form.control}
                  name="prepTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">Prep Time</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="20 minutes"
                          className="rounded-lg border-border/50 focus:border-foreground/30"
                          {...field}
                        />
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
                      <FormLabel className="text-sm font-medium">Servings</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="1"
                          className="rounded-lg border-border/50 focus:border-foreground/30"
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
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <FormLabel className="text-sm font-medium">Ingredients</FormLabel>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={addIngredient}
                    className="text-xs text-muted-foreground hover:text-foreground"
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
                            <Input
                              placeholder="1 cup flour"
                              className="rounded-lg border-border/50 focus:border-foreground/30"
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
                      onClick={() => removeIngredient(index)}
                      disabled={form.watch('ingredients').length <= 1}
                      className="h-9 w-9 rounded-full text-muted-foreground hover:text-destructive"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>

              {/* Instructions */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <FormLabel className="text-sm font-medium">Instructions</FormLabel>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={addInstruction}
                    className="text-xs text-muted-foreground hover:text-foreground"
                  >
                    <Plus className="h-3 w-3 mr-1" /> Add Step
                  </Button>
                </div>

                {form.watch('instructions').map((_, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-7 h-7 rounded-full bg-secondary flex items-center justify-center text-xs font-medium text-secondary-foreground mt-2">
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
                              className="rounded-lg border-border/50 focus:border-foreground/30 min-h-[80px]"
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
                      className="h-9 w-9 rounded-full text-muted-foreground hover:text-destructive mt-2"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>

              {/* Actions */}
              <div className="pt-4 flex justify-end gap-3">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => navigate('/planner')}
                  className="rounded-full"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="btn-primary rounded-full px-6"
                  disabled={isLoading}
                >
                  <Save className="h-4 w-4 mr-2" />
                  {isLoading ? 'Saving...' : 'Save Recipe'}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default CreateRecipe;
