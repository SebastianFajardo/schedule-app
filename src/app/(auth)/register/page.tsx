import Link from "next/link";
import { Stethoscope, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-background to-secondary/30 p-4">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="space-y-1 text-center">
           <div className="inline-flex items-center justify-center p-2 bg-primary rounded-full mb-3 mx-auto">
            <UserPlus className="h-10 w-10 text-primary-foreground" />
          </div>
          <CardTitle className="text-3xl font-bold text-primary">Registro de Usuario</CardTitle>
          <CardDescription>La creación de cuentas para MediSchedule es gestionada por administradores del sistema.</CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-muted-foreground mb-6">
            Si eres un nuevo paciente o miembro del personal médico y necesitas acceso, por favor contacta a tu administrador designado o equipo de soporte para que te creen una cuenta.
          </p>
          <Stethoscope className="h-16 w-16 text-primary mx-auto mb-4" />
          <Link href="/login">
            <Button variant="outline" className="w-full">
              Volver a Iniciar Sesión
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
