
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div className="text-center md:text-left">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Panel de Control
        </h1>
        <p className="text-muted-foreground mt-1">
          Bienvenido a MediSchedule. Aquí tienes un resumen de tu actividad.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader>
            <CardTitle>Citas Próximas (Simulado)</CardTitle>
            <CardDescription>Ver tus citas agendadas.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-primary">3</p>
            <Link href="#">
              <Button variant="outline" className="mt-4 w-full">
                Ver Citas <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader>
            <CardTitle>Notificaciones (Simulado)</CardTitle>
            <CardDescription>Nuevos mensajes o alertas.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-accent">1</p>
             <Link href="#">
              <Button variant="outline" className="mt-4 w-full">
                Ver Notificaciones <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>
         <Card className="shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader>
            <CardTitle>Acceso Rápido</CardTitle>
            <CardDescription>Enlaces útiles.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Link href="/">
                <Button variant="link" className="p-0 h-auto text-primary">Ir a la Página de Inicio</Button>
            </Link>
            <br/>
            <Link href="/login">
                <Button variant="link" className="p-0 h-auto text-primary">Ir a Login (Cerrar Sesión)</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
       <div className="text-center text-muted-foreground mt-8">
          <p>Esta es una página de panel de control de ejemplo para mostrar el layout.</p>
          <p>El contenido y la funcionalidad completa se pueden construir aquí.</p>
        </div>
    </div>
  );
}
