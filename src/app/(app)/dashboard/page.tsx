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
    { id: 1, text: "Nueva solicitud de cita de Carlos Ruiz.", time: "hace 10m" },
    { id: 2, text: "Cita con Ana García confirmada.", time: "hace 1h" },
    { id: 3, text: "Recordatorio enviado a Miguel B.", time: "hace 3h" },
  ],
};

export default function DashboardPage() {
  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">¡Bienvenida, Dra. Ana Pérez!</h1>
        <p className="text-muted-foreground">Esto es lo que está sucediendo hoy en MediSchedule.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
        <StatCard
          title="Citas Próximas"
          value={dashboardStats.upcomingAppointments.toString()}
          icon={<CalendarCheck className="h-6 w-6 text-primary" />}
          description="Citas programadas para hoy."
          link="/appointments"
          linkLabel="Ver Todas"
        />
        <StatCard
          title="Solicitudes Pendientes"
          value={dashboardStats.pendingRequests.toString()}
          icon={<Users className="h-6 w-6 text-accent" />}
          description="Solicitudes de pacientes que necesitan aprobación."
          link="/appointments/requests"
          linkLabel="Gestionar Solicitudes"
        />
        <StatCard
          title="Total de Pacientes"
          value={dashboardStats.totalPatients.toString()}
          icon={<Users className="h-6 w-6 text-primary" />}
          description="Pacientes activos en el sistema."
          link="/patients"
          linkLabel="Ver Pacientes"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              Actividad Reciente
            </CardTitle>
            <CardDescription>Últimas actualizaciones y notificaciones.</CardDescription>
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
              Acciones Rápidas
            </CardTitle>
            <CardDescription>Accede a tareas comunes rápidamente.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link href="/appointments/new" className="block">
              <Button className="w-full justify-start" variant="outline">
                <CalendarPlus className="mr-2 h-4 w-4" /> Registrar Nueva Cita
              </Button>
            </Link>
            <Link href="/reminders" className="block">
              <Button className="w-full justify-start" variant="outline">
                <BellRing className="mr-2 h-4 w-4" /> Enviar Recordatorio
              </Button>
            </Link>
            <Link href="/availability" className="block">
              <Button className="w-full justify-start" variant="outline">
                <CalendarCheck className="mr-2 h-4 w-4" /> Gestionar Disponibilidad
              </Button>
            </Link>
             <Image 
                src="https://placehold.co/600x400.png" 
                alt="Ilustración médica" 
                width={600} 
                height={400} 
                className="rounded-md mt-4 aspect-[3/2] object-cover"
                data-ai-hint="medicina salud"
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
