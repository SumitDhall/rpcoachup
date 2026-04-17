
# RP Coach-Up Platform

This is a Next.js 15 application powered by Firebase Studio, using AI to match students with teachers and courses.

## 🖼 How to use your own images
1.  **Prepare your images**: Rename your downloaded images to `hero-education.jpg`, `teacher-mentoring.jpg`, and `online-course.jpg`.
2.  **Upload to Project**: Place the files in the `public/images` directory.
3.  **Verify**: The application is configured to look for these files in `public/images` via `src/app/lib/placeholder-images.json`.

## 🎨 How to update the Favicon
1.  Generate a `favicon.ico` file (16x16 or 32x32 pixels).
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

### 2. SSH Access Setup (For Git Push Errors)
If you see "Missing or invalid credentials" or `ECONNREFUSED` errors when pushing code:

1.  **Generate a new SSH key**:
    ```bash
    ssh-keygen -t ed25519 -C "your_email@example.com"
    ```
    *(Press Enter for all prompts)*

2.  **Start the SSH agent and add your key**:
    ```bash
    eval "$(ssh-agent -s)"
    ssh-add ~/.ssh/id_ed25519
    ```

3.  **Copy your public key**:
    ```bash
    cat ~/.ssh/id_ed25519.pub
    ```
    *Copy the string and add it to your GitHub account under **Settings > SSH and GPG keys**.*

4.  **Update Git remote**:
    ```bash
    git remote set-url origin git@github.com:YOUR_USERNAME/YOUR_REPO_NAME.git
    git push -u origin main
    ```

---

## 🔑 Administrative Access
1. Register on the `/register` page.
2. Get your UID from the **Authentication** tab in Firebase Console.
3. Create a document in the `roles_admin` collection where the **Document ID** is your UID.

© 2026 RP Coach-Up | design and developed by 'SK group'
