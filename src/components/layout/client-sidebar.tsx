"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Activity,
  Dumbbell,
  Calendar,
  TrendingUp,
  MessageSquare,
  User,
  LogOut,
  Home,
  Menu,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const navItems = [
  { href: "/dashboard", label: "Acasă", icon: Home },
  { href: "/dashboard/exercises", label: "Exercițiile mele", icon: Dumbbell },
  { href: "/dashboard/calendar", label: "Calendar", icon: Calendar },
  { href: "/dashboard/progress", label: "Progres", icon: TrendingUp },
  { href: "/dashboard/messages", label: "Mesaje", icon: MessageSquare },
  { href: "/dashboard/profile", label: "Profil", icon: User },
];

export function ClientSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  async function handleLogout() {
    document.cookie = "dev-role=; path=/; max-age=0";
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
    } catch {
      // Supabase not configured (dev mode) — ignore
    }
    router.push("/login");
    router.refresh();
  }

  const nav = (
    <>
      <div className="p-6 border-b flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="h-9 w-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
            <Activity className="h-5 w-5" />
          </div>
          <span className="text-xl font-bold tracking-tight">PhysioConnect</span>
        </Link>
        <button
          className="md:hidden p-1 text-muted-foreground"
          aria-label="Închide meniul"
          onClick={() => setOpen(false)}
        >
          <X className="h-5 w-5" />
        </button>
      </div>
      <p className="text-xs text-muted-foreground px-6 pb-2">Portal pacient</p>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/dashboard" && pathname.startsWith(item.href));
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
    </>
  );

  return (
    <>
      <header className="md:hidden sticky top-0 z-30 flex items-center justify-between px-4 h-14 border-b bg-white">
        <button
          className="p-2 -ml-2"
          aria-label="Deschide meniul"
          onClick={() => setOpen(true)}
        >
          <Menu className="h-5 w-5" />
        </button>
        <Link href="/" className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
            <Activity className="h-4 w-4" />
          </div>
          <span className="font-semibold tracking-tight">PhysioConnect</span>
        </Link>
        <span className="w-9" />
      </header>

      <aside className="hidden md:flex w-64 border-r bg-white flex-col h-full shrink-0">
        {nav}
      </aside>

      {open && (
        <div className="md:hidden fixed inset-0 z-40 flex">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setOpen(false)}
          />
          <aside className="relative w-72 max-w-[85%] bg-white flex flex-col h-full shadow-xl">
            {nav}
          </aside>
        </div>
      )}
    </>
  );
}
