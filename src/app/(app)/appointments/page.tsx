import AppointmentList from "@/components/appointments/AppointmentList";
import { mockAppointments } from "@/lib/data"; 
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import Link from "next/link";

// This page will adapt based on user role. For now, we'll assume a 'staff' role context.
const USER_ROLE = 'staff'; // or 'patient'

export default function AppointmentsPage() {
  const appointmentsForUser = USER_ROLE === 'staff' 
    ? mockAppointments 
    : mockAppointments.filter(app => app.patientName === "Carlos Ruiz"); // Example patient filter

  const title = USER_ROLE === 'staff' ? "Gestionar Todas las Citas" : "Mis Citas";
  const description = USER_ROLE === 'staff' 
    ? "Ver, gestionar y rastrear todas las citas de pacientes." 
    : "Revisa tus citas próximas y pasadas.";

  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
       {USER_ROLE === 'staff' && (
        <div className="flex justify-end mb-6">
          <Link href="/appointments/new">
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
              <PlusCircle className="mr-2 h-4 w-4" />
              Registrar Nueva Cita
            </Button>
          </Link>
        </div>
      )}
       {USER_ROLE === 'patient' && (
        <div className="flex justify-end mb-6">
          <Link href="/appointments/book">
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
              <PlusCircle className="mr-2 h-4 w-4" />
              Agendar Nueva Cita
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
