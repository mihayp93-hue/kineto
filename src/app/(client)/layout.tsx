import { ClientSidebar } from "@/components/layout/client-sidebar";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col md:flex-row h-screen md:overflow-hidden">
      <ClientSidebar />
      <main className="relative flex-1 md:overflow-y-auto bg-background min-w-0">
        <div className="pointer-events-none absolute inset-0 bg-dots opacity-30 [mask-image:radial-gradient(ellipse_at_top,black,transparent_60%)]" />
        <div className="relative">{children}</div>
      </main>
    </div>
  );
}
