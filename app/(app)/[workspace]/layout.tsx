import { ReactNode } from "react";

interface WorkspaceLayoutProps {
  children: ReactNode;
  params: Promise<{ workspace: string }>;
}

export default async function WorkspaceLayout({
  children,
}: WorkspaceLayoutProps) {
  return <div className="p-8 h-full">{children}</div>;
}
