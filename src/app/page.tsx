import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Activity,
  Video,
  Users,
  BarChart3,
  Calendar,
  MessageSquare,
  CheckCircle2,
  PlayCircle,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Heart,
  TrendingUp,
} from "lucide-react";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b bg-white/80 backdrop-blur-md">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <Activity className="h-5 w-5" />
            </div>
            <span className="text-xl font-bold tracking-tight">
              PhysioConnect
            </span>
          </Link>
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
            <a href="#features" className="hover:text-foreground transition">
              Funcționalități
            </a>
            <a href="#how" className="hover:text-foreground transition">
              Cum funcționează
            </a>
            <a href="#audience" className="hover:text-foreground transition">
              Pentru cine
            </a>
          </nav>
          <div className="flex items-center gap-2">
            <Link href="/login">
              <Button variant="ghost" size="sm">
                Autentificare
              </Button>
            </Link>
            <Link href="/login">
              <Button size="sm" className="gap-1">
                Începe <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        {/* Decorative blobs */}
        <div className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute top-20 -right-24 h-96 w-96 rounded-full bg-emerald-300/20 blur-3xl" />

        <div className="relative container mx-auto px-4 pt-16 pb-20 md:pt-24 md:pb-32 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border bg-white px-3 py-1 text-xs font-medium text-primary mb-6 shadow-sm">
              <Sparkles className="h-3.5 w-3.5" />
              Platformă dedicată recuperării fizice
            </div>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-slate-900 leading-[1.05]">
              Recuperarea ta,{" "}
              <span className="bg-gradient-to-r from-primary to-emerald-500 bg-clip-text text-transparent">
                ghidată video
              </span>{" "}
              zi de zi.
            </h1>
            <p className="mt-6 text-lg text-slate-600 max-w-xl">
              Fizioterapeutul tău îți prescrie exerciții personalizate prin
              video, iar tu le urmezi acasă — cu progres urmărit, durere
              înregistrată și sprijin direct, oriunde te-ai afla.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <Link href="/login">
                <Button size="lg" className="gap-2 h-12 text-base px-6">
                  Începe parcursul tău <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/login">
                <Button
                  size="lg"
                  variant="outline"
                  className="gap-2 h-12 text-base px-6"
                >
                  <PlayCircle className="h-4 w-4" />
                  Vezi demo
                </Button>
              </Link>
            </div>
            <div className="mt-8 flex items-center gap-6 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-primary" />
                Date confidențiale
              </span>
              <span className="inline-flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                Fără instalare
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Heart className="h-4 w-4 text-primary" />
                Pentru pacient și clinică
              </span>
            </div>
          </div>

          {/* Hero visual — stylized dashboard preview */}
          <div className="relative">
            <div className="relative rounded-3xl border bg-white shadow-2xl shadow-primary/10 overflow-hidden">
              {/* Fake topbar */}
              <div className="flex items-center gap-1.5 px-4 py-3 border-b bg-slate-50">
                <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
                <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                <span className="ml-3 text-xs text-muted-foreground">
                  dashboard — azi
                </span>
              </div>
              <div className="p-5 space-y-4">
                {/* Stats row */}
                <div className="grid grid-cols-3 gap-3">
                  <MiniStat label="Astăzi" value="3/5" icon={CheckCircle2} />
                  <MiniStat label="Săptămână" value="82%" icon={TrendingUp} />
                  <MiniStat label="Durere" value="2.4" icon={Activity} />
                </div>
                {/* Exercise rows */}
                <div className="space-y-2.5">
                  {[
                    { title: "Rotație externă umăr", done: true },
                    { title: "Extensii genunchi", done: true },
                    { title: "Mobilizare cervicală", done: false },
                  ].map((ex) => (
                    <div
                      key={ex.title}
                      className="flex items-center gap-3 p-3 rounded-xl border"
                    >
                      <div className="h-10 w-14 rounded-lg bg-gradient-to-br from-primary/20 to-emerald-200 flex items-center justify-center">
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
                        <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                      ) : (
                        <span className="text-xs rounded-full border px-2 py-0.5 text-muted-foreground">
                          În așteptare
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            {/* Floating badge */}
            <div className="hidden sm:flex absolute -bottom-6 -left-6 items-center gap-2 rounded-2xl bg-white border shadow-xl px-4 py-3">
              <div className="h-9 w-9 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                <TrendingUp className="h-4 w-4" />
              </div>
              <div>
                <div className="text-xs text-muted-foreground">
                  Progres săptămânal
                </div>
                <div className="text-sm font-semibold">+14% aderență</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stat band */}
      <section className="border-y bg-slate-50">
        <div className="container mx-auto px-4 py-10 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <Stat value="Video HD" label="YouTube & Vimeo integrate" />
          <Stat value="Adnotări" label="Note pe minut/secundă" />
          <Stat value="Progres" label="Durere, repetări, aderență" />
          <Stat value="Mobile" label="Funcționează pe orice device" />
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="py-20 md:py-28">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <p className="text-sm font-semibold text-primary uppercase tracking-wider">
              Cum funcționează
            </p>
            <h2 className="text-3xl md:text-4xl font-bold mt-2">
              De la prima ședință la recuperare completă
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <StepCard
              step="01"
              title="Fizioterapeutul prescrie"
              description="Doctorul tău alege exerciții din biblioteca video, setează seturi, repetări și frecvență, apoi îți trimite planul."
            />
            <StepCard
              step="02"
              title="Tu urmezi acasă"
              description="Deschizi aplicația, urmărești videoclipurile cu instrucțiuni clare și bifezi exercițiile când le termini."
            />
            <StepCard
              step="03"
              title="Progresul e monitorizat"
              description="Nivelul de durere și aderența se înregistrează automat. Clinica ajustează planul pe măsură ce te recuperezi."
            />
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 md:py-28 bg-slate-50 border-y">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <p className="text-sm font-semibold text-primary uppercase tracking-wider">
              Funcționalități
            </p>
            <h2 className="text-3xl md:text-4xl font-bold mt-2">
              Tot ce ai nevoie pentru recuperare
            </h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            <FeatureCard
              icon={<Video className="h-5 w-5" />}
              title="Bibliotecă video exerciții"
              description="Videoclipuri YouTube, Vimeo sau încărcate direct, cu adnotări pe secundă de la fizioterapeut."
            />
            <FeatureCard
              icon={<Calendar className="h-5 w-5" />}
              title="Rutine programate"
              description="Exerciții zilnice cu calendar personalizat adaptat planului tău de recuperare."
            />
            <FeatureCard
              icon={<BarChart3 className="h-5 w-5" />}
              title="Grafice de progres"
              description="Durere, repetări finalizate, aderență săptămânală — totul vizualizat clar, pe termen lung."
            />
            <FeatureCard
              icon={<Users className="h-5 w-5" />}
              title="Managementul pacienților"
              description="Clinicile gestionează toți pacienții dintr-un singur panou, cu planuri personalizate pentru fiecare."
            />
            <FeatureCard
              icon={<MessageSquare className="h-5 w-5" />}
              title="Mesagerie directă"
              description="Întrebări rapide, ajustări de plan sau clarificări — comunici direct cu fizioterapeutul tău."
            />
            <FeatureCard
              icon={<Activity className="h-5 w-5" />}
              title="Progresie inteligentă"
              description="Sugestii automate de creștere a dificultății pe baza aderenței și a feedback-ului de durere."
            />
          </div>
        </div>
      </section>

      {/* Audience split */}
      <section id="audience" className="py-20 md:py-28">
        <div className="container mx-auto px-4 grid md:grid-cols-2 gap-6 max-w-6xl">
          <div className="rounded-3xl border p-8 bg-gradient-to-br from-primary/5 to-white">
            <div className="h-12 w-12 rounded-xl bg-primary text-primary-foreground flex items-center justify-center mb-5">
              <Users className="h-6 w-6" />
            </div>
            <h3 className="text-2xl font-bold mb-3">Pentru pacienți</h3>
            <p className="text-slate-600 mb-6">
              Acces mobil la planul tău de tratament, videoclipuri pe care le
              poți revedea oricând și sentimentul că fizioterapeutul tău e
              alături de tine chiar și între ședințe.
            </p>
            <ul className="space-y-2.5 text-sm">
              {[
                "Exerciții video cu instrucțiuni clare",
                "Jurnal de durere și repetări",
                "Notificări pentru rutina zilnică",
                "Mesaje directe cu fizioterapeutul",
              ].map((i) => (
                <li key={i} className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                  <span>{i}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-3xl border p-8 bg-gradient-to-br from-emerald-50 to-white">
            <div className="h-12 w-12 rounded-xl bg-emerald-600 text-white flex items-center justify-center mb-5">
              <Activity className="h-6 w-6" />
            </div>
            <h3 className="text-2xl font-bold mb-3">Pentru fizioterapeuți</h3>
            <p className="text-slate-600 mb-6">
              O singură platformă pentru gestionarea pacienților, bibliotecii
              video și planurilor de tratament — cu analize care îți arată cine
              are nevoie de atenție suplimentară.
            </p>
            <ul className="space-y-2.5 text-sm">
              {[
                "Bibliotecă video cu adnotări",
                "Planuri de tratament reutilizabile",
                "Analize de aderență și durere",
                "Note de ședință per pacient",
              ].map((i) => (
                <li key={i} className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 mt-0.5 shrink-0" />
                  <span>{i}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="pb-20">
        <div className="container mx-auto px-4">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary to-emerald-600 text-white p-10 md:p-16 text-center">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,white,transparent_60%)] opacity-10" />
            <div className="relative">
              <h2 className="text-3xl md:text-4xl font-bold mb-3">
                Fii alături de pacienții tăi, oriunde sunt.
              </h2>
              <p className="text-white/90 max-w-xl mx-auto mb-8">
                Încearcă PhysioConnect acum — intră în cont ca fizioterapeut
                sau pacient și vezi cum funcționează întregul flux.
              </p>
              <Link href="/login">
                <Button
                  size="lg"
                  variant="secondary"
                  className="h-12 px-8 text-base gap-2"
                >
                  Intră în aplicație <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-10 bg-slate-50">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-slate-500">
          <div className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary" />
            <span className="font-semibold text-slate-700">PhysioConnect</span>
            <span className="text-slate-400">
              &copy; {new Date().getFullYear()}
            </span>
          </div>
          <div className="flex items-center gap-6">
            <span>Confidențialitate</span>
            <span>Termeni</span>
            <span>Contact</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="group rounded-2xl border bg-white p-6 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5 transition-all">
      <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-white transition-colors">
        {icon}
      </div>
      <h3 className="font-semibold mb-1.5">{title}</h3>
      <p className="text-sm text-slate-600 leading-relaxed">{description}</p>
    </div>
  );
}

function StepCard({
  step,
  title,
  description,
}: {
  step: string;
  title: string;
  description: string;
}) {
  return (
    <div className="relative rounded-2xl border bg-white p-6">
      <div className="text-4xl font-bold text-primary/20 mb-2">{step}</div>
      <h3 className="text-lg font-semibold mb-1.5">{title}</h3>
      <p className="text-sm text-slate-600 leading-relaxed">{description}</p>
    </div>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <div className="text-2xl md:text-3xl font-bold text-primary">
        {value}
      </div>
      <div className="text-xs md:text-sm text-slate-500 mt-1">{label}</div>
    </div>
  );
}

function MiniStat({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <div className="rounded-xl border bg-slate-50 p-3">
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <Icon className="h-3 w-3" />
        {label}
      </div>
      <div className="text-lg font-bold mt-0.5">{value}</div>
    </div>
  );
}
