import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Screenshot Studio | Mockup Generator",
  description:
    "Wrap raw screenshots in aesthetic backgrounds. Add shadows, rounded corners, and padding to create professional image cards for social media.",
  openGraph: {
    title: "Screenshot Studio",
    description: "Create professional mockups from your screenshots instantly.",
    type: "website",
  },
};

export default function ScreenshotStudioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
