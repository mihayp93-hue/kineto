"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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

export default function NewExercisePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [bodyParts, setBodyParts] = useState<string[]>([]);
  const [equipment, setEquipment] = useState<string[]>([]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);

    try {
      const res = await fetch("/api/exercises", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: formData.get("title"),
          description: formData.get("description"),
          videoUrl: formData.get("videoUrl"),
          thumbnailUrl: formData.get("thumbnailUrl") || null,
          duration: formData.get("duration")
            ? Number(formData.get("duration"))
            : null,
          category: formData.get("category"),
          difficulty: formData.get("difficulty"),
          bodyPart: bodyParts,
          equipment,
          instructions: formData.get("instructions") || null,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to create exercise");
      }

      router.push("/admin/exercises");
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }

  function toggleItem(
    item: string,
    list: string[],
    setList: (v: string[]) => void
  ) {
    setList(
      list.includes(item) ? list.filter((i) => i !== item) : [...list, item]
    );
  }

  return (
    <div className="p-8 max-w-3xl">
      <Link
        href="/admin/exercises"
        className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-1" />
        Înapoi la exerciții
      </Link>

      <Card>
        <CardHeader>
          <CardTitle>Adaugă exercițiu nou</CardTitle>
          <CardDescription>
            Creează un exercițiu nou cu video și detalii
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Titlu *</Label>
              <Input
                id="title"
                name="title"
                placeholder="ex: Rotație externă umăr"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descriere *</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Descrie exercițiul și beneficiile sale..."
                rows={3}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="videoUrl">URL Video *</Label>
              <Input
                id="videoUrl"
                name="videoUrl"
                type="url"
                placeholder="https://..."
                required
              />
              <p className="text-xs text-muted-foreground">
                Lipește un URL video de pe Supabase Storage, YouTube sau Vimeo
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="thumbnailUrl">URL miniatură</Label>
              <Input
                id="thumbnailUrl"
                name="thumbnailUrl"
                type="url"
                placeholder="https://..."
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Categorie *</Label>
                <select
                  id="category"
                  name="category"
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
                  name="difficulty"
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
                  name="duration"
                  type="number"
                  min={0}
                  placeholder="ex: 60"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Părți ale corpului</Label>
              <div className="flex flex-wrap gap-2">
                {BODY_PARTS.map((part) => (
                  <Badge
                    key={part}
                    variant={bodyParts.includes(part) ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => toggleItem(part, bodyParts, setBodyParts)}
                  >
                    {part}
                    {bodyParts.includes(part) && (
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
                    variant={equipment.includes(item) ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => toggleItem(item, equipment, setEquipment)}
                  >
                    {item}
                    {equipment.includes(item) && (
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
                name="instructions"
                placeholder="Instrucțiuni pas cu pas..."
                rows={4}
              />
            </div>

            {error && <p className="text-sm text-destructive">{error}</p>}

            <div className="flex gap-3">
              <Button type="submit" disabled={loading}>
                {loading ? "Se creează..." : "Creează exercițiu"}
              </Button>
              <Link href="/admin/exercises">
                <Button variant="outline">Anulează</Button>
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
