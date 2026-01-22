
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

// Extended recipe database with dietary and cuisine tags
interface CategorizedRecipe extends RecipeTemplate {
  dietary: string[];
  cuisine: string;
}

const categorizedRecipes: CategorizedRecipe[] = [
  // American Classic
  {
    title: "Fluffy Buttermilk Pancakes",
    description: "Deliciously fluffy pancakes served with maple syrup and fresh berries",
    prepTime: "20 min",
    baseIngredients: ["1 1/2 cups flour", "2 tbsp sugar", "1 tsp baking powder", "1 3/4 cups buttermilk", "2 eggs", "3 tbsp butter"],
    baseInstructions: ["Mix dry ingredients", "Whisk wet ingredients", "Combine and cook on griddle"],
    imageIndex: 0,
    dietary: ['vegetarian'],
    cuisine: 'american'
  },
  {
    title: "Classic Eggs Benedict",
    description: "Perfectly poached eggs on English muffins with hollandaise sauce",
    prepTime: "25 min",
    baseIngredients: ["English muffins", "4 eggs", "Canadian bacon", "Butter", "Lemon juice"],
    baseInstructions: ["Make hollandaise", "Poach eggs", "Toast muffins", "Assemble and serve"],
    imageIndex: 3,
    dietary: [],
    cuisine: 'american'
  },
  {
    title: "Cinnamon French Toast",
    description: "Golden crispy French toast with warm cinnamon and maple syrup",
    prepTime: "15 min",
    baseIngredients: ["Brioche bread", "3 eggs", "1 cup milk", "1 tsp cinnamon", "Butter", "Maple syrup"],
    baseInstructions: ["Whisk eggs, milk, cinnamon", "Dip bread", "Cook until golden", "Serve with syrup"],
    imageIndex: 5,
    dietary: ['vegetarian'],
    cuisine: 'american'
  },
  // Health-Focused
  {
    title: "Acai Power Bowl",
    description: "Antioxidant-rich acai smoothie bowl with fresh toppings",
    prepTime: "10 min",
    baseIngredients: ["Frozen acai", "1 banana", "1/2 cup berries", "Almond milk", "Granola", "Coconut flakes"],
    baseInstructions: ["Blend acai, banana, berries, milk", "Pour into bowl", "Add toppings"],
    imageIndex: 2,
    dietary: ['vegan', 'gluten-free', 'dairy-free'],
    cuisine: 'healthy'
  },
  {
    title: "Green Goddess Smoothie Bowl",
    description: "Nutrient-packed green smoothie with spinach and tropical fruits",
    prepTime: "8 min",
    baseIngredients: ["2 cups spinach", "1 banana", "1/2 cup mango", "Coconut water", "Chia seeds", "Hemp hearts"],
    baseInstructions: ["Blend spinach, banana, mango, coconut water", "Top with seeds"],
    imageIndex: 2,
    dietary: ['vegan', 'gluten-free', 'dairy-free'],
    cuisine: 'healthy'
  },
  {
    title: "Overnight Chia Pudding",
    description: "No-cook breakfast pudding with chia seeds and fresh fruit",
    prepTime: "5 min + overnight",
    baseIngredients: ["3 tbsp chia seeds", "1 cup coconut milk", "1 tbsp maple syrup", "Vanilla", "Fresh fruit"],
    baseInstructions: ["Mix chia with milk and sweetener", "Refrigerate overnight", "Top with fruit"],
    imageIndex: 6,
    dietary: ['vegan', 'gluten-free', 'dairy-free'],
    cuisine: 'healthy'
  },
  {
    title: "Protein Oatmeal Bowl",
    description: "Hearty oatmeal with nut butter and banana slices",
    prepTime: "10 min",
    baseIngredients: ["1 cup oats", "2 cups water", "1 banana", "2 tbsp almond butter", "Cinnamon", "Honey"],
    baseInstructions: ["Cook oats with water", "Top with banana and almond butter", "Drizzle with honey"],
    imageIndex: 4,
    dietary: ['vegan', 'dairy-free'],
    cuisine: 'healthy'
  },
  // Mediterranean
  {
    title: "Greek Yogurt Parfait",
    description: "Creamy Greek yogurt layered with honey, nuts, and fresh berries",
    prepTime: "5 min",
    baseIngredients: ["2 cups Greek yogurt", "1/4 cup honey", "1/2 cup granola", "Mixed berries", "Chopped walnuts"],
    baseInstructions: ["Layer yogurt in glass", "Add granola and berries", "Drizzle with honey", "Top with walnuts"],
    imageIndex: 6,
    dietary: ['vegetarian', 'gluten-free'],
    cuisine: 'mediterranean'
  },
  {
    title: "Avocado Toast Mediterranean",
    description: "Sourdough topped with avocado, feta, tomatoes, and herbs",
    prepTime: "10 min",
    baseIngredients: ["Sourdough bread", "2 avocados", "Cherry tomatoes", "Feta cheese", "Olive oil", "Fresh herbs"],
    baseInstructions: ["Toast bread", "Mash avocado with olive oil", "Top with tomatoes and feta", "Garnish with herbs"],
    imageIndex: 1,
    dietary: ['vegetarian'],
    cuisine: 'mediterranean'
  },
  {
    title: "Shakshuka",
    description: "Eggs poached in spiced tomato sauce with bell peppers",
    prepTime: "25 min",
    baseIngredients: ["4 eggs", "Tomato sauce", "Bell peppers", "Onion", "Cumin", "Paprika", "Fresh parsley"],
    baseInstructions: ["Sauté peppers and onion", "Add tomatoes and spices", "Create wells and crack eggs", "Cover and cook until set"],
    imageIndex: 3,
    dietary: ['vegetarian', 'gluten-free'],
    cuisine: 'mediterranean'
  },
  // European
  {
    title: "French Crepes",
    description: "Delicate thin pancakes with Nutella and fresh strawberries",
    prepTime: "20 min",
    baseIngredients: ["1 cup flour", "2 eggs", "1/2 cup milk", "Butter", "Nutella", "Fresh strawberries"],
    baseInstructions: ["Make batter", "Cook thin crepes", "Fill with Nutella", "Top with strawberries"],
    imageIndex: 0,
    dietary: ['vegetarian'],
    cuisine: 'european'
  },
  {
    title: "Belgian Waffles",
    description: "Light and crispy waffles with whipped cream and berries",
    prepTime: "25 min",
    baseIngredients: ["2 cups flour", "3 eggs", "1/2 cup butter", "2 cups milk", "Whipped cream", "Fresh berries"],
    baseInstructions: ["Make batter", "Cook in waffle iron", "Top with cream and berries"],
    imageIndex: 0,
    dietary: ['vegetarian'],
    cuisine: 'european'
  },
  {
    title: "Croissant with Jam",
    description: "Buttery croissant served with artisan jam and fresh fruit",
    prepTime: "5 min",
    baseIngredients: ["Fresh croissants", "Artisan jam", "Butter", "Fresh fruit", "Powdered sugar"],
    baseInstructions: ["Warm croissants", "Serve with butter and jam", "Garnish with fruit"],
    imageIndex: 7,
    dietary: ['vegetarian'],
    cuisine: 'european'
  },
  // Asian
  {
    title: "Japanese Tamagoyaki",
    description: "Sweet rolled omelette with miso soup and rice",
    prepTime: "15 min",
    baseIngredients: ["4 eggs", "1 tbsp sugar", "1 tbsp soy sauce", "Dashi", "Rice", "Miso paste"],
    baseInstructions: ["Mix eggs with seasonings", "Cook in layers, rolling as you go", "Serve with rice and miso"],
    imageIndex: 3,
    dietary: ['gluten-free', 'dairy-free'],
    cuisine: 'asian'
  },
  {
    title: "Congee with Toppings",
    description: "Comforting rice porridge with savory toppings",
    prepTime: "30 min",
    baseIngredients: ["1 cup rice", "8 cups water", "Ginger", "Green onions", "Soy sauce", "Sesame oil"],
    baseInstructions: ["Simmer rice in water until porridge consistency", "Season with ginger", "Top with green onions and drizzle sesame oil"],
    imageIndex: 4,
    dietary: ['vegan', 'gluten-free', 'dairy-free'],
    cuisine: 'asian'
  },
  // Vegan options
  {
    title: "Tofu Scramble",
    description: "Seasoned tofu scramble with vegetables and spices",
    prepTime: "15 min",
    baseIngredients: ["1 block firm tofu", "Turmeric", "Nutritional yeast", "Bell peppers", "Spinach", "Onion"],
    baseInstructions: ["Crumble tofu", "Sauté with vegetables", "Season with turmeric and nutritional yeast"],
    imageIndex: 3,
    dietary: ['vegan', 'gluten-free', 'dairy-free'],
    cuisine: 'healthy'
  },
  {
    title: "Avocado Toast Deluxe",
    description: "Loaded avocado toast with seeds and microgreens",
    prepTime: "8 min",
    baseIngredients: ["Whole grain bread", "2 avocados", "Lemon juice", "Hemp seeds", "Microgreens", "Red pepper flakes"],
    baseInstructions: ["Toast bread", "Mash avocado with lemon", "Spread on toast", "Top with seeds and greens"],
    imageIndex: 1,
    dietary: ['vegan', 'dairy-free'],
    cuisine: 'healthy'
  },
  // Low-carb options
  {
    title: "Keto Egg Muffins",
    description: "Protein-packed egg muffins with cheese and vegetables",
    prepTime: "25 min",
    baseIngredients: ["6 eggs", "1/2 cup cheese", "Spinach", "Bell peppers", "Bacon bits", "Heavy cream"],
    baseInstructions: ["Whisk eggs with cream", "Add vegetables and cheese", "Bake in muffin tin until set"],
    imageIndex: 3,
    dietary: ['low-carb', 'gluten-free'],
    cuisine: 'american'
  },
  {
    title: "Vegetable Frittata",
    description: "Italian-style baked egg dish with seasonal vegetables",
    prepTime: "25 min",
    baseIngredients: ["6 eggs", "1/4 cup milk", "Bell peppers", "Spinach", "Onion", "Cheese", "Herbs"],
    baseInstructions: ["Sauté vegetables", "Pour beaten eggs over", "Bake until golden"],
    imageIndex: 3,
    dietary: ['vegetarian', 'low-carb', 'gluten-free'],
    cuisine: 'mediterranean'
  }
];

// Filter recipes based on preferences
const filterRecipes = (
  dietary: string[],
  cuisine: string
): CategorizedRecipe[] => {
  return categorizedRecipes.filter(recipe => {
    // Check cuisine (any matches everything)
    const cuisineMatch = cuisine === 'any' || recipe.cuisine === cuisine;

    // Check dietary preferences
    const dietaryMatch = dietary.includes('none') ||
      dietary.every(pref => recipe.dietary.includes(pref));

    return cuisineMatch && dietaryMatch;
  });
};

// Generate a batch of unique recipes for meal planning
export const generateMealPlan = async (
  daysToplan: number,
  servings: number,
  dietaryPreferences: string[] = ['none'],
  cuisineStyle: string = 'any'
): Promise<Recipe[]> => {
  const recipes: Recipe[] = [];
  const usedTitles = new Set<string>();

  // Filter available recipes based on preferences
  let availableRecipes = filterRecipes(dietaryPreferences, cuisineStyle);

  // If no recipes match, fall back to all recipes
  if (availableRecipes.length === 0) {
    console.warn('No recipes match preferences, using all recipes');
    availableRecipes = categorizedRecipes;
  }

  for (let i = 0; i < daysToplan; i++) {
    // Find a recipe that hasn't been used
    const unusedRecipes = availableRecipes.filter(r => !usedTitles.has(r.title));

    // If we've used all recipes, reset
    const recipesToChooseFrom = unusedRecipes.length > 0 ? unusedRecipes : availableRecipes;

    // Pick a random recipe
    const randomIndex = Math.floor(Math.random() * recipesToChooseFrom.length);
    const template = recipesToChooseFrom[randomIndex];

    usedTitles.add(template.title);

    // Create the recipe
    const recipe: Recipe = {
      id: Date.now() + i,
      title: template.title,
      description: template.description,
      prepTime: template.prepTime,
      servings,
      image: breakfastImages[template.imageIndex],
      ingredients: template.baseIngredients,
      instructions: template.baseInstructions,
      time: `${7 + Math.floor(Math.random() * 2)}:${['00', '15', '30', '45'][Math.floor(Math.random() * 4)]} AM`,
      status: 'planned'
    };

    recipes.push(recipe);
  }

  return recipes;
};

// Generate a single recipe with preferences
export const generateRecipeWithPreferences = (
  servings: number = 2,
  dietaryPreferences: string[] = ['none'],
  cuisineStyle: string = 'any'
): Recipe => {
  let availableRecipes = filterRecipes(dietaryPreferences, cuisineStyle);

  if (availableRecipes.length === 0) {
    availableRecipes = categorizedRecipes;
  }

  const randomIndex = Math.floor(Math.random() * availableRecipes.length);
  const template = availableRecipes[randomIndex];

  return {
    id: Date.now(),
    title: template.title,
    description: template.description,
    prepTime: template.prepTime,
    servings,
    image: breakfastImages[template.imageIndex],
    ingredients: template.baseIngredients,
    instructions: template.baseInstructions,
    time: `${7 + Math.floor(Math.random() * 2)}:${['00', '15', '30', '45'][Math.floor(Math.random() * 4)]} AM`,
  };
};
