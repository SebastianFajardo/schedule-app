"use client";

import * as React from "react";
import type { Appointment } from "@/types";
import AppointmentItem from "./AppointmentItem";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ListFilter, Search } from "lucide-react";
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


interface AppointmentListProps {
  initialAppointments: Appointment[];
  userRole: 'patient' | 'staff';
  listTitle: string;
  listDescription: string;
}

export default function AppointmentList({ initialAppointments, userRole, listTitle, listDescription }: AppointmentListProps) {
  const [appointments, setAppointments] = React.useState<Appointment[]>(initialAppointments);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<string>("all"); // 'all', 'Scheduled', 'Pending Approval', etc.
  const [timeFilter, setTimeFilter] = React.useState<string>("all"); // 'all', 'upcoming', 'past'
  const [sortBy, setSortBy] = React.useState<string>("dateTimeDesc"); // 'dateTimeDesc', 'dateTimeAsc', 'patientName'
  const { toast } = useToast();

  const handleCancel = (id: string) => {
    // Actual cancel logic would be an API call
    setAppointments(prev => prev.map(app => app.id === id ? {...app, status: 'Cancelled'} : app));
    toast({ title: "Appointment Cancelled", description: `Appointment ID ${id} has been cancelled.`});
  };

  const handleReschedule = (id: string) => {
    // Placeholder for reschedule logic - could open a modal or navigate
    toast({ title: "Reschedule Requested", description: `Reschedule initiated for Appointment ID ${id}.`});
  };

  const handleMarkAttendance = (id: string, newStatus: 'Completed' | 'Not Attended' | 'Scheduled') => {
     // 'Scheduled' is used for approving pending ones
    setAppointments(prev => prev.map(app => app.id === id ? {...app, status: newStatus} : app));
    toast({ title: "Attendance Updated", description: `Appointment ID ${id} marked as ${newStatus}.`});
  };

  const filteredAppointments = React.useMemo(() => {
    let filtered = [...appointments];

    // Filter by search term (patient name, doctor name, specialty)
    if (searchTerm) {
      filtered = filtered.filter(
        (app) =>
          app.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          app.doctorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          app.specialty.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by status
    if (statusFilter !== "all") {
      filtered = filtered.filter((app) => app.status === statusFilter);
    }
    
    // Filter by time (upcoming/past)
    const now = new Date();
    if (timeFilter === "upcoming") {
        filtered = filtered.filter(app => app.dateTime >= now && app.status !== 'Completed' && app.status !== 'Cancelled' && app.status !== 'Not Attended');
    } else if (timeFilter === "past") {
        filtered = filtered.filter(app => app.dateTime < now || app.status === 'Completed' || app.status === 'Cancelled' || app.status === 'Not Attended');
    }


    // Sort
    if (sortBy === "dateTimeDesc") {
      filtered.sort((a, b) => b.dateTime.getTime() - a.dateTime.getTime());
    } else if (sortBy === "dateTimeAsc") {
      filtered.sort((a, b) => a.dateTime.getTime() - b.dateTime.getTime());
    } else if (sortBy === "patientName") {
      filtered.sort((a, b) => a.patientName.localeCompare(b.patientName));
    }

    return filtered;
  }, [appointments, searchTerm, statusFilter, timeFilter, sortBy]);
  
  const appointmentStatuses: Appointment['status'][] = ["Scheduled", "Pending Approval", "Completed", "Cancelled", "Not Attended"];


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
              placeholder="Search by patient, doctor, specialty..."
              className="pl-8 w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Filter by Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                {appointmentStatuses.map(status => (
                     <SelectItem key={status} value={status}>{status}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Sort By" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="dateTimeDesc">Date (Newest First)</SelectItem>
                <SelectItem value="dateTimeAsc">Date (Oldest First)</SelectItem>
                <SelectItem value="patientName">Patient Name</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Tabs defaultValue="all" onValueChange={setTimeFilter} className="mb-4">
            <TabsList className="grid w-full grid-cols-3 md:w-auto md:inline-flex">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                <TabsTrigger value="past">Past</TabsTrigger>
            </TabsList>
        </Tabs>

        {filteredAppointments.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
            {filteredAppointments.map((app) => (
              <AppointmentItem 
                key={app.id} 
                appointment={app} 
                userRole={userRole}
                onCancel={(id) => (
                    <AlertDialog>
                        <AlertDialogTrigger asChild><Button variant="destructive" size="sm" className="hidden" id={`cancel-trigger-${id}`}>Cancel</Button></AlertDialogTrigger> {/* Hidden trigger, programmatically click */}
                        <Button variant="destructive" size="sm" onClick={() => document.getElementById(`cancel-trigger-${id}`)?.click()}><XCircle className="mr-2 h-4 w-4" /> Cancel</Button>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure you want to cancel this appointment?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This action cannot be undone. The appointment for {app.patientName} on {app.dateTime.toLocaleDateString()} will be marked as cancelled.
                            </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                            <AlertDialogCancel>Keep Appointment</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleCancel(id)}>Confirm Cancellation</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                )}
                onReschedule={handleReschedule}
                onMarkAttendance={handleMarkAttendance}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <ListFilter className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold text-foreground">No Appointments Found</h3>
            <p className="text-muted-foreground mt-2">
              Try adjusting your search or filter criteria, or there might be no appointments matching your current view.
            </p>
          </div>
        )}
      </Card>
    </div>
  );
}
