# RP Coach-Up Platform

This is a Next.js application powered by Firebase Studio, using AI to match students with teachers and courses.

## Setting Up an Administrator

Administrative access is managed via a "sentinel" collection in Firestore called `roles_admin`. A user is considered an admin if a document exists at `/roles_admin/{uid}`, where `{uid}` is their Firebase Authentication ID.

### How to add an Admin:

1. **Create an Account**: Register a standard user account on the `/register` page.
2. **Get the UID**:
   - Go to the [Firebase Console](https://console.firebase.google.com/).
   - Navigate to **Authentication** > **Users**.
   - Copy the **User UID** for your account.
3. **Grant Permissions**:
   - Navigate to **Firestore Database**.
   - Create a collection named `roles_admin`.
   - Create a document with the **Document ID** set to the UID you copied.
   - Add a field (e.g., `isAdmin: true`).
4. **Login**: Go to the `/login` page. Upon successful authentication, the app will recognize you as an admin and redirect you to the `/admin` dashboard.

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS + ShadCN UI
- **Database**: Cloud Firestore
- **Auth**: Firebase Authentication
- **AI**: Google Genkit (Gemini 2.5 Flash)