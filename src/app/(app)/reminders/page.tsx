import ReminderGenerator from "@/components/reminders/ReminderGenerator";

export default function RemindersPage() {
  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <div className="mb-8 text-center md:text-left">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Automated Appointment Reminders</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto md:mx-0">
          Utilize our AI tool to generate personalized and effective reminders for your patients, reducing no-shows and improving engagement.
        </p>
      </div>
      
      <ReminderGenerator />
    </div>
  );
}
