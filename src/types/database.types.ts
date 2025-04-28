
export interface RecipeDB {
  id: string;
  user_id: string;
  title: string;
  description: string;
  prep_time?: string;
  image_url?: string;
  ingredients?: string[];
  instructions?: string[];
  servings?: number;
  created_at: string;
}

export interface PlannedMealDB {
  id: string;
  user_id: string;
  recipe_id: string;
  date: string;
  time?: string;
  status: 'planned' | 'completed';
  created_at: string;
}

export interface UserProfile {
  id: string;
  username?: string;
  display_name?: string;
  email?: string;
  avatar_url?: string;
  created_at: string;
}
