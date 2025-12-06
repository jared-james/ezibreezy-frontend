// app/(app)/settings/workspace/loading.tsx

export default function WorkspaceSettingsLoading() {
  return (
    <div className="max-w-4xl space-y-12">
      {/* Header */}
      <div>
        <div className="h-9 w-64 bg-neutral-200/60 animate-pulse rounded-sm mb-6" />
        <div className="flex items-center gap-3 p-3 border border-border">
          <div className="h-10 w-10 bg-neutral-300/60 animate-pulse rounded-sm" />
          <div className="space-y-2 flex-1">
            <div className="h-4 w-32 bg-neutral-200/60 animate-pulse rounded-sm" />
            <div className="h-3 w-48 bg-neutral-200/60 animate-pulse rounded-sm" />
          </div>
        </div>
      </div>

      {/* Form Section */}
      <div className="border border-border p-6 md:p-8 space-y-6 bg-surface">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <div className="h-3 w-32 bg-neutral-200/60 animate-pulse rounded-sm" />
            <div className="h-12 w-full bg-neutral-200/60 animate-pulse rounded-sm" />
          </div>
          <div className="space-y-2">
            <div className="h-3 w-24 bg-neutral-200/60 animate-pulse rounded-sm" />
            <div className="h-12 w-full bg-neutral-200/60 animate-pulse rounded-sm" />
          </div>
        </div>
        <div className="pt-4 border-t border-dashed border-border flex justify-end">
          <div className="h-10 w-32 bg-neutral-300/60 animate-pulse rounded-sm" />
        </div>
      </div>

      {/* Operations Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="border border-border p-6 space-y-4">
          <div className="h-6 w-40 bg-neutral-200/60 animate-pulse rounded-sm" />
          <div className="h-4 w-full bg-neutral-200/60 animate-pulse rounded-sm" />
          <div className="h-10 w-full bg-neutral-200/60 animate-pulse rounded-sm" />
        </div>
        <div className="border border-border p-6 space-y-4">
          <div className="h-6 w-40 bg-neutral-200/60 animate-pulse rounded-sm" />
          <div className="h-4 w-full bg-neutral-200/60 animate-pulse rounded-sm" />
          <div className="h-10 w-full bg-neutral-200/60 animate-pulse rounded-sm" />
        </div>
      </div>

      {/* Danger Zone */}
      <div className="mt-12 border-t-4 border-double border-border pt-8">
        <div className="flex items-start gap-4">
          <div className="h-12 w-12 bg-neutral-200/60 animate-pulse rounded-sm" />
          <div className="flex-1 space-y-3">
            <div className="h-6 w-32 bg-neutral-200/60 animate-pulse rounded-sm" />
            <div className="h-4 w-full max-w-2xl bg-neutral-200/60 animate-pulse rounded-sm" />
            <div className="h-4 w-3/4 bg-neutral-200/60 animate-pulse rounded-sm" />
            <div className="h-10 w-40 bg-neutral-200/60 animate-pulse rounded-sm mt-4" />
          </div>
        </div>
      </div>
    </div>
  );
}
