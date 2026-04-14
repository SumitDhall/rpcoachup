
"use client"

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { signOut } from 'firebase/auth';
import { useAuth } from '@/firebase';
import { Loader2 } from 'lucide-react';

/**
 * A dedicated page to handle user sign-out and session clearing.
 * This ensures the Firebase session is completely removed from the client.
 */
export default function LogoutPage() {
  const auth = useAuth();
  const router = useRouter();

  useEffect(() => {
    const performLogout = async () => {
      try {
        await signOut(auth);
        // Clear any local caches if necessary (Firebase SDK handles most of this)
        router.push('/login');
      } catch (error) {
        console.error("Logout failed:", error);
        router.push('/');
      }
    };

    performLogout();
  }, [auth, router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="text-muted-foreground animate-pulse font-medium">Deleting session and signing out...</p>
      </div>
    </div>
  );
}
