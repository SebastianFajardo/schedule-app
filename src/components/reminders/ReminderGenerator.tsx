"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AppointmentReminderSchema, type AppointmentReminderFormValues } from "@/lib/schemas";
import { generateAppointmentReminder } from "@/ai/flows/appointment-reminder-generator";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { BellRing, Wand2, ClipboardCopy, Check } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { es } from 'date-fns/locale';
import { cn } from "@/lib/utils";

export default function ReminderGenerator() {
  const [generatedMessage, setGeneratedMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const { toast } = useToast();

  const form = useForm<AppointmentReminderFormValues>({
    resolver: zodResolver(AppointmentReminderSchema),
    defaultValues: {
      patientName: "",
      appointmentDateTime: "", 
      location: "",
      specialInstructions: "",
    },
  });

  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedTime, setSelectedTime] = useState<string>("");


  const handleGenerateReminder = async (values: AppointmentReminderFormValues) => {
    setIsLoading(true);
    setGeneratedMessage(null);
    try {
      const combinedDateTime = selectedDate && selectedTime 
        ? `${format(selectedDate, "yyyy-MM-dd")}T${selectedTime}` 
        : values.appointmentDateTime; 
      
      const inputForAI = { ...values, appointmentDateTime: combinedDateTime };

      const result = await generateAppointmentReminder(inputForAI);
      if (result && result.reminderMessage) {
        setGeneratedMessage(result.reminderMessage);
        toast({
          title: "Recordatorio Generado",
          description: "El recordatorio de la cita ha sido generado exitosamente.",
        });
      } else {
        throw new Error("No se pudo generar el mensaje de recordatorio.");
      }
    } catch (error) {
      console.error("Error generando recordatorio:", error);
      toast({
        variant: "destructive",
        title: "Falló la Generación",
        description: error instanceof Error ? error.message : "Ocurrió un error desconocido.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyToClipboard = () => {
    if (generatedMessage) {
      navigator.clipboard.writeText(generatedMessage).then(() => {
        setIsCopied(true);
        toast({ title: "¡Copiado al portapapeles!" });
        setTimeout(() => setIsCopied(false), 2000);
      }).catch(err => {
        console.error("Error al copiar:", err);
        toast({ variant: "destructive", title: "Error al copiar" });
      });
    }
  };

  return (
    <div className="grid md:grid-cols-2 gap-8 items-start">
      <Card className="shadow-xl">
        <CardHeader>
          <div className="flex items-center gap-2 mb-2">
            <Wand2 className="h-6 w-6 text-primary" />
            <CardTitle className="text-2xl">Recordatorio de Cita con IA</CardTitle>
          </div>
          <CardDescription>
            Ingrese los detalles de la cita para generar un mensaje de recordatorio personalizado usando IA.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleGenerateReminder)} className="space-y-6">
              <FormField
                control={form.control}
                name="patientName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre del Paciente</FormLabel>
                    <FormControl>
                      <Input placeholder="Ej: Carlos Ruiz" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  name="appointmentDateUI" 
                  render={() => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Fecha de la Cita</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full justify-start text-left font-normal",
                                !selectedDate && "text-muted-foreground"
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {selectedDate ? format(selectedDate, "PPP", { locale: es }) : <span>Elija una fecha</span>}
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={selectedDate}
                            onSelect={setSelectedDate}
                            initialFocus
                            locale={es}
                            disabled={(date) => date < new Date(new Date().setHours(0,0,0,0)) } 
                          />
                        </PopoverContent>
                      </Popover>
                      {!selectedDate && form.formState.isSubmitted && <FormMessage>La fecha es obligatoria.</FormMessage>}
                    </FormItem>
                  )}
                />
                <FormField
                  name="appointmentTimeUI" 
                  render={() => (
                     <FormItem>
                        <FormLabel>Hora de la Cita (HH:MM)</FormLabel>
                        <FormControl>
                          <Input 
                            type="time" 
                            value={selectedTime}
                            onChange={(e) => setSelectedTime(e.target.value)}
                          />
                        </FormControl>
                        {!selectedTime && form.formState.isSubmitted && <FormMessage>La hora es obligatoria.</FormMessage>}
                     </FormItem>
                  )}
                />
              </div>
               <FormField
                control={form.control}
                name="appointmentDateTime"
                render={({ field }) => (
                  <FormItem className="hidden">
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ubicación</FormLabel>
                    <FormControl>
                      <Input placeholder="Ej: Clínica A, Consultorio 101" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="specialInstructions"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Instrucciones Especiales (Opcional)</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Ej: Por favor, llegue 15 minutos antes." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isLoading || !selectedDate || !selectedTime}>
                {isLoading ? "Generando..." : "Generar Recordatorio"}
                <Wand2 className="ml-2 h-4 w-4" />
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Card className="shadow-xl h-full">
        <CardHeader>
          <div className="flex items-center gap-2 mb-2">
            <BellRing className="h-6 w-6 text-primary" />
            <CardTitle className="text-2xl">Recordatorio Generado</CardTitle>
          </div>
          <CardDescription>
            Revise el mensaje generado por IA a continuación. Puede copiarlo para usarlo.
          </CardDescription>
        </CardHeader>
        <CardContent className="h-full flex flex-col">
          {isLoading && (
            <div className="flex flex-col items-center justify-center flex-grow space-y-2">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              <p className="text-muted-foreground">Generando su recordatorio...</p>
            </div>
          )}
          {!isLoading && generatedMessage && (
            <div className="bg-secondary/50 p-4 rounded-md border border-input flex-grow">
              <p className="text-sm whitespace-pre-wrap leading-relaxed text-foreground">{generatedMessage}</p>
            </div>
          )}
          {!isLoading && !generatedMessage && (
            <div className="flex items-center justify-center text-center text-muted-foreground border-2 border-dashed border-input rounded-md p-8 flex-grow">
              <p>Su mensaje de recordatorio generado aparecerá aquí.</p>
            </div>
          )}
        </CardContent>
        {generatedMessage && !isLoading && (
          <CardFooter>
            <Button onClick={handleCopyToClipboard} variant="outline" className="w-full" disabled={isCopied}>
              {isCopied ? <Check className="mr-2 h-4 w-4 text-green-500" /> : <ClipboardCopy className="mr-2 h-4 w-4" />}
              {isCopied ? "¡Copiado!" : "Copiar Mensaje"}
            </Button>
          </CardFooter>
        )}
      </Card>
    </div>
  );
}
