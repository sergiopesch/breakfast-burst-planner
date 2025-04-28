
import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Session, User } from '@supabase/supabase-js';
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from 'react-router-dom';

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
        console.log("User authenticated:", session.user.email);
      }
      
      // Set up auth state change listener
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        async (_event, session) => {
          console.log("Auth state changed:", _event);
          setSession(session);
          setUser(session?.user ?? null);
          setLoading(false);
        }
      );
      
      setLoading(false);
      return () => {
        subscription.unsubscribe();
      };
    };
    
    initializeAuth();
  }, [toast]);
  
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
