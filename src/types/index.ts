import type { LucideIcon } from 'lucide-react';

export interface NavItem {
  title: string;
  href: string;
  icon: LucideIcon;
  label?: string;
  disabled?: boolean;
  external?: boolean;
  role?: 'patient' | 'staff' | 'admin'; 
}

export interface Appointment {
  id: string;
  patientName: string;
  doctorName: string;
  specialty: string;
  dateTime: Date;
  status: 'Programada' | 'Cancelada' | 'Completada' | 'Pendiente de Aprobación' | 'No Asistió'; // Translated statuses
  location: string;
  notes?: string;
  videoCallLink?: string;
  files?: File[]; 
}

export interface Patient {
  id: string;
  name: string;
  email: string;
  phone?: string;
}

export interface MedicalStaff {
  id: string;
  name: string;
  email: string;
  specialty: string;
  role: 'doctor' | 'nurse' | 'admin'; // Consider translating roles if displayed in UI
}
