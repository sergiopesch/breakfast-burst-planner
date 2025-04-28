
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { useAuth } from '@/hooks/useAuth';
import { Link, useNavigate } from 'react-router-dom';
import { Coffee, Loader2, AlertTriangle } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";

const Login = () => {
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const { signInWithGoogle, user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Redirect if user is already logged in
  useEffect(() => {
    if (user) {
      navigate('/planner');
    }
  }, [user, navigate]);

  const handleGoogleSignIn = async () => {
    console.log("Google sign-in button clicked");
    setIsGoogleLoading(true);
    setAuthError(null);
    
    try {
      // Add a timeout to detect connection issues
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Connection to Google timed out. Please check your internet connection.")), 15000)
      );
      
      // Race between the actual sign-in and the timeout
      const result = await Promise.race([
        signInWithGoogle(),
        timeoutPromise
      ]);
      
      console.log("Sign in result:", result);
      // The user will be redirected to Google's auth page
    } catch (error: any) {
      console.error("Error in handleGoogleSignIn:", error);
      
      // Handle specific errors
      let errorMessage = error.message || "An unexpected error occurred";
      
      if (errorMessage.includes("refused to connect") || 
          errorMessage.includes("timed out") || 
          error.name === "TypeError") {
        errorMessage = "Connection to Google authentication failed. Please check your internet connection and browser security settings.";
        setAuthError(errorMessage);
      } else {
        toast({
          title: "Google Sign In Error",
          description: errorMessage,
          variant: "destructive",
        });
      }
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8F5FF] p-4">
      <Card className="max-w-md w-full shadow-lg">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-[#4F2D9E] p-3 rounded-full">
              <Coffee className="h-6 w-6 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-[#4F2D9E]">Welcome Back</CardTitle>
          <CardDescription>Sign in to access your breakfast planner</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {authError && (
              <Alert variant="destructive" className="mb-4">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>{authError}</AlertDescription>
              </Alert>
            )}
            
            <Button 
              type="button"
              className="w-full bg-[#4F2D9E] hover:bg-[#3D2277] flex items-center justify-center"
              onClick={handleGoogleSignIn}
              disabled={isGoogleLoading}
            >
              {isGoogleLoading ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <svg className="h-4 w-4 mr-2" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
                  <path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path>
                </svg>
              )}
              Sign in with Google
            </Button>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-3">
          <p className="text-sm text-center">
            New user? Just click the button above to sign up with Google.
          </p>
          <p className="text-xs text-gray-500 text-center">
            If you're having trouble signing in, please ensure that your browser allows pop-ups and connections to accounts.google.com
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Login;
