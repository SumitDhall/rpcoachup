'use server';
/**
 * @fileOverview A Genkit flow to generate professional notification emails for the admin.
 *
 * - generateNotificationEmail - Generates email subject and body based on user events.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const NotificationEmailInputSchema = z.object({
  type: z.enum(['registration', 'interest']).describe('The type of event being reported.'),
  userType: z.string().describe('The role of the user (Student or Teacher).'),
  userName: z.string().describe('The full name of the user.'),
  userEmail: z.string().describe('The email address of the user.'),
  details: z.string().optional().describe('Any additional details like subject or notes.'),
});

const NotificationEmailOutputSchema = z.object({
  subject: z.string().describe('The generated email subject line.'),
  body: z.string().describe('The generated email body content.'),
});

export type NotificationEmailInput = z.infer<typeof NotificationEmailInputSchema>;
export type NotificationEmailOutput = z.infer<typeof NotificationEmailOutputSchema>;

export async function generateNotificationEmail(input: NotificationEmailInput): Promise<NotificationEmailOutput> {
  return notificationEmailFlow(input);
}

const prompt = ai.definePrompt({
  name: 'notificationEmailPrompt',
  input: { schema: NotificationEmailInputSchema },
  output: { schema: NotificationEmailOutputSchema },
  prompt: `You are a professional communication assistant for the RP Coach-Up education platform.
Generate a notification email addressed to the Platform Administrator.

Event Details:
- Event Type: {{type}}
- User Role: {{userType}}
- User Name: {{userName}}
- User Email: {{userEmail}}
{{#if details}}- Specific Details: {{details}}{{/if}}

The email should be professional, clear, and action-oriented.
Subject should be concise (e.g., "New Student Registration: [Name]").
The body should summarize the event and provide the administrator with relevant context for follow-up.`,
});

const notificationEmailFlow = ai.defineFlow(
  {
    name: 'notificationEmailFlow',
    inputSchema: NotificationEmailInputSchema,
    outputSchema: NotificationEmailOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
