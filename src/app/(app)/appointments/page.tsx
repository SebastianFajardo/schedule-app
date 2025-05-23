
import AppointmentList from "@/components/appointments/AppointmentList";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import Link from "next/link";

export default function AppointmentsPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Gestión de Citas
        </h1>
        <Link href="/appointments/book">
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
            <PlusCircle className="mr-2 h-4 w-4" />
            Registrar Nueva Cita
          </Button>
        </Link>
      </div>
      <AppointmentList />
    </div>
  );
}
