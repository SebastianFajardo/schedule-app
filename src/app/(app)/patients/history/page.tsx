import AppointmentList from "@/components/appointments/AppointmentList";
import { mockAppointments, mockPatients } from "@/lib/data";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Search } from "lucide-react";

// For this staff view, we'd typically have a search for patient first.
// Then display their history. This is a simplified version.

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
          <Users className="h-8 w-8 text-primary" /> Patient Appointment History
        </h1>
        <p className="text-muted-foreground mt-1">
          Search for a patient to view their complete appointment records.
        </p>
      </div>

      <Card className="mb-8 shadow-lg">
        <CardHeader>
          <CardTitle>Search Patient</CardTitle>
          <CardDescription>Enter patient name or ID to find their history.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input placeholder="Search by patient name or ID..." className="flex-grow" />
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
              <Search className="mr-2 h-4 w-4" /> Search Patient
            </Button>
          </div>
        </CardContent>
      </Card>

      {selectedPatientName ? (
        <AppointmentList
          initialAppointments={patientHistory}
          userRole="staff" // Staff are viewing this
          listTitle={`History for ${selectedPatientName}`}
          listDescription={`All recorded appointments for ${selectedPatientName}.`}
        />
      ) : (
        <Card className="text-center py-12 shadow-lg">
          <CardContent>
            <Search className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold text-foreground">Search for a Patient</h3>
            <p className="text-muted-foreground mt-2">
              Please use the search bar above to find a patient and view their appointment history.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
