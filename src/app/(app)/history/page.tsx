import AppointmentList from "@/components/appointments/AppointmentList";
import { mockAppointments } from "@/lib/data";
import { History as HistoryIcon } from "lucide-react";

// Assuming this is for a patient named "Carlos Ruiz" for mock purposes
const PATIENT_NAME_FOR_HISTORY = "Carlos Ruiz";

export default function AppointmentHistoryPage() {
  const patientHistory = mockAppointments.filter(
    (app) => app.patientName === PATIENT_NAME_FOR_HISTORY && 
             (app.status === "Completada" || app.status === "Cancelada" || app.status === "No Asistió" || app.dateTime < new Date())
  ).sort((a,b) => b.dateTime.getTime() - a.dateTime.getTime()); // Sort by most recent first

  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <AppointmentList
        initialAppointments={patientHistory}
        userRole="patient" 
        listTitle="Mi Historial de Citas"
        listDescription={`Revisión de todas las citas pasadas para ${PATIENT_NAME_FOR_HISTORY}.`}
      />
    </div>
  );
}
