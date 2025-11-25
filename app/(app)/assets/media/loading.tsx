// app/(app)/assets/media/loading.tsx

export default function MediaRoomLoading() {
  return (
    <div className="flex flex-col h-full">
      <div className="b-4 pb-6 mb-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="h-4 w-16 bg-neutral-200/60 animate-pulse rounded-sm mb-2" />
            <div className="h-10 w-48 bg-neutral-200/60 animate-pulse rounded-sm" />
          </div>
          <div className="flex gap-2">
            <div className="h-10 w-32 bg-neutral-200/60 animate-pulse rounded-sm" />
            <div className="h-10 w-32 bg-neutral-200/60 animate-pulse rounded-sm" />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 -300 mb-4 overflow-hidden">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="h-9 w-24 bg-neutral-200/60 animate-pulse rounded-t-sm  "
          />
        ))}
      </div>

      <div className="h-12 w-full bg-neutral-100/50 animate-pulse rounded-sm mb-4" />

      <div className="flex-1 overflow-hidden">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
          {Array.from({ length: 24 }).map((_, i) => (
            <div
              key={i}
              className="aspect-square bg-neutral-200/60 animate-pulse rounded-sm"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
