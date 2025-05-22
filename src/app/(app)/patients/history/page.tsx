import AppointmentList from "@/components/appointments/AppointmentList";
import { mockAppointments, mockPatients } from "@/lib/data";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Search } from "lucide-react";

export default function StaffPatientHistoryPage() {
  // In a real app, this would be dynamic based on a search/selection
  const selectedPatientName = mockPatients[0].name; // Default to first mock patient for demo
  
  const patientHistory = mockAppointments.filter(
    (app) => app.patientName === selectedPatientName
  ).sort((a,b) => b.dateTime.getTime() - a.dateTime.getTime());

  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
          <Users className="h-8 w-8 text-primary" /> Historial de Citas del Paciente
        </h1>
        <p className="text-muted-foreground mt-1">
          Busca un paciente para ver sus registros completos de citas.
        </p>
      </div>

      <Card className="mb-8 shadow-lg">
        <CardHeader>
          <CardTitle>Buscar Paciente</CardTitle>
          <CardDescription>Ingresa el nombre o ID del paciente para encontrar su historial.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input placeholder="Buscar por nombre o ID del paciente..." className="flex-grow" />
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
              <Search className="mr-2 h-4 w-4" /> Buscar Paciente
            </Button>
          </div>
        </CardContent>
      </Card>

      {selectedPatientName ? (
        <AppointmentList
          initialAppointments={patientHistory}
          userRole="staff"
          listTitle={`Historial para ${selectedPatientName}`}
          listDescription={`Todas las citas registradas para ${selectedPatientName}.`}
        />
      ) : (
        <Card className="text-center py-12 shadow-lg">
          <CardContent>
            <Search className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold text-foreground">Busca un Paciente</h3>
            <p className="text-muted-foreground mt-2">
              Usa la barra de búsqueda de arriba para encontrar un paciente y ver su historial de citas.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
