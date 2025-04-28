
import { supabase } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';

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

// Add missing functions for user display name and initials
export function getUserDisplayName(user: User | null): string {
  if (!user) return "Guest";
  
  // Try to get name from user metadata
  const firstName = user.user_metadata?.full_name || 
                    user.user_metadata?.name || 
                    user.user_metadata?.firstName;
                    
  if (firstName) return firstName;
  
  // Fall back to email
  return user.email ? user.email.split('@')[0] : "User";
}

export function getUserInitials(user: User | null): string {
  if (!user) return "G";
  
  const name = getUserDisplayName(user);
  
  // Get initials (first letter of first and last words)
  const words = name.trim().split(/\s+/);
  if (words.length >= 2) {
    return (words[0][0] + words[words.length - 1][0]).toUpperCase();
  }
  
  // Just use the first letter if only one word
  return name[0].toUpperCase();
}
