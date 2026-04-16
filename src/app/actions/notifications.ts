
'use server';

import { generateNotificationEmail, type NotificationEmailInput } from '@/ai/flows/notification-email-flow';

/**
 * Server Action to generate professional notification email content using Genkit.
 * Returns the generated subject and body. 
 */
export async function sendNotificationEmail(data: NotificationEmailInput) {
  try {
    const email = await generateNotificationEmail(data);
    const recipient = data.recipientType === 'admin' ? 'admin@rpcoachup.com' : data.userEmail;

    // Simulation of sending an email (Enhanced Console Logging for debugging)
    console.log('=========================================');
    console.log(`📤 [SIMULATED EMAIL] To: ${recipient}`);
    console.log(`📌 Subject: ${email.subject}`);
    console.log(`📝 Body: ${email.body}`);
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
