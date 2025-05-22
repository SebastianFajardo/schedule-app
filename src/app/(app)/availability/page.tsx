import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarCog, Clock, PlusCircle } from "lucide-react";
import Image from "next/image";

const currentAvailability = [
  { day: "Lunes", Btime: "09:00 AM", Etime: "05:00 PM", active: true },
  { day: "Martes", Btime: "09:00 AM", Etime: "05:00 PM", active: true },
  { day: "Miércoles", Btime: "09:00 AM", Etime: "01:00 PM", active: true },
  { day: "Jueves", Btime: "09:00 AM", Etime: "05:00 PM", active: true },
  { day: "Viernes", Btime: "10:00 AM", Etime: "03:00 PM", active: true },
  { day: "Sábado", Btime: "No Disponible", Etime: "", active: false },
  { day: "Domingo", Btime: "No Disponible", Etime: "", active: false },
];

export default function AvailabilityPage() {
  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
          <CalendarCog className="h-8 w-8 text-primary" /> Gestionar Horas de Atención
        </h1>
        <p className="text-muted-foreground mt-1">
          Define tus horas de trabajo y disponibilidad para citas de pacientes.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 shadow-lg">
          <CardHeader className="flex flex-row justify-between items-center">
            <div>
              <CardTitle>Horario Semanal Actual</CardTitle>
              <CardDescription>Revisa y actualiza tu disponibilidad estándar.</CardDescription>
            </div>
            <Button size="sm" className="bg-accent text-accent-foreground hover:bg-accent/90">
              <PlusCircle className="mr-2 h-4 w-4" /> Editar Horario
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {currentAvailability.map((slot) => (
                <div key={slot.day} className={`flex justify-between items-center p-3 rounded-md border ${slot.active ? 'bg-card' : 'bg-muted/50 opacity-70'}`}>
                  <span className="font-medium text-foreground">{slot.day}</span>
                  <div className="flex items-center gap-2">
                    {slot.active ? (
                      <>
                        <Clock className="h-4 w-4 text-primary" />
                        <span className="text-sm text-foreground">{slot.Btime} - {slot.Etime}</span>
                      </>
                    ) : (
                      <span className="text-sm text-muted-foreground italic">{slot.Btime}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Bloquear Fechas Específicas</CardTitle>
              <CardDescription>Establece indisponibilidad por festivos o tiempo personal.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-3">
                Esta función te permite marcar fechas o rangos de fechas específicos como no disponibles, anulando tu horario regular.
              </p>
              <Button className="w-full" variant="outline">
                <PlusCircle className="mr-2 h-4 w-4" /> Añadir Tiempo Libre / Bloquear Fecha
              </Button>
            </CardContent>
          </Card>
           <Card className="shadow-lg">
             <CardHeader>
                <CardTitle>Horarios por Ubicación</CardTitle>
                <CardDescription>Define disponibilidad por clínica o telemedicina.</CardDescription>
             </CardHeader>
             <CardContent>
                 <p className="text-sm text-muted-foreground mb-3">
                    Configura diferentes horarios de trabajo según tus ubicaciones de servicio.
                 </p>
                 <Button className="w-full" variant="outline" disabled>
                    Gestionar Horarios (Próximamente)
                 </Button>
                 <Image 
                    src="https://placehold.co/600x300.png" 
                    alt="Placeholder de mapa de ubicación" 
                    width={600} 
                    height={300} 
                    className="rounded-md mt-4 aspect-[2/1] object-cover"
                    data-ai-hint="mapa ubicacion"
                  />
             </CardContent>
           </Card>
        </div>
      </div>
    </div>
  );
}
