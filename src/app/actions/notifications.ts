'use server';

import { generateNotificationEmail, type NotificationEmailInput } from '@/ai/flows/notification-email-flow';

/**
 * Server Action to "send" a notification email.
 * This handles emails to both administrators and users.
 * For this prototype, it generates content using Genkit and logs it to the server console.
 */
export async function sendNotificationEmail(data: NotificationEmailInput) {
  try {
    const email = await generateNotificationEmail(data);
    const recipient = data.recipientType === 'admin' ? 'admin@rpcoachup.com' : data.userEmail;

    // Simulation of sending an email
    console.log('=========================================');
    console.log(`📤 [SIMULATED EMAIL SENT TO ${data.recipientType.toUpperCase()}]`);
    console.log(`📅 Timestamp: ${new Date().toISOString()}`);
    console.log(`📧 To: ${recipient}`);
    console.log(`📌 Subject: ${email.subject}`);
    console.log('-----------------------------------------');
    console.log(`Content:\n\n${email.body}`);
    console.log('=========================================');

    return { success: true };
  } catch (error) {
    console.error('Failed to send notification email:', error);
    return { success: false, error: 'Failed to send notification' };
  }
}
