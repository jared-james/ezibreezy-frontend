// app/(app)/settings/profile/loading.tsx

export default function ProfileSettingsLoading() {
  return (
    <div className="space-y-6">
      <div className="pb-6">
        {/* Section Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="h-6 w-48 bg-neutral-200/60 animate-pulse rounded-sm" />
          <div className="flex-1 h-px bg-border" />
        </div>

        {/* Form Fields */}
        <div className="space-y-4">
          <div>
            <div className="h-3 w-32 bg-neutral-200/60 animate-pulse rounded-sm mb-2" />
            <div className="flex gap-2 items-start pt-2">
              <div className="flex-1 h-10 bg-neutral-200/60 animate-pulse rounded-sm" />
              <div className="h-10 w-28 bg-neutral-300/60 animate-pulse rounded-sm" />
            </div>
            <div className="h-3 w-64 bg-neutral-200/60 animate-pulse rounded-sm mt-2" />
          </div>
          <div>
            <div className="h-3 w-24 bg-neutral-200/60 animate-pulse rounded-sm mb-2" />
            <div className="flex gap-2 items-start pt-2">
              <div className="flex-1 h-10 bg-neutral-200/60 animate-pulse rounded-sm" />
              <div className="h-10 w-28 bg-neutral-300/60 animate-pulse rounded-sm" />
            </div>
            <div className="h-3 w-64 bg-neutral-200/60 animate-pulse rounded-sm mt-2" />
          </div>
        </div>
      </div>
    </div>
  );
}
