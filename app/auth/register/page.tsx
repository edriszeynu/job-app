"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { register } from "@/actions/register";
import { useAuthStore } from "@/store/authStore";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { User, Mail, Lock, Briefcase, ArrowRight } from "lucide-react";

const registerSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Confirm password"),
    role: z.enum(["JOB_SEEKER", "EMPLOYER"]),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type RegisterValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const { isLoading, setLoading } = useAuthStore();
  const [serverError, setServerError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const form = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "JOB_SEEKER",
    },
  });

  const onSubmit = async (data: RegisterValues) => {
    setLoading(true);
    setServerError(null);

    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("email", data.email);
    formData.append("password", data.password);
    formData.append("role", data.role);

    const result = await register(formData);

    if (result.error) {
      setServerError(result.error);
      setLoading(false);
    } else {
      setSuccess(true);
      setLoading(false);
      setTimeout(() => {
        router.push("/auth/signin?registered=true");
      }, 2000);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-secondary/10 p-4 relative">
        <div className="absolute top-4 right-4 z-50">
        </div>

        <div className="absolute -top-20 -right-20 w-72 h-72 bg-primary/20 rounded-full blur-3xl opacity-50 animate-pulse" />
        <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-secondary/20 rounded-full blur-3xl opacity-50 animate-pulse delay-1000" />

        <div className="w-full max-w-md relative">
          <div className="bg-card/80 backdrop-blur-xl border border-border/50 rounded-2xl shadow-2xl p-6 md:p-8">
            <div className="text-center py-4">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 text-primary mb-4 animate-pulse">
                <Mail className="h-10 w-10" />
              </div>
              <h2 className="text-2xl font-bold">You're All Set!</h2>
              <p className="text-muted-foreground mt-2">
                We've sent a verification link to your email.
              </p>
              <p className="text-sm text-muted-foreground/70 mt-1">
                Click the link to activate your account and start your journey.
              </p>
              <Button
                onClick={() => router.push("/auth/signin")}
                className="mt-6 group transition-all duration-300 hover:shadow-lg hover:shadow-primary/20"
              >
                Go to Sign In
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-secondary/10 p-4 relative">
      {/* Theme Toggle */}
      <div className="absolute top-4 right-4 z-50">
      </div>

      {/* Decorative blobs */}
      <div className="absolute -top-20 -right-20 w-72 h-72 bg-primary/20 rounded-full blur-3xl opacity-50 animate-pulse" />
      <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-secondary/20 rounded-full blur-3xl opacity-50 animate-pulse delay-1000" />

      <div className="w-full max-w-md relative">
        <div className="bg-card/80 backdrop-blur-xl border border-border/50 rounded-2xl shadow-2xl p-6 md:p-8 transition-all duration-300 hover:shadow-primary/5">
          {/* Brand */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center gap-2.5 mb-2">
              <Briefcase className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                JobHub
              </span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              Get Started
            </h2>
            <p className="text-muted-foreground text-sm mt-1.5">Create your account in seconds</p>
          </div>

          {serverError && (
            <div className="mb-4 p-3 rounded-lg bg-destructive/10 text-destructive text-sm text-center border border-destructive/20">
              {serverError}
            </div>
          )}

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3.5">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">Full Name</FormLabel>
                    <FormControl>
                      <div className="relative group">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                        <Input
                          {...field}
                          placeholder="John Doe"
                          className="pl-9 transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">Email</FormLabel>
                    <FormControl>
                      <div className="relative group">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                        <Input
                          {...field}
                          type="email"
                          placeholder="john@example.com"
                          className="pl-9 transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                        />
                      </div>
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
                      <div className="relative group">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                        <Input
                          {...field}
                          type="password"
                          placeholder="••••••••"
                          className="pl-9 transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">Confirm Password</FormLabel>
                    <FormControl>
                      <div className="relative group">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                        <Input
                          {...field}
                          type="password"
                          placeholder="••••••••"
                          className="pl-9 transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">I'm a...</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger className="transition-all duration-200 focus:ring-2 focus:ring-primary/20">
                          <div className="flex items-center gap-2">
                            <Briefcase className="h-4 w-4 text-muted-foreground" />
                            <SelectValue placeholder="Select your role" />
                          </div>
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="JOB_SEEKER">💼 Job Seeker</SelectItem>
                        <SelectItem value="EMPLOYER">🏢 Employer</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="w-full group transition-all duration-300 hover:shadow-lg hover:shadow-primary/20"
                disabled={isLoading}
              >
                {isLoading ? (
                  "Creating account..."
                ) : (
                  <>
                    Create Account
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </Button>
            </form>
          </Form>

          <div className="mt-6 pt-4 border-t border-border/40 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/auth/signin" className="text-primary hover:underline font-medium transition-colors">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}