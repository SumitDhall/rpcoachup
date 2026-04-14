# RP Coach-Up Platform

This is a Next.js application powered by Firebase Studio, using AI to match students with teachers and courses.

## Features & Implementation Notes

### 📧 Simulated Email System
The platform includes a Genkit-powered email notification system. 
- **Current Behavior**: When users register or submit inquiries, professional email content is generated and logged to the **server console**. 
- **Production Path**: To send real emails, you will need to integrate a provider (e.g., Resend or SendGrid). This typically requires switching the Firebase project to the **Blaze (Pay-as-you-go)** plan to allow outgoing network requests.

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

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS + ShadCN UI
- **Database**: Cloud Firestore
- **Auth**: Firebase Authentication
- **AI**: Google Genkit (Gemini 2.5 Flash)

## Deployment & Hosting
- **Custom Domains**: Firebase Hosting supports custom domains for free. You only need to pay your domain registrar for the domain name itself.
- **Hosting Plan**: Development is free on the **Spark** plan. Production usage of GenAI and external APIs typically requires the **Blaze** plan.
