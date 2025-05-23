
"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { BookAppointmentFormSchema, type BookAppointmentFormValues } from "@/lib/schemas";
import { mockProfessionals, mockSpecialties, mockPatients } from "@/lib/data";
import type { Professional, Specialty, Patient } from "@/types";
import { CalendarIcon, CheckCircle, Send, Users, BriefcaseMedical, UserSquare2, Clock, Search as SearchIconLucide } from "lucide-react";
import { format, parse, startOfDay, isBefore, isEqual, parseISO, addDays } from "date-fns";
import { es } from 'date-fns/locale';
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

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

  const currentProfessional = React.useMemo(() => 
    mockProfessionals.find(p => p.id === currentProfessionalId), 
    [currentProfessionalId]
  );

  const availableSpecialtyOptionsForForm = React.useMemo(() => {
    if (!currentProfessionalId) {
      return allSpecialtyOptions;
    }
    const professional = mockProfessionals.find(p => p.id === currentProfessionalId);
    if (!professional) return allSpecialtyOptions;
    return allSpecialtyOptions.filter(spec => professional.specialtyIds.includes(spec.value));
  }, [currentProfessionalId]);


  React.useEffect(() => {
    if (currentProfessionalId && currentSpecialtyId) {
        const professional = mockProfessionals.find(p => p.id === currentProfessionalId);
        if (professional && !professional.specialtyIds.includes(currentSpecialtyId)) {
            form.setValue("specialtyId", undefined, { shouldValidate: true }); 
        }
    }
    if (!currentProfessionalId && currentSpecialtyId) { // If professional is cleared, clear specialty
        form.setValue("specialtyId", undefined, { shouldValidate: true });
    }
    setSelectedCalendarDate(undefined);
    setTimeSlotsForSelectedDate([]);
    form.setValue("selectedDateTimeSlot", "", { shouldValidate: false }); 
  }, [currentProfessionalId, currentSpecialtyId, form]);

  
  const handleFormProfessionalChange = (profId: string | undefined) => {
    form.setValue("professionalId", profId, { shouldValidate: true });
    const professional = mockProfessionals.find(p => p.id === profId);
    // If the selected professional doesn't offer the current specialty, clear specialty
    if (profId && currentSpecialtyId && professional && !professional.specialtyIds.includes(currentSpecialtyId)) {
        form.setValue("specialtyId", undefined, { shouldValidate: true });
    } else if (!profId) { // If professional is cleared, clear specialty
        form.setValue("specialtyId", undefined, { shouldValidate: true });
    }
    // Reset date/time selection as availability changes
    setSelectedCalendarDate(undefined);
    setTimeSlotsForSelectedDate([]);
    form.setValue("selectedDateTimeSlot", "", { shouldValidate: false });
  };

  const handleFormSpecialtyChange = (specId: string | undefined) => {
    form.setValue("specialtyId", specId, { shouldValidate: true });
    // Reset date/time selection as availability might change (though not strictly implemented in mock data by specialty)
    setSelectedCalendarDate(undefined);
    setTimeSlotsForSelectedDate([]);
    form.setValue("selectedDateTimeSlot", "", { shouldValidate: false });
  };
  
  const handleDateSelectInCalendar = (date: Date | undefined) => {
    if (!date || !currentProfessionalId) { 
      setTimeSlotsForSelectedDate([]);
      setSelectedCalendarDate(undefined);
      return;
    }
    setSelectedCalendarDate(date);
    const dateString = format(date, "yyyy-MM-dd");
    const professional = mockProfessionals.find(p => p.id === currentProfessionalId); 
    const professionalAvailability = professional?.availability.find(a => a.date === dateString);
    
    setTimeSlotsForSelectedDate(professionalAvailability ? professionalAvailability.slots : []);
    form.setValue("selectedDateTimeSlot", ""); // Clear previous time slot selection
  };

  const handleTimeSlotSelect = (time: string) => {
    if (selectedCalendarDate) {
      const combined = format(selectedCalendarDate, "yyyy-MM-dd") + "T" + time;
      form.setValue("selectedDateTimeSlot", combined, { shouldValidate: true });
      setIsDateTimePickerOpen(false); 
    }
  };

  const isDateUnavailable = (date: Date): boolean => {
    if (!currentProfessionalId) return true; // No professional selected, all dates unavailable
    // Disable past dates, except today
    if (isBefore(date, startOfDay(new Date())) && !isEqual(date, startOfDay(new Date()))) return true;

    const dateString = format(date, "yyyy-MM-dd");
    const professional = mockProfessionals.find(p => p.id === currentProfessionalId); 
    const professionalDayAvailability = professional?.availability.find(a => a.date === dateString);
    
    return !professionalDayAvailability || professionalDayAvailability.slots.length === 0;
  };

  // Handlers for comboboxes INSIDE the dialog, which will update the main form's state
  const handleDialogProfessionalChange = (profId: string | undefined) => {
    form.setValue("professionalId", profId, { shouldValidate: true });
    // If professional changes, reset specialty if not compatible, and reset date/time
    const professional = mockProfessionals.find(p => p.id === profId);
    if (profId && currentSpecialtyId && professional && !professional.specialtyIds.includes(currentSpecialtyId)) {
        form.setValue("specialtyId", undefined, { shouldValidate: true });
    } else if (!profId) { 
        form.setValue("specialtyId", undefined, { shouldValidate: true });
    }
    setSelectedCalendarDate(undefined);
    setTimeSlotsForSelectedDate([]);
    form.setValue("selectedDateTimeSlot", "", { shouldValidate: false });
  };

  const handleDialogSpecialtyChange = (specId: string | undefined) => {
    form.setValue("specialtyId", specId, { shouldValidate: true }); // Allow specialty change to re-validate professionalId
    // Reset date/time selection
    setSelectedCalendarDate(undefined);
    setTimeSlotsForSelectedDate([]);
    form.setValue("selectedDateTimeSlot", "", { shouldValidate: false });
  };

  const findNextAvailableDateAndSelect = () => {
    if (!currentProfessional || !currentProfessional.availability) {
      toast({ title: "Información", description: "Por favor, seleccione un profesional primero." });
      return;
    }

    const today = startOfDay(new Date());
    const futureAvailableDates = currentProfessional.availability
      .map(avail => ({ ...avail, dateObj: parseISO(avail.date) }))
      .filter(avail => avail.slots.length > 0 && !isBefore(avail.dateObj, today))
      .sort((a, b) => a.dateObj.getTime() - b.dateObj.getTime());

    if (futureAvailableDates.length > 0) {
      handleDateSelectInCalendar(futureAvailableDates[0].dateObj);
      toast({
        title: "Fecha Encontrada",
        description: `Se seleccionó la próxima fecha disponible: ${format(futureAvailableDates[0].dateObj, "PPP", { locale: es })}`,
        action: <CheckCircle className="text-green-500" />,
      });
    } else {
      toast({
        title: "Sin Disponibilidad",
        description: "No se encontraron fechas futuras disponibles para este profesional.",
        variant: "destructive"
      });
    }
  };


  async function onSubmit(data: BookAppointmentFormValues) {
    await new Promise(resolve => setTimeout(resolve, 1000)); 

    const patientName = patientOptions.find(p => p.value === data.patientId)?.label || "N/A";
    const professionalName = professionalOptions.find(p => p.value === data.professionalId)?.label || "N/A";
    const specialtyName = allSpecialtyOptions.find(s => s.value === data.specialtyId)?.label;
    
    let formattedDateTime = "N/A";
    if (data.selectedDateTimeSlot) {
        try {
            const [datePart, timePart] = data.selectedDateTimeSlot.split("T");
            const dateObj = parseISO(datePart);
            formattedDateTime = `${format(dateObj, "PPP", { locale: es })} a las ${timePart}`;
        } catch (e) {
            console.error("Error parsing date/time slot:", e);
            formattedDateTime = data.selectedDateTimeSlot; 
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
    // router.push("/appointments"); 
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
                name="professionalId"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel className="flex items-center gap-1"><Users className="h-4 w-4 text-muted-foreground"/> Profesional</FormLabel>
                    <Combobox
                      options={professionalOptions}
                      value={field.value}
                      onSelect={(value) => handleFormProfessionalChange(value)}
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
                      options={availableSpecialtyOptionsForForm}
                      value={field.value}
                      onSelect={(value) => handleFormSpecialtyChange(value)}
                      placeholder="Seleccione una especialidad..."
                      searchPlaceholder="Buscar especialidad..."
                      emptySearchMessage="Especialidad no disponible."
                      disabled={!currentProfessionalId || availableSpecialtyOptionsForForm.length === 0}
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
                        <Button 
                          variant="outline" 
                          className={cn("w-full justify-start text-left font-normal", !field.value && "text-muted-foreground")}
                          disabled={!currentProfessionalId} 
                          type="button"
                        >
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
                      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader className="p-6 pb-4 border-b">
                          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                            <DialogTitle>Seleccionar Profesional, Especialidad, Fecha y Hora</DialogTitle>
                            <Button
                              type="button"
                              size="sm"
                              variant="outline"
                              onClick={findNextAvailableDateAndSelect}
                              disabled={!currentProfessionalId}
                              className="mt-2 sm:mt-0 w-full sm:w-auto"
                            >
                              <SearchIconLucide className="mr-2 h-4 w-4" />
                              Buscar Fecha Más Cercana
                            </Button>
                          </div>
                          <DialogDescription className="pt-1">
                            Puede ajustar el profesional o especialidad para ver diferentes disponibilidades. Luego elija un día y una hora.
                          </DialogDescription>
                        </DialogHeader>
                        
                        <div className="p-6 space-y-4"> 
                            <div className="grid sm:grid-cols-2 gap-4">
                                <FormItem className="flex flex-col"> {/* Not a FormField, just FormItem for layout */}
                                    <FormLabel className="flex items-center gap-1"><Users className="h-4 w-4 text-muted-foreground"/> Profesional</FormLabel>
                                    <Combobox
                                      options={professionalOptions}
                                      value={currentProfessionalId} 
                                      onSelect={(value) => handleDialogProfessionalChange(value)} 
                                      placeholder="Seleccione un profesional..."
                                      searchPlaceholder="Buscar por nombre o documento..."
                                      emptySearchMessage="Profesional no encontrado."
                                    />
                                </FormItem>
                                <FormItem className="flex flex-col"> {/* Not a FormField, just FormItem for layout */}
                                    <FormLabel className="flex items-center gap-1"><BriefcaseMedical className="h-4 w-4 text-muted-foreground"/> Especialidad</FormLabel>
                                    <Combobox
                                      options={availableSpecialtyOptionsForForm} // Use the same options as the main form for consistency
                                      value={currentSpecialtyId} 
                                      onSelect={(value) => handleDialogSpecialtyChange(value)} 
                                      placeholder="Seleccione una especialidad..."
                                      searchPlaceholder="Buscar especialidad..."
                                      emptySearchMessage="Especialidad no disponible."
                                      disabled={!currentProfessionalId || availableSpecialtyOptionsForForm.length === 0}
                                    />
                                </FormItem>
                            </div>
                        
                            {!currentProfessionalId && ( 
                                <div className="flex flex-col items-center justify-center text-muted-foreground py-10">
                                    <Users className="h-12 w-12 mb-2"/>
                                    <p className="text-center">Por favor, seleccione un profesional para ver la disponibilidad.</p>
                                </div>
                            )}

                            {currentProfessionalId && ( 
                              <div className="flex flex-col md:flex-row gap-6"> 
                                <div className="md:w-1/2">
                                    <Calendar
                                      mode="single"
                                      selected={selectedCalendarDate}
                                      onSelect={handleDateSelectInCalendar}
                                      disabled={isDateUnavailable}
                                      initialFocus
                                      locale={es}
                                      className="rounded-md border w-full" 
                                    />
                                </div>
                                <div className="md:w-1/2"> 
                                  <h3 className="text-lg font-medium mb-2 text-center md:text-left">
                                    {selectedCalendarDate ? `Horas para ${format(selectedCalendarDate, "PPP", { locale: es })}` : "Seleccione una fecha"}
                                  </h3>
                                  {selectedCalendarDate && timeSlotsForSelectedDate.length > 0 && (
                                    <ScrollArea className="border rounded-md p-2 h-48"> 
                                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                        {timeSlotsForSelectedDate.map((time) => (
                                          <Button
                                            key={time}
                                            variant="outline"
                                            onClick={() => handleTimeSlotSelect(time)}
                                            type="button"
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
                                  {!selectedCalendarDate && currentProfessionalId && (
                                     <p className="text-center text-muted-foreground mt-4">Haga clic en un día del calendario para ver las horas.</p>
                                  )}
                                </div>
                              </div>
                            )}
                        </div>
                        <DialogFooter className="p-6 pt-4 border-t">
                            <DialogClose asChild>
                                <Button variant="outline" type="button">Cancelar</Button>
                            </DialogClose>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                    <FormMessage />
                    {!currentProfessionalId && (
                        <ShadcnCardDescription> {/* Changed from FormDescription to avoid conflict/style issues */}
                            Para ver la disponibilidad, primero seleccione un profesional y luego haga clic en "Seleccione fecha y hora...".
                        </ShadcnCardDescription>
                    )}
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
                      <ShadcnCardDescription> {/* Changed from FormDescription */}
                        Se utilizará este enlace para la cita virtual.
                      </ShadcnCardDescription>
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

    