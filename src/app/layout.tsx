import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { FirebaseClientProvider } from '@/firebase/client-provider';

export const metadata: Metadata = {
  title: 'RP Coach-Up | Empowering Learning',
  description: 'A professional educational platform connecting students and teachers through AI-powered matching.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased bg-background text-foreground min-h-screen relative" suppressHydrationWarning>
        <FirebaseClientProvider>
          {children}
          <Toaster />
          <div className="fixed bottom-2 right-4 text-[10px] text-muted-foreground/40 pointer-events-none select-none z-[9999] font-medium italic">
            design and developed by 'SK group'
          </div>
        </FirebaseClientProvider>
      </body>
    </html>
  );
}
