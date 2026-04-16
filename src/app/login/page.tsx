"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { Activity, ArrowLeft, ArrowRight, Leaf } from "lucide-react";

const ISSUE = "Nr. 1";
const YEAR = new Date().getFullYear();

export default function LoginPage() {
  const router = useRouter();

  function loginAs(role: "ADMIN" | "CLIENT") {
    document.cookie = `dev-role=${role}; path=/; max-age=86400`;
    router.push(role === "ADMIN" ? "/admin" : "/dashboard");
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Top masthead */}
      <div className="border-b border-foreground/15">
        <div className="max-w-[1100px] mx-auto w-full px-6 py-4 flex items-center justify-between text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 hover:text-foreground transition"
          >
            <ArrowLeft className="h-3 w-3" />
            Înapoi la pagina principală
          </Link>
          <span className="hidden md:inline">
            {ISSUE} · Intrare · {YEAR}
          </span>
        </div>
      </div>

      {/* Cover */}
      <div className="flex-1 relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-dots opacity-40 [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]" />
        <div className="pointer-events-none absolute -top-40 -right-20 h-[500px] w-[500px] rounded-full bg-primary/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-40 -left-20 h-[500px] w-[500px] rounded-full bg-ochre/15 blur-3xl" />

        <div className="relative max-w-[1100px] mx-auto w-full px-6 py-16 md:py-28 grid grid-cols-12 gap-8">
          {/* Left — title */}
          <div className="col-span-12 md:col-span-7">
            <div className="font-hand text-2xl text-ochre mb-4">
              &mdash; cine ești?
            </div>
            <h1 className="font-serif text-[clamp(3rem,10vw,8rem)] leading-[0.88] tracking-tight">
              Intrarea
              <br />
              se face{" "}
              <span className="italic text-primary">cu atenție</span>.
            </h1>
            <p className="mt-8 text-lg text-foreground/70 max-w-md">
              Două căi. Una pentru pacienți, care își deschid planul zilnic.
              Una pentru cabinet. Alege.
            </p>

            <div className="mt-10 flex items-center gap-2 text-xs text-muted-foreground">
              <Leaf className="h-4 w-4 text-primary" />
              <span>
                Datele sunt criptate. Doar tu și terapeutul tău le vedeți.
              </span>
            </div>
          </div>

          {/* Right — choices as numbered entries */}
          <div className="col-span-12 md:col-span-5 flex flex-col justify-center gap-0 border-t border-foreground/15 md:border-t-0">
            <button
              onClick={() => loginAs("CLIENT")}
              className="group grid grid-cols-[auto_1fr_auto] items-center gap-5 py-6 md:py-8 border-b border-foreground/15 text-left hover:bg-foreground/[0.02] transition -mx-2 px-2"
            >
              <div className="display-numeral text-5xl md:text-6xl text-foreground/90 group-hover:text-primary transition">
                01
              </div>
              <div>
                <div className="font-mono text-[10px] uppercase tracking-[0.24em] text-primary mb-1">
                  Pentru pacient
                </div>
                <div className="font-serif text-2xl md:text-3xl leading-tight">
                  Sunt pacient
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  Acces la planul meu de recuperare
                </div>
              </div>
              <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition" />
            </button>

            <button
              onClick={() => loginAs("ADMIN")}
              className="group grid grid-cols-[auto_1fr_auto] items-center gap-5 py-6 md:py-8 border-b border-foreground/15 text-left hover:bg-foreground/[0.02] transition -mx-2 px-2"
            >
              <div className="display-numeral text-5xl md:text-6xl text-foreground/90 group-hover:text-ochre transition">
                02
              </div>
              <div>
                <div className="font-mono text-[10px] uppercase tracking-[0.24em] text-ochre mb-1">
                  Pentru cabinet
                </div>
                <div className="font-serif text-2xl md:text-3xl leading-tight">
                  Sunt terapeutul
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  Acces rezervat — doar pentru mine
                </div>
              </div>
              <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-ochre group-hover:translate-x-1 transition" />
            </button>

            <p className="text-xs text-muted-foreground mt-6 font-hand text-base">
              Nu ai cont? Scrie-i terapeutului.
            </p>
          </div>
        </div>
      </div>

      {/* Bottom signature */}
      <div className="border-t-2 border-foreground">
        <div className="max-w-[1100px] mx-auto w-full px-6 py-6 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 relative rounded-[0.75rem] bg-gradient-to-br from-primary to-[oklch(0.35_0.07_155)] text-primary-foreground flex items-center justify-center">
              <Activity className="h-3.5 w-3.5" />
              <span className="absolute -bottom-0.5 -right-0.5 h-1.5 w-1.5 rounded-full bg-ochre ring-2 ring-background" />
            </div>
            <span className="font-serif text-base leading-none">
              PhysioConnect
            </span>
          </div>
          <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            &copy; {YEAR}
          </div>
        </div>
      </div>
    </div>
  );
}
