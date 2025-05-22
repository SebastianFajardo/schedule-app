import { z } from "zod";

export const AppointmentReminderSchema = z.object({
  patientName: z.string().min(1, "Patient name is required."),
  appointmentDateTime: z.string().min(1, "Appointment date and time are required."),
  // Consider using z.date() if input type is date, then format before sending to AI
  // For now, string to match AI flow input. Could refine with a date picker.
  // Example: appointmentDateTime: z.coerce.date({invalid_type_error: "Invalid date format"})
  location: z.string().min(1, "Location is required."),
  specialInstructions: z.string().optional(),
});

export type AppointmentReminderFormValues = z.infer<typeof AppointmentReminderSchema>;


export const NewAppointmentSchema = z.object({
  patientName: z.string().min(1, "Patient name is required."),
  doctorId: z.string().min(1, "Doctor selection is required."),
  specialty: z.string().min(1, "Specialty is required."),
  appointmentDate: z.date({
    required_error: "Appointment date is required.",
    invalid_type_error: "Invalid date format."
  }),
  appointmentTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Invalid time format (HH:MM)."),
  location: z.string().min(1, "Location is required."),
  notes: z.string().optional(),
  isVideoCall: z.boolean().default(false),
});

export type NewAppointmentFormValues = z.infer<typeof NewAppointmentSchema>;

// Mock data for select fields
export const mockDoctors = [
  { id: "doc1", name: "Dr. Emily Carter (Pediatrics)" },
  { id: "doc2", name: "Dr. John Smith (Cardiology)" },
  { id: "doc3", name: "Dr. Alice Brown (Neurology)" },
];

export const mockSpecialties = [
  { id: "spec1", name: "Pediatrics" },
  { id: "spec2", name: "Cardiology" },
  { id: "spec3", name: "Neurology" },
  { id: "spec4", name: "General Medicine" },
];

export const mockLocations = [
  { id: "loc1", name: "Main Hospital - Wing A" },
  { id: "loc2", name: "Downtown Clinic - Suite 200" },
  { id: "loc3", name: "Telehealth Platform" },
];
