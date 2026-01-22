import { Recipe } from '@/hooks/useMealPlanner';
import { BREAKFAST_IMAGE_URLS } from '@/utils/recipeGenerator';

export type RecipeType = 'simple' | 'high-protein';

interface AIRecipeResponse {
  title: string;
  description: string;
  prepTime: string;
  ingredients: string[];
  instructions: string[];
  tags: string[];
}

// Map keywords to images for better recipe matching
const getImageForRecipe = (title: string, ingredients: string[]): string => {
  const titleLower = title.toLowerCase();
  const ingredientStr = ingredients.join(' ').toLowerCase();

  if (titleLower.includes('pancake') || titleLower.includes('waffle')) {
    return BREAKFAST_IMAGE_URLS.pancakes;
  }
  if (titleLower.includes('avocado') || titleLower.includes('toast')) {
    return BREAKFAST_IMAGE_URLS.avocadoToast;
  }
  if (titleLower.includes('smoothie') || titleLower.includes('bowl') || titleLower.includes('acai')) {
    return BREAKFAST_IMAGE_URLS.smoothie;
  }
  if (titleLower.includes('egg') || titleLower.includes('omelet') || titleLower.includes('frittata') || titleLower.includes('scramble')) {
    return BREAKFAST_IMAGE_URLS.eggs;
  }
  if (titleLower.includes('oat') || titleLower.includes('porridge') || titleLower.includes('overnight')) {
    return BREAKFAST_IMAGE_URLS.oatmeal;
  }
  if (titleLower.includes('french toast') || titleLower.includes('brioche')) {
    return BREAKFAST_IMAGE_URLS.frenchToast;
  }
  if (titleLower.includes('granola') || titleLower.includes('yogurt') || titleLower.includes('parfait')) {
    return BREAKFAST_IMAGE_URLS.granola;
  }
  if (titleLower.includes('sandwich') || titleLower.includes('wrap') || titleLower.includes('burrito')) {
    return BREAKFAST_IMAGE_URLS.sandwich;
  }

  // Fallback based on ingredients
  if (ingredientStr.includes('egg')) return BREAKFAST_IMAGE_URLS.eggs;
  if (ingredientStr.includes('oat')) return BREAKFAST_IMAGE_URLS.oatmeal;
  if (ingredientStr.includes('yogurt')) return BREAKFAST_IMAGE_URLS.granola;
  if (ingredientStr.includes('avocado')) return BREAKFAST_IMAGE_URLS.avocadoToast;

  // Random fallback from available images
  const images = Object.values(BREAKFAST_IMAGE_URLS);
  return images[Math.floor(Math.random() * images.length)];
};

// Generate recipe using Claude API (Haiku for speed)
export const generateAIRecipe = async (
  recipeType: RecipeType,
  servings: number
): Promise<Recipe> => {
  const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY;

  // If no API key, fall back to curated recipes
  if (!apiKey) {
    console.log('No Anthropic API key found, using curated recipes');
    return generateCuratedRecipe(recipeType, servings);
  }

  const typeDescription = recipeType === 'simple'
    ? 'simple and quick with common pantry ingredients, minimal steps, and easy techniques'
    : 'high in protein (at least 25g per serving) with ingredients like eggs, Greek yogurt, cottage cheese, protein powder, nuts, or lean meats';

  const prompt = `Generate a delicious, nutritious breakfast recipe that is ${typeDescription}.

Requirements:
- Must be completable in under 20 minutes total
- Serves ${servings} ${servings === 1 ? 'person' : 'people'}
- Include exact measurements scaled for ${servings} servings
- Be specific with cooking times and temperatures
- Make it genuinely delicious and satisfying

Respond ONLY with valid JSON in this exact format (no markdown, no explanation):
{
  "title": "Recipe Name",
  "description": "A brief, appetizing 1-2 sentence description",
  "prepTime": "X min",
  "ingredients": ["ingredient 1 with measurement", "ingredient 2 with measurement"],
  "instructions": ["Step 1", "Step 2", "Step 3"],
  "tags": ["tag1", "tag2"]
}`;

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true'
      },
      body: JSON.stringify({
        model: 'claude-3-5-haiku-20241022',
        max_tokens: 1024,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ]
      })
    });

    if (!response.ok) {
      console.error('AI API error:', response.status);
      return generateCuratedRecipe(recipeType, servings);
    }

    const data = await response.json();
    const content = data.content?.[0]?.text;

    if (!content) {
      console.error('No content in AI response');
      return generateCuratedRecipe(recipeType, servings);
    }

    // Parse the JSON response
    const recipeData: AIRecipeResponse = JSON.parse(content);

    return {
      id: Date.now(),
      title: recipeData.title,
      description: recipeData.description,
      prepTime: recipeData.prepTime,
      servings,
      image: getImageForRecipe(recipeData.title, recipeData.ingredients),
      ingredients: recipeData.ingredients,
      instructions: recipeData.instructions,
      time: `${7 + Math.floor(Math.random() * 2)}:${['00', '15', '30', '45'][Math.floor(Math.random() * 4)]} AM`,
      status: 'planned'
    };
  } catch (error) {
    console.error('Error generating AI recipe:', error);
    return generateCuratedRecipe(recipeType, servings);
  }
};

// Curated recipes as fallback when API is unavailable
const curatedSimpleRecipes = [
  {
    title: "5-Minute Avocado Toast",
    description: "Creamy mashed avocado on crispy toast with a sprinkle of everything bagel seasoning - simple, satisfying, and ready in minutes",
    prepTime: "5 min",
    baseIngredients: ["ripe avocado", "slice of your favorite bread", "pinch of salt", "squeeze of lemon juice", "everything bagel seasoning or red pepper flakes"],
    perPersonIngredients: { avocado: 0.5, bread: 1 },
    instructions: [
      "Toast bread until golden and crispy",
      "Cut avocado in half, remove pit, and scoop flesh into a bowl",
      "Mash avocado with a fork, add salt and lemon juice",
      "Spread onto toast and top with your choice of seasoning"
    ]
  },
  {
    title: "Classic Scrambled Eggs",
    description: "Perfectly soft and fluffy scrambled eggs made with butter - a timeless breakfast that never disappoints",
    prepTime: "8 min",
    baseIngredients: ["large eggs", "butter", "salt and pepper", "optional: fresh chives or cheese"],
    perPersonIngredients: { eggs: 2, butter: "1 tbsp" },
    instructions: [
      "Crack eggs into a bowl and whisk until yolks and whites are combined",
      "Melt butter in a non-stick pan over medium-low heat",
      "Pour in eggs and let sit for 20 seconds",
      "Gently push eggs from edges to center, creating soft curds",
      "Remove from heat while still slightly wet - they'll continue cooking",
      "Season with salt, pepper, and optional toppings"
    ]
  },
  {
    title: "Berry Overnight Oats",
    description: "Prep the night before and wake up to a creamy, fruity breakfast ready to grab and go",
    prepTime: "5 min + overnight",
    baseIngredients: ["rolled oats", "milk of choice", "Greek yogurt", "honey or maple syrup", "mixed berries", "chia seeds"],
    perPersonIngredients: { oats: "1/2 cup", milk: "1/2 cup", yogurt: "1/4 cup" },
    instructions: [
      "Combine oats, milk, yogurt, and sweetener in a jar or container",
      "Add chia seeds and stir well",
      "Top with berries (push some down into the mixture)",
      "Cover and refrigerate overnight (or at least 4 hours)",
      "Enjoy cold or warm up in the microwave"
    ]
  },
  {
    title: "Peanut Butter Banana Toast",
    description: "A satisfying combination of creamy peanut butter and sweet banana slices on toasted bread",
    prepTime: "5 min",
    baseIngredients: ["bread slice", "peanut butter or almond butter", "ripe banana", "honey drizzle", "optional: cinnamon or hemp seeds"],
    perPersonIngredients: { bread: 1, banana: 0.5, peanutButter: "2 tbsp" },
    instructions: [
      "Toast bread to desired crispness",
      "Spread a generous layer of nut butter",
      "Slice banana and arrange on top",
      "Drizzle with honey and sprinkle with cinnamon if desired"
    ]
  },
  {
    title: "Quick Fruit & Yogurt Parfait",
    description: "Layers of creamy yogurt, crunchy granola, and fresh fruit create the perfect balanced breakfast",
    prepTime: "5 min",
    baseIngredients: ["Greek yogurt", "granola", "mixed fresh fruits", "honey", "optional: nuts or seeds"],
    perPersonIngredients: { yogurt: "1 cup", granola: "1/4 cup", fruit: "1/2 cup" },
    instructions: [
      "Spoon half the yogurt into a glass or bowl",
      "Add a layer of granola and half the fruit",
      "Repeat with remaining yogurt and fruit",
      "Top with remaining granola and a drizzle of honey"
    ]
  }
];

const curatedHighProteinRecipes = [
  {
    title: "Protein-Packed Veggie Omelet",
    description: "A fluffy three-egg omelet loaded with vegetables and cheese, delivering 30g of protein to power your morning",
    prepTime: "12 min",
    baseIngredients: ["large eggs", "milk", "butter", "bell peppers", "spinach", "cheese of choice", "salt and pepper"],
    perPersonIngredients: { eggs: 3, cheese: "1/4 cup", milk: "2 tbsp" },
    instructions: [
      "Whisk eggs with milk, salt, and pepper",
      "Sauté diced peppers in butter until soft, add spinach until wilted",
      "Remove veggies and set aside, add more butter to pan",
      "Pour in eggs, let set at edges, then lift to let raw egg flow underneath",
      "When mostly set, add veggies and cheese to one half",
      "Fold omelet in half and slide onto plate"
    ]
  },
  {
    title: "Greek Yogurt Power Bowl",
    description: "Thick Greek yogurt topped with nuts, seeds, and protein-rich toppings for a 28g protein breakfast",
    prepTime: "5 min",
    baseIngredients: ["Greek yogurt (2% or full fat)", "almonds", "walnuts", "pumpkin seeds", "chia seeds", "honey", "fresh berries"],
    perPersonIngredients: { yogurt: "1 cup", nuts: "2 tbsp", seeds: "1 tbsp" },
    instructions: [
      "Spoon Greek yogurt into a bowl",
      "Top with a mix of chopped almonds and walnuts",
      "Sprinkle with pumpkin and chia seeds",
      "Add fresh berries and drizzle with honey"
    ]
  },
  {
    title: "Egg & Black Bean Breakfast Wrap",
    description: "A hearty wrap with scrambled eggs, protein-rich black beans, cheese, and salsa - 32g of protein in one delicious package",
    prepTime: "15 min",
    baseIngredients: ["large eggs", "canned black beans (drained)", "large flour tortilla", "shredded cheese", "salsa", "avocado", "salt and pepper"],
    perPersonIngredients: { eggs: 2, beans: "1/4 cup", tortilla: 1, cheese: "2 tbsp" },
    instructions: [
      "Scramble eggs with salt and pepper until just set",
      "Warm black beans in microwave or small pan",
      "Warm tortilla in a dry pan or microwave",
      "Layer eggs, beans, cheese, salsa, and sliced avocado on tortilla",
      "Fold in sides and roll up tightly"
    ]
  },
  {
    title: "Cottage Cheese Pancakes",
    description: "Light, fluffy pancakes made with protein-rich cottage cheese - 26g protein per serving with no protein powder needed",
    prepTime: "15 min",
    baseIngredients: ["cottage cheese", "eggs", "oats", "vanilla extract", "baking powder", "butter for cooking", "optional: berries or maple syrup"],
    perPersonIngredients: { cottageCheese: "1/2 cup", eggs: 2, oats: "1/4 cup" },
    instructions: [
      "Blend cottage cheese, eggs, oats, vanilla, and baking powder until smooth",
      "Let batter rest for 2 minutes",
      "Heat butter in a non-stick pan over medium heat",
      "Pour small circles of batter, cook until bubbles form",
      "Flip and cook until golden on both sides",
      "Serve with fresh berries or a light drizzle of maple syrup"
    ]
  },
  {
    title: "Smoked Salmon & Cream Cheese Bagel",
    description: "A classic combination with omega-3 rich salmon and creamy cheese, packing 25g of protein",
    prepTime: "8 min",
    baseIngredients: ["whole grain bagel", "cream cheese", "smoked salmon", "capers", "red onion", "fresh dill", "lemon wedge"],
    perPersonIngredients: { bagel: 1, salmon: "3 oz", creamCheese: "2 tbsp" },
    instructions: [
      "Slice and toast the bagel until golden",
      "Spread cream cheese generously on both halves",
      "Layer smoked salmon on top",
      "Add thinly sliced red onion and capers",
      "Garnish with fresh dill and a squeeze of lemon"
    ]
  }
];

// Generate a curated recipe when API is not available
const generateCuratedRecipe = (recipeType: RecipeType, servings: number): Recipe => {
  const recipes = recipeType === 'simple' ? curatedSimpleRecipes : curatedHighProteinRecipes;
  const template = recipes[Math.floor(Math.random() * recipes.length)];

  // Scale ingredients for servings
  const scaledIngredients = template.baseIngredients.map(ingredient => {
    // For simplicity, we'll just note the servings in the first ingredient
    return ingredient;
  });

  // Add per-person scaling note
  if (servings > 1) {
    scaledIngredients.unshift(`(Scaled for ${servings} servings)`);
  }

  return {
    id: Date.now(),
    title: template.title,
    description: template.description,
    prepTime: template.prepTime,
    servings,
    image: getImageForRecipe(template.title, template.baseIngredients),
    ingredients: scaledIngredients,
    instructions: template.instructions,
    time: `${7 + Math.floor(Math.random() * 2)}:${['00', '15', '30', '45'][Math.floor(Math.random() * 4)]} AM`,
    status: 'planned'
  };
};

export { generateCuratedRecipe };
