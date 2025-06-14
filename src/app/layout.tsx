// app/layout.tsx
import Header from "@/components/Header";
import "./globals.css";
import type { ReactNode } from "react";

export const metadata = {
  title: "Grab Vocab",
  description: "Vocabulary learning app",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen w-screen bg-slate-300 text-[#1F2937] overflow-x-hidden">
        <Header />
        <main className="min-h-screen w-screen bg-slate-300 text-[#1F2937] overflow-x-hidden">{children}</main>
      </body>
    </html>
  );
}