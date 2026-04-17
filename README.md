
# RP Coach-Up Platform

This is a Next.js 15 application powered by Firebase Studio, using AI to match students with teachers and courses.

## 🖼 How to use your own images
1.  **Prepare your images**: Rename your downloaded images to `hero-education.jpg`, `teacher-mentoring.jpg`, and `online-course.jpg`.
2.  **Upload to Project**: Place the files in the `public/images` directory.
3.  **Verify**: The application is configured to look for these files in `public/images` via `src/app/lib/placeholder-images.json`.

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

## 🛠 Troubleshooting Git & Deployment

### 1. "Missing or invalid credentials" (Git Push Error)
If you see `ECONNREFUSED` or credential errors during `git push`:
1. **Set Identity**:
   ```bash
   git config --global user.email "you@example.com"
   git config --global user.name "Your Name"
   ```
2. **Use Token**: Update your remote to include a GitHub Personal Access Token (PAT):
   ```bash
   git remote set-url origin https://YOUR_TOKEN@github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
   git push
   ```

### 2. Missing GEMINI_API_KEY
This app uses AI for matching. You **must** add your API key in the Firebase Console:
1. Go to **App Hosting** dashboard > **Settings > Environment variables**.
2. Add `GEMINI_API_KEY` with your key from Google AI Studio.
3. Check both **Build** and **Runtime** availability.

---

## 🔑 Administrative Access
1. Register on the `/register` page.
2. Get your UID from the **Authentication** tab in Firebase Console.
3. Create a document in the `roles_admin` collection where the **Document ID** is your UID.

© 2026 RP Coach-Up | design and developed by 'SK group'
