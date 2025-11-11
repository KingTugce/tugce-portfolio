import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Tugce S King | Portfolio",
  description:
    "An elegant, playful, interactive portfolio that blends code, product thinking, and game-like exploration.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
      
        className={`${inter.className} bg-slate-950 text-slate-50 min-h-screen antialiased` }
      >
        
        {children}
      </body>
    </html>
  );
}