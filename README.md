# RP Coach-Up Platform

This is a Next.js 15 application powered by Firebase Studio, using AI to match students with teachers and courses.

## 🚀 Step-by-Step Deployment Guide (App Hosting)

Because this is a Next.js app with dynamic features, it uses **Firebase App Hosting**. Follow these steps to get your app live on your own URL or custom domain.

### Phase 1: Push Code to GitHub
Before starting the Firebase setup, your code must be in a GitHub repository:
1. Create a new repository on [GitHub](https://github.com/new). Do not initialize it with a README.
2. Open your terminal in the root folder of this project.
3. Run the following commands:
   ```bash
   git init
   git add .
   git commit -m "Initial commit of RP Coach-Up"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
   git push -u origin main
   ```

### Phase 2: Set up App Hosting (The 5-Step Process)

Go to the **App Hosting** dashboard in the Firebase Console and click "Get Started".

#### 1. Choose a primary region
- Select the region closest to your users (e.g., `us-central1`).

#### 2. Import a GitHub repository
- Click **Connect to GitHub**.
- Authenticate and select the repository you created in Phase 1.

#### 3. Deployment settings
- **Root directory**: Leave as `/` (default).
- **Live channel**: Set to `main`.
- **Automatic deployments**: Leave enabled so every push to GitHub updates your site.

#### 4. Configure your backend
- **Backend ID**: Give it a name (e.g., `rp-coach-up`).
- This will create a service account and the necessary cloud resources.

#### 5. Associate a Firebase web app
- Select your existing web app from the dropdown. 
- Ensure the **App ID** matches the one in your `src/firebase/config.ts`.

---

## 🔑 Custom Domain Setup (rpcoachup.com)

Once your App Hosting backend is created and the first "Rollout" is successful:

1. Go to **App Hosting > [Your Backend] > Settings > Custom Domains**.
2. **Add Domain**: Enter `rpcoachup.com`.
3. **Verification (Step 1)**: Firebase will give you a **TXT record**. Add this to your domain registrar (GoDaddy, etc.).
4. **Setup (Step 2)**: Once verified, **click the domain name** in the list. It will reveal **two A records** (IP addresses). Add these to your domain registrar.
5. **Wait**: The status will show **"Minting certificate"**. This can take up to 24 hours. Your site is live when it says "Connected".

---

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
