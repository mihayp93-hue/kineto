import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Dumbbell,
  CheckCircle,
  TrendingUp,
  Calendar,
  Play,
  Sparkles,
  ArrowRight,
  Heart,
} from "lucide-react";
import { getVideoThumbnail } from "@/lib/video-url";

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
              completions: {
                orderBy: { completedAt: "desc" },
              },
            },
            orderBy: { orderIndex: "asc" },
          },
        },
      },
    },
  });

  const greeting = getTodayGreeting();

  if (!profile) {
    return (
      <div className="p-4 md:p-8 max-w-5xl">
        <h1 className="font-serif text-4xl md:text-5xl mb-2">
          {greeting} {user.name}
        </h1>
        <p className="text-muted-foreground mb-8">
          Bine ai venit la PhysioConnect
        </p>
        <Card>
          <CardContent className="p-10 text-center">
            <div className="h-14 w-14 rounded-full bg-primary/10 text-primary mx-auto flex items-center justify-center mb-5">
              <Heart className="h-6 w-6" />
            </div>
            <p className="font-medium mb-1">
              Încă nu ai un plan de recuperare
            </p>
            <p className="text-sm text-muted-foreground max-w-sm mx-auto">
              Terapeutul tău nu ți-a atribuit încă niciun exercițiu. Revino în
              curând!
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const allExercises = profile.assignedPlans.flatMap((p) => p.exercises);
  const totalExercises = allExercises.length;
  const todayCompletions = allExercises.filter((pe) =>
    pe.completions.some(
      (c) =>
        new Date(c.completedAt).toDateString() === new Date().toDateString()
    )
  ).length;

  const totalCompletions = allExercises.reduce(
    (sum, pe) => sum + pe.completions.length,
    0
  );

  const completionRate =
    totalExercises > 0
      ? Math.round((todayCompletions / totalExercises) * 100)
      : 0;

  const allDone = todayCompletions === totalExercises && totalExercises > 0;

  return (
    <div className="p-4 md:p-8 max-w-5xl">
      {/* Greeting banner */}
      <div className="relative overflow-hidden rounded-[1.5rem] border bg-gradient-to-br from-primary via-[oklch(0.44_0.08_155)] to-[oklch(0.36_0.07_150)] text-primary-foreground p-6 md:p-8 mb-8">
        <div className="absolute inset-0 bg-dots opacity-20" />
        <div className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-ochre/30 blur-3xl" />
        <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-white/15 backdrop-blur px-3 py-1 text-xs font-medium mb-4">
              <Sparkles className="h-3 w-3" />
              {formatDate(new Date())}
            </div>
            <h1 className="font-serif text-4xl md:text-5xl leading-tight">
              {greeting} {user.name?.split(" ")[0]}
            </h1>
            <p className="text-primary-foreground/85 mt-2 text-sm md:text-base max-w-md">
              {allDone
                ? "Ai terminat toate exercițiile de azi. Felicitări! 🌿"
                : totalExercises === 0
                ? "Nu ai exerciții programate azi."
                : `Mai ai ${totalExercises - todayCompletions} exerciții de făcut azi.`}
            </p>
          </div>
          {totalExercises > 0 && (
            <div className="flex flex-col items-start md:items-end gap-2">
              <div className="text-xs text-primary-foreground/75">
                Progres astăzi
              </div>
              <div className="font-serif text-4xl leading-none">
                {completionRate}
                <span className="text-lg text-primary-foreground/70">%</span>
              </div>
              <div className="w-40">
                <Progress
                  value={completionRate}
                  className="bg-white/15 [&>[data-slot=progress-indicator]]:bg-ochre"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <StatCard
          label="Astăzi"
          value={`${todayCompletions}/${totalExercises}`}
          icon={<CheckCircle className="h-4 w-4" />}
          tone="primary"
        />
        <StatCard
          label="Planuri active"
          value={String(profile.assignedPlans.length)}
          icon={<Dumbbell className="h-4 w-4" />}
          tone="ochre"
        />
        <StatCard
          label="Total finalizări"
          value={String(totalCompletions)}
          icon={<TrendingUp className="h-4 w-4" />}
          tone="primary"
        />
        <StatCard
          label="Exerciții atribuite"
          value={String(totalExercises)}
          icon={<Calendar className="h-4 w-4" />}
          tone="ochre"
        />
      </div>

      {/* Active Plans */}
      {profile.assignedPlans.map((plan) => (
        <div key={plan.id} className="mb-8">
          <div className="flex items-center justify-between mb-4 px-1">
            <div>
              <h2 className="font-serif text-2xl md:text-3xl">{plan.name}</h2>
              {plan.description && (
                <p className="text-sm text-muted-foreground mt-0.5">
                  {plan.description}
                </p>
              )}
            </div>
            <Badge className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/10">
              ACTIV
            </Badge>
          </div>
          <div className="space-y-2.5">
            {plan.exercises.map((pe) => {
              const completedToday = pe.completions.some(
                (c) =>
                  new Date(c.completedAt).toDateString() ===
                  new Date().toDateString()
              );
              const thumb =
                pe.exercise.thumbnailUrl ||
                getVideoThumbnail(pe.exercise.videoUrl);

              return (
                <Link
                  key={pe.id}
                  href={`/dashboard/exercises/${pe.id}`}
                  className="group block"
                >
                  <div
                    className={`flex items-center gap-4 p-3 md:p-4 rounded-2xl border transition-all hover:shadow-md ${
                      completedToday
                        ? "bg-primary/5 border-primary/20"
                        : "bg-card hover:border-primary/30"
                    }`}
                  >
                    <div className="relative w-20 h-16 md:w-24 md:h-18 rounded-xl overflow-hidden bg-muted shrink-0">
                      {thumb && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={thumb}
                          alt={pe.exercise.title}
                          className="w-full h-full object-cover"
                        />
                      )}
                      <div
                        className={`absolute inset-0 flex items-center justify-center transition-colors ${
                          completedToday
                            ? "bg-primary/80 text-primary-foreground"
                            : thumb
                            ? "bg-black/25 text-white group-hover:bg-black/40"
                            : "text-muted-foreground"
                        }`}
                      >
                        {completedToday ? (
                          <CheckCircle className="h-6 w-6" />
                        ) : (
                          <Play className="h-6 w-6 fill-current" />
                        )}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium group-hover:text-primary transition truncate">
                        {pe.exercise.title}
                      </p>
                      <p className="text-xs text-muted-foreground truncate mt-0.5">
                        {[
                          pe.sets && `${pe.sets} seturi`,
                          pe.reps && `${pe.reps} repetări`,
                          pe.holdSeconds && `${pe.holdSeconds}s menținere`,
                          pe.frequencyPerWeek &&
                            `${pe.frequencyPerWeek}×/săpt`,
                        ]
                          .filter(Boolean)
                          .join(" · ")}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {completedToday ? (
                        <Badge className="bg-primary text-primary-foreground text-[10px] hidden sm:inline-flex">
                          Făcut azi
                        </Badge>
                      ) : (
                        <Badge
                          variant="outline"
                          className="text-[10px] hidden sm:inline-flex"
                        >
                          În așteptare
                        </Badge>
                      )}
                      <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

function StatCard({
  label,
  value,
  icon,
  tone = "primary",
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
  tone?: "primary" | "ochre";
}) {
  const iconClass =
    tone === "ochre"
      ? "bg-ochre/15 text-ochre"
      : "bg-primary/10 text-primary";
  return (
    <Card className="hover:shadow-md transition-all">
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <p className="text-xs uppercase tracking-wider text-muted-foreground font-medium">
              {label}
            </p>
            <p className="font-serif text-3xl mt-2 leading-none">{value}</p>
          </div>
          <div
            className={`h-9 w-9 rounded-xl flex items-center justify-center shrink-0 ${iconClass}`}
          >
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function getTodayGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Bună dimineața,";
  if (h < 18) return "Bună ziua,";
  return "Bună seara,";
}

function formatDate(d: Date) {
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
