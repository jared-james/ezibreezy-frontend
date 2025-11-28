import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Instagram Grid Planner | Drag & Drop Feed Preview",
  description:
    "Plan your Instagram feed visually. Upload photos, drag to reorder, and curate your grid before you post. Free online tool with local saving.",
  openGraph: {
    title: "Instagram Grid Planner",
    description: "Visual drag-and-drop planner for your Instagram feed.",
    type: "website",
  },
};

export default function GridPlannerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
