import ReminderGenerator from "@/components/reminders/ReminderGenerator";

export default function RemindersPage() {
  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <div className="mb-8 text-center md:text-left">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Recordatorios de Citas Automatizados</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto md:mx-0">
          Utiliza nuestra herramienta de IA para generar recordatorios personalizados y efectivos para tus pacientes, reduciendo ausencias y mejorando la comunicación.
        </p>
      </div>
      
      <ReminderGenerator />
    </div>
  );
}
