import AppointmentList from "@/components/appointments/AppointmentList";
import { mockAppointments } from "@/lib/data";
import { History as HistoryIcon } from "lucide-react";

// Assuming this is for a patient named "John Doe" for mock purposes
const PATIENT_NAME_FOR_HISTORY = "John Doe";

export default function AppointmentHistoryPage() {
  const patientHistory = mockAppointments.filter(
    (app) => app.patientName === PATIENT_NAME_FOR_HISTORY && 
             (app.status === "Completed" || app.status === "Cancelled" || app.status === "Not Attended" || app.dateTime < new Date())
  ).sort((a,b) => b.dateTime.getTime() - a.dateTime.getTime()); // Sort by most recent first

  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <AppointmentList
        initialAppointments={patientHistory}
        userRole="patient" // History page is typically patient-centric for their own records
        listTitle="My Appointment History"
        listDescription={`Review of all past appointments for ${PATIENT_NAME_FOR_HISTORY}.`}
      />
    </div>
  );
}
