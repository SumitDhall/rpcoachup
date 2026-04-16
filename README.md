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

## 🛠 Troubleshooting Rollout Errors

### 1. "Invalid apphosting.yaml"
If you see this error, ensure your `apphosting.yaml` matches the simplified version currently in the project. We recommend managing environment variables via the Firebase Console UI rather than the YAML file to avoid formatting issues.

### 2. Missing GEMINI_API_KEY (AI Features)
This app uses AI for matching and notifications. You **must** add your API key:
1. Go to **App Hosting** dashboard for your backend.
2. Navigate to **Settings > Environment variables**.
3. Click **Add variable**:
   - **Variable path**: `GEMINI_API_KEY`
   - **Value**: [Your Google AI Studio API Key]
   - **Availability**: Check both **Build** and **Runtime**.
4. Click **Save** and trigger a **New Rollout**.

### 3. "No buildpack groups passed detection"
This means your GitHub repository is empty or the files are in a subfolder.
- Ensure you ran the `git push` commands in **Phase 1**.
- Check your GitHub repo URL to verify `package.json` is visible in the root folder.

### 4. "GitHub Connection Error"
- Go to your **GitHub Settings > Applications**.
- Find **Firebase App Hosting** and click **Configure**.
- Ensure the repository you created is selected in the list of authorized repos.

---

## 🔑 Administrative Access
1. Register on the `/register` page.
2. Get your UID from the **Authentication** tab in Firebase Console.
3. Create a document in the `roles_admin` collection where the **Document ID** is your UID.
