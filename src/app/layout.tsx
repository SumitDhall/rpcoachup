
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DanceVerse | Your Rhythm, Your Universe",
  description: "The rhythmic heart of your dance universe.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased bg-background text-foreground min-h-screen" suppressHydrationWarning>
        <div className="flex min-h-screen w-full">
          <main className="flex-1 flex flex-col overflow-auto bg-[radial-gradient(circle_at_center,rgba(82,168,255,0.05),transparent_70%)]">
            <div className="flex-1">
              {children}
            </div>
          </main>
        </div>
      </body>
    </html>
  );
}
