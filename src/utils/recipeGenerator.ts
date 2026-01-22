
import { Recipe } from '@/hooks/useMealPlanner';
import { supabase } from '@/lib/supabase';
import { isGeminiAvailable, generateBreakfastRecipe, AIGeneratedRecipe } from '@/services/gemini';
import { getImageForRecipe, getImageCategoryFromTitle } from '@/services/imageService';

// Reliable Unsplash image URLs for breakfast recipes - carefully curated and verified
const breakfastImages = [
  'https://images.unsplash.com/photo-1554520735-0a6b8b6ce8b7?w=800&q=80',  // Pancakes
  'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=800&q=80',  // Avocado toast
  'https://images.unsplash.com/photo-1590301157890-4810ed352733?w=800&q=80',  // Smoothie bowl
  'https://images.unsplash.com/photo-1510693206972-df098062cb71?w=800&q=80',  // Eggs/Frittata
  'https://images.unsplash.com/photo-1517673132405-a56a62b18caf?w=800&q=80',  // Oatmeal
  'https://images.unsplash.com/photo-1484723091739-30a097e8f929?w=800&q=80',  // French toast
  'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=800&q=80',  // Granola bowl
  'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=800&q=80',  // Breakfast sandwich
];

// Breakfast recipe templates (fallback when AI is not available)
interface RecipeTemplate {
  title: string;
  description: string;
  prepTime: string;
  baseIngredients: string[];
  baseInstructions: string[];
  imageIndex: number;
  perPersonIngredients?: string[];
}

const recipeTemplates: RecipeTemplate[] = [
  {
    title: "Fluffy Buttermilk Pancakes",
    description: "Deliciously fluffy pancakes served with maple syrup and fresh berries",
    prepTime: "20 min",
    baseIngredients: [
      "1 1/2 cups all-purpose flour",
      "3 tablespoons sugar",
      "1 teaspoon baking powder",
      "1/2 teaspoon baking soda",
      "1/4 teaspoon salt",
      "1 3/4 cups buttermilk",
      "2 large eggs",
      "3 tablespoons unsalted butter, melted",
      "Vegetable oil for griddle",
      "Maple syrup and fresh berries for serving"
    ],
    perPersonIngredients: ["1 large egg", "1/4 cup fresh berries"],
    baseInstructions: [
      "Whisk together flour, sugar, baking powder, baking soda, and salt in a large bowl",
      "In a separate bowl, whisk buttermilk, eggs, and melted butter",
      "Pour wet ingredients into dry ingredients and whisk until just combined (lumps are okay)",
      "Heat griddle or non-stick pan over medium heat and brush with oil",
      "Pour 1/4 cup batter for each pancake and cook until bubbles appear on surface",
      "Flip and cook until golden brown on other side",
      "Serve with maple syrup and fresh berries"
    ],
    imageIndex: 0
  },
  {
    title: "Avocado Toast with Poached Eggs",
    description: "Creamy avocado on toasted sourdough topped with perfectly poached eggs",
    prepTime: "15 min",
    baseIngredients: [
      "Sourdough bread slices",
      "Ripe avocados",
      "Fresh lemon juice",
      "Salt and pepper",
      "Red pepper flakes",
      "Large eggs",
      "1 tablespoon white vinegar (for poaching)",
      "Fresh herbs for garnish (optional)"
    ],
    perPersonIngredients: ["1 slice sourdough bread", "1/2 avocado", "1 large egg"],
    baseInstructions: [
      "Toast bread slices until golden and crisp",
      "In a bowl, mash avocados with lemon juice, salt and pepper",
      "Bring a pot of water to a gentle simmer, add vinegar",
      "Crack eggs one at a time into a small cup, then gently slide into water",
      "Poach eggs for 3-4 minutes until whites are set but yolks are still runny",
      "Spread mashed avocado on toast slices",
      "Top each toast with a poached egg, sprinkle with salt, pepper, and red pepper flakes"
    ],
    imageIndex: 1
  },
  {
    title: "Berry Protein Smoothie Bowl",
    description: "Nutrient-packed smoothie bowl topped with granola, seeds, and fresh fruit",
    prepTime: "10 min",
    baseIngredients: [
      "Frozen mixed berries",
      "Banana",
      "Greek yogurt",
      "Protein powder (optional)",
      "Almond milk",
      "Honey or maple syrup",
      "Granola",
      "Chia seeds",
      "Fresh berries for topping",
      "Sliced almonds"
    ],
    perPersonIngredients: ["1/2 cup frozen berries", "1/4 banana", "1/4 cup Greek yogurt", "1/4 cup granola"],
    baseInstructions: [
      "Blend frozen berries, banana, yogurt, protein powder (if using), almond milk, and sweetener until smooth",
      "Pour into bowls (mixture should be thick enough to eat with a spoon)",
      "Top with granola, fresh berries, chia seeds, and sliced almonds",
      "Drizzle with additional honey if desired"
    ],
    imageIndex: 2
  },
  {
    title: "Vegetable Frittata",
    description: "Italian-style baked egg dish with seasonal vegetables and cheese",
    prepTime: "25 min",
    baseIngredients: [
      "Large eggs",
      "Milk",
      "Olive oil",
      "Red bell pepper, diced",
      "Spinach leaves",
      "Onion, diced",
      "Shredded cheese (cheddar, mozzarella, or feta)",
      "Fresh herbs (parsley, chives)",
      "Salt and pepper"
    ],
    perPersonIngredients: ["2 large eggs", "2 tablespoons milk", "1/4 cup shredded cheese"],
    baseInstructions: [
      "Preheat oven to 350°F (175°C)",
      "Whisk eggs with milk, salt, and pepper in a bowl",
      "Heat olive oil in an oven-safe skillet over medium heat",
      "Sauté onions and peppers until soft, about 5 minutes",
      "Add spinach and cook until wilted",
      "Pour egg mixture over vegetables and cook until edges begin to set",
      "Sprinkle cheese on top",
      "Transfer skillet to oven and bake until fully set, about 15 minutes",
      "Let cool slightly before slicing and serving"
    ],
    imageIndex: 3
  },
  {
    title: "Overnight Chia Pudding",
    description: "No-cook breakfast pudding with chia seeds, coconut milk, and fresh fruit",
    prepTime: "5 min + overnight",
    baseIngredients: [
      "Chia seeds",
      "Coconut milk (or almond milk)",
      "Maple syrup or honey",
      "Vanilla extract",
      "Pinch of salt",
      "Fresh fruits (berries, mango, banana)",
      "Shredded coconut for topping",
      "Nuts or granola for topping"
    ],
    perPersonIngredients: ["3 tablespoons chia seeds", "3/4 cup coconut milk", "1 teaspoon maple syrup"],
    baseInstructions: [
      "In a bowl or jar, mix chia seeds, milk, sweetener, vanilla, and salt",
      "Stir well, making sure there are no clumps",
      "Cover and refrigerate overnight (at least 4 hours)",
      "Stir again before serving",
      "Top with fresh fruits, coconut, and nuts or granola",
      "Can be stored in the refrigerator for up to 3 days"
    ],
    imageIndex: 4
  },
  {
    title: "Classic Eggs Benedict",
    description: "Perfectly poached eggs on English muffins with hollandaise sauce",
    prepTime: "25 min",
    baseIngredients: [
      "English muffins",
      "Large eggs",
      "Canadian bacon or smoked salmon",
      "Butter",
      "Egg yolks for hollandaise",
      "Lemon juice",
      "White vinegar",
      "Paprika for garnish",
      "Fresh chives"
    ],
    perPersonIngredients: ["1 English muffin", "2 large eggs", "2 slices Canadian bacon"],
    baseInstructions: [
      "Make hollandaise: whisk egg yolks and lemon juice over simmering water until thick",
      "Slowly drizzle in melted butter while whisking",
      "Toast English muffins and warm Canadian bacon",
      "Poach eggs in simmering water with vinegar for 3-4 minutes",
      "Assemble: muffin, bacon, poached egg, hollandaise",
      "Garnish with paprika and chives"
    ],
    imageIndex: 3
  },
  {
    title: "Cinnamon French Toast",
    description: "Golden crispy French toast with warm cinnamon and maple syrup",
    prepTime: "15 min",
    baseIngredients: [
      "Thick-sliced brioche bread",
      "Large eggs",
      "Whole milk",
      "Vanilla extract",
      "Ground cinnamon",
      "Butter for cooking",
      "Maple syrup",
      "Powdered sugar",
      "Fresh berries"
    ],
    perPersonIngredients: ["2 slices bread", "1 large egg", "1/4 cup milk"],
    baseInstructions: [
      "Whisk eggs, milk, vanilla, and cinnamon in a shallow dish",
      "Heat butter in a pan over medium heat",
      "Dip bread slices in egg mixture, coating both sides",
      "Cook until golden brown, about 3 minutes per side",
      "Serve with maple syrup, powdered sugar, and berries"
    ],
    imageIndex: 5
  },
  {
    title: "Acai Bowl",
    description: "Brazilian superfood bowl with acai, fruits, and crunchy toppings",
    prepTime: "8 min",
    baseIngredients: [
      "Frozen acai packets",
      "Frozen mixed berries",
      "Banana",
      "Almond milk",
      "Granola",
      "Fresh strawberries",
      "Blueberries",
      "Coconut flakes",
      "Honey"
    ],
    perPersonIngredients: ["1 acai packet", "1/2 banana", "1/4 cup granola"],
    baseInstructions: [
      "Blend acai, frozen berries, half banana, and almond milk until thick",
      "Pour into a bowl",
      "Top with sliced banana, fresh berries, granola, and coconut",
      "Drizzle with honey and serve immediately"
    ],
    imageIndex: 2
  }
];

// Generate a recipe using AI (Gemini) if available, otherwise use templates
export const generateRecipeWithAI = async (
  servings: number = 2,
  preferences?: {
    cuisine?: string;
    dietaryRestrictions?: string[];
    maxPrepTime?: number;
    difficulty?: 'easy' | 'medium' | 'hard';
  }
): Promise<Recipe> => {
  // Try AI generation first
  if (isGeminiAvailable()) {
    try {
      const aiRecipe = await generateBreakfastRecipe({
        ...preferences,
        servings,
      });

      if (aiRecipe) {
        // Get a relevant image for the AI-generated recipe
        const image = await getImageForRecipe(aiRecipe.title);

        return {
          id: Date.now(),
          title: aiRecipe.title,
          description: aiRecipe.description,
          prepTime: aiRecipe.prepTime,
          servings: aiRecipe.servings,
          image,
          ingredients: aiRecipe.ingredients,
          instructions: aiRecipe.instructions,
          time: `${7 + Math.floor(Math.random() * 2)}:${['00', '15', '30', '45'][Math.floor(Math.random() * 4)]} AM`,
        };
      }
    } catch (error) {
      console.error('AI recipe generation failed, using template:', error);
    }
  }

  // Fallback to template-based generation
  return generateRecipe(servings);
};

// Template-based recipe generation (fallback)
export const generateRecipe = (servings: number = 2): Recipe => {
  // Choose a random template
  const templateIndex = Math.floor(Math.random() * recipeTemplates.length);
  const template = recipeTemplates[templateIndex];

  // Adjust ingredients for number of servings
  let ingredients = [...template.baseIngredients];

  if (template.perPersonIngredients && servings > 1) {
    template.perPersonIngredients.forEach(ingredient => {
      const [amount, ...rest] = ingredient.split(' ');
      if (!isNaN(parseFloat(amount))) {
        const newAmount = parseFloat(amount) * servings;
        ingredients.push(`${newAmount} ${rest.join(' ')}`);
      } else {
        ingredients.push(`${servings} ${ingredient}`);
      }
    });
  }

  // Generate unique ID
  const id = Date.now();

  return {
    id,
    title: template.title,
    description: template.description,
    prepTime: template.prepTime,
    servings,
    image: breakfastImages[template.imageIndex],
    ingredients,
    instructions: template.baseInstructions,
    time: `${7 + Math.floor(Math.random() * 2)}:${['00', '15', '30', '45'][Math.floor(Math.random() * 4)]} AM`,
  };
};

// Check if AI recipe generation is available
export const isAIRecipeGenerationAvailable = (): boolean => {
  return isGeminiAvailable();
};

// Get the appropriate image for a recipe title
export const getRecipeImage = async (title: string): Promise<string> => {
  return getImageForRecipe(title);
};

// Get image category for a recipe (for determining which curated image to use)
export const getRecipeImageCategory = (title: string): string => {
  return getImageCategoryFromTitle(title);
};

// Legacy Supabase functions (kept for backward compatibility)
export const uploadTemplateImagesToSupabase = async () => {
  const templateImageUrls = [
    { filename: "pancakes.jpg", url: breakfastImages[0] },
    { filename: "avocado-toast.jpg", url: breakfastImages[1] },
    { filename: "smoothie.jpg", url: breakfastImages[2] },
    { filename: "eggs.jpg", url: breakfastImages[3] },
    { filename: "oatmeal.jpg", url: breakfastImages[4] },
    { filename: "french-toast.jpg", url: breakfastImages[5] },
    { filename: "granola.jpg", url: breakfastImages[6] },
    { filename: "sandwich.jpg", url: breakfastImages[7] },
  ];

  for (const image of templateImageUrls) {
    try {
      const { data: existingImage } = await supabase.storage
        .from('recipe-images')
        .list('template', { search: image.filename });

      if (existingImage && existingImage.length > 0) {
        console.log(`Template image ${image.filename} already exists.`);
        continue;
      }

      const response = await fetch(image.url);
      const blob = await response.blob();
      const file = new File([blob], image.filename, { type: blob.type });

      const { error } = await supabase.storage
        .from('recipe-images')
        .upload(`template/${image.filename}`, file, {
          cacheControl: '3600',
          upsert: true,
          contentType: blob.type
        });

      if (error) {
        console.error(`Error uploading ${image.filename}:`, error);
      } else {
        console.log(`Uploaded: ${image.filename}`);
      }
    } catch (err) {
      console.error(`Failed to upload ${image.filename}:`, err);
    }
  }

  return true;
};

export const verifyTemplateImagesArePublic = async () => {
  try {
    const { data: bucketData, error: bucketError } = await supabase
      .storage
      .getBucket('recipe-images');

    if (bucketError) {
      console.error('Error fetching bucket info:', bucketError);
      return false;
    }

    if (!bucketData.public) {
      console.log('Bucket is not public.');
    }

    const { data: templateDir, error: dirError } = await supabase
      .storage
      .from('recipe-images')
      .list('template');

    if (dirError) {
      console.error('Error checking template directory:', dirError);
      return false;
    }

    if (!templateDir || templateDir.length === 0) {
      console.log('Template directory empty. Initializing...');
      await uploadTemplateImagesToSupabase();
    }

    return true;
  } catch (err) {
    console.error('Error verifying template images:', err);
    return false;
  }
};
