import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Instagram Grid Maker | Profile Grid Splitter Tool",
  description:
    "Split your photos into a 3x3, 2x3, or custom grid for your Instagram profile. Free online tool with gap compensation for perfect alignment.",
  openGraph: {
    title: "Instagram Grid Maker",
    description: "Create aesthetic 3x3 grids for your Instagram profile.",
    type: "website",
  },
};

export default function GridMakerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
