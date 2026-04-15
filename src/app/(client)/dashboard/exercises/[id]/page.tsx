import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { VideoPlayer } from "@/components/exercises/video-player";
import { CompletionForm } from "@/components/exercises/completion-form";

export const dynamic = "force-dynamic";

export default async function ClientExerciseDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const planExercise = await prisma.planExercise.findUnique({
    where: { id },
    include: {
      exercise: {
        include: { annotations: { orderBy: { timestampSec: "asc" } } },
      },
      treatmentPlan: true,
      completions: { orderBy: { completedAt: "desc" }, take: 10 },
    },
  });

  if (!planExercise) notFound();

  const exercise = planExercise.exercise;

  return (
    <div className="p-4 md:p-8 max-w-4xl">
      <Link
        href="/dashboard/exercises"
        className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-1" />
        Înapoi la exerciții
      </Link>

      <div className="mb-6">
        <p className="text-sm text-muted-foreground mb-1">
          {planExercise.treatmentPlan.name}
        </p>
        <h1 className="text-3xl font-bold">{exercise.title}</h1>
        <div className="flex items-center gap-2 mt-2">
          <Badge variant="secondary">{exercise.category}</Badge>
          <Badge variant="outline">{exercise.difficulty}</Badge>
          {planExercise.sets && (
            <span className="text-sm text-muted-foreground">
              {planExercise.sets} seturi
              {planExercise.reps && ` x ${planExercise.reps} repetări`}
              {planExercise.holdSeconds &&
                ` x ${planExercise.holdSeconds}s menținere`}
            </span>
          )}
        </div>
      </div>

      {/* Video */}
      <Card className="mb-6">
        <CardContent className="p-0">
          <VideoPlayer
            url={exercise.videoUrl}
            annotations={exercise.annotations}
          />
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Instructions & Notes */}
        <div className="space-y-4">
          {exercise.description && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Descriere</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                  {exercise.description}
                </p>
              </CardContent>
            </Card>
          )}

          {exercise.instructions && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Instrucțiuni</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                  {exercise.instructions}
                </p>
              </CardContent>
            </Card>
          )}

          {planExercise.notes && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  Note de la fizioterapeut
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {planExercise.notes}
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Completion Form & History */}
        <div className="space-y-4">
          <CompletionForm
            planExerciseId={planExercise.id}
            targetSets={planExercise.sets}
            targetReps={planExercise.reps}
          />

          {planExercise.completions.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Activitate recentă</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {planExercise.completions.map((completion) => (
                    <div
                      key={completion.id}
                      className="flex items-center justify-between p-2 rounded border text-sm"
                    >
                      <div>
                        <p className="font-medium">
                          {new Date(
                            completion.completedAt
                          ).toLocaleDateString()}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {completion.setsCompleted &&
                            `${completion.setsCompleted} seturi`}
                          {completion.repsCompleted &&
                            ` x ${completion.repsCompleted} repetări`}
                        </p>
                      </div>
                      <div className="text-right">
                        {completion.painLevel !== null && (
                          <p className="text-xs">
                            Durere: {completion.painLevel}/10
                          </p>
                        )}
                        {completion.difficultyFelt !== null && (
                          <p className="text-xs text-muted-foreground">
                            Dificultate: {completion.difficultyFelt}/5
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
