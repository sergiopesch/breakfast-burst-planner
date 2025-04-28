
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useAuth } from '@/hooks/useAuth';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
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
  const [searchParams] = useSearchParams();
  const initialMode = searchParams.get('mode') === 'register';
  
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [showRegister, setShowRegister] = useState(initialMode);
  const [justRegistered, setJustRegistered] = useState(false);
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
      
      if (showRegister) {
        // Handle sign up
        const result = await signUpWithEmail(email, password);
        
        if (result.error) {
          setAuthError(result.error.message);
        } else {
          setJustRegistered(true);
          setShowRegister(false);
          form.reset();
          toast({
            title: "Account created successfully",
            description: "Please check your email for verification if required, then sign in.",
          });
        }
      } else {
        // Handle sign in
        const result = await signInWithEmail(email, password);
        
        if (result.error) {
          if (result.error.message.includes("Invalid login credentials")) {
            setAuthError("Invalid email or password. If you just registered, make sure to verify your email first.");
          } else {
            setAuthError(result.error.message);
          }
        }
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
          
          {justRegistered && (
            <Alert className="mb-4 bg-green-50 text-green-800 border-green-200">
              <AlertDescription>Account created! Please sign in with your credentials.</AlertDescription>
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
              onClick={() => {
                setShowRegister(!showRegister);
                setJustRegistered(false);
                setAuthError(null);
                form.reset();
              }}
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
