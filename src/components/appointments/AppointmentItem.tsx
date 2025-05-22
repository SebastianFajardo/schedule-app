import type { Appointment } from "@/types";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CalendarDays, Clock, User, MapPin, Video, FileText, CheckCircle2, XCircle, MoreHorizontal, CalendarClock, MessageSquareWarning } from "lucide-react";
import { format } from "date-fns";
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
  userRole: 'patient' | 'staff'; // To conditionally show actions
  onCancel?: (id: string) => void;
  onReschedule?: (id: string) => void;
  onMarkAttendance?: (id: string, status: 'Completed' | 'Not Attended') => void;
}

const getStatusBadgeVariant = (status: Appointment['status']) => {
  switch (status) {
    case 'Scheduled':
      return 'default';
    case 'Completed':
      return 'outline'; // Use a less prominent variant like outline for completed
    case 'Cancelled':
      return 'destructive';
    case 'Pending Approval':
      return 'secondary';
    case 'Not Attended':
      return 'destructive'; // Or a specific 'warning' like variant
    default:
      return 'default';
  }
};


export default function AppointmentItem({ appointment, userRole, onCancel, onReschedule, onMarkAttendance }: AppointmentItemProps) {
  const isUpcoming = appointment.dateTime > new Date();
  const isPast = appointment.dateTime <= new Date() && (appointment.status === 'Completed' || appointment.status === 'Cancelled' || appointment.status === 'Not Attended');


  return (
    <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg text-primary">{appointment.specialty} with {appointment.doctorName}</CardTitle>
            <CardDescription className="flex items-center text-sm">
              <User className="h-4 w-4 mr-1.5 text-muted-foreground" /> Patient: {appointment.patientName}
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
          <span>{format(appointment.dateTime, "PPP")}</span>
        </div>
        <div className="flex items-center">
          <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
          <span>{format(appointment.dateTime, "p")}</span>
        </div>
        <div className="flex items-center">
          <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
          <span>{appointment.location}</span>
        </div>
        {appointment.videoCallLink && (
          <div className="flex items-center">
            <Video className="h-4 w-4 mr-2 text-accent" />
            <Link href={appointment.videoCallLink} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">
              Video Call Link
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
        {userRole === 'staff' && appointment.status === "Pending Approval" && (
           <>
            <Button size="sm" variant="outline" className="bg-accent text-accent-foreground hover:bg-accent/90" onClick={() => onMarkAttendance?.(appointment.id, 'Scheduled')}>
                <CheckCircle2 className="mr-2 h-4 w-4" /> Approve
            </Button>
            <Button size="sm" variant="destructive" onClick={() => onCancel?.(appointment.id)}>
                <XCircle className="mr-2 h-4 w-4" /> Reject
            </Button>
           </>
        )}
        {isUpcoming && appointment.status === 'Scheduled' && (
          <>
            {onReschedule && (
              <Button size="sm" variant="outline" onClick={() => onReschedule(appointment.id)}>
                <CalendarClock className="mr-2 h-4 w-4" /> Reschedule
              </Button>
            )}
            {onCancel && (
              <Button size="sm" variant="destructive" onClick={() => onCancel(appointment.id)}>
                <XCircle className="mr-2 h-4 w-4" /> Cancel
              </Button>
            )}
          </>
        )}
        {userRole === 'staff' && isPast && appointment.status === 'Scheduled' && ( // Staff can mark attendance for past scheduled
             <>
                <Button size="sm" variant="outline" className="border-green-500 text-green-600 hover:bg-green-50 hover:text-green-700" onClick={() => onMarkAttendance?.(appointment.id, 'Completed')}>
                    <CheckCircle2 className="mr-2 h-4 w-4" /> Mark Attended
                </Button>
                <Button size="sm" variant="outline" className="border-red-500 text-red-600 hover:bg-red-50 hover:text-red-700" onClick={() => onMarkAttendance?.(appointment.id, 'Not Attended')}>
                    <XCircle className="mr-2 h-4 w-4" /> Mark Not Attended
                </Button>
            </>
        )}
        
        {/* More Actions Dropdown for other file related or detailed view actions */}
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="p-1.5 h-auto">
                    <MoreHorizontal className="h-4 w-4" />
                    <span className="sr-only">More actions</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem>
                    <FileText className="mr-2 h-4 w-4" /> View Details
                </DropdownMenuItem>
                {userRole === 'staff' && (
                    <DropdownMenuItem>
                        <FileText className="mr-2 h-4 w-4" /> Attach Files (Staff)
                    </DropdownMenuItem>
                )}
                 {appointment.status === 'Completed' && (
                    <DropdownMenuItem>
                        <FileText className="mr-2 h-4 w-4" /> View Summary/Notes
                    </DropdownMenuItem>
                 )}
            </DropdownMenuContent>
        </DropdownMenu>

      </CardFooter>
    </Card>
  );
}
