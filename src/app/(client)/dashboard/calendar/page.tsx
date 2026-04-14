import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarView } from "@/components/calendar/calendar-view";

export const dynamic = "force-dynamic";

export default async function CalendarPage() {
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
              schedule: true,
              completions: {
                where: {
                  completedAt: {
                    gte: new Date(
                      new Date().setDate(new Date().getDate() - 30)
                    ),
                  },
                },
              },
            },
          },
        },
      },
    },
  });

  const scheduleData =
    profile?.assignedPlans.flatMap((plan) =>
      plan.exercises.flatMap((pe) =>
        pe.schedule.map((s) => ({
          dayOfWeek: s.dayOfWeek,
          timeOfDay: s.timeOfDay,
          exerciseTitle: pe.exercise.title,
          planExerciseId: pe.id,
          sets: pe.sets,
          reps: pe.reps,
          completions: pe.completions.map((c) => c.completedAt.toISOString()),
        }))
      )
    ) ?? [];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Calendar exerciții</h1>
        <p className="text-muted-foreground">
          Programul tău săptămânal de exerciții
        </p>
      </div>

      <CalendarView scheduleData={scheduleData} />
    </div>
  );
}
