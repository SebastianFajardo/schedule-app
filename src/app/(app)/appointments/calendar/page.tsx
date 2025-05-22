import AppointmentCalendarView from "@/components/appointments/AppointmentCalendarView";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import Link from "next/link";

export default function AppointmentCalendarPage() {
  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Appointment Availability</h1>
          <p className="text-muted-foreground">
            View and manage appointment slots and scheduled events.
          </p>
        </div>
        <Link href="/availability">
          <Button className="bg-accent text-accent-foreground hover:bg-accent/90">
            <PlusCircle className="mr-2 h-4 w-4" />
            Manage Care Hours
          </Button>
        </Link>
      </div>
      
      <AppointmentCalendarView />
    </div>
  );
}
