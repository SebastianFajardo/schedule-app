"use client";

import * as React from "react";
import type { Appointment } from "@/types";
import AppointmentItem from "./AppointmentItem";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ListFilter, Search, XCircle } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"; // Added Card imports

interface AppointmentListProps {
  initialAppointments: Appointment[];
  userRole: 'patient' | 'staff';
  listTitle: string;
  listDescription: string;
}

export default function AppointmentList({ initialAppointments, userRole, listTitle, listDescription }: AppointmentListProps) {
  const [appointments, setAppointments] = React.useState<Appointment[]>(initialAppointments);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<string>("all");
  const [timeFilter, setTimeFilter] = React.useState<string>("all"); 
  const [sortBy, setSortBy] = React.useState<string>("dateTimeDesc");
  const { toast } = useToast();

  const handleCancel = (id: string) => {
    setAppointments(prev => prev.map(app => app.id === id ? {...app, status: 'Cancelada'} : app));
    toast({ title: "Cita Cancelada", description: `La cita ID ${id} ha sido cancelada.`});
  };

  const handleReschedule = (id: string) => {
    toast({ title: "Reprogramación Solicitada", description: `Se inició la reprogramación para la Cita ID ${id}.`});
  };

  const handleMarkAttendance = (id: string, newStatus: Appointment['status']) => {
    setAppointments(prev => prev.map(app => app.id === id ? {...app, status: newStatus} : app));
    toast({ title: "Asistencia Actualizada", description: `Cita ID ${id} marcada como ${newStatus}.`});
  };

  const filteredAppointments = React.useMemo(() => {
    let filtered = [...appointments];

    if (searchTerm) {
      filtered = filtered.filter(
        (app) =>
          app.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          app.doctorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          app.specialty.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((app) => app.status === statusFilter);
    }
    
    const now = new Date();
    if (timeFilter === "upcoming") {
        filtered = filtered.filter(app => app.dateTime >= now && app.status !== 'Completada' && app.status !== 'Cancelada' && app.status !== 'No Asistió');
    } else if (timeFilter === "past") {
        filtered = filtered.filter(app => app.dateTime < now || app.status === 'Completada' || app.status === 'Cancelada' || app.status === 'No Asistió');
    }

    if (sortBy === "dateTimeDesc") {
      filtered.sort((a, b) => b.dateTime.getTime() - a.dateTime.getTime());
    } else if (sortBy === "dateTimeAsc") {
      filtered.sort((a, b) => a.dateTime.getTime() - b.dateTime.getTime());
    } else if (sortBy === "patientName") {
      filtered.sort((a, b) => a.patientName.localeCompare(b.patientName));
    }

    return filtered;
  }, [appointments, searchTerm, statusFilter, timeFilter, sortBy]);
  
  const appointmentStatuses: Appointment['status'][] = ["Programada", "Pendiente de Aprobación", "Completada", "Cancelada", "No Asistió"];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">{listTitle}</h1>
        <p className="text-muted-foreground">{listDescription}</p>
      </div>

      <Card className="shadow-lg p-4 md:p-6">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-grow">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar por paciente, doctor, especialidad..."
              className="pl-8 w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Filtrar por Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los Estados</SelectItem>
                {appointmentStatuses.map(status => (
                     <SelectItem key={status} value={status}>{status}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Ordenar Por" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="dateTimeDesc">Fecha (Más Recientes)</SelectItem>
                <SelectItem value="dateTimeAsc">Fecha (Más Antiguos)</SelectItem>
                <SelectItem value="patientName">Nombre del Paciente</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Tabs defaultValue="all" onValueChange={setTimeFilter} className="mb-4">
            <TabsList className="grid w-full grid-cols-3 md:w-auto md:inline-flex">
                <TabsTrigger value="all">Todas</TabsTrigger>
                <TabsTrigger value="upcoming">Próximas</TabsTrigger>
                <TabsTrigger value="past">Pasadas</TabsTrigger>
            </TabsList>
        </Tabs>

        {filteredAppointments.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
            {filteredAppointments.map((app) => (
              <AppointmentItem 
                key={app.id} 
                appointment={app} 
                userRole={userRole}
                onCancel={(id) => {
                    const currentApp = appointments.find(a => a.id === id);
                    const alertDialogTrigger = document.getElementById(`cancel-trigger-${id}`);
                    if (alertDialogTrigger && currentApp) {
                       // Store current app data if needed for the dialog, or pass it directly
                       (alertDialogTrigger as any).currentAppointmentName = currentApp.patientName;
                       (alertDialogTrigger as any).currentAppointmentDate = currentApp.dateTime.toLocaleDateString('es-ES');
                       alertDialogTrigger.click();
                    }
                }}
                onReschedule={handleReschedule}
                onMarkAttendance={handleMarkAttendance}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <ListFilter className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold text-foreground">No se Encontraron Citas</h3>
            <p className="text-muted-foreground mt-2">
              Intenta ajustar tu búsqueda o filtros, o puede que no haya citas que coincidan con tu vista actual.
            </p>
          </div>
        )}
      </Card>
      {/* AlertDialog needs to be available in the DOM, map it or place one if structure is complex */}
      {/* For simplicity, one AlertDialog, content updated dynamically or one per item if complex interaction */}
      <AlertDialog>
          <AlertDialogTrigger asChild>
              {/* This button is a generic trigger, individual items will have their own that can be programmatically clicked or use separate dialogs */}
              <button id={`cancel-trigger-generic`} className="hidden">Generic Cancel Dialog</button>
          </AlertDialogTrigger>
          <AlertDialogContent>
              <AlertDialogHeader>
              <AlertDialogTitle>¿Estás seguro/a de que quieres cancelar esta cita?</AlertDialogTitle>
              <AlertDialogDescription>
                  Esta acción no se puede deshacer. La cita para {/* Placeholder, update dynamically */}
                  <span id="dialog-patient-name">el paciente</span> el <span id="dialog-appointment-date">fecha</span> será marcada como cancelada.
              </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
              <AlertDialogCancel>Mantener Cita</AlertDialogCancel>
              {/* onClick should be dynamic, or manage state for which appointment to cancel */}
              <AlertDialogAction onClick={() => {
                  const activeId = (document.getElementById(`cancel-trigger-generic`) as any)?.activeAppointmentId;
                  if(activeId) handleCancel(activeId);
              }}>Confirmar Cancelación</AlertDialogAction>
              </AlertDialogFooter>
          </AlertDialogContent>
      </AlertDialog>
       {/* Create hidden AlertDialog triggers for each item to allow programmatic opening */}
       {appointments.map(app => (
        <AlertDialog key={`dialog-${app.id}`}>
          <AlertDialogTrigger asChild><button id={`cancel-trigger-${app.id}`} className="hidden">Cancel Dialog for {app.id}</button></AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>¿Estás seguro/a de que quieres cancelar esta cita?</AlertDialogTitle>
              <AlertDialogDescription>
                Esta acción no se puede deshacer. La cita para {app.patientName} el {app.dateTime.toLocaleDateString('es-ES')} será marcada como cancelada.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Mantener Cita</AlertDialogCancel>
              <AlertDialogAction onClick={() => handleCancel(app.id)}>Confirmar Cancelación</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      ))}
    </div>
  );
}
