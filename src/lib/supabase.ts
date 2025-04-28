
import { createClient } from '@supabase/supabase-js';

// Your Supabase project credentials
// These are the actual credentials from your Supabase dashboard
const projectUrl = 'https://nwnrgctxzqunasquaarl.supabase.co';
const projectAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im53bnJnY3R4enF1bmFzcXVhYXJsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU4NzU5MDEsImV4cCI6MjA2MTQ1MTkwMX0.7Ju-S6kWf31BIEHayJh_H85p-TDaSlZ4Hhcb-oMw4lY';

// Create the Supabase client
export const supabase = createClient(projectUrl, projectAnonKey);

// Log connection info
console.log('Supabase client initialized');

// Helper function for handling errors in Supabase operations
export const handleSupabaseError = (error: any, toast?: any) => {
  console.error('Supabase error:', error);
  if (toast) {
    toast({
      title: "Error",
      description: error.message || "An error occurred",
      variant: "destructive",
    });
  }
  return error;
};

// Check if tables exist, with timeout and retry logic
export const checkTablesExist = async () => {
  let attempts = 0;
  const maxAttempts = 3;
  
  while (attempts < maxAttempts) {
    try {
      // Try to query the recipes table
      const { error } = await supabase
        .from('recipes')
        .select('id')
        .limit(1);
      
      if (!error) {
        console.log('Successfully connected to recipes table');
        return true;
      }
      
      // If there's a specific error that tables don't exist, log it
      if (error.code === '42P01') {
        console.warn('Tables not yet created. Attempt:', attempts + 1);
      } else {
        console.error('Unknown error checking tables:', error);
      }
    } catch (err) {
      console.error('Exception checking tables:', err);
    }
    
    attempts++;
    // If we haven't reached max attempts, wait before trying again
    if (attempts < maxAttempts) {
      console.log(`Waiting before retry ${attempts}/${maxAttempts}...`);
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }
  
  console.warn('Tables check failed after maximum attempts. Falling back to local storage.');
  return false;
};

// Storage helper functions
export const uploadRecipeImage = async (file: File, userId: string) => {
  try {
    const fileExt = file.name.split('.').pop();
    const filePath = `${userId}/recipes/${Math.random().toString(36).substring(2)}.${fileExt}`;
    
    // Upload file to Supabase storage
    const { data, error } = await supabase.storage
      .from('recipe-images')
      .upload(filePath, file);
      
    if (error) throw error;
    
    // Get public URL for the uploaded file
    const { data: urlData } = supabase.storage
      .from('recipe-images')
      .getPublicUrl(filePath);
      
    return {
      path: filePath,
      url: urlData.publicUrl,
      error: null
    };
  } catch (error) {
    console.error('Error uploading image:', error);
    return { path: null, url: null, error };
  }
};

export const deleteRecipeImage = async (filePath: string) => {
  try {
    const { error } = await supabase.storage
      .from('recipe-images')
      .remove([filePath]);
      
    if (error) throw error;
    return { success: true, error: null };
  } catch (error) {
    console.error('Error deleting image:', error);
    return { success: false, error };
  }
};
