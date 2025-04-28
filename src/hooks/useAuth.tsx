
import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Session, User } from '@supabase/supabase-js';
import { useToast } from "@/hooks/use-toast";

interface AuthContextProps {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signInWithEmail: (email: string, password: string) => Promise<{ session: Session | null; error: any }>;
  signUpWithEmail: (email: string, password: string) => Promise<{ session: Session | null; error: any }>;
  signInWithGoogle: () => Promise<{ session: Session | null; error: any }>;
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
  
  const signUpWithEmail = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        }
      });
      
      if (error) {
        console.error("Email sign up error:", error);
        toast({
          title: "Sign Up Failed",
          description: error.message,
          variant: "destructive",
        });
        return { session: null, error };
      }
      
      if (data.session) {
        toast({
          title: "Sign Up Successful",
          description: "Your account has been created.",
        });
      } else {
        toast({
          title: "Verification Email Sent",
          description: "Please check your email to confirm your account.",
        });
      }
      
      return { session: data.session, error: null };
    } catch (error: any) {
      console.error("Exception during sign up:", error);
      toast({
        title: "Sign Up Failed",
        description: error.message,
        variant: "destructive",
      });
      return { session: null, error };
    }
  };
  
  const signInWithEmail = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        console.error("Email sign in error:", error);
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
      console.error("Exception during sign in:", error);
      toast({
        title: "Sign In Failed",
        description: error.message,
        variant: "destructive",
      });
      return { session: null, error };
    }
  };
  
  const signInWithGoogle = async () => {
    try {
      console.log("Starting Google sign-in process");
      
      // Use browser detection to add specific options
      const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
            // Add a parameter to potentially bypass some browser security issues
            ...(isSafari ? { client_type: 'web_app' } : {})
          },
        },
      });
      
      if (error) {
        console.error("Google sign-in error:", error);
        toast({
          title: "Google Sign In Failed",
          description: error.message,
          variant: "destructive",
        });
        return { session: null, error };
      }
      
      console.log("Google sign-in initiated successfully", data);
      return { session: null, error: null };
    } catch (error: any) {
      console.error("Exception during Google sign-in:", error);
      toast({
        title: "Google Sign In Failed",
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
    signUpWithEmail,
    signInWithEmail,
    signInWithGoogle,
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
