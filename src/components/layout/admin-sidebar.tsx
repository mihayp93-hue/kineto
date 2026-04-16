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
  Menu,
  X,
  Tag as TagIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const navItems = [
  { num: "01", href: "/admin", label: "Astăzi", icon: Home },
  { num: "02", href: "/admin/clients", label: "Pacienți", icon: Users },
  { num: "03", href: "/admin/exercises", label: "Bibliotecă", icon: Dumbbell },
  { num: "04", href: "/admin/tags", label: "Afecțiuni", icon: TagIcon },
  { num: "05", href: "/admin/analytics", label: "Analize", icon: BarChart3 },
  { num: "06", href: "/admin/settings", label: "Setări", icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  // Close drawer on route change
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
        <Link href="/" className="flex items-center gap-2.5">
          <div className="h-9 w-9 relative rounded-[0.85rem] bg-gradient-to-br from-primary to-[oklch(0.35_0.07_155)] text-primary-foreground flex items-center justify-center shadow-sm">
            <Activity className="h-4 w-4" />
            <span className="absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full bg-[var(--ochre)] ring-2 ring-sidebar" />
          </div>
          <div className="flex flex-col leading-none">
            <span className="text-base font-bold tracking-tight">
              PhysioConnect
            </span>
            <span className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground mt-0.5">
              Cabinet · Admin
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

      <div className="px-6 pt-6 pb-2">
        <div className="font-mono text-[9px] uppercase tracking-[0.24em] text-muted-foreground">
          Index
        </div>
      </div>
      <nav className="flex-1 px-3 pb-4 overflow-y-auto">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/admin" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group flex items-center gap-3 px-3 py-3 border-b border-foreground/5 last:border-b-0 transition-colors relative",
                isActive
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {isActive && (
                <span className="absolute left-0 top-3 bottom-3 w-0.5 bg-primary rounded-full" />
              )}
              <span
                className={cn(
                  "font-mono text-[10px] shrink-0 w-5",
                  isActive ? "text-primary" : "text-muted-foreground/60"
                )}
              >
                {item.num}
              </span>
              <item.icon
                className={cn(
                  "h-4 w-4 shrink-0",
                  isActive ? "text-primary" : ""
                )}
              />
              <span
                className={cn(
                  "font-serif text-base leading-none",
                  isActive ? "italic" : ""
                )}
              >
                {item.label}
              </span>
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
      {/* Mobile topbar */}
      <header className="md:hidden sticky top-0 z-30 flex items-center justify-between px-4 h-14 border-b bg-sidebar">
        <button
          className="p-2 -ml-2"
          aria-label="Deschide meniul"
          onClick={() => setOpen(true)}
        >
          <Menu className="h-5 w-5" />
        </button>
        <Link href="/" className="flex items-center gap-2">
          <div className="h-7 w-7 relative rounded-lg bg-gradient-to-br from-primary to-[oklch(0.35_0.07_155)] text-primary-foreground flex items-center justify-center">
            <Activity className="h-3.5 w-3.5" />
            <span className="absolute -bottom-0.5 -right-0.5 h-1.5 w-1.5 rounded-full bg-[var(--ochre)] ring-2 ring-sidebar" />
          </div>
          <span className="font-semibold tracking-tight text-sm">
            PhysioConnect
          </span>
        </Link>
        <span className="w-9" />
      </header>

      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-64 border-r bg-sidebar flex-col h-full shrink-0">
        {nav}
      </aside>

      {/* Mobile drawer */}
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
