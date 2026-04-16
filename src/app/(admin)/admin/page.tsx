import { prisma } from "@/lib/prisma";
import Link from "next/link";
import {
  Plus,
  CheckCircle2,
  AlertTriangle,
  Users,
  Dumbbell,
  ClipboardList,
  Tag as TagIcon,
  ArrowRight,
  Activity,
  HeartPulse,
  TrendingUp,
  Clock,
} from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const now = new Date();
  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const todayStart = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  );

  const [
    clientCount,
    exerciseCount,
    activePlans,
    tagCount,
    todayCompletions,
    weekCompletions,
    recentClients,
    recentCompletions,
    highPainCompletions,
  ] = await Promise.all([
    prisma.clientProfile.count(),
    prisma.exercise.count(),
    prisma.treatmentPlan.count({ where: { status: "ACTIVE" } }),
    prisma.tag.count(),
    prisma.exerciseCompletion.count({
      where: { completedAt: { gte: todayStart } },
    }),
    prisma.exerciseCompletion.count({
      where: { completedAt: { gte: weekAgo } },
    }),
    prisma.user.findMany({
      where: { role: "CLIENT" },
      include: {
        clientProfile: {
          include: {
            assignedPlans: { where: { status: "ACTIVE" } },
          },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 8,
    }),
    prisma.exerciseCompletion.findMany({
      take: 10,
      orderBy: { completedAt: "desc" },
      include: {
        planExercise: {
          include: {
            exercise: { select: { title: true } },
            treatmentPlan: {
              include: {
                clientProfile: {
                  include: { user: { select: { name: true } } },
                },
              },
            },
          },
        },
      },
    }),
    prisma.exerciseCompletion.findMany({
      where: {
        painLevel: { gte: 6 },
        completedAt: { gte: weekAgo },
      },
      orderBy: { completedAt: "desc" },
      take: 4,
      include: {
        planExercise: {
          include: {
            exercise: { select: { title: true } },
            treatmentPlan: {
              include: {
                clientProfile: {
                  include: { user: { select: { id: true, name: true } } },
                },
              },
            },
          },
        },
      },
    }),
  ]);

  const greeting = getGreeting();

  return (
    <div className="min-h-screen">
      {/* HEADER */}
      <header className="px-6 md:px-10 pt-8 md:pt-10 pb-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="text-sm text-muted-foreground">
              {greeting} · {formatDateLong(now)}
            </div>
            <h1 className="mt-1 text-3xl md:text-4xl font-bold tracking-tight">
              Panou de cabinet
            </h1>
          </div>
          <div className="flex gap-2">
            <Link
              href="/admin/clients/new"
              className={cn(buttonVariants({ size: "lg" }), "rounded-full shadow-soft gap-1.5 h-10 px-5")}
            >
              <Plus className="h-4 w-4" /> Pacient nou
            </Link>
            <Link
              href="/admin/exercises/new"
              className={cn(buttonVariants({ variant: "outline", size: "lg" }), "rounded-full gap-1.5 h-10 px-5")}
            >
              <Plus className="h-4 w-4" /> Exercițiu
            </Link>
          </div>
        </div>
      </header>

      {/* STAT CARDS */}
      <section className="px-6 md:px-10 pb-6">
        <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            icon={Users}
            label="Pacienți activi"
            value={clientCount}
            sub={`${activePlans} ${activePlans === 1 ? "plan activ" : "planuri active"}`}
            tone="primary"
            href="/admin/clients"
          />
          <StatCard
            icon={CheckCircle2}
            label="Finalizări azi"
            value={todayCompletions}
            sub={`${weekCompletions} în ultimele 7 zile`}
            tone="mint"
          />
          <StatCard
            icon={Dumbbell}
            label="Bibliotecă"
            value={exerciseCount}
            sub={`${tagCount} afecțiuni`}
            tone="sky"
            href="/admin/exercises"
          />
          <StatCard
            icon={AlertTriangle}
            label="Alerte durere"
            value={highPainCompletions.length}
            sub="pacienți cu durere ≥ 6/10"
            tone="coral"
          />
        </div>
      </section>

      {/* TWO-COLUMN */}
      <section className="px-6 md:px-10 pb-10">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-3 gap-5">
          {/* LEFT — attention */}
          <div className="lg:col-span-1 bg-card rounded-3xl border shadow-soft overflow-hidden">
            <div className="p-5 border-b border-border/60 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="h-9 w-9 rounded-xl bg-coral-soft text-coral flex items-center justify-center">
                  <AlertTriangle className="h-[18px] w-[18px]" strokeWidth={2.2} />
                </div>
                <div>
                  <div className="font-semibold tracking-tight">Atenție aici</div>
                  <div className="text-[11px] text-muted-foreground">Durere ≥ 6/10</div>
                </div>
              </div>
            </div>
            <div className="divide-y divide-border/60">
              {highPainCompletions.length === 0 ? (
                <div className="p-6 text-center">
                  <div className="h-11 w-11 mx-auto rounded-full bg-mint-soft text-mint flex items-center justify-center mb-3">
                    <CheckCircle2 className="h-5 w-5" />
                  </div>
                  <p className="text-sm font-medium">Totul e calm</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Niciun semnal crescut săptămâna asta.
                  </p>
                </div>
              ) : (
                highPainCompletions.map((c) => {
                  const patient =
                    c.planExercise.treatmentPlan.clientProfile.user;
                  return (
                    <Link
                      key={c.id}
                      href={`/admin/clients/${patient.id}`}
                      className="group p-4 flex items-start gap-3 hover:bg-secondary/60 transition-colors"
                    >
                      <div className="h-10 w-10 rounded-xl bg-coral-soft text-coral flex flex-col items-center justify-center shrink-0">
                        <span className="text-lg font-bold leading-none">
                          {c.painLevel}
                        </span>
                        <span className="text-[9px] leading-none mt-0.5 opacity-70">
                          /10
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-sm truncate">
                          {patient.name}
                        </div>
                        <div className="text-xs text-muted-foreground truncate">
                          {c.planExercise.exercise.title}
                        </div>
                        <div className="text-[11px] text-muted-foreground/80 mt-1 flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {lastActivityRelative(c.completedAt)}
                        </div>
                      </div>
                      <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground group-hover:translate-x-0.5 transition-all shrink-0" />
                    </Link>
                  );
                })
              )}
            </div>
          </div>

          {/* RIGHT — activity feed */}
          <div className="lg:col-span-2 bg-card rounded-3xl border shadow-soft overflow-hidden">
            <div className="p-5 border-b border-border/60 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="h-9 w-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                  <Activity className="h-[18px] w-[18px]" strokeWidth={2.2} />
                </div>
                <div>
                  <div className="font-semibold tracking-tight">Activitate recentă</div>
                  <div className="text-[11px] text-muted-foreground">
                    ultimele completări
                  </div>
                </div>
              </div>
              <Link
                href="/admin/analytics"
                className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
              >
                Analize <ArrowRight className="h-3 w-3" />
              </Link>
            </div>

            {recentCompletions.length === 0 ? (
              <div className="p-10 text-center">
                <div className="h-12 w-12 mx-auto rounded-2xl bg-secondary text-muted-foreground flex items-center justify-center mb-4">
                  <Activity className="h-5 w-5" />
                </div>
                <p className="font-semibold">Fără activitate încă</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Pacienții tăi nu au înregistrat completări.
                </p>
              </div>
            ) : (
              <ul className="divide-y divide-border/60">
                {recentCompletions.map((c) => {
                  const patient =
                    c.planExercise.treatmentPlan.clientProfile.user;
                  const initials = (patient.name ?? "?")
                    .split(" ")
                    .map((n) => n[0])
                    .slice(0, 2)
                    .join("")
                    .toUpperCase();
                  const highPain = c.painLevel != null && c.painLevel >= 6;
                  return (
                    <li
                      key={c.id}
                      className="p-4 flex items-start gap-3 hover:bg-secondary/40 transition-colors"
                    >
                      <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary/15 to-coral-soft text-foreground text-xs font-semibold flex items-center justify-center shrink-0">
                        {initials}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm leading-snug">
                          <span className="font-semibold">{patient.name}</span>
                          <span className="text-muted-foreground"> a făcut </span>
                          <span className="font-medium">
                            {c.planExercise.exercise.title}
                          </span>
                        </div>
                        <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                          {c.setsCompleted != null && (
                            <MetaPill>
                              {c.setsCompleted} × {c.repsCompleted ?? "?"}
                            </MetaPill>
                          )}
                          {c.painLevel != null && (
                            <MetaPill tone={highPain ? "coral" : "default"}>
                              <HeartPulse className="h-3 w-3" />
                              {c.painLevel}/10
                            </MetaPill>
                          )}
                          {c.difficultyFelt != null && (
                            <MetaPill>
                              <TrendingUp className="h-3 w-3" />
                              {c.difficultyFelt}/5
                            </MetaPill>
                          )}
                        </div>
                      </div>
                      <div className="text-[11px] text-muted-foreground whitespace-nowrap shrink-0 mt-0.5">
                        {formatTime(c.completedAt)}
                        <div className="text-[10px] opacity-70">
                          {formatShortDate(c.completedAt)}
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>
      </section>

      {/* ROSTER */}
      <section className="px-6 md:px-10 pb-14">
        <div className="max-w-7xl mx-auto bg-card rounded-3xl border shadow-soft overflow-hidden">
          <div className="p-5 border-b border-border/60 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="h-9 w-9 rounded-xl bg-sky-soft text-sky flex items-center justify-center">
                <Users className="h-[18px] w-[18px]" strokeWidth={2.2} />
              </div>
              <div>
                <div className="font-semibold tracking-tight">Pacienți</div>
                <div className="text-[11px] text-muted-foreground">
                  adăugați recent
                </div>
              </div>
            </div>
            <Link
              href="/admin/clients"
              className="text-xs font-medium text-primary hover:underline flex items-center gap-1"
            >
              Toți pacienții <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          {recentClients.length === 0 ? (
            <div className="p-10 text-center">
              <p className="font-semibold mb-4">Niciun pacient încă.</p>
              <Link
                href="/admin/clients/new"
                className={cn(buttonVariants({ size: "lg" }), "rounded-full h-10 px-5")}
              >
                Adaugă primul pacient
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-border/60">
              <div className="md:divide-y md:divide-border/60">
                {recentClients.slice(0, 4).map((c) => (
                  <RosterRow key={c.id} client={c} />
                ))}
              </div>
              <div className="md:divide-y md:divide-border/60 border-t md:border-t-0 divide-y divide-border/60">
                {recentClients.slice(4).map((c) => (
                  <RosterRow key={c.id} client={c} />
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* QUICK LINKS */}
      <section className="px-6 md:px-10 pb-16">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-3">
          <QuickLink href="/admin/exercises" icon={Dumbbell} label="Bibliotecă" sub="Exerciții video" />
          <QuickLink href="/admin/tags" icon={TagIcon} label="Afecțiuni" sub="Categorii" />
          <QuickLink href="/admin/clients" icon={Users} label="Pacienți" sub="Registru" />
          <QuickLink href="/admin/analytics" icon={TrendingUp} label="Analize" sub="Aderență" />
        </div>
      </section>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Components                                                          */
/* ------------------------------------------------------------------ */

function StatCard({
  icon: Icon,
  label,
  value,
  sub,
  tone,
  href,
}: {
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  label: string;
  value: number;
  sub: string;
  tone: "primary" | "mint" | "sky" | "coral";
  href?: string;
}) {
  const toneClasses: Record<typeof tone, string> = {
    primary: "bg-primary/10 text-primary",
    mint: "bg-mint-soft text-mint",
    sky: "bg-sky-soft text-sky",
    coral: "bg-coral-soft text-coral",
  };
  const inner = (
    <div className="group bg-card rounded-3xl border shadow-soft p-5 hover:shadow-soft-lg hover:border-primary/30 transition-all h-full">
      <div className="flex items-center justify-between mb-5">
        <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${toneClasses[tone]}`}>
          <Icon className="h-5 w-5" strokeWidth={2.2} />
        </div>
        {href && (
          <ArrowRight className="h-4 w-4 text-muted-foreground/60 group-hover:text-foreground group-hover:translate-x-0.5 transition-all" />
        )}
      </div>
      <div className="text-3xl font-bold tracking-tight">{value}</div>
      <div className="mt-1 text-sm font-medium">{label}</div>
      <div className="text-xs text-muted-foreground mt-0.5">{sub}</div>
    </div>
  );
  return href ? <Link href={href}>{inner}</Link> : inner;
}

function MetaPill({
  children,
  tone = "default",
}: {
  children: React.ReactNode;
  tone?: "default" | "coral";
}) {
  const cls =
    tone === "coral"
      ? "bg-coral-soft text-coral"
      : "bg-secondary text-secondary-foreground";
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium ${cls}`}
    >
      {children}
    </span>
  );
}

type RosterClient = {
  id: string;
  name: string | null;
  email: string;
  clientProfile: {
    assignedPlans: { id: string }[];
  } | null;
};

function RosterRow({ client }: { client: RosterClient }) {
  const plans = client.clientProfile?.assignedPlans.length ?? 0;
  const initials =
    client.name
      ?.split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() ?? "?";
  return (
    <Link
      href={`/admin/clients/${client.id}`}
      className="group flex items-center gap-3 p-4 hover:bg-secondary/60 transition-colors"
    >
      <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary/15 to-coral-soft text-foreground text-xs font-semibold flex items-center justify-center shrink-0">
        {initials}
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-semibold text-sm truncate group-hover:text-primary transition-colors">
          {client.name}
        </div>
        <div className="text-xs text-muted-foreground truncate">
          {client.email}
        </div>
      </div>
      <div className="text-right shrink-0">
        <div className="text-sm font-semibold">{plans}</div>
        <div className="text-[10px] text-muted-foreground uppercase tracking-wider">
          {plans === 1 ? "plan" : "planuri"}
        </div>
      </div>
      <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground group-hover:translate-x-0.5 transition-all shrink-0" />
    </Link>
  );
}

function QuickLink({
  href,
  icon: Icon,
  label,
  sub,
}: {
  href: string;
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  label: string;
  sub: string;
}) {
  return (
    <Link
      href={href}
      className="group bg-card rounded-2xl border shadow-soft p-4 flex items-center gap-3 hover:shadow-soft-lg hover:border-primary/30 transition-all"
    >
      <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
        <Icon className="h-[18px] w-[18px]" strokeWidth={2.2} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-semibold text-sm truncate">{label}</div>
        <div className="text-[11px] text-muted-foreground truncate">{sub}</div>
      </div>
      <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground group-hover:translate-x-0.5 transition-all shrink-0" />
    </Link>
  );
}

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

function getGreeting() {
  const h = new Date().getHours();
  if (h < 6) return "Noapte bună";
  if (h < 12) return "Bună dimineața";
  if (h < 18) return "Bună ziua";
  return "Bună seara";
}

function lastActivityRelative(d?: Date | string) {
  if (!d) return "acum un moment";
  const diff = Date.now() - new Date(d).getTime();
  const m = Math.round(diff / 60000);
  if (m < 1) return "chiar acum";
  if (m < 60) return `acum ${m} min`;
  const h = Math.round(m / 60);
  if (h < 24) return `acum ${h} h`;
  const dys = Math.round(h / 24);
  return `acum ${dys} zile`;
}

function formatDateLong(d: Date) {
  const days = [
    "duminică",
    "luni",
    "marți",
    "miercuri",
    "joi",
    "vineri",
    "sâmbătă",
  ];
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
  return `${days[d.getDay()]}, ${d.getDate()} ${months[d.getMonth()]}`;
}

function formatShortDate(d: Date | string) {
  const date = new Date(d);
  return `${date.getDate()} ${
    ["ian", "feb", "mar", "apr", "mai", "iun", "iul", "aug", "sep", "oct", "nov", "dec"][date.getMonth()]
  }`;
}

function formatTime(d: Date | string) {
  const date = new Date(d);
  return `${date.getHours().toString().padStart(2, "0")}:${date
    .getMinutes()
    .toString()
    .padStart(2, "0")}`;
}
