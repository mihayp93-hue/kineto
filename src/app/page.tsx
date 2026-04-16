import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Activity,
  ArrowRight,
  Calendar,
  CheckCircle2,
  ClipboardList,
  HeartPulse,
  LineChart,
  MessageSquare,
  PlayCircle,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  Timer,
  Video,
} from "lucide-react";

const PRACTITIONER_NAME = "Dr. Physio";
const PRACTITIONER_TITLE = "Kinetoterapeut principal";
const PRACTITIONER_YEARS = "12+";
const PRACTITIONER_PATIENTS = "600+";
const PRACTITIONER_LOCATION = "București";
const YEAR = new Date().getFullYear();

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />
      <Hero />
      <TrustStrip />
      <Benefits />
      <HowItWorks />
      <ProgramShowcase />
      <Practitioner />
      <Testimonial />
      <FaqTeaser />
      <FinalCta />
      <SiteFooter />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Header                                                              */
/* ------------------------------------------------------------------ */

function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 backdrop-blur-lg bg-background/70 border-b border-border/60">
      <div className="max-w-7xl mx-auto px-5 md:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="h-9 w-9 relative rounded-2xl bg-gradient-to-br from-primary to-[oklch(0.48_0.12_210)] text-primary-foreground flex items-center justify-center shadow-soft">
            <Activity className="h-[18px] w-[18px]" strokeWidth={2.5} />
            <span className="absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full bg-[var(--coral)] ring-2 ring-background pulse-dot" />
          </div>
          <span className="font-semibold tracking-tight text-[15px]">
            PhysioConnect
          </span>
        </Link>
        <nav className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
          <a href="#beneficii" className="hover:text-foreground transition-colors">Beneficii</a>
          <a href="#cum-functioneaza" className="hover:text-foreground transition-colors">Cum funcționează</a>
          <a href="#program" className="hover:text-foreground transition-colors">Program</a>
          <a href="#terapeut" className="hover:text-foreground transition-colors">Terapeut</a>
        </nav>
        <div className="flex items-center gap-2">
          <Link
            href="/login"
            className={cn(
              buttonVariants({ variant: "ghost" }),
              "hidden sm:inline-flex rounded-full h-9 px-4"
            )}
          >
            Conectare
          </Link>
          <Link
            href="/login"
            className={cn(buttonVariants(), "rounded-full shadow-soft h-9 px-4")}
          >
            Începe recuperarea
          </Link>
        </div>
      </div>
    </header>
  );
}

/* ------------------------------------------------------------------ */
/* Hero                                                                */
/* ------------------------------------------------------------------ */

function Hero() {
  return (
    <section className="relative overflow-hidden bg-mesh">
      <div className="max-w-7xl mx-auto px-5 md:px-8 py-14 md:py-24 grid lg:grid-cols-12 gap-10 items-center">
        <div className="lg:col-span-7 space-y-7">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/70 backdrop-blur px-3.5 py-1.5 text-xs font-medium text-primary border border-primary/15 shadow-soft">
            <Sparkles className="h-3.5 w-3.5" />
            Kinetoterapie personalizată, acasă
          </span>
          <h1 className="text-[clamp(2.5rem,5vw,4.25rem)] leading-[1.05] font-bold tracking-tight">
            Recuperare care te{" "}
            <span className="relative whitespace-nowrap">
              <span className="relative z-10">ascultă</span>
              <span className="absolute inset-x-0 bottom-1 h-3 bg-[var(--coral-soft)] -z-0 rounded-full" />
            </span>
            <br />
            și te ține pe drum.
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl leading-relaxed">
            Program video de exerciții prescris de kinetoterapeutul tău,
            urmărit zi de zi între ședințe. Faci terapia corect, la ritmul
            tău — iar progresul se vede.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/login"
              className={cn(
                buttonVariants({ size: "lg" }),
                "rounded-full shadow-soft h-12 px-6 text-[15px]"
              )}
            >
              Intră în programul tău <ArrowRight className="ml-1.5 h-4 w-4" />
            </Link>
            <a
              href="#cum-functioneaza"
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "rounded-full h-12 px-6 text-[15px] bg-white/60 backdrop-blur border-primary/20"
              )}
            >
              Vezi cum funcționează
            </a>
          </div>
          <div className="flex items-center gap-5 pt-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-primary" />
              <span>Date criptate</span>
            </div>
            <span className="h-1 w-1 rounded-full bg-border" />
            <div className="flex items-center gap-2">
              <Video className="h-4 w-4 text-primary" />
              <span>Video HD</span>
            </div>
            <span className="h-1 w-1 rounded-full bg-border" />
            <div className="flex items-center gap-2">
              <HeartPulse className="h-4 w-4 text-primary" />
              <span>Fără abonament</span>
            </div>
          </div>
        </div>

        {/* Right visual: stacked preview cards */}
        <div className="lg:col-span-5 relative h-[480px] md:h-[520px]">
          {/* Blob background */}
          <div className="absolute inset-8 blob bg-gradient-to-br from-primary/20 via-[var(--mint-soft)] to-[var(--coral-soft)] -z-0" />

          {/* Card 1 — progress ring */}
          <div className="absolute top-0 right-2 md:right-8 w-[280px] bg-card rounded-3xl p-5 shadow-soft-lg border lift-in">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-xs text-muted-foreground">Astăzi</div>
                <div className="text-sm font-semibold">Progres program</div>
              </div>
              <span className="inline-flex items-center gap-1.5 text-[11px] font-medium bg-mint-soft rounded-full px-2 py-0.5">
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--mint)] pulse-dot" />
                activ
              </span>
            </div>
            <div className="flex items-center gap-4">
              <MiniDial value={5} total={8} />
              <div className="space-y-1">
                <div className="text-3xl font-bold tracking-tight">5<span className="text-lg text-muted-foreground font-medium">/8</span></div>
                <div className="text-xs text-muted-foreground">exerciții terminate</div>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-border/60 flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <Timer className="h-3.5 w-3.5" />
                12 min rămase
              </div>
              <div className="flex items-center gap-1.5 text-[var(--coral)] font-medium">
                <HeartPulse className="h-3.5 w-3.5" />
                seria 6
              </div>
            </div>
          </div>

          {/* Card 2 — exercise */}
          <div className="absolute bottom-6 left-0 md:left-6 w-[280px] bg-card rounded-3xl shadow-soft-lg border overflow-hidden lift-in" style={{ animationDelay: "0.1s" }}>
            <div className="relative aspect-[16/9] bg-gradient-to-br from-primary/15 to-[var(--sky-soft)] flex items-center justify-center">
              <div className="h-12 w-12 rounded-full bg-white/95 flex items-center justify-center shadow-soft">
                <PlayCircle className="h-6 w-6 text-primary" strokeWidth={2} />
              </div>
              <span className="absolute top-3 left-3 bg-white/90 backdrop-blur rounded-full px-2.5 py-1 text-[10px] font-semibold text-foreground">
                3 · Mobilitate umăr
              </span>
            </div>
            <div className="p-4 space-y-2">
              <div className="text-sm font-semibold">Rotații externe cu banda</div>
              <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
                <span className="inline-flex items-center gap-1">
                  <Timer className="h-3 w-3" /> 3 min
                </span>
                <span className="inline-flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3 text-[var(--mint)]" /> 3 seturi × 12
                </span>
              </div>
            </div>
          </div>

          {/* Card 3 — streak badge */}
          <div className="absolute top-28 left-2 md:left-2 bg-card rounded-2xl shadow-soft border px-4 py-3 flex items-center gap-3 lift-in" style={{ animationDelay: "0.2s" }}>
            <div className="h-10 w-10 rounded-xl bg-coral-soft text-[var(--coral)] flex items-center justify-center">
              <HeartPulse className="h-5 w-5" />
            </div>
            <div className="leading-tight">
              <div className="text-lg font-bold">14 zile</div>
              <div className="text-[11px] text-muted-foreground">serie consistență</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function MiniDial({ value, total }: { value: number; total: number }) {
  const pct = Math.min(100, (value / total) * 100);
  const R = 32;
  const C = 2 * Math.PI * R;
  const dash = (pct / 100) * C;
  return (
    <div className="relative h-[76px] w-[76px]">
      <svg viewBox="0 0 80 80" className="h-full w-full -rotate-90">
        <circle cx="40" cy="40" r={R} fill="none" stroke="currentColor" strokeWidth="7" className="text-muted/60" />
        <circle
          cx="40"
          cy="40"
          r={R}
          fill="none"
          stroke="currentColor"
          strokeWidth="7"
          strokeLinecap="round"
          strokeDasharray={`${dash} ${C}`}
          className="text-primary transition-[stroke-dasharray] duration-700"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center text-sm font-bold">
        {Math.round(pct)}%
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Trust Strip                                                         */
/* ------------------------------------------------------------------ */

function TrustStrip() {
  const items = [
    { label: "Pacienți recuperați", value: PRACTITIONER_PATIENTS },
    { label: "Ani experiență", value: PRACTITIONER_YEARS },
    { label: "Rată de aderență", value: "92%" },
    { label: "Rating pacienți", value: "4.9" },
  ];
  return (
    <section className="border-y bg-card/40">
      <div className="max-w-7xl mx-auto px-5 md:px-8 py-8 grid grid-cols-2 md:grid-cols-4 gap-6">
        {items.map((it) => (
          <div key={it.label} className="text-center md:text-left">
            <div className="text-3xl md:text-4xl font-bold tracking-tight text-primary">
              {it.value}
            </div>
            <div className="text-xs md:text-sm text-muted-foreground mt-1">
              {it.label}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Benefits                                                            */
/* ------------------------------------------------------------------ */

function Benefits() {
  const benefits: Array<{
    icon: typeof ClipboardList;
    title: string;
    body: string;
    tone: "primary" | "coral" | "mint" | "sky";
  }> = [
    {
      icon: ClipboardList,
      title: "Program croit pe tine",
      body: "Nu primești un plan generic. Exercițiile sunt alese pentru diagnosticul, stadiul și obiectivul tău.",
      tone: "primary",
    },
    {
      icon: Video,
      title: "Video cu tehnică corectă",
      body: "Fiecare exercițiu are demonstrație video cu instrucțiuni clare. Faci mișcarea corect din prima zi.",
      tone: "coral",
    },
    {
      icon: LineChart,
      title: "Progres vizibil zilnic",
      body: "Marchezi ce ai făcut, notezi cum te simți. Terapeutul vede evoluția și ajustează planul.",
      tone: "mint",
    },
    {
      icon: MessageSquare,
      title: "Sprijin între ședințe",
      body: "Ai o întrebare la mijlocul săptămânii? Scrii direct în aplicație și primești răspuns.",
      tone: "sky",
    },
  ];
  return (
    <section id="beneficii" className="py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-5 md:px-8">
        <div className="max-w-2xl mb-14">
          <span className="text-xs font-semibold uppercase tracking-wider text-primary">
            De ce PhysioConnect
          </span>
          <h2 className="mt-3 text-3xl md:text-5xl font-bold tracking-tight">
            Terapia ta, continuată și{" "}
            <span className="text-primary">între ședințe.</span>
          </h2>
          <p className="mt-4 text-muted-foreground text-lg leading-relaxed">
            Cele mai bune rezultate vin din consecvență. Platforma te ajută să
            faci exercițiile corect, la timp și să vezi că drumul spre
            recuperare înaintează.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {benefits.map((b) => (
            <BenefitCard key={b.title} {...b} />
          ))}
        </div>
      </div>
    </section>
  );
}

function BenefitCard({
  icon: Icon,
  title,
  body,
  tone,
}: {
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  title: string;
  body: string;
  tone: "primary" | "coral" | "mint" | "sky";
}) {
  const iconClasses: Record<typeof tone, string> = {
    primary: "bg-primary/10 text-primary",
    coral: "bg-coral-soft text-coral",
    mint: "bg-mint-soft text-mint",
    sky: "bg-sky-soft text-sky",
  };
  return (
    <div className="group bg-card rounded-3xl p-6 border border-border/60 hover:border-primary/30 hover:shadow-soft transition-all">
      <div
        className={`h-12 w-12 rounded-2xl flex items-center justify-center mb-5 ${iconClasses[tone]}`}
      >
        <Icon className="h-5 w-5" strokeWidth={2.2} />
      </div>
      <h3 className="text-lg font-semibold tracking-tight mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed">{body}</p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* How it works                                                        */
/* ------------------------------------------------------------------ */

function HowItWorks() {
  const steps = [
    {
      n: "1",
      title: "Consultație și evaluare",
      body: "Ne vedem la cabinet sau online. Evaluez postura, mobilitatea, durerea — și înțeleg ce ai nevoie.",
      icon: Stethoscope,
    },
    {
      n: "2",
      title: "Program personalizat",
      body: "Primești în aplicație un plan săptămânal cu exerciții video, durate și indicații clare.",
      icon: ClipboardList,
    },
    {
      n: "3",
      title: "Faci. Urmărești. Progresezi.",
      body: "Marchezi fiecare exercițiu terminat. Vezi streakul, durerea, evoluția. Ajustăm împreună.",
      icon: LineChart,
    },
  ];
  return (
    <section id="cum-functioneaza" className="py-20 md:py-28 bg-gradient-to-b from-secondary/40 to-background">
      <div className="max-w-7xl mx-auto px-5 md:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-semibold uppercase tracking-wider text-primary">
            Cum funcționează
          </span>
          <h2 className="mt-3 text-3xl md:text-5xl font-bold tracking-tight">
            Trei pași spre recuperarea ta.
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6 relative">
          {/* dotted connector behind cards on md+ */}
          <div className="hidden md:block absolute top-[90px] left-[16%] right-[16%] h-px border-t-2 border-dashed border-primary/20 -z-0" />
          {steps.map((s) => (
            <div
              key={s.n}
              className="relative bg-card rounded-3xl p-6 md:p-8 border shadow-soft text-center"
            >
              <div className="h-16 w-16 rounded-2xl mx-auto bg-gradient-to-br from-primary to-[oklch(0.48_0.12_210)] text-primary-foreground flex items-center justify-center mb-5 shadow-soft">
                <s.icon className="h-7 w-7" strokeWidth={2.2} />
              </div>
              <div className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-coral-soft text-coral text-xs font-bold mb-3">
                {s.n}
              </div>
              <h3 className="text-xl font-semibold tracking-tight mb-2">
                {s.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {s.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Program Showcase                                                    */
/* ------------------------------------------------------------------ */

function ProgramShowcase() {
  const conditions = [
    { label: "Durere lombară", count: "34 exerciții", tone: "primary" },
    { label: "Umăr înghețat", count: "22 exerciții", tone: "coral" },
    { label: "Post-operator genunchi", count: "28 exerciții", tone: "mint" },
    { label: "Hernie de disc", count: "19 exerciții", tone: "sky" },
    { label: "Scolioză", count: "16 exerciții", tone: "primary" },
    { label: "Reabilitare sportivă", count: "40 exerciții", tone: "coral" },
  ];
  const toneClasses: Record<string, string> = {
    primary: "bg-primary/10 text-primary",
    coral: "bg-coral-soft text-coral",
    mint: "bg-mint-soft text-mint",
    sky: "bg-sky-soft text-sky",
  };
  return (
    <section id="program" className="py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-5 md:px-8 grid lg:grid-cols-12 gap-10">
        <div className="lg:col-span-5 lg:sticky lg:top-24 self-start">
          <span className="text-xs font-semibold uppercase tracking-wider text-primary">
            Afecțiuni tratate
          </span>
          <h2 className="mt-3 text-3xl md:text-5xl font-bold tracking-tight">
            Bibliotecă construită pe ani de cabinet.
          </h2>
          <p className="mt-4 text-muted-foreground text-lg leading-relaxed">
            Fiecare exercițiu e filmat, descris și categorizat. Selectăm din
            bibliotecă exact ce îți trebuie ție, pentru stadiul tău actual.
          </p>
          <Link
            href="/login"
            className={cn(
              buttonVariants({ size: "lg" }),
              "mt-6 rounded-full shadow-soft h-11 px-5"
            )}
          >
            Vezi programul tău <ArrowRight className="ml-1.5 h-4 w-4" />
          </Link>
        </div>

        <div className="lg:col-span-7 grid sm:grid-cols-2 gap-3">
          {conditions.map((c) => (
            <div
              key={c.label}
              className="group bg-card rounded-2xl p-5 border border-border/60 hover:border-primary/30 hover:shadow-soft transition-all flex items-center gap-4"
            >
              <div
                className={`h-11 w-11 rounded-xl flex items-center justify-center shrink-0 ${toneClasses[c.tone]}`}
              >
                <HeartPulse className="h-5 w-5" strokeWidth={2.2} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold tracking-tight truncate">
                  {c.label}
                </div>
                <div className="text-xs text-muted-foreground mt-0.5">
                  {c.count}
                </div>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all shrink-0" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Practitioner                                                        */
/* ------------------------------------------------------------------ */

function Practitioner() {
  return (
    <section id="terapeut" className="py-20 md:py-28 bg-gradient-to-b from-background to-secondary/40">
      <div className="max-w-6xl mx-auto px-5 md:px-8">
        <div className="bg-card rounded-[2rem] border shadow-soft-lg overflow-hidden grid md:grid-cols-5">
          <div className="md:col-span-2 bg-gradient-to-br from-primary via-[oklch(0.52_0.12_205)] to-[oklch(0.48_0.14_210)] p-10 flex items-center justify-center relative">
            <div className="absolute inset-0 bg-mesh opacity-20" />
            <div className="relative h-40 w-40 md:h-48 md:w-48 rounded-full bg-white/15 backdrop-blur-sm border-4 border-white/30 flex items-center justify-center text-primary-foreground">
              <Stethoscope className="h-20 w-20" strokeWidth={1.6} />
            </div>
          </div>
          <div className="md:col-span-3 p-8 md:p-12 space-y-5">
            <span className="inline-block text-xs font-semibold uppercase tracking-wider text-primary">
              Cine te tratează
            </span>
            <div>
              <h3 className="text-3xl font-bold tracking-tight">
                {PRACTITIONER_NAME}
              </h3>
              <p className="text-muted-foreground mt-1">
                {PRACTITIONER_TITLE} · {PRACTITIONER_LOCATION}
              </p>
            </div>
            <p className="text-[15px] leading-relaxed text-foreground/80">
              Lucrez de peste {PRACTITIONER_YEARS} ani cu pacienți care au
              nevoie de recuperare după accidentări, intervenții sau dureri
              cronice. Cred în progres constant, mișcare blândă și în a asculta
              corpul pacientului.
            </p>
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border/60">
              <StatCell value={PRACTITIONER_PATIENTS} label="Pacienți" />
              <StatCell value={PRACTITIONER_YEARS} label="Ani" />
              <StatCell value="4.9" label="Rating" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function StatCell({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <div className="text-2xl font-bold tracking-tight text-primary">{value}</div>
      <div className="text-xs text-muted-foreground mt-0.5">{label}</div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Testimonial                                                         */
/* ------------------------------------------------------------------ */

function Testimonial() {
  return (
    <section className="py-20 md:py-28">
      <div className="max-w-4xl mx-auto px-5 md:px-8 text-center">
        <div className="inline-flex items-center gap-1 mb-6">
          {[...Array(5)].map((_, i) => (
            <span key={i} className="text-[var(--coral)] text-xl">
              ★
            </span>
          ))}
        </div>
        <blockquote className="text-2xl md:text-[2rem] leading-snug font-semibold tracking-tight">
          „După hernia de disc credeam că nu mai pot alerga. Cu programul din
          aplicație, exercițiile zilnice și mesajele cu dr. Physio, în 3 luni
          am revenit la ritmul dinainte. Nu m-am simțit niciodată singură în
          procesul ăsta.&rdquo;
        </blockquote>
        <div className="mt-8 flex items-center justify-center gap-3">
          <div className="h-12 w-12 rounded-full bg-gradient-to-br from-coral-soft to-primary/20 flex items-center justify-center font-semibold">
            MA
          </div>
          <div className="text-left">
            <div className="font-semibold text-sm">Maria A.</div>
            <div className="text-xs text-muted-foreground">
              Recuperare hernie L4-L5 · 34 ani
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* FAQ Teaser                                                          */
/* ------------------------------------------------------------------ */

function FaqTeaser() {
  const items = [
    {
      q: "Am nevoie de echipament special?",
      a: "Cele mai multe exerciții se fac doar cu greutatea corpului. Unele folosesc o bandă elastică sau minge moale — le poți lua de oriunde.",
    },
    {
      q: "Cât durează un program zilnic?",
      a: "Între 15 și 35 de minute, în funcție de faza recuperării. Planul e făcut să încapă în ziua ta, nu invers.",
    },
    {
      q: "Pot să-i scriu terapeutului între ședințe?",
      a: "Da. Ai chat direct în aplicație. Răspund în aceeași zi la întrebări legate de exerciții, durere sau tehnică.",
    },
    {
      q: "Platforma înlocuiește ședințele fizice?",
      a: "Nu. E pentru continuitate între ședințe. Evaluările și ajustările importante le facem față-n față (sau online, când nu se poate altfel).",
    },
  ];
  return (
    <section className="py-20 md:py-28 bg-secondary/40">
      <div className="max-w-4xl mx-auto px-5 md:px-8">
        <div className="text-center mb-12">
          <span className="text-xs font-semibold uppercase tracking-wider text-primary">
            Întrebări frecvente
          </span>
          <h2 className="mt-3 text-3xl md:text-4xl font-bold tracking-tight">
            Ce vor să știe pacienții, înainte de prima ședință.
          </h2>
        </div>
        <div className="space-y-3">
          {items.map((it) => (
            <details
              key={it.q}
              className="group bg-card rounded-2xl border border-border/60 open:shadow-soft open:border-primary/30 transition-all"
            >
              <summary className="cursor-pointer list-none p-5 flex items-center justify-between gap-4">
                <span className="font-semibold text-[15px]">{it.q}</span>
                <span className="h-7 w-7 rounded-full bg-secondary flex items-center justify-center text-primary transition-transform group-open:rotate-45">
                  +
                </span>
              </summary>
              <div className="px-5 pb-5 text-sm text-muted-foreground leading-relaxed">
                {it.a}
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Final CTA                                                           */
/* ------------------------------------------------------------------ */

function FinalCta() {
  return (
    <section className="py-20 md:py-28">
      <div className="max-w-6xl mx-auto px-5 md:px-8">
        <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-primary via-[oklch(0.52_0.12_205)] to-[oklch(0.48_0.14_210)] text-primary-foreground p-10 md:p-16 shadow-soft-lg">
          <div className="absolute -top-20 -right-20 h-72 w-72 blob bg-white/10" />
          <div className="absolute -bottom-16 -left-16 h-56 w-56 blob bg-[var(--coral)]/30" />
          <div className="relative grid md:grid-cols-3 gap-8 items-end">
            <div className="md:col-span-2 space-y-4">
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight leading-tight">
                Gata să reîncepi recuperarea{" "}
                <span className="underline decoration-[var(--coral)] decoration-4 underline-offset-4">
                  cum trebuie
                </span>
                ?
              </h2>
              <p className="text-primary-foreground/85 text-lg max-w-xl">
                Programează prima evaluare. Primești acces la platformă imediat
                după.
              </p>
            </div>
            <div className="flex md:flex-col gap-3 md:items-end">
              <Link
                href="/login"
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "rounded-full bg-white text-primary hover:bg-white/90 shadow-soft h-12 px-7 text-[15px] font-semibold"
                )}
              >
                Programează-te <ArrowRight className="ml-1.5 h-4 w-4" />
              </Link>
              <a
                href="#beneficii"
                className={cn(
                  buttonVariants({ variant: "outline", size: "lg" }),
                  "rounded-full h-12 px-7 text-[15px] bg-white/10 backdrop-blur border-white/30 text-primary-foreground hover:bg-white/20 hover:text-primary-foreground"
                )}
              >
                Mai multe detalii
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Footer                                                              */
/* ------------------------------------------------------------------ */

function SiteFooter() {
  return (
    <footer className="border-t bg-card/40">
      <div className="max-w-7xl mx-auto px-5 md:px-8 py-12 grid md:grid-cols-4 gap-8">
        <div className="md:col-span-2 space-y-3">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-2xl bg-gradient-to-br from-primary to-[oklch(0.48_0.12_210)] text-primary-foreground flex items-center justify-center shadow-soft">
              <Activity className="h-[18px] w-[18px]" strokeWidth={2.5} />
            </div>
            <span className="font-semibold tracking-tight">PhysioConnect</span>
          </Link>
          <p className="text-sm text-muted-foreground max-w-sm leading-relaxed">
            Platformă de kinetoterapie construită în jurul continuității
            dintre ședințe.
          </p>
        </div>
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
            Platformă
          </div>
          <ul className="space-y-2 text-sm">
            <li><a href="#beneficii" className="hover:text-primary transition-colors">Beneficii</a></li>
            <li><a href="#cum-functioneaza" className="hover:text-primary transition-colors">Cum funcționează</a></li>
            <li><a href="#program" className="hover:text-primary transition-colors">Program</a></li>
            <li><Link href="/login" className="hover:text-primary transition-colors">Conectare</Link></li>
          </ul>
        </div>
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
            Cabinet
          </div>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-center gap-2"><Calendar className="h-3.5 w-3.5" /> Luni – Vineri</li>
            <li className="flex items-center gap-2"><Stethoscope className="h-3.5 w-3.5" /> {PRACTITIONER_LOCATION}</li>
            <li className="flex items-center gap-2"><MessageSquare className="h-3.5 w-3.5" /> Chat în aplicație</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border/60">
        <div className="max-w-7xl mx-auto px-5 md:px-8 py-5 flex flex-col md:flex-row items-center justify-between gap-2 text-xs text-muted-foreground">
          <span>© {YEAR} PhysioConnect · Cabinet {PRACTITIONER_NAME}</span>
          <span>Made with care in {PRACTITIONER_LOCATION}</span>
        </div>
      </div>
    </footer>
  );
}
