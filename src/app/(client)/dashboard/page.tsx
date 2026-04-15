import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Dumbbell,
  CheckCircle,
  TrendingUp,
  Calendar,
  Play,
} from "lucide-react";

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

  if (!profile) {
    return (
      <div className="p-4 md:p-8">
        <h1 className="text-3xl font-bold mb-4">Bine ai venit, {user.name}</h1>
        <Card>
          <CardContent className="p-4 md:p-8 text-center text-muted-foreground">
            Fizioterapeutul tău nu ți-a atribuit încă niciun exercițiu. Revino
            în curând!
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
    totalExercises > 0 ? Math.round((todayCompletions / totalExercises) * 100) : 0;

  return (
    <div className="p-4 md:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Bine ai revenit, {user.name}</h1>
        <p className="text-muted-foreground">
          Iată rezumatul exercițiilor tale pentru astăzi
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Progresul de azi</p>
                <p className="text-3xl font-bold mt-1">
                  {todayCompletions}/{totalExercises}
                </p>
              </div>
              <CheckCircle className="h-5 w-5 text-muted-foreground" />
            </div>
            <Progress value={completionRate} className="mt-3" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Planuri active</p>
                <p className="text-3xl font-bold mt-1">
                  {profile.assignedPlans.length}
                </p>
              </div>
              <Dumbbell className="h-5 w-5 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  Total finalizări
                </p>
                <p className="text-3xl font-bold mt-1">{totalCompletions}</p>
              </div>
              <TrendingUp className="h-5 w-5 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Exerciții</p>
                <p className="text-3xl font-bold mt-1">{totalExercises}</p>
              </div>
              <Calendar className="h-5 w-5 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Active Plans */}
      {profile.assignedPlans.map((plan) => (
        <Card key={plan.id} className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>{plan.name}</CardTitle>
              <Badge>ACTIV</Badge>
            </div>
            {plan.description && (
              <p className="text-sm text-muted-foreground">
                {plan.description}
              </p>
            )}
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {plan.exercises.map((pe) => {
                const completedToday = pe.completions.some(
                  (c) =>
                    new Date(c.completedAt).toDateString() ===
                    new Date().toDateString()
                );

                return (
                  <Link
                    key={pe.id}
                    href={`/dashboard/exercises/${pe.id}`}
                    className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`p-2 rounded-full ${
                          completedToday
                            ? "bg-green-100 text-green-600"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {completedToday ? (
                          <CheckCircle className="h-5 w-5" />
                        ) : (
                          <Play className="h-5 w-5" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium">{pe.exercise.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {pe.sets && `${pe.sets} seturi`}
                          {pe.reps && ` x ${pe.reps} repetări`}
                          {pe.holdSeconds && ` x ${pe.holdSeconds}s menținere`}
                          {pe.frequencyPerWeek &&
                            ` | ${pe.frequencyPerWeek}x/săptămână`}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={completedToday ? "default" : "outline"}
                        className="text-xs"
                      >
                        {completedToday ? "Făcut azi" : "În așteptare"}
                      </Badge>
                    </div>
                  </Link>
                );
              })}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
