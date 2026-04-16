import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Clock, Edit, Trash2 } from "lucide-react";
import Link from "next/link";
import { VideoPlayer } from "@/components/exercises/video-player";
import { DeleteExerciseButton } from "@/components/exercises/delete-exercise-button";

export const dynamic = "force-dynamic";

export default async function ExerciseDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const exercise = await prisma.exercise.findUnique({
    where: { id },
    include: {
      annotations: { orderBy: { timestampSec: "asc" } },
      tags: true,
      _count: { select: { planExercises: true } },
    },
  });

  if (!exercise) notFound();

  return (
    <div className="p-4 md:p-8 max-w-4xl">
      <Link
        href="/admin/exercises"
        className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-1" />
        Înapoi la exerciții
      </Link>

      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold">{exercise.title}</h1>
          <div className="flex items-center gap-2 mt-2">
            <Badge variant="secondary">{exercise.category}</Badge>
            <Badge variant="outline">{exercise.difficulty}</Badge>
            {exercise.duration && (
              <span className="text-sm text-muted-foreground flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {Math.floor(exercise.duration / 60)}m {exercise.duration % 60}s
              </span>
            )}
          </div>
        </div>
        <div className="flex gap-2">
          <Link href={`/admin/exercises/${id}/edit`}>
            <Button variant="outline" size="sm">
              <Edit className="h-4 w-4 mr-1" />
              Editează
            </Button>
          </Link>
          <DeleteExerciseButton exerciseId={id} />
        </div>
      </div>

      {/* Video Player */}
      <Card className="mb-6">
        <CardContent className="p-0">
          <VideoPlayer
            url={exercise.videoUrl}
            annotations={exercise.annotations}
          />
        </CardContent>
      </Card>

      {/* Details */}
      <div className="grid md:grid-cols-2 gap-6">
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

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Detalii</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {exercise.bodyPart.length > 0 && (
              <div>
                <p className="text-sm font-medium mb-1">Părți ale corpului</p>
                <div className="flex flex-wrap gap-1">
                  {exercise.bodyPart.map((part) => (
                    <Badge key={part} variant="secondary" className="text-xs">
                      {part}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            {exercise.equipment.length > 0 && (
              <div>
                <p className="text-sm font-medium mb-1">Echipament</p>
                <div className="flex flex-wrap gap-1">
                  {exercise.equipment.map((item) => (
                    <Badge key={item} variant="outline" className="text-xs">
                      {item}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            {exercise.tags.length > 0 && (
              <div>
                <p className="text-sm font-medium mb-1">Afecțiuni</p>
                <div className="flex flex-wrap gap-1">
                  {exercise.tags.map((tag) => (
                    <span
                      key={tag.id}
                      className="inline-flex items-center text-xs font-medium px-2 py-0.5 rounded-full text-white"
                      style={{
                        backgroundColor: tag.color ?? "#94a3b8",
                      }}
                    >
                      {tag.name}
                    </span>
                  ))}
                </div>
              </div>
            )}
            <div>
              <p className="text-sm font-medium mb-1">Utilizare</p>
              <p className="text-sm text-muted-foreground">
                Folosit în {exercise._count.planExercises} planuri de tratament
              </p>
            </div>
          </CardContent>
        </Card>

        {exercise.instructions && (
          <Card className="md:col-span-2">
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

        {exercise.annotations.length > 0 && (
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="text-lg">Adnotări video</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {exercise.annotations.map((annotation) => (
                  <div
                    key={annotation.id}
                    className="flex items-start gap-3 p-2 rounded border"
                  >
                    <Badge variant="secondary" className="font-mono text-xs shrink-0">
                      {formatTimestamp(annotation.timestampSec)}
                    </Badge>
                    <p className="text-sm">{annotation.note}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

function formatTimestamp(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}
