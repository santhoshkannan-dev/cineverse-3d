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
  title: {
    default: "Cineverse | 3D Movie Ticket Booking Experience",
    template: "%s | Cineverse",
  },
  description:
    "Next-generation 3D cinema booking web app featuring real-time 3D seat selection, cylindrical panorama hero, and cinematic experiences across Indian cities.",
  keywords: [
    "Cineverse",
    "3D Cinema",
    "Movie Booking",
    "Tamil Cinema",
    "Telugu Cinema",
    "3D Seat Selection",
    "Three.js",
  ],
  authors: [{ name: "santhoshkannan007" }],
  openGraph: {
    title: "Cineverse | 3D Movie Ticket Booking Experience",
    description: "Next-generation 3D cinema booking with real-time seat selection and cylindrical panorama hero.",
    type: "website",
    siteName: "Cineverse",
  },
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

