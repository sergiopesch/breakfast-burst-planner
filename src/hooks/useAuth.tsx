
import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Session, User } from '@supabase/supabase-js';
import { useToast } from "@/hooks/use-toast";

interface AuthContextProps {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string) => Promise<{ user: User | null; error: any }>;
  signIn: (email: string, password: string) => Promise<{ session: Session | null; error: any }>;
  signOut: () => Promise<{ error: any }>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const initializeAuth = async () => {
      setLoading(true);
      
      // Get initial session
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('Error getting session:', error);
        toast({
          title: "Authentication Error",
          description: "Failed to retrieve authentication session",
          variant: "destructive",
        });
      }
      
      if (session) {
        setSession(session);
        setUser(session.user);
        await migrateLocalDataToSupabase(session.user.id);
      }
      
      // Set up auth state change listener
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        async (_event, session) => {
          setSession(session);
          setUser(session?.user ?? null);
          setLoading(false);
          
          // If a user just signed in, migrate their local data
          if (session?.user && _event === 'SIGNED_IN') {
            await migrateLocalDataToSupabase(session.user.id);
          }
        }
      );
      
      setLoading(false);
      return () => {
        subscription.unsubscribe();
      };
    };
    
    initializeAuth();
  }, [toast]);
  
  // Function to migrate localStorage data to Supabase when a user signs in
  const migrateLocalDataToSupabase = async (userId: string) => {
    try {
      // Check if we've already migrated data for this user
      const migrationFlagKey = `data-migrated-${userId}`;
      const alreadyMigrated = localStorage.getItem(migrationFlagKey);
      
      if (alreadyMigrated) {
        return;
      }
      
      // Get local recipes and planned meals
      const localRecipes = JSON.parse(localStorage.getItem('likedRecipes') || '[]');
      const localPlannedMeals = JSON.parse(localStorage.getItem('plannedMeals') || '{}');
      
      // Migrate recipes
      if (localRecipes.length > 0) {
        for (const recipe of localRecipes) {
          const { error } = await supabase.from('recipes').insert({
            user_id: userId,
            title: recipe.title,
            description: recipe.description,
            prep_time: recipe.prepTime,
            image_url: recipe.image,
            ingredients: recipe.ingredients,
            instructions: recipe.instructions,
            servings: recipe.servings
          });
          
          if (error) {
            console.error('Error migrating recipe:', error);
          }
        }
      }
      
      // Migrate planned meals
      if (Object.keys(localPlannedMeals).length > 0) {
        // Get all recipes from the database to map local recipe IDs to DB IDs
        const { data: dbRecipes } = await supabase
          .from('recipes')
          .select('id, title')
          .eq('user_id', userId);
        
        const recipeMap = new Map();
        if (dbRecipes) {
          for (const recipe of dbRecipes) {
            recipeMap.set(recipe.title, recipe.id);
          }
        }
        
        // Add each planned meal
        for (const [dateStr, meals] of Object.entries(localPlannedMeals)) {
          for (const meal of meals as any[]) {
            // Find the corresponding recipe ID in the database
            const recipeId = recipeMap.get(meal.title);
            
            if (recipeId) {
              const { error } = await supabase.from('planned_meals').insert({
                user_id: userId,
                recipe_id: recipeId,
                date: dateStr,
                time: meal.time,
                status: meal.status || 'planned'
              });
              
              if (error) {
                console.error('Error migrating planned meal:', error);
              }
            }
          }
        }
      }
      
      // Set migration flag to avoid duplicating data
      localStorage.setItem(migrationFlagKey, 'true');
      
      toast({
        title: "Data Migration Complete",
        description: "Your local recipes and meal plans have been migrated to your account.",
      });
    } catch (error) {
      console.error('Data migration error:', error);
      toast({
        title: "Data Migration Failed",
        description: "Failed to migrate local data to your account.",
        variant: "destructive",
      });
    }
  };
  
  const signUp = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({ email, password });
      
      if (error) {
        toast({
          title: "Sign Up Failed",
          description: error.message,
          variant: "destructive",
        });
        return { user: null, error };
      }
      
      toast({
        title: "Sign Up Successful",
        description: "Please check your email for a confirmation link.",
      });
      
      return { user: data.user, error: null };
    } catch (error: any) {
      toast({
        title: "Sign Up Failed",
        description: error.message,
        variant: "destructive",
      });
      return { user: null, error };
    }
  };
  
  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      
      if (error) {
        toast({
          title: "Sign In Failed",
          description: error.message,
          variant: "destructive",
        });
        return { session: null, error };
      }
      
      toast({
        title: "Sign In Successful",
        description: "Welcome back!",
      });
      
      return { session: data.session, error: null };
    } catch (error: any) {
      toast({
        title: "Sign In Failed",
        description: error.message,
        variant: "destructive",
      });
      return { session: null, error };
    }
  };
  
  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        toast({
          title: "Sign Out Failed",
          description: error.message,
          variant: "destructive",
        });
        return { error };
      }
      
      toast({
        title: "Sign Out Successful",
        description: "You have been signed out.",
      });
      
      return { error: null };
    } catch (error: any) {
      toast({
        title: "Sign Out Failed",
        description: error.message,
        variant: "destructive",
      });
      return { error };
    }
  };
  
  const value = {
    user,
    session,
    loading,
    signUp,
    signIn,
    signOut
  };
  
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
