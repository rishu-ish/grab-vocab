"use client";
import Header from "@/components/Header";
import "./globals.css";
import type { ReactNode } from "react";
import { SessionProviderWrapper } from "@/components/SessionProviderWrapper";
import "@/theme/theme.css";
import { useState, useEffect } from "react";
import { FaMoon, FaSun } from "react-icons/fa";

export default function RootLayout({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    // Check for saved theme in localStorage
    const savedTheme = localStorage.getItem("theme") || "light";
    setTheme(savedTheme);
    document.documentElement.setAttribute("data-theme", savedTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
  };

  return (
    <html lang="en" data-theme={theme}>
      <head>
        {/* iOS PWA support */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta
          name="apple-mobile-web-app-status-bar-style"
          content="black-translucent"
        />
        <link rel="apple-touch-icon" href="/icon-192.png" />
      </head>
      <SessionProviderWrapper>
        <body
          className="min-h-screen w-screen overflow-x-hidden"
          style={{ background: "var(--background-gradient)" }}
        >
          <Header />
          {/* <button
            onClick={toggleTheme}
            className="absolute top-4 right-4 p-3 rounded-full border shadow transition-all duration-300 ease-in-out"
            style={{
              backgroundColor: "var(--card-bg)",
              color: "var(--primary-text-color)",
              borderColor: "var(--border-color)",
              transform: "scale(1)",
            }}
            onMouseDown={(e) =>
              (e.currentTarget.style.transform = "scale(0.9)")
            }
            onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
            aria-label="Toggle Theme"
          >
            {theme === "light" ? <FaMoon size={18} /> : <FaSun size={18} />}
          </button> */}
          <main className=" w-screen main-container">{children}</main>
        </body>
      </SessionProviderWrapper>
    </html>
  );
}
