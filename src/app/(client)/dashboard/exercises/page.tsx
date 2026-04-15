import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Video, CheckCircle, Clock } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function ClientExercisesPage() {
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
              completions: { orderBy: { completedAt: "desc" }, take: 1 },
            },
            orderBy: { orderIndex: "asc" },
          },
        },
      },
    },
  });

  const allExercises = profile?.assignedPlans.flatMap((p) =>
    p.exercises.map((pe) => ({ ...pe, planName: p.name }))
  ) ?? [];

  return (
    <div className="p-4 md:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Exercițiile mele</h1>
        <p className="text-muted-foreground">
          Toate exercițiile din planurile tale de tratament active
        </p>
      </div>

      {allExercises.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Video className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Niciun exercițiu atribuit</h3>
            <p className="text-muted-foreground">
              Fizioterapeutul tău va atribui exerciții planului tău de tratament.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {allExercises.map((pe) => {
            const lastCompletion = pe.completions[0];
            const completedToday = lastCompletion
              ? new Date(lastCompletion.completedAt).toDateString() ===
                new Date().toDateString()
              : false;

            return (
              <Link key={pe.id} href={`/dashboard/exercises/${pe.id}`}>
                <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
                  <CardContent className="p-0">
                    <div className="aspect-video bg-muted rounded-t-lg flex items-center justify-center relative">
                      {pe.exercise.thumbnailUrl ? (
                        <img
                          src={pe.exercise.thumbnailUrl}
                          alt={pe.exercise.title}
                          className="w-full h-full object-cover rounded-t-lg"
                        />
                      ) : (
                        <Video className="h-10 w-10 text-muted-foreground" />
                      )}
                      {completedToday && (
                        <div className="absolute top-2 right-2 bg-green-500 text-white p-1 rounded-full">
                          <CheckCircle className="h-4 w-4" />
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <p className="text-xs text-muted-foreground mb-1">
                        {pe.planName}
                      </p>
                      <h3 className="font-semibold mb-1">
                        {pe.exercise.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        {pe.sets && `${pe.sets} seturi`}
                        {pe.reps && ` x ${pe.reps} repetări`}
                        {pe.holdSeconds && ` x ${pe.holdSeconds}s menținere`}
                      </p>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-xs">
                          {pe.exercise.category}
                        </Badge>
                        {pe.exercise.duration && (
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {Math.floor(pe.exercise.duration / 60)}m
                          </span>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
