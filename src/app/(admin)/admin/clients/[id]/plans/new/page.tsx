"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
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
import { ArrowLeft, Plus, X, GripVertical } from "lucide-react";

interface Exercise {
  id: string;
  title: string;
  category: string;
  difficulty: string;
  bodyPart: string[];
}

interface PlanExerciseEntry {
  exerciseId: string;
  exercise: Exercise;
  sets: number;
  reps: number;
  holdSeconds: number;
  frequencyPerWeek: number;
  notes: string;
}

export default function NewTreatmentPlanPage() {
  const router = useRouter();
  const params = useParams();
  const clientId = params.id as string;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [selectedExercises, setSelectedExercises] = useState<
    PlanExerciseEntry[]
  >([]);

  useEffect(() => {
    fetch("/api/exercises")
      .then((res) => res.json())
      .then(setExercises);
  }, []);

  function addExercise(exercise: Exercise) {
    if (selectedExercises.some((e) => e.exerciseId === exercise.id)) return;
    setSelectedExercises([
      ...selectedExercises,
      {
        exerciseId: exercise.id,
        exercise,
        sets: 3,
        reps: 10,
        holdSeconds: 0,
        frequencyPerWeek: 3,
        notes: "",
      },
    ]);
  }

  function removeExercise(exerciseId: string) {
    setSelectedExercises(
      selectedExercises.filter((e) => e.exerciseId !== exerciseId)
    );
  }

  function updateExercise(
    index: number,
    field: keyof PlanExerciseEntry,
    value: string | number
  ) {
    const updated = [...selectedExercises];
    (updated[index] as unknown as Record<string, unknown>)[field] = value;
    setSelectedExercises(updated);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (selectedExercises.length === 0) {
      setError("Adaugă cel puțin un exercițiu");
      return;
    }

    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);

    try {
      const res = await fetch("/api/treatment-plans", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientId,
          name: formData.get("name"),
          description: formData.get("description") || null,
          startDate: formData.get("startDate"),
          endDate: formData.get("endDate") || null,
          exercises: selectedExercises.map((ex, index) => ({
            exerciseId: ex.exerciseId,
            sets: ex.sets || null,
            reps: ex.reps || null,
            holdSeconds: ex.holdSeconds || null,
            frequencyPerWeek: ex.frequencyPerWeek || null,
            orderIndex: index,
            notes: ex.notes || null,
          })),
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to create plan");
      }

      router.push(`/admin/clients/${clientId}`);
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }

  const availableExercises = exercises.filter(
    (ex) => !selectedExercises.some((se) => se.exerciseId === ex.id)
  );

  return (
    <div className="p-8 max-w-4xl">
      <Link
        href={`/admin/clients/${clientId}`}
        className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-1" />
        Înapoi la pacient
      </Link>

      <form onSubmit={handleSubmit}>
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Plan nou de tratament</CardTitle>
            <CardDescription>
              Creează un plan personalizat de exerciții pentru pacient
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nume plan *</Label>
              <Input
                id="name"
                name="name"
                placeholder="ex: Recuperare umăr, Faza 1"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descriere</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Obiectivele și notele planului..."
                rows={2}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">Data începerii *</Label>
                <Input
                  id="startDate"
                  name="startDate"
                  type="date"
                  defaultValue={new Date().toISOString().split("T")[0]}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate">Data încheierii</Label>
                <Input id="endDate" name="endDate" type="date" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Exercise Selection */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Adaugă exerciții</CardTitle>
            <CardDescription>
              Selectează exerciții din biblioteca ta pentru a le include în plan
            </CardDescription>
          </CardHeader>
          <CardContent>
            {availableExercises.length === 0 && exercises.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Niciun exercițiu în biblioteca ta.{" "}
                <Link
                  href="/admin/exercises/new"
                  className="text-primary hover:underline"
                >
                  Adaugă unul mai întâi
                </Link>
              </p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {availableExercises.map((ex) => (
                  <button
                    key={ex.id}
                    type="button"
                    onClick={() => addExercise(ex)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm border rounded-lg hover:bg-muted transition-colors"
                  >
                    <Plus className="h-3 w-3" />
                    {ex.title}
                    <Badge variant="outline" className="text-[10px] ml-1">
                      {ex.category}
                    </Badge>
                  </button>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Selected Exercises */}
        {selectedExercises.length > 0 && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg">
                Exerciții în plan ({selectedExercises.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {selectedExercises.map((entry, index) => (
                <div
                  key={entry.exerciseId}
                  className="flex items-start gap-3 p-4 border rounded-lg"
                >
                  <GripVertical className="h-5 w-5 text-muted-foreground mt-1 shrink-0" />
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-medium">
                          {entry.exercise.title}
                        </span>
                        <Badge variant="secondary" className="ml-2 text-xs">
                          {entry.exercise.difficulty}
                        </Badge>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeExercise(entry.exerciseId)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="grid grid-cols-4 gap-3">
                      <div>
                        <Label className="text-xs">Seturi</Label>
                        <Input
                          type="number"
                          min={0}
                          value={entry.sets}
                          onChange={(e) =>
                            updateExercise(
                              index,
                              "sets",
                              parseInt(e.target.value) || 0
                            )
                          }
                          className="h-8"
                        />
                      </div>
                      <div>
                        <Label className="text-xs">Repetări</Label>
                        <Input
                          type="number"
                          min={0}
                          value={entry.reps}
                          onChange={(e) =>
                            updateExercise(
                              index,
                              "reps",
                              parseInt(e.target.value) || 0
                            )
                          }
                          className="h-8"
                        />
                      </div>
                      <div>
                        <Label className="text-xs">Menținere (sec)</Label>
                        <Input
                          type="number"
                          min={0}
                          value={entry.holdSeconds}
                          onChange={(e) =>
                            updateExercise(
                              index,
                              "holdSeconds",
                              parseInt(e.target.value) || 0
                            )
                          }
                          className="h-8"
                        />
                      </div>
                      <div>
                        <Label className="text-xs">Frecv./săpt.</Label>
                        <Input
                          type="number"
                          min={1}
                          max={7}
                          value={entry.frequencyPerWeek}
                          onChange={(e) =>
                            updateExercise(
                              index,
                              "frequencyPerWeek",
                              parseInt(e.target.value) || 1
                            )
                          }
                          className="h-8"
                        />
                      </div>
                    </div>
                    <div>
                      <Label className="text-xs">Note</Label>
                      <Input
                        placeholder="Instrucțiuni speciale pentru acest exercițiu..."
                        value={entry.notes}
                        onChange={(e) =>
                          updateExercise(index, "notes", e.target.value)
                        }
                        className="h-8"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {error && <p className="text-sm text-destructive mb-4">{error}</p>}

        <div className="flex gap-3">
          <Button type="submit" disabled={loading}>
            {loading ? "Se creează..." : "Creează plan de tratament"}
          </Button>
          <Link href={`/admin/clients/${clientId}`}>
            <Button variant="outline">Anulează</Button>
          </Link>
        </div>
      </form>
    </div>
  );
}
