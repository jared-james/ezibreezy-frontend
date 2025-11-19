// FILE: app\(app)\editorial\page.tsx

"use client";

import { useEffect } from "react";
import { useEditorialStore } from "@/lib/store/editorial-store";
import EditorialCore from "./components/editorial-core";

export default function EditorialPage() {
  const draft = useEditorialStore((state) => state.draft);
  const initializeFromDraft = useEditorialStore(
    (state) => state.initializeFromDraft
  );
  const setState = useEditorialStore((state) => state.setState);
  const reset = useEditorialStore((state) => state.reset);

  useEffect(() => {
    if (draft) {
      initializeFromDraft(draft);
      setState({ draft: null });
    }

    return () => {
      reset();
    };
  }, [draft, initializeFromDraft, setState, reset]);

  return (
    <div className="mx-auto flex h-full w-full max-w-7xl flex-col p-4 md:p-6">
      <div className="mb-8 border-b-4 border-[--foreground] border-double pb-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="eyebrow mb-2">The Workroom</p>
            <h1 className="font-serif text-4xl font-bold uppercase tracking-tight text-[--foreground] md:text-5xl">
              Editorial Desk
            </h1>
          </div>
        </div>
      </div>
      <EditorialCore />
    </div>
  );
}
