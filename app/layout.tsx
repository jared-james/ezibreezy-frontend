import type { Metadata, Viewport } from "next";
import { Libre_Caslon_Text } from "next/font/google";
import "./globals.css";
import Providers from "./client-providers";
import { Toaster } from "@/components/ui/sonner";

const libreCaslon = Libre_Caslon_Text({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-serif",
});

export const viewport: Viewport = {
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || "https://www.ezibreezy.com"
  ),
  title: {
    default: "EziBreezy | The Editorial Desk for Social Media",
    template: "%s | EziBreezy",
  },
  description:
    "EziBreezy is the editorial workspace for creators. Draft, visualize, and schedule content for Instagram, LinkedIn, and X without the spreadsheet chaos.",
  keywords: [
    "social media scheduler",
    "instagram font generator",
    "instagram caption generator",
    "content calendar template",
    "instagram grid planner",
    "social media content planner",
    "linkedin text formatter",
    "auto publish instagram",
  ],
  authors: [{ name: "EziBreezy Team", url: "https://www.ezibreezy.com" }],
  creator: "EziBreezy",
  applicationName: "EziBreezy",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://www.ezibreezy.com",
    title: "EziBreezy | The Editorial Desk for Social Media",
    description:
      "Draft, visualize, and schedule content for Instagram, LinkedIn, and X without the spreadsheet chaos.",
    siteName: "EziBreezy",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "EziBreezy Editorial Desk",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "EziBreezy | The Editorial Desk for Social Media",
    description:
      "Draft, visualize, and schedule content for Instagram, LinkedIn, and X without the spreadsheet chaos.",
    creator: "@ezibreezy_app",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "google-site-verification-code",
  },
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
