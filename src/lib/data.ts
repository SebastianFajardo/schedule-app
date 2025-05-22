import type { Appointment, Patient } from "@/types";
import { addDays, subDays } from "date-fns";

export const mockPatients: Patient[] = [
  { id: "pat1", name: "John Doe", email: "john.doe@example.com", phone: "555-0101" },
  { id: "pat2", name: "Jane Smith", email: "jane.smith@example.com", phone: "555-0102" },
  { id: "pat3", name: "Alice Johnson", email: "alice.johnson@example.com", phone: "555-0103" },
  { id: "pat4", name: "Robert Brown", email: "robert.brown@example.com" },
  { id: "pat5", name: "Emily Davis", email: "emily.davis@example.com", phone: "555-0105" },
];


export const mockAppointments: Appointment[] = [
  {
    id: "app1",
    patientName: "John Doe",
    doctorName: "Dr. Emily Carter",
    specialty: "Pediatrics",
    dateTime: addDays(new Date(), 2), // Upcoming
    status: "Scheduled",
    location: "Clinic A, Room 101",
    notes: "Regular check-up.",
    videoCallLink: "https://meet.example.com/pediatrics-doe"
  },
  {
    id: "app2",
    patientName: "Jane Smith",
    doctorName: "Dr. John Smith",
    specialty: "Cardiology",
    dateTime: addDays(new Date(), 5), // Upcoming
    status: "Scheduled",
    location: "Main Hospital, Wing B",
  },
  {
    id: "app3",
    patientName: "Alice Johnson",
    doctorName: "Dr. Emily Carter",
    specialty: "Pediatrics",
    dateTime: subDays(new Date(), 7), // Past
    status: "Completed",
    location: "Clinic A, Room 102",
    notes: "Vaccination complete.",
  },
  {
    id: "app4",
    patientName: "Robert Brown",
    doctorName: "Dr. Alice Brown",
    specialty: "Neurology",
    dateTime: addDays(new Date(), 1), // Upcoming
    status: "Pending Approval",
    location: "Telehealth",
    videoCallLink: "https://meet.example.com/neuro-brown-pending"
  },
  {
    id: "app5",
    patientName: "Emily Davis",
    doctorName: "Dr. John Smith",
    specialty: "Cardiology",
    dateTime: subDays(new Date(), 3), // Past
    status: "Cancelled",
    location: "Main Hospital, Wing B",
    notes: "Patient rescheduled.",
  },
  {
    id: "app6",
    patientName: "John Doe",
    doctorName: "Dr. John Smith",
    specialty: "Cardiology",
    dateTime: subDays(new Date(), 30), // Past
    status: "Completed",
    location: "Main Hospital, Wing C",
  },
   {
    id: "app7",
    patientName: "New Patient Request",
    doctorName: "Dr. General",
    specialty: "General Medicine",
    dateTime: addDays(new Date(), 3),
    status: "Pending Approval",
    location: "New Patient Clinic",
    notes: "Needs initial consultation.",
  },
  {
    id: "app8",
    patientName: "Follow-up Fred",
    doctorName: "Dr. Carter",
    specialty: "Pediatrics",
    dateTime: subDays(new Date(), 1),
    status: "Not Attended",
    location: "Clinic A",
    notes: "Patient did not show up for the appointment.",
  }
];
