import { AdminSidebar } from "@/components/layout/admin-sidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col md:flex-row h-screen md:overflow-hidden">
      <AdminSidebar />
      <main className="flex-1 md:overflow-y-auto bg-slate-50 min-w-0">
        {children}
      </main>
    </div>
  );
}
