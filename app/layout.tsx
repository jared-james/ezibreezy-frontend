// app/layout.tsx

import type { Metadata } from "next";
import { Libre_Caslon_Text } from "next/font/google";
import "./globals.css";
import Providers from "./client-providers";
import { Toaster } from "@/components/ui/sonner";

const libreCaslon = Libre_Caslon_Text({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-serif",
});

export const metadata: Metadata = {
  title: "EziBreezy",
  description:
    "EziBreezy helps you think through what you want to say, capture it quickly, and turn it into posts without social feeling like a second or third full-time job.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={libreCaslon.variable}>
      <body>
        <Providers>{children}</Providers>
        <Toaster />
      </body>
    </html>
  );
}
