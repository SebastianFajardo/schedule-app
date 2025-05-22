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
      appointmentDateTime: "", // Store as YYYY-MM-DDTHH:mm
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
      // Combine date and time for the AI flow
      const combinedDateTime = selectedDate && selectedTime 
        ? `${format(selectedDate, "yyyy-MM-dd")}T${selectedTime}` 
        : values.appointmentDateTime; // Fallback if direct input was used
      
      const inputForAI = { ...values, appointmentDateTime: combinedDateTime };

      const result = await generateAppointmentReminder(inputForAI);
      if (result && result.reminderMessage) {
        setGeneratedMessage(result.reminderMessage);
        toast({
          title: "Reminder Generated",
          description: "The appointment reminder has been successfully generated.",
        });
      } else {
        throw new Error("Failed to generate reminder message.");
      }
    } catch (error) {
      console.error("Error generating reminder:", error);
      toast({
        variant: "destructive",
        title: "Generation Failed",
        description: error instanceof Error ? error.message : "An unknown error occurred.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyToClipboard = () => {
    if (generatedMessage) {
      navigator.clipboard.writeText(generatedMessage).then(() => {
        setIsCopied(true);
        toast({ title: "Copied to clipboard!" });
        setTimeout(() => setIsCopied(false), 2000);
      }).catch(err => {
        console.error("Failed to copy:", err);
        toast({ variant: "destructive", title: "Failed to copy" });
      });
    }
  };

  return (
    <div className="grid md:grid-cols-2 gap-8 items-start">
      <Card className="shadow-xl">
        <CardHeader>
          <div className="flex items-center gap-2 mb-2">
            <Wand2 className="h-6 w-6 text-primary" />
            <CardTitle className="text-2xl">AI Appointment Reminder</CardTitle>
          </div>
          <CardDescription>
            Enter appointment details to generate a personalized reminder message using AI.
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
                    <FormLabel>Patient Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  // This field is not directly part of the schema but used for UI
                  name="appointmentDateUI" // Dummy name
                  render={() => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Appointment Date</FormLabel>
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
                              {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={selectedDate}
                            onSelect={setSelectedDate}
                            initialFocus
                            disabled={(date) => date < new Date(new Date().setHours(0,0,0,0)) } // Disable past dates
                          />
                        </PopoverContent>
                      </Popover>
                      {/* Basic validation message for UI */}
                      {!selectedDate && form.formState.isSubmitted && <FormMessage>Date is required.</FormMessage>}
                    </FormItem>
                  )}
                />
                <FormField
                  // This field is not directly part of the schema but used for UI
                  name="appointmentTimeUI" // Dummy name
                  render={() => (
                     <FormItem>
                        <FormLabel>Appointment Time (HH:MM)</FormLabel>
                        <FormControl>
                          <Input 
                            type="time" 
                            value={selectedTime}
                            onChange={(e) => setSelectedTime(e.target.value)}
                          />
                        </FormControl>
                        {!selectedTime && form.formState.isSubmitted && <FormMessage>Time is required.</FormMessage>}
                     </FormItem>
                  )}
                />
              </div>
              {/* Hidden field to satisfy schema if needed, or adjust schema */}
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
                    <FormLabel>Location</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Clinic A, Room 101" {...field} />
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
                    <FormLabel>Special Instructions (Optional)</FormLabel>
                    <FormControl>
                      <Textarea placeholder="e.g., Please arrive 15 minutes early." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isLoading || !selectedDate || !selectedTime}>
                {isLoading ? "Generating..." : "Generate Reminder"}
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
            <CardTitle className="text-2xl">Generated Reminder</CardTitle>
          </div>
          <CardDescription>
            Review the AI-generated message below. You can copy it for use.
          </CardDescription>
        </CardHeader>
        <CardContent className="h-full flex flex-col">
          {isLoading && (
            <div className="flex flex-col items-center justify-center flex-grow space-y-2">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              <p className="text-muted-foreground">Generating your reminder...</p>
            </div>
          )}
          {!isLoading && generatedMessage && (
            <div className="bg-secondary/50 p-4 rounded-md border border-input flex-grow">
              <p className="text-sm whitespace-pre-wrap leading-relaxed text-foreground">{generatedMessage}</p>
            </div>
          )}
          {!isLoading && !generatedMessage && (
            <div className="flex items-center justify-center text-center text-muted-foreground border-2 border-dashed border-input rounded-md p-8 flex-grow">
              <p>Your generated reminder message will appear here.</p>
            </div>
          )}
        </CardContent>
        {generatedMessage && !isLoading && (
          <CardFooter>
            <Button onClick={handleCopyToClipboard} variant="outline" className="w-full" disabled={isCopied}>
              {isCopied ? <Check className="mr-2 h-4 w-4 text-green-500" /> : <ClipboardCopy className="mr-2 h-4 w-4" />}
              {isCopied ? "Copied!" : "Copy Message"}
            </Button>
          </CardFooter>
        )}
      </Card>
    </div>
  );
}
