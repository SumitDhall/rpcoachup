'use server';
/**
 * @fileOverview A Genkit flow to generate professional notification emails for admins and users.
 *
 * - generateNotificationEmail - Generates email subject and body based on events and recipients.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const NotificationEmailInputSchema = z.object({
  recipientType: z.enum(['admin', 'user']).describe('Who the email is being sent to.'),
  type: z.enum(['registration', 'interest', 'status_update']).describe('The type of event being reported.'),
  userType: z.string().describe('The role of the user (Student or Teacher).'),
  userName: z.string().describe('The full name of the user.'),
  userEmail: z.string().describe('The email address of the user.'),
  details: z.string().optional().describe('Any additional details like subject, notes, or new status.'),
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
Generate a professional email based on the following context.

Recipient Type: {{recipientType}}
Event Type: {{type}}
User Role: {{userType}}
User Name: {{userName}}
User Email: {{userEmail}}
{{#if details}}Specific Details: {{details}}{{/if}}

Guidelines:
1. If recipientType is 'admin':
   - Address the email to the Platform Administrator.
   - Summarize the user's action (registration, interest submission, etc.).
   - Provide context for administrative follow-up.
2. If recipientType is 'user':
   - Address the email to {{userName}}.
   - If type is 'interest', confirm their submission and thank them for choosing RP Coach-Up.
   - If type is 'status_update', inform them of the update (e.g., moved to In-Progress or Completed) and what it means for them.
   - Keep the tone encouraging, professional, and helpful.

The email should have a clear subject line and a well-structured body.`,
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
