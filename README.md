# RP Coach-Up Platform

This is a Next.js application powered by Firebase Studio, using AI to match students with teachers and courses.

## 🚀 Deployment Guide (IMPORTANT)

### 1. App Hosting vs. Hosting
Because this is a Next.js app with dynamic server features, it uses **Firebase App Hosting**, not the traditional static "Firebase Hosting". 

- **Traditional Hosting (`*.web.app`)**: This will show "Site Not Found" because your app is not a static site.
- **App Hosting URL**: Once your build completes, you will get a new URL (e.g., `https://<random-id>.<region>.hosted.app`).

### 2. How to Deploy
1. **Connect GitHub**: In the Firebase Console, go to **App Hosting** (in the left sidebar, under "Build").
2. **Create Backend**: Click "Get Started" or "Create Backend" and connect your GitHub repository.
3. **Automatic Builds**: Every time you push code to your `main` branch, Firebase will:
   - Detect the change.
   - Run `npm run build`.
   - Provision a server environment for Next.js.
   - Deploy your app to a live URL.

### 3. Monitoring Progress
If your site isn't showing up yet:
- Go to the **App Hosting** dashboard in the Firebase Console.
- Click on your backend.
- Check the **"Rollouts"** tab. If a build is "In Progress", wait for it to finish. If it "Failed", click on it to see the error logs.

---

## 🔑 Custom Domain Setup (e.g., rpcoachup.com)
If you want to use your own domain, follow these steps in the **Firebase Console** under **App Hosting > [Your Backend] > Settings > Custom Domains**:

#### Step 1: Verification (TXT Record)
- Add your domain. Firebase will provide a **TXT record**.
- Add this record to your domain registrar (GoDaddy, Namecheap, etc.).
- **Wait**: Verification can take 5-60 minutes.

#### Step 2: Pointing to the App (A Records)
- Once verified, the status will change. **Click on your domain name** in the list to reveal the **A records** (IP addresses).
- Add both as **A records** in your domain registrar's DNS settings.

#### Step 3: SSL Provisioning (Minting Certificate)
- Status will show **"Minting certificate"**. 
- **Wait**: This takes up to **24 hours**. Your site will be "Connected" once finished.

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
