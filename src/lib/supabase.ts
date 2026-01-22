
import { createClient } from '@supabase/supabase-js';
import { uploadTemplateImagesToSupabase, verifyTemplateImagesArePublic } from '../utils/recipeGenerator';

// Supabase configuration from environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Validate environment variables
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    'Missing Supabase environment variables. Please create a .env file with VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY. Falling back to localStorage only.'
  );
}

// Create the Supabase client (with fallback for missing config)
export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null as any; // Will gracefully fallback to localStorage when null

// Helper to check if Supabase is configured
export const isSupabaseConfigured = () => Boolean(supabaseUrl && supabaseAnonKey && supabase);

// Log connection info
if (isSupabaseConfigured()) {
  console.log('Supabase client initialized');
}

// Initialize template images in Supabase
export const initializeTemplateImages = async () => {
  if (!isSupabaseConfigured()) {
    console.log('Supabase not configured, skipping template image initialization');
    return;
  }

  try {
    // First, check if the template directory exists in the recipe-images bucket
    const { data, error } = await supabase.storage
      .from('recipe-images')
      .list('template');

    // If directory doesn't exist or is empty, upload template images
    if (error || !data || data.length === 0) {
      console.log('Uploading template recipe images to Supabase storage...');
      await uploadTemplateImagesToSupabase();
    } else {
      console.log('Template recipe images already exist in Supabase storage');

      // Verify images are publicly accessible
      await verifyTemplateImagesArePublic();
    }

    // Test all image URLs
    await testAllTemplateImageUrls();
  } catch (err) {
    console.error('Error checking template images:', err);
  }
};

// Test all template image URLs to ensure they're working
const testAllTemplateImageUrls = async () => {
  if (!isSupabaseConfigured()) return;

  const imageFilenames = [
    "pancakes.jpg",
    "avocado-toast.jpg",
    "smoothie.jpg",
    "eggs.jpg",
    "oatmeal.jpg",
    "french-toast.jpg",
    "granola.jpg",
    "sandwich.jpg"
  ];

  console.log('Testing template image URLs...');

  for (const filename of imageFilenames) {
    const url = `${supabaseUrl}/storage/v1/object/public/recipe-images/template/${filename}`;
    try {
      const response = await fetch(url, { method: 'HEAD' });
      if (response.ok) {
        console.log(`✅ ${filename} is accessible`);
      } else {
        console.error(`❌ ${filename} returned status ${response.status}`);
      }
    } catch (err) {
      console.error(`❌ Error testing ${filename}:`, err);
    }
  }
};

// Initialize template images when the app starts (only if configured)
if (isSupabaseConfigured()) {
  initializeTemplateImages().catch(console.error);
}

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
  if (!isSupabaseConfigured()) {
    console.log('Supabase not configured, using localStorage');
    return false;
  }

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
  if (!isSupabaseConfigured()) {
    console.warn('Supabase not configured, cannot upload image');
    return { path: null, url: null, error: new Error('Supabase not configured') };
  }

  try {
    const fileExt = file.name.split('.').pop();
    const filePath = `${userId}/recipes/${Math.random().toString(36).substring(2)}.${fileExt}`;

    // Upload file to Supabase storage with cache-control header
    const { data, error } = await supabase.storage
      .from('recipe-images')
      .upload(filePath, file, {
        cacheControl: '3600', // 1 hour cache
        upsert: false
      });

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
  if (!isSupabaseConfigured()) {
    return { success: false, error: new Error('Supabase not configured') };
  }

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

// Function to update storage bucket policies to ensure images are public
export const ensureStoragePoliciesAreSetup = async () => {
  if (!isSupabaseConfigured()) return false;

  try {
    // Check if bucket exists and is public
    const { data: bucketData, error: bucketError } = await supabase
      .rpc('get_bucket_details', { bucket_id: 'recipe-images' });

    if (bucketError) {
      console.error('Error checking bucket details:', bucketError);
    } else {
      console.log('Bucket details:', bucketData);
    }

    return true;
  } catch (err) {
    console.error('Error ensuring storage policies:', err);
    return false;
  }
};

// Run policy check at startup (only if configured)
if (isSupabaseConfigured()) {
  ensureStoragePoliciesAreSetup().catch(console.error);
}
