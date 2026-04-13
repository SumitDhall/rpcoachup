'use server';

import { generateNotificationEmail, type NotificationEmailInput } from '@/ai/flows/notification-email-flow';

/**
 * Server Action to "send" a notification email to the administrator.
 * In a production app, this would use a service like SendGrid, Resend, or AWS SES.
 * For this prototype, it generates professional content using Genkit and logs it.
 */
export async function notifyAdmin(data: NotificationEmailInput) {
  try {
    const email = await generateNotificationEmail(data);

    // Simulation of sending an email
    console.log('=========================================');
    console.log('📤 [SIMULATED EMAIL SENT TO ADMIN]');
    console.log(`📅 Timestamp: ${new Date().toISOString()}`);
    console.log(`📧 To: admin@rpcoachup.com`);
    console.log(`📌 Subject: ${email.subject}`);
    console.log('-----------------------------------------');
    console.log(`Content:\n\n${email.body}`);
    console.log('=========================================');

    return { success: true };
  } catch (error) {
    console.error('Failed to notify admin:', error);
    return { success: false, error: 'Failed to send notification' };
  }
}
