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

## 🌐 Custom Domains
You can use your own domain (e.g., `www.yourbrand.com`) with this app for free (excluding the cost of the domain itself).

### How to set up:
1. **Open Firebase Console**: Go to [console.firebase.google.com](https://console.firebase.google.com/).
2. **Navigate to Hosting**: In the left sidebar, go to **Build** > **Hosting**.
3. **Add Domain**: Click the **Add custom domain** button.
4. **Enter Domain**: Type in your domain name and follow the verification steps.
5. **Update DNS**: You will be provided with **A records** or a **TXT record**. Copy these into the DNS management panel of your domain registrar (e.g., GoDaddy, Namecheap, Google Domains).
6. **Wait for SSL**: Once DNS is verified, Firebase will automatically provision a free SSL certificate. This can take anywhere from 1 to 24 hours to fully propagate.

## Tech Stack
- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS + ShadCN UI
- **Database**: Cloud Firestore
- **Auth**: Firebase Authentication
- **AI**: Google Genkit (Gemini 2.5 Flash)

## Deployment & Hosting
- **Hosting Plan**: Development is free on the **Spark** plan. Production usage of GenAI and external APIs typically requires the **Blaze** plan.
- **App Hosting**: This project is configured for **Firebase App Hosting**, which handles server-side rendering (SSR) for Next.js automatically.
