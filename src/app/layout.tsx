import type { Metadata } from "next";
import { Inter, Fraunces } from "next/font/google";
import "./globals.css";
import { StoreProvider } from "@/lib/store";
import { ToastProvider } from "@/lib/ToastContext";
import Sidebar from "@/components/Sidebar";
import DemoBanner from "@/components/DemoBanner";
import SearchModal from "@/components/SearchModal";
import ThemeApplier from "@/components/ThemeApplier";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const fraunces = Fraunces({ subsets: ["latin"], variable: "--font-newsreader" });

export const metadata: Metadata = {
  title: "StudyLens | Your Personalized Knowledge Map",
  description: "A learning diagnostic tool that turns your study material into a targeted review plan.",
  icons: {
    icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">🧠</text></svg>'
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${fraunces.variable} font-sans antialiased bg-background text-ink flex h-screen overflow-hidden`}>
        <StoreProvider>
          <ThemeApplier />
          <ToastProvider>
            <div className="flex h-full w-full flex-col md:flex-row">
              <Sidebar />
              <main className="flex-1 overflow-y-auto pb-20 md:pb-0 flex flex-col">
                <DemoBanner />
                <div className="max-w-[1100px] mx-auto p-4 md:p-8 w-full flex-1">
                  {children}
                </div>
              </main>
            </div>
            <SearchModal />
          </ToastProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
