"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { CheckCircle } from "lucide-react";

interface CompletionFormProps {
  planExerciseId: string;
  targetSets: number | null;
  targetReps: number | null;
}

export function CompletionForm({
  planExerciseId,
  targetSets,
  targetReps,
}: CompletionFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [painLevel, setPainLevel] = useState(0);
  const [difficultyFelt, setDifficultyFelt] = useState(3);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);

    try {
      const res = await fetch("/api/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          planExerciseId,
          setsCompleted: Number(formData.get("setsCompleted")) || null,
          repsCompleted: Number(formData.get("repsCompleted")) || null,
          painLevel,
          difficultyFelt,
          notes: formData.get("notes") || null,
        }),
      });

      if (res.ok) {
        setSuccess(true);
        router.refresh();
        setTimeout(() => setSuccess(false), 3000);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Înregistrează finalizarea</CardTitle>
        <CardDescription>Notează cum a decurs acest exercițiu</CardDescription>
      </CardHeader>
      <CardContent>
        {success ? (
          <div className="flex flex-col items-center gap-2 py-4 text-green-600">
            <CheckCircle className="h-10 w-10" />
            <p className="font-medium">Exercițiu înregistrat!</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs">Seturi finalizate</Label>
                <Input
                  name="setsCompleted"
                  type="number"
                  min={0}
                  defaultValue={targetSets ?? ""}
                  className="h-8"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Repetări finalizate</Label>
                <Input
                  name="repsCompleted"
                  type="number"
                  min={0}
                  defaultValue={targetReps ?? ""}
                  className="h-8"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-xs">
                Nivel durere: {painLevel}/10
              </Label>
              <Slider
                value={[painLevel]}
                onValueChange={(v) => setPainLevel(Array.isArray(v) ? v[0] : v)}
                max={10}
                step={1}
              />
              <div className="flex justify-between text-[10px] text-muted-foreground">
                <span>Fără durere</span>
                <span>Severă</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-xs">
                Dificultate: {difficultyFelt}/5
              </Label>
              <Slider
                value={[difficultyFelt]}
                onValueChange={(v) => setDifficultyFelt(Array.isArray(v) ? v[0] : v)}
                min={1}
                max={5}
                step={1}
              />
              <div className="flex justify-between text-[10px] text-muted-foreground">
                <span>Foarte ușor</span>
                <span>Foarte greu</span>
              </div>
            </div>

            <div className="space-y-1">
              <Label className="text-xs">Note (opțional)</Label>
              <Textarea
                name="notes"
                placeholder="Cum s-a simțit? Vreun disconfort?"
                rows={2}
                className="text-sm"
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Se înregistrează..." : "Înregistrează exercițiul"}
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  );
}
