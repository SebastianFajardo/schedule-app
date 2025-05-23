
import type { Appointment, Patient, Professional, Specialty, ProfessionalAvailabilitySlot } from "@/types";
import { addDays, subDays, format, parseISO } from "date-fns";

export const mockPatients: Patient[] = [
  { id: "pat1", name: "Carlos Ruiz", document: "12345678A", email: "carlos.ruiz@example.com", phone: "555-0101" },
  { id: "pat2", name: "Ana García", document: "87654321B", email: "ana.garcia@example.com", phone: "555-0102" },
  { id: "pat3", name: "Luis Fernández", document: "11223344C", email: "luis.fernandez@example.com", phone: "555-0103" },
  { id: "pat4", name: "Sofía López", document: "44332211D", email: "sofia.lopez@example.com" },
  { id: "pat5", name: "Javier Martínez", document: "55667788E", email: "javier.martinez@example.com", phone: "555-0105" },
];

const today = new Date();
const generateAvailability = (daysAhead: number, slots: string[]): ProfessionalAvailabilitySlot[] => {
  const availableDates: ProfessionalAvailabilitySlot[] = [];
  for (let i = 0; i < daysAhead; i++) {
    if (Math.random() > 0.3) { // Simulate some days not being available
      availableDates.push({
        date: format(addDays(today, i + 1), "yyyy-MM-dd"), // Start from tomorrow
        slots: slots.filter(() => Math.random() > 0.2) // Simulate some slots not being available
      });
    }
  }
  return availableDates;
};

export const mockProfessionals: Professional[] = [
  { 
    id: "prof1", 
    name: "Dra. Ana Pérez", 
    document: "11223344A", 
    specialtyIds: ["spec1"],
    availability: generateAvailability(30, ["09:00", "09:30", "10:00", "10:30", "11:00", "14:00", "14:30", "15:00"])
  },
  { 
    id: "prof2", 
    name: "Dr. Juan Torres", 
    document: "55667788B", 
    specialtyIds: ["spec2", "spec4"],
    availability: generateAvailability(30, ["08:00", "08:45", "09:30", "10:15", "11:00", "16:00", "16:45"]) 
  },
  { 
    id: "prof3", 
    name: "Dra. Laura Vargas", 
    document: "99001122C", 
    specialtyIds: ["spec3"],
    availability: generateAvailability(30, ["10:00", "11:00", "12:00", "13:00", "15:30", "16:30"])
  },
];

export const mockSpecialties: Specialty[] = [
  { id: "spec1", name: "Pediatría" },
  { id: "spec2", name: "Cardiología" },
  { id: "spec3", name: "Neurología" },
  { id: "spec4", name: "Medicina General" },
  { id: "spec5", name: "Dermatología" },
];

export const mockAppointments: Appointment[] = [
  {
    id: "app1",
    patientId: "pat1", 
    professionalId: "prof1", 
    specialtyId: "spec1", 
    dateTime: addDays(new Date(), 2), 
    status: "Programada",
    location: "Clínica A, Consultorio 101",
    notes: "Revisión regular.",
    videoCallLink: "https://meet.example.com/pediatria-ruiz",
    patientName: mockPatients.find(p => p.id === "pat1")?.name,
    doctorName: mockProfessionals.find(prof => prof.id === "prof1")?.name,
    specialtyName: mockSpecialties.find(s => s.id === "spec1")?.name,
  },
  {
    id: "app2",
    patientId: "pat2", 
    professionalId: "prof2", 
    specialtyId: "spec2", 
    dateTime: addDays(new Date(), 5), 
    status: "Programada",
    location: "Hospital Principal, Ala B",
    patientName: mockPatients.find(p => p.id === "pat2")?.name,
    doctorName: mockProfessionals.find(prof => prof.id === "prof2")?.name,
    specialtyName: mockSpecialties.find(s => s.id === "spec2")?.name,
  },
  {
    id: "app3",
    patientId: "pat3", 
    professionalId: "prof1", 
    specialtyId: "spec1", 
    dateTime: subDays(new Date(), 7), 
    status: "Completada",
    location: "Clínica A, Consultorio 102",
    notes: "Vacunación completa.",
    patientName: mockPatients.find(p => p.id === "pat3")?.name,
    doctorName: mockProfessionals.find(prof => prof.id === "prof1")?.name,
    specialtyName: mockSpecialties.find(s => s.id === "spec1")?.name,
  },
  {
    id: "app4",
    patientId: "pat4", 
    professionalId: "prof3", 
    specialtyId: "spec3", 
    dateTime: addDays(new Date(), 1), 
    status: "Pendiente de Aprobación",
    location: "Telemedicina",
    videoCallLink: "https://meet.example.com/neuro-lopez-pendiente",
    patientName: mockPatients.find(p => p.id === "pat4")?.name,
    doctorName: mockProfessionals.find(prof => prof.id === "prof3")?.name,
    specialtyName: mockSpecialties.find(s => s.id === "spec3")?.name,
  },
  {
    id: "app5",
    patientId: "pat5", 
    professionalId: "prof2", 
    specialtyId: "spec2", 
    dateTime: subDays(new Date(), 3), 
    status: "Cancelada",
    location: "Hospital Principal, Ala B",
    notes: "Paciente reprogramó.",
    patientName: mockPatients.find(p => p.id === "pat5")?.name,
    doctorName: mockProfessionals.find(prof => prof.id === "prof2")?.name,
    specialtyName: mockSpecialties.find(s => s.id === "spec2")?.name,
  },
  {
    id: "app6",
    patientId: "pat1", 
    professionalId: "prof2", 
    specialtyId: "spec2", 
    dateTime: subDays(new Date(), 30), 
    status: "Completada",
    location: "Hospital Principal, Ala C",
    patientName: mockPatients.find(p => p.id === "pat1")?.name,
    doctorName: mockProfessionals.find(prof => prof.id === "prof2")?.name,
    specialtyName: mockSpecialties.find(s => s.id === "spec2")?.name,
  },
   {
    id: "app7",
    patientId: "pat3", 
    professionalId: "prof1", 
    specialtyId: "spec1",
    dateTime: addDays(new Date(), 3),
    status: "Pendiente de Aprobación",
    location: "Clínica Nuevos Pacientes",
    notes: "Necesita consulta inicial.",
    patientName: mockPatients.find(p => p.id === "pat3")?.name,
    doctorName: mockProfessionals.find(prof => prof.id === "prof1")?.name,
    specialtyName: mockSpecialties.find(s => s.id === "spec1")?.name,
  },
  {
    id: "app8",
    patientId: "pat2", 
    professionalId: "prof1", 
    specialtyId: "spec1", 
    dateTime: subDays(new Date(), 1),
    status: "No Asistió",
    location: "Clínica A",
    notes: "El paciente no se presentó a la cita.",
    patientName: mockPatients.find(p => p.id === "pat2")?.name,
    doctorName: mockProfessionals.find(prof => prof.id === "prof1")?.name,
    specialtyName: mockSpecialties.find(s => s.id === "spec1")?.name,
  }
];
