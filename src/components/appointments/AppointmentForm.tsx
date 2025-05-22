"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { NewAppointmentSchema, type NewAppointmentFormValues, mockDoctors, mockSpecialties, mockLocations } from "@/lib/schemas";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { CalendarIcon, CalendarPlus, UserPlus, Stethoscope as StethoscopeIcon, MapPin } from "lucide-react";
import { format } from "date-fns";
import { es } from 'date-fns/locale'; // Import Spanish locale
import { cn } from "@/lib/utils";

export default function AppointmentForm() {
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<NewAppointmentFormValues>({
    resolver: zodResolver(NewAppointmentSchema),
    defaultValues: {
      patientName: "",
      doctorId: "",
      specialty: "",
      appointmentDate: undefined,
      appointmentTime: "",
      location: "",
      notes: "",
      isVideoCall: false,
    },
  });

  const onSubmit = async (data: NewAppointmentFormValues) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log("Nueva Cita Data:", data);
    
    toast({
      title: "Cita Registrada",
      description: `La cita para ${data.patientName} el ${format(data.appointmentDate, "PPP", { locale: es })} a las ${data.appointmentTime} ha sido programada exitosamente.`,
    });
    form.reset(); 
  };

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-xl">
      <CardHeader>
        <div className="flex items-center gap-2 mb-2">
          <CalendarPlus className="h-6 w-6 text-primary" />
          <CardTitle className="text-2xl">Registrar Nueva Cita</CardTitle>
        </div>
        <CardDescription>
          Complete los detalles a continuación para programar una nueva cita médica para un paciente.
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
                  <FormLabel className="flex items-center gap-1"><UserPlus className="h-4 w-4"/>Nombre del Paciente</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej: Ana García" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="doctorId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-1"><StethoscopeIcon className="h-4 w-4"/>Asignar Doctor(a)</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccione un(a) doctor(a)" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {mockDoctors.map(doc => (
                          <SelectItem key={doc.id} value={doc.id}>{doc.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="specialty"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Especialidad Médica</FormLabel>
                     <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccione una especialidad" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {mockSpecialties.map(spec => (
                          <SelectItem key={spec.id} value={spec.id}>{spec.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="appointmentDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel className="flex items-center gap-1"><CalendarIcon className="h-4 w-4"/>Fecha de la Cita</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {field.value ? format(field.value, "PPP", { locale: es }) : <span>Elija una fecha</span>}
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date < new Date(new Date().setHours(0,0,0,0))}
                          initialFocus
                          locale={es} // Add Spanish locale to Calendar
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
                    <FormLabel>Hora de la Cita (HH:MM)</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-1"><MapPin className="h-4 w-4"/>Ubicación</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccione una ubicación" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {mockLocations.map(loc => (
                          <SelectItem key={loc.id} value={loc.id}>{loc.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notas Adicionales (Opcional)</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Ej: Paciente prefiere citas matutinas, visita de seguimiento." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="isVideoCall"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-3 shadow-sm">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>
                      Es una videollamada / cita de telemedicina
                    </FormLabel>
                  </div>
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? "Registrando..." : "Registrar Cita"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
