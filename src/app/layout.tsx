import Header from "@/components/Header";
import "./globals.css";
import type { ReactNode } from "react";
import { SessionProviderWrapper } from "@/components/SessionProviderWrapper";

export const metadata = {
  title: "Grab Vocab",
  description: "Vocabulary learning app",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <SessionProviderWrapper>
        <body className="min-h-screen w-screen bg-slate-300 text-[#1F2937] overflow-x-hidden">
          <Header />
          <main className="min-h-screen w-screen bg-slate-300 text-[#1F2937] overflow-x-hidden">
            {children}
          </main>
        </body>
      </SessionProviderWrapper>
    </html>
  );
}
