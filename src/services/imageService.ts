
// Image service for finding relevant food photography
// Uses Unsplash API for high-quality food images

export interface ImageResult {
  url: string;
  thumbnailUrl: string;
  altText: string;
  photographer?: string;
  photographerUrl?: string;
}

// Curated breakfast image collection organized by recipe type
// These are reliable, high-quality Unsplash images that are always available
const CURATED_BREAKFAST_IMAGES: Record<string, string[]> = {
  pancakes: [
    'https://images.unsplash.com/photo-1554520735-0a6b8b6ce8b7?w=800&q=80',
    'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800&q=80',
    'https://images.unsplash.com/photo-1575853121743-60c24f0a7502?w=800&q=80',
  ],
  waffles: [
    'https://images.unsplash.com/photo-1562376552-0d160a2f238d?w=800&q=80',
    'https://images.unsplash.com/photo-1568051243858-533a607809a5?w=800&q=80',
  ],
  eggs: [
    'https://images.unsplash.com/photo-1510693206972-df098062cb71?w=800&q=80',
    'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=800&q=80',
    'https://images.unsplash.com/photo-1482049016462-958d08c5a9b5?w=800&q=80',
  ],
  avocado: [
    'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=800&q=80',
    'https://images.unsplash.com/photo-1588137378633-dea1336ce1e2?w=800&q=80',
  ],
  toast: [
    'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=800&q=80',
    'https://images.unsplash.com/photo-1484723091739-30a097e8f929?w=800&q=80',
  ],
  smoothie: [
    'https://images.unsplash.com/photo-1590301157890-4810ed352733?w=800&q=80',
    'https://images.unsplash.com/photo-1505252585461-04db1eb84625?w=800&q=80',
    'https://images.unsplash.com/photo-1638176066666-ffb2f013c7dd?w=800&q=80',
  ],
  oatmeal: [
    'https://images.unsplash.com/photo-1517673132405-a56a62b18caf?w=800&q=80',
    'https://images.unsplash.com/photo-1495147466023-ac5c588e2e94?w=800&q=80',
  ],
  granola: [
    'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=800&q=80',
    'https://images.unsplash.com/photo-1490474418585-ba9bad8fd0ea?w=800&q=80',
  ],
  yogurt: [
    'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=800&q=80',
    'https://images.unsplash.com/photo-1505252585461-04db1eb84625?w=800&q=80',
  ],
  fruit: [
    'https://images.unsplash.com/photo-1490474418585-ba9bad8fd0ea?w=800&q=80',
    'https://images.unsplash.com/photo-1519996529931-28324d5a630e?w=800&q=80',
  ],
  sandwich: [
    'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=800&q=80',
    'https://images.unsplash.com/photo-1550507992-eb63ffee0847?w=800&q=80',
  ],
  bacon: [
    'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=800&q=80',
    'https://images.unsplash.com/photo-1506084868230-bb9d95c24759?w=800&q=80',
  ],
  cereal: [
    'https://images.unsplash.com/photo-1495147466023-ac5c588e2e94?w=800&q=80',
    'https://images.unsplash.com/photo-1517673132405-a56a62b18caf?w=800&q=80',
  ],
  french_toast: [
    'https://images.unsplash.com/photo-1484723091739-30a097e8f929?w=800&q=80',
    'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800&q=80',
  ],
  muffin: [
    'https://images.unsplash.com/photo-1607958996333-41aef7caefaa?w=800&q=80',
    'https://images.unsplash.com/photo-1558303065-3fdb17e52a98?w=800&q=80',
  ],
  croissant: [
    'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=800&q=80',
    'https://images.unsplash.com/photo-1530610476181-d83430b64dcd?w=800&q=80',
  ],
  coffee: [
    'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&q=80',
    'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&q=80',
  ],
  frittata: [
    'https://images.unsplash.com/photo-1510693206972-df098062cb71?w=800&q=80',
    'https://images.unsplash.com/photo-1482049016462-958d08c5a9b5?w=800&q=80',
  ],
  chia: [
    'https://images.unsplash.com/photo-1490474418585-ba9bad8fd0ea?w=800&q=80',
    'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=800&q=80',
  ],
  overnight_oats: [
    'https://images.unsplash.com/photo-1517673132405-a56a62b18caf?w=800&q=80',
    'https://images.unsplash.com/photo-1490474418585-ba9bad8fd0ea?w=800&q=80',
  ],
  benedict: [
    'https://images.unsplash.com/photo-1608039829572-f5e4d1c0c76f?w=800&q=80',
    'https://images.unsplash.com/photo-1510693206972-df098062cb71?w=800&q=80',
  ],
  default: [
    'https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?w=800&q=80',
    'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?w=800&q=80',
    'https://images.unsplash.com/photo-1493770348161-369560ae357d?w=800&q=80',
  ],
};

// Get Unsplash API key from environment
const getUnsplashApiKey = (): string | null => {
  return import.meta.env.VITE_UNSPLASH_ACCESS_KEY || null;
};

// Check if Unsplash API is available
export const isUnsplashAvailable = (): boolean => {
  return !!getUnsplashApiKey();
};

// Search for images using Unsplash API
export const searchImages = async (query: string): Promise<ImageResult[]> => {
  const apiKey = getUnsplashApiKey();

  if (!apiKey) {
    // Fall back to curated images
    return getCuratedImagesForQuery(query);
  }

  try {
    const response = await fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query + ' breakfast food')}&per_page=5&orientation=landscape`,
      {
        headers: {
          Authorization: `Client-ID ${apiKey}`,
        },
      }
    );

    if (!response.ok) {
      console.warn('Unsplash API error, falling back to curated images');
      return getCuratedImagesForQuery(query);
    }

    const data = await response.json();

    return data.results.map((photo: any) => ({
      url: `${photo.urls.regular}&w=800&q=80`,
      thumbnailUrl: photo.urls.thumb,
      altText: photo.alt_description || query,
      photographer: photo.user.name,
      photographerUrl: photo.user.links.html,
    }));
  } catch (error) {
    console.error('Error searching Unsplash:', error);
    return getCuratedImagesForQuery(query);
  }
};

// Get curated images based on recipe keywords
const getCuratedImagesForQuery = (query: string): ImageResult[] => {
  const lowerQuery = query.toLowerCase();

  // Find matching category
  for (const [category, images] of Object.entries(CURATED_BREAKFAST_IMAGES)) {
    if (lowerQuery.includes(category) || category.includes(lowerQuery.split(' ')[0])) {
      return images.map(url => ({
        url,
        thumbnailUrl: url.replace('w=800', 'w=200'),
        altText: `${category} breakfast`,
      }));
    }
  }

  // Return default breakfast images
  return CURATED_BREAKFAST_IMAGES.default.map(url => ({
    url,
    thumbnailUrl: url.replace('w=800', 'w=200'),
    altText: 'Delicious breakfast',
  }));
};

// Get a relevant image URL for a recipe based on title and keywords
export const getImageForRecipe = async (
  title: string,
  keywords?: string[]
): Promise<string> => {
  const lowerTitle = title.toLowerCase();

  // Try to match with curated images first (fastest and most reliable)
  for (const [category, images] of Object.entries(CURATED_BREAKFAST_IMAGES)) {
    if (lowerTitle.includes(category)) {
      return images[Math.floor(Math.random() * images.length)];
    }
  }

  // Check keywords
  if (keywords) {
    for (const keyword of keywords) {
      const lowerKeyword = keyword.toLowerCase();
      for (const [category, images] of Object.entries(CURATED_BREAKFAST_IMAGES)) {
        if (lowerKeyword.includes(category) || category.includes(lowerKeyword)) {
          return images[Math.floor(Math.random() * images.length)];
        }
      }
    }
  }

  // If Unsplash API is available, try searching
  if (isUnsplashAvailable()) {
    const results = await searchImages(title);
    if (results.length > 0) {
      return results[0].url;
    }
  }

  // Return a random default breakfast image
  const defaultImages = CURATED_BREAKFAST_IMAGES.default;
  return defaultImages[Math.floor(Math.random() * defaultImages.length)];
};

// Map common recipe terms to image categories
const RECIPE_TERM_MAPPINGS: Record<string, string> = {
  'oats': 'oatmeal',
  'porridge': 'oatmeal',
  'açaí': 'smoothie',
  'acai': 'smoothie',
  'berry bowl': 'smoothie',
  'protein bowl': 'smoothie',
  'egg': 'eggs',
  'scrambled': 'eggs',
  'poached': 'eggs',
  'omelette': 'eggs',
  'omelet': 'eggs',
  'parfait': 'yogurt',
  'avocado toast': 'avocado',
  'toast': 'toast',
  'bagel': 'sandwich',
  'blt': 'sandwich',
  'quesadilla': 'sandwich',
  'burrito': 'sandwich',
  'wrap': 'sandwich',
  'waffle': 'waffles',
  'pancake': 'pancakes',
  'flapjack': 'pancakes',
  'crepe': 'pancakes',
  'crepes': 'pancakes',
  'bowl': 'smoothie',
  'pudding': 'chia',
};

// Get image category from recipe title
export const getImageCategoryFromTitle = (title: string): string => {
  const lowerTitle = title.toLowerCase();

  // Check direct mappings first
  for (const [term, category] of Object.entries(RECIPE_TERM_MAPPINGS)) {
    if (lowerTitle.includes(term)) {
      return category;
    }
  }

  // Check against image categories
  for (const category of Object.keys(CURATED_BREAKFAST_IMAGES)) {
    if (category !== 'default' && lowerTitle.includes(category)) {
      return category;
    }
  }

  return 'default';
};

// Export curated images for direct access
export const getCuratedImages = () => CURATED_BREAKFAST_IMAGES;

export default {
  isUnsplashAvailable,
  searchImages,
  getImageForRecipe,
  getImageCategoryFromTitle,
  getCuratedImages,
};
