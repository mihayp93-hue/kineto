import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Activity,
  ArrowRight,
  ArrowUpRight,
  Clock3,
  Heart,
  Leaf,
  Star,
  Stethoscope,
} from "lucide-react";

const PRACTITIONER_NAME = "Dr. Physio";
const PRACTITIONER_TITLE = "Kinetoterapeut principal";
const PRACTITIONER_YEARS = "12+";
const PRACTITIONER_PATIENTS = "600+";
const PRACTITIONER_LOCATION = "București";
const ISSUE = "Nr. 1";
const YEAR = new Date().getFullYear();

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* COVER — full-screen editorial opener */}
      <CoverPage />

      {/* CHAPTER 01 — Manifesto */}
      <Manifesto />

      {/* MARQUEE — condition ticker */}
      <MarqueeBand />

      {/* CHAPTER 02 — Method */}
      <Method />

      {/* CHAPTER 03 — Case Studies (horizontal scroll) */}
      <CaseStudies />

      {/* CHAPTER 04 — Features bento */}
      <Features />

      {/* CHAPTER 05 — Numbers */}
      <Numbers />

      {/* CODA — enter */}
      <Coda />

      {/* Colophon */}
      <Colophon />
    </div>
  );
}

/* ====================================================================
   COVER
   ==================================================================== */
function CoverPage() {
  return (
    <section className="relative min-h-[92vh] overflow-hidden">
      {/* Paper grain + subtle dot pattern */}
      <div className="pointer-events-none absolute inset-0 bg-dots opacity-50 [mask-image:radial-gradient(ellipse_at_top,black,transparent_75%)]" />
      <div className="pointer-events-none absolute top-20 right-10 h-[500px] w-[500px] rounded-full bg-primary/10 blur-3xl" />

      {/* Top masthead */}
      <div className="relative border-b border-foreground/20">
        <div className="mx-auto max-w-[1400px] px-6 py-4 flex items-center justify-between text-[11px] uppercase tracking-[0.24em] text-muted-foreground">
          <span className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            {ISSUE} · {YEAR}
          </span>
          <span className="hidden md:block">
            Jurnal personal de kinetoterapie
          </span>
          <div className="flex items-center gap-5">
            <Link href="/login" className="hover:text-foreground transition">
              Cont pacient →
            </Link>
          </div>
        </div>
      </div>

      {/* Hero grid — asymmetric */}
      <div className="relative mx-auto max-w-[1400px] px-6 pt-14 md:pt-24 pb-10 md:pb-20 grid grid-cols-12 gap-6">
        {/* Left margin note */}
        <aside className="hidden md:block col-span-2 pt-6">
          <div className="sidewriter text-muted-foreground">
            Ediția de {formatMonth()}
          </div>
        </aside>

        {/* Headline */}
        <div className="col-span-12 md:col-span-7">
          <div className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-6">
            Volumul 01 · Recuperare
          </div>
          <h1 className="font-serif leading-[0.9] tracking-tight text-[clamp(3.5rem,10vw,10rem)]">
            Corpul
            <br />
            care{" "}
            <span className="italic text-primary">
              {" "}
              se&nbsp;învață
            </span>
            <br />
            din nou.
          </h1>
          <div className="mt-10 flex items-start gap-8">
            <span className="h-px w-10 bg-foreground mt-3 shrink-0" />
            <p className="font-serif text-xl leading-snug max-w-md text-foreground/80">
              Un cabinet de kinetoterapie în {PRACTITIONER_LOCATION} și o
              platformă care nu te lasă singur între ședințe.
            </p>
          </div>
        </div>

        {/* Right — signature block */}
        <div className="col-span-12 md:col-span-3 md:col-start-10 flex flex-col justify-end">
          <div className="relative border-l-2 border-foreground/80 pl-5 py-1 mb-6">
            <div className="text-[10px] uppercase tracking-[0.24em] text-muted-foreground mb-1">
              Prescripție semnată de
            </div>
            <div className="font-hand text-3xl text-foreground">
              {PRACTITIONER_NAME}
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              {PRACTITIONER_TITLE}
            </div>
          </div>
          <Link href="/login" className="group inline-flex items-center gap-2">
            <span className="font-medium">Intră în cont</span>
            <ArrowUpRight className="h-4 w-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition" />
          </Link>
        </div>
      </div>

      {/* Bottom strip — index */}
      <div className="relative mx-auto max-w-[1400px] px-6 pb-6">
        <div className="border-t border-foreground/15 pt-4 grid grid-cols-2 md:grid-cols-5 gap-4 text-xs text-muted-foreground">
          <IndexItem n="01" label="Manifest" />
          <IndexItem n="02" label="Metoda" />
          <IndexItem n="03" label="Cazuri" />
          <IndexItem n="04" label="Platforma" />
          <IndexItem n="05" label="Intrare" />
        </div>
      </div>
    </section>
  );
}

function IndexItem({ n, label }: { n: string; label: string }) {
  return (
    <div className="flex items-baseline gap-2">
      <span className="font-mono text-[10px] text-primary">{n}</span>
      <span className="font-serif text-base text-foreground">{label}</span>
    </div>
  );
}

/* ====================================================================
   MANIFESTO
   ==================================================================== */
function Manifesto() {
  return (
    <section id="manifest" className="relative py-24 md:py-40 border-t border-foreground/10">
      <div className="mx-auto max-w-[1400px] px-6 grid grid-cols-12 gap-6">
        <ChapterLabel n="01" label="Manifest" />

        <div className="col-span-12 md:col-span-9 md:col-start-4">
          <p className="font-serif text-[clamp(1.75rem,3.5vw,3rem)] leading-[1.15] text-foreground">
            Recuperarea nu e un{" "}
            <span className="italic text-primary">protocol</span>. Este o
            conversație între corp și răbdare — o succesiune zilnică de
            mișcări mici care, pe termen lung, reconstruiesc încrederea
            pierdută după o accidentare, o operație, un episod de durere
            cronică.
          </p>

          <div className="mt-16 grid md:grid-cols-2 gap-12">
            <div>
              <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-3">
                Ce fac
              </div>
              <p className="text-base leading-relaxed text-foreground/80">
                Te evaluez în cabinet, îți construiesc un program
                individual, îți filmez demonstrațiile exercițiilor și îți
                urmăresc aderența prin platformă. Nu copiez planuri — le
                scriu pentru tine.
              </p>
            </div>
            <div>
              <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-3">
                Ce nu fac
              </div>
              <p className="text-base leading-relaxed text-foreground/80">
                Nu lucrez cu mai mulți pacienți pe oră. Nu trimit
                PDF-uri standard. Nu dispar între ședințe. Platforma este
                proba că urmăresc ce faci acasă — nu doar ce faci la
                cabinet.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ====================================================================
   MARQUEE — conditions ticker
   ==================================================================== */
function MarqueeBand() {
  const items = [
    "Hernie de disc lombară",
    "Post-operator genunchi",
    "Entorsă gleznă",
    "Durere cronică cervicală",
    "Recuperare umăr",
    "Accident sportiv",
    "Scolioză",
    "Rigiditate șold",
    "Tendinită cotul",
    "Post-fractură",
  ];
  const loop = [...items, ...items];
  return (
    <section className="relative border-y border-foreground/80 bg-foreground text-background py-4 overflow-hidden">
      <div className="flex gap-12 ticker-track whitespace-nowrap">
        {loop.map((it, i) => (
          <span
            key={i}
            className="font-serif text-2xl md:text-4xl italic flex items-center gap-12"
          >
            {it}
            <Star className="h-4 w-4 text-primary shrink-0" />
          </span>
        ))}
      </div>
    </section>
  );
}

/* ====================================================================
   METHOD — three chapters
   ==================================================================== */
function Method() {
  const chapters = [
    {
      n: "I",
      title: "Evaluare",
      body:
        "Ne vedem în cabinet. Evaluez mobilitatea, forța, calitatea mișcării și discutăm istoricul tău medical. Nu e o rutină — ascult, observ, notez.",
      margin: "45 de minute",
    },
    {
      n: "II",
      title: "Prescripție",
      body:
        "Construiesc un plan de exerciții exact pentru tine. Fiecare exercițiu e filmat cu adnotări pe momentele critice. Îl primești pe platformă în 24 de ore.",
      margin: "Video cu adnotări",
    },
    {
      n: "III",
      title: "Ajustare",
      body:
        "Văd în fiecare seară ce ai făcut, cât a durut, cât de greu ți s-a părut. Modific planul săptămânal în funcție de cum răspunde corpul tău.",
      margin: "Săptămână de săptămână",
    },
  ];
  return (
    <section id="metoda" className="relative py-24 md:py-40">
      <div className="mx-auto max-w-[1400px] px-6">
        <div className="grid grid-cols-12 gap-6 mb-16">
          <ChapterLabel n="02" label="Metoda" />
          <div className="col-span-12 md:col-span-9 md:col-start-4">
            <h2 className="font-serif text-[clamp(2.5rem,6vw,5.5rem)] leading-[0.95] tracking-tight">
              Trei pași. Niciodată{" "}
              <span className="italic text-primary">grăbit</span>.
            </h2>
          </div>
        </div>

        <div className="space-y-0">
          {chapters.map((c, i) => (
            <ChapterRow key={c.n} {...c} reverse={i % 2 === 1} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ChapterRow({
  n,
  title,
  body,
  margin,
  reverse = false,
}: {
  n: string;
  title: string;
  body: string;
  margin: string;
  reverse?: boolean;
}) {
  return (
    <article
      className={`group grid grid-cols-12 gap-6 py-10 md:py-14 border-t border-foreground/10 first:border-t-0 ${
        reverse ? "md:[&>*:first-child]:order-2" : ""
      }`}
    >
      {/* Big Roman numeral */}
      <div className="col-span-12 md:col-span-4">
        <div className="display-numeral text-[clamp(5rem,14vw,13rem)] text-foreground/90">
          {n}
        </div>
        <div className="mt-2 font-hand text-2xl text-ochre">
          {margin}
        </div>
      </div>

      {/* Text block */}
      <div className="col-span-12 md:col-span-7 md:col-start-6 flex flex-col justify-center">
        <h3 className="font-serif text-4xl md:text-5xl mb-5 tracking-tight">
          {title}
        </h3>
        <p className="text-lg leading-relaxed text-foreground/80 max-w-xl">
          {body}
        </p>
      </div>
    </article>
  );
}

/* ====================================================================
   CASE STUDIES — horizontal scroll
   ==================================================================== */
function CaseStudies() {
  const cases = [
    {
      tag: "Caz 01 · Andreea, 34",
      context: "Post-operator LCA genunchi",
      duration: "4 luni",
      quote:
        "Am revenit la alergat în 4 luni. Faptul că aveam fiecare exercițiu video pe telefon a făcut o diferență uriașă — nu mai uitam cum se execută corect.",
      narrative:
        "Andreea a venit la cabinet la două săptămâni după operație, cu edem persistent și teama firească de a îndoi genunchiul. Planul inițial: 6 exerciții blânde, adnotări video pe fiecare reper critic. La săptămâna a opta — jog ușor pe iarbă. La a șaisprezecea — alergare pe pistă.",
    },
    {
      tag: "Caz 02 · Radu, 51",
      context: "Durere cronică lombară",
      duration: "7 luni",
      quote:
        "Platforma mă ținea responsabil. Vedeam că notez durerea în fiecare seară și aveam un grafic care chiar arăta că mă fac bine.",
      narrative:
        "Radu a trăit cu dureri lombare timp de trei ani. Nu un incident — o slăbiciune. Am construit un program de stabilizare progresivă a zonei centrale, ajustat săptămânal în funcție de scorul de durere pe care îl înregistra în aplicație. La luna a șaptea, dormea opt ore fără rigiditate matinală.",
    },
    {
      tag: "Caz 03 · Maria, 28",
      context: "Recuperare post-accident rutier",
      duration: "9 luni",
      quote:
        "Adnotările pe video la momentul exact m-au ajutat să nu fac greșeli. Când aveam o întrebare, răspunsul venea în câteva ore.",
      narrative:
        "Accident de mașină cu fractură de bazin și contuzie cervicală. Programul a fost construit în etape: imobilizare controlată, mobilizare progresivă, forță, apoi revenire la activitate. Fiecare etapă a avut repere clare, filmate cu adnotări pe fiecare mișcare sensibilă.",
    },
  ];
  return (
    <section id="cazuri" className="relative py-24 md:py-40 border-t border-foreground/10 bg-secondary/40">
      <div className="mx-auto max-w-[1400px] px-6 mb-16 grid grid-cols-12 gap-6">
        <ChapterLabel n="03" label="Cazuri" />
        <div className="col-span-12 md:col-span-9 md:col-start-4">
          <h2 className="font-serif text-[clamp(2.5rem,6vw,5.5rem)] leading-[0.95] tracking-tight">
            Trei oameni.{" "}
            <span className="italic text-primary">Trei reveniri.</span>
          </h2>
        </div>
      </div>

      {/* Horizontal scroller */}
      <div className="relative">
        <div className="no-scrollbar overflow-x-auto overflow-y-hidden snap-x snap-mandatory">
          <div className="flex gap-6 md:gap-10 px-6 md:pl-[calc((100vw-1400px)/2+1.5rem)] md:pr-[calc((100vw-1400px)/2+1.5rem)] pb-4">
            {cases.map((c, i) => (
              <CaseCard key={i} index={i} {...c} />
            ))}
            <div className="shrink-0 w-4" />
          </div>
        </div>
        <div className="mx-auto max-w-[1400px] px-6 mt-6 flex items-center justify-between text-xs text-muted-foreground">
          <span className="font-mono">← glisează →</span>
          <span>3 cazuri studiate</span>
        </div>
      </div>
    </section>
  );
}

function CaseCard({
  index,
  tag,
  context,
  duration,
  quote,
  narrative,
}: {
  index: number;
  tag: string;
  context: string;
  duration: string;
  quote: string;
  narrative: string;
}) {
  return (
    <article className="snap-start shrink-0 w-[88vw] md:w-[620px] bg-card border border-foreground/15 p-8 md:p-10 rounded-sm relative">
      {/* Corner index */}
      <div className="absolute top-4 right-4 font-mono text-[10px] text-muted-foreground">
        {String(index + 1).padStart(2, "0")} / 03
      </div>

      <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-primary mb-4">
        {tag}
      </div>
      <h3 className="font-serif text-3xl md:text-4xl leading-tight mb-2">
        {context}
      </h3>
      <div className="font-hand text-xl text-ochre mb-8">
        Recuperare completă · {duration}
      </div>

      <div className="border-l-2 border-primary pl-5 mb-8">
        <p className="font-serif text-xl italic leading-snug text-foreground/90">
          &ldquo;{quote}&rdquo;
        </p>
      </div>

      <div className="rule-ornament text-[10px] uppercase tracking-[0.2em] mb-5">
        Cronica tratamentului
      </div>

      <p className="text-base leading-relaxed text-foreground/80">
        {narrative}
      </p>
    </article>
  );
}

/* ====================================================================
   FEATURES — bento grid (editorial, asymmetric)
   ==================================================================== */
function Features() {
  return (
    <section id="platforma" className="relative py-24 md:py-40 border-t border-foreground/10">
      <div className="mx-auto max-w-[1400px] px-6">
        <div className="grid grid-cols-12 gap-6 mb-16">
          <ChapterLabel n="04" label="Platforma" />
          <div className="col-span-12 md:col-span-9 md:col-start-4">
            <h2 className="font-serif text-[clamp(2.5rem,6vw,5.5rem)] leading-[0.95] tracking-tight">
              Instrumente cât să fie{" "}
              <span className="italic text-primary">destul</span>.
            </h2>
          </div>
        </div>

        {/* Asymmetric bento grid */}
        <div className="grid grid-cols-12 gap-4 md:gap-5">
          {/* Big feature */}
          <div className="col-span-12 md:col-span-7 md:row-span-2 relative bg-foreground text-background rounded-sm p-8 md:p-10 overflow-hidden min-h-[320px]">
            <div className="absolute inset-0 bg-dots opacity-15" />
            <div className="relative h-full flex flex-col justify-between">
              <div>
                <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-background/60 mb-4">
                  Caracteristică principală
                </div>
                <h3 className="font-serif text-4xl md:text-6xl leading-[1] mb-6">
                  Bibliotecă video cu{" "}
                  <span className="italic text-ochre">adnotări</span>
                </h3>
                <p className="text-background/80 leading-relaxed max-w-md">
                  Fiecare exercițiu este filmat de mine, cu adnotări pe
                  secundă exactă. Când urmărești videoul, vezi pe cronologie
                  exact unde îți trag atenția: &ldquo;cot aici&rdquo;,
                  &ldquo;respiră acum&rdquo;, &ldquo;nu accelera&rdquo;.
                </p>
              </div>
              <div className="flex items-center gap-3 text-sm font-serif italic text-ochre mt-10">
                <span className="h-px w-10 bg-ochre" />
                Funcționează pe orice telefon
              </div>
            </div>
          </div>

          {/* Small features */}
          <FeatureTile
            tag="02"
            title="Rutină zilnică"
            body="Vezi exact ce ai de făcut azi, în ordinea pe care am scris-o eu."
          />
          <FeatureTile
            tag="03"
            title="Jurnal de durere"
            body="Notezi scurt seară de seară: scor, dificultate, observații."
            tone="ochre"
          />
          <FeatureTile
            tag="04"
            title="Mesagerie directă"
            body="Întrebări scurte între ședințe — fără telefoane, fără confuzie."
          />
          <FeatureTile
            tag="05"
            title="Grafice de progres"
            body="Vezi cum scade durerea, cât de regulat lucrezi, unde ești în plan."
          />
          <FeatureTile
            tag="06"
            title="Intimitate totală"
            body="Datele tale medicale sunt criptate. Doar eu le văd. GDPR."
            tone="ochre"
          />
          <FeatureTile
            tag="07"
            title="Progresie inteligentă"
            body="Când ești gata, cresc volumul. Nu înainte. Nu arbitrar."
          />
        </div>
      </div>
    </section>
  );
}

function FeatureTile({
  tag,
  title,
  body,
  tone = "default",
}: {
  tag: string;
  title: string;
  body: string;
  tone?: "default" | "ochre";
}) {
  const isOchre = tone === "ochre";
  return (
    <div
      className={`col-span-12 md:col-span-5 ${
        isOchre
          ? "bg-ochre/15 border border-ochre/30"
          : "bg-card border border-foreground/10"
      } rounded-sm p-6 md:p-7 group hover:border-foreground/30 transition-colors relative`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-primary">
          Cap. {tag}
        </div>
        <ArrowUpRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition" />
      </div>
      <h3 className="font-serif text-2xl md:text-3xl mb-2 leading-tight">
        {title}
      </h3>
      <p className="text-sm text-foreground/70 leading-relaxed">{body}</p>
    </div>
  );
}

/* ====================================================================
   NUMBERS — large display
   ==================================================================== */
function Numbers() {
  return (
    <section className="relative py-24 md:py-40 border-t border-foreground/10">
      <div className="mx-auto max-w-[1400px] px-6">
        <div className="grid grid-cols-12 gap-6 mb-16">
          <div className="col-span-12 md:col-span-9 md:col-start-4">
            <div className="font-hand text-3xl text-ochre mb-2">
              &mdash; în cifre
            </div>
            <h2 className="font-serif text-[clamp(2rem,5vw,4.5rem)] leading-[0.98] tracking-tight">
              Ce mai arată cabinetul, după{" "}
              <span className="italic text-primary">
                {PRACTITIONER_YEARS} ani
              </span>
              .
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-8 md:gap-4 border-t border-foreground/20">
          <BigNumber value={PRACTITIONER_PATIENTS} label="Pacienți tratați" />
          <BigNumber value={PRACTITIONER_YEARS} label="Ani de practică" suffix="ani" />
          <BigNumber value="97%" label="Aderență la plan" />
          <BigNumber value="4.9" label="Scor satisfacție / 5" suffix="★" />
        </div>
      </div>
    </section>
  );
}

function BigNumber({
  value,
  label,
  suffix,
}: {
  value: string;
  label: string;
  suffix?: string;
}) {
  return (
    <div className="col-span-6 md:col-span-3 py-10 md:py-16 border-b border-foreground/20 md:border-b-0 md:border-r last:border-r-0 md:pr-4">
      <div className="flex items-start gap-2">
        <div className="display-numeral text-[clamp(4rem,9vw,8rem)] text-foreground">
          {value}
        </div>
        {suffix && (
          <div className="font-serif text-lg text-muted-foreground mt-3">
            {suffix}
          </div>
        )}
      </div>
      <div className="mt-4 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
        {label}
      </div>
    </div>
  );
}

/* ====================================================================
   CODA — closing CTA
   ==================================================================== */
function Coda() {
  return (
    <section className="relative py-20 md:py-32 border-t border-foreground/10 overflow-hidden">
      <div className="pointer-events-none absolute -bottom-40 -left-20 h-[400px] w-[400px] rounded-full bg-primary/15 blur-3xl" />
      <div className="pointer-events-none absolute -top-20 -right-20 h-[400px] w-[400px] rounded-full bg-ochre/20 blur-3xl" />

      <div className="mx-auto max-w-[1400px] px-6 relative grid grid-cols-12 gap-6">
        <div className="col-span-12 md:col-span-2">
          <div className="font-mono text-[10px] uppercase tracking-[0.24em] text-primary">
            Coda · 05
          </div>
        </div>

        <div className="col-span-12 md:col-span-10">
          <h2 className="font-serif text-[clamp(3rem,9vw,9rem)] leading-[0.9] tracking-tight mb-10">
            Hai să începem.
          </h2>

          <div className="grid md:grid-cols-2 gap-10 max-w-4xl">
            <div className="border-t-2 border-foreground pt-6">
              <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-3">
                Sunt deja pacient
              </div>
              <p className="text-foreground/80 leading-relaxed mb-6">
                Intră direct în cont pentru a-ți vedea planul de azi,
                înregistra completările și comunica cu mine.
              </p>
              <Link href="/login">
                <Button size="lg" className="gap-2 h-12 px-6 rounded-none">
                  Accesează cont
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>

            <div className="border-t-2 border-ochre pt-6">
              <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-3">
                Vreau o evaluare
              </div>
              <p className="text-foreground/80 leading-relaxed mb-6">
                Programează o primă ședință la cabinet. Durează 45 de minute
                și îmi oferă tot ce am nevoie pentru a construi planul.
              </p>
              <a href="mailto:contact@physioconnect.ro">
                <Button
                  size="lg"
                  variant="outline"
                  className="gap-2 h-12 px-6 rounded-none border-foreground"
                >
                  Scrie-mi un email
                  <ArrowUpRight className="h-4 w-4" />
                </Button>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ====================================================================
   COLOPHON — footer
   ==================================================================== */
function Colophon() {
  return (
    <footer className="relative border-t-2 border-foreground">
      <div className="mx-auto max-w-[1400px] px-6 py-10 grid grid-cols-12 gap-6 text-xs">
        <div className="col-span-12 md:col-span-4 flex items-center gap-3">
          <div className="h-9 w-9 rounded-[0.85rem] bg-gradient-to-br from-primary to-[oklch(0.35_0.07_155)] text-primary-foreground flex items-center justify-center relative">
            <Activity className="h-4 w-4" />
            <span className="absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full bg-ochre ring-2 ring-background" />
          </div>
          <div>
            <div className="font-serif text-base leading-none">
              PhysioConnect
            </div>
            <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mt-1">
              Cabinet personal · {PRACTITIONER_LOCATION}
            </div>
          </div>
        </div>

        <div className="col-span-6 md:col-span-3">
          <div className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground mb-2">
            Cabinet
          </div>
          <div className="space-y-1.5 text-foreground/80">
            <div className="flex items-center gap-2">
              <Stethoscope className="h-3 w-3" />
              {PRACTITIONER_NAME}
            </div>
            <div className="flex items-center gap-2">
              <Clock3 className="h-3 w-3" />
              Luni–Vineri, 09–19
            </div>
            <div className="flex items-center gap-2">
              <Heart className="h-3 w-3" />
              Evaluare inițială 45 min
            </div>
          </div>
        </div>

        <div className="col-span-6 md:col-span-2">
          <div className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground mb-2">
            Legal
          </div>
          <div className="space-y-1.5 text-foreground/80">
            <div>Confidențialitate</div>
            <div>Termeni</div>
            <div>GDPR</div>
          </div>
        </div>

        <div className="col-span-12 md:col-span-3 md:text-right flex md:flex-col items-start md:items-end gap-2 justify-between">
          <div className="font-hand text-2xl text-foreground/80">
            &mdash; până data viitoare.
          </div>
          <div className="text-[10px] text-muted-foreground">
            &copy; {YEAR} · {ISSUE}
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ====================================================================
   SHARED
   ==================================================================== */
function ChapterLabel({ n, label }: { n: string; label: string }) {
  return (
    <aside className="col-span-12 md:col-span-3 md:sticky md:top-6 md:self-start">
      <div className="border-l-2 border-primary pl-4 py-1">
        <div className="font-mono text-[10px] uppercase tracking-[0.24em] text-primary">
          Capitolul
        </div>
        <div className="display-numeral text-5xl mt-2">{n}</div>
        <div className="font-serif text-lg italic mt-1">{label}</div>
      </div>
    </aside>
  );
}

function formatMonth() {
  const months = [
    "ianuarie",
    "februarie",
    "martie",
    "aprilie",
    "mai",
    "iunie",
    "iulie",
    "august",
    "septembrie",
    "octombrie",
    "noiembrie",
    "decembrie",
  ];
  const d = new Date();
  return `${months[d.getMonth()]} ${d.getFullYear()}`;
}
