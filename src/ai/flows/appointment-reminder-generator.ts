// src/ai/flows/appointment-reminder-generator.ts
'use server';

/**
 * @fileOverview Generates personalized appointment reminder messages.
 *
 * - generateAppointmentReminder - A function that generates an appointment reminder message.
 * - AppointmentReminderInput - The input type for the generateAppointmentReminder function.
 * - AppointmentReminderOutput - The return type for the generateAppointmentReminder function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AppointmentReminderInputSchema = z.object({
  patientName: z.string().describe('The name of the patient.'),
  appointmentDateTime: z.string().describe('The date and time of the appointment (e.g., 2024-08-15T14:30).'),
  location: z.string().describe('The location of the appointment.'),
  specialInstructions: z.string().optional().describe('Any special instructions for the patient.'),
});
export type AppointmentReminderInput = z.infer<typeof AppointmentReminderInputSchema>;

const AppointmentReminderOutputSchema = z.object({
  reminderMessage: z.string().describe('The personalized appointment reminder message.'),
});
export type AppointmentReminderOutput = z.infer<typeof AppointmentReminderOutputSchema>;

export async function generateAppointmentReminder(input: AppointmentReminderInput): Promise<AppointmentReminderOutput> {
  return appointmentReminderFlow(input);
}

const prompt = ai.definePrompt({
  name: 'appointmentReminderPrompt',
  input: {schema: AppointmentReminderInputSchema},
  output: {schema: AppointmentReminderOutputSchema},
  prompt: `You are a helpful assistant that generates personalized appointment reminder messages for patients.

  Here are the appointment details:
  Patient Name: {{{patientName}}}
  Date and Time: {{{appointmentDateTime}}}
  Location: {{{location}}}
  Special Instructions: {{#if specialInstructions}}{{{specialInstructions}}}{{else}}None{{/if}}

  Please generate a friendly and informative reminder message.
  The message must be tailored to the patient's specific needs.
  The generated message should be no more than 100 words.
  `,
});

const appointmentReminderFlow = ai.defineFlow(
  {
    name: 'appointmentReminderFlow',
    inputSchema: AppointmentReminderInputSchema,
    outputSchema: AppointmentReminderOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
