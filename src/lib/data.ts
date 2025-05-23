
import type { Appointment, Patient, Professional, Specialty } from "@/types";
import { addDays, subDays } from "date-fns";

export const mockPatients: Patient[] = [
  { id: "pat1", name: "Carlos Ruiz", document: "12345678A", email: "carlos.ruiz@example.com", phone: "555-0101" },
  { id: "pat2", name: "Ana García", document: "87654321B", email: "ana.garcia@example.com", phone: "555-0102" },
  { id: "pat3", name: "Luis Fernández", document: "11223344C", email: "luis.fernandez@example.com", phone: "555-0103" },
  { id: "pat4", name: "Sofía López", document: "44332211D", email: "sofia.lopez@example.com" },
  { id: "pat5", name: "Javier Martínez", document: "55667788E", email: "javier.martinez@example.com", phone: "555-0105" },
];


export const mockAppointments: Appointment[] = [
  {
    id: "app1",
    patientId: "pat1", // Carlos Ruiz
    professionalId: "prof1", // Dra. Ana Pérez
    specialtyId: "spec1", // Pediatría
    dateTime: addDays(new Date(), 2), 
    status: "Programada",
    location: "Clínica A, Consultorio 101",
    notes: "Revisión regular.",
    videoCallLink: "https://meet.example.com/pediatria-ruiz"
  },
  {
    id: "app2",
    patientId: "pat2", // Ana García
    professionalId: "prof2", // Dr. Juan Torres
    specialtyId: "spec2", // Cardiología
    dateTime: addDays(new Date(), 5), 
    status: "Programada",
    location: "Hospital Principal, Ala B",
  },
  {
    id: "app3",
    patientId: "pat3", // Luis Fernández
    professionalId: "prof1", // Dra. Ana Pérez
    specialtyId: "spec1", // Pediatría
    dateTime: subDays(new Date(), 7), 
    status: "Completada",
    location: "Clínica A, Consultorio 102",
    notes: "Vacunación completa.",
  },
  {
    id: "app4",
    patientId: "pat4", // Sofía López
    professionalId: "prof3", // Dra. Laura Vargas
    specialtyId: "spec3", // Neurología
    dateTime: addDays(new Date(), 1), 
    status: "Pendiente de Aprobación",
    location: "Telemedicina",
    videoCallLink: "https://meet.example.com/neuro-lopez-pendiente"
  },
  {
    id: "app5",
    patientId: "pat5", // Javier Martínez
    professionalId: "prof2", // Dr. Juan Torres
    specialtyId: "spec2", // Cardiología
    dateTime: subDays(new Date(), 3), 
    status: "Cancelada",
    location: "Hospital Principal, Ala B",
    notes: "Paciente reprogramó.",
  },
  {
    id: "app6",
    patientId: "pat1", // Carlos Ruiz
    professionalId: "prof2", // Dr. Juan Torres
    specialtyId: "spec2", // Cardiología
    dateTime: subDays(new Date(), 30), 
    status: "Completada",
    location: "Hospital Principal, Ala C",
  },
   {
    id: "app7",
    patientId: "pat3", // Luis Fernandez, changed for consistency with mockPatients
    professionalId: "prof4", // Dr. Genérico
    specialtyId: "spec4", // Medicina General
    dateTime: addDays(new Date(), 3),
    status: "Pendiente de Aprobación",
    location: "Clínica Nuevos Pacientes",
    notes: "Necesita consulta inicial.",
  },
  {
    id: "app8",
    patientId: "pat2", // Ana García, changed for consistency
    professionalId: "prof1", // Dra. Pérez
    specialtyId: "spec1", // Pediatría
    dateTime: subDays(new Date(), 1),
    status: "No Asistió",
    location: "Clínica A",
    notes: "El paciente no se presentó a la cita.",
  }
];

export const mockProfessionals: Professional[] = [
  { id: "prof1", name: "Dra. Ana Pérez", document: "11223344A", specialtyIds: ["spec1"] },
  { id: "prof2", name: "Dr. Juan Torres", document: "55667788B", specialtyIds: ["spec2", "spec4"] },
  { id: "prof3", name: "Dra. Laura Vargas", document: "99001122C", specialtyIds: ["spec3"] },
  { id: "prof4", name: "Dr. Genérico", document: "12345678G", specialtyIds: ["spec4"] },
  { id: "prof5", name: "Dr. Carlos Solis", document: "87654321S", specialtyIds: ["spec2"] },
];

export const mockSpecialties: Specialty[] = [
  { id: "spec1", name: "Pediatría" },
  { id: "spec2", name: "Cardiología" },
  { id: "spec3", name: "Neurología" },
  { id: "spec4", name: "Medicina General" },
  { id: "spec5", name: "Dermatología" },
];
