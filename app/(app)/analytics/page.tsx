// app/(app)/analytics/page.tsx

export default function AnalyticsPage() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[--background] px-4">
      <div className="text-center space-y-6 max-w-2xl">
        <div className="border-b-4 border-double border-[--foreground] pb-4">
          <p className="eyebrow mb-2">Performance Insights</p>
          <h1 className="font-serif text-4xl md:text-5xl font-bold uppercase tracking-tight text-[--foreground]">
            Analytics Coming Soon
          </h1>
        </div>

        <p className="font-serif text-[--muted] italic text-lg leading-relaxed">
          Soon you’ll be able to review audience behavior, platform impact,
          engagement patterns, and performance across every channel — all in one
          place.
        </p>
      </div>
    </div>
  );
}
