
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Planner from "./pages/Planner";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import { useEffect } from "react";
import { supabase } from "@/lib/supabase";

const AuthCallback = () => {
  useEffect(() => {
    // This component captures the OAuth redirect and allows Supabase to handle the authentication
    const { hash } = window.location;
    if (hash) {
      // Let Supabase handle the hash fragment (it contains the access token)
      supabase.auth.getSession();
    }
    // Redirect to the planner page after authentication
    window.location.href = "/planner";
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
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
