
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
  CardDescription as ShadcnCardDescription,
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
import { Combobox, type ComboboxOption } from "@/components/ui/combobox";
import { cn } from "@/lib/utils";
import { BookAppointmentFormSchema, type BookAppointmentFormValues } from "@/lib/schemas";
import { mockProfessionals, mockSpecialties, mockPatients } from "@/lib/data";
import { CalendarIcon, CheckCircle, Send, Users, BriefcaseMedical, UserSquare2 } from "lucide-react";
import { format } from "date-fns";
import { es } from 'date-fns/locale';
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

// Mock data mapping for Combobox
const patientOptions: ComboboxOption[] = mockPatients.map(patient => ({
  value: patient.id,
  label: patient.name,
  document: patient.document,
}));

const professionalOptions: ComboboxOption[] = mockProfessionals.map(prof => ({
  value: prof.id,
  label: prof.name,
  document: prof.document,
}));

const specialtyOptions: ComboboxOption[] = mockSpecialties.map(spec => ({
  value: spec.id,
  label: spec.name,
}));


export default function BookAppointmentPage() {
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<BookAppointmentFormValues>({
    resolver: zodResolver(BookAppointmentFormSchema),
    defaultValues: {
      patientId: undefined,
      professionalId: undefined,
      specialtyId: undefined,
      appointmentType: undefined,
      appointmentDate: undefined,
      appointmentTime: "",
      location: "",
      videoCallLink: "",
      notes: "",
    },
  });

  const appointmentType = form.watch("appointmentType");
  const selectedProfessionalId = form.watch("professionalId");

  // Filter specialties based on selected professional
  const availableSpecialtyOptions = React.useMemo(() => {
    if (!selectedProfessionalId) {
      return specialtyOptions; // Show all if no professional is selected
    }
    const professional = mockProfessionals.find(p => p.id === selectedProfessionalId);
    if (professional) {
      return specialtyOptions.filter(spec => professional.specialtyIds.includes(spec.value));
    }
    return [];
  }, [selectedProfessionalId]);

  // Reset specialty if selected professional changes and current specialty is not available
  React.useEffect(() => {
    const currentSpecialtyId = form.getValues("specialtyId");
    if (currentSpecialtyId && selectedProfessionalId) {
        const professional = mockProfessionals.find(p => p.id === selectedProfessionalId);
        if (professional && !professional.specialtyIds.includes(currentSpecialtyId)) {
            form.setValue("specialtyId", undefined, { shouldValidate: true });
        }
    }
  }, [selectedProfessionalId, form]);


  async function onSubmit(data: BookAppointmentFormValues) {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    const patientName = mockPatients.find(p => p.id === data.patientId)?.name || "N/A";
    const professionalName = mockProfessionals.find(p => p.id === data.professionalId)?.name || "N/A";
    const specialtyName = mockSpecialties.find(s => s.id === data.specialtyId)?.name;
    
    console.log("Datos de la cita:", data);
    toast({
      title: "Cita Solicitada Exitosamente",
      description: (
        <div className="space-y-1">
          <p>Paciente: {patientName}</p>
          <p>Profesional: {professionalName}</p>
          {specialtyName && <p>Especialidad: {specialtyName}</p>}
          <p>Fecha: {data.appointmentDate ? format(data.appointmentDate, "PPP", { locale: es }) : 'N/A'} a las {data.appointmentTime}</p>
          <p>Tipo: {data.appointmentType === "presencial" ? "Presencial" : "Virtual"}</p>
        </div>
      ),
      action: <CheckCircle className="text-green-500" />,
    });
    // form.reset(); // Optionally reset form
  }

  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <Card className="max-w-2xl mx-auto shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold tracking-tight text-primary flex items-center gap-2">
            <CalendarIcon className="h-6 w-6" />
            Agendar Nueva Cita
          </CardTitle>
          <ShadcnCardDescription>
            Complete el formulario para solicitar una nueva cita médica.
          </ShadcnCardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="patientId"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel className="flex items-center gap-1"><UserSquare2 className="h-4 w-4 text-muted-foreground"/> Nombre del Paciente</FormLabel>
                    <Combobox
                      options={patientOptions}
                      value={field.value}
                      onSelect={field.onChange}
                      placeholder="Seleccione un paciente..."
                      searchPlaceholder="Buscar por nombre o cédula..."
                      emptySearchMessage="Paciente no encontrado."
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="professionalId"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel className="flex items-center gap-1"><Users className="h-4 w-4 text-muted-foreground"/> Profesional</FormLabel>
                      <Combobox
                        options={professionalOptions}
                        value={field.value}
                        onSelect={(value) => {
                            field.onChange(value);
                            const prof = mockProfessionals.find(p => p.id === value);
                            const currentSpecId = form.getValues("specialtyId");
                            if (prof && currentSpecId && !prof.specialtyIds.includes(currentSpecId)) {
                                form.setValue("specialtyId", undefined, { shouldValidate: true });
                            }
                        }}
                        placeholder="Seleccione un profesional..."
                        searchPlaceholder="Buscar por nombre o documento..."
                        emptySearchMessage="Profesional no encontrado."
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="specialtyId"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel className="flex items-center gap-1"><BriefcaseMedical className="h-4 w-4 text-muted-foreground"/> Especialidad (Opcional)</FormLabel>
                       <Combobox
                        options={availableSpecialtyOptions}
                        value={field.value}
                        onSelect={field.onChange}
                        placeholder="Seleccione una especialidad..."
                        searchPlaceholder="Buscar especialidad..."
                        emptySearchMessage="Especialidad no encontrada o no disponible para el profesional."
                        disabled={!selectedProfessionalId || availableSpecialtyOptions.length === 0}
                      />
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
                              date < new Date(new Date().setHours(0,0,0,0)) 
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
