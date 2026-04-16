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

## 🛠 Troubleshooting Build & Rollout Errors

### 1. "GitHub Connection Error"
If the rollout fails at the "Fetch Source" step:
- Go to your **GitHub Settings > Applications**.
- Find **Firebase App Hosting** and click **Configure**.
- Ensure the repository you created is selected in the list of authorized repos.

### 2. Missing Environment Variables
This app uses AI features that require an API key.
1. Go to the **App Hosting** dashboard for your backend.
2. Navigate to **Settings > Environment variables**.
3. Add a new variable:
   - **Key**: `GEMINI_API_KEY`
   - **Value**: Your Google AI Studio API Key.
4. Click **Save** and trigger a new rollout.

### 3. "No buildpack groups passed detection"
This means your GitHub repository is empty. Ensure you have successfully run the `git push` command from the terminal in this editor.

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
