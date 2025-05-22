"use client";

import Link from "next/link";
import { Stethoscope, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useRouter } from "next/navigation"; // Corrected import
import { useToast } from "@/hooks/use-toast";

const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Mock login function
  const onSubmit = async (data: LoginFormValues) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log("Login data:", data);
    
    // Mock success/failure
    if (data.email === "staff@medischedule.com" && data.password === "password") {
      toast({
        title: "Login Successful",
        description: "Welcome back, Dr. Staff!",
      });
      router.push("/dashboard"); // Redirect to dashboard
    } else if (data.email === "patient@medischedule.com" && data.password === "password") {
       toast({
        title: "Login Successful",
        description: "Welcome back!",
      });
      router.push("/appointments"); // Redirect to patient appointments
    }
    else {
      toast({
        variant: "destructive",
        title: "Login Failed",
        description: "Invalid email or password. Please try again.",
      });
      form.setError("email", { type: "manual", message: " " }); // Clear specific field error if needed
      form.setError("password", { type: "manual", message: "Invalid credentials" });
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-background to-secondary/30 p-4">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="space-y-1 text-center">
          <div className="inline-flex items-center justify-center p-2 bg-primary rounded-full mb-3 mx-auto">
            <Stethoscope className="h-10 w-10 text-primary-foreground" />
          </div>
          <CardTitle className="text-3xl font-bold text-primary">Welcome to MediSchedule</CardTitle>
          <CardDescription>Enter your credentials to access your account</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                      <Input placeholder="name@example.com" {...field} />
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
                    <div className="flex items-center justify-between">
                      <FormLabel>Password</FormLabel>
                      <Link
                        href="#" // Replace with actual forgot password link
                        className="text-sm text-primary hover:underline"
                        prefetch={false}
                      >
                        Forgot password?
                      </Link>
                    </div>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? "Signing In..." : <> <LogIn className="mr-2 h-4 w-4" /> Sign In </>}
              </Button>
            </form>
          </Form>
          <div className="mt-6 text-center text-sm">
            Registration is managed by administrators.
            <br/>
            Contact support if you need an account.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
