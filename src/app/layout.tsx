import MyNavbar from "../components/navbar";
import MyFooter from "../components/footer";
import "./globals.css";
import { ThemeProvider } from 'next-themes';
import { UserfrontProvider } from "@userfront/next/client";
import { SessionProvider } from "next-auth/react";
import { Toaster } from 'sonner';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-white text-black dark:bg-black dark:text-white">
        <UserfrontProvider tenantId={process.env.NEXT_PUBLIC_USERFRONT_WORKSPACE_ID}>
          <ThemeProvider attribute="class">
            <MyNavbar />

            {/* 👇 Main content area now scrollable and has padding for fixed header/footer */}
            <main className="pt-0 pb-36 min-h-screen overflow-y-auto">
<SessionProvider>
  <Toaster richColors position="top-right" />
  {children}
</SessionProvider>
            </main>

            <MyFooter />
          </ThemeProvider>
        </UserfrontProvider>
      </body>
    </html>
  );
}
