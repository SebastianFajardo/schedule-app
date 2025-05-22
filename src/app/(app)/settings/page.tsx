import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { UserCog, Bell, ShieldCheck, Palette } from "lucide-react";
import Image from "next/image";

// Mock user data for settings
const userSettings = {
  name: "Dr. Emily Carter",
  email: "emily.carter@medischedule.com",
  phone: "555-123-4567",
  specialty: "Pediatrics", // Staff specific
  notifications: {
    emailReminders: true,
    smsReminders: false, // Example
    newAppointmentAlerts: true,
  },
};

export default function SettingsPage() {
  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
          <UserCog className="h-8 w-8 text-primary" /> Application Settings
        </h1>
        <p className="text-muted-foreground mt-1">
          Manage your profile, notification preferences, and other application settings.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-2 space-y-8">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Update your personal details. This information is visible to relevant parties.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" defaultValue={userSettings.name} />
                </div>
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" type="email" defaultValue={userSettings.email} readOnly className="bg-muted/50 cursor-not-allowed"/>
                </div>
              </div>
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" type="tel" defaultValue={userSettings.phone} />
              </div>
              {userSettings.specialty && (
                <div>
                  <Label htmlFor="specialty">Specialty (Staff)</Label>
                  <Input id="specialty" defaultValue={userSettings.specialty} />
                </div>
              )}
              <Button className="mt-2">Save Profile Changes</Button>
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Bell className="h-5 w-5 text-primary"/> Notification Preferences</CardTitle>
              <CardDescription>Choose how you want to be notified about appointments and system updates.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Placeholder for notification toggles */}
              <div className="flex items-center justify-between p-3 border rounded-md">
                <Label htmlFor="emailReminders">Email Appointment Reminders</Label>
                {/* Switch component would go here */}
                <span className="text-sm text-primary font-medium">Enabled</span>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-md">
                <Label htmlFor="smsReminders">SMS Appointment Reminders</Label>
                <span className="text-sm text-muted-foreground">Disabled</span>
              </div>
               <div className="flex items-center justify-between p-3 border rounded-md">
                <Label htmlFor="newAppointmentAlerts">New Appointment Request Alerts</Label>
                <span className="text-sm text-primary font-medium">Enabled</span>
              </div>
              <Button variant="outline">Update Notification Settings</Button>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-8">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><ShieldCheck className="h-5 w-5 text-primary"/> Security</CardTitle>
              <CardDescription>Manage your account security settings.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full">Change Password</Button>
              <Button variant="outline" className="w-full" disabled>Enable Two-Factor Auth (Coming Soon)</Button>
            </CardContent>
          </Card>
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Palette className="h-5 w-5 text-primary"/> Appearance</CardTitle>
              <CardDescription>Customize the look and feel.</CardDescription>
            </CardHeader>
            <CardContent>
                <p className="text-sm text-muted-foreground mb-3">Theme settings are managed globally for now.</p>
                 <Image 
                    src="https://placehold.co/600x400.png" 
                    alt="Abstract design representing themes" 
                    width={600} 
                    height={400} 
                    className="rounded-md aspect-[3/2] object-cover"
                    data-ai-hint="theme abstract"
                  />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
