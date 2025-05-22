import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { UserCog, Bell, ShieldCheck, Palette } from "lucide-react";
import Image from "next/image";

// Mock user data for settings
const userSettings = {
  name: "Dra. Ana Pérez",
  email: "ana.perez@medischedule.com",
  phone: "555-123-4567",
  specialty: "Pediatría", // Staff specific
  notifications: {
    emailReminders: true,
    smsReminders: false, 
    newAppointmentAlerts: true,
  },
};

export default function SettingsPage() {
  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
          <UserCog className="h-8 w-8 text-primary" /> Configuración de la Aplicación
        </h1>
        <p className="text-muted-foreground mt-1">
          Gestiona tu perfil, preferencias de notificación y otros ajustes de la aplicación.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-2 space-y-8">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Información del Perfil</CardTitle>
              <CardDescription>Actualiza tus datos personales. Esta información es visible para las partes relevantes.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Nombre Completo</Label>
                  <Input id="name" defaultValue={userSettings.name} />
                </div>
                <div>
                  <Label htmlFor="email">Correo Electrónico</Label>
                  <Input id="email" type="email" defaultValue={userSettings.email} readOnly className="bg-muted/50 cursor-not-allowed"/>
                </div>
              </div>
              <div>
                <Label htmlFor="phone">Número de Teléfono</Label>
                <Input id="phone" type="tel" defaultValue={userSettings.phone} />
              </div>
              {userSettings.specialty && (
                <div>
                  <Label htmlFor="specialty">Especialidad (Personal)</Label>
                  <Input id="specialty" defaultValue={userSettings.specialty} />
                </div>
              )}
              <Button className="mt-2">Guardar Cambios del Perfil</Button>
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Bell className="h-5 w-5 text-primary"/> Preferencias de Notificación</CardTitle>
              <CardDescription>Elige cómo quieres ser notificado sobre citas y actualizaciones del sistema.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 border rounded-md">
                <Label htmlFor="emailReminders">Recordatorios de Citas por Correo</Label>
                <span className="text-sm text-primary font-medium">Activado</span>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-md">
                <Label htmlFor="smsReminders">Recordatorios de Citas por SMS</Label>
                <span className="text-sm text-muted-foreground">Desactivado</span>
              </div>
               <div className="flex items-center justify-between p-3 border rounded-md">
                <Label htmlFor="newAppointmentAlerts">Alertas de Nuevas Solicitudes de Cita</Label>
                <span className="text-sm text-primary font-medium">Activado</span>
              </div>
              <Button variant="outline">Actualizar Preferencias</Button>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-8">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><ShieldCheck className="h-5 w-5 text-primary"/> Seguridad</CardTitle>
              <CardDescription>Gestiona la configuración de seguridad de tu cuenta.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full">Cambiar Contraseña</Button>
              <Button variant="outline" className="w-full" disabled>Activar 2FA (Próximamente)</Button>
            </CardContent>
          </Card>
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Palette className="h-5 w-5 text-primary"/> Apariencia</CardTitle>
              <CardDescription>Personaliza la apariencia.</CardDescription>
            </CardHeader>
            <CardContent>
                <p className="text-sm text-muted-foreground mb-3">La configuración del tema se gestiona globalmente por ahora.</p>
                 <Image 
                    src="https://placehold.co/600x400.png" 
                    alt="Diseño abstracto representando temas" 
                    width={600} 
                    height={400} 
                    className="rounded-md aspect-[3/2] object-cover"
                    data-ai-hint="tema abstracto"
                  />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
