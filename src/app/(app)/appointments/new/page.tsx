import AppointmentForm from "@/components/appointments/AppointmentForm";

export default function NewAppointmentPage() {
  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <div className="mb-8 text-center md:text-left">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Register New Medical Appointment</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto md:mx-0">
          Efficiently schedule new appointments for patients. Ensure all details are accurate.
        </p>
      </div>
      
      <AppointmentForm />
    </div>
  );
}
