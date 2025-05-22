import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarCheck, Users, BellRing, Activity, FileText, CalendarPlus } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

// Mock data for dashboard
const dashboardStats = {
  upcomingAppointments: 5,
  pendingRequests: 2,
  totalPatients: 120,
  recentActivity: [
    { id: 1, text: "New appointment request from John Doe.", time: "10m ago" },
    { id: 2, text: "Appointment with Jane Smith confirmed.", time: "1h ago" },
    { id: 3, text: "Reminder sent to Michael B.", time: "3h ago" },
  ],
};

export default function DashboardPage() {
  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Welcome, Dr. Carter!</h1>
        <p className="text-muted-foreground">Here's what's happening in MediSchedule today.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
        <StatCard
          title="Upcoming Appointments"
          value={dashboardStats.upcomingAppointments.toString()}
          icon={<CalendarCheck className="h-6 w-6 text-primary" />}
          description="Appointments scheduled for today."
          link="/appointments"
          linkLabel="View All"
        />
        <StatCard
          title="Pending Requests"
          value={dashboardStats.pendingRequests.toString()}
          icon={<Users className="h-6 w-6 text-accent" />}
          description="Patient requests needing approval."
          link="/appointments/requests"
          linkLabel="Manage Requests"
        />
        <StatCard
          title="Total Patients"
          value={dashboardStats.totalPatients.toString()}
          icon={<Users className="h-6 w-6 text-primary" />} // Using Users icon again for variety
          description="Active patients in the system."
          link="/patients"
          linkLabel="View Patients"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              Recent Activity
            </CardTitle>
            <CardDescription>Latest updates and notifications.</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              {dashboardStats.recentActivity.map((activity) => (
                <li key={activity.id} className="flex items-start space-x-3">
                  <BellRing className="h-5 w-5 text-muted-foreground mt-1" />
                  <div>
                    <p className="text-sm text-foreground">{activity.text}</p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Quick Actions
            </CardTitle>
            <CardDescription>Access common tasks quickly.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link href="/appointments/new" className="block">
              <Button className="w-full justify-start" variant="outline">
                <CalendarPlus className="mr-2 h-4 w-4" /> Register New Appointment
              </Button>
            </Link>
            <Link href="/reminders" className="block">
              <Button className="w-full justify-start" variant="outline">
                <BellRing className="mr-2 h-4 w-4" /> Send Reminder
              </Button>
            </Link>
            <Link href="/availability" className="block">
              <Button className="w-full justify-start" variant="outline">
                <CalendarCheck className="mr-2 h-4 w-4" /> Manage Availability
              </Button>
            </Link>
             <Image 
                src="https://placehold.co/600x400.png" 
                alt="Medical illustration" 
                width={600} 
                height={400} 
                className="rounded-md mt-4 aspect-[3/2] object-cover"
                data-ai-hint="medical healthcare"
              />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  description: string;
  link?: string;
  linkLabel?: string;
}

function StatCard({ title, value, icon, description, link, linkLabel }: StatCardProps) {
  return (
    <Card className="shadow-lg hover:shadow-xl transition-shadow transform_scale duration-300 ease-out hover:scale-[1.03]">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-foreground">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold text-primary">{value}</div>
        <p className="text-xs text-muted-foreground mt-1">{description}</p>
        {link && linkLabel && (
          <Link href={link} className="text-sm text-primary hover:underline mt-2 block">
            {linkLabel} &rarr;
          </Link>
        )}
      </CardContent>
    </Card>
  );
}
