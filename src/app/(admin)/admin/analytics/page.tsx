import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AnalyticsCharts } from "@/components/analytics/analytics-charts";

export const dynamic = "force-dynamic";

export default async function AnalyticsPage() {
  const [
    totalClients,
    activeClients,
    totalExercises,
    totalCompletions,
    recentCompletions,
  ] = await Promise.all([
    prisma.clientProfile.count(),
    prisma.clientProfile.count({ where: { status: "ACTIVE" } }),
    prisma.exercise.count(),
    prisma.exerciseCompletion.count(),
    prisma.exerciseCompletion.findMany({
      where: {
        completedAt: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
      },
      include: {
        planExercise: {
          include: { exercise: true },
        },
      },
      orderBy: { completedAt: "desc" },
    }),
  ]);

  // Most prescribed exercises
  const exerciseCounts = await prisma.planExercise.groupBy({
    by: ["exerciseId"],
    _count: { exerciseId: true },
    orderBy: { _count: { exerciseId: "desc" } },
    take: 10,
  });

  const topExercises = await Promise.all(
    exerciseCounts.map(async (ec) => {
      const exercise = await prisma.exercise.findUnique({
        where: { id: ec.exerciseId },
      });
      return {
        name: exercise?.title ?? "Unknown",
        count: ec._count.exerciseId,
      };
    })
  );

  // Pain trends (avg per day over last 30 days)
  const painByDate = recentCompletions
    .filter((c) => c.painLevel !== null)
    .reduce(
      (acc, c) => {
        const date = new Date(c.completedAt).toLocaleDateString();
        if (!acc[date]) acc[date] = { sum: 0, count: 0 };
        acc[date].sum += c.painLevel!;
        acc[date].count++;
        return acc;
      },
      {} as Record<string, { sum: number; count: number }>
    );

  const painTrend = Object.entries(painByDate)
    .map(([date, { sum, count }]) => ({
      date,
      avgPain: Math.round((sum / count) * 10) / 10,
    }))
    .reverse();

  // Completions per day
  const completionsByDate = recentCompletions.reduce(
    (acc, c) => {
      const date = new Date(c.completedAt).toLocaleDateString();
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  const dailyCompletions = Object.entries(completionsByDate)
    .map(([date, count]) => ({ date, count }))
    .reverse();

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Analize</h1>
        <p className="text-muted-foreground">
          Privire de ansamblu asupra performanței cabinetului
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-4 mb-8">
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground">Total pacienți</p>
            <p className="text-3xl font-bold mt-1">{totalClients}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground">Pacienți activi</p>
            <p className="text-3xl font-bold mt-1">{activeClients}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground">Exerciții</p>
            <p className="text-3xl font-bold mt-1">{totalExercises}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground">Total finalizări</p>
            <p className="text-3xl font-bold mt-1">{totalCompletions}</p>
          </CardContent>
        </Card>
      </div>

      <AnalyticsCharts
        topExercises={topExercises}
        painTrend={painTrend}
        dailyCompletions={dailyCompletions}
      />
    </div>
  );
}
