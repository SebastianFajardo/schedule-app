import type { Appointment } from "@/types";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CalendarDays, Clock, User, MapPin, Video, FileText, CheckCircle2, XCircle, MoreHorizontal, CalendarClock, MessageSquareWarning } from "lucide-react";
import { format } from "date-fns";
import { es } from 'date-fns/locale';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";

interface AppointmentItemProps {
  appointment: Appointment;
  userRole: 'patient' | 'staff'; 
  onCancel?: (id: string) => void;
  onReschedule?: (id: string) => void;
  onMarkAttendance?: (id: string, status: Appointment['status']) => void;
}

const getStatusBadgeVariant = (status: Appointment['status']) => {
  switch (status) {
    case 'Programada':
      return 'default';
    case 'Completada':
      return 'outline'; 
    case 'Cancelada':
      return 'destructive';
    case 'Pendiente de Aprobación':
      return 'secondary';
    case 'No Asistió':
      return 'destructive'; 
    default:
      return 'default';
  }
};

export default function AppointmentItem({ appointment, userRole, onCancel, onReschedule, onMarkAttendance }: AppointmentItemProps) {
  const isUpcoming = appointment.dateTime > new Date();
  const isPast = appointment.dateTime <= new Date() && (appointment.status === 'Completada' || appointment.status === 'Cancelada' || appointment.status === 'No Asistió');

  return (
    <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg text-primary">{appointment.specialty} con {appointment.doctorName}</CardTitle>
            <CardDescription className="flex items-center text-sm">
              <User className="h-4 w-4 mr-1.5 text-muted-foreground" /> Paciente: {appointment.patientName}
            </CardDescription>
          </div>
          <Badge variant={getStatusBadgeVariant(appointment.status)} className="text-xs whitespace-nowrap">
            {appointment.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-2 text-sm">
        <div className="flex items-center">
          <CalendarDays className="h-4 w-4 mr-2 text-muted-foreground" />
          <span>{format(appointment.dateTime, "PPP", { locale: es })}</span>
        </div>
        <div className="flex items-center">
          <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
          <span>{format(appointment.dateTime, "p", { locale: es })}</span>
        </div>
        <div className="flex items-center">
          <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
          <span>{appointment.location}</span>
        </div>
        {appointment.videoCallLink && (
          <div className="flex items-center">
            <Video className="h-4 w-4 mr-2 text-accent" />
            <Link href={appointment.videoCallLink} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">
              Enlace Videollamada
            </Link>
          </div>
        )}
        {appointment.notes && (
          <div className="flex items-start pt-1">
            <MessageSquareWarning  className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground flex-shrink-0" />
            <p className="text-xs text-muted-foreground italic">{appointment.notes}</p>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex flex-wrap justify-end gap-2 pt-4">
        {userRole === 'staff' && appointment.status === "Pendiente de Aprobación" && (
           <>
            <Button size="sm" variant="outline" className="bg-accent text-accent-foreground hover:bg-accent/90" onClick={() => onMarkAttendance?.(appointment.id, 'Programada')}>
                <CheckCircle2 className="mr-2 h-4 w-4" /> Aprobar
            </Button>
            <Button size="sm" variant="destructive" onClick={() => onCancel?.(appointment.id)}>
                <XCircle className="mr-2 h-4 w-4" /> Rechazar
            </Button>
           </>
        )}
        {isUpcoming && appointment.status === 'Programada' && (
          <>
            {onReschedule && (
              <Button size="sm" variant="outline" onClick={() => onReschedule(appointment.id)}>
                <CalendarClock className="mr-2 h-4 w-4" /> Reprogramar
              </Button>
            )}
            {onCancel && (
              <Button size="sm" variant="destructive" onClick={() => onCancel(appointment.id)}>
                <XCircle className="mr-2 h-4 w-4" /> Cancelar
              </Button>
            )}
          </>
        )}
        {userRole === 'staff' && isPast && appointment.status === 'Programada' && ( 
             <>
                <Button size="sm" variant="outline" className="border-green-500 text-green-600 hover:bg-green-50 hover:text-green-700" onClick={() => onMarkAttendance?.(appointment.id, 'Completada')}>
                    <CheckCircle2 className="mr-2 h-4 w-4" /> Marcar Asistida
                </Button>
                <Button size="sm" variant="outline" className="border-red-500 text-red-600 hover:bg-red-50 hover:text-red-700" onClick={() => onMarkAttendance?.(appointment.id, 'No Asistió')}>
                    <XCircle className="mr-2 h-4 w-4" /> Marcar No Asistió
                </Button>
            </>
        )}
        
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="p-1.5 h-auto">
                    <MoreHorizontal className="h-4 w-4" />
                    <span className="sr-only">Más acciones</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem>
                    <FileText className="mr-2 h-4 w-4" /> Ver Detalles
                </DropdownMenuItem>
                {userRole === 'staff' && (
                    <DropdownMenuItem>
                        <FileText className="mr-2 h-4 w-4" /> Adjuntar Archivos
                    </DropdownMenuItem>
                )}
                 {appointment.status === 'Completada' && (
                    <DropdownMenuItem>
                        <FileText className="mr-2 h-4 w-4" /> Ver Resumen/Notas
                    </DropdownMenuItem>
                 )}
            </DropdownMenuContent>
        </DropdownMenu>

      </CardFooter>
    </Card>
  );
}
