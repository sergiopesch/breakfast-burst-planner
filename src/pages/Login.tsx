
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useAuth } from '@/hooks/useAuth';
import { Link, useNavigate } from 'react-router-dom';
import { Coffee, Loader2, AlertTriangle, Mail } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [showRegister, setShowRegister] = useState(false);
  const { signInWithEmail, signUpWithEmail, user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Redirect if user is already logged in
  useEffect(() => {
    if (user) {
      navigate('/planner');
    }
  }, [user, navigate]);

  const onSubmit = async (values: LoginFormValues) => {
    setIsLoading(true);
    setAuthError(null);
    
    try {
      const { email, password } = values;
      
      // Handle sign in or sign up based on current mode
      const result = showRegister 
        ? await signUpWithEmail(email, password)
        : await signInWithEmail(email, password);
      
      if (result.error) {
        setAuthError(result.error.message);
      }
    } catch (error: any) {
      console.error("Authentication error:", error);
      setAuthError(error.message || "An unexpected error occurred");
    } finally {
      setIsLoading(false);
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
          <CardTitle className="text-2xl font-bold text-[#4F2D9E]">
            {showRegister ? "Create an Account" : "Welcome Back"}
          </CardTitle>
          <CardDescription>
            {showRegister ? "Sign up to start planning your breakfasts" : "Sign in to access your breakfast planner"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {authError && (
            <Alert variant="destructive" className="mb-4">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{authError}</AlertDescription>
            </Alert>
          )}
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="email@example.com" type="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input placeholder="Password" type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Button 
                type="submit"
                className="w-full bg-[#4F2D9E] hover:bg-[#3D2277] flex items-center justify-center"
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Mail className="h-4 w-4 mr-2" />
                )}
                {showRegister ? "Sign Up" : "Sign In"}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-3">
          <p className="text-sm text-center">
            {showRegister 
              ? "Already have an account?" 
              : "Don't have an account yet?"} 
            <Button 
              variant="link" 
              className="p-0 h-auto font-semibold text-[#4F2D9E]"
              onClick={() => setShowRegister(!showRegister)}
            >
              {showRegister ? "Sign In" : "Sign Up"}
            </Button>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Login;
