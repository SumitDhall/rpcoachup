# RP Coach-Up Platform

This is a Next.js application powered by Firebase Studio, using AI to match students with teachers and courses.

## Features & Implementation Notes

### 📧 Simulated Email System
The platform includes a Genkit-powered email notification system. 
- **Current Behavior**: When users register or submit inquiries, professional email content is generated and logged to the **server console**. 
- **Production Path**: To send real emails, you will need to integrate a provider (e.g., Resend or SendGrid). This typically requires switching the Firebase project to the **Blaze (Pay-as-you-go)** plan to allow outgoing network requests.
- **Troubleshooting**: If you are using the "Forgot Password" feature and don't see the email, please check your **Spam or Junk** folder.

### 🔑 Administrative Access
Administrative access is managed via a "sentinel" collection in Firestore called `roles_admin`. A user is considered an admin if a document exists at `/roles_admin/{uid}`, where `{uid}` is their Firebase Authentication ID.

#### How to add an Admin:
1. **Create an Account**: Register a standard user account on the `/register` page.
2. **Get the UID**:
   - Go to the [Firebase Console](https://console.firebase.google.com/).
   - Navigate to **Authentication** > **Users**.
   - Copy the **User UID** for your account.
3. **Grant Permissions**:
   - Navigate to **Firestore Database**.
   - Create a collection named `roles_admin`.
   - Create a document with the **Document ID** set to the UID you copied.
   - Add a field (e.g., `isAdmin: true`).
4. **Login**: Go to the `/login` page. Upon successful authentication, the app will recognize you as an admin and redirect you to the `/admin` dashboard.

## 🌐 Custom Domains & Hosting
You can use your own domain (e.g., `www.yourbrand.com`) with this app.

### Two-Step Domain Setup:
1. **Step 1: Verification (TXT Record)**:
   - In the Firebase Console (Hosting > Custom Domain), add your domain.
   - Firebase will first provide a **TXT record**. Add this to your domain registrar (e.g., GoDaddy, Namecheap).
   - This proves you own the domain. Wait for the status to change from "Pending" to "Verified".
2. **Step 2: Setup (A Records)**:
   - Once verified, the status often changes to **"Minting certificate"**.
   - **Where to find A Records**: Click on the domain name itself in the list. A modal will pop up showing **two A records** (IP addresses).
   - Add these A records to your DNS settings at your registrar. 
   - **Note**: After adding A records, it can take up to 24 hours for the status to change to "Connected" and for the site to become live.

### 🚀 Troubleshooting "Blank Screen" on Default Host:
If the app shows nothing on the default Firebase URL (`*.web.app`):
1. **Check Console**: Open your browser's Developer Tools (F12) and check for JavaScript errors in the **Console** tab.
2. **Build Deployment**: Ensure the latest code changes have been deployed via your hosting provider.
3. **Environment Variables**: Verify that your `firebaseConfig` in `src/firebase/config.ts` is correct and matches your project settings.

## Tech Stack
- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS + ShadCN UI
- **Database**: Cloud Firestore
- **Auth**: Firebase Authentication
- **AI**: Google Genkit (Gemini 2.5 Flash)
