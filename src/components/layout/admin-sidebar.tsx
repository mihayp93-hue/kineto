"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Activity,
  Dumbbell,
  Users,
  BarChart3,
  Settings,
  LogOut,
  Home,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

const navItems = [
  { href: "/admin", label: "Panou principal", icon: Home },
  { href: "/admin/exercises", label: "Exerciții", icon: Dumbbell },
  { href: "/admin/clients", label: "Pacienți", icon: Users },
  { href: "/admin/analytics", label: "Analize", icon: BarChart3 },
  { href: "/admin/settings", label: "Setări", icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <aside className="w-64 border-r bg-white flex flex-col h-full">
      <div className="p-6 border-b">
        <Link href="/admin" className="flex items-center gap-2">
          <Activity className="h-7 w-7 text-primary" />
          <span className="text-xl font-bold">PhysioConnect</span>
        </Link>
        <p className="text-xs text-muted-foreground mt-1">Panou administrator</p>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/admin" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t">
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-muted-foreground"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4" />
          Deconectare
        </Button>
      </div>
    </aside>
  );
}
