import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  CheckCircle2,
  Play,
  Flame,
  HeartPulse,
  Sparkles,
  Clock,
  ArrowRight,
  Stethoscope,
  Calendar,
} from "lucide-react";
import { getVideoThumbnail } from "@/lib/video-url";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function ClientDashboard() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const profile = await prisma.clientProfile.findUnique({
    where: { userId: user.id },
    include: {
      assignedPlans: {
        where: { status: "ACTIVE" },
        include: {
          exercises: {
            include: {
              exercise: true,
              completions: { orderBy: { completedAt: "desc" } },
            },
            orderBy: { orderIndex: "asc" },
          },
          createdBy: { select: { name: true } },
        },
      },
    },
  });

  const greeting = getGreeting();
  const firstName = user.name?.split(" ")[0] ?? "";

  if (!profile) {
    return <EmptyState name={user.name ?? ""} greeting={greeting} />;
  }

  const allExercises = profile.assignedPlans.flatMap((p) => p.exercises);
  const total = allExercises.length;
  const todayDone = allExercises.filter((pe) =>
    pe.completions.some(isToday)
  ).length;
  const completionRate = total > 0 ? Math.round((todayDone / total) * 100) : 0;
  const allDone = total > 0 && todayDone === total;

  const weekData = buildWeekData(
    allExercises.flatMap((pe) => pe.completions)
  );

  const streak = computeStreak(
    allExercises.flatMap((pe) => pe.completions).map((c) => c.completedAt)
  );

  const therapistName =
    profile.assignedPlans[0]?.createdBy?.name ?? "Dr. Physio";

  return (
    <div className="min-h-screen">
      {/* HERO */}
      <section className="px-5 md:px-10 pt-8 md:pt-10">
        <div className="max-w-5xl mx-auto">
          <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-primary via-[oklch(0.52_0.12_205)] to-[oklch(0.5_0.13_220)] text-primary-foreground shadow-soft-lg">
            <div className="absolute -top-24 -right-16 h-72 w-72 blob bg-white/10" />
            <div className="absolute -bottom-16 -left-20 h-56 w-56 blob bg-[var(--coral)]/30" />

            <div className="relative p-6 md:p-10 grid md:grid-cols-[1fr_auto] gap-8 items-center">
              <div>
                <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur rounded-full px-3 py-1 text-xs font-medium mb-4">
                  <Sparkles className="h-3.5 w-3.5" />
                  {greeting}, {firstName}
                </div>
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight leading-tight">
                  {allDone ? (
                    <>Ai terminat pe azi. Odihnă activă ✨</>
                  ) : total === 0 ? (
                    <>Niciun exercițiu programat</>
                  ) : todayDone === 0 ? (
                    <>Gata să începem sesiunea?</>
                  ) : (
                    <>
                      Încă {total - todayDone}{" "}
                      {total - todayDone === 1 ? "exercițiu" : "exerciții"} de făcut
                    </>
                  )}
                </h1>
                <p className="mt-3 text-primary-foreground/80 text-[15px] max-w-md leading-relaxed">
                  {allDone
                    ? "Toate bifate. Mișcare ușoară până mâine."
                    : total === 0
                    ? "Terapeutul tău îți va atribui curând un plan."
                    : `Programul a fost scris de ${therapistName}. Fiecare exercițiu are un video cu îndrumări.`}
                </p>

                <div className="mt-6 flex flex-wrap items-center gap-3">
                  {total > 0 && !allDone && (
                    <Link
                      href="/dashboard/exercises"
                      className={cn(
                        buttonVariants(),
                        "rounded-full bg-white text-primary hover:bg-white/90 shadow-soft h-11 px-6 font-semibold"
                      )}
                    >
                      Începe sesiunea <ArrowRight className="ml-1.5 h-4 w-4" />
                    </Link>
                  )}
                  <StreakBadge streak={streak} />
                </div>
              </div>

              {/* Progress ring */}
              {total > 0 && (
                <div className="flex justify-center md:justify-end">
                  <ProgressDial
                    rate={completionRate}
                    done={todayDone}
                    total={total}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* WEEKLY RHYTHM */}
      <section className="px-5 md:px-10 pt-6">
        <div className="max-w-5xl mx-auto bg-card rounded-3xl border shadow-soft p-6">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2.5">
              <div className="h-9 w-9 rounded-xl bg-mint-soft text-mint flex items-center justify-center">
                <Calendar className="h-[18px] w-[18px]" strokeWidth={2.2} />
              </div>
              <div>
                <div className="font-semibold tracking-tight">Săptămâna ta</div>
                <div className="text-[11px] text-muted-foreground">
                  ultimele 7 zile
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold tracking-tight">{streak}</div>
              <div className="text-[11px] text-muted-foreground flex items-center gap-1 justify-end">
                <Flame className="h-3 w-3 text-coral" />
                {streak === 1 ? "zi" : "zile"} consecutiv
              </div>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-2">
            {weekData.map((d, i) => (
              <DayCell key={i} {...d} />
            ))}
          </div>
        </div>
      </section>

      {/* PRESCRIPTION LIST */}
      {profile.assignedPlans.map((plan) => (
        <section key={plan.id} className="px-5 md:px-10 pt-6 pb-10">
          <div className="max-w-5xl mx-auto bg-card rounded-3xl border shadow-soft overflow-hidden">
            <div className="p-6 border-b border-border/60 flex items-start justify-between gap-4">
              <div>
                <div className="text-[11px] font-medium text-primary uppercase tracking-wider">
                  Programul tău
                </div>
                <h2 className="text-xl md:text-2xl font-bold tracking-tight mt-0.5">
                  {plan.name}
                </h2>
                {plan.description && (
                  <p className="text-sm text-muted-foreground mt-1 max-w-lg">
                    {plan.description}
                  </p>
                )}
              </div>
              <div className="text-right shrink-0">
                <div className="text-2xl font-bold tracking-tight">
                  <span className="text-primary">{todayDone}</span>
                  <span className="text-muted-foreground text-lg font-medium">
                    /{total}
                  </span>
                </div>
                <div className="text-[11px] text-muted-foreground">azi</div>
              </div>
            </div>

            <ol className="divide-y divide-border/60">
              {plan.exercises.map((pe, i) => {
                const done = pe.completions.some(isToday);
                const thumb =
                  pe.exercise.thumbnailUrl ||
                  getVideoThumbnail(pe.exercise.videoUrl);
                const lastPain = pe.completions[0]?.painLevel;

                return (
                  <li key={pe.id}>
                    <Link
                      href={`/dashboard/exercises/${pe.id}`}
                      className={`group flex items-center gap-4 p-4 md:p-5 transition-colors ${
                        done
                          ? "bg-mint-soft/40"
                          : "hover:bg-secondary/40"
                      }`}
                    >
                      {/* Index badge */}
                      <div
                        className={`h-9 w-9 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${
                          done
                            ? "bg-mint text-white"
                            : "bg-secondary text-muted-foreground"
                        }`}
                      >
                        {done ? <CheckCircle2 className="h-4 w-4" /> : i + 1}
                      </div>

                      {/* Thumbnail */}
                      <div className="relative w-24 md:w-32 aspect-video rounded-xl overflow-hidden bg-muted shrink-0 shadow-soft">
                        {thumb && (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={thumb}
                            alt={pe.exercise.title}
                            className={`w-full h-full object-cover ${
                              done ? "opacity-70" : ""
                            }`}
                          />
                        )}
                        {!done && (
                          <div className="absolute inset-0 flex items-center justify-center bg-black/10 group-hover:bg-black/25 transition-colors">
                            <div className="h-9 w-9 rounded-full bg-white/95 flex items-center justify-center shadow-soft">
                              <Play className="h-4 w-4 text-primary fill-primary" />
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Title + meta */}
                      <div className="flex-1 min-w-0">
                        <div
                          className={`font-semibold text-[15px] md:text-base tracking-tight truncate ${
                            done ? "text-muted-foreground" : ""
                          }`}
                        >
                          {pe.exercise.title}
                        </div>
                        <div className="mt-1 flex flex-wrap items-center gap-1.5">
                          {(pe.sets || pe.reps) && (
                            <MetaPill>
                              <Clock className="h-3 w-3" />
                              {pe.sets ? `${pe.sets}×` : ""}
                              {pe.reps ?? ""}
                              {pe.holdSeconds ? ` · ${pe.holdSeconds}s` : ""}
                            </MetaPill>
                          )}
                          {pe.frequencyPerWeek && (
                            <MetaPill>
                              {pe.frequencyPerWeek}/săpt
                            </MetaPill>
                          )}
                          {done && lastPain != null && (
                            <MetaPill tone={lastPain >= 6 ? "coral" : "mint"}>
                              <HeartPulse className="h-3 w-3" />
                              durere {lastPain}/10
                            </MetaPill>
                          )}
                        </div>
                        {pe.notes && !done && (
                          <p className="mt-2 text-xs text-muted-foreground italic line-clamp-1">
                            „{pe.notes}&rdquo;
                          </p>
                        )}
                      </div>

                      <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground group-hover:translate-x-0.5 transition-all shrink-0 hidden sm:block" />
                    </Link>
                  </li>
                );
              })}
            </ol>

            {/* Therapist card */}
            <div className="p-5 border-t border-border/60 bg-secondary/40 flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-[oklch(0.48_0.12_210)] text-primary-foreground flex items-center justify-center shadow-soft">
                <Stethoscope className="h-5 w-5" strokeWidth={2.2} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs text-muted-foreground">Prescris de</div>
                <div className="font-semibold text-sm truncate">
                  {therapistName}
                </div>
              </div>
              <Link
                href="/dashboard/messages"
                className={cn(
                  buttonVariants({ variant: "outline", size: "sm" }),
                  "rounded-full"
                )}
              >
                Scrie-i
              </Link>
            </div>
          </div>
        </section>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Components                                                          */
/* ------------------------------------------------------------------ */

function ProgressDial({
  rate,
  done,
  total,
}: {
  rate: number;
  done: number;
  total: number;
}) {
  const size = 160;
  const stroke = 10;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (rate / 100) * c;
  return (
    <div className="relative w-[160px] h-[160px]">
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="rgba(255,255,255,0.2)"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="white"
          strokeWidth={stroke}
          strokeDasharray={c}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 0.6s ease" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="text-4xl font-bold tracking-tight">{rate}%</div>
        <div className="text-[11px] opacity-80 mt-0.5">
          {done}/{total} azi
        </div>
      </div>
    </div>
  );
}

function StreakBadge({ streak }: { streak: number }) {
  if (streak === 0) return null;
  return (
    <div className="inline-flex items-center gap-1.5 bg-white/15 backdrop-blur rounded-full px-3.5 py-2 text-sm font-medium">
      <Flame className="h-4 w-4 text-[var(--coral-soft)]" />
      <span>
        <span className="font-bold">{streak}</span> {streak === 1 ? "zi" : "zile"} consecutiv
      </span>
    </div>
  );
}

function DayCell({
  label,
  count,
  intensity,
  isToday: today,
}: {
  label: string;
  count: number;
  intensity: number;
  isToday: boolean;
}) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className={`relative w-full aspect-square rounded-2xl flex items-center justify-center transition-all ${
          today ? "ring-2 ring-primary ring-offset-2 ring-offset-card" : ""
        }`}
        style={{
          background:
            count > 0
              ? `color-mix(in oklch, var(--primary) ${Math.max(
                  18,
                  intensity * 75
                )}%, var(--muted))`
              : "var(--muted)",
        }}
      >
        {count > 0 ? (
          <span
            className="text-lg font-bold"
            style={{
              color:
                intensity > 0.45
                  ? "var(--primary-foreground)"
                  : "var(--foreground)",
            }}
          >
            {count}
          </span>
        ) : (
          <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/30" />
        )}
      </div>
      <div
        className={`text-[11px] font-medium ${
          today ? "text-primary" : "text-muted-foreground"
        }`}
      >
        {label}
      </div>
    </div>
  );
}

function MetaPill({
  children,
  tone = "default",
}: {
  children: React.ReactNode;
  tone?: "default" | "coral" | "mint";
}) {
  const cls =
    tone === "coral"
      ? "bg-coral-soft text-coral"
      : tone === "mint"
        ? "bg-mint-soft text-mint"
        : "bg-secondary text-secondary-foreground";
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium ${cls}`}
    >
      {children}
    </span>
  );
}

function EmptyState({
  name,
  greeting,
}: {
  name: string;
  greeting: string;
}) {
  return (
    <div className="min-h-screen px-5 md:px-10 py-12 flex items-center">
      <div className="max-w-2xl mx-auto w-full">
        <div className="bg-card rounded-[2rem] border shadow-soft p-8 md:p-12 text-center">
          <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-primary to-[oklch(0.48_0.12_210)] text-primary-foreground flex items-center justify-center mx-auto mb-6 shadow-soft">
            <HeartPulse className="h-7 w-7" strokeWidth={2.2} />
          </div>
          <div className="text-sm text-muted-foreground mb-2">{greeting}</div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
            Bine ai venit, {name}.
          </h1>
          <p className="mt-4 text-muted-foreground max-w-md mx-auto leading-relaxed">
            Terapeutul tău nu ți-a atribuit încă un plan. Îți pregătește
            prescripția și o vei vedea aici în curând.
          </p>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

function isToday(c: { completedAt: Date | string }) {
  return (
    new Date(c.completedAt).toDateString() === new Date().toDateString()
  );
}

function buildWeekData(
  completions: { completedAt: Date | string }[]
) {
  const labels = ["L", "Ma", "Mi", "J", "V", "S", "D"];
  const days: {
    label: string;
    count: number;
    intensity: number;
    isToday: boolean;
  }[] = [];
  const today = new Date();
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const dayStr = d.toDateString();
    const count = completions.filter(
      (c) => new Date(c.completedAt).toDateString() === dayStr
    ).length;
    const idx = (d.getDay() + 6) % 7;
    days.push({
      label: labels[idx],
      count,
      intensity: Math.min(1, count / 5),
      isToday: dayStr === today.toDateString(),
    });
  }
  return days;
}

function computeStreak(dates: (Date | string)[]) {
  if (dates.length === 0) return 0;
  const uniqueDays = new Set(
    dates.map((d) => new Date(d).toDateString())
  );
  let streak = 0;
  const cursor = new Date();
  while (uniqueDays.has(cursor.toDateString())) {
    streak++;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

function getGreeting() {
  const h = new Date().getHours();
  if (h < 6) return "Noapte bună";
  if (h < 12) return "Bună dimineața";
  if (h < 18) return "Bună ziua";
  return "Bună seara";
}
