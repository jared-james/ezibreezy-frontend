// app/(marketing)/layout.tsx
// Marketing layout - no auth required, no sidebar

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
