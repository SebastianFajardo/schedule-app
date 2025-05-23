
"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { BookAppointmentFormSchema, type BookAppointmentFormValues } from "@/lib/schemas";
import { CalendarIcon, CheckCircle, Send } from "lucide-react";
import { format } from "date-fns";
import { es } from 'date-fns/locale';
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

export default function BookAppointmentPage() {
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<BookAppointmentFormValues>({
    resolver: zodResolver(BookAppointmentFormSchema),
    defaultValues: {
      patientName: "",
      doctorService: "",
      specialty: "",
      appointmentType: undefined, // "presencial" or "virtual"
      appointmentDate: undefined,
      appointmentTime: "",
      location: "",
      videoCallLink: "",
      notes: "",
    },
  });

  const appointmentType = form.watch("appointmentType");

  async function onSubmit(data: BookAppointmentFormValues) {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    console.log("Datos de la cita:", data);
    toast({
      title: "Cita Solicitada Exitosamente",
      description: (
        <div className="space-y-1">
          <p>Paciente: {data.patientName}</p>
          <p>Fecha: {format(data.appointmentDate, "PPP", { locale: es })} a las {data.appointmentTime}</p>
          <p>Tipo: {data.appointmentType === "presencial" ? "Presencial" : "Virtual"}</p>
        </div>
      ),
      action: <CheckCircle className="text-green-500" />,
    });
    // Optionally, reset form or redirect
    // form.reset();
    // router.push("/dashboard"); // Example redirect
  }

  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <Card className="max-w-2xl mx-auto shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold tracking-tight text-primary flex items-center gap-2">
            <CalendarIcon className="h-6 w-6" />
            Agendar Nueva Cita
          </CardTitle>
          <CardDescription>
            Complete el formulario para solicitar una nueva cita médica.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="patientName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre del Paciente</FormLabel>
                    <FormControl>
                      <Input placeholder="Ej: Juan Pérez" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="doctorService"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Doctor o Servicio</FormLabel>
                      <FormControl>
                        <Input placeholder="Ej: Dra. Ana López, Chequeo General" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="specialty"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Especialidad (Opcional)</FormLabel>
                      <FormControl>
                        <Input placeholder="Ej: Cardiología, Pediatría" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="appointmentType"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>Tipo de Cita</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-col sm:flex-row sm:gap-8 space-y-2 sm:space-y-0"
                      >
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="presencial" />
                          </FormControl>
                          <FormLabel className="font-normal">
                            Presencial
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="virtual" />
                          </FormControl>
                          <FormLabel className="font-normal">
                            Virtual
                          </FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="appointmentDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Fecha de la Cita</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP", { locale: es })
                              ) : (
                                <span>Seleccione una fecha</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) =>
                              date < new Date(new Date().setHours(0,0,0,0)) // Disable past dates
                            }
                            initialFocus
                            locale={es}
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="appointmentTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Hora de la Cita</FormLabel>
                      <FormControl>
                        <Input type="time" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {appointmentType === "presencial" && (
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ubicación</FormLabel>
                      <FormControl>
                        <Input placeholder="Ej: Clínica Central, Consultorio 10B" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {appointmentType === "virtual" && (
                <FormField
                  control={form.control}
                  name="videoCallLink"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Enlace de Videollamada</FormLabel>
                      <FormControl>
                        <Input placeholder="Ej: https://meet.example.com/xxxx-xxxx-xxxx" {...field} />
                      </FormControl>
                      <FormDescription>
                        Se utilizará este enlace para la cita virtual.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notas Adicionales (Opcional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Cualquier información relevante para la cita..."
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? "Enviando Solicitud..." : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Solicitar Cita
                  </>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}

