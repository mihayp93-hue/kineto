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
  { href: "/dashboard", label: "Astăzi", icon: Home },
  { href: "/dashboard/exercises", label: "Exerciții", icon: Dumbbell },
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
      <div className="p-5 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="h-10 w-10 relative rounded-2xl bg-gradient-to-br from-primary to-[oklch(0.48_0.12_210)] text-primary-foreground flex items-center justify-center shadow-soft">
            <Activity className="h-5 w-5" strokeWidth={2.5} />
            <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-[var(--coral)] ring-2 ring-sidebar pulse-dot" />
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-[15px] font-semibold tracking-tight">
              PhysioConnect
            </span>
            <span className="text-[11px] text-muted-foreground">
              Recuperarea ta
            </span>
          </div>
        </Link>
        <button
          className="md:hidden p-1 text-muted-foreground"
          aria-label="Închide meniul"
          onClick={() => setOpen(false)}
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <nav className="flex-1 px-3 pb-4 overflow-y-auto space-y-1">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/dashboard" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all",
                isActive
                  ? "bg-primary text-primary-foreground shadow-soft"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              )}
            >
              <item.icon
                className={cn(
                  "h-[18px] w-[18px] shrink-0",
                  isActive ? "" : "text-muted-foreground/80"
                )}
                strokeWidth={isActive ? 2.4 : 2}
              />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-border/60">
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-muted-foreground rounded-xl"
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
      <header className="md:hidden sticky top-0 z-30 flex items-center justify-between px-4 h-14 border-b bg-sidebar">
        <button
          className="p-2 -ml-2"
          aria-label="Deschide meniul"
          onClick={() => setOpen(true)}
        >
          <Menu className="h-5 w-5" />
        </button>
        <Link href="/" className="flex items-center gap-2">
          <div className="h-8 w-8 relative rounded-xl bg-gradient-to-br from-primary to-[oklch(0.48_0.12_210)] text-primary-foreground flex items-center justify-center">
            <Activity className="h-4 w-4" strokeWidth={2.5} />
          </div>
          <span className="font-semibold tracking-tight text-sm">
            PhysioConnect
          </span>
        </Link>
        <span className="w-9" />
      </header>

      <aside className="hidden md:flex w-64 border-r bg-sidebar flex-col h-full shrink-0">
        {nav}
      </aside>

      {open && (
        <div className="md:hidden fixed inset-0 z-40 flex">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setOpen(false)}
          />
          <aside className="relative w-72 max-w-[85%] bg-sidebar flex flex-col h-full shadow-xl">
            {nav}
          </aside>
        </div>
      )}
    </>
  );
}
