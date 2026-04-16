import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  CheckCircle2,
  Play,
  ArrowUpRight,
  Leaf,
  Heart,
  Flame,
} from "lucide-react";
import { getVideoThumbnail } from "@/lib/video-url";
import { Button } from "@/components/ui/button";

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

  // Weekly rhythm — count completions per day, last 7 days
  const weekData = buildWeekData(
    allExercises.flatMap((pe) => pe.completions)
  );

  const streak = computeStreak(
    allExercises.flatMap((pe) => pe.completions).map((c) => c.completedAt)
  );

  const therapistName =
    profile.assignedPlans[0]?.createdBy?.name ?? "Dr. Physio";

  return (
    <div>
      {/* MASTHEAD */}
      <div className="border-b border-foreground/15">
        <div className="max-w-[1100px] mx-auto px-6 md:px-10 py-4 flex items-center justify-between text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
          <span className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            Prescripție de azi · {formatDateLong(new Date())}
          </span>
          <span className="hidden md:inline">Recuperare personalizată</span>
        </div>
      </div>

      {/* PRESCRIPTION HEADER */}
      <section className="border-b border-foreground/10">
        <div className="max-w-[1100px] mx-auto px-6 md:px-10 py-10 md:py-14 grid grid-cols-12 gap-6">
          <div className="col-span-12 md:col-span-8">
            <div className="font-hand text-2xl text-ochre mb-3">{greeting}</div>
            <h1 className="font-serif text-[clamp(2.5rem,6vw,5rem)] leading-[0.92] tracking-tight">
              {allDone ? (
                <>
                  Astăzi ai{" "}
                  <span className="italic text-primary">terminat</span>. Bravo,{" "}
                  {firstName}.
                </>
              ) : total === 0 ? (
                <>Nimic pe azi, {firstName}.</>
              ) : todayDone === 0 ? (
                <>
                  {firstName},{" "}
                  <span className="italic text-primary">începem</span>?
                </>
              ) : (
                <>
                  Încă{" "}
                  <span className="italic text-primary">
                    {total - todayDone}
                  </span>{" "}
                  de exerciții.
                </>
              )}
            </h1>
            <p className="mt-6 text-lg text-foreground/70 max-w-xl">
              {allDone
                ? "Toate exercițiile sunt bifate. Odihnă bună și ne vedem mâine."
                : total === 0
                ? "Nu ai exerciții programate pentru azi. Terapeutul îți va actualiza planul."
                : `Programul a fost scris de ${therapistName}. Fiecare exercițiu are un video cu îndrumări pe secundă exactă.`}
            </p>
          </div>

          {/* Progress dial */}
          {total > 0 && (
            <div className="col-span-12 md:col-span-4 flex items-center md:justify-end">
              <ProgressDial rate={completionRate} done={todayDone} total={total} />
            </div>
          )}
        </div>
      </section>

      {/* WEEKLY RHYTHM */}
      <section className="border-b border-foreground/10">
        <div className="max-w-[1100px] mx-auto px-6 md:px-10 py-10">
          <div className="grid grid-cols-12 gap-6 items-center">
            <div className="col-span-12 md:col-span-4">
              <div className="font-mono text-[10px] uppercase tracking-[0.24em] text-primary mb-2">
                Ritmul săptămânii
              </div>
              <div className="flex items-end gap-3">
                <div className="display-numeral text-5xl md:text-6xl">
                  {streak}
                </div>
                <div className="pb-2">
                  <div className="font-serif text-lg leading-tight">
                    {streak === 1 ? "zi" : "zile"} la rând
                  </div>
                  <div className="text-xs text-muted-foreground flex items-center gap-1">
                    <Flame className="h-3 w-3 text-ochre" />
                    serie activă
                  </div>
                </div>
              </div>
            </div>

            <div className="col-span-12 md:col-span-8">
              <div className="grid grid-cols-7 gap-2 md:gap-3">
                {weekData.map((d, i) => (
                  <DayBar key={i} {...d} />
                ))}
              </div>
              <div className="mt-3 grid grid-cols-7 gap-2 md:gap-3 text-center font-mono text-[9px] uppercase tracking-wider text-muted-foreground">
                {weekData.map((d, i) => (
                  <div key={i}>{d.label}</div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PRESCRIPTION LIST */}
      {profile.assignedPlans.map((plan) => (
        <section key={plan.id} className="border-b border-foreground/10">
          <div className="max-w-[1100px] mx-auto px-6 md:px-10 py-10 md:py-14">
            <div className="flex items-end justify-between mb-8">
              <div>
                <div className="font-mono text-[10px] uppercase tracking-[0.24em] text-primary mb-2">
                  Programul · {plan.name}
                </div>
                <h2 className="font-serif text-3xl md:text-5xl leading-tight">
                  Astăzi
                </h2>
                {plan.description && (
                  <p className="mt-2 text-sm text-muted-foreground max-w-md">
                    {plan.description}
                  </p>
                )}
              </div>
              <div className="font-hand text-3xl text-ochre hidden md:block">
                {todayDone}/{total}
              </div>
            </div>

            <ol className="border-t border-foreground/15">
              {plan.exercises.map((pe, i) => {
                const done = pe.completions.some(isToday);
                const thumb =
                  pe.exercise.thumbnailUrl ||
                  getVideoThumbnail(pe.exercise.videoUrl);
                const lastPain = pe.completions[0]?.painLevel;

                return (
                  <li
                    key={pe.id}
                    className="border-b border-foreground/15"
                  >
                    <Link
                      href={`/dashboard/exercises/${pe.id}`}
                      className={`group grid grid-cols-12 gap-4 items-center py-5 md:py-6 px-2 -mx-2 transition ${
                        done
                          ? "bg-primary/[0.04]"
                          : "hover:bg-foreground/[0.02]"
                      }`}
                    >
                      {/* Number */}
                      <div className="col-span-1 md:col-span-1">
                        <div
                          className={`font-mono text-sm ${
                            done
                              ? "text-primary line-through"
                              : "text-muted-foreground"
                          }`}
                        >
                          {String(i + 1).padStart(2, "0")}
                        </div>
                      </div>

                      {/* Thumbnail */}
                      <div className="col-span-2 md:col-span-2">
                        <div className="relative w-full aspect-[4/3] md:aspect-video rounded-sm overflow-hidden bg-muted">
                          {thumb && (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={thumb}
                              alt={pe.exercise.title}
                              className={`w-full h-full object-cover ${
                                done ? "opacity-60" : ""
                              }`}
                            />
                          )}
                          <div
                            className={`absolute inset-0 flex items-center justify-center ${
                              done
                                ? "bg-primary/70 text-primary-foreground"
                                : "bg-black/20 text-white group-hover:bg-black/40"
                            } transition`}
                          >
                            {done ? (
                              <CheckCircle2 className="h-5 w-5" />
                            ) : (
                              <Play className="h-5 w-5 fill-current" />
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Title + prescription */}
                      <div className="col-span-9 md:col-span-6 min-w-0">
                        <div
                          className={`font-serif text-xl md:text-2xl leading-tight ${
                            done ? "text-foreground/60" : "group-hover:text-primary"
                          } transition`}
                        >
                          {pe.exercise.title}
                        </div>
                        <div className="mt-1.5 font-mono text-[11px] text-muted-foreground uppercase tracking-wider">
                          {[
                            pe.sets && `${pe.sets} × `,
                            pe.reps && `${pe.reps} rep`,
                            pe.holdSeconds && `${pe.holdSeconds}s hold`,
                            pe.frequencyPerWeek &&
                              ` · ${pe.frequencyPerWeek}/săpt`,
                          ]
                            .filter(Boolean)
                            .join("")}
                        </div>
                        {pe.notes && (
                          <p className="mt-2 font-hand text-base text-ochre italic">
                            &ldquo;{pe.notes}&rdquo;
                          </p>
                        )}
                      </div>

                      {/* Status column */}
                      <div className="hidden md:block col-span-2 text-right">
                        {done ? (
                          <div className="text-xs">
                            <div className="text-primary font-medium">
                              ✓ Făcut azi
                            </div>
                            {lastPain != null && (
                              <div className="text-muted-foreground mt-1">
                                durere {lastPain}/10
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="text-xs text-muted-foreground">
                            În așteptare
                          </div>
                        )}
                      </div>

                      <div className="col-span-12 md:col-span-1 flex md:justify-end">
                        <ArrowUpRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition" />
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ol>

            {/* Signature */}
            <div className="mt-10 flex items-center justify-end gap-4 text-right">
              <div>
                <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                  Prescris de
                </div>
                <div className="font-hand text-2xl text-foreground/80">
                  {therapistName}
                </div>
              </div>
              <Leaf className="h-8 w-8 text-primary/40" />
            </div>
          </div>
        </section>
      ))}

      {/* CLOSING LINE */}
      <section className="border-t border-foreground/10">
        <div className="max-w-[1100px] mx-auto px-6 md:px-10 py-14 text-center">
          <div className="font-hand text-3xl md:text-4xl text-ochre mb-2">
            &mdash; pasul următor
          </div>
          <h3 className="font-serif text-2xl md:text-3xl max-w-xl mx-auto leading-tight">
            {allDone
              ? "Ai făcut tot. Odihnă activă și mișcare ușoară."
              : todayDone === 0 && total > 0
              ? "Începe cu primul. Corpul învață prin repetiție."
              : total === 0
              ? "Revino mâine — planul se va actualiza."
              : "Continuă. Fiecare repetare construiește ceva."}
          </h3>
          {total > 0 && !allDone && (
            <div className="mt-8">
              <Link href="/dashboard/exercises">
                <Button size="lg" className="gap-2 rounded-none px-6 h-12">
                  Vezi toate exercițiile
                  <ArrowUpRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

/* ====================================================================
   COMPONENTS
   ==================================================================== */

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
  const stroke = 8;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (rate / 100) * c;
  return (
    <div className="relative w-[160px] h-[160px]">
      <svg
        width={size}
        height={size}
        className="-rotate-90"
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="var(--border)"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="var(--primary)"
          strokeWidth={stroke}
          strokeDasharray={c}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 0.6s ease" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="display-numeral text-4xl">{rate}%</div>
        <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground mt-1">
          {done}/{total} azi
        </div>
      </div>
    </div>
  );
}

function DayBar({
  count,
  intensity,
  isToday: today,
}: {
  label: string;
  count: number;
  intensity: number; // 0–1
  isToday: boolean;
}) {
  return (
    <div className="flex flex-col items-center gap-1.5">
      <div
        className={`relative w-full h-20 md:h-24 rounded-sm overflow-hidden ${
          today
            ? "ring-2 ring-primary ring-offset-1 ring-offset-background"
            : ""
        }`}
        style={{
          background: count > 0
            ? `color-mix(in oklch, var(--primary) ${Math.max(
                12,
                intensity * 70
              )}%, var(--muted))`
            : "var(--muted)",
        }}
      >
        {count > 0 && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span
              className="font-serif text-xl"
              style={{
                color:
                  intensity > 0.4
                    ? "var(--primary-foreground)"
                    : "var(--foreground)",
              }}
            >
              {count}
            </span>
          </div>
        )}
      </div>
    </div>
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
    <div>
      <div className="border-b border-foreground/15">
        <div className="max-w-[1100px] mx-auto px-6 md:px-10 py-4 text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
          Prescripție de azi · {formatDateLong(new Date())}
        </div>
      </div>
      <section className="max-w-[1100px] mx-auto px-6 md:px-10 py-20 md:py-32 text-center">
        <div className="font-hand text-2xl text-ochre mb-3">{greeting}</div>
        <h1 className="font-serif text-[clamp(2.5rem,6vw,5rem)] leading-[0.95] mb-6">
          Bine ai venit, {name}.
        </h1>
        <p className="text-lg text-muted-foreground max-w-md mx-auto">
          Terapeutul tău nu ți-a atribuit încă un plan. Îți scrie prescripția
          în curând.
        </p>
        <div className="mt-10">
          <Heart className="h-8 w-8 text-primary/40 mx-auto" />
        </div>
      </section>
    </div>
  );
}

/* ====================================================================
   HELPERS
   ==================================================================== */

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
  // Start on Monday 6 days ago
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const dayStr = d.toDateString();
    const count = completions.filter(
      (c) => new Date(c.completedAt).toDateString() === dayStr
    ).length;
    // Romanian week starts Monday: getDay() returns 0 for Sun; map to Mo-Su
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
  if (h < 6) return "noapte bună,";
  if (h < 12) return "bună dimineața,";
  if (h < 18) return "bună ziua,";
  return "bună seara,";
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
