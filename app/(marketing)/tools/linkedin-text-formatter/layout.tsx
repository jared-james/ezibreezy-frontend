import { Metadata } from "next";

export const metadata: Metadata = {
  title: "LinkedIn Text Formatter | Unicode Font Generator",
  description:
    "Convert standard text into bold, italic, serif, or script Unicode characters for LinkedIn posts. Highlight key points and stop the scroll.",
  openGraph: {
    title: "LinkedIn Text Formatter",
    description: "Format your LinkedIn posts with bold and italic text.",
    type: "website",
  },
};

export default function TextFormatterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
