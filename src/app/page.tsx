import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Activity,
  Video,
  BarChart3,
  Calendar,
  MessageSquare,
  CheckCircle2,
  PlayCircle,
  ShieldCheck,
  ArrowRight,
  Quote,
  Clock3,
  Stethoscope,
  MapPin,
  Phone,
  Sparkles,
  Heart,
  Leaf,
} from "lucide-react";

// Single practitioner copy — replace with real therapist details.
const PRACTITIONER_NAME = "Dr. Physio";
const PRACTITIONER_TITLE = "Kinetoterapeut principal";
const PRACTITIONER_YEARS = "12+";
const PRACTITIONER_PATIENTS = "600+";
const PRACTITIONER_LOCATION = "București";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-md">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <LogoMark />
            <div className="flex flex-col leading-none">
              <span className="text-lg font-bold tracking-tight">
                PhysioConnect
              </span>
              <span className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                Recuperare · {PRACTITIONER_LOCATION}
              </span>
            </div>
          </Link>
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
            <a href="#despre" className="hover:text-foreground transition">
              Despre mine
            </a>
            <a href="#proces" className="hover:text-foreground transition">
              Procesul
            </a>
            <a href="#platforma" className="hover:text-foreground transition">
              Platforma
            </a>
            <a href="#pareri" className="hover:text-foreground transition">
              Păreri pacienți
            </a>
          </nav>
          <div className="flex items-center gap-2">
            <Link href="/login" className="hidden sm:inline-flex">
              <Button variant="ghost" size="sm">
                Autentificare
              </Button>
            </Link>
            <Link href="/login">
              <Button size="sm" className="gap-1">
                Intră în cont <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        {/* Decorative gradient blobs */}
        <div className="pointer-events-none absolute -top-32 -left-24 h-[520px] w-[520px] rounded-full bg-primary/15 blur-3xl" />
        <div className="pointer-events-none absolute top-40 -right-32 h-[420px] w-[420px] rounded-full bg-[oklch(0.78_0.13_70/0.25)] blur-3xl" />
        {/* Dot pattern */}
        <div className="pointer-events-none absolute inset-0 bg-dots opacity-50 [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]" />

        <div className="relative container mx-auto px-4 pt-16 pb-20 md:pt-28 md:pb-32 grid md:grid-cols-[1.15fr_1fr] gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border bg-background/80 backdrop-blur px-3.5 py-1.5 text-xs font-medium shadow-sm">
              <span className="flex h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
              <Stethoscope className="h-3.5 w-3.5 text-primary" />
              Cabinet de kinetoterapie · {PRACTITIONER_LOCATION}
            </div>
            <h1 className="mt-7 font-serif text-[2.75rem] sm:text-6xl md:text-[5.25rem] leading-[0.98] tracking-tight">
              Recuperare care te{" "}
              <span className="accent-underline italic text-primary">
                ține în mișcare
              </span>
              <span className="text-muted-foreground/70">.</span>
            </h1>
            <p className="mt-7 text-lg md:text-xl text-muted-foreground max-w-xl leading-relaxed">
              Îți prescriu exerciții video adaptate stării tale, iar tu le
              urmezi acasă după programul nostru. Fiecare repetare, fiecare
              nivel de durere e înregistrat — îți ajustez planul săptămână de
              săptămână.
            </p>
            <div className="mt-9 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <Link href="/login">
                <Button
                  size="lg"
                  className="gap-2 h-12 text-base px-7 w-full sm:w-auto shadow-lg shadow-primary/20"
                >
                  Accesează planul meu <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <a href="#proces">
                <Button
                  size="lg"
                  variant="outline"
                  className="gap-2 h-12 text-base px-7 w-full sm:w-auto"
                >
                  <PlayCircle className="h-4 w-4" />
                  Vezi cum funcționează
                </Button>
              </a>
            </div>
            <div className="mt-11 flex flex-wrap items-center gap-x-7 gap-y-3 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-primary" />
                Date confidențiale · GDPR
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Clock3 className="h-4 w-4 text-primary" />
                Acces 24/7
              </span>
              <span className="inline-flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                Fără instalare
              </span>
            </div>
          </div>

          {/* Hero visual — layered preview + accent chips */}
          <div className="relative">
            {/* Accent ring behind */}
            <div className="absolute -inset-6 rounded-[2rem] border border-dashed border-primary/25 rotate-[-3deg] pointer-events-none" />
            <div className="relative rounded-[1.75rem] border bg-card shadow-[0_30px_80px_-20px_oklch(0.42_0.08_155/0.25)] overflow-hidden">
              <div className="flex items-center gap-1.5 px-4 py-3 border-b bg-secondary/60">
                <span className="h-2.5 w-2.5 rounded-full bg-[oklch(0.7_0.18_30)]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[oklch(0.8_0.14_80)]" />
                <span className="h-2.5 w-2.5 rounded-full bg-primary" />
                <span className="ml-3 text-xs text-muted-foreground font-medium">
                  planul meu · marți
                </span>
              </div>
              <div className="p-5 space-y-4">
                <div className="grid grid-cols-3 gap-3">
                  <MiniStat
                    label="Astăzi"
                    value="3/5"
                    icon={CheckCircle2}
                    tone="primary"
                  />
                  <MiniStat
                    label="Săptămână"
                    value="82%"
                    icon={Activity}
                    tone="ochre"
                  />
                  <MiniStat
                    label="Durere"
                    value="2.4"
                    icon={BarChart3}
                    tone="muted"
                  />
                </div>
                <div className="space-y-2.5">
                  {[
                    { title: "Rotație externă umăr", done: true },
                    { title: "Extensii genunchi", done: true },
                    { title: "Mobilizare cervicală", done: false },
                  ].map((ex) => (
                    <div
                      key={ex.title}
                      className="flex items-center gap-3 p-3 rounded-xl border bg-background/60"
                    >
                      <div className="h-10 w-14 rounded-lg bg-gradient-to-br from-primary/25 to-[oklch(0.82_0.12_75/0.35)] flex items-center justify-center">
                        <PlayCircle className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium truncate">
                          {ex.title}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          3 × 12 · menținere 5s
                        </div>
                      </div>
                      {ex.done ? (
                        <CheckCircle2 className="h-5 w-5 text-primary" />
                      ) : (
                        <span className="text-[10px] rounded-full border px-2 py-0.5 text-muted-foreground">
                          În așteptare
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            {/* Floating card — progress */}
            <div className="hidden sm:flex absolute -bottom-6 -left-8 items-center gap-3 rounded-2xl bg-card border shadow-xl px-4 py-3">
              <div className="h-10 w-10 rounded-full bg-ochre/15 text-ochre flex items-center justify-center">
                <Sparkles className="h-4 w-4" />
              </div>
              <div>
                <div className="text-[11px] text-muted-foreground">
                  Progres săptămânal
                </div>
                <div className="text-sm font-semibold">+14% aderență</div>
              </div>
            </div>
            {/* Floating card — encourage */}
            <div className="hidden md:flex absolute -top-5 -right-4 items-center gap-2 rounded-full bg-primary text-primary-foreground shadow-lg px-4 py-2 text-xs font-medium">
              <Heart className="h-3.5 w-3.5" />
              Așa te vreau!
            </div>
          </div>
        </div>
      </section>

      {/* Stats strip */}
      <section className="border-y border-border/60 bg-secondary/40">
        <div className="container mx-auto px-4 py-8 grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-10 text-center">
          <BigStat value={PRACTITIONER_YEARS} label="ani experiență" />
          <BigStat value={PRACTITIONER_PATIENTS} label="pacienți tratați" />
          <BigStat value="24/7" label="acces la platformă" />
          <BigStat value="1-la-1" label="abordare personalizată" />
        </div>
      </section>

      {/* Despre mine */}
      <section id="despre" className="relative py-20 md:py-28">
        <div className="container mx-auto px-4 grid md:grid-cols-[0.95fr_1.4fr] gap-12 items-center">
          <div className="relative">
            {/* Portrait card */}
            <div className="relative aspect-[4/5] rounded-[2rem] bg-gradient-to-br from-primary/25 via-[oklch(0.78_0.11_90/0.35)] to-[oklch(0.92_0.03_75)] border overflow-hidden">
              <div className="absolute inset-0 bg-dots opacity-60 [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]" />
              {/* Decorative leaf icon */}
              <Leaf className="absolute top-6 right-6 h-8 w-8 text-primary/60" />
              <div className="absolute bottom-0 left-0 right-0 p-7">
                <div className="inline-flex items-center gap-1.5 rounded-full bg-background/80 backdrop-blur px-3 py-1 text-[11px] font-medium mb-4">
                  <MapPin className="h-3 w-3 text-primary" />
                  {PRACTITIONER_LOCATION}
                </div>
                <div className="font-serif text-4xl leading-tight text-foreground">
                  {PRACTITIONER_NAME}
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  {PRACTITIONER_TITLE}
                </div>
              </div>
            </div>
            {/* Decorative pill behind */}
            <div className="absolute -z-10 -bottom-6 -right-6 h-40 w-40 rounded-full bg-ochre/15 blur-2xl" />
          </div>
          <div>
            <SectionLabel>Despre mine</SectionLabel>
            <h2 className="font-serif text-4xl md:text-6xl leading-[1.05] mt-4">
              Tratez cauza,
              <br />
              nu doar{" "}
              <span className="italic accent-underline">simptomul</span>.
            </h2>
            <p className="mt-7 text-muted-foreground leading-relaxed max-w-xl text-base md:text-lg">
              Cu {PRACTITIONER_YEARS} ani de experiență în recuperare
              musculo-scheletală, post-chirurgicală și sportivă, lucrez cu
              fiecare pacient individual — de la prima evaluare până la
              revenirea completă la activitatea dorită. Platforma aceasta este
              instrumentul pe care îl folosesc pentru a rămâne alături de tine
              și între ședințe.
            </p>

            <div className="mt-9 flex items-center gap-6 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <Phone className="h-4 w-4 text-primary" />
                Programări directe
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Heart className="h-4 w-4 text-primary" />
                Follow-up continuu
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Procesul */}
      <section
        id="proces"
        className="relative py-20 md:py-28 bg-secondary/50 border-y border-border/60 overflow-hidden"
      >
        <div className="absolute inset-0 bg-dots opacity-40 [mask-image:linear-gradient(to_bottom,transparent,black_30%,black_70%,transparent)]" />
        <div className="relative container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <SectionLabel>Procesul</SectionLabel>
            <h2 className="font-serif text-4xl md:text-6xl leading-[1.05] mt-4">
              De la evaluare la{" "}
              <span className="italic text-primary">recuperare completă</span>
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <StepCard
              step="01"
              title="Evaluare în cabinet"
              description="Ne întâlnim, evaluez starea actuală, obiectivele tale și construim împreună planul de recuperare."
            />
            <StepCard
              step="02"
              title="Primești planul video"
              description="Îți aloc exerciții din biblioteca video, cu instrucțiuni clare și adnotări pe fiecare mișcare importantă."
              featured
            />
            <StepCard
              step="03"
              title="Ajustăm pe parcurs"
              description="Văd ce faci acasă — aderență, durere, dificultate — și modific planul ca să avansezi eficient și sigur."
            />
          </div>
        </div>
      </section>

      {/* Platforma */}
      <section id="platforma" className="py-20 md:py-28">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <SectionLabel>Platforma</SectionLabel>
            <h2 className="font-serif text-4xl md:text-6xl leading-[1.05] mt-4">
              Un singur loc pentru{" "}
              <span className="italic accent-underline">recuperarea ta</span>
            </h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 max-w-6xl mx-auto">
            <FeatureCard
              icon={<Video className="h-5 w-5" />}
              title="Bibliotecă video"
              description="Videoclipuri demonstrative pentru fiecare exercițiu, cu adnotări pe secundă de la mine."
            />
            <FeatureCard
              icon={<Calendar className="h-5 w-5" />}
              title="Rutină zilnică"
              description="Vezi clar ce ai de făcut astăzi, fără să te întrebi ce urmează sau cât să faci."
              tone="ochre"
            />
            <FeatureCard
              icon={<BarChart3 className="h-5 w-5" />}
              title="Progres măsurat"
              description="Nivel de durere, repetări finalizate, aderență — vizualizate în grafice simple."
            />
            <FeatureCard
              icon={<MessageSquare className="h-5 w-5" />}
              title="Comunicare directă"
              description="Pune întrebări scurte când ai dubii, fără să aștepți următoarea ședință."
              tone="ochre"
            />
            <FeatureCard
              icon={<Activity className="h-5 w-5" />}
              title="Progresie inteligentă"
              description="Când ești gata, cresc dificultatea sau volumul pe baza feedback-ului tău."
            />
            <FeatureCard
              icon={<ShieldCheck className="h-5 w-5" />}
              title="Intimitate garantată"
              description="Datele tale medicale sunt stocate securizat, respectând GDPR. Doar eu le văd."
              tone="ochre"
            />
          </div>
        </div>
      </section>

      {/* Păreri */}
      <section
        id="pareri"
        className="relative py-20 md:py-28 bg-secondary/50 border-y border-border/60 overflow-hidden"
      >
        <div className="absolute inset-0 bg-dots opacity-40 [mask-image:linear-gradient(to_bottom,transparent,black_30%,black_70%,transparent)]" />
        <div className="relative container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <SectionLabel>Păreri pacienți</SectionLabel>
            <h2 className="font-serif text-4xl md:text-6xl leading-[1.05] mt-4">
              Rezultate reale,{" "}
              <span className="italic text-primary">oameni reali</span>
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            <Testimonial
              initials="AM"
              name="Andreea M."
              context="Post-operator genunchi"
              quote="Am revenit la alergat în 4 luni. Faptul că aveam fiecare exercițiu video pe telefon a făcut o diferență uriașă — nu mai uitam cum se execută corect."
            />
            <Testimonial
              initials="RG"
              name="Radu G."
              context="Durere cronică lombară"
              quote="Platforma mă ținea responsabil. Vedeam că notez durerea în fiecare seară și aveam un grafic care chiar arăta că mă fac bine."
              featured
            />
            <Testimonial
              initials="MV"
              name="Maria V."
              context="Recuperare post-accident"
              quote="Adnotările pe video la momentul exact m-au ajutat să nu fac greșeli. Când aveam o întrebare, răspunsul venea în câteva ore."
            />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4">
          <div className="relative overflow-hidden rounded-[2rem] border bg-gradient-to-br from-primary via-[oklch(0.48_0.09_160)] to-[oklch(0.38_0.07_150)] text-primary-foreground p-10 md:p-16">
            <div className="absolute inset-0 bg-dots opacity-20 [mask-image:radial-gradient(ellipse_at_top_right,black,transparent_70%)]" />
            <div className="absolute -top-10 -right-10 h-48 w-48 rounded-full bg-ochre/30 blur-3xl" />
            <div className="relative max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/15 backdrop-blur px-3 py-1 text-xs font-medium mb-6">
                <Sparkles className="h-3.5 w-3.5" />
                Începe azi
              </div>
              <h2 className="font-serif text-4xl md:text-6xl leading-[1.05] mb-5">
                Pregătit să începi{" "}
                <span className="italic">recuperarea</span>?
              </h2>
              <p className="text-primary-foreground/85 mb-9 leading-relaxed text-base md:text-lg">
                Dacă ești deja pacient, intră direct în cont pentru a-ți vedea
                planul. Dacă vrei o evaluare, programează o consultație — te
                aștept la cabinet.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link href="/login">
                  <Button
                    size="lg"
                    className="h-12 px-8 text-base gap-2 bg-background text-foreground hover:bg-background/90 w-full sm:w-auto"
                  >
                    Intră în cont <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <a href="mailto:contact@physioconnect.ro">
                  <Button
                    size="lg"
                    variant="outline"
                    className="h-12 px-8 text-base bg-white/10 border-white/30 text-white hover:bg-white/20 hover:text-white w-full sm:w-auto"
                  >
                    Programează consultație
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12 bg-secondary/40">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-6 text-sm">
          <div className="flex items-center gap-2.5">
            <LogoMark small />
            <div className="flex flex-col leading-tight">
              <span className="font-semibold">PhysioConnect</span>
              <span className="text-xs text-muted-foreground">
                &copy; {new Date().getFullYear()} · Cabinet personal
              </span>
            </div>
          </div>
          <div className="flex items-center gap-8 text-muted-foreground">
            <span className="hover:text-foreground transition cursor-pointer">
              Confidențialitate
            </span>
            <span className="hover:text-foreground transition cursor-pointer">
              Termeni
            </span>
            <span className="hover:text-foreground transition cursor-pointer">
              Contact
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}

/* ——— Components ——— */

function LogoMark({ small = false }: { small?: boolean }) {
  const size = small ? "h-7 w-7" : "h-9 w-9";
  const icon = small ? "h-3.5 w-3.5" : "h-4.5 w-4.5";
  return (
    <div
      className={`${size} relative rounded-[0.85rem] bg-gradient-to-br from-primary to-[oklch(0.35_0.07_155)] text-primary-foreground flex items-center justify-center shadow-sm`}
    >
      <Activity className={icon} />
      <span className="absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full bg-ochre ring-2 ring-background" />
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
      <span className="h-px w-6 bg-primary/50" />
      {children}
      <span className="h-px w-6 bg-primary/50" />
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
  tone = "primary",
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  tone?: "primary" | "ochre";
}) {
  const iconBg =
    tone === "ochre"
      ? "bg-ochre/15 text-ochre group-hover:bg-ochre group-hover:text-white"
      : "bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white";
  return (
    <div className="group rounded-2xl border bg-card p-6 hover:border-primary/40 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-primary/5 transition-all">
      <div
        className={`h-11 w-11 rounded-xl flex items-center justify-center mb-5 transition-colors ${iconBg}`}
      >
        {icon}
      </div>
      <h3 className="font-semibold mb-1.5 text-base">{title}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed">
        {description}
      </p>
    </div>
  );
}

function StepCard({
  step,
  title,
  description,
  featured = false,
}: {
  step: string;
  title: string;
  description: string;
  featured?: boolean;
}) {
  return (
    <div
      className={`relative rounded-2xl border p-7 transition-all ${
        featured
          ? "bg-card border-primary/30 shadow-xl shadow-primary/10 md:-translate-y-2"
          : "bg-card/70 hover:bg-card hover:shadow-lg"
      }`}
    >
      <div className="flex items-center gap-3 mb-4">
        <div
          className={`h-10 w-10 rounded-full flex items-center justify-center font-serif text-lg ${
            featured
              ? "bg-primary text-primary-foreground"
              : "bg-secondary text-primary border border-primary/20"
          }`}
        >
          {step}
        </div>
        <div className="h-px flex-1 bg-border" />
      </div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed">
        {description}
      </p>
    </div>
  );
}

function BigStat({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <div className="font-serif text-4xl md:text-5xl text-foreground">
        {value}
      </div>
      <div className="text-xs uppercase tracking-[0.14em] text-muted-foreground">
        {label}
      </div>
    </div>
  );
}

function Testimonial({
  initials,
  name,
  context,
  quote,
  featured = false,
}: {
  initials: string;
  name: string;
  context: string;
  quote: string;
  featured?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl border p-7 flex flex-col h-full ${
        featured
          ? "bg-card shadow-xl shadow-primary/10 border-primary/30 md:-translate-y-3"
          : "bg-card/80"
      }`}
    >
      <Quote className="h-7 w-7 text-ochre/60 mb-4" />
      <p className="text-foreground/90 leading-relaxed flex-1 font-serif text-lg italic">
        &ldquo;{quote}&rdquo;
      </p>
      <div className="mt-6 pt-5 border-t flex items-center gap-3">
        <div
          className={`h-11 w-11 rounded-full font-semibold text-sm flex items-center justify-center ${
            featured
              ? "bg-primary text-primary-foreground"
              : "bg-primary/10 text-primary"
          }`}
        >
          {initials}
        </div>
        <div>
          <div className="text-sm font-semibold">{name}</div>
          <div className="text-xs text-muted-foreground">{context}</div>
        </div>
      </div>
    </div>
  );
}

function MiniStat({
  label,
  value,
  icon: Icon,
  tone = "muted",
}: {
  label: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
  tone?: "primary" | "ochre" | "muted";
}) {
  const toneClass =
    tone === "primary"
      ? "bg-primary/10 text-primary"
      : tone === "ochre"
      ? "bg-ochre/15 text-ochre"
      : "bg-muted text-muted-foreground";
  return (
    <div className="rounded-xl border bg-background/70 p-3">
      <div
        className={`inline-flex items-center gap-1 text-[10px] font-medium px-1.5 py-0.5 rounded-md ${toneClass}`}
      >
        <Icon className="h-3 w-3" />
        {label}
      </div>
      <div className="text-lg font-bold mt-1.5">{value}</div>
    </div>
  );
}
