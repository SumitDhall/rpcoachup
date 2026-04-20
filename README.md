
# RP Coach-Up Platform

This is a Next.js 15 application powered by Firebase Studio, using AI to match students with teachers and courses.

## 📧 Email Notifications Guide

### 1. Firebase Auth Emails (Password Reset, etc.)
These emails are handled automatically by Firebase. 
- **Set Public Name**: Go to **Project Settings > General** and set the **Public-facing name** to "RP Coach-Up". This updates the "App Name" in all reset emails.
- **Troubleshooting**: If you get a "Contact Support" error when editing templates, ensure your project domain is verified in **Firebase Hosting**.

### 2. Custom Platform Notifications (Status Updates, Assignments)
This app is integrated with the **"Trigger Email from Firestore"** extension.

#### CRITICAL CONFIGURATION STEPS:
1.  **Collection Name**: In the Extension settings, ensure the **"Email documents collection"** parameter is set exactly to `notifications`.
2.  **Sender Address (CRITICAL)**: Ensure the **"Default FROM address"** in the extension settings matches your SMTP account username exactly (e.g., `support@rpcoachup.com`).
3.  **SMTP URI**: Your URI should look like `smtps://support@rpcoachup.com:YOUR_PASSWORD@mail.privateemail.com:465`.

#### 🛠 Troubleshooting Delivery (Why am I not getting emails?)
If notifications appear in the Admin Portal but you don't receive emails:
1.  **Check Extension Logs**: This is the only way to see why it's failing.
    - Go to **Firebase Console** > **Extensions** > **Trigger Email** > **Manage**.
    - Click **View extension logs**. Look for "Error" or "Auth Failed".
2.  **From Address Mismatch**: SMTP servers (like PrivateEmail) will block any email where the "From" address doesn't match the authenticated email. Ensure the code and extension both use `support@rpcoachup.com`.
3.  **App Password**: If using 2FA, you must use an **App Password**, not your normal login password.

## 🚀 Step-by-Step Deployment Guide (App Hosting)

This app uses **Firebase App Hosting** for Next.js SSR support.

### Phase 1: Push Code to GitHub
1. Open the **Terminal** in this editor.
2. Run:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
   git push -u origin main
   ```

### Phase 2: Set up App Hosting
1. Go to **App Hosting** in the Firebase Console and click "Get Started".
2. Connect your GitHub repository.
3. **Deployment settings**: Root directory `/`, Live branch `main`.

---

## 🔑 Administrative Access
1. Register on the `/register` page.
2. Get your UID from the **Authentication** tab in Firebase Console.
3. Create a document in the `roles_admin` collection where the **Document ID** is your UID.

© 2026 RP Coach-Up | design and developed by 'SK group'
