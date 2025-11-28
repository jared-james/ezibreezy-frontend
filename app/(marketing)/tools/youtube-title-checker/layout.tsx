import { Metadata } from "next";

export const metadata: Metadata = {
  title: "YouTube Title Checker | CTR Optimization Tool",
  description:
    "Analyze your YouTube video titles for truncation and click-through rate. Preview how your video appears in search results and mobile feeds.",
  openGraph: {
    title: "YouTube Title Checker",
    description: "Optimize your YouTube titles for maximum CTR.",
    type: "website",
  },
};

export default function TitleCheckerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
