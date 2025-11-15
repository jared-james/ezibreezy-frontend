import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/auth/login");
  }

  return (
    <div>
      <header className="bg-white shadow-sm">
        <nav className="container mx-auto px-4 py-3 flex justify-between items-center">
          <Link href="/dashboard" className="font-bold text-xl text-gray-800">
            ezibreezy
          </Link>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">{user.displayName}</span>
            <form action="/auth/signout" method="post">
              <button
                type="submit"
                className="text-sm font-medium text-gray-700 hover:text-red-600 transition-colors"
              >
                Sign Out
              </button>
            </form>
          </div>
        </nav>
      </header>
      <main className="container mx-auto p-4">{children}</main>
    </div>
  );
}
