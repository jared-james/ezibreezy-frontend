// app/(app)/dashboard/page.tsx

export default async function Dashboard() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
      <div className="bg-white p-6 rounded-lg shadow">
        <p className="text-gray-800">Welcome back to your dashboard.</p>
        <p className="mt-2 text-gray-600">
          This is your central hub for content creation. From here, you can
          access your idea dumps, content pipeline, and analytics.
        </p>
      </div>
    </div>
  );
}
