// app/(app)/[workspace]/assets/labels/page.tsx

import { Tag } from "lucide-react";

// Labels are frequently edited - force dynamic rendering
export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ workspace: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function LabelsPage({ params }: PageProps) {
  const { workspace: workspaceId } = await params;

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[--background] px-4">
      <div className="text-center space-y-6 max-w-2xl">
        <div className="border-b-4 border-double border-[--foreground] pb-4">
          <p className="eyebrow mb-2">Assets & Categorization</p>
          <h1 className="font-serif text-4xl md:text-5xl font-bold uppercase tracking-tight text-[--foreground]">
            Labels (Coming Soon)
          </h1>
        </div>

        <div className="flex items-center justify-center text-[--muted]">
          <Tag className="w-10 h-10" />
        </div>

        <p className="font-serif text-[--muted] italic text-lg leading-relaxed">
          Define and manage post labels (e.g., "Evergreen," "Promotion," "Series
          1") for better content categorization, filtering, and reporting.
        </p>

        {/* Debug info - remove in production */}
        {process.env.NODE_ENV === "development" && workspaceId && (
          <p className="text-xs text-[--muted-foreground] font-mono">
            Workspace: {workspaceId}
          </p>
        )}
      </div>
    </div>
  );
}
