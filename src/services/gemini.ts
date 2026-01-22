
import { GoogleGenerativeAI, GenerativeModel } from '@google/generative-ai';

// Recipe generation response type
export interface AIGeneratedRecipe {
  title: string;
  description: string;
  prepTime: string;
  cookTime: string;
  servings: number;
  ingredients: string[];
  instructions: string[];
  tips?: string[];
  nutritionInfo?: {
    calories?: string;
    protein?: string;
    carbs?: string;
    fat?: string;
  };
}

// Image suggestion type
export interface ImageSuggestion {
  searchQuery: string;
  keywords: string[];
}

// Get the API key from environment variables
const getApiKey = (): string | null => {
  // Try Vite environment variable first
  const viteKey = import.meta.env.VITE_GOOGLE_AI_API_KEY;
  if (viteKey) return viteKey;

  // Check for GOOGLE_AI_API_KEY
  const googleKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (googleKey) return googleKey;

  return null;
};

// Initialize the Gemini client
let genAI: GoogleGenerativeAI | null = null;
let model: GenerativeModel | null = null;

const initializeGemini = (): GenerativeModel | null => {
  const apiKey = getApiKey();

  if (!apiKey) {
    console.warn('Google AI API key not found. AI recipe generation will be disabled.');
    return null;
  }

  if (!genAI) {
    genAI = new GoogleGenerativeAI(apiKey);
  }

  if (!model) {
    // Use Gemini 2.0 Flash (latest available model for API users)
    model = genAI.getGenerativeModel({
      model: 'gemini-2.0-flash-exp',
      generationConfig: {
        temperature: 0.8,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 2048,
      }
    });
  }

  return model;
};

// Check if Gemini is available
export const isGeminiAvailable = (): boolean => {
  return !!getApiKey();
};

// Generate a breakfast recipe using Gemini
export const generateBreakfastRecipe = async (
  preferences?: {
    cuisine?: string;
    dietaryRestrictions?: string[];
    maxPrepTime?: number;
    servings?: number;
    difficulty?: 'easy' | 'medium' | 'hard';
  }
): Promise<AIGeneratedRecipe | null> => {
  const geminiModel = initializeGemini();

  if (!geminiModel) {
    console.warn('Gemini not initialized. Using fallback recipe generation.');
    return null;
  }

  try {
    const prompt = buildRecipePrompt(preferences);
    const result = await geminiModel.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Parse the JSON response
    const recipe = parseRecipeResponse(text);
    return recipe;
  } catch (error) {
    console.error('Error generating recipe with Gemini:', error);
    return null;
  }
};

// Build the prompt for recipe generation
const buildRecipePrompt = (preferences?: {
  cuisine?: string;
  dietaryRestrictions?: string[];
  maxPrepTime?: number;
  servings?: number;
  difficulty?: 'easy' | 'medium' | 'hard';
}): string => {
  let prompt = `You are a professional chef specializing in breakfast recipes. Generate a creative and delicious breakfast recipe.

Requirements:
- The recipe should be unique and appealing
- Include precise measurements and clear instructions
- Make it suitable for home cooking
`;

  if (preferences?.cuisine) {
    prompt += `- Cuisine style: ${preferences.cuisine}\n`;
  }

  if (preferences?.dietaryRestrictions?.length) {
    prompt += `- Dietary restrictions: ${preferences.dietaryRestrictions.join(', ')}\n`;
  }

  if (preferences?.maxPrepTime) {
    prompt += `- Maximum preparation time: ${preferences.maxPrepTime} minutes\n`;
  }

  if (preferences?.servings) {
    prompt += `- Servings: ${preferences.servings}\n`;
  }

  if (preferences?.difficulty) {
    prompt += `- Difficulty level: ${preferences.difficulty}\n`;
  }

  prompt += `
Return the recipe in the following JSON format only (no markdown, no code blocks, just pure JSON):
{
  "title": "Recipe Name",
  "description": "A brief, appetizing description of the dish",
  "prepTime": "X min",
  "cookTime": "X min",
  "servings": 2,
  "ingredients": [
    "1 cup ingredient",
    "2 tbsp another ingredient"
  ],
  "instructions": [
    "Step 1 instruction",
    "Step 2 instruction"
  ],
  "tips": [
    "Optional helpful tip"
  ],
  "nutritionInfo": {
    "calories": "XXX kcal",
    "protein": "Xg",
    "carbs": "Xg",
    "fat": "Xg"
  }
}`;

  return prompt;
};

// Parse the recipe response from Gemini
const parseRecipeResponse = (text: string): AIGeneratedRecipe | null => {
  try {
    // Try to extract JSON from the response
    let jsonText = text.trim();

    // Remove markdown code blocks if present
    if (jsonText.startsWith('```json')) {
      jsonText = jsonText.slice(7);
    } else if (jsonText.startsWith('```')) {
      jsonText = jsonText.slice(3);
    }
    if (jsonText.endsWith('```')) {
      jsonText = jsonText.slice(0, -3);
    }

    jsonText = jsonText.trim();

    const recipe = JSON.parse(jsonText) as AIGeneratedRecipe;

    // Validate required fields
    if (!recipe.title || !recipe.ingredients || !recipe.instructions) {
      console.error('Invalid recipe response: missing required fields');
      return null;
    }

    return recipe;
  } catch (error) {
    console.error('Error parsing recipe response:', error);
    console.error('Raw response:', text);
    return null;
  }
};

// Generate image search keywords for a recipe
export const generateImageKeywords = async (recipeTitle: string, recipeDescription: string): Promise<ImageSuggestion | null> => {
  const geminiModel = initializeGemini();

  if (!geminiModel) {
    return {
      searchQuery: `${recipeTitle} breakfast food photography`,
      keywords: [recipeTitle.toLowerCase(), 'breakfast', 'food']
    };
  }

  try {
    const prompt = `Given this breakfast recipe:
Title: ${recipeTitle}
Description: ${recipeDescription}

Generate a search query and keywords to find a relevant, appetizing food photography image.

Return JSON only (no markdown):
{
  "searchQuery": "optimal search query for finding a beautiful food photo",
  "keywords": ["keyword1", "keyword2", "keyword3"]
}`;

    const result = await geminiModel.generateContent(prompt);
    const response = await result.response;
    const text = response.text().trim();

    let jsonText = text;
    if (jsonText.startsWith('```json')) {
      jsonText = jsonText.slice(7);
    } else if (jsonText.startsWith('```')) {
      jsonText = jsonText.slice(3);
    }
    if (jsonText.endsWith('```')) {
      jsonText = jsonText.slice(0, -3);
    }

    return JSON.parse(jsonText.trim()) as ImageSuggestion;
  } catch (error) {
    console.error('Error generating image keywords:', error);
    return {
      searchQuery: `${recipeTitle} breakfast food photography`,
      keywords: [recipeTitle.toLowerCase(), 'breakfast', 'food']
    };
  }
};

export default {
  isGeminiAvailable,
  generateBreakfastRecipe,
  generateImageKeywords,
};
