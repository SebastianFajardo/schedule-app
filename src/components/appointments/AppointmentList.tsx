
"use client";

import * as React from "react";
import type { Appointment } from "@/types";
import { mockAppointments } from "@/lib/data"; // Assuming mockAppointments is here
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Search, MoreHorizontal, Eye, Edit2, XCircle, ListFilter } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";


const statusColors: Record<Appointment["status"], "default" | "secondary" | "destructive" | "outline" | "accent"> = {
  Programada: "accent", // Using accent for green-like
  "Pendiente de Aprobación": "secondary", // Yellow/Orange like
  Completada: "default", // Blue like
  Cancelada: "destructive", // Red
  "No Asistió": "destructive", // Red
};

const appointmentStatuses: Appointment['status'][] = ["Programada", "Pendiente de Aprobación", "Completada", "Cancelada", "No Asistió"];

export default function AppointmentList() {
  const [appointments, setAppointments] = React.useState<Appointment[]>(mockAppointments);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<string>("all");

  const filteredAppointments = React.useMemo(() => {
    let filtered = appointments;

    if (searchTerm) {
      const lowerSearchTerm = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (app) =>
          app.patientName?.toLowerCase().includes(lowerSearchTerm) ||
          app.doctorName?.toLowerCase().includes(lowerSearchTerm) ||
          app.specialtyName?.toLowerCase().includes(lowerSearchTerm)
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((app) => app.status === statusFilter);
    }
    
    // Sort by date, most recent first
    filtered.sort((a, b) => b.dateTime.getTime() - a.dateTime.getTime());

    return filtered;
  }, [appointments, searchTerm, statusFilter]);

  const handleCancelAppointment = (id: string) => {
    // Placeholder for cancel logic
    console.log("Cancel appointment", id);
    setAppointments(prev => prev.map(app => app.id === id ? {...app, status: "Cancelada"} : app));
  };


  return (
    <Card className="shadow-xl">
      <CardHeader>
        <CardTitle>Listado de Citas</CardTitle>
        <CardDescription>Ver y gestionar todas las citas programadas.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row gap-4 mb-6 items-center">
          <div className="relative w-full sm:flex-grow">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por paciente, doctor, especialidad..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 w-full"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue placeholder="Filtrar por estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los Estados</SelectItem>
              {appointmentStatuses.map(status => (
                <SelectItem key={status} value={status}>{status}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {filteredAppointments.length > 0 ? (
          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Paciente</TableHead>
                  <TableHead>Doctor</TableHead>
                  <TableHead>Especialidad</TableHead>
                  <TableHead>Fecha y Hora</TableHead>
                  <TableHead className="text-center">Estado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAppointments.map((appointment) => (
                  <TableRow key={appointment.id}>
                    <TableCell className="font-medium">{appointment.patientName || 'N/A'}</TableCell>
                    <TableCell>{appointment.doctorName || 'N/A'}</TableCell>
                    <TableCell>{appointment.specialtyName || 'N/A'}</TableCell>
                    <TableCell>
                      {format(appointment.dateTime, "PPpp", { locale: es })}
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant={statusColors[appointment.status] || 'default'}>
                        {appointment.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Más acciones</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Eye className="mr-2 h-4 w-4" />
                            Ver Detalles
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit2 className="mr-2 h-4 w-4" />
                            Editar Cita
                          </DropdownMenuItem>
                          {appointment.status === "Programada" && (
                            <>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => handleCancelAppointment(appointment.id)} className="text-destructive focus:text-destructive-foreground focus:bg-destructive">
                                <XCircle className="mr-2 h-4 w-4" />
                                Cancelar Cita
                              </DropdownMenuItem>
                            </>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            <ListFilter className="mx-auto h-16 w-16 mb-4" />
            <h3 className="text-xl font-semibold">No se encontraron citas</h3>
            <p className="mt-2">Intenta ajustar tu búsqueda o filtros.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
