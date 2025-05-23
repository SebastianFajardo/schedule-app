
import { z } from "zod";

export const BookAppointmentFormSchema = z.object({
  patientId: z.string({ required_error: "Debe seleccionar un paciente." }).min(1, {message: "Debe seleccionar un paciente."}),
  professionalId: z.string({ required_error: "Debe seleccionar un profesional." }).min(1, {message: "Debe seleccionar un profesional."}),
  specialtyId: z.string().optional(),
  appointmentType: z.enum(["presencial", "virtual"], {
    required_error: "Debe seleccionar un tipo de cita.",
  }),
  selectedDateTimeSlot: z.string({ required_error: "Debe seleccionar una fecha y hora para la cita."}).min(1, { message: "Debe seleccionar una fecha y hora para la cita."}),
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
