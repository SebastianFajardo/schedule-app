import AppointmentList from "@/components/appointments/AppointmentList";
import { mockAppointments } from "@/lib/data"; // Using mock data
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import Link from "next/link";

// This page will adapt based on user role. For now, we'll assume a 'staff' role context.
// In a real app, user role would come from authentication.
const USER_ROLE = 'staff'; // or 'patient'

export default function AppointmentsPage() {
  // Filter initial appointments or fetch based on role if API was real
  const appointmentsForUser = USER_ROLE === 'staff' 
    ? mockAppointments 
    : mockAppointments.filter(app => app.patientName === "John Doe"); // Example patient filter

  const title = USER_ROLE === 'staff' ? "Manage All Appointments" : "My Appointments";
  const description = USER_ROLE === 'staff' 
    ? "View, manage, and track all patient appointments." 
    : "Review your upcoming and past appointments.";

  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
       {USER_ROLE === 'staff' && (
        <div className="flex justify-end mb-6">
          <Link href="/appointments/new">
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
              <PlusCircle className="mr-2 h-4 w-4" />
              Register New Appointment
            </Button>
          </Link>
        </div>
      )}
       {USER_ROLE === 'patient' && (
        <div className="flex justify-end mb-6">
          <Link href="/appointments/book">
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
              <PlusCircle className="mr-2 h-4 w-4" />
              Book New Appointment
            </Button>
          </Link>
        </div>
      )}
      <AppointmentList 
        initialAppointments={appointmentsForUser} 
        userRole={USER_ROLE}
        listTitle={title}
        listDescription={description}
      />
    </div>
  );
}
