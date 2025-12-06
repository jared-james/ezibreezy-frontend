// app/(app)/[workspace]/settings/integrations/loading.tsx

// app/(app)/settings/integrations/loading.tsx

export default function IntegrationsSettingsLoading() {
  return (
    <div>
      {/* Header */}
      <div className="mb-8 border-b-2 border-foreground pb-3">
        <div className="h-8 w-56 bg-neutral-200/60 animate-pulse rounded-sm mb-2" />
        <div className="h-4 w-72 bg-neutral-200/60 animate-pulse rounded-sm" />
      </div>

      {/* Available Channels Section */}
      <div className="mb-8">
        <div className="h-5 w-48 bg-neutral-200/60 animate-pulse rounded-sm mb-4" />
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="aspect-square border border-border p-4 flex flex-col items-center justify-center space-y-3"
            >
              <div className="h-10 w-10 rounded-full bg-neutral-300/60 animate-pulse" />
              <div className="h-4 w-20 bg-neutral-200/60 animate-pulse rounded-sm" />
            </div>
          ))}
        </div>
      </div>

      {/* Connected Channels Section */}
      <div className="mt-8">
        <div className="flex items-center gap-2 mb-4">
          <div className="h-5 w-32 bg-neutral-200/60 animate-pulse rounded-sm" />
          <div className="h-5 w-8 rounded-full bg-neutral-200/60 animate-pulse" />
        </div>

        <div className="border-t border-b border-border divide-y divide-border">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4 p-4 md:px-6">
              <div className="h-10 w-10 rounded-full bg-neutral-300/60 animate-pulse" />
              <div className="h-3 w-3 bg-neutral-200/60 animate-pulse" />
              <div className="h-10 w-10 rounded-full bg-neutral-300/60 animate-pulse" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-40 bg-neutral-200/60 animate-pulse rounded-sm" />
              </div>
              <div className="flex gap-2">
                <div className="h-8 w-20 bg-neutral-200/60 animate-pulse rounded-sm" />
                <div className="h-8 w-24 bg-neutral-200/60 animate-pulse rounded-sm" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
