
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Planner from "./pages/Planner";
import Recipes from "./pages/Recipes"; // Add import
import CreateRecipe from "./pages/CreateRecipe"; // Add import
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import { useEffect } from "react";
import { supabase } from "@/lib/supabase";

const AuthCallback = () => {
  useEffect(() => {
    // This component captures the OAuth redirect and allows Supabase to handle the authentication
    console.log("AuthCallback component mounted");
    
    const handleAuthCallback = async () => {
      const { hash, search } = window.location;
      console.log("Auth callback URL info:", { hash, search });
      
      // Let Supabase handle the hash fragment (it contains the access token)
      const { data, error } = await supabase.auth.getSession();
      console.log("Auth session result:", { data, error });
      
      if (error) {
        console.error("Auth callback error:", error);
      }
      
      // Redirect to the planner page after authentication
      window.location.href = "/planner";
    };
    
    handleAuthCallback();
  }, []);

  return <div className="flex justify-center items-center h-screen">Completing authentication...</div>;
};

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Navigate to="/login" replace />} />
            <Route path="/auth/callback" element={<AuthCallback />} />
            <Route 
              path="/planner" 
              element={
                <ProtectedRoute>
                  <Planner />
                </ProtectedRoute>
              } 
            />
            {/* Add new routes */}
            <Route 
              path="/recipes" 
              element={
                <ProtectedRoute>
                  <Recipes />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/create-recipe" 
              element={
                <ProtectedRoute>
                  <CreateRecipe />
                </ProtectedRoute>
              } 
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
