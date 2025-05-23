
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Combobox, type ComboboxOption } from "@/components/ui/combobox";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { BookAppointmentFormSchema, type BookAppointmentFormValues } from "@/lib/schemas";
import { mockProfessionals, mockSpecialties, mockPatients } from "@/lib/data";
import type { Professional, Specialty, Patient } from "@/types";
import { CalendarIcon, CheckCircle, Send, Users, BriefcaseMedical, UserSquare2, Clock, X, Search } from "lucide-react";
import { format, parse, startOfDay, isBefore, isEqual, parseISO } from "date-fns";
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

const allSpecialtyOptions: ComboboxOption[] = mockSpecialties.map(spec => ({
  value: spec.id,
  label: spec.name,
}));


export default function BookAppointmentPage() {
  const { toast } = useToast();
  const router = useRouter();

  const [isDateTimePickerOpen, setIsDateTimePickerOpen] = React.useState(false);
  const [selectedCalendarDate, setSelectedCalendarDate] = React.useState<Date | undefined>();
  const [timeSlotsForSelectedDate, setTimeSlotsForSelectedDate] = React.useState<string[]>([]);
  
  const form = useForm<BookAppointmentFormValues>({
    resolver: zodResolver(BookAppointmentFormSchema),
    defaultValues: {
      patientId: undefined,
      professionalId: undefined,
      specialtyId: undefined,
      appointmentType: undefined,
      selectedDateTimeSlot: "",
      location: "",
      videoCallLink: "",
      notes: "",
    },
  });

  const appointmentType = form.watch("appointmentType");
  const currentProfessionalId = form.watch("professionalId");
  const currentSpecialtyId = form.watch("specialtyId");
  const currentSelectedDateTimeSlot = form.watch("selectedDateTimeSlot");

  const currentProfessional = React.useMemo(() => 
    mockProfessionals.find(p => p.id === currentProfessionalId), 
    [currentProfessionalId]
  );

  const currentSpecialty = React.useMemo(() => 
    mockSpecialties.find(s => s.id === currentSpecialtyId),
    [currentSpecialtyId]
  );
  
  // Filter specialties based on selected professional
  const availableSpecialtyOptions = React.useMemo(() => {
    if (!currentProfessional) {
      return allSpecialtyOptions; // Or an empty array if you prefer no specialties shown without a professional
    }
    return allSpecialtyOptions.filter(spec => currentProfessional.specialtyIds.includes(spec.value));
  }, [currentProfessional]);

  // Reset specialty if selected professional changes and current specialty is not available
  React.useEffect(() => {
    if (currentProfessionalId && currentSpecialtyId) {
        const professional = mockProfessionals.find(p => p.id === currentProfessionalId);
        if (professional && !professional.specialtyIds.includes(currentSpecialtyId)) {
            form.setValue("specialtyId", undefined, { shouldValidate: false }); // No need to validate here
            setSelectedCalendarDate(undefined);
            setTimeSlotsForSelectedDate([]);
            form.setValue("selectedDateTimeSlot", "");
        }
    }
  }, [currentProfessionalId, currentSpecialtyId, form]);

  // Reset date/time if professional or specialty changes
  React.useEffect(() => {
    setSelectedCalendarDate(undefined);
    setTimeSlotsForSelectedDate([]);
    form.setValue("selectedDateTimeSlot", "", { shouldValidate: false }); // No need to validate here
  }, [currentProfessionalId, currentSpecialtyId, form]);


  const handleProfessionalChange = (profId: string | undefined) => {
    form.setValue("professionalId", profId, { shouldValidate: true });
    form.setValue("specialtyId", undefined); 
    setSelectedCalendarDate(undefined);
    setTimeSlotsForSelectedDate([]);
    form.setValue("selectedDateTimeSlot", "");
  };

  const handleSpecialtyChange = (specId: string | undefined) => {
    form.setValue("specialtyId", specId, { shouldValidate: true });
    setSelectedCalendarDate(undefined);
    setTimeSlotsForSelectedDate([]);
    form.setValue("selectedDateTimeSlot", "");
  };
  
  const handleDateSelectInCalendar = (date: Date | undefined) => {
    if (!date || !currentProfessional) {
      setTimeSlotsForSelectedDate([]);
      setSelectedCalendarDate(undefined);
      return;
    }
    setSelectedCalendarDate(date);
    const dateString = format(date, "yyyy-MM-dd");
    const professionalAvailability = currentProfessional.availability.find(a => a.date === dateString);
    
    // TODO: Filter by specialty if currentSpecialtyId is set and professional availability includes specialty info
    setTimeSlotsForSelectedDate(professionalAvailability ? professionalAvailability.slots : []);
    form.setValue("selectedDateTimeSlot", ""); // Reset selected slot if date changes
  };

  const handleTimeSlotSelect = (time: string) => {
    if (selectedCalendarDate) {
      const combined = format(selectedCalendarDate, "yyyy-MM-dd") + "T" + time;
      form.setValue("selectedDateTimeSlot", combined, { shouldValidate: true });
      setIsDateTimePickerOpen(false);
    }
  };

  const isDateUnavailable = (date: Date): boolean => {
    if (!currentProfessional) return true; 
    if (isBefore(startOfDay(date), startOfDay(new Date()))) return true;

    const dateString = format(date, "yyyy-MM-dd");
    const professionalDayAvailability = currentProfessional.availability.find(a => a.date === dateString);
    
    return !professionalDayAvailability || professionalDayAvailability.slots.length === 0;
  };

  const handleRemoveProfessionalFilter = () => {
    form.setValue("professionalId", undefined, {shouldValidate: true});
    form.setValue("specialtyId", undefined, {shouldValidate: true});
    form.setValue("selectedDateTimeSlot", "", {shouldValidate: true});
    setSelectedCalendarDate(undefined);
    setTimeSlotsForSelectedDate([]);
  };

  const handleRemoveSpecialtyFilter = () => {
    form.setValue("specialtyId", undefined, {shouldValidate: true});
    form.setValue("selectedDateTimeSlot", "", {shouldValidate: true});
    setSelectedCalendarDate(undefined);
    setTimeSlotsForSelectedDate([]);
  };


  async function onSubmit(data: BookAppointmentFormValues) {
    await new Promise(resolve => setTimeout(resolve, 1000));

    const patientName = mockPatients.find(p => p.id === data.patientId)?.name || "N/A";
    const professionalName = mockProfessionals.find(p => p.id === data.professionalId)?.name || "N/A";
    const specialtyName = mockSpecialties.find(s => s.id === data.specialtyId)?.name;
    
    let formattedDateTime = "N/A";
    if (data.selectedDateTimeSlot) {
        try {
            const [datePart, timePart] = data.selectedDateTimeSlot.split("T");
            const dateObj = parseISO(datePart);
            formattedDateTime = `${format(dateObj, "PPP", { locale: es })} a las ${timePart}`;
        } catch (e) {
            console.error("Error parsing date/time slot:", e);
            formattedDateTime = data.selectedDateTimeSlot; // fallback
        }
    }
    
    console.log("Datos de la cita:", data);
    toast({
      title: "Cita Solicitada Exitosamente",
      description: (
        <div className="space-y-1">
          <p>Paciente: {patientName}</p>
          <p>Profesional: {professionalName}</p>
          {specialtyName && <p>Especialidad: {specialtyName}</p>}
          <p>Fecha y Hora: {formattedDateTime}</p>
          <p>Tipo: {data.appointmentType === "presencial" ? "Presencial" : "Virtual"}</p>
        </div>
      ),
      action: <CheckCircle className="text-green-500" />,
    });
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
              
              <FormField
                control={form.control}
                name="selectedDateTimeSlot"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Fecha y Hora de la Cita</FormLabel>
                    <Dialog open={isDateTimePickerOpen} onOpenChange={setIsDateTimePickerOpen}>
                      <DialogTrigger asChild>
                        <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !field.value && "text-muted-foreground")}>
                          {field.value ? 
                            (() => {
                                try {
                                    const [datePart, timePart] = field.value.split("T");
                                    return `${format(parseISO(datePart), "PPP", { locale: es })} a las ${timePart}`;
                                } catch { return "Seleccione fecha y hora...";}
                            })()
                            : "Seleccione fecha y hora..."}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-3xl h-[90vh] flex flex-col p-0 sm:p-6">
                        <DialogHeader className="p-6 sm:p-0 pb-0 sm:pb-2">
                          <DialogTitle>Seleccionar Profesional, Fecha y Hora</DialogTitle>
                          <DialogDescription>
                            Elija un profesional, luego un día disponible y una hora para su cita.
                          </DialogDescription>
                        </DialogHeader>
                        
                        <div className="grid sm:grid-cols-2 gap-4 px-6 sm:px-0 pt-4 sm:pt-2">
                            <FormField
                              control={form.control}
                              name="professionalId"
                              render={({ field: profField }) => (
                                <FormItem className="flex flex-col">
                                  <FormLabel className="flex items-center gap-1"><Users className="h-4 w-4 text-muted-foreground"/> Profesional</FormLabel>
                                  <Combobox
                                    options={professionalOptions}
                                    value={profField.value}
                                    onSelect={(value) => handleProfessionalChange(value)}
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
                              render={({ field: specField }) => (
                                <FormItem className="flex flex-col">
                                  <FormLabel className="flex items-center gap-1"><BriefcaseMedical className="h-4 w-4 text-muted-foreground"/> Especialidad (Opcional)</FormLabel>
                                   <Combobox
                                    options={availableSpecialtyOptions}
                                    value={specField.value}
                                    onSelect={(value) => handleSpecialtyChange(value)}
                                    placeholder="Seleccione una especialidad..."
                                    searchPlaceholder="Buscar especialidad..."
                                    emptySearchMessage="Especialidad no disponible."
                                    disabled={!currentProfessionalId || availableSpecialtyOptions.length === 0}
                                  />
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                        </div>
                        
                        <div className="flex flex-wrap gap-2 my-4 px-6 sm:px-0 items-center">
                            {currentProfessional && (
                                <Badge variant="secondary" className="p-2 text-sm">
                                    Profesional: {currentProfessional.name}
                                    <Button variant="ghost" size="sm" className="ml-1 h-auto p-0.5" onClick={handleRemoveProfessionalFilter}>
                                        <X className="h-3 w-3"/>
                                    </Button>
                                </Badge>
                            )}
                            {currentSpecialty && (
                                <Badge variant="secondary" className="p-2 text-sm">
                                    Especialidad: {currentSpecialty.name}
                                    <Button variant="ghost" size="sm" className="ml-1 h-auto p-0.5" onClick={handleRemoveSpecialtyFilter}>
                                        <X className="h-3 w-3"/>
                                    </Button>
                                </Badge>
                            )}
                        </div>

                        {!currentProfessionalId && (
                            <div className="flex flex-col items-center justify-center flex-1 text-muted-foreground px-6 sm:px-0">
                                <Users className="h-12 w-12 mb-2"/>
                                <p className="text-center">Por favor, seleccione un profesional para ver la disponibilidad.</p>
                            </div>
                        )}

                        {currentProfessionalId && (
                          <div className="grid md:grid-cols-2 gap-6 flex-1 min-h-0 px-6 sm:px-0 pb-6 sm:pb-0">
                            <div className="flex justify-center">
                                <Calendar
                                mode="single"
                                selected={selectedCalendarDate}
                                onSelect={handleDateSelectInCalendar}
                                disabled={isDateUnavailable}
                                initialFocus
                                locale={es}
                                className="rounded-md border self-start"
                                />
                            </div>
                            <div className="flex flex-col min-h-0">
                              <h3 className="text-lg font-medium mb-2 text-center md:text-left">
                                {selectedCalendarDate ? `Horas para ${format(selectedCalendarDate, "PPP", { locale: es })}` : "Seleccione una fecha"}
                              </h3>
                              {selectedCalendarDate && timeSlotsForSelectedDate.length > 0 && (
                                <ScrollArea className="flex-grow border rounded-md p-2">
                                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                    {timeSlotsForSelectedDate.map((time) => (
                                      <Button
                                        key={time}
                                        variant="outline"
                                        onClick={() => handleTimeSlotSelect(time)}
                                      >
                                        {time}
                                      </Button>
                                    ))}
                                  </div>
                                </ScrollArea>
                              )}
                              {selectedCalendarDate && timeSlotsForSelectedDate.length === 0 && (
                                <p className="text-center text-muted-foreground mt-4">No hay horas disponibles para este día.</p>
                              )}
                              {!selectedCalendarDate && (
                                 <p className="text-center text-muted-foreground mt-4">Haga clic en un día del calendario para ver las horas.</p>
                              )}
                            </div>
                          </div>
                        )}
                        <DialogFooter className="mt-auto pt-4 border-t px-6 sm:px-0 pb-6 sm:pb-2">
                            <DialogClose asChild>
                                <Button variant="outline">Cancelar</Button>
                            </DialogClose>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                    <FormMessage />
                  </FormItem>
                )}
              />


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
              <Button type="submit" className="w-full" disabled={form.formState.isSubmitting || !currentProfessionalId}>
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
