"use client";

import Link from "next/link";
import { Stethoscope, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label"; // Keep if used directly, FormLabel is preferred within Form
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

const loginSchema = z.object({
  email: z.string().email({ message: "Dirección de correo inválida." }),
  password: z.string().min(6, { message: "La contraseña debe tener al menos 6 caracteres." }),
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

  const onSubmit = async (data: LoginFormValues) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log("Login data:", data);
    
    if (data.email === "personal@medischedule.com" && data.password === "password") { // Updated credentials
      toast({
        title: "Inicio de Sesión Exitoso",
        description: "¡Bienvenida de nuevo, Dra. Pérez!",
      });
      router.push("/dashboard"); 
    } else if (data.email === "paciente@medischedule.com" && data.password === "password") { // Updated credentials
       toast({
        title: "Inicio de Sesión Exitoso",
        description: "¡Bienvenido de nuevo!",
      });
      router.push("/appointments"); 
    }
    else {
      toast({
        variant: "destructive",
        title: "Falló el Inicio de Sesión",
        description: "Correo o contraseña inválidos. Por favor, inténtalo de nuevo.",
      });
      form.setError("email", { type: "manual", message: " " }); 
      form.setError("password", { type: "manual", message: "Credenciales inválidas" });
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-background to-secondary/30 p-4">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="space-y-1 text-center">
          <div className="inline-flex items-center justify-center p-2 bg-primary rounded-full mb-3 mx-auto">
            <Stethoscope className="h-10 w-10 text-primary-foreground" />
          </div>
          <CardTitle className="text-3xl font-bold text-primary">Bienvenido a MediSchedule</CardTitle>
          <CardDescription>Ingresa tus credenciales para acceder a tu cuenta</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Correo Electrónico</FormLabel>
                    <FormControl>
                      <Input placeholder="nombre@ejemplo.com" {...field} />
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
                      <FormLabel>Contraseña</FormLabel>
                      <Link
                        href="#" 
                        className="text-sm text-primary hover:underline"
                        prefetch={false}
                      >
                        ¿Olvidaste tu contraseña?
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
                {form.formState.isSubmitting ? "Iniciando Sesión..." : <> <LogIn className="mr-2 h-4 w-4" /> Iniciar Sesión </>}
              </Button>
            </form>
          </Form>
          <div className="mt-6 text-center text-sm">
            El registro es gestionado por administradores.
            <br/>
            Contacta a soporte si necesitas una cuenta.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
