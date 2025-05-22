import type { LucideIcon } from 'lucide-react';

export interface NavItem {
  title: string;
  href: string;
  icon: LucideIcon;
  label?: string;
  disabled?: boolean;
  external?: boolean;
  role?: 'patient' | 'staff' | 'admin'; // For role-based visibility
}

export interface Appointment {
  id: string;
  patientName: string;
  doctorName: string;
  specialty: string;
  dateTime: Date;
  status: 'Scheduled' | 'Cancelled' | 'Completed' | 'Pending Approval' | 'Not Attended';
  location: string;
  notes?: string;
  videoCallLink?: string;
  files?: File[]; // Placeholder for file attachments
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
  role: 'doctor' | 'nurse' | 'admin';
}
