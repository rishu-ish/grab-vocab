import Header from "@/components/Header";
import "./globals.css";
import type { ReactNode } from "react";
import { SessionProviderWrapper } from "@/components/SessionProviderWrapper";

// app/layout.tsx or app/page.tsx
export const metadata = {
  title: "Grab Vocab",
  description: "Learn new words easily with fun examples and images.",
  openGraph: {
    title: "Grab Vocab",
    description: "Learn new words easily with fun examples and images.",
    url: "https://grab-vocab-1.vercel.app",
    siteName: "GrabVocab",
    images: [
      {
        url: "https://preply.com/wp-content/uploads/2018/04/word.jpg",
        width: 1200,
        height: 630,
        alt: "GrabVocab - Learn Words",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Grab Vocab",
    description: "Learn words in a fun, visual way!",
    images: ["https://preply.com/wp-content/uploads/2018/04/word.jpg"],
    creator: "@YourTwitterHandle", // optional
  },
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
