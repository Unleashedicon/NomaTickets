import MyNavbar from "../components/navbar";
import MyFooter from "../components/footer";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import { UserfrontProvider } from "@userfront/next/client";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "sonner";
import { UserProvider } from "@/context/useContext"; // 👈 adjust path to your context

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
            <SessionProvider>
              <UserProvider>
                <MyNavbar />

                <main className="pt-0 pb-36 min-h-screen overflow-y-auto">
                  <Toaster richColors position="top-right" />
                  {children}
                </main>

                <MyFooter />
              </UserProvider>
            </SessionProvider>
          </ThemeProvider>
        </UserfrontProvider>
      </body>
    </html>
  );
}
