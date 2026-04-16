# RP Coach-Up Platform

This is a Next.js 15 application powered by Firebase Studio, using AI to match students with teachers and courses.

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

## 🛠 Troubleshooting Build Errors

If you see **"An error occurred in your build"** or **"Error creating rollout"**:

1. **Check the Logs**:
   - In the App Hosting dashboard, click on the failed rollout.
   - Click the link **"View Cloud Build logs"**. This will open Google Cloud Console and show you the exact error (e.g., a missing environment variable or a code error).
2. **Missing Secrets**:
   - If your build uses API keys (like `GEMINI_API_KEY`), you must add them in **App Hosting > [Your Backend] > Settings > Environment variables**.
3. **Red Bar Error**:
   - If "Create rollout" gives a red error bar, try refreshing the page or checking if your GitHub connection is still active in the **Project Settings > Integrations** tab.

---

## 🔑 Custom Domain Setup (rpcoachup.com)

1. Go to **App Hosting > [Your Backend] > Settings > Custom Domains**.
2. **Step 1**: Add the **TXT record** to your domain registrar.
3. **Step 2**: Once verified, **click the domain name** to see the **two A records** (IP addresses). Add these to your registrar.
4. **Wait**: The status will show **"Minting certificate"**. This can take up to 24 hours.

## 🔑 Administrative Access
1. Register on the `/register` page.
2. Get your UID from the **Authentication** tab in Firebase Console.
3. Create a document in the `roles_admin` collection where the **Document ID** is your UID.
