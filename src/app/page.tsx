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
} from "lucide-react";

// Copy is written for a single practitioner's personal platform.
// Replace PRACTITIONER_* below with the real therapist's details.
const PRACTITIONER_NAME = "Dr. Physio";
const PRACTITIONER_TITLE = "Kinetoterapeut principal";
const PRACTITIONER_YEARS = "12+";
const PRACTITIONER_PATIENTS = "600+";
const PRACTITIONER_LOCATION = "București";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-white text-slate-900">
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
            <a href="#despre" className="hover:text-foreground transition">
              Despre mine
            </a>
            <a href="#proces" className="hover:text-foreground transition">
              Procesul
            </a>
            <a
              href="#platforma"
              className="hover:text-foreground transition"
            >
              Platforma
            </a>
            <a href="#pareri" className="hover:text-foreground transition">
              Păreri pacienți
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
                Intră în cont <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute top-20 -right-24 h-96 w-96 rounded-full bg-emerald-300/20 blur-3xl" />

        <div className="relative container mx-auto px-4 pt-14 pb-16 md:pt-24 md:pb-28 grid md:grid-cols-[1.1fr_1fr] gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border bg-white px-3 py-1 text-xs font-medium text-primary mb-6 shadow-sm">
              <Stethoscope className="h-3.5 w-3.5" />
              Cabinet de kinetoterapie — {PRACTITIONER_LOCATION}
            </div>
            <h1 className="font-serif text-5xl md:text-7xl leading-[1.02] tracking-tight text-slate-900">
              Recuperare{" "}
              <span className="italic text-primary">personalizată</span>,
              <br />
              acasă și în cabinet.
            </h1>
            <p className="mt-6 text-lg text-slate-600 max-w-xl leading-relaxed">
              Îți prescriu exerciții video adaptate stării tale, iar tu le
              urmezi acasă după programul nostru. Fiecare repetare, fiecare
              nivel de durere e înregistrat — astfel îți ajustez planul
              precis, săptămână de săptămână.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <Link href="/login">
                <Button size="lg" className="gap-2 h-12 text-base px-6">
                  Accesează planul meu <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <a href="#proces">
                <Button
                  size="lg"
                  variant="outline"
                  className="gap-2 h-12 text-base px-6"
                >
                  <PlayCircle className="h-4 w-4" />
                  Vezi cum funcționează
                </Button>
              </a>
            </div>
            <div className="mt-10 flex flex-wrap items-center gap-6 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-primary" />
                Date confidențiale, GDPR
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Clock3 className="h-4 w-4 text-primary" />
                Acces 24/7 la exerciții
              </span>
              <span className="inline-flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                Fără instalare
              </span>
            </div>
          </div>

          {/* Hero visual — stylized dashboard preview */}
          <div className="relative">
            <div className="relative rounded-3xl border bg-white shadow-2xl shadow-primary/10 overflow-hidden">
              <div className="flex items-center gap-1.5 px-4 py-3 border-b bg-slate-50">
                <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
                <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                <span className="ml-3 text-xs text-muted-foreground">
                  planul meu — marți
                </span>
              </div>
              <div className="p-5 space-y-4">
                <div className="grid grid-cols-3 gap-3">
                  <MiniStat label="Astăzi" value="3/5" icon={CheckCircle2} />
                  <MiniStat label="Săptămână" value="82%" icon={Activity} />
                  <MiniStat label="Durere" value="2.4" icon={BarChart3} />
                </div>
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
            <div className="hidden sm:flex absolute -bottom-6 -left-6 items-center gap-2 rounded-2xl bg-white border shadow-xl px-4 py-3">
              <div className="h-9 w-9 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                <Activity className="h-4 w-4" />
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

      {/* Credentials band */}
      <section id="despre" className="border-y bg-slate-50">
        <div className="container mx-auto px-4 py-16 grid md:grid-cols-[1fr_1.4fr] gap-10 items-center">
          <div className="relative">
            <div className="aspect-[4/5] rounded-3xl bg-gradient-to-br from-primary/20 via-emerald-200/40 to-slate-200 border flex items-end p-8">
              <div className="text-slate-700">
                <div className="text-sm font-medium">
                  {PRACTITIONER_LOCATION}
                </div>
                <div className="font-serif text-3xl leading-tight mt-1">
                  {PRACTITIONER_NAME}
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  {PRACTITIONER_TITLE}
                </div>
              </div>
            </div>
          </div>
          <div>
            <p className="text-sm font-semibold text-primary uppercase tracking-wider">
              Despre mine
            </p>
            <h2 className="font-serif text-4xl md:text-5xl leading-tight mt-3 text-slate-900">
              Tratez cauza, nu doar simptomul.
            </h2>
            <p className="mt-6 text-slate-600 leading-relaxed max-w-xl">
              Cu {PRACTITIONER_YEARS} ani de experiență în recuperare
              musculo-scheletală, post-chirurgicală și sportivă, lucrez cu
              fiecare pacient individual — de la prima evaluare până la
              revenirea completă la activitatea dorită. Platforma aceasta este
              instrumentul pe care îl folosesc pentru a rămâne alături de tine
              și între ședințe.
            </p>

            <div className="mt-8 grid grid-cols-3 gap-6 max-w-md">
              <CredStat value={PRACTITIONER_YEARS} label="ani experiență" />
              <CredStat
                value={PRACTITIONER_PATIENTS}
                label="pacienți tratați"
              />
              <CredStat value="1‑la‑1" label="abordare personală" />
            </div>

            <div className="mt-8 flex items-center gap-6 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="h-4 w-4 text-primary" />
                {PRACTITIONER_LOCATION}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Phone className="h-4 w-4 text-primary" />
                Programări directe
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="proces" className="py-20 md:py-28">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <p className="text-sm font-semibold text-primary uppercase tracking-wider">
              Procesul
            </p>
            <h2 className="font-serif text-4xl md:text-5xl leading-tight mt-3">
              De la evaluare la recuperare completă
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
            />
            <StepCard
              step="03"
              title="Ajustăm pe parcurs"
              description="Văd ce faci acasă — aderență, durere, dificultate — și modific planul ca să avansezi eficient și sigur."
            />
          </div>
        </div>
      </section>

      {/* Platform features */}
      <section
        id="platforma"
        className="py-20 md:py-28 bg-slate-50 border-y"
      >
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <p className="text-sm font-semibold text-primary uppercase tracking-wider">
              Platforma
            </p>
            <h2 className="font-serif text-4xl md:text-5xl leading-tight mt-3">
              Un singur loc pentru recuperarea ta
            </h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            <FeatureCard
              icon={<Video className="h-5 w-5" />}
              title="Bibliotecă video"
              description="Videoclipuri demonstrative pentru fiecare exercițiu, cu adnotări pe secundă de la mine."
            />
            <FeatureCard
              icon={<Calendar className="h-5 w-5" />}
              title="Rutină zilnică"
              description="Vezi clar ce ai de făcut astăzi, fără să te întrebi ce urmează sau cât să faci."
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
            />
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="pareri" className="py-20 md:py-28">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <p className="text-sm font-semibold text-primary uppercase tracking-wider">
              Păreri pacienți
            </p>
            <h2 className="font-serif text-4xl md:text-5xl leading-tight mt-3">
              Rezultate reale, oameni reali
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
      <section className="pb-20">
        <div className="container mx-auto px-4">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary to-emerald-600 text-white p-10 md:p-16">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,white,transparent_60%)] opacity-10" />
            <div className="relative max-w-2xl">
              <h2 className="font-serif text-4xl md:text-5xl leading-tight mb-4">
                Pregătit să începi recuperarea?
              </h2>
              <p className="text-white/90 mb-8 leading-relaxed">
                Dacă ești deja pacient, intră direct în cont pentru a-ți vedea
                planul. Dacă vrei o evaluare, programează o consultație — te
                aștept la cabinet.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link href="/login">
                  <Button
                    size="lg"
                    variant="secondary"
                    className="h-12 px-8 text-base gap-2"
                  >
                    Intră în cont <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <a href="mailto:contact@physioconnect.ro">
                  <Button
                    size="lg"
                    variant="outline"
                    className="h-12 px-8 text-base bg-white/10 border-white/30 text-white hover:bg-white/20 hover:text-white"
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
      <div className="font-serif text-5xl text-primary/25 mb-2 leading-none">
        {step}
      </div>
      <h3 className="text-lg font-semibold mb-1.5">{title}</h3>
      <p className="text-sm text-slate-600 leading-relaxed">{description}</p>
    </div>
  );
}

function CredStat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <div className="font-serif text-3xl text-slate-900">{value}</div>
      <div className="text-xs text-slate-500 mt-1">{label}</div>
    </div>
  );
}

function Testimonial({
  initials,
  name,
  context,
  quote,
}: {
  initials: string;
  name: string;
  context: string;
  quote: string;
}) {
  return (
    <div className="rounded-2xl border bg-white p-6 flex flex-col h-full">
      <Quote className="h-6 w-6 text-primary/40 mb-4" />
      <p className="text-slate-700 leading-relaxed flex-1">{quote}</p>
      <div className="mt-6 pt-5 border-t flex items-center gap-3">
        <div className="h-10 w-10 rounded-full bg-primary/10 text-primary font-semibold text-sm flex items-center justify-center">
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
