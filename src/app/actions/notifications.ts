
'use server';

import { generateNotificationEmail, type NotificationEmailInput } from '@/ai/flows/notification-email-flow';

/**
 * Server Action to generate professional notification email content using Genkit.
 * Returns the generated subject and body. 
 * Note: Firestore persistence is now handled by the client to ensure auth context.
 */
export async function sendNotificationEmail(data: NotificationEmailInput) {
  try {
    const email = await generateNotificationEmail(data);
    const recipient = data.recipientType === 'admin' ? 'admin@rpcoachup.com' : data.userEmail;

    // Simulation of sending an email (Console Log)
    console.log('=========================================');
    console.log(`📤 [SIMULATED EMAIL GENERATED] For: ${recipient}`);
    console.log(`📌 Subject: ${email.subject}`);
    console.log('=========================================');

    return { 
      success: true, 
      email: {
        recipientEmail: recipient,
        subject: email.subject,
        body: email.body,
        type: data.type,
        userType: data.userType
      }
    };
  } catch (error) {
    console.error('Failed to generate notification email:', error);
    return { success: false, error: 'Failed to generate content' };
  }
}
