import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarPlus, Search, Sparkles } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function BookAppointmentPage() {
  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center justify-center gap-2">
          <CalendarPlus className="h-8 w-8 text-primary" /> Book a New Appointment
        </h1>
        <p className="text-muted-foreground mt-1 max-w-lg mx-auto">
          Find available doctors and time slots that fit your schedule.
        </p>
      </div>

      <Card className="max-w-3xl mx-auto shadow-xl">
        <CardHeader>
          <CardTitle>Find a Doctor or Service</CardTitle>
          <CardDescription>Search by specialty, doctor name, or service needed.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex gap-2">
            <input 
              type="text" 
              placeholder="e.g., Cardiology, Dr. Smith, Annual Check-up" 
              className="flex-grow p-2 border border-input rounded-md focus:ring-2 focus:ring-ring"
            />
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
              <Search className="mr-2 h-4 w-4" /> Search
            </Button>
          </div>

          <div className="text-center py-6 border-2 border-dashed border-input rounded-md">
            <Sparkles className="h-12 w-12 text-primary mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-foreground">Smart Slot Finder (Coming Soon!)</h3>
            <p className="text-sm text-muted-foreground">
              Our AI will help you find the best available slots based on your preferences.
            </p>
          </div>

          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-3">
              Alternatively, you can view the general availability calendar:
            </p>
            <Link href="/appointments/calendar">
              <Button variant="outline">
                View Availability Calendar
              </Button>
            </Link>
          </div>
           <Image 
              src="https://placehold.co/800x400.png" 
              alt="Illustration of a calendar and search" 
              width={800} 
              height={400} 
              className="rounded-md mt-6 aspect-[2/1] object-cover"
              data-ai-hint="calendar search"
            />
        </CardContent>
      </Card>
    </div>
  );
}
