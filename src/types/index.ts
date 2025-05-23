
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
  patientId: string; // Changed from patientName to patientId
  professionalId: string; 
  specialtyId?: string;  
  dateTime: Date;
  status: 'Programada' | 'Completada' | 'Cancelada' | 'Pendiente de Aprobación' | 'No Asistió';
  location?: string; 
  notes?: string;
  videoCallLink?: string;
  // Derived or populated fields (optional, for display purposes, not direct storage)
  patientName?: string;
  doctorName?: string; 
  specialtyName?: string;
}


export interface Professional {
  id: string;
  name: string;
  document: string;
  specialtyIds: string[]; // IDs of specialties the professional has
}

export interface Specialty {
  id: string;
  name: string;
}

export type BookAppointmentFormValues = z.infer<typeof BookAppointmentFormSchema>;
