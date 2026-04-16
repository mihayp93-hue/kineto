"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Activity,
  ArrowLeft,
  ArrowRight,
  HeartPulse,
  ShieldCheck,
  Stethoscope,
  User as UserIcon,
} from "lucide-react";

export default function LoginPage() {
  const router = useRouter();

  function loginAs(role: "ADMIN" | "CLIENT") {
    document.cookie = `dev-role=${role}; path=/; max-age=86400`;
    router.push(role === "ADMIN" ? "/admin" : "/dashboard");
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-mesh text-foreground flex flex-col">
      <div className="px-5 md:px-8 py-5 flex items-center justify-between max-w-6xl mx-auto w-full">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="h-9 w-9 rounded-2xl bg-gradient-to-br from-primary to-[oklch(0.48_0.12_210)] text-primary-foreground flex items-center justify-center shadow-soft">
            <Activity className="h-[18px] w-[18px]" strokeWidth={2.5} />
          </div>
          <span className="font-semibold tracking-tight">PhysioConnect</span>
        </Link>
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Înapoi la pagina principală</span>
          <span className="sm:hidden">Înapoi</span>
        </Link>
      </div>

      <div className="flex-1 flex items-center justify-center px-5 md:px-8 py-12">
        <div className="w-full max-w-md">
          <div className="bg-card rounded-[2rem] shadow-soft-lg border border-border/60 p-8 md:p-10 relative overflow-hidden">
            <div className="absolute -top-16 -right-16 h-40 w-40 blob bg-primary/10" />
            <div className="absolute -bottom-14 -left-14 h-36 w-36 blob bg-coral-soft" />

            <div className="relative">
              <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 text-primary px-3 py-1 text-xs font-medium mb-5">
                <HeartPulse className="h-3.5 w-3.5" />
                Bine ai venit
              </div>
              <h1 className="text-3xl font-bold tracking-tight">
                Intră în contul tău
              </h1>
              <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                Alege cum intri. Planul tău te așteaptă.
              </p>

              <div className="space-y-3 mt-8">
                <RoleButton
                  onClick={() => loginAs("CLIENT")}
                  icon={UserIcon}
                  title="Sunt pacient"
                  subtitle="Accesează planul tău de recuperare"
                  tone="primary"
                />
                <RoleButton
                  onClick={() => loginAs("ADMIN")}
                  icon={Stethoscope}
                  title="Sunt terapeutul"
                  subtitle="Acces cabinet — rezervat"
                  tone="coral"
                />
              </div>

              <div className="mt-7 pt-6 border-t border-border/60 flex items-start gap-2.5 text-xs text-muted-foreground">
                <ShieldCheck className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <span>
                  Datele tale sunt criptate. Doar tu și terapeutul tău aveți
                  acces la program și progres.
                </span>
              </div>
            </div>
          </div>

          <p className="text-center text-sm text-muted-foreground mt-6">
            Nu ai cont încă?{" "}
            <a href="#" className="text-primary font-medium hover:underline">
              Scrie-i terapeutului tău
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

function RoleButton({
  onClick,
  icon: Icon,
  title,
  subtitle,
  tone,
}: {
  onClick: () => void;
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  title: string;
  subtitle: string;
  tone: "primary" | "coral";
}) {
  const toneClasses =
    tone === "primary"
      ? "bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground"
      : "bg-coral-soft text-coral group-hover:bg-coral group-hover:text-white";
  return (
    <button
      onClick={onClick}
      className="group w-full bg-background hover:bg-secondary border border-border rounded-2xl px-5 py-4 flex items-center gap-4 text-left transition-all hover:shadow-soft hover:border-primary/30"
    >
      <div
        className={`h-11 w-11 rounded-xl flex items-center justify-center transition-all ${toneClasses}`}
      >
        <Icon className="h-5 w-5" strokeWidth={2.2} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-semibold tracking-tight">{title}</div>
        <div className="text-xs text-muted-foreground mt-0.5">{subtitle}</div>
      </div>
      <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground group-hover:translate-x-0.5 transition-all shrink-0" />
    </button>
  );
}
