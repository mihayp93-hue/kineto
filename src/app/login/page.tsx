"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Activity, Stethoscope, User, ArrowLeft } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();

  function loginAs(role: "ADMIN" | "CLIENT") {
    document.cookie = `dev-role=${role}; path=/; max-age=86400`;
    router.push(role === "ADMIN" ? "/admin" : "/dashboard");
    router.refresh();
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-background">
      {/* Decorative background */}
      <div className="pointer-events-none absolute -top-32 -left-24 h-[460px] w-[460px] rounded-full bg-primary/15 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -right-24 h-[460px] w-[460px] rounded-full bg-[oklch(0.78_0.13_70/0.25)] blur-3xl" />
      <div className="pointer-events-none absolute inset-0 bg-dots opacity-40 [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]" />

      <div className="relative w-full max-w-md">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground mb-6 transition"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Înapoi la pagina principală
        </Link>

        <div className="rounded-[1.75rem] border bg-card shadow-[0_30px_80px_-20px_oklch(0.42_0.08_155/0.2)] overflow-hidden">
          {/* Header with accent stripe */}
          <div className="relative bg-gradient-to-br from-primary to-[oklch(0.36_0.07_155)] text-primary-foreground p-7 pb-8 text-center overflow-hidden">
            <div className="absolute inset-0 bg-dots opacity-20" />
            <div className="absolute -top-8 -right-8 h-32 w-32 rounded-full bg-ochre/25 blur-2xl" />
            <div className="relative">
              <div className="flex justify-center mb-4">
                <div className="h-12 w-12 relative rounded-[0.9rem] bg-primary-foreground/15 backdrop-blur border border-primary-foreground/20 flex items-center justify-center">
                  <Activity className="h-5 w-5" />
                  <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-ochre ring-2 ring-primary" />
                </div>
              </div>
              <h1 className="font-serif text-3xl leading-tight">
                Bine ai revenit
              </h1>
              <p className="text-primary-foreground/85 text-sm mt-1.5">
                Continuă recuperarea în contul tău
              </p>
            </div>
          </div>

          {/* Body */}
          <div className="p-6 space-y-3">
            <button
              onClick={() => loginAs("CLIENT")}
              className="group w-full text-left flex items-center gap-4 p-4 rounded-xl border hover:border-primary/40 hover:bg-secondary/50 transition-all"
            >
              <div className="h-11 w-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors shrink-0">
                <User className="h-5 w-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold">Sunt pacient</div>
                <div className="text-xs text-muted-foreground">
                  Acces la planul meu de recuperare
                </div>
              </div>
              <span className="text-muted-foreground group-hover:text-primary transition">
                →
              </span>
            </button>

            <button
              onClick={() => loginAs("ADMIN")}
              className="group w-full text-left flex items-center gap-4 p-4 rounded-xl border bg-primary text-primary-foreground hover:shadow-lg hover:shadow-primary/20 transition-all"
            >
              <div className="h-11 w-11 rounded-xl bg-primary-foreground/15 flex items-center justify-center shrink-0">
                <Stethoscope className="h-5 w-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold">Panou administrator</div>
                <div className="text-xs opacity-85">
                  Acces rezervat — doar pentru terapeut
                </div>
              </div>
              <span className="opacity-75 group-hover:opacity-100 transition">
                →
              </span>
            </button>

            <div className="pt-3">
              <p className="text-xs text-center text-muted-foreground">
                Nu ai încă un cont? Contactează direct terapeutul pentru a fi
                adăugat ca pacient.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
