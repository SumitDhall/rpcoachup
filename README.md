
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

### 1. SSH Access Setup (Recommended)
If you see "Missing or invalid credentials" or `ECONNREFUSED` errors, SSH is the most reliable way to push your code.

1.  **Generate a new SSH key**:
    In the terminal, run:
    ```bash
    ssh-keygen -t ed25519 -C "your_email@example.com"
    ```
    *(Press Enter for all prompts to use default settings)*

2.  **Start the SSH agent and add your key**:
    ```bash
    eval "$(ssh-agent -s)"
    ssh-add ~/.ssh/id_ed25519
    ```

3.  **Copy your public key**:
    ```bash
    cat ~/.ssh/id_ed25519.pub
    ```
    *Copy the long string starting with `ssh-ed25519`.*

4.  **Add the key to GitHub**:
    - Go to your GitHub **Settings**.
    - Click **SSH and GPG keys** in the sidebar.
    - Click **New SSH key**, give it a title (e.g., "Firebase Studio"), and paste your key.

5.  **Change your Git remote to use SSH**:
    ```bash
    git remote set-url origin git@github.com:YOUR_USERNAME/YOUR_REPO_NAME.git
    ```

6.  **Push your code**:
    ```bash
    git push -u origin main
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
