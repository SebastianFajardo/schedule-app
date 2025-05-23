
import type { LucideIcon } from 'lucide-react';
import type { BookAppointmentFormSchema } from '@/lib/schemas'; // Import Zod schema
import type { z } from 'zod';

export interface NavItem {
  title: string;
  href: string;
  icon: LucideIcon;
  label?: string;
  disabled?: boolean;
  role?: 'patient' | 'staff' | 'admin'; // Example roles
}

// Minimal types, can be expanded as needed
export interface Appointment {
  id: string;
  patientName: string;
  doctorName?: string; // Optional if it's a general service
  specialty?: string;  // Optional
  dateTime: Date;
  status: 'Programada' | 'Completada' | 'Cancelada' | 'Pendiente de Aprobación' | 'No Asistió';
  location?: string; // Could be physical or "Telemedicina"
  notes?: string;
  videoCallLink?: string;
}

export interface Patient {
  id: string;
  name: string;
  email: string;
  phone?: string;
  // Add other patient-specific fields
}

// Type for the book appointment form values, inferred from Zod schema
export type BookAppointmentFormValues = z.infer<typeof BookAppointmentFormSchema>;
