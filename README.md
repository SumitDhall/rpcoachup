
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
2.  **Sender Address**: Ensure the **"Default FROM address"** in the extension settings is set to `support@rpcoachup.com` or matches your SMTP account exactly.
3.  **SMTP URI**: Your URI should look like `smtps://support@rpcoachup.com:YOUR_PASSWORD@mail.privateemail.com:465`.

#### 🛠 How to see why emails are failing:
If notifications appear in the Admin Portal but you don't receive emails:
1.  Go to the **Firebase Console**.
2.  Select **Extensions** from the left sidebar.
3.  Find **Trigger Email from Firestore** and click **Manage**.
4.  Click **View extension logs** in the bottom right.
5.  Search for "Error" in the logs. Common errors include:
    - `Invalid login`: Your SMTP password or URI is incorrect.
    - `Mail command failed: 550 Sender address rejected`: You must add `from: "support@rpcoachup.com"` to the email document (this is already handled in the latest code update).
    - `Connection timeout`: Ensure you are using port **465** for `smtps` or **587** for `smtp`.

## 🖼 How to use your own images
1.  **Prepare your images**: Rename your downloaded images to `hero-education.jpg`, `teacher-mentoring.jpg`, and `online-course.jpg`.
2.  **Upload to Project**: Place the files in the `public/images` directory.
3.  **Verify**: The application is configured to look for these files in `public/images` via `src/app/lib/placeholder-images.json`.

## 🎨 How to update the Favicon
1.  Generate a `favicon.ico` file (16x16 or 32x32 pixels) using your logo.
2.  Place the file in the `public/` folder.
3.  Next.js will automatically use this file as the browser tab icon.

## 🚀 Step-by-Step Deployment Guide (App Hosting)

This app uses **Firebase App Hosting** for Next.js SSR support.

### Phase 1: Push Code to GitHub
1. Open the **Terminal** in this editor (Terminal > New Terminal).
2. Run these commands:
   ```bash
   git init
   git add .
   git commit -m "Initial commit of RP Coach-Up"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
   git push -u origin main
   ```

### Phase 2: Set up App Hosting
1. Go to **App Hosting** in the Firebase Console and click "Get Started".
2. Connect your GitHub repository.
3. **Deployment settings**: Root directory `/`, Live branch `main`.
4. **Backend**: Give it a name like `rp-coach-up`.
5. **Associate App**: Select your Firebase Web App.

---

## 🛠 Troubleshooting Build & Deployment

### 1. Missing GEMINI_API_KEY (CRITICAL)
If your build fails, it is likely because the environment variable is missing. 
1. Go to **App Hosting** dashboard in Firebase Console.
2. Select your backend > **Settings > Environment variables**.
3. Add `GEMINI_API_KEY` with your key from Google AI Studio.
4. **Important**: Ensure availability is checked for both **Build** and **Runtime**.
5. Trigger a new rollout.

---

## 🔑 Administrative Access
1. Register on the `/register` page.
2. Get your UID from the **Authentication** tab in Firebase Console.
3. Create a document in the `roles_admin` collection where the **Document ID** is your UID.

© 2026 RP Coach-Up | design and developed by 'SK group'
