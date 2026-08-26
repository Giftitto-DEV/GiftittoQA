import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Giftitto — Giftcards",
  description: "Compra giftcards mock para evaluación QA",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-zinc-50">
        <Navbar />
        <main className="flex-1">{children}</main>
        <footer className="border-t bg-white py-4 text-center text-xs text-zinc-500">Giftitto — sitio demo para evaluación QA</footer>
      </body>
    </html>
  );
}
