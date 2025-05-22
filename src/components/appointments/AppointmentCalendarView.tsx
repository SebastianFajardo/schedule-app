"use client";

import * as React from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { addDays, format, isSameDay, startOfDay } from "date-fns";
import type { Appointment } from "@/types";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarDays, Clock, UserCircle } from "lucide-react";
import { es } from 'date-fns/locale'; // Import Spanish locale

// Mock appointments data (Consider moving to lib/data.ts for consistency)
const mockAppointments: Appointment[] = [
  {
    id: "cal-1",
    patientName: "Carlos Ruiz",
    doctorName: "Dra. Pérez",
    specialty: "Pediatría",
    dateTime: new Date(new Date().setDate(new Date().getDate() + 2)),
    status: "Programada",
    location: "Consultorio 101",
  },
  {
    id: "cal-2",
    patientName: "Ana García",
    doctorName: "Dra. Ana Pérez",
    specialty: "Pediatría",
    dateTime: new Date(new Date().setDate(new Date().getDate() + 2)), 
    status: "Programada",
    location: "Clínica A",
  },
  {
    id: "cal-3",
    patientName: "Miguel Torres",
    doctorName: "Dr. Vargas",
    specialty: "Neurología",
    dateTime: new Date(new Date().setDate(new Date().getDate() + 5)), 
    status: "Pendiente de Aprobación",
    location: "Hospital Central",
  },
  {
    id: "cal-4",
    patientName: "Lucía Fer",
    doctorName: "Dra. Ana Pérez",
    specialty: "Pediatría",
    dateTime: addDays(new Date(), 10),
    status: "Programada",
    location: "Clínica B",
  },
];


const availableSlots: Date[] = [
  addDays(new Date(), 3),
  addDays(new Date(), 4),
  addDays(new Date(), 7),
  addDays(new Date(), 8),
];

export default function AppointmentCalendarView() {
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(new Date());
  const [month, setMonth] = React.useState<Date>(new Date());

  const appointmentsForSelectedDay = selectedDate
    ? mockAppointments.filter(app => isSameDay(app.dateTime, selectedDate))
    : [];

  const isSlotAvailable = (date: Date) => availableSlots.some(slot => isSameDay(slot, date));

  const DayCellContent = ({ date }: { date: Date }) => {
    const dayAppointments = mockAppointments.filter(app => isSameDay(app.dateTime, date));
    const isAvailable = isSlotAvailable(date);

    let badgeVariant: "default" | "secondary" | "destructive" | "outline" = "default";
    if (dayAppointments.some(app => app.status === "Pendiente de Aprobación")) badgeVariant = "secondary";
    else if (dayAppointments.length > 0) badgeVariant = "default";
    
    return (
      <div className="relative h-full w-full">
        {format(date, "d")}
        {dayAppointments.length > 0 && (
          <Badge variant={badgeVariant} className="absolute bottom-1 right-1 p-0.5 h-4 w-4 flex items-center justify-center text-xs">
            {dayAppointments.length}
          </Badge>
        )}
        {isAvailable && dayAppointments.length === 0 && (
           <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-green-500" title="Horario Disponible"></span>
        )}
      </div>
    );
  };

  return (
    <div className="grid md:grid-cols-3 gap-6">
      <Card className="md:col-span-2 shadow-lg">
        <CardHeader>
          <CardTitle>Calendario de Citas</CardTitle>
          <CardDescription>Vea citas programadas y horarios disponibles. Haga clic en una fecha para ver detalles.</CardDescription>
        </CardHeader>
        <CardContent>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            month={month}
            onMonthChange={setMonth}
            className="rounded-md border p-0"
            locale={es} // Add Spanish locale
            classNames={{
              day_cell: "h-12 w-12 text-sm p-0 relative",
            }}
            components={{
              DayContent: DayCellContent, 
            }}
            modifiers={{ 
              hasAppointments: mockAppointments.map(app => startOfDay(app.dateTime)),
              isAvailable: availableSlots.map(slot => startOfDay(slot)),
            }}
            modifiersClassNames={{
              hasAppointments: "relative", 
              isAvailable: "border-2 border-green-500 rounded-md"
            }}
          />
        </CardContent>
      </Card>

      <Card className="shadow-lg h-fit">
        <CardHeader>
          <CardTitle>
            {selectedDate ? format(selectedDate, "PPP", { locale: es }) : "Seleccione una Fecha"}
          </CardTitle>
          <CardDescription>
            {selectedDate ? "Detalles para la fecha seleccionada." : "Ninguna fecha seleccionada."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {selectedDate && appointmentsForSelectedDay.length > 0 && (
            <ul className="space-y-3">
              {appointmentsForSelectedDay.map(app => (
                <li key={app.id} className="p-3 rounded-md border bg-card hover:bg-muted/50 transition-colors">
                  <p className="font-semibold text-sm text-primary">{app.specialty} con {app.doctorName}</p>
                  <p className="text-xs text-muted-foreground">Paciente: {app.patientName}</p>
                  <p className="text-xs text-muted-foreground">Hora: {format(app.dateTime, "p", { locale: es })}</p>
                  <p className="text-xs text-muted-foreground">Lugar: {app.location}</p>
                  <Badge variant={app.status === "Programada" ? "default" : "secondary"} className="mt-1 text-xs">
                    {app.status}
                  </Badge>
                </li>
              ))}
            </ul>
          )}
          {selectedDate && appointmentsForSelectedDay.length === 0 && isSlotAvailable(selectedDate) && (
            <div className="text-center py-4">
              <CalendarDays className="mx-auto h-12 w-12 text-green-500" />
              <p className="mt-2 text-sm font-medium text-green-600">¡Este día tiene horarios disponibles!</p>
              <Button size="sm" className="mt-2 bg-accent text-accent-foreground hover:bg-accent/90">Agendar Horario</Button>
            </div>
          )}
          {selectedDate && appointmentsForSelectedDay.length === 0 && !isSlotAvailable(selectedDate) && (
            <div className="text-center py-4">
               <CalendarDays className="mx-auto h-12 w-12 text-muted-foreground" />
              <p className="mt-2 text-sm text-muted-foreground">No hay citas ni horarios disponibles para este día.</p>
            </div>
          )}
           {!selectedDate && (
             <div className="text-center py-4 text-muted-foreground">
                <CalendarDays className="mx-auto h-12 w-12" />
                <p className="mt-2">Seleccione una fecha en el calendario para ver detalles de citas u horarios disponibles.</p>
             </div>
           )}
        </CardContent>
      </Card>
    </div>
  );
}
