# RP Coach-Up Platform

This is a Next.js application powered by Firebase Studio, using AI to match students with teachers and courses.

## 🚀 Deployment Guide

### 1. Default Domain Deployment
This application uses **Firebase App Hosting**, which is designed for modern web frameworks like Next.js.
- **How it works**: Your application is linked to a GitHub repository.
- **To Deploy**: Simply push your code changes to your `main` (or connected) branch. Firebase will automatically detect the push, build the Next.js project, and deploy it to your `*.web.app` or `*.firebaseapp.com` URLs.
- **Monitoring**: You can track the build progress in the **App Hosting** section of the Firebase Console.

### 2. Custom Domain Setup (e.g., rpcoachup.com)
If you want to use your own domain, follow these steps in the **Firebase Console** (under Hosting > Custom Domain):

#### Step 1: Verification (TXT Record)
- Add your domain in the Hosting dashboard.
- Firebase will provide a **TXT record** (Host: `@` or blank, Value: `google-site-verification=...`).
- Add this record to your domain registrar (GoDaddy, Namecheap, etc.).
- **Wait**: It can take 5-60 minutes for verification to complete.

#### Step 2: Pointing to the App (A Records)
- Once verified, the status will change. **Click on your domain name** in the list to reveal the "A" records.
- You will see **two IP addresses** (e.g., `199.36.158.100`).
- Add both as **A records** in your domain registrar's DNS settings.
- If you have existing A records for `@`, delete them or replace them with these.

#### Step 3: SSL Provisioning (Minting Certificate)
- After adding A records, the status will show **"Minting certificate"**.
- **Important**: This process is automatic but can take **up to 24 hours** to complete. During this time, your site might show a "Not Secure" warning or a blank page. Once finished, the status will change to **"Connected"**.

---

## 📧 Simulated Email System
The platform includes a Genkit-powered email notification system. 
- **Current Behavior**: When users register or submit inquiries, professional email content is generated and logged to the **server console**. 
- **Production Path**: To send real emails, you will need to integrate a provider (e.g., Resend or SendGrid). This typically requires switching the Firebase project to the **Blaze (Pay-as-you-go)** plan to allow outgoing network requests.

## 🔑 Administrative Access
Administrative access is managed via a collection in Firestore called `roles_admin`.
1. **Create an Account**: Register on the `/register` page.
2. **Get UID**: Find your User UID in the **Authentication** tab of the Firebase Console.
3. **Grant Permissions**: Create a document in the `roles_admin` collection where the **Document ID** is your UID.
4. **Login**: You will be automatically redirected to the `/admin` dashboard.

## Tech Stack
- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS + ShadCN UI
- **Database**: Cloud Firestore
- **Auth**: Firebase Authentication
- **AI**: Google Genkit (Gemini 2.5 Flash)
