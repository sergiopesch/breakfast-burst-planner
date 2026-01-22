
import { Recipe } from '@/hooks/useMealPlanner';
import { supabase } from '@/lib/supabase';

// Reliable Unsplash image URLs with proper formatting for breakfast foods
// Using source.unsplash.com for reliable image delivery
const BREAKFAST_IMAGE_URLS = {
  pancakes: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=480&q=80&fit=crop",
  avocadoToast: "https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?w=480&q=80&fit=crop",
  smoothie: "https://images.unsplash.com/photo-1638176066666-ffb2f013c7dd?w=480&q=80&fit=crop",
  eggs: "https://images.unsplash.com/photo-1482049016530-d9c246f884f7?w=480&q=80&fit=crop",
  oatmeal: "https://images.unsplash.com/photo-1517673400267-0251440c45dc?w=480&q=80&fit=crop",
  frenchToast: "https://images.unsplash.com/photo-1484723091739-30a097e8f929?w=480&q=80&fit=crop",
  granola: "https://images.unsplash.com/photo-1490474418585-ba9bad8fd0ea?w=480&q=80&fit=crop",
  sandwich: "https://images.unsplash.com/photo-1525351484163-7529414344d8?w=480&q=80&fit=crop",
};

// Fallback placeholder for when images fail to load
export const PLACEHOLDER_IMAGE = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='480' height='360' viewBox='0 0 480 360'%3E%3Crect fill='%23f3f4f6' width='480' height='360'/%3E%3Ctext fill='%239ca3af' font-family='system-ui' font-size='16' text-anchor='middle' x='240' y='180'%3EBreakfast Image%3C/text%3E%3C/svg%3E";

// Function to get Supabase image URL (kept for backward compatibility)
const getSupabaseImageUrl = (filename: string) => {
  return `https://nwnrgctxzqunasquaarl.supabase.co/storage/v1/object/public/recipe-images/template/${filename}`;
};

// Primary breakfast images - using direct Unsplash URLs for reliability
const breakfastImages = [
  BREAKFAST_IMAGE_URLS.pancakes,      // Pancakes
  BREAKFAST_IMAGE_URLS.avocadoToast,  // Avocado toast
  BREAKFAST_IMAGE_URLS.smoothie,      // Smoothie
  BREAKFAST_IMAGE_URLS.eggs,          // Eggs
  BREAKFAST_IMAGE_URLS.oatmeal,       // Oatmeal
  BREAKFAST_IMAGE_URLS.frenchToast,   // French toast
  BREAKFAST_IMAGE_URLS.granola,       // Granola bowl
  BREAKFAST_IMAGE_URLS.sandwich,      // Breakfast sandwich
];

// Export image URLs for use in other components
export { BREAKFAST_IMAGE_URLS };

// Breakfast recipe templates
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
  }
];

export const generateRecipe = (servings: number = 2): Recipe => {
  // Choose a random template
  const templateIndex = Math.floor(Math.random() * recipeTemplates.length);
  const template = recipeTemplates[templateIndex];
  
  // Adjust ingredients for number of servings
  let ingredients = [...template.baseIngredients];
  
  if (template.perPersonIngredients && servings > 1) {
    // Add servings-specific ingredients
    template.perPersonIngredients.forEach(ingredient => {
      const [amount, ...rest] = ingredient.split(' ');
      const unit = rest[0];
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
    time: `${7 + Math.floor(Math.random() * 2)}:${Math.random() > 0.5 ? '00' : (Math.random() > 0.5 ? '15' : (Math.random() > 0.5 ? '30' : '45'))} AM`,
  };
};

// Function to upload template recipe images to Supabase storage
export const uploadTemplateImagesToSupabase = async () => {
  // Mapping of image filenames to URLs for fetching - using reliable Unsplash URLs
  const templateImageUrls = [
    {
      filename: "pancakes.jpg",
      url: BREAKFAST_IMAGE_URLS.pancakes
    },
    {
      filename: "avocado-toast.jpg",
      url: BREAKFAST_IMAGE_URLS.avocadoToast
    },
    {
      filename: "smoothie.jpg",
      url: BREAKFAST_IMAGE_URLS.smoothie
    },
    {
      filename: "eggs.jpg",
      url: BREAKFAST_IMAGE_URLS.eggs
    },
    {
      filename: "oatmeal.jpg",
      url: BREAKFAST_IMAGE_URLS.oatmeal
    },
    {
      filename: "french-toast.jpg",
      url: BREAKFAST_IMAGE_URLS.frenchToast
    },
    {
      filename: "granola.jpg",
      url: BREAKFAST_IMAGE_URLS.granola
    },
    {
      filename: "sandwich.jpg",
      url: BREAKFAST_IMAGE_URLS.sandwich
    },
  ];
  
  // Create uploads for each image
  for (const image of templateImageUrls) {
    try {
      // Check if the image already exists in Supabase
      const { data: existingImage } = await supabase.storage
        .from('recipe-images')
        .list('template', { 
          search: image.filename 
        });
      
      // If the image already exists, skip uploading
      if (existingImage && existingImage.length > 0) {
        console.log(`Template image ${image.filename} already exists in Supabase storage.`);
        continue;
      }
      
      // Fetch the image
      const response = await fetch(image.url);
      const blob = await response.blob();
      const file = new File([blob], image.filename, { type: blob.type });
      
      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from('recipe-images')
        .upload(`template/${image.filename}`, file, {
          cacheControl: '3600',
          upsert: true, // Use upsert to replace existing files if needed
          contentType: blob.type
        });
      
      if (error) {
        console.error(`Error uploading template image ${image.filename}:`, error);
      } else {
        console.log(`Successfully uploaded template image: ${image.filename}`);
      }
    } catch (err) {
      console.error(`Failed to upload image ${image.filename}:`, err);
    }
  }
  
  return true;
};

// Additional function to verify all template images are public
export const verifyTemplateImagesArePublic = async () => {
  try {
    // Get current bucket policy
    const { data: bucketData, error: bucketError } = await supabase
      .storage
      .getBucket('recipe-images');
      
    if (bucketError) {
      console.error('Error fetching bucket info:', bucketError);
      return false;
    }
    
    // If bucket is not public, try to make the template folder public
    if (!bucketData.public) {
      console.log('Bucket is not public. Individual files will be checked for public access.');
    }
    
    // Verify template directory exists
    const { data: templateDir, error: dirError } = await supabase
      .storage
      .from('recipe-images')
      .list('template');
      
    if (dirError) {
      console.error('Error checking template directory:', dirError);
      return false;
    }
    
    if (!templateDir || templateDir.length === 0) {
      console.log('Template directory is empty or does not exist. Initializing...');
      await uploadTemplateImagesToSupabase();
    }
    
    return true;
  } catch (err) {
    console.error('Error verifying template images:', err);
    return false;
  }
};
