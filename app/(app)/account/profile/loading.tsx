// app/(app)/settings/profile/loading.tsx

export default function ProfileSettingsLoading() {
  return (
    <div className="w-full max-w-5xl mx-auto pb-16">
      <div className="space-y-12">
        {/* Personal Information Section */}
        <section>
          <div className="max-w-2xl mb-8">
            <div className="h-7 w-48 bg-neutral-200/60 animate-pulse rounded-sm mb-2" />
            <div className="h-4 w-96 bg-neutral-200/60 animate-pulse rounded-sm" />
          </div>
          <div className="space-y-8 max-w-3xl">
            <div className="space-y-4">
              <div className="h-3 w-24 bg-neutral-200/60 animate-pulse rounded-sm" />
              <div className="border-b border-border pb-2">
                <div className="h-8 w-full bg-neutral-200/60 animate-pulse rounded-sm" />
              </div>
            </div>
            <div className="space-y-4">
              <div className="h-3 w-32 bg-neutral-200/60 animate-pulse rounded-sm" />
              <div className="border-b border-border pb-2">
                <div className="h-8 w-full bg-neutral-200/60 animate-pulse rounded-sm" />
              </div>
            </div>
          </div>
        </section>

        {/* Separator */}
        <div className="w-full border-t border-dashed border-border" />

        {/* Security Section */}
        <section>
          <div className="max-w-2xl mb-8">
            <div className="h-7 w-32 bg-neutral-200/60 animate-pulse rounded-sm mb-2" />
            <div className="h-4 w-80 bg-neutral-200/60 animate-pulse rounded-sm" />
          </div>
          <div className="space-y-8 max-w-3xl">
            <div className="space-y-4">
              <div className="h-3 w-20 bg-neutral-200/60 animate-pulse rounded-sm" />
              <div className="border-b border-border pb-2">
                <div className="h-8 w-full bg-neutral-200/60 animate-pulse rounded-sm" />
              </div>
            </div>
          </div>
        </section>

        {/* Delete Account Section */}
        <section className="border-t border-dashed border-border pt-12">
          <div className="max-w-2xl mb-8">
            <div className="h-7 w-40 bg-neutral-200/60 animate-pulse rounded-sm mb-2" />
            <div className="h-4 w-96 bg-neutral-200/60 animate-pulse rounded-sm" />
          </div>
          <div className="max-w-3xl">
            <div className="h-9 w-40 bg-neutral-200/60 animate-pulse rounded-sm" />
          </div>
        </section>
      </div>
    </div>
  );
}
