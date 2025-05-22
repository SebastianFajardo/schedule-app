import type { Appointment, Patient } from "@/types";
import { addDays, subDays } from "date-fns";

export const mockPatients: Patient[] = [
  { id: "pat1", name: "Carlos Ruiz", email: "carlos.ruiz@example.com", phone: "555-0101" },
  { id: "pat2", name: "Ana García", email: "ana.garcia@example.com", phone: "555-0102" },
  { id: "pat3", name: "Luis Fernández", email: "luis.fernandez@example.com", phone: "555-0103" },
  { id: "pat4", name: "Sofía López", email: "sofia.lopez@example.com" },
  { id: "pat5", name: "Javier Martínez", email: "javier.martinez@example.com", phone: "555-0105" },
];


export const mockAppointments: Appointment[] = [
  {
    id: "app1",
    patientName: "Carlos Ruiz",
    doctorName: "Dra. Ana Pérez",
    specialty: "Pediatría",
    dateTime: addDays(new Date(), 2), // Upcoming
    status: "Programada",
    location: "Clínica A, Consultorio 101",
    notes: "Revisión regular.",
    videoCallLink: "https://meet.example.com/pediatria-ruiz"
  },
  {
    id: "app2",
    patientName: "Ana García",
    doctorName: "Dr. Juan Torres",
    specialty: "Cardiología",
    dateTime: addDays(new Date(), 5), // Upcoming
    status: "Programada",
    location: "Hospital Principal, Ala B",
  },
  {
    id: "app3",
    patientName: "Luis Fernández",
    doctorName: "Dra. Ana Pérez",
    specialty: "Pediatría",
    dateTime: subDays(new Date(), 7), // Past
    status: "Completada",
    location: "Clínica A, Consultorio 102",
    notes: "Vacunación completa.",
  },
  {
    id: "app4",
    patientName: "Sofía López",
    doctorName: "Dra. Laura Vargas",
    specialty: "Neurología",
    dateTime: addDays(new Date(), 1), // Upcoming
    status: "Pendiente de Aprobación",
    location: "Telemedicina",
    videoCallLink: "https://meet.example.com/neuro-lopez-pendiente"
  },
  {
    id: "app5",
    patientName: "Javier Martínez",
    doctorName: "Dr. Juan Torres",
    specialty: "Cardiología",
    dateTime: subDays(new Date(), 3), // Past
    status: "Cancelada",
    location: "Hospital Principal, Ala B",
    notes: "Paciente reprogramó.",
  },
  {
    id: "app6",
    patientName: "Carlos Ruiz",
    doctorName: "Dr. Juan Torres",
    specialty: "Cardiología",
    dateTime: subDays(new Date(), 30), // Past
    status: "Completada",
    location: "Hospital Principal, Ala C",
  },
   {
    id: "app7",
    patientName: "Nuevo Paciente",
    doctorName: "Dr. Genérico",
    specialty: "Medicina General",
    dateTime: addDays(new Date(), 3),
    status: "Pendiente de Aprobación",
    location: "Clínica Nuevos Pacientes",
    notes: "Necesita consulta inicial.",
  },
  {
    id: "app8",
    patientName: "Federico Seguimiento",
    doctorName: "Dra. Pérez",
    specialty: "Pediatría",
    dateTime: subDays(new Date(), 1),
    status: "No Asistió",
    location: "Clínica A",
    notes: "El paciente no se presentó a la cita.",
  }
];
