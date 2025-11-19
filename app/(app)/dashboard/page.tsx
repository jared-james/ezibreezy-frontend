// app/(app)/dashboard/page.tsx

export default function DashboardPage() {
  return (
    <div className="w-full flex items-center justify-center bg-[--background] px-4">
      <div className="text-center space-y-6">
        <div className="border-b-4 border-double border-[--foreground] pb-4">
          <p className="eyebrow mb-2">Dashboard</p>
          <h1 className="font-serif text-4xl md:text-5xl font-bold uppercase tracking-tight text-[--foreground]">
            Coming Soon
          </h1>
        </div>

        <p className="font-serif text-[--muted] italic text-lg">
          Your command center for ideas, posts, analytics and insights.
        </p>
      </div>
    </div>
  );
}
