import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Video, Clock } from "lucide-react";
import { getVideoThumbnail } from "@/lib/video-url";

export const dynamic = "force-dynamic";

export default async function ExercisesPage() {
  const exercises = await prisma.exercise.findMany({
    orderBy: { createdAt: "desc" },
    include: { tags: true, _count: { select: { planExercises: true } } },
  });

  return (
    <div className="p-4 md:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold">Bibliotecă de exerciții</h1>
          <p className="text-muted-foreground">
            Gestionează colecția ta de videoclipuri cu exerciții
          </p>
        </div>
        <Link href="/admin/exercises/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Adaugă exercițiu
          </Button>
        </Link>
      </div>

      {exercises.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Video className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Niciun exercițiu încă</h3>
            <p className="text-muted-foreground mb-4">
              Încarcă primul videoclip cu exercițiu pentru a începe.
            </p>
            <Link href="/admin/exercises/new">
              <Button>Încarcă exercițiu</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {exercises.map((exercise) => (
            <Link key={exercise.id} href={`/admin/exercises/${exercise.id}`}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
                <CardContent className="p-0">
                  <div className="aspect-video bg-muted rounded-t-lg flex items-center justify-center overflow-hidden">
                    {(() => {
                      const thumb =
                        exercise.thumbnailUrl ||
                        getVideoThumbnail(exercise.videoUrl);
                      return thumb ? (
                        <img
                          src={thumb}
                          alt={exercise.title}
                          className="w-full h-full object-cover rounded-t-lg"
                        />
                      ) : (
                        <Video className="h-12 w-12 text-muted-foreground" />
                      );
                    })()}
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold mb-1">{exercise.title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                      {exercise.description}
                    </p>
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge variant="secondary">{exercise.category}</Badge>
                      <Badge variant="outline">{exercise.difficulty}</Badge>
                      {exercise.duration && (
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {Math.floor(exercise.duration / 60)}m{" "}
                          {exercise.duration % 60}s
                        </span>
                      )}
                    </div>
                    {exercise.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {exercise.tags.map((tag) => (
                          <span
                            key={tag.id}
                            className="inline-flex items-center text-[10px] font-medium px-1.5 py-0.5 rounded-full text-white"
                            style={{
                              backgroundColor: tag.color ?? "#94a3b8",
                            }}
                          >
                            {tag.name}
                          </span>
                        ))}
                      </div>
                    )}
                    <p className="text-xs text-muted-foreground mt-2">
                      Folosit în {exercise._count.planExercises} planuri
                    </p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
