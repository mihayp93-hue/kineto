"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, X } from "lucide-react";
import Link from "next/link";
import {
  BODY_PARTS,
  EXERCISE_CATEGORIES,
  EQUIPMENT_OPTIONS,
} from "@/lib/constants";

interface ExerciseData {
  title: string;
  description: string;
  videoUrl: string;
  thumbnailUrl: string | null;
  duration: number | null;
  category: string;
  difficulty: "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
  bodyPart: string[];
  equipment: string[];
  instructions: string | null;
}

export default function EditExercisePage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState("");
  const [data, setData] = useState<ExerciseData | null>(null);

  useEffect(() => {
    fetch(`/api/exercises/${id}`)
      .then((r) => r.json())
      .then((ex) => {
        setData({
          title: ex.title ?? "",
          description: ex.description ?? "",
          videoUrl: ex.videoUrl ?? "",
          thumbnailUrl: ex.thumbnailUrl,
          duration: ex.duration,
          category: ex.category ?? "",
          difficulty: ex.difficulty ?? "BEGINNER",
          bodyPart: ex.bodyPart ?? [],
          equipment: ex.equipment ?? [],
          instructions: ex.instructions,
        });
        setInitialLoading(false);
      })
      .catch(() => {
        setError("Nu s-a putut încărca exercițiul");
        setInitialLoading(false);
      });
  }, [id]);

  function toggleItem(
    item: string,
    list: string[],
    setList: (v: string[]) => void
  ) {
    setList(
      list.includes(item) ? list.filter((i) => i !== item) : [...list, item]
    );
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!data) return;
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`/api/exercises/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: data.title,
          description: data.description,
          videoUrl: data.videoUrl,
          thumbnailUrl: data.thumbnailUrl || null,
          duration: data.duration || null,
          category: data.category,
          difficulty: data.difficulty,
          bodyPart: data.bodyPart,
          equipment: data.equipment,
          instructions: data.instructions || null,
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Salvarea a eșuat");
      }
      router.push(`/admin/exercises/${id}`);
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Eroare");
    } finally {
      setLoading(false);
    }
  }

  if (initialLoading) {
    return (
      <div className="p-8">
        <p className="text-muted-foreground">Se încarcă...</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="p-8">
        <p className="text-destructive">{error || "Exercițiu negăsit"}</p>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-3xl">
      <Link
        href={`/admin/exercises/${id}`}
        className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-1" />
        Înapoi la exercițiu
      </Link>

      <Card>
        <CardHeader>
          <CardTitle>Editează exercițiu</CardTitle>
          <CardDescription>Actualizează detaliile și videoclipul</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Titlu *</Label>
              <Input
                id="title"
                value={data.title}
                onChange={(e) => setData({ ...data, title: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descriere *</Label>
              <Textarea
                id="description"
                value={data.description}
                onChange={(e) =>
                  setData({ ...data, description: e.target.value })
                }
                rows={3}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="videoUrl">URL Video *</Label>
              <Input
                id="videoUrl"
                type="url"
                value={data.videoUrl}
                onChange={(e) =>
                  setData({ ...data, videoUrl: e.target.value })
                }
                required
              />
              <p className="text-xs text-muted-foreground">
                Acceptă YouTube (youtube.com/watch sau youtu.be), Vimeo, sau
                fișiere .mp4/.webm
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="thumbnailUrl">URL miniatură (opțional)</Label>
              <Input
                id="thumbnailUrl"
                type="url"
                value={data.thumbnailUrl ?? ""}
                onChange={(e) =>
                  setData({ ...data, thumbnailUrl: e.target.value || null })
                }
                placeholder="Lasă gol pentru miniatura YouTube automată"
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Categorie *</Label>
                <select
                  id="category"
                  value={data.category}
                  onChange={(e) =>
                    setData({ ...data, category: e.target.value })
                  }
                  required
                  className="w-full h-9 rounded-md border bg-background px-3 text-sm"
                >
                  <option value="">Selectează...</option>
                  {EXERCISE_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="difficulty">Dificultate *</Label>
                <select
                  id="difficulty"
                  value={data.difficulty}
                  onChange={(e) =>
                    setData({
                      ...data,
                      difficulty: e.target
                        .value as ExerciseData["difficulty"],
                    })
                  }
                  required
                  className="w-full h-9 rounded-md border bg-background px-3 text-sm"
                >
                  <option value="BEGINNER">Începător</option>
                  <option value="INTERMEDIATE">Intermediar</option>
                  <option value="ADVANCED">Avansat</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="duration">Durată (sec)</Label>
                <Input
                  id="duration"
                  type="number"
                  min={0}
                  value={data.duration ?? ""}
                  onChange={(e) =>
                    setData({
                      ...data,
                      duration: e.target.value
                        ? parseInt(e.target.value, 10)
                        : null,
                    })
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Părți ale corpului</Label>
              <div className="flex flex-wrap gap-2">
                {BODY_PARTS.map((part) => (
                  <Badge
                    key={part}
                    variant={
                      data.bodyPart.includes(part) ? "default" : "outline"
                    }
                    className="cursor-pointer"
                    onClick={() =>
                      toggleItem(part, data.bodyPart, (next) =>
                        setData({ ...data, bodyPart: next })
                      )
                    }
                  >
                    {part}
                    {data.bodyPart.includes(part) && (
                      <X className="h-3 w-3 ml-1" />
                    )}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Echipament</Label>
              <div className="flex flex-wrap gap-2">
                {EQUIPMENT_OPTIONS.map((item) => (
                  <Badge
                    key={item}
                    variant={
                      data.equipment.includes(item) ? "default" : "outline"
                    }
                    className="cursor-pointer"
                    onClick={() =>
                      toggleItem(item, data.equipment, (next) =>
                        setData({ ...data, equipment: next })
                      )
                    }
                  >
                    {item}
                    {data.equipment.includes(item) && (
                      <X className="h-3 w-3 ml-1" />
                    )}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="instructions">Instrucțiuni</Label>
              <Textarea
                id="instructions"
                value={data.instructions ?? ""}
                onChange={(e) =>
                  setData({ ...data, instructions: e.target.value || null })
                }
                rows={4}
              />
            </div>

            {error && <p className="text-sm text-destructive">{error}</p>}

            <div className="flex gap-3">
              <Button type="submit" disabled={loading}>
                {loading ? "Se salvează..." : "Salvează modificările"}
              </Button>
              <Link href={`/admin/exercises/${id}`}>
                <Button variant="outline" type="button">
                  Anulează
                </Button>
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
