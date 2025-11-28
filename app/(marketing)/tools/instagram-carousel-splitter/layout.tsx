import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Instagram Carousel Splitter | Seamless Panorama Swipe Tool",
  description:
    "Split your panoramic images into seamless Instagram carousel slides. Free online tool to create perfect swipeable panoramas.",
  openGraph: {
    title: "Instagram Carousel Splitter",
    description: "Create seamless panoramic swipes for Instagram.",
    type: "website",
  },
};

export default function CarouselSplitterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
