import { requireAuth } from "@/lib/auth/check";
import { logout } from "@/app/actions/auth";
import Sidebar from "@/components/sidebar";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireAuth();

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
          <div className="flex-1" />

          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">{user.email}</span>
            <form action={logout}>
              <button
                type="submit"
                className="text-sm font-medium text-gray-700 hover:text-red-600 transition-colors"
              >
                Sign Out
              </button>
            </form>
          </div>
        </header>

        <main className="flex-1 overflow-auto">
          <div className="p-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
