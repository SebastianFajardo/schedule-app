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
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log("New Appointment Data:", data);
    
    toast({
      title: "Appointment Registered",
      description: `Appointment for ${data.patientName} on ${format(data.appointmentDate, "PPP")} at ${data.appointmentTime} has been successfully scheduled.`,
    });
    // Optionally redirect or clear form
    // router.push("/appointments");
    form.reset(); 
  };

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-xl">
      <CardHeader>
        <div className="flex items-center gap-2 mb-2">
          <CalendarPlus className="h-6 w-6 text-primary" />
          <CardTitle className="text-2xl">Register New Appointment</CardTitle>
        </div>
        <CardDescription>
          Fill in the details below to schedule a new medical appointment for a patient.
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
                  <FormLabel className="flex items-center gap-1"><UserPlus className="h-4 w-4"/>Patient Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Jane Smith" {...field} />
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
                    <FormLabel className="flex items-center gap-1"><StethoscopeIcon className="h-4 w-4"/>Assign Doctor</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a doctor" />
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
                    <FormLabel>Medical Specialty</FormLabel>
                     <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a specialty" />
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
                    <FormLabel className="flex items-center gap-1"><CalendarIcon className="h-4 w-4"/>Appointment Date</FormLabel>
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
                            {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
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
                    <FormLabel>Appointment Time (HH:MM)</FormLabel>
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
                  <FormLabel className="flex items-center gap-1"><MapPin className="h-4 w-4"/>Location</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a location" />
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
                  <FormLabel>Additional Notes (Optional)</FormLabel>
                  <FormControl>
                    <Textarea placeholder="e.g., Patient prefers morning appointments, follow-up visit." {...field} />
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
                      This is a video call / telehealth appointment
                    </FormLabel>
                  </div>
                </FormItem>
              )}
            />


            <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? "Registering..." : "Register Appointment"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
