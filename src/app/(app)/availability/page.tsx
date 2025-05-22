import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarCog, Clock, PlusCircle } from "lucide-react";
import Image from "next/image";

// Mock availability data
const currentAvailability = [
  { day: "Monday", Btime: "09:00 AM", Etime: "05:00 PM", active: true },
  { day: "Tuesday", Btime: "09:00 AM", Etime: "05:00 PM", active: true },
  { day: "Wednesday", Btime: "09:00 AM", Etime: "01:00 PM", active: true },
  { day: "Thursday", Btime: "09:00 AM", Etime: "05:00 PM", active: true },
  { day: "Friday", Btime: "10:00 AM", Etime: "03:00 PM", active: true },
  { day: "Saturday", Btime: "Not Available", Etime: "", active: false },
  { day: "Sunday", Btime: "Not Available", Etime: "", active: false },
];

export default function AvailabilityPage() {
  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
          <CalendarCog className="h-8 w-8 text-primary" /> Manage Care Hours
        </h1>
        <p className="text-muted-foreground mt-1">
          Define your working hours and availability for patient appointments.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 shadow-lg">
          <CardHeader className="flex flex-row justify-between items-center">
            <div>
              <CardTitle>Current Weekly Schedule</CardTitle>
              <CardDescription>Review and update your standard availability.</CardDescription>
            </div>
            <Button size="sm" className="bg-accent text-accent-foreground hover:bg-accent/90">
              <PlusCircle className="mr-2 h-4 w-4" /> Edit Schedule
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {currentAvailability.map((slot) => (
                <div key={slot.day} className={`flex justify-between items-center p-3 rounded-md border ${slot.active ? 'bg-card' : 'bg-muted/50 opacity-70'}`}>
                  <span className="font-medium text-foreground">{slot.day}</span>
                  <div className="flex items-center gap-2">
                    {slot.active ? (
                      <>
                        <Clock className="h-4 w-4 text-primary" />
                        <span className="text-sm text-foreground">{slot.Btime} - {slot.Etime}</span>
                      </>
                    ) : (
                      <span className="text-sm text-muted-foreground italic">{slot.Btime}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Block Specific Dates</CardTitle>
              <CardDescription>Set unavailability for holidays or personal time.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-3">
                This feature allows you to mark specific dates or date ranges as unavailable, overriding your regular schedule.
              </p>
              <Button className="w-full" variant="outline">
                <PlusCircle className="mr-2 h-4 w-4" /> Add Time Off / Block Date
              </Button>
            </CardContent>
          </Card>
           <Card className="shadow-lg">
             <CardHeader>
                <CardTitle>Location Specific Hours</CardTitle>
                <CardDescription>Define availability per clinic or telehealth.</CardDescription>
             </CardHeader>
             <CardContent>
                 <p className="text-sm text-muted-foreground mb-3">
                    Configure different working hours based on your service locations.
                 </p>
                 <Button className="w-full" variant="outline" disabled>
                    Manage Location Hours (Coming Soon)
                 </Button>
                 <Image 
                    src="https://placehold.co/600x300.png" 
                    alt="Location map placeholder" 
                    width={600} 
                    height={300} 
                    className="rounded-md mt-4 aspect-[2/1] object-cover"
                    data-ai-hint="map location"
                  />
             </CardContent>
           </Card>
        </div>
      </div>
    </div>
  );
}
