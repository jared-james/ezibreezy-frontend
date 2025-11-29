// app/(marketing)/tools/social-image-resizer/layout.tsx

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Social Image Resizer | Crop for Insta, Twitter & LinkedIn",
  description:
    "Resize one image for Instagram, Twitter, LinkedIn, and Facebook instantly. Smart multi-platform cropping tool for content creators.",
  openGraph: {
    title: "Social Image Resizer",
    description: "Crop once, export for every social platform.",
    type: "website",
  },
};

export default function ResizerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
