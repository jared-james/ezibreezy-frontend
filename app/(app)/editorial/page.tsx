// app/(app)/editorial/page.tsx

"use client";

import { useEffect } from "react";
import { useEditorialDraftStore } from "@/lib/store/editorial/draft-store";
import { usePublishingStore } from "@/lib/store/editorial/publishing-store";
import { useEditorialUIStore } from "@/lib/store/editorial/ui-store";
import EditorialCore from "@/components/post-editor";

export default function EditorialPage() {
  const resetDraft = useEditorialDraftStore((state) => state.resetDraft);
  const resetPublishing = usePublishingStore((state) => state.resetPublishing);
  const resetUI = useEditorialUIStore((state) => state.resetUI);

  useEffect(() => {
    // Note: Previous "draft" initialization logic is removed as the passing mechanism
    // needs to be updated to write directly to these stores from the source (Ideas page)
    // or via URL parameters.

    return () => {
      resetDraft();
      resetPublishing();
      resetUI();
    };
  }, [resetDraft, resetPublishing, resetUI]);

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col">
      <div className="mb-8 border-b-4 border-double pb-6 shrink-0">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="eyebrow mb-2">The Workroom</p>
            <h1 className="font-serif text-4xl font-bold uppercase tracking-tight md:text-5xl">
              Editorial Desk
            </h1>
          </div>
        </div>
      </div>
      <EditorialCore mode="editorial" />
    </div>
  );
}
