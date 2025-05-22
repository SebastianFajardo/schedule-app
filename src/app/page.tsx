import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Stethoscope, CalendarCheck, Users, BellRing } from "lucide-react";
import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-background to-secondary/30 p-6">
      <header className="text-center mb-12">
        <div className="inline-flex items-center justify-center p-3 bg-primary rounded-full mb-4 shadow-lg">
          <Stethoscope className="h-12 w-12 text-primary-foreground" />
        </div>
        <h1 className="text-5xl font-bold text-primary tracking-tight">
          MediSchedule
        </h1>
        <p className="mt-3 text-xl text-foreground/80 max-w-xl mx-auto">
          Your trusted partner for seamless medical appointment management.
        </p>
      </header>

      <main className="grid md:grid-cols-2 gap-8 max-w-4xl w-full mb-12">
        <FeatureCard
          icon={<CalendarCheck className="h-8 w-8 text-primary" />}
          title="Effortless Scheduling"
          description="Easily book, reschedule, or cancel appointments with our intuitive calendar system."
        />
        <FeatureCard
          icon={<BellRing className="h-8 w-8 text-primary" />}
          title="Automated Reminders"
          description="Never miss an appointment with smart, AI-powered reminders sent directly to you."
        />
        <FeatureCard
          icon={<Users className="h-8 w-8 text-primary" />}
          title="Patient & Staff Portals"
          description="Dedicated interfaces for patients and medical staff for streamlined communication."
        />
        <FeatureCard
          icon={<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z"/><path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65"/><path d="m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65"/></svg>}
          title="Comprehensive Management"
          description="Manage specialties, professionals, availability, and patient records all in one place."
        />
      </main>

      <footer className="text-center">
        <Link href="/login">
          <Button size="lg" className="rounded-full shadow-md hover:shadow-lg transition-shadow">
            Access Your Portal
          </Button>
        </Link>
        <p className="mt-4 text-sm text-muted-foreground">
          MediSchedule &copy; {new Date().getFullYear()}
        </p>
      </footer>
    </div>
  );
}

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <Card className="shadow-lg hover:shadow-xl transition-shadow_transform_scale duration-300 ease-out hover:scale-[1.02]">
      <CardHeader className="flex flex-row items-center gap-4 pb-2">
        {icon}
        <CardTitle className="text-xl">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription>{description}</CardDescription>
      </CardContent>
    </Card>
  );
}
