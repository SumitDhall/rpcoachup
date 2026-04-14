
'use server';

import { generateNotificationEmail, type NotificationEmailInput } from '@/ai/flows/notification-email-flow';
import { initializeFirebase } from '@/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

/**
 * Server Action to "send" a notification email.
 * This handles emails to both administrators and users.
 * It generates content using Genkit, logs it to the server console, 
 * and saves it to Firestore for retrieval in the "Messages" tab.
 */
export async function sendNotificationEmail(data: NotificationEmailInput) {
  try {
    const { firestore } = initializeFirebase();
    const email = await generateNotificationEmail(data);
    const recipient = data.recipientType === 'admin' ? 'admin@rpcoachup.com' : data.userEmail;

    // 1. Simulation of sending an email (Console Log)
    console.log('=========================================');
    console.log(`📤 [SIMULATED EMAIL SENT TO ${data.recipientType.toUpperCase()}]`);
    console.log(`📅 Timestamp: ${new Date().toISOString()}`);
    console.log(`📧 To: ${recipient}`);
    console.log(`📌 Subject: ${email.subject}`);
    console.log('-----------------------------------------');
    console.log(`Content:\n\n${email.body}`);
    console.log('=========================================');

    // 2. Persist in Firestore "messages" collection for UI retrieval
    await addDoc(collection(firestore, 'messages'), {
      recipientEmail: recipient,
      subject: email.subject,
      body: email.body,
      timestamp: serverTimestamp(),
      type: data.type,
      userType: data.userType,
      read: false
    });

    return { success: true };
  } catch (error) {
    console.error('Failed to send notification email:', error);
    return { success: false, error: 'Failed to send notification' };
  }
}
