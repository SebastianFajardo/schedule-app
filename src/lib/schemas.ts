
import { z } from "zod";

export const BookAppointmentFormSchema = z.object({
  patientName: z.string().min(3, { message: "El nombre del paciente es requerido (mínimo 3 caracteres)." }),
  doctorService: z.string().min(3, { message: "El doctor o servicio es requerido (mínimo 3 caracteres)." }),
  specialty: z.string().optional(),
  appointmentType: z.enum(["presencial", "virtual"], {
    required_error: "Debe seleccionar un tipo de cita.",
  }),
  appointmentDate: z.date({
    required_error: "La fecha de la cita es requerida.",
  }),
  appointmentTime: z.string().min(1, { message: "La hora de la cita es requerida." }),
  location: z.string().optional(),
  videoCallLink: z.string().url({ message: "Debe ingresar una URL válida para la videollamada." }).optional(),
  notes: z.string().optional(),
})
.superRefine((data, ctx) => {
  if (data.appointmentType === "presencial" && !data.location?.trim()) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "La ubicación es requerida para citas presenciales.",
      path: ["location"],
    });
  }
  if (data.appointmentType === "virtual" && !data.videoCallLink?.trim()) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "El enlace de videollamada es requerido para citas virtuales.",
      path: ["videoCallLink"],
    });
  }
});

export type BookAppointmentFormValues = z.infer<typeof BookAppointmentFormSchema>;
