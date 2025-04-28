
import { Recipe } from '@/hooks/useMealPlanner';

// Array of breakfast recipe images
const breakfastImages = [
  "https://images.unsplash.com/photo-1484723091739-30a097e8f929?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=480&q=80", // Pancakes
  "https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=480&q=80", // Avocado toast
  "https://images.unsplash.com/photo-1494390248081-4e521a5940db?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=480&q=80", // Smoothie
  "https://images.unsplash.com/photo-1525351484163-7529414344d8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=480&q=80", // Eggs
  "https://images.unsplash.com/photo-1504113888839-1c8eb50233d3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=480&q=80", // Oatmeal
  "https://images.unsplash.com/photo-1553583011-a9d6706f562e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=480&q=80", // French toast
  "https://images.unsplash.com/photo-1533640924469-f04e06f8898d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=480&q=80", // Granola bowl
  "https://images.unsplash.com/photo-1637176312636-a7cce4e7e6e4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=480&q=80", // Breakfast sandwich
];

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
