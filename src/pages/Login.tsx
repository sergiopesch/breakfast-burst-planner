
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from '@/hooks/useAuth';
import { Link, useNavigate, useSearchParams } from 'react-router';
import { Loader2, AlertTriangle, Mail, ArrowLeft } from 'lucide-react';
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
import { motion } from "framer-motion";

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
    <div className="min-h-screen flex items-center justify-center bg-background p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md"
      >
        {/* Back Link */}
        <Link
          to="/"
          className="group inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" />
          Back to Home
        </Link>

        {/* Card */}
        <div className="bg-card/50 backdrop-blur-sm rounded-2xl border border-border/40 p-8 shadow-elegant">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-medium text-foreground mb-2">
              {showRegister ? "Create an Account" : "Welcome Back"}
            </h1>
            <p className="text-sm text-muted-foreground">
              {showRegister
                ? "Sign up to start planning your breakfasts"
                : "Sign in to access your breakfast planner"}
            </p>
          </div>

          {/* Alerts */}
          {authError && (
            <Alert variant="destructive" className="mb-6 rounded-lg">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{authError}</AlertDescription>
            </Alert>
          )}

          {justRegistered && (
            <Alert className="mb-6 bg-brand-success/10 text-brand-success border-brand-success/20 rounded-lg">
              <AlertDescription>Account created! Please sign in with your credentials.</AlertDescription>
            </Alert>
          )}

          {/* Form */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="email@example.com"
                        type="email"
                        className="rounded-lg border-border/50 focus:border-foreground/30"
                        {...field}
                      />
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
                    <FormLabel className="text-sm font-medium">Password</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Password"
                        type="password"
                        className="rounded-lg border-border/50 focus:border-foreground/30"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full btn-primary rounded-full py-5 mt-2"
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

          {/* Toggle */}
          <div className="mt-8 text-center">
            <p className="text-sm text-muted-foreground">
              {showRegister
                ? "Already have an account?"
                : "Don't have an account yet?"}{" "}
              <button
                type="button"
                className="font-medium text-foreground hover:underline"
                onClick={() => {
                  setShowRegister(!showRegister);
                  setJustRegistered(false);
                  setAuthError(null);
                  form.reset();
                }}
              >
                {showRegister ? "Sign In" : "Sign Up"}
              </button>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
