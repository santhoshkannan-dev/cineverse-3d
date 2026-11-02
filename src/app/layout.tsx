import "./globals.css";
import type { Metadata } from "next";
import { Anton, Inter } from "next/font/google";
import Navbar from "@/components/Navbar";
import SearchModal from "@/components/SearchModal";
import ToastListener from "@/components/ToastListener";
import SmoothScrollProvider from "@/components/SmoothScrollProvider";

const anton = Anton({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-anton",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-geist-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Cineverse - Book the experience",
  description: "A cinematic movie ticket booking experience for Tamil, Telugu and Indian cinema.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${anton.variable} ${inter.variable} antialiased`}>
      <head>
        <link rel="preconnect" href="https://www.youtube.com" />
        <link rel="preconnect" href="https://i.ytimg.com" />
        <link rel="preconnect" href="https://img.youtube.com" />
      </head>
      <body className="min-h-dvh bg-ink text-white font-sans selection:bg-gold selection:text-black">
        <SmoothScrollProvider>
          <Navbar />
          <SearchModal />
          <ToastListener />
          {children}
        </SmoothScrollProvider>
      </body>
    </html>
  );
}

