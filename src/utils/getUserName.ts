
import { supabase } from '@/lib/supabase';

export async function getUserNameFromDB(userId: string): Promise<string> {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('username, display_name')
      .eq('id', userId)
      .single();
    
    if (error) {
      console.error('Error fetching username:', error);
      return "there";
    }
    
    return data.display_name || data.username || "there";
  } catch (error) {
    console.error('Error in getUserName:', error);
    return "there";
  }
}

export function getUserName(): string {
  // This is a stub function that will be replaced with actual authentication logic later
  return "there";
}
