import { z } from "zod";

export const AppointmentReminderSchema = z.object({
  patientName: z.string().min(1, "El nombre del paciente es obligatorio."),
  appointmentDateTime: z.string().min(1, "La fecha y hora de la cita son obligatorias."),
  location: z.string().min(1, "La ubicación es obligatoria."),
  specialInstructions: z.string().optional(),
});

export type AppointmentReminderFormValues = z.infer<typeof AppointmentReminderSchema>;


export const NewAppointmentSchema = z.object({
  patientName: z.string().min(1, "El nombre del paciente es obligatorio."),
  doctorId: z.string().min(1, "La selección del doctor es obligatoria."),
  specialty: z.string().min(1, "La especialidad es obligatoria."),
  appointmentDate: z.date({
    required_error: "La fecha de la cita es obligatoria.",
    invalid_type_error: "Formato de fecha inválido."
  }),
  appointmentTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Formato de hora inválido (HH:MM)."),
  location: z.string().min(1, "La ubicación es obligatoria."),
  notes: z.string().optional(),
  isVideoCall: z.boolean().default(false),
});

export type NewAppointmentFormValues = z.infer<typeof NewAppointmentSchema>;

// Mock data for select fields
export const mockDoctors = [
  { id: "doc1", name: "Dra. Ana Pérez (Pediatría)" },
  { id: "doc2", name: "Dr. Juan Torres (Cardiología)" },
  { id: "doc3", name: "Dra. Laura Vargas (Neurología)" },
];

export const mockSpecialties = [
  { id: "spec1", name: "Pediatría" },
  { id: "spec2", name: "Cardiología" },
  { id: "spec3", name: "Neurología" },
  { id: "spec4", name: "Medicina General" },
];

export const mockLocations = [
  { id: "loc1", name: "Hospital Principal - Ala A" },
  { id: "loc2", name: "Clínica Centro - Consultorio 200" },
  { id: "loc3", name: "Plataforma de Telemedicina" },
];
