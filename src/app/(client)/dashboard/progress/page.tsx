import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProgressCharts } from "@/components/progress/progress-charts";

export const dynamic = "force-dynamic";

export default async function ProgressPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const profile = await prisma.clientProfile.findUnique({
    where: { userId: user.id },
    include: {
      progressEntries: {
        orderBy: { date: "desc" },
        take: 30,
      },
      assignedPlans: {
        include: {
          exercises: {
            include: {
              completions: {
                orderBy: { completedAt: "desc" },
                take: 50,
              },
            },
          },
        },
      },
    },
  });

  const completions =
    profile?.assignedPlans
      .flatMap((p) => p.exercises.flatMap((e) => e.completions))
      .sort(
        (a, b) =>
          new Date(b.completedAt).getTime() -
          new Date(a.completedAt).getTime()
      ) ?? [];

  const painData = completions
    .filter((c) => c.painLevel !== null)
    .map((c) => ({
      date: new Date(c.completedAt).toLocaleDateString(),
      painLevel: c.painLevel!,
    }))
    .reverse();

  const completionsByDate = completions.reduce(
    (acc, c) => {
      const date = new Date(c.completedAt).toLocaleDateString();
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  const activityData = Object.entries(completionsByDate)
    .map(([date, count]) => ({ date, count }))
    .reverse()
    .slice(-14);

  return (
    <div className="p-4 md:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Progres</h1>
        <p className="text-muted-foreground">
          Urmărește-ți parcursul de recuperare
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3 mb-8">
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground">Total finalizări</p>
            <p className="text-3xl font-bold mt-1">{completions.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground">Nivel mediu durere</p>
            <p className="text-3xl font-bold mt-1">
              {painData.length > 0
                ? (
                    painData.reduce((s, d) => s + d.painLevel, 0) /
                    painData.length
                  ).toFixed(1)
                : "N/A"}
              <span className="text-sm font-normal text-muted-foreground">
                /10
              </span>
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground">Zile active (14 zile)</p>
            <p className="text-3xl font-bold mt-1">{activityData.length}</p>
          </CardContent>
        </Card>
      </div>

      <ProgressCharts painData={painData} activityData={activityData} />
    </div>
  );
}
