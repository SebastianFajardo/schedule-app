
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

export interface Patient {
  id: string;
  name: string;
  document: string;
  email?: string;
  phone?: string;
}

export interface Appointment {
  id: string;
  patientId: string; 
  professionalId: string; 
  specialtyId?: string;  
  dateTime: Date;
  status: 'Programada' | 'Completada' | 'Cancelada' | 'Pendiente de Aprobación' | 'No Asistió';
  location?: string; 
  notes?: string;
  videoCallLink?: string;
  patientName?: string;
  doctorName?: string; 
  specialtyName?: string;
}

export interface ProfessionalAvailabilitySlot {
  date: string; // YYYY-MM-DD
  slots: string[]; // HH:mm
}

export interface Professional {
  id: string;
  name: string;
  document: string;
  specialtyIds: string[]; 
  availability: ProfessionalAvailabilitySlot[];
}

export interface Specialty {
  id: string;
  name: string;
}

export type BookAppointmentFormValues = z.infer<typeof BookAppointmentFormSchema>;
