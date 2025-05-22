import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarPlus, Search, Sparkles } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function BookAppointmentPage() {
  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center justify-center gap-2">
          <CalendarPlus className="h-8 w-8 text-primary" /> Agendar Nueva Cita
        </h1>
        <p className="text-muted-foreground mt-1 max-w-lg mx-auto">
          Encuentra doctores y horarios disponibles que se ajusten a tu agenda.
        </p>
      </div>

      <Card className="max-w-3xl mx-auto shadow-xl">
        <CardHeader>
          <CardTitle>Encontrar un Doctor o Servicio</CardTitle>
          <CardDescription>Busca por especialidad, nombre del doctor o servicio necesitado.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex gap-2">
            <input 
              type="text" 
              placeholder="Ej: Cardiología, Dra. Pérez, Chequeo Anual" 
              className="flex-grow p-2 border border-input rounded-md focus:ring-2 focus:ring-ring"
            />
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
              <Search className="mr-2 h-4 w-4" /> Buscar
            </Button>
          </div>

          <div className="text-center py-6 border-2 border-dashed border-input rounded-md">
            <Sparkles className="h-12 w-12 text-primary mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-foreground">Buscador Inteligente (Próximamente)</h3>
            <p className="text-sm text-muted-foreground">
              Nuestra IA te ayudará a encontrar los mejores horarios disponibles según tus preferencias.
            </p>
          </div>

          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-3">
              Alternativamente, puedes ver el calendario general de disponibilidad:
            </p>
            <Link href="/appointments/calendar">
              <Button variant="outline">
                Ver Calendario de Disponibilidad
              </Button>
            </Link>
          </div>
           <Image 
              src="https://placehold.co/800x400.png" 
              alt="Ilustración de un calendario y búsqueda" 
              width={800} 
              height={400} 
              className="rounded-md mt-6 aspect-[2/1] object-cover"
              data-ai-hint="calendario busqueda"
            />
        </CardContent>
      </Card>
    </div>
  );
}
