import { prisma } from "@/lib/prisma";
import Link from "next/link";
import {
  ArrowUpRight,
  Plus,
  CheckCircle2,
  AlertCircle,
  Users,
  Dumbbell,
  ClipboardList,
  Tag as TagIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";

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
    <div className="relative">
      {/* MASTHEAD */}
      <div className="border-b border-foreground/15">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10 py-4 flex items-center justify-between text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
          <span className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
            Ediția de azi · {formatDateLong(now)}
          </span>
          <span className="hidden md:inline">Jurnal de cabinet</span>
        </div>
      </div>

      {/* HEADLINE */}
      <section className="border-b border-foreground/10">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10 py-10 md:py-14 grid grid-cols-12 gap-6">
          <div className="col-span-12 md:col-span-8">
            <div className="font-hand text-2xl text-ochre mb-3">{greeting}</div>
            <h1 className="font-serif text-[clamp(2.5rem,6vw,5.5rem)] leading-[0.92] tracking-tight">
              Astăzi ai{" "}
              <span className="italic text-primary">{clientCount}</span>{" "}
              pacienți activi<span className="text-muted-foreground/60">.</span>
            </h1>
            <p className="mt-6 text-lg text-foreground/70 max-w-xl">
              {todayCompletions > 0
                ? `Au finalizat ${todayCompletions} exerciții până acum. Ultima activitate: ${lastActivityRelative(
                    recentCompletions[0]?.completedAt
                  )}.`
                : "Încă nimeni nu a completat un exercițiu azi. Ziua e tânără."}
            </p>
          </div>

          <div className="col-span-12 md:col-span-4 flex md:justify-end items-start md:items-end gap-2">
            <Link href="/admin/exercises/new">
              <Button size="sm" className="gap-1 rounded-none">
                <Plus className="h-3.5 w-3.5" />
                Exercițiu
              </Button>
            </Link>
            <Link href="/admin/clients/new">
              <Button
                size="sm"
                variant="outline"
                className="gap-1 rounded-none border-foreground"
              >
                <Plus className="h-3.5 w-3.5" />
                Pacient
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* NUMBERS STRIP */}
      <section className="border-b border-foreground/10">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10 grid grid-cols-2 md:grid-cols-5">
          <NumberCell
            value={String(weekCompletions)}
            label="Finalizări / 7 zile"
            href="/admin/analytics"
          />
          <NumberCell
            value={String(activePlans)}
            label="Planuri active"
            icon={<ClipboardList className="h-3.5 w-3.5" />}
          />
          <NumberCell
            value={String(exerciseCount)}
            label="Exerciții în bibliotecă"
            href="/admin/exercises"
            icon={<Dumbbell className="h-3.5 w-3.5" />}
          />
          <NumberCell
            value={String(tagCount)}
            label="Afecțiuni definite"
            href="/admin/tags"
            icon={<TagIcon className="h-3.5 w-3.5" />}
          />
          <NumberCell
            value={String(clientCount)}
            label="Pacienți înregistrați"
            href="/admin/clients"
            icon={<Users className="h-3.5 w-3.5" />}
            last
          />
        </div>
      </section>

      {/* TWO-COLUMN EDITORIAL */}
      <section className="max-w-[1400px] mx-auto px-6 md:px-10 py-12 md:py-16 grid grid-cols-12 gap-8 md:gap-12">
        {/* LEFT — Attention needed (bulletin) */}
        <div className="col-span-12 md:col-span-5">
          <div className="sticky top-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="font-mono text-[10px] uppercase tracking-[0.24em] text-primary">
                Alertă durere
              </div>
              <span className="h-px flex-1 bg-foreground/15" />
            </div>
            <h2 className="font-serif text-3xl md:text-4xl leading-tight mb-1">
              Atenție aici
            </h2>
            <p className="text-sm text-muted-foreground mb-8">
              Pacienți care au raportat durere ≥ 6/10 în ultimele 7 zile.
            </p>

            {highPainCompletions.length === 0 ? (
              <div className="border border-foreground/15 p-6 text-sm">
                <div className="flex items-center gap-2 text-primary mb-2">
                  <CheckCircle2 className="h-4 w-4" />
                  <span className="font-medium">Totul e calm</span>
                </div>
                <p className="text-muted-foreground">
                  Niciun semnal de durere crescută săptămâna asta.
                </p>
              </div>
            ) : (
              <div className="space-y-0 border-t border-foreground/15">
                {highPainCompletions.map((c) => {
                  const patient =
                    c.planExercise.treatmentPlan.clientProfile.user;
                  return (
                    <Link
                      key={c.id}
                      href={`/admin/clients/${patient.id}`}
                      className="group flex items-start gap-4 py-5 border-b border-foreground/15 hover:bg-foreground/[0.02] -mx-2 px-2 transition"
                    >
                      <div className="display-numeral text-3xl text-ochre w-12 shrink-0">
                        {c.painLevel}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-serif text-lg leading-tight">
                          {patient.name}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {c.planExercise.exercise.title} ·{" "}
                          {lastActivityRelative(c.completedAt)}
                        </div>
                      </div>
                      <ArrowUpRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition shrink-0" />
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT — Activity feed */}
        <div className="col-span-12 md:col-span-7">
          <div className="flex items-center gap-3 mb-5">
            <div className="font-mono text-[10px] uppercase tracking-[0.24em] text-primary">
              Cronologie · activitate
            </div>
            <span className="h-px flex-1 bg-foreground/15" />
          </div>
          <h2 className="font-serif text-3xl md:text-4xl leading-tight mb-8">
            Ce s-a întâmplat recent
          </h2>

          {recentCompletions.length === 0 ? (
            <div className="border border-foreground/15 p-10 text-center">
              <AlertCircle className="h-6 w-6 mx-auto text-muted-foreground mb-3" />
              <p className="font-serif text-xl mb-1">Fără activitate încă</p>
              <p className="text-sm text-muted-foreground">
                Pacienții tăi nu au înregistrat completări.
              </p>
            </div>
          ) : (
            <ol className="relative border-l border-foreground/15 ml-3">
              {recentCompletions.map((c, i) => {
                const patient =
                  c.planExercise.treatmentPlan.clientProfile.user;
                return (
                  <li
                    key={c.id}
                    className="relative pl-8 pb-8 last:pb-0"
                  >
                    <span className="absolute -left-[6px] top-1.5 h-3 w-3 rounded-full bg-background border-2 border-primary" />
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="font-mono text-[10px] text-muted-foreground mb-1">
                          {formatTime(c.completedAt)} ·{" "}
                          {formatShortDate(c.completedAt)}
                        </div>
                        <div className="font-serif text-lg leading-tight">
                          <span className="font-semibold">{patient.name}</span>{" "}
                          a completat{" "}
                          <span className="italic">
                            {c.planExercise.exercise.title}
                          </span>
                        </div>
                        <div className="mt-2 flex flex-wrap gap-3 text-xs text-muted-foreground">
                          {c.setsCompleted != null && (
                            <span>{c.setsCompleted} seturi</span>
                          )}
                          {c.repsCompleted != null && (
                            <span>{c.repsCompleted} repetări</span>
                          )}
                          {c.painLevel != null && (
                            <span
                              className={
                                c.painLevel >= 6
                                  ? "text-ochre font-medium"
                                  : ""
                              }
                            >
                              durere {c.painLevel}/10
                            </span>
                          )}
                          {c.difficultyFelt != null && (
                            <span>
                              dificultate {c.difficultyFelt}/5
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="font-mono text-[10px] text-muted-foreground shrink-0">
                        #{String(recentCompletions.length - i).padStart(3, "0")}
                      </div>
                    </div>
                  </li>
                );
              })}
            </ol>
          )}
        </div>
      </section>

      {/* ROSTER */}
      <section className="border-t border-foreground/10">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10 py-12 md:py-16">
          <div className="flex items-end justify-between mb-8">
            <div>
              <div className="font-mono text-[10px] uppercase tracking-[0.24em] text-primary mb-2">
                Registru
              </div>
              <h2 className="font-serif text-3xl md:text-4xl leading-tight">
                Pacienți înregistrați
              </h2>
            </div>
            <Link
              href="/admin/clients"
              className="group inline-flex items-center gap-1 text-sm font-medium"
            >
              Toți pacienții
              <ArrowUpRight className="h-4 w-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition" />
            </Link>
          </div>

          {recentClients.length === 0 ? (
            <div className="border border-foreground/15 p-10 text-center">
              <p className="font-serif text-xl mb-4">Registrul e gol.</p>
              <Link href="/admin/clients/new">
                <Button size="sm" className="rounded-none">
                  Adaugă primul pacient
                </Button>
              </Link>
            </div>
          ) : (
            <div className="border-t border-foreground/15">
              {recentClients.map((c, i) => {
                const plans = c.clientProfile?.assignedPlans.length ?? 0;
                const initials = c.name
                  ?.split(" ")
                  .map((n) => n[0])
                  .slice(0, 2)
                  .join("")
                  .toUpperCase();
                return (
                  <Link
                    key={c.id}
                    href={`/admin/clients/${c.id}`}
                    className="group grid grid-cols-12 gap-4 items-center py-5 border-b border-foreground/15 hover:bg-foreground/[0.02] transition -mx-2 px-2"
                  >
                    <div className="col-span-1 font-mono text-[10px] text-muted-foreground">
                      {String(i + 1).padStart(2, "0")}
                    </div>
                    <div className="col-span-1">
                      <div className="h-9 w-9 rounded-full bg-primary/10 text-primary font-semibold text-xs flex items-center justify-center">
                        {initials || "?"}
                      </div>
                    </div>
                    <div className="col-span-5 md:col-span-6">
                      <div className="font-serif text-lg leading-tight group-hover:text-primary transition">
                        {c.name}
                      </div>
                      <div className="text-xs text-muted-foreground truncate">
                        {c.email}
                      </div>
                    </div>
                    <div className="col-span-3 md:col-span-3 text-right md:text-left">
                      <div className="font-mono text-sm">
                        {plans} {plans === 1 ? "plan" : "planuri"}
                      </div>
                      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                        active
                      </div>
                    </div>
                    <div className="col-span-2 md:col-span-1 flex justify-end">
                      <ArrowUpRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition" />
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

function NumberCell({
  value,
  label,
  href,
  icon,
  last = false,
}: {
  value: string;
  label: string;
  href?: string;
  icon?: React.ReactNode;
  last?: boolean;
}) {
  const content = (
    <div
      className={`group py-6 md:py-8 px-1 md:px-6 ${
        !last ? "md:border-r border-foreground/10" : ""
      } border-b md:border-b-0 border-foreground/10 h-full`}
    >
      <div className="flex items-baseline gap-2">
        <div className="display-numeral text-4xl md:text-5xl">{value}</div>
        {icon && (
          <div className="text-muted-foreground ml-auto group-hover:text-primary transition">
            {icon}
          </div>
        )}
      </div>
      <div className="mt-3 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
        {label}
      </div>
    </div>
  );
  return href ? <Link href={href}>{content}</Link> : content;
}

function getGreeting() {
  const h = new Date().getHours();
  if (h < 6) return "Noapte bună,";
  if (h < 12) return "Bună dimineața,";
  if (h < 18) return "Bună ziua,";
  return "Bună seara,";
}

function lastActivityRelative(d?: Date) {
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
    [
      "ian",
      "feb",
      "mar",
      "apr",
      "mai",
      "iun",
      "iul",
      "aug",
      "sep",
      "oct",
      "nov",
      "dec",
    ][date.getMonth()]
  }`;
}

function formatTime(d: Date | string) {
  const date = new Date(d);
  return `${date.getHours().toString().padStart(2, "0")}:${date
    .getMinutes()
    .toString()
    .padStart(2, "0")}`;
}
