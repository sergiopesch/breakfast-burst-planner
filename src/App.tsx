import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import ThemeProvider from "./components/ThemeProvider";
import ErrorBoundary from "./components/ErrorBoundary";
import Layout from "./components/Layout";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Planner from "./pages/Planner";
import Recipes from "./pages/Recipes";
import CreateRecipe from "./pages/CreateRecipe";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import { useEffect } from "react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { ROUTE_PATHS } from "@/routePaths";

const AuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // This component captures the OAuth redirect and allows Supabase to handle the authentication
    console.log("AuthCallback component mounted");

    const handleAuthCallback = async () => {
      if (!isSupabaseConfigured()) {
        console.warn("Supabase not configured, redirecting to home");
        navigate(ROUTE_PATHS.home, { replace: true });
        return;
      }

      const { hash, search } = window.location;
      console.log("Auth callback URL info:", { hash, search });

      // Let Supabase handle the hash fragment (it contains the access token)
      const { data, error } = await supabase.auth.getSession();
      console.log("Auth session result:", { data, error });

      if (error) {
        console.error("Auth callback error:", error);
      }

      // Navigate to the planner page after authentication (preserves React state)
      navigate(ROUTE_PATHS.planner, { replace: true });
    };

    handleAuthCallback();
  }, [navigate]);

  return (
    <div className="flex flex-col justify-center items-center h-screen bg-background">
      <div className="animate-pulse-soft text-foreground">Completing authentication...</div>
    </div>
  );
};

// Configure React Query with sensible defaults
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <ThemeProvider>
          <AuthProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path={ROUTE_PATHS.home} element={<Layout><Index /></Layout>} />
                <Route path={ROUTE_PATHS.login} element={<Login />} />
                <Route path={ROUTE_PATHS.register} element={<Navigate to={ROUTE_PATHS.login} replace />} />
                <Route path={ROUTE_PATHS.authCallback} element={<AuthCallback />} />
                <Route path={ROUTE_PATHS.planner} element={<Layout><Planner /></Layout>} />
                <Route path={ROUTE_PATHS.recipes} element={<Layout><Recipes /></Layout>} />
                <Route path={ROUTE_PATHS.createRecipe} element={<Layout><CreateRecipe /></Layout>} />
                <Route
                  path={ROUTE_PATHS.profile}
                  element={
                    <ProtectedRoute>
                      <Layout><Profile /></Layout>
                    </ProtectedRoute>
                  }
                />
                <Route path={ROUTE_PATHS.fallback} element={<Layout><NotFound /></Layout>} />
              </Routes>
            </BrowserRouter>
          </AuthProvider>
        </ThemeProvider>
      </TooltipProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
