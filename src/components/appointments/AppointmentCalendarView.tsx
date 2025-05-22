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

// Mock appointments data
const mockAppointments: Appointment[] = [
  {
    id: "1",
    patientName: "John Doe",
    doctorName: "Dr. Smith",
    specialty: "Cardiology",
    dateTime: new Date(new Date().setDate(new Date().getDate() + 2)), // 2 days from now
    status: "Scheduled",
    location: "Room 101",
  },
  {
    id: "2",
    patientName: "Jane Roe",
    doctorName: "Dr. Emily Carter",
    specialty: "Pediatrics",
    dateTime: new Date(new Date().setDate(new Date().getDate() + 2)), // Same day, different time
    status: "Scheduled",
    location: "Clinic A",
  },
  {
    id: "3",
    patientName: "Mike Ross",
    doctorName: "Dr. Johnson",
    specialty: "Neurology",
    dateTime: new Date(new Date().setDate(new Date().getDate() + 5)), // 5 days from now
    status: "Pending Approval",
    location: "Main Hospital",
  },
  {
    id: "4",
    patientName: "Alice Wonderland",
    doctorName: "Dr. Emily Carter",
    specialty: "Pediatrics",
    dateTime: addDays(new Date(), 10),
    status: "Scheduled",
    location: "Clinic B",
  },
];


// Mock available slots (simplified)
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
    if (dayAppointments.some(app => app.status === "Pending Approval")) badgeVariant = "secondary";
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
           <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-green-500" title="Available Slot"></span>
        )}
      </div>
    );
  };

  return (
    <div className="grid md:grid-cols-3 gap-6">
      <Card className="md:col-span-2 shadow-lg">
        <CardHeader>
          <CardTitle>Appointment Calendar</CardTitle>
          <CardDescription>View scheduled appointments and available slots. Click on a date to see details.</CardDescription>
        </CardHeader>
        <CardContent>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            month={month}
            onMonthChange={setMonth}
            className="rounded-md border p-0"
            classNames={{
              day_cell: "h-12 w-12 text-sm p-0 relative", // Adjusted for custom content
            }}
            components={{
              DayContent: DayCellContent, // Custom component for day cell rendering
            }}
            modifiers={{ 
              hasAppointments: mockAppointments.map(app => startOfDay(app.dateTime)),
              isAvailable: availableSlots.map(slot => startOfDay(slot)),
            }}
            modifiersClassNames={{
              hasAppointments: "relative", // Allows absolute positioning of badges
              isAvailable: "border-2 border-green-500 rounded-md"
            }}
          />
        </CardContent>
      </Card>

      <Card className="shadow-lg h-fit">
        <CardHeader>
          <CardTitle>
            {selectedDate ? format(selectedDate, "PPP") : "Select a Date"}
          </CardTitle>
          <CardDescription>
            {selectedDate ? "Details for the selected date." : "No date selected."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {selectedDate && appointmentsForSelectedDay.length > 0 && (
            <ul className="space-y-3">
              {appointmentsForSelectedDay.map(app => (
                <li key={app.id} className="p-3 rounded-md border bg-card hover:bg-muted/50 transition-colors">
                  <p className="font-semibold text-sm text-primary">{app.specialty} with {app.doctorName}</p>
                  <p className="text-xs text-muted-foreground">Patient: {app.patientName}</p>
                  <p className="text-xs text-muted-foreground">Time: {format(app.dateTime, "p")}</p>
                  <p className="text-xs text-muted-foreground">Location: {app.location}</p>
                  <Badge variant={app.status === "Scheduled" ? "default" : "secondary"} className="mt-1 text-xs">
                    {app.status}
                  </Badge>
                </li>
              ))}
            </ul>
          )}
          {selectedDate && appointmentsForSelectedDay.length === 0 && isSlotAvailable(selectedDate) && (
            <div className="text-center py-4">
              <CalendarDays className="mx-auto h-12 w-12 text-green-500" />
              <p className="mt-2 text-sm font-medium text-green-600">This day has available slots!</p>
              <Button size="sm" className="mt-2 bg-accent text-accent-foreground hover:bg-accent/90">Book Slot</Button>
            </div>
          )}
          {selectedDate && appointmentsForSelectedDay.length === 0 && !isSlotAvailable(selectedDate) && (
            <div className="text-center py-4">
               <CalendarDays className="mx-auto h-12 w-12 text-muted-foreground" />
              <p className="mt-2 text-sm text-muted-foreground">No appointments or available slots for this day.</p>
            </div>
          )}
           {!selectedDate && (
             <div className="text-center py-4 text-muted-foreground">
                <CalendarDays className="mx-auto h-12 w-12" />
                <p className="mt-2">Select a date on the calendar to view appointment details or available slots.</p>
             </div>
           )}
        </CardContent>
      </Card>
    </div>
  );
}
